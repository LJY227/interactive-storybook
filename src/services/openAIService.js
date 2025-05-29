// OpenAI API服务实现
// 用于调用GPT-4o模型生成故事和图片

import apiKeyManager from './apiKeyManager.js';
import { 
  STORY_PROMPT_TEMPLATE, 
  IMAGE_PROMPT_TEMPLATE,
  INTERACTIVE_QUESTION_PROMPT_TEMPLATE,
  PERFORMANCE_ANALYSIS_PROMPT_TEMPLATE 
} from './promptTemplates.js';

class OpenAIService {
  constructor() {
    this.baseUrl = 'https://api.openai.com/v1';
    this.modelName = 'gpt-4o';
    this.imageModelName = 'dall-e-3';
  }

  // 获取请求头
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKeyManager.getApiKey()}`
    };
  }

  // 生成故事内容
  async generateStory(ageRange, theme) {
    try {
      if (!apiKeyManager.isInitialized()) {
        throw new Error('API密钥未初始化');
      }

      const prompt = STORY_PROMPT_TEMPLATE
        .replace('{age_range}', ageRange)
        .replace('{theme}', theme);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            { role: 'system', content: '你是一位专业的儿童绘本作家，擅长为自闭症儿童创作故事。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API错误: ${error.error?.message || '未知错误'}`);
      }

      const data = await response.json();
      const storyContent = data.choices[0].message.content;
      
      // 尝试解析JSON格式的故事内容
      try {
        return JSON.parse(storyContent);
      } catch (e) {
        console.error('故事内容解析失败，返回原始文本', e);
        return { raw: storyContent };
      }
    } catch (error) {
      console.error('生成故事失败:', error);
      throw error;
    }
  }

  // 生成图片
  async generateImage(sceneDescription, ageRange) {
    try {
      if (!apiKeyManager.isInitialized()) {
        throw new Error('API密钥未初始化');
      }

      const prompt = IMAGE_PROMPT_TEMPLATE
        .replace('{scene_description}', sceneDescription)
        .replace('{age_range}', ageRange);

      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.imageModelName,
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API错误: ${error.error?.message || '未知错误'}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('生成图片失败:', error);
      throw error;
    }
  }

  // 生成交互问题
  async generateInteractiveQuestion(ageRange, theme, storyContext, context) {
    try {
      if (!apiKeyManager.isInitialized()) {
        throw new Error('API密钥未初始化');
      }

      const prompt = INTERACTIVE_QUESTION_PROMPT_TEMPLATE
        .replace('{age_range}', ageRange)
        .replace('{theme}', theme)
        .replace('{story_context}', storyContext)
        .replace('{context}', context);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            { role: 'system', content: '你是一位专业的儿童教育专家，擅长设计适合自闭症儿童的互动问题。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API错误: ${error.error?.message || '未知错误'}`);
      }

      const data = await response.json();
      const questionContent = data.choices[0].message.content;
      
      // 尝试解析JSON格式的问题内容
      try {
        return JSON.parse(questionContent);
      } catch (e) {
        console.error('问题内容解析失败，返回原始文本', e);
        return { 
          question: questionContent,
          guidance_prompt: '请尝试回答问题，如果不确定，可以描述你的想法。'
        };
      }
    } catch (error) {
      console.error('生成交互问题失败:', error);
      throw error;
    }
  }

  // 分析用户表现
  async analyzePerformance(questions, answers) {
    try {
      if (!apiKeyManager.isInitialized()) {
        throw new Error('API密钥未初始化');
      }

      if (questions.length !== answers.length || questions.length === 0) {
        throw new Error('问题和回答数量不匹配或为空');
      }

      let prompt = PERFORMANCE_ANALYSIS_PROMPT_TEMPLATE;
      
      // 替换问题和回答
      for (let i = 0; i < questions.length; i++) {
        prompt = prompt
          .replace(`{question${i+1}}`, questions[i])
          .replace(`{answer${i+1}}`, answers[i]);
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            { role: 'system', content: '你是一位专业的儿童心理学家，擅长评估自闭症儿童的语言和社交能力。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API错误: ${error.error?.message || '未知错误'}`);
      }

      const data = await response.json();
      const analysisContent = data.choices[0].message.content;
      
      // 尝试解析JSON格式的分析内容
      try {
        return JSON.parse(analysisContent);
      } catch (e) {
        console.error('分析内容解析失败，返回原始文本', e);
        return { raw: analysisContent };
      }
    } catch (error) {
      console.error('分析用户表现失败:', error);
      throw error;
    }
  }

  // 初始化API密钥
  initializeApiKey(apiKey) {
    apiKeyManager.initialize(apiKey);
  }

  // 检查API密钥是否已初始化
  isApiKeyInitialized() {
    return apiKeyManager.isInitialized();
  }

  // 清除API密钥
  clearApiKey() {
    apiKeyManager.clear();
  }
}

// 创建单例实例
const openAIService = new OpenAIService();

// 导出单例实例
export default openAIService;
