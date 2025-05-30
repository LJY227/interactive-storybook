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
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/liblib/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.method, req.url);
            // 确保正确的请求头
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');

            // 如果是POST请求，确保Content-Type正确
            if (req.method === 'POST') {
              proxyReq.setHeader('Content-Type', 'application/json');
              console.log('📤 POST请求，设置Content-Type为application/json');
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', proxyRes.statusCode, req.url);
            // 添加CORS头
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
