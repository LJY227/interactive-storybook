# 🔧 脚本文件目录

这里存放所有项目相关的脚本文件。

## 📋 脚本列表

### 部署脚本
- `deploy.sh` - Linux/Mac 部署脚本
- `deploy.bat` - Windows 部署脚本
- `organize-project.js` - 项目文件整理脚本

### 设置脚本
- `setup-https.sh` - Linux/Mac HTTPS证书设置
- `setup-https.ps1` - Windows HTTPS证书设置

### 测试脚本
- `test-*.js` - 各种功能测试脚本
- `test-*.html` - 浏览器测试页面

## 🚀 使用方法

### 部署项目
```bash
# Linux/Mac
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Windows
scripts\deploy.bat
```

### 设置HTTPS
```bash
# Linux/Mac
chmod +x scripts/setup-https.sh
./scripts/setup-https.sh

# Windows
powershell -ExecutionPolicy Bypass -File scripts/setup-https.ps1
```

### 整理项目文件
```bash
node scripts/organize-project.js
```

## ⚠️ 注意事项

1. 运行脚本前请确保已安装必要的依赖
2. Windows用户可能需要以管理员权限运行某些脚本
3. 部署脚本会自动检查环境并提供指导
4. 测试脚本仅用于开发环境，不要在生产环境运行
