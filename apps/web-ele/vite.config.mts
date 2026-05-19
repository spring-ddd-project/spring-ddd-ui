import type { PluginOption } from 'vite';

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

/**
 * 修复 sass 1.77+ 与 Vite 的兼容性问题：
 * 清除共享配置中不合法的 NodePackageImporter，避免编译报错。
 */
function fixSassImporterPlugin(): PluginOption {
  return {
    name: 'fix-sass-importer',
    enforce: 'pre',
    config(config) {
      const scss = config.css?.preprocessorOptions?.scss;
      if (scss) {
        // @ts-expect-error 删除共享配置传入的不兼容 importer
        delete scss.importers;
        // @ts-expect-error 删除 modern api 设置，回退到默认行为
        delete scss.api;
      }
    },
  };
}

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        fixSassImporterPlugin(),
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:8080/',
            ws: true,
          },
        },
      },
    },
  };
});
