// API初始化组件
// 确保在应用启动时正确初始化所有API服务

import { useEffect, useState } from 'react';
import liblibService from '../services/liblibService';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ApiInitializerProps {
  children: React.ReactNode;
}

export function ApiInitializer({ children }: ApiInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApis();
  }, []);

  const initializeApis = async () => {
    try {
      setIsLoading(true);
      setInitError(null);

      // 获取环境变量中的LiblibAI API密钥
      const liblibAccessKey = import.meta.env.VITE_LIBLIB_ACCESS_KEY;
      const liblibSecretKey = import.meta.env.VITE_LIBLIB_SECRET_KEY;

      console.log('🚀 开始初始化API服务...');

      if (!liblibAccessKey || !liblibSecretKey) {
        throw new Error('LiblibAI API密钥未在环境变量中找到。请检查.env文件中的VITE_LIBLIB_ACCESS_KEY和VITE_LIBLIB_SECRET_KEY配置。');
      }

      // 初始化LiblibAI服务
      liblibService.initializeApiKeys(liblibAccessKey, liblibSecretKey);

      // 设置默认参考图片URL为用户提供的page1.png
      const userProvidedImageUrl = 'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png';
      liblibService.setDefaultReferenceImageUrl(userProvidedImageUrl);
      console.log('🎯 设置默认参考图片URL:', userProvidedImageUrl);

      // 验证API状态
      const status = liblibService.getApiStatus();

      if (!status.isInitialized || !status.hasAccessKey || !status.hasSecretKey) {
        throw new Error('LiblibAI API初始化失败，请检查API密钥配置');
      }

      console.log('✅ LiblibAI API初始化成功');
      console.log('🔑 AccessKey:', liblibAccessKey.substring(0, 10) + '...');
      console.log('📊 API状态:', status);

      // 可选：测试API连接（注释掉以避免不必要的API调用）
      // console.log('🔌 测试API连接...');
      // const testResult = await liblibService.testConnection();
      // if (!testResult.success) {
      //   console.warn('⚠️ API连接测试失败:', testResult.message);
      // } else {
      //   console.log('✅ API连接测试成功');
      // }

      setIsInitialized(true);
    } catch (error) {
      console.error('❌ API初始化失败:', error);
      setInitError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    initializeApis();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">🚀 初始化中...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-center text-gray-600">正在初始化API服务，请稍候...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">❌ 初始化失败</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                <strong>错误信息：</strong>{initError}
              </AlertDescription>
            </Alert>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">解决方案：</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>确保项目根目录存在 <code className="bg-gray-100 px-1 rounded">.env</code> 文件</li>
                <li>检查 <code className="bg-gray-100 px-1 rounded">.env</code> 文件中包含以下配置：
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
{`VITE_LIBLIB_ACCESS_KEY=your_access_key
VITE_LIBLIB_SECRET_KEY=your_secret_key`}
                  </pre>
                </li>
                <li>确保API密钥有效且有足够的使用额度</li>
                <li>重启开发服务器使环境变量生效</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">当前环境变量状态：</h3>
              <div className="bg-gray-100 p-2 rounded text-xs">
                <p>VITE_LIBLIB_ACCESS_KEY: {import.meta.env.VITE_LIBLIB_ACCESS_KEY ? '✅ 已设置' : '❌ 未设置'}</p>
                <p>VITE_LIBLIB_SECRET_KEY: {import.meta.env.VITE_LIBLIB_SECRET_KEY ? '✅ 已设置' : '❌ 未设置'}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleRetry}>
                🔄 重试初始化
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">⚠️ 服务未就绪</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">API服务尚未完全初始化</p>
            <div className="flex justify-center">
              <Button onClick={handleRetry}>
                🔄 重新初始化
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // API初始化成功，渲染子组件
  return <>{children}</>;
}

export default ApiInitializer;
