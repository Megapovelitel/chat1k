import type { ViteUserConfig } from 'vitest/config'

const config: ViteUserConfig['test'] = {
    environment: 'jsdom',
    globals: true,
    setupFiles: './.vitest/setup-tests.ts',
    typecheck: {
        enabled: true,
        allowJs: false,
        checker: 'tsc',
        ignoreSourceErrors: false
    }
}

export default config
