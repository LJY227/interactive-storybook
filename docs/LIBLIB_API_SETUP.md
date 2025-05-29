# LIBLIB AI API 配置指南

本项目使用LIBLIB AI平台进行图片生成。本文档将指导您如何配置和使用LIBLIB AI API。

## 🔧 配置步骤

### 1. 获取LIBLIB AI API密钥

1. 访问 [LIBLIB AI官网](https://www.liblib.art/)
2. 注册账号并登录
3. 进入API开放平台页面
4. 申请API密钥，您将获得两个密钥：
   - **AccessKey**: API访问凭证（20-30位）
   - **SecretKey**: API访问密钥（30位以上）

### 2. 配置环境变量

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中设置您的API密钥：
   ```env
   # LIBLIB AI API 配置（用于图片生成）
   VITE_LIBLIB_ACCESS_KEY=your_liblib_access_key_here
   VITE_LIBLIB_SECRET_KEY=your_liblib_secret_key_here
   ```

### 3. 验证配置

运行测试脚本验证LIBLIB AI API配置：

```javascript
import { runAllTests } from './src/services/liblibServiceTest.js';

// 运行完整测试
await runAllTests();

// 或运行快速测试
import { quickTest } from './src/services/liblibServiceTest.js';
await quickTest();
```

## 📋 API规范说明

### LIBLIB AI API基础信息

- **API基础URL**: `https://openapi.liblibai.cloud`
- **文生图接口**: `POST /api/generate/webui/text2img/ultra`
- **图生图接口**: `POST /api/generate/webui/img2img/ultra`
- **查询结果接口**: `GET /api/generate/query`

### 认证方式

LIBLIB AI使用HMAC-SHA1签名认证：

1. **请求头设置**：
   ```javascript
   {
     "Content-Type": "application/json",
     "AccessKey": "您的AccessKey",
     "Signature": "生成的签名",
     "Timestamp": "毫秒时间戳",
     "SignatureNonce": "随机字符串"
   }
   ```

2. **签名生成**：
   ```
   原文 = URI地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
   密文 = hmacSha1(原文, SecretKey)
   签名 = base64UrlEncode(密文).rstrip('=')
   ```

### 请求参数

**文生图请求体**：
```javascript
{
  "templateUuid": "5d7e67009b344550bc1aa6ccbfa1d7f4",  // 星流Star-3 Alpha模板ID
  "generateParams": {
    "prompt": "英文提示词（不超过2000字符）"
  }
}
```

**图生图请求体**：
```javascript
{
  "templateUuid": "5d7e67009b344550bc1aa6ccbfa1d7f4",
  "generateParams": {
    "prompt": "英文提示词",
    "init_images": ["参考图片URL"]
  }
}
```

### 响应格式

**提交任务响应**：
```javascript
{
  "generateUuid": "生成任务的UUID"
}
```

**查询结果响应**：
```javascript
{
  "status": "success|failed|processing",
  "imageUrl": "生成的图片URL",
  "message": "状态信息"
}
```

## 🔄 代码变更说明

### 主要文件

1. **核心文件**：
   - `src/services/liblibService.js` - LIBLIB AI API服务
   - `src/services/apiConfig.js` - API配置管理
   - `src/services/liblibServiceTest.js` - 测试文件
   - `src/services/illustrationGenerator.js` - 插画生成器
   - `src/services/apiKeyManager.js` - API密钥管理

### 服务架构

```
图片生成 → LIBLIB AI Platform
```

## 🚨 注意事项

### API兼容性

1. **提示词格式**：LIBLIB可能对提示词格式有特定要求
2. **参数调整**：根据实际API文档调整请求参数
3. **响应解析**：根据实际响应格式调整解析逻辑

### 错误处理

项目包含完整的错误处理机制：

- API密钥验证
- 网络请求错误处理
- 响应格式验证
- 用户友好的错误提示

### 性能优化

- 图片缓存机制
- 请求重试逻辑
- 风格一致性保持

## 🔍 故障排除

### 常见问题

1. **API密钥无效**
   - 检查密钥格式是否正确
   - 确认密钥是否已激活
   - 验证账户余额

2. **网络连接问题**
   - 检查网络连接
   - 确认API端点URL正确
   - 检查防火墙设置

3. **图片生成失败**
   - 检查提示词是否符合要求
   - 验证参数设置
   - 查看API使用限制

### 调试方法

1. 启用控制台日志：
   ```javascript
   console.log('LIBLIB API调用详情');
   ```

2. 使用测试脚本：
   ```javascript
   import liblibTest from './src/services/liblibServiceTest.js';
   await liblibTest.runAllTests();
   ```

3. 检查网络请求：
   - 打开浏览器开发者工具
   - 查看Network标签页
   - 检查API请求和响应

## 📞 技术支持

如果遇到问题，请：

1. 查看LIBLIB官方API文档
2. 检查项目的GitHub Issues
3. 联系LIBLIB技术支持

---

**注意**：本配置基于LIBLIB AI官方API文档实现。如有更新请参考官方文档进行调整。
