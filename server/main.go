package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

const (
	formatJSON = "json"
	formatText = "text"
)

type config struct {
	staticDir string
	addr      string
	logFormat string
	logLevel  string
}

func parseFlags() config {
	var c config
	flag.StringVar(&c.staticDir, "static", "../client/dist", "directory with static files to serve")
	flag.StringVar(&c.addr, "addr", ":8080", "address to listen on")
	flag.StringVar(&c.logFormat, "log-format", formatJSON, "log format: json or text")
	flag.StringVar(&c.logLevel, "log-level", "info", "log level: debug, info, warn or error")
	flag.Parse()
	return c
}

func newRouter(staticDir string, logger *slog.Logger) http.Handler {
	r := chi.NewRouter()
	r.Use(requestLogger(logger))
	r.Use(middleware.Recoverer)

	r.NotFound(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "404 page not found", http.StatusNotFound)
	})

	r.Get("/", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"hello world"}`))
	})

	r.Handle("/static/*", http.StripPrefix("/static/",
		http.FileServer(http.Dir(staticDir))))

	return r
}

func newServer(addr string, h http.Handler) *http.Server {
	return &http.Server{
		Addr:         addr,
		Handler:      h,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
}

func main() {
	cfg := parseFlags()

	logger, err := newLogger(cfg.logFormat, cfg.logLevel)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(2)
	}
	slog.SetDefault(logger)

	srv := newServer(cfg.addr, newRouter(cfg.staticDir, logger))

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	srvErr := make(chan error, 1)
	go func() {
		logger.Info("listening", "addr", cfg.addr)
		srvErr <- srv.ListenAndServe()
	}()

	select {
	case err := <-srvErr:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server failed", "err", err)
			os.Exit(1)
		}
	case <-ctx.Done():
		stop()
		logger.Info("shutting down")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			logger.Error("shutdown failed", "err", err)
			os.Exit(1)
		}
	}
}

func newLogger(format, level string) (*slog.Logger, error) {
	var lvl slog.Level
	if err := lvl.UnmarshalText([]byte(level)); err != nil {
		return nil, fmt.Errorf("invalid log level %q (want debug, info, warn or error)", level)
	}
	opts := &slog.HandlerOptions{Level: lvl}
	switch format {
	case formatJSON:
		return slog.New(slog.NewJSONHandler(os.Stderr, opts)), nil
	case formatText:
		return slog.New(slog.NewTextHandler(os.Stderr, opts)), nil
	default:
		return nil, fmt.Errorf("invalid log format %q (want json or text)", format)
	}
}

func requestLogger(l *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			start := time.Now()
			defer func() {
				level := slog.LevelInfo
				if ww.Status() >= http.StatusInternalServerError {
					level = slog.LevelError
				}

				l.LogAttrs(r.Context(), level, "request",
					slog.String("method", r.Method),
					slog.String("path", r.URL.Path),
					slog.Int("status", ww.Status()),
					slog.Int("bytes", ww.BytesWritten()),
					slog.Int64("duration_ms", time.Since(start).Milliseconds()),
					slog.String("remote", r.RemoteAddr),
				)
			}()

			next.ServeHTTP(ww, r)
		})
	}
}
