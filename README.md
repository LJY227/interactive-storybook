<<<<<<< HEAD
# 小熊波波的友谊冒险 - 自闭症儿童交互绘本

这是一个专为6-8岁自闭症儿童设计的交互式数字绘本应用，通过小熊波波的友谊故事，帮助孩子学习社交技能和情感表达。

## 🌟 项目特色

- **专业设计**：基于自闭症儿童的认知特点和学习需求
- **AI驱动**：集成OpenAI GPT-4o，提供个性化内容生成
- **多模态交互**：支持语音朗读、语音输入和文字输入
- **智能评估**：四维度能力评估（语言词汇量、思维逻辑、社会适应、情感识别）
- **个性化插画**：根据用户回答动态生成专属插画
- **无障碍设计**：友好的用户界面和清晰的操作流程

## 🚀 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **AI服务**：LIBLIB AI，OpenAI GPT-4
- **语音功能**：Web Speech API
- **状态管理**：React Hooks

## 📦 安装和运行

### 环境要求

- Node.js 16.0 或更高版本
- npm、yarn 或 pnpm 包管理器
- 现代浏览器（支持Web Speech API）

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，设置你的 OpenAI API 密钥：
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build

# 使用 pnpm
pnpm build
```

## 🎯 功能介绍

### 核心功能

1. **交互式绘本阅读**
   - 12页完整故事内容
   - 3个交互环节（第4、8、11页）
   - 自动语音朗读
   - 30秒智能引导

2. **AI内容生成**
   - 动态故事生成
   - 个性化插画创作
   - 智能问题设计
   - 风格一致性保证

3. **多维度评估**
   - 语言词汇量分析
   - 思维逻辑评估
   - 社会适应能力
   - 情感识别能力

4. **无障碍体验**
   - 语音朗读支持
   - 语音输入功能
   - 大字体显示
   - 高对比度设计

### 故事内容

**主题**：友谊
**主角**：小熊波波
**核心价值**：学习如何交朋友、理解友谊的意义

故事通过波波从害羞到主动交友的成长过程，帮助自闭症儿童：
- 学习基本社交技能
- 理解情感表达
- 培养共情能力
- 建立自信心

## 🔧 项目结构

```
src/
├── components/          # React组件
│   ├── ui/             # 基础UI组件
│   ├── StoryContainer.tsx  # 故事容器组件
│   └── StoryPage.tsx   # 故事页面组件
├── data/               # 数据文件
│   └── storyData.ts    # 故事数据
├── services/           # 服务层
│   ├── liblibService.js    # LIBLIB AI API服务
│   ├── apiKeyManager.js    # API密钥管理
│   ├── promptTemplates.js  # 提示词模板
│   └── illustrationGenerator.js  # 插画生成
├── lib/                # 工具函数
│   └── utils.ts        # 通用工具
└── App.tsx             # 主应用组件
```

## 🎨 设计理念

### 自闭症友好设计

1. **视觉设计**
   - 使用温暖、柔和的色彩
   - 简洁清晰的界面布局
   - 避免过多的视觉干扰

2. **交互设计**
   - 明确的操作指引
   - 一致的交互模式
   - 充足的反馈时间

3. **内容设计**
   - 具体而非抽象的语言
   - 明确的因果关系
   - 结构化的故事情节

## 🤖 AI功能详解

### LIBLIB AI集成

1. **智能插画生成**
   - 基于用户回答内容生成个性化插画
   - 使用LIBLIB AI确保图像质量
   - 维持风格一致性
   - 支持文生图和图生图功能

2. **风格一致性保持**
   - 自动分析现有插画风格
   - 确保新生成插画与绘本整体风格统一
   - 专为自闭症儿童优化的视觉设计

## 🎨 插画特色

### 专为自闭症儿童设计

1. **视觉友好**
   - 温暖柔和的色彩搭配
   - 简洁清晰的线条和形状
   - 避免过于复杂的背景

2. **情感表达清晰**
   - 角色表情明确易识别
   - 情感状态一目了然
   - 避免模糊或抽象的表达

3. **风格一致性**
   - 水彩画风格统一
   - 角色设计保持连贯
   - 色调和光影处理一致

## 🔒 隐私和安全

- 所有用户数据仅存储在本地浏览器中
- LIBLIB AI API密钥采用安全的存储方式
- 不收集或上传个人敏感信息
- 遵循儿童隐私保护最佳实践

## 🤝 贡献指南

欢迎为项目贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 项目Issues：[GitHub Issues](https://github.com/your-repo/issues)
- 邮箱：your-email@example.com

## 🙏 致谢

感谢所有为自闭症儿童教育事业做出贡献的专家、开发者和志愿者。

---

**注意**：本项目仅供教育和研究目的使用，不能替代专业的医疗诊断和治疗。
=======
# interactive-storybook
《小熊波波的友谊冒险》
>>>>>>> d14e856139ea8833b828ff9afdedcd158e61741d
