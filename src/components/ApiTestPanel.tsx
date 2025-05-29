import { useState } from 'react';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import { Spinner } from './ui/spinner';
import openAIService from '../services/openAIService.js';

interface TestResult {
  connection: boolean;
  textGeneration: boolean;
  imageGeneration: boolean;
  analysis: boolean;
}

export function ApiTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<TestResult>({
    connection: false,
    textGeneration: false,
    imageGeneration: false,
    analysis: false
  });
  const [currentTest, setCurrentTest] = useState<string>('');
  const [testOutput, setTestOutput] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');

  // 测试API连接
  const testConnection = async () => {
    setCurrentTest('connection');
    setTestOutput('正在测试API连接...');

    try {
      if (!openAIService.isApiKeyInitialized()) {
        throw new Error('API密钥未设置');
      }

      // 简单的API调用测试
      const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('未找到API密钥');
      }

      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({ ...prev, connection: true }));
        setTestOutput(`✅ API连接成功！\n可用模型数量: ${data.data.length}`);
      } else {
        throw new Error(`API连接失败: ${response.status}`);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, connection: false }));
      setTestOutput(`❌ 连接失败: ${(error as Error).message}`);
    }

    setCurrentTest('');
  };

  // 测试文本生成
  const testTextGeneration = async () => {
    setCurrentTest('text');
    setTestOutput('正在测试文本生成...');

    try {
      const story = await openAIService.generateStory('6-8岁', '友谊');
      setTestResults(prev => ({ ...prev, textGeneration: true }));
      setTestOutput(`✅ 文本生成成功！\n生成内容: ${JSON.stringify(story, null, 2)}`);
    } catch (error) {
      setTestResults(prev => ({ ...prev, textGeneration: false }));
      setTestOutput(`❌ 文本生成失败: ${(error as Error).message}`);
    }

    setCurrentTest('');
  };

  // 测试图像生成
  const testImageGeneration = async () => {
    setCurrentTest('image');
    setTestOutput('正在测试图像生成...');
    setGeneratedImage('');

    try {
      const imageUrl = await openAIService.generateImage(
        '一只友好的小熊在森林中微笑，温暖的色彩，简洁的儿童插画风格',
        '6-8岁'
      );
      setTestResults(prev => ({ ...prev, imageGeneration: true }));
      setTestOutput(`✅ 图像生成成功！`);
      setGeneratedImage(imageUrl);
    } catch (error) {
      setTestResults(prev => ({ ...prev, imageGeneration: false }));
      setTestOutput(`❌ 图像生成失败: ${(error as Error).message}`);
    }

    setCurrentTest('');
  };

  // 测试评估分析
  const testAnalysis = async () => {
    setCurrentTest('analysis');
    setTestOutput('正在测试评估分析...');

    try {
      const questions = [
        "如果你是波波，你会怎么向小兔子打招呼呢？",
        "波波看到这么多新朋友有点害怕。如果你是波波，你会怎么融入这个新的朋友圈子？"
      ];
      const answers = [
        "我会说你好，然后告诉她我叫波波，我想和你做朋友",
        "我会先和莉莉打招呼，因为我认识她，然后让她介绍其他朋友给我"
      ];

      const analysis = await openAIService.analyzePerformance(questions, answers);
      setTestResults(prev => ({ ...prev, analysis: true }));
      setTestOutput(`✅ 评估分析成功！\n分析结果: ${JSON.stringify(analysis, null, 2)}`);
    } catch (error) {
      setTestResults(prev => ({ ...prev, analysis: false }));
      setTestOutput(`❌ 评估分析失败: ${(error as Error).message}`);
    }

    setCurrentTest('');
  };

  // 运行所有测试
  const runAllTests = async () => {
    await testConnection();
    if (testResults.connection) {
      await testTextGeneration();
      await testImageGeneration();
      await testAnalysis();
    }
  };

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
        >
          🧪 API测试
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🧪 OpenAI API 功能测试</h2>
          <Button
            onClick={() => setIsVisible(false)}
            variant="outline"
            size="sm"
          >
            ✕ 关闭
          </Button>
        </div>

        {!openAIService.isApiKeyInitialized() && (
          <Alert variant="warning" className="mb-4">
            <p>⚠️ 请先在应用中设置 OpenAI API 密钥</p>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="font-semibold">单项测试</h3>
            <Button
              onClick={testConnection}
              disabled={currentTest === 'connection' || !openAIService.isApiKeyInitialized()}
              className="w-full"
            >
              {currentTest === 'connection' ? <Spinner className="mr-2" /> : null}
              🌐 测试API连接
            </Button>
            <Button
              onClick={testTextGeneration}
              disabled={currentTest === 'text' || !openAIService.isApiKeyInitialized()}
              className="w-full"
            >
              {currentTest === 'text' ? <Spinner className="mr-2" /> : null}
              📝 测试文本生成
            </Button>
            <Button
              onClick={testImageGeneration}
              disabled={currentTest === 'image' || !openAIService.isApiKeyInitialized()}
              className="w-full"
            >
              {currentTest === 'image' ? <Spinner className="mr-2" /> : null}
              🎨 测试图像生成
            </Button>
            <Button
              onClick={testAnalysis}
              disabled={currentTest === 'analysis' || !openAIService.isApiKeyInitialized()}
              className="w-full"
            >
              {currentTest === 'analysis' ? <Spinner className="mr-2" /> : null}
              📊 测试评估分析
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">批量测试</h3>
            <Button
              onClick={runAllTests}
              disabled={currentTest !== '' || !openAIService.isApiKeyInitialized()}
              className="w-full"
              variant="secondary"
            >
              🚀 运行所有测试
            </Button>

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">测试结果统计</h4>
              <p>通过率: {passedTests}/{totalTests} ({Math.round(passedTests/totalTests*100)}%)</p>
              <ul className="text-sm space-y-1 mt-2">
                <li>API连接: {testResults.connection ? '✅ 通过' : '❌ 失败'}</li>
                <li>文本生成: {testResults.textGeneration ? '✅ 通过' : '❌ 失败'}</li>
                <li>图像生成: {testResults.imageGeneration ? '✅ 通过' : '❌ 失败'}</li>
                <li>智能评估: {testResults.analysis ? '✅ 通过' : '❌ 失败'}</li>
              </ul>
            </div>
          </div>
        </div>

        {testOutput && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">测试输出</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
              {testOutput}
            </pre>
          </div>
        )}

        {generatedImage && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">生成的图像</h4>
            <img
              src={generatedImage}
              alt="测试生成的图像"
              className="max-w-full h-auto rounded border"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        {passedTests === totalTests && passedTests > 0 && (
          <Alert variant="default" className="mt-4">
            <p>🎉 所有测试通过！OpenAI API 集成完全正常，您现在可以在应用中使用所有 AI 功能。</p>
          </Alert>
        )}
      </div>
    </div>
  );
}
