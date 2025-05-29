# 部署指南

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问应用：
打开浏览器访问 `http://localhost:5173`

## 生产构建

1. 构建应用：
```bash
npm run build
```

2. 预览构建结果：
```bash
npm run preview
```

## 环境配置

### OpenAI API 密钥设置

有两种方式设置 OpenAI API 密钥：

#### 方式1：环境变量（推荐）
1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 文件中设置：
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

#### 方式2：应用内设置
1. 启动应用后，在介绍页面点击"设置OpenAI API密钥"
2. 输入您的API密钥
3. 密钥将安全存储在浏览器本地存储中

### 图片资源

应用需要以下图片文件（位于 `public/` 目录）：
- `page1.png` - 第1页插图
- `page2.png` - 第2页插图
- `page3.png` - 第3页插图
- `page5.png` - 第5页插图
- `page6.png` - 第6页插图
- `page7.png` - 第7页插图
- `page9.png` - 第9页插图
- `page10.png` - 第10页插图
- `page12.png` - 第12页插图

建议图片规格：
- 尺寸：1024x768 或 800x600
- 格式：PNG 或 JPG
- 风格：温暖友好的儿童插画

## 部署到生产环境

### Vercel 部署

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录并部署：
```bash
vercel
```

3. 设置环境变量：
在 Vercel 控制台中设置 `VITE_OPENAI_API_KEY`

### Netlify 部署

1. 构建应用：
```bash
npm run build
```

2. 将 `dist` 目录上传到 Netlify

3. 设置环境变量：
在 Netlify 控制台中设置 `VITE_OPENAI_API_KEY`

### 其他静态托管服务

应用是一个纯前端应用，可以部署到任何静态托管服务：
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront
- 阿里云 OSS
- 腾讯云 COS

## 注意事项

1. **API 密钥安全**：
   - 生产环境中，建议通过环境变量设置 API 密钥
   - 不要将 API 密钥提交到版本控制系统

2. **浏览器兼容性**：
   - 需要支持 Web Speech API 的现代浏览器
   - 推荐使用 Chrome、Firefox、Safari 最新版本

3. **网络要求**：
   - 需要访问 OpenAI API（api.openai.com）
   - 确保网络环境允许 HTTPS 请求

4. **性能优化**：
   - 图片文件建议压缩优化
   - 可以使用 CDN 加速静态资源加载
