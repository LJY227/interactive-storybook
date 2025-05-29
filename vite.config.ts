import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // GitHub Pages部署配置
  base: process.env.NODE_ENV === 'production' ? '/interactive-storybook/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "5174-ivezwj4mi8cfqj5srehln-fa821dfd.manusvm.computer",
      "localhost",
      ".manusvm.computer"
    ],
    proxy: {
      // 代理LiblibAI API请求以解决CORS问题
      '/api/liblib': {
        target: 'https://openapi.liblibai.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/liblib/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    // 确保静态资源可以被外部访问
    host: '0.0.0.0',
    // 允许外部访问静态资源
    cors: true
  }
})
