import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })


export default  defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'next-vue-storage-watcher',
      fileName: (format) => `next-vue-storage-watcher.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})