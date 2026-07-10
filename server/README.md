# chat1k server

HTTP-сервер, отдающий статические файлы клиента. Текущая версия умеет:

- Обслуживать статику из каталога `../client/dist/*` по префиксу `/static/*`.
- Отвечать `404` на неизвестные пути.
- Корректно завершаться (graceful shutdown, до 10 с) по `SIGINT`/`SIGTERM`.

## Параметры

| Флаг | По умолчанию | Описание |
| ------ | -------------- | ---------- |
| `-static` | `../client/dist` | каталог со статикой |
| `-addr` | `:8080` | адрес прослушивания |
| `-log-format` | `json` | формат логов: `json` или `text` |
| `-log-level` | `info` | уровень: `debug`, `info`, `warn`, `error` |

## Запуск

```sh
make run                       # build + запуск с -static=../client/dist
# или напрямую:
go run . -addr=:8080 -static=../client/dist -log-format=text -log-level=debug
```

Сборка бинарника:

```sh
make build                     # -> bin/server
```

## Тестирование

```sh
make test                      # go test ./...
make lint                      # golangci-lint (make install-linter при первом запуске)
```
