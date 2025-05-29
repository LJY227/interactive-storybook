// 集成OpenAI服务到应用中
// 用于在用户界面中使用GPT-4o生成故事和图片

import React, { useState, useEffect } from 'react';
import openAIService from './openAIService.js';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { Alert } from '../components/ui/alert';

// 故事生成组件
export function StoryGenerator({ onStoryGenerated, ageRange, theme }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // 检查API密钥是否已设置
  useEffect(() => {
    setApiKeySet(openAIService.isApiKeyInitialized());
  }, []);

  // 设置API密钥
  const setApiKey = (apiKey) => {
    try {
      openAIService.initializeApiKey(apiKey);
      setApiKeySet(true);
      setError(null);
    } catch (err) {
      setError('API密钥设置失败: ' + err.message);
      setApiKeySet(false);
    }
  };

  // 生成故事
  const generateStory = async () => {
    if (!apiKeySet) {
      setError('请先设置API密钥');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const story = await openAIService.generateStory(ageRange, theme);
      onStoryGenerated(story);
    } catch (err) {
      setError('故事生成失败: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKeySet && (
        <Alert variant="warning">
          <p>请设置OpenAI API密钥以启用故事生成功能</p>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={generateStory}
          disabled={isGenerating || !apiKeySet}
        >
          {isGenerating ? (
            <>
              <Spinner className="mr-2" />
              生成故事中...
            </>
          ) : '生成新故事'}
        </Button>

        {!apiKeySet && (
          <Button
            variant="outline"
            onClick={() => setApiKey(prompt('请输入OpenAI API密钥'))}
          >
            设置API密钥
          </Button>
        )}
      </div>
    </div>
  );
}

// 图片生成组件
export function ImageGenerator({ onImageGenerated, sceneDescription, ageRange }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // 检查API密钥是否已设置
  useEffect(() => {
    setApiKeySet(openAIService.isApiKeyInitialized());
  }, []);

  // 设置API密钥
  const setApiKey = (apiKey) => {
    try {
      openAIService.initializeApiKey(apiKey);
      setApiKeySet(true);
      setError(null);
    } catch (err) {
      setError('API密钥设置失败: ' + err.message);
      setApiKeySet(false);
    }
  };

  // 生成图片
  const generateImage = async () => {
    if (!apiKeySet) {
      setError('请先设置API密钥');
      return;
    }

    if (!sceneDescription) {
      setError('请提供场景描述');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await openAIService.generateImage(sceneDescription, ageRange);
      onImageGenerated(imageUrl);
    } catch (err) {
      setError('图片生成失败: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKeySet && (
        <Alert variant="warning">
          <p>请设置OpenAI API密钥以启用图片生成功能</p>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={generateImage}
          disabled={isGenerating || !apiKeySet || !sceneDescription}
        >
          {isGenerating ? (
            <>
              <Spinner className="mr-2" />
              生成图片中...
            </>
          ) : '生成插图'}
        </Button>

        {!apiKeySet && (
          <Button
            variant="outline"
            onClick={() => setApiKey(prompt('请输入OpenAI API密钥'))}
          >
            设置API密钥
          </Button>
        )}
      </div>
    </div>
  );
}

// 交互问题生成组件
export function InteractiveQuestionGenerator({
  onQuestionGenerated,
  ageRange,
  theme,
  storyContext,
  context
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // 检查API密钥是否已设置
  useEffect(() => {
    setApiKeySet(openAIService.isApiKeyInitialized());
  }, []);

  // 设置API密钥
  const setApiKey = (apiKey) => {
    try {
      openAIService.initializeApiKey(apiKey);
      setApiKeySet(true);
      setError(null);
    } catch (err) {
      setError('API密钥设置失败: ' + err.message);
      setApiKeySet(false);
    }
  };

  // 生成交互问题
  const generateQuestion = async () => {
    if (!apiKeySet) {
      setError('请先设置API密钥');
      return;
    }

    if (!storyContext || !context) {
      setError('请提供故事上下文和问题场景');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const question = await openAIService.generateInteractiveQuestion(
        ageRange,
        theme,
        storyContext,
        context
      );
      onQuestionGenerated(question);
    } catch (err) {
      setError('交互问题生成失败: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKeySet && (
        <Alert variant="warning">
          <p>请设置OpenAI API密钥以启用交互问题生成功能</p>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={generateQuestion}
          disabled={isGenerating || !apiKeySet || !storyContext || !context}
        >
          {isGenerating ? (
            <>
              <Spinner className="mr-2" />
              生成问题中...
            </>
          ) : '生成交互问题'}
        </Button>

        {!apiKeySet && (
          <Button
            variant="outline"
            onClick={() => setApiKey(prompt('请输入OpenAI API密钥'))}
          >
            设置API密钥
          </Button>
        )}
      </div>
    </div>
  );
}

// 性能分析组件
export function PerformanceAnalyzer({
  onAnalysisComplete,
  questions,
  answers
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // 检查API密钥是否已设置
  useEffect(() => {
    setApiKeySet(openAIService.isApiKeyInitialized());
  }, []);

  // 设置API密钥
  const setApiKey = (apiKey) => {
    try {
      openAIService.initializeApiKey(apiKey);
      setApiKeySet(true);
      setError(null);
    } catch (err) {
      setError('API密钥设置失败: ' + err.message);
      setApiKeySet(false);
    }
  };

  // 分析性能
  const analyzePerformance = async () => {
    if (!apiKeySet) {
      setError('请先设置API密钥');
      return;
    }

    if (!questions || !answers || questions.length === 0 || answers.length === 0) {
      setError('请提供问题和回答');
      return;
    }

    if (questions.length !== answers.length) {
      setError('问题和回答数量不匹配');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await openAIService.analyzePerformance(questions, answers);
      onAnalysisComplete(analysis);
    } catch (err) {
      setError('性能分析失败: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKeySet && (
        <Alert variant="warning">
          <p>请设置OpenAI API密钥以启用性能分析功能</p>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={analyzePerformance}
          disabled={
            isAnalyzing ||
            !apiKeySet ||
            !questions ||
            !answers ||
            questions.length === 0 ||
            answers.length === 0 ||
            questions.length !== answers.length
          }
        >
          {isAnalyzing ? (
            <>
              <Spinner className="mr-2" />
              分析中...
            </>
          ) : '分析表现'}
        </Button>

        {!apiKeySet && (
          <Button
            variant="outline"
            onClick={() => setApiKey(prompt('请输入OpenAI API密钥'))}
          >
            设置API密钥
          </Button>
        )}
      </div>
    </div>
  );
}

// 初始化API密钥
export function initializeOpenAI(apiKey) {
  try {
    openAIService.initializeApiKey(apiKey);
    return true;
  } catch (error) {
    console.error('初始化OpenAI API密钥失败:', error);
    return false;
  }
}

// 清除API密钥
export function clearOpenAI() {
  try {
    openAIService.clearApiKey();
    return true;
  } catch (error) {
    console.error('清除OpenAI API密钥失败:', error);
    return false;
  }
}