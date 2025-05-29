// 交互式绘本主容器组件
// 使用LIBLIB AI进行图片生成

import { useState, useEffect } from 'react';
import storyData from '../data/storyData';
import { StoryPage } from './StoryPage';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import liblibService from '../services/liblibService';
import '../services/liblibServiceDebug.js'; // 导入调试工具
import { clearAllImageCache, clearOldSessionCache } from '../services/illustrationGenerator';

interface UserResponse {
  pageId: number;
  response: string;
}

export function StoryContainer() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);

  const totalPages = storyData.pages.length;
  const progress = ((currentPageIndex + 1) / totalPages) * 100;
  const currentPage = storyData.pages[currentPageIndex];

  // 初始化API密钥
  useEffect(() => {
    // 检查是否需要清除缓存（只在新会话开始时清除）
    const lastSessionTime = localStorage.getItem('last_session_time');
    const currentTime = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30分钟会话超时

    if (!lastSessionTime || (currentTime - parseInt(lastSessionTime)) > sessionTimeout) {
      console.log('🧹 检测到新会话或会话超时，清除旧的图片缓存...');
      clearAllImageCache();
      localStorage.setItem('last_session_time', currentTime.toString());
      console.log('✅ 已清除旧的图片缓存');
    } else {
      console.log('🔄 继续当前会话，清理过期缓存...');
      // 清理超过30分钟的旧缓存，但保留当前会话的缓存
      clearOldSessionCache();
    }

    // 初始化LiblibAI API密钥
    const liblibAccessKey = import.meta.env.VITE_LIBLIB_ACCESS_KEY;
    const liblibSecretKey = import.meta.env.VITE_LIBLIB_SECRET_KEY;

    if (liblibAccessKey && liblibSecretKey) {
      try {
        liblibService.initializeApiKeys(liblibAccessKey, liblibSecretKey);
        console.log('✅ LiblibAI API密钥初始化成功');
        console.log('🔑 AccessKey:', liblibAccessKey.substring(0, 10) + '...');

        // 设置默认参考图片URL为用户提供的page1.png
        const userProvidedImageUrl = 'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png';
        liblibService.setDefaultReferenceImageUrl(userProvidedImageUrl);
        console.log('🎯 设置默认参考图片URL:', userProvidedImageUrl);

        // 验证API状态
        const status = liblibService.getApiStatus();
        console.log('📊 LiblibAI API状态:', status);
      } catch (error) {
        console.error('❌ LiblibAI API密钥初始化失败:', error);
      }
    } else {
      console.warn('⚠️ LiblibAI API密钥未在环境变量中找到');
      console.log('请确保.env文件中包含:');
      console.log('VITE_LIBLIB_ACCESS_KEY=your_access_key');
      console.log('VITE_LIBLIB_SECRET_KEY=your_secret_key');
    }
  }, []);

  // 测试API连接
  const testApiConnection = async () => {
    try {
      console.log('🧪 开始测试API连接...');

      // 首先检查API密钥状态
      const isInitialized = liblibService.isApiKeyInitialized();
      console.log('API密钥初始化状态:', isInitialized);

      if (!isInitialized) {
        alert('❌ API密钥未初始化！\n\n请检查.env文件中的配置:\nVITE_LIBLIB_ACCESS_KEY\nVITE_LIBLIB_SECRET_KEY');
        return;
      }

      // 获取API密钥信息
      const apiKeys = liblibService.getApiKeys();
      console.log('API密钥信息:', {
        hasAccessKey: !!apiKeys.accessKey,
        hasSecretKey: !!apiKeys.secretKey,
        accessKeyLength: apiKeys.accessKey?.length,
        secretKeyLength: apiKeys.secretKey?.length,
        accessKeyPreview: apiKeys.accessKey?.substring(0, 10) + '...'
      });

      // 测试签名生成
      console.log('🔐 测试签名生成...');
      try {
        const testUri = '/api/generate/webui/img2img/ultra';
        const signatureResult = await liblibService.generateSignature(testUri);
        console.log('签名生成成功:', signatureResult);
      } catch (signError) {
        console.error('❌ 签名生成失败:', signError);
        alert('❌ 签名生成失败！\n\n错误信息:\n' + signError.message);
        return;
      }

      // 测试图生图功能
      console.log('🖼️ 测试图生图功能...');
      const testImageUrl = 'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/8e84eb22f8ddf40803db5ad75582ccb6bfe3312db9899156d3dbba31d4ccb90e.png';
      const testPrompt = 'a cute brown bear sitting in front of a wooden house in the forest, children illustration style';

      console.log('测试参数:', {
        imageUrl: testImageUrl,
        prompt: testPrompt,
        ageRange: '6-8岁'
      });

      const result = await liblibService.generateImageFromImage(
        testImageUrl,
        testPrompt,
        '6-8岁'
      );

      alert('✅ 图生图API测试成功！\n\n生成的图像URL:\n' + result);

    } catch (error) {
      console.error('❌ API测试失败:', error);
      console.error('错误堆栈:', error.stack);

      let errorMessage = '❌ API测试失败！\n\n';

      if (error.message.includes('Failed to fetch')) {
        errorMessage += '错误类型: 网络请求失败 (Failed to fetch)\n';
        errorMessage += '这通常表示:\n';
        errorMessage += '- 浏览器无法连接到API服务器\n';
        errorMessage += '- CORS跨域策略阻止了请求\n';
        errorMessage += '- 网络连接问题\n';
        errorMessage += '- API服务器不可达\n\n';
        errorMessage += '调试信息:\n';
        errorMessage += '- 请检查浏览器开发者工具的Network标签\n';
        errorMessage += '- 查看是否有CORS错误\n';
        errorMessage += '- 确认API服务器地址是否正确';
      } else if (error.message.includes('密钥')) {
        errorMessage += '错误类型: API密钥问题\n';
        errorMessage += '请检查.env文件中的API密钥配置';
      } else if (error.message.includes('签名')) {
        errorMessage += '错误类型: 签名生成问题\n';
        errorMessage += '可能是浏览器环境的加密API问题';
      } else {
        errorMessage += '错误信息: ' + error.message + '\n\n';
        errorMessage += '完整错误: ' + JSON.stringify(error, null, 2);
      }

      alert(errorMessage);
    }
  };



  const handleNext = () => {
    // 确保在翻页时停止当前页面的语音
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo(0, 0);
    } else {
      generateReport();
    }
  };

  const handlePrevious = () => {
    // 确保在翻页时停止当前页面的语音
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleResponseSubmit = (pageId: number, response: string) => {
    // 检查是否已有该页面的回答
    const existingResponseIndex = userResponses.findIndex(r => r.pageId === pageId);

    if (existingResponseIndex >= 0) {
      // 更新现有回答
      const updatedResponses = [...userResponses];
      updatedResponses[existingResponseIndex] = { pageId, response };
      setUserResponses(updatedResponses);
    } else {
      // 添加新回答
      setUserResponses([...userResponses, { pageId, response }]);
    }
  };

  const startStory = () => {
    setShowIntro(false);
  };

  const generateReport = () => {
    // 基于回答长度和关键词的简单分析
    const interactivePages = storyData.pages.filter(page => page.isInteractive);
    const completedInteractions = userResponses.length;

    // 初始化分数
    let languageScore = 0;
    let logicScore = 0;
    let socialScore = 0;
    let emotionalScore = 0;

    // 分析每个回答
    userResponses.forEach(response => {
      const text = response.response.toLowerCase();
      const words = text.split(/\s+/);
      const uniqueWords = new Set(words);

      // 语言词汇量：基于回答长度和多样性
      languageScore += Math.min(words.length / 5, 5) + Math.min(uniqueWords.size / 3, 5);

      // 逻辑思维：基于因果词汇
      const logicWords = ["因为", "所以", "如果", "但是", "然后", "接着", "首先", "其次", "最后"];
      const logicCount = logicWords.filter(word => text.includes(word)).length;
      logicScore += Math.min(logicCount * 2, 5);

      // 社会适应：基于社交互动词汇
      const socialWords = ["朋友", "一起", "帮助", "分享", "谢谢", "请", "对不起", "合作", "玩"];
      const socialCount = socialWords.filter(word => text.includes(word)).length;
      socialScore += Math.min(socialCount * 2, 5);

      // 情感识别：基于情感词汇
      const emotionWords = ["高兴", "难过", "害怕", "生气", "担心", "开心", "喜欢", "爱", "紧张", "兴奋"];
      const emotionCount = emotionWords.filter(word => text.includes(word)).length;
      emotionalScore += Math.min(emotionCount * 2, 5);
    });

    // 标准化分数
    const normalizeScore = (score: number) => {
      if (completedInteractions === 0) return 0;
      return Math.min(Math.round((score / completedInteractions) * 10) / 10, 5);
    };

    const report = {
      completedInteractions,
      totalInteractions: interactivePages.length,
      scores: {
        languageVocabulary: normalizeScore(languageScore),
        logicalThinking: normalizeScore(logicScore),
        socialAdaptation: normalizeScore(socialScore),
        emotionalRecognition: normalizeScore(emotionalScore)
      },
      recommendations: generateRecommendations(
        normalizeScore(languageScore),
        normalizeScore(logicScore),
        normalizeScore(socialScore),
        normalizeScore(emotionalScore)
      )
    };

    setAnalysisReport(report);
    setShowReport(true);
  };

  const generateRecommendations = (
    languageScore: number,
    logicScore: number,
    socialScore: number,
    emotionalScore: number
  ) => {
    const recommendations = {
      languageVocabulary: '',
      logicalThinking: '',
      socialAdaptation: '',
      emotionalRecognition: '',
      overall: ''
    };

    // 语言建议
    if (languageScore < 2) {
      recommendations.languageVocabulary = "词汇量较为有限，表达方式简单。建议通过更多的阅读和对话活动，扩展孩子的词汇库。";
    } else if (languageScore < 4) {
      recommendations.languageVocabulary = "具备基本的词汇表达能力，能够使用简单句型进行交流。建议鼓励使用更丰富的形容词和动词。";
    } else {
      recommendations.languageVocabulary = "词汇量丰富，能够使用多样化的词汇进行表达。建议继续通过阅读拓展专业领域词汇。";
    }

    // 逻辑建议
    if (logicScore < 2) {
      recommendations.logicalThinking = "逻辑表达能力需要加强，因果关系理解有限。建议通过简单的推理游戏培养逻辑思维能力。";
    } else if (logicScore < 4) {
      recommendations.logicalThinking = "能够理解基本的因果关系，表达有一定的逻辑性。建议通过更复杂的问题解决活动提升逻辑思维。";
    } else {
      recommendations.logicalThinking = "逻辑思维能力较强，能够清晰地表达因果关系和推理过程。建议尝试更复杂的逻辑推理活动。";
    }

    // 社交建议
    if (socialScore < 2) {
      recommendations.socialAdaptation = "社交互动意识较弱，对社交规则理解有限。建议通过角色扮演游戏培养基本社交技能。";
    } else if (socialScore < 4) {
      recommendations.socialAdaptation = "具备基本的社交意识，能够理解简单的社交规则。建议增加小组活动，提升社交互动能力。";
    } else {
      recommendations.socialAdaptation = "社交适应能力良好，能够理解并应用社交规则。建议参与更多团体活动，进一步提升社交能力。";
    }

    // 情感建议
    if (emotionalScore < 2) {
      recommendations.emotionalRecognition = "情感识别和表达能力有限，难以准确表达自身情感。建议通过情绪卡片游戏增强情感识别能力。";
    } else if (emotionalScore < 4) {
      recommendations.emotionalRecognition = "能够识别基本情绪，有一定的情感表达能力。建议通过讨论故事人物情感，提升情感理解深度。";
    } else {
      recommendations.emotionalRecognition = "情感识别能力较强，能够准确表达和理解多种情绪。建议探索更复杂的情感状态和共情能力培养。";
    }

    // 整体建议
    const avgScore = (languageScore + logicScore + socialScore + emotionalScore) / 4;
    if (avgScore < 2) {
      recommendations.overall = "建议增加日常交流互动，使用简单明确的语言，配合视觉提示辅助理解。可以通过结构化的社交故事和游戏，逐步提升语言表达和社交能力。";
    } else if (avgScore < 4) {
      recommendations.overall = "孩子具备基本的交流能力，建议通过更多的小组活动和角色扮演，提升社交互动质量。同时，可以引导孩子表达更复杂的情感和想法，培养共情能力。";
    } else {
      recommendations.overall = "孩子在语言交流方面表现良好，建议提供更具挑战性的社交情境，如解决冲突、协商合作等，进一步提升高阶社交能力和情感表达深度。";
    }

    return recommendations;
  };

  const restartStory = () => {
    console.log('🔄 重新开始阅读，清除所有图片缓存...');

    // 清除所有生成的图片缓存，确保新的交互可以生成新的插画
    clearAllImageCache();

    // 更新会话时间，标记为新的阅读会话
    localStorage.setItem('last_session_time', Date.now().toString());

    // 重置状态
    setCurrentPageIndex(0);
    setUserResponses([]);
    setShowReport(false);
    setShowIntro(true);

    console.log('✅ 已清除所有图片缓存，开始新的阅读体验');
  };

  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              🐻 {storyData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="mb-6">
            <p className="text-lg mb-4">这是一个为{storyData.ageGroup}自闭症儿童设计的交互式绘本，主题是"{storyData.theme}"。</p>
            <p className="mb-4">在这个故事中，你将跟随小熊波波的冒险，学习友谊的重要性。故事中有3个交互环节，你需要回答问题，帮助波波做出选择。</p>
            <p className="mb-4">完成所有交互后，系统会生成一份评估报告，分析你在语言词汇量、思维逻辑、社会适应和情感识别四个维度的表现。</p>
            <p className="mb-4 font-semibold text-blue-600">新功能：本绘本支持语音朗读和语音输入，让体验更加便捷！</p>
            <p className="mb-4 font-semibold text-green-600">✨ 集成LIBLIB AI图片生成，为您的回答创造个性化插画！</p>
          </div>
            <div className="flex justify-center gap-4">
              <Button onClick={startStory} size="lg">
                📚 开始阅读
              </Button>
              <Button onClick={testApiConnection} variant="outline" size="lg">
                🧪 测试API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              📊 自闭症儿童语言交互能力评估报告
            </CardTitle>
          </CardHeader>
          <CardContent>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">基本信息</h2>
            <p>年龄段：{storyData.ageGroup}</p>
            <p>绘本主题：{storyData.theme}</p>
            <p>完成交互环节数量：{analysisReport.completedInteractions}/{analysisReport.totalInteractions}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">能力维度评估（满分5分）</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>语言词汇量：{analysisReport.scores.languageVocabulary}分</span>
                  <span>{analysisReport.scores.languageVocabulary}/5</span>
                </div>
                <Progress value={analysisReport.scores.languageVocabulary * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>思维逻辑：{analysisReport.scores.logicalThinking}分</span>
                  <span>{analysisReport.scores.logicalThinking}/5</span>
                </div>
                <Progress value={analysisReport.scores.logicalThinking * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>社会适应：{analysisReport.scores.socialAdaptation}分</span>
                  <span>{analysisReport.scores.socialAdaptation}/5</span>
                </div>
                <Progress value={analysisReport.scores.socialAdaptation * 20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>情感识别：{analysisReport.scores.emotionalRecognition}分</span>
                  <span>{analysisReport.scores.emotionalRecognition}/5</span>
                </div>
                <Progress value={analysisReport.scores.emotionalRecognition * 20} className="h-2" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">详细分析</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">语言词汇量</h3>
                <p>{analysisReport.recommendations.languageVocabulary}</p>
              </div>
              <div>
                <h3 className="font-medium">思维逻辑</h3>
                <p>{analysisReport.recommendations.logicalThinking}</p>
              </div>
              <div>
                <h3 className="font-medium">社会适应</h3>
                <p>{analysisReport.recommendations.socialAdaptation}</p>
              </div>
              <div>
                <h3 className="font-medium">情感识别</h3>
                <p>{analysisReport.recommendations.emotionalRecognition}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">总结建议</h2>
            <p>{analysisReport.recommendations.overall}</p>
          </div>

            <div className="flex justify-center">
              <Button onClick={restartStory} size="lg">
                🔄 重新开始
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              🐻 {storyData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">📄 第 {currentPageIndex + 1} 页，共 {totalPages} 页</span>
                {currentPage.isInteractive && (
                  <Badge variant="outline" className="text-xs">
                    交互页面
                  </Badge>
                )}
              </div>
              <Badge variant="secondary">
                📈 {Math.round(progress)}%
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>已完成 {userResponses.length} 个交互</span>
              <span>剩余 {totalPages - currentPageIndex - 1} 页</span>
            </div>
          </CardContent>
        </Card>

        <StoryPage
          page={currentPage}
          onNext={handleNext}
          onResponseSubmit={handleResponseSubmit}
          userResponses={userResponses}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPageIndex === 0}
              >
                ⬅️ 上一页
              </Button>

              {!currentPage.isInteractive && (
                <Button
                  onClick={handleNext}
                  disabled={currentPageIndex === totalPages - 1}
                >
                  {currentPageIndex === totalPages - 1 ? '🎉 完成阅读' : '➡️ 下一页'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
