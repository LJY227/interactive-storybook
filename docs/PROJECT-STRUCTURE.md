# 📁 项目文件结构

```
interactive-storybook/
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── 📁 docs/                    # 📚 项目文档
│   ├── deployment-guide.md     # 部署指南
│   ├── DEPLOYMENT-README.md    # 部署说明
│   ├── DEPLOYMENT-CHECKLIST.md # 部署检查清单
│   ├── PROJECT-STRUCTURE.md    # 项目结构说明（本文件）
│   └── README.md               # 文档目录
├── 📁 public/                  # 🌐 公共资源
│   ├── 📁 images/              # 🖼️ 图片资源
│   │   ├── page1.png           # 故事页面插图
│   │   ├── page2.png
│   │   └── ...
│   └── vite.svg                # 网站图标
├── 📁 scripts/                 # 🔧 脚本文件
│   ├── deploy.sh               # Linux/Mac 部署脚本
│   ├── deploy.bat              # Windows 部署脚本
│   ├── setup-https.sh          # Linux/Mac HTTPS 设置脚本
│   ├── setup-https.ps1         # Windows HTTPS 设置脚本
│   ├── organize-project.js     # 项目文件整理脚本
│   └── README.md               # 脚本使用说明
├── 📁 src/                     # 💻 源代码
│   ├── 📁 components/          # 🧩 React 组件
│   │   ├── 📁 ui/              # 基础 UI 组件
│   │   │   ├── alert.tsx       # 警告组件
│   │   │   ├── button.tsx      # 按钮组件
│   │   │   ├── card.tsx        # 卡片组件
│   │   │   └── ...
│   │   ├── ApiInitializer.tsx  # API 初始化组件
│   │   ├── EnvironmentStatus.tsx # 环境状态组件
│   │   ├── StoryContainer.tsx  # 故事容器组件
│   │   └── StoryPage.tsx       # 故事页面组件
│   ├── 📁 data/                # 📊 数据文件
│   │   └── storyData.ts        # 故事数据
│   ├── 📁 services/            # 🔌 服务层
│   │   ├── liblibService.js    # LIBLIB AI 服务
│   │   ├── illustrationGenerator.js # 插画生成器
│   │   ├── apiKeyManager.js    # API 密钥管理
│   │   └── ...
│   ├── 📁 types/               # 📝 TypeScript 类型定义
│   │   └── illustrationGenerator.d.ts # 插画生成器类型
│   ├── 📁 utils/               # 🛠️ 工具函数
│   │   └── environmentDiagnostics.js # 环境诊断
│   ├── 📁 lib/                 # 📚 库文件
│   │   └── utils.ts            # 通用工具函数
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 应用入口
│   └── index.css               # 全局样式
├── 📁 temp/                    # 🗂️ 临时文件（不提交到 Git）
│   ├── temp_extract/           # 临时解压文件
│   ├── temp_interactive_updated/ # 临时更新文件
│   └── ...
├── .env.production             # 🔐 生产环境配置
├── .gitignore                  # 🚫 Git 忽略文件
├── package.json                # 📦 项目配置
├── README.md                   # 📖 项目说明
├── tailwind.config.js          # 🎨 Tailwind CSS 配置
├── tsconfig.json               # 📘 TypeScript 配置
└── vite.config.ts              # ⚡ Vite 构建配置
```

## 📂 文件夹说明

### 核心目录

- **docs/**: 存放所有项目文档，包括部署指南、API文档等
- **public/**: 静态资源文件，构建时会直接复制到输出目录
- **scripts/**: 各种脚本文件，包括部署、设置等自动化脚本
- **src/**: 源代码目录，包含所有 React 组件和业务逻辑
- **temp/**: 临时文件和开发过程中的测试文件（不会提交到 Git）

### 源代码结构

- **src/components/**: React 组件
  - `ui/`: 可复用的基础 UI 组件
  - `StoryContainer.tsx`: 故事容器，管理故事流程
  - `StoryPage.tsx`: 故事页面，处理用户交互
  - `EnvironmentStatus.tsx`: 环境兼容性检测组件

- **src/services/**: 业务逻辑服务
  - `liblibService.js`: LIBLIB AI 图片生成服务
  - `illustrationGenerator.js`: 插画生成逻辑
  - `apiKeyManager.js`: API 密钥管理

- **src/data/**: 数据文件
  - `storyData.ts`: 故事内容和结构数据

- **src/utils/**: 工具函数
  - `environmentDiagnostics.js`: 浏览器环境诊断

## 🎯 核心文件

### 应用入口
- **src/main.tsx**: 应用的主入口文件
- **src/App.tsx**: 主应用组件，包含路由和全局状态
- **index.html**: HTML 模板文件

### 配置文件
- **vite.config.ts**: Vite 构建配置，包含 HTTPS 和部署设置
- **tailwind.config.js**: Tailwind CSS 样式配置
- **tsconfig.json**: TypeScript 编译配置
- **package.json**: 项目依赖和脚本配置

### 部署相关
- **.github/workflows/deploy.yml**: GitHub Actions 自动部署配置
- **.env.production**: 生产环境变量配置
- **.gitignore**: Git 忽略文件配置

## 🔧 开发工作流

### 1. 本地开发
```bash
npm install          # 安装依赖
npm run dev         # 启动开发服务器
```

### 2. 构建测试
```bash
npm run build       # 构建生产版本
npm run preview     # 预览构建结果
```

### 3. 部署准备
```bash
scripts/deploy.sh   # 运行部署脚本（Linux/Mac）
scripts/deploy.bat  # 运行部署脚本（Windows）
```

## 📋 文件命名规范

### 组件文件
- React 组件：`PascalCase.tsx`
- 普通 JavaScript：`camelCase.js`
- 类型定义：`camelCase.d.ts`

### 目录命名
- 组件目录：`PascalCase/`
- 功能目录：`camelCase/`
- 资源目录：`kebab-case/`

### 文档文件
- 说明文档：`UPPERCASE.md`
- 指南文档：`kebab-case.md`

## 🚀 扩展指南

### 添加新组件
1. 在 `src/components/` 下创建组件文件
2. 如果是 UI 组件，放在 `src/components/ui/` 下
3. 添加相应的类型定义（如需要）

### 添加新服务
1. 在 `src/services/` 下创建服务文件
2. 导出服务类或函数
3. 在需要的组件中导入使用

### 添加新工具函数
1. 在 `src/utils/` 下创建工具文件
2. 导出纯函数
3. 添加 TypeScript 类型注解

### 添加新文档
1. 在 `docs/` 下创建 Markdown 文件
2. 更新 `docs/README.md` 中的文档列表
3. 确保文档格式一致

## 🔍 代码组织原则

### 单一职责
- 每个文件只负责一个功能
- 组件保持简单和可复用
- 服务类专注于特定业务逻辑

### 依赖管理
- 避免循环依赖
- 优先使用相对导入
- 将第三方库导入放在顶部

### 类型安全
- 为所有函数添加类型注解
- 使用 TypeScript 严格模式
- 定义清晰的接口和类型

## 📞 维护指南

### 定期清理
- 删除未使用的文件和依赖
- 整理临时文件到 `temp/` 目录
- 更新过时的文档

### 版本管理
- 遵循语义化版本控制
- 及时更新 CHANGELOG
- 标记重要的里程碑版本

### 性能优化
- 定期检查包大小
- 优化图片资源
- 使用代码分割和懒加载

---

这个项目结构设计旨在提供清晰的代码组织、便于维护和扩展。如有任何问题或建议，请参考相关文档或提交 Issue。
