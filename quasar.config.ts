import { defineConfig } from '#q-app';

export default defineConfig((ctx) => {
  return {
    boot: ['i18n'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons'],

    build: {
      typescript: {
        strict: true,
        vueShim: true,
      },

      filenameBasedRouting: true,

      vueRouterMode: 'hash',

      vitePlugins: [
        [
          '@intlify/unplugin-vue-i18n/vite',
          {
            ssr: ctx.mode.ssr || ctx.mode.ssg,
            include: [ctx.appPaths.resolve.app('src/i18n')],
          },
        ],
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          {
            server: false,
          },
        ],
      ],
    },

    devServer: {
      open: true,
    },

    framework: {
      plugins: [],
    },

    animations: [],
  };
});
