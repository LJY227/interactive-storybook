// 集成基于用户回答生成插画的功能到StoryPage组件

import { useState, useEffect, useRef } from 'react';
import {
  generateIllustrationFromAnswer
} from '../services/illustrationGenerator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Tooltip } from './ui/tooltip';

/**
 * 获取绘本图片的公开可访问URL
 * 直接使用用户提供的公网可访问的图片URL
 */

async function getStoryBookImages() {
  // 使用用户提供的page1.png作为所有交互页面的统一参考图
  // 这样可以确保所有生成的插画都与绘本的原始风格保持一致

  console.log('📚 获取绘本参考图片...');
  console.log('🎯 使用用户提供的page1.png作为统一参考图，确保风格一致性');

  // 使用用户提供的公网可访问的page1.png URL
  const userProvidedImageUrl = 'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png';
  console.log(`📍 使用用户提供的参考图片URL: ${userProvidedImageUrl}`);

  try {
    // 验证图片URL是否可访问
    console.log('🔄 验证参考图片URL可访问性...');
    const response = await fetch(userProvidedImageUrl, { method: 'HEAD' });

    if (!response.ok) {
      throw new Error(`参考图片不可访问: ${response.status} ${response.statusText}`);
    }

    console.log('✅ 参考图片URL验证成功');

    // 所有交互页面都使用相同的参考图（用户提供的URL）
    const images = [
      { pageIndex: 0, url: userProvidedImageUrl }, // 第1页原图
      { pageIndex: 1, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 2, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 4, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 5, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 6, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 8, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 9, url: userProvidedImageUrl }, // 使用page1风格
      { pageIndex: 11, url: userProvidedImageUrl } // 使用page1风格
    ];

    console.log(`✅ 获取到${images.length}张参考图片，全部基于用户提供的page1原图`);
    return images;

  } catch (error) {
    console.error('❌ 无法访问用户提供的参考图片，使用备用参考图:', error);

    // 备用方案：使用与page1风格相似的公开图片
    const fallbackUrl = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=512&h=512&fit=crop';
    console.log(`🔄 使用备用参考图: ${fallbackUrl}`);

    const images = [
      { pageIndex: 0, url: fallbackUrl },
      { pageIndex: 1, url: fallbackUrl },
      { pageIndex: 2, url: fallbackUrl },
      { pageIndex: 4, url: fallbackUrl },
      { pageIndex: 5, url: fallbackUrl },
      { pageIndex: 6, url: fallbackUrl },
      { pageIndex: 8, url: fallbackUrl },
      { pageIndex: 9, url: fallbackUrl },
      { pageIndex: 11, url: fallbackUrl }
    ];

    console.log(`✅ 获取到${images.length}张备用参考图片`);
    return images;
  }
}

interface StoryPageProps {
  page: {
    id: number;
    content: string;
    image?: string;
    isInteractive: boolean;
    question?: string;
    guidance?: string;
  };
  onNext: () => void;
  onResponseSubmit: (pageId: number, response: string) => void;
  userResponses?: Array<{pageId: number, response: string}>;
}

export function StoryPage({
  page,
  onNext,
  onResponseSubmit,
  userResponses = []
}: StoryPageProps) {
  const [userResponse, setUserResponse] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showGuidance, setShowGuidance] = useState(false);
  const timerStartedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [imageError, setImageError] = useState('');

  // 检查是否已有该页面的回答
  useEffect(() => {
    if (page.isInteractive && userResponses) {
      const existingResponse = userResponses.find(r => r.pageId === page.id);
      if (existingResponse) {
        setUserResponse(existingResponse.response);
        setResponseSubmitted(true);
      } else {
        setUserResponse('');
        setResponseSubmitted(false);
      }
    }
  }, [page.id, userResponses]);

  // 重置状态
  useEffect(() => {
    setTimeLeft(30);
    setShowGuidance(false);
    timerStartedRef.current = false;
    setGeneratedImageUrl('');
    setImageError('');

    // 自动朗读页面内容
    readPageContent();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 确保在组件卸载时停止语音
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [page.id]);

  // 监听朗读完成后开始计时（仅交互页面）
  useEffect(() => {
    if (page.isInteractive && readingComplete && !responseSubmitted && !timerStartedRef.current) {
      timerStartedRef.current = true;

      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setShowGuidance(true);
            // 朗读引导提示
            if (page.guidance) {
              speakText(page.guidance);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [readingComplete, page.isInteractive, responseSubmitted, page.guidance]);

  // 朗读页面内容
  const readPageContent = () => {
    if ('speechSynthesis' in window) {
      // 取消之前的语音
      window.speechSynthesis.cancel();

      setIsSpeaking(true);

      const textToRead = page.isInteractive ? page.question || '' : page.content;
      const utterance = new SpeechSynthesisUtterance(textToRead);

      // 设置语音属性
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
        setReadingComplete(true);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // 朗读文本
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 取消之前的语音
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // 设置语音属性
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  };

  // 开始语音输入
  const startVoiceInput = () => {
    // 定义SpeechRecognition类型
    interface SpeechRecognitionResult {
      readonly isFinal: boolean;
      readonly length: number;
      [index: number]: {
        readonly confidence: number;
        readonly transcript: string;
      };
    }

    interface SpeechRecognitionResultList {
      readonly length: number;
      [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionEvent extends Event {
      readonly resultIndex: number;
      readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
      error: string;
    }

    interface SpeechRecognition extends EventTarget {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onstart: (event: Event) => void;
      onresult: (event: SpeechRecognitionEvent) => void;
      onerror: (event: SpeechRecognitionErrorEvent) => void;
      onend: (event: Event) => void;
    }

    // 检查浏览器支持
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;

      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        // 安全地处理results，避免Array.from类型错误
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i][0] && event.results[i][0].transcript) {
            transcript += event.results[i][0].transcript;
          }
        }

        setUserResponse(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('您的浏览器不支持语音识别功能');
    }
  };

  // 提交回答
  const handleSubmit = async () => {
    if (userResponse.trim() === '') return;

    // 停止计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 提交回答
    onResponseSubmit(page.id, userResponse);
    setResponseSubmitted(true);

    // 朗读感谢信息
    speakText('谢谢你的回答！');

    // 生成基于回答的插画
    try {
      setGeneratingImage(true);
      setImageError('');

      // 获取所有可用的绘本图像
      // 根据分析报告的策略：使用前后页面的插画作为参考图像
      // 使用绘本的实际图片URL（通过公开可访问的CDN或图床服务）
      const allImages = await getStoryBookImages();

      console.log('🖼️ 参考图像列表:', allImages);

      // 当前页面索引
      const currentPageIndex = page.id - 1;

      // 当前故事上下文
      const context = {
        currentPageIndex,
        currentPage: page
      };

      // 生成插画
      const imageUrl = await generateIllustrationFromAnswer(
        userResponse,
        page.id,
        context,
        allImages
      );

      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('生成插画失败:', error);
      setImageError(`生成插画失败: ${(error as Error).message || '未知错误'}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  // 重新生成插画
  const handleRegenerateImage = async () => {
    try {
      setGeneratingImage(true);
      setImageError('');

      // 获取所有可用的绘本图像
      // 根据分析报告的策略：使用前后页面的插画作为参考图像
      // 使用绘本的实际图片URL（通过公开可访问的CDN或图床服务）
      const allImages = await getStoryBookImages();

      // 当前页面索引
      const currentPageIndex = page.id - 1;

      // 当前故事上下文
      const context = {
        currentPageIndex,
        currentPage: page
      };

      // 生成插画
      const imageUrl = await generateIllustrationFromAnswer(
        userResponse,
        page.id,
        context,
        allImages
      );

      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('重新生成插画失败:', error);
      setImageError(`重新生成插画失败: ${(error as Error).message || '未知错误'}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {page.isInteractive ? '🎯 交互环节' : `📖 第 ${page.id} 页`}
          </CardTitle>
          <div className="flex gap-2">
            {page.isInteractive && (
              <Badge variant="outline">
                {responseSubmitted ? '✅ 已完成' : '⏳ 待回答'}
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary">
                🔊 朗读中
              </Badge>
            )}
            {generatingImage && (
              <Badge variant="default">
                🎨 生成中
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>

        {/* 页面图片 */}
        <div className="mb-4 relative">
          {page.isInteractive && responseSubmitted && generatedImageUrl ? (
            // 显示基于用户回答生成的插画
            <div className="relative">
              <img
                src={generatedImageUrl}
                alt={`基于回答生成的插画`}
                className="w-full h-auto rounded-lg mb-2"
              />
              <div className="text-sm text-gray-500 italic text-center">
                基于你的回答生成的插画
              </div>

              {/* 重新生成按钮 */}
              <Button
                onClick={handleRegenerateImage}
                disabled={generatingImage}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                {generatingImage ? '🎨 生成中...' : '🔄 重新生成插画'}
              </Button>
            </div>
          ) : (
            // 显示原始页面图片
            page.image && (
              <img
                src={page.image}
                alt={`第 ${page.id} 页插图`}
                className="w-full h-auto rounded-lg"
              />
            )
          )}

          {/* 图片生成错误提示 */}
          {imageError && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {imageError}
              </AlertDescription>
            </Alert>
          )}

          {/* 图片生成加载状态 */}
          {generatingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="text-center">
                  <div className="text-blue-600 font-medium mb-2">🎨 正在生成个性化插画...</div>
                  <div className="text-sm text-gray-500">根据你的回答创作专属图片</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 页面文本内容 */}
        <div className="prose max-w-none">
          {page.isInteractive ? (
            <div>
              <p className="font-medium text-lg mb-4">{page.question}</p>

              {/* 显示引导提示 */}
              {showGuidance && !responseSubmitted && (
                <Alert variant="warning" className="mb-4">
                  <AlertDescription>
                    💡 {page.guidance}
                  </AlertDescription>
                </Alert>
              )}

              {/* 显示用户回答 */}
              {responseSubmitted ? (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700">你的回答:</h3>
                  <p className="p-3 bg-blue-50 rounded-md">{userResponse}</p>
                </div>
              ) : (
                <div className="mt-4">
                  {/* 倒计时 */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>⏰ 请在30秒内回答问题</span>
                      <Badge variant={timeLeft <= 10 ? 'destructive' : 'outline'}>
                        {timeLeft}秒
                      </Badge>
                    </div>
                    <Progress
                      value={(timeLeft / 30) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* 回答输入框 */}
                  <Textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="在这里输入你的回答..."
                    rows={4}
                    className="mb-3"
                  />

                  <div className="flex gap-2">
                    {/* 语音输入按钮 */}
                    <Tooltip content="点击开始语音输入，说出你的回答">
                      <Button
                        onClick={startVoiceInput}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {isListening ? (
                          <>
                            <span>正在聆听...</span>
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                          </>
                        ) : (
                          <>
                            🎤 语音输入
                          </>
                        )}
                      </Button>
                    </Tooltip>

                    {/* 提交按钮 */}
                    <Tooltip content="提交你的回答并生成个性化插画">
                      <Button
                        onClick={handleSubmit}
                        disabled={userResponse.trim() === ''}
                      >
                        ✅ 提交回答
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>{page.content}</p>
          )}
        </div>

        {/* 朗读按钮 */}
        <div className="mb-4">
          <Tooltip content="点击朗读当前页面内容">
            <Button
              onClick={readPageContent}
              disabled={isSpeaking}
              variant="outline"
              className="mr-2"
            >
              {isSpeaking ? '🔊 正在朗读...' : '🔊 朗读内容'}
            </Button>
          </Tooltip>
        </div>

        {/* 继续阅读按钮（非交互页面） */}
        {!page.isInteractive && (
          <Button
            onClick={onNext}
            disabled={!readingComplete}
          >
            {!readingComplete ? '⏳ 请等待朗读完成...' : '📖 继续阅读'}
          </Button>
        )}

        {/* 继续阅读按钮（交互页面，已回答） */}
        {page.isInteractive && responseSubmitted && (
          <Button onClick={onNext}>
            📖 继续阅读
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
