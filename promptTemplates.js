// 为自闭症儿童语音交互绘本设计的提示词模板

// 故事生成提示词模板
const STORY_PROMPT_TEMPLATE = `
请为{age_range}岁的自闭症儿童创作一个以"{theme}"为主题的12页绘本故事。

要求：
1. 故事应该简单、清晰，使用具体而非抽象的语言
2. 每页内容控制在100-150字左右
3. 使用简单的句子结构和明确的因果关系
4. 避免使用隐喻、反语或复杂的修辞手法
5. 故事中应包含明确的情感表达和社交互动场景
6. 在故事中随机安排3个交互环节（第4页、第8页和第11页），这些页面需要设计问题
7. 交互问题应鼓励自闭症儿童进行语言表达，不是简单的选择题
8. 每个交互问题都需要配备一个引导提示，用于在儿童30秒内没有回答时提供帮助

输出格式：
{
  "title": "故事标题",
  "pages": [
    {
      "page_number": 1,
      "content": "第1页内容...",
      "is_interactive": false
    },
    {
      "page_number": 4,
      "content": "第4页内容...",
      "is_interactive": true,
      "interactive_question": "问题内容...",
      "guidance_prompt": "引导提示内容..."
    },
    // 其他页面...
  ]
}
`;

// 图片生成提示词模板
const IMAGE_PROMPT_TEMPLATE = `
为自闭症儿童绘本创作一张插图，描述以下场景：

"{scene_description}"

要求：
1. 使用明亮、柔和的色彩
2. 简洁清晰的线条和形状
3. 避免过于复杂或混乱的背景
4. 角色表情要明确、易于识别
5. 图像应具有温暖、友好的氛围
6. 适合{age_range}岁自闭症儿童的视觉感知特点
7. 风格应保持一致，类似儿童插画书
8. 避免使用过多的文字或抽象符号

图像应该能够直观地表达场景内容，帮助自闭症儿童理解故事情节。
`;

// 交互问题生成提示词模板
const INTERACTIVE_QUESTION_PROMPT_TEMPLATE = `
为{age_range}岁自闭症儿童设计一个关于"{context}"的交互问题。

故事背景：
"{story_context}"

要求：
1. 问题应促进语言表达，而非简单的是/否回答
2. 问题应与故事情节和主题"{theme}"相关
3. 问题应考虑自闭症儿童的认知特点
4. 问题应鼓励分享个人经历或想法
5. 问题应有明确的焦点，避免模糊或抽象
6. 同时设计一个引导提示，用于在儿童30秒内没有回答时提供帮助

输出格式：
{
  "question": "问题内容...",
  "guidance_prompt": "引导提示内容..."
}
`;

// 性能评估提示词模板
const PERFORMANCE_ANALYSIS_PROMPT_TEMPLATE = `
分析自闭症儿童在以下交互问题中的回答表现：

问题1："{question1}"
回答1："{answer1}"

问题2："{question2}"
回答2："{answer2}"

问题3："{question3}"
回答3："{answer3}"

请从以下四个维度进行评估（满分5分）：
1. 语言词汇量：评估词汇丰富度、表达多样性
2. 思维逻辑：评估因果关系理解、逻辑推理能力
3. 社会适应：评估社交规则理解、人际互动意识
4. 情感识别：评估情感表达、共情能力

对于每个维度，请提供具体分析和改进建议。

输出格式：
{
  "scores": {
    "language_vocabulary": 分数,
    "logical_thinking": 分数,
    "social_adaptation": 分数,
    "emotional_recognition": 分数
  },
  "analysis": {
    "language_vocabulary": "分析和建议...",
    "logical_thinking": "分析和建议...",
    "social_adaptation": "分析和建议...",
    "emotional_recognition": "分析和建议..."
  },
  "overall_recommendation": "综合建议..."
}
`;

export {
  STORY_PROMPT_TEMPLATE,
  IMAGE_PROMPT_TEMPLATE,
  INTERACTIVE_QUESTION_PROMPT_TEMPLATE,
  PERFORMANCE_ANALYSIS_PROMPT_TEMPLATE
};
