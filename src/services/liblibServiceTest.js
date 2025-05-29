// LIBLIB服务测试文件
// 用于测试LIBLIB API的连接和功能

import liblibService from './liblibService.js';
import apiKeyManager from './apiKeyManager.js';

// 测试用的API密钥（请替换为实际的LIBLIB API密钥）
const TEST_ACCESS_KEY = 'your_liblib_access_key_here';
const TEST_SECRET_KEY = 'your_liblib_secret_key_here';

/**
 * 测试API密钥初始化
 */
async function testApiKeyInitialization() {
  try {
    console.log('测试LIBLIB API密钥初始化...');

    // 初始化API密钥
    liblibService.initializeApiKeys(TEST_ACCESS_KEY, TEST_SECRET_KEY);

    // 检查是否初始化成功
    const isInitialized = liblibService.isApiKeyInitialized();
    console.log('LIBLIB API密钥初始化状态:', isInitialized);

    // 检查API状态
    const status = liblibService.getApiStatus();
    console.log('API状态:', status);

    return isInitialized;
  } catch (error) {
    console.error('API密钥初始化测试失败:', error);
    return false;
  }
}

/**
 * 测试图片生成功能
 */
async function testImageGeneration() {
  try {
    console.log('测试LIBLIB图片生成功能...');

    // 确保API密钥已初始化
    if (!liblibService.isApiKeyInitialized()) {
      liblibService.initializeApiKeys(TEST_ACCESS_KEY, TEST_SECRET_KEY);
    }

    // 测试场景描述（使用英文提示词，因为LIBLIB要求纯英文）
    const sceneDescription = 'a cute bear and a rabbit playing in the forest, surrounded by beautiful flowers and trees, children illustration style';
    const ageRange = '6-8岁';

    console.log('生成图片，场景描述:', sceneDescription);
    console.log('注意：LIBLIB API要求提示词为纯英文，生成过程可能需要1-2分钟...');

    // 生成图片
    const imageUrl = await liblibService.generateImage(sceneDescription, ageRange);
    console.log('生成的图片URL:', imageUrl);

    return imageUrl;
  } catch (error) {
    console.error('图片生成测试失败:', error);
    throw error;
  }
}

/**
 * 测试API连接
 */
async function testApiConnection() {
  try {
    console.log('测试LIBLIB API连接...');

    // 确保API密钥已初始化
    if (!liblibService.isApiKeyInitialized()) {
      liblibService.initializeApiKeys(TEST_ACCESS_KEY, TEST_SECRET_KEY);
    }

    // 使用内置的连接测试方法
    console.log('正在进行连接测试，这可能需要1-2分钟...');
    const result = await liblibService.testConnection();
    console.log('API连接测试结果:', result);

    return result;
  } catch (error) {
    console.error('API连接测试失败:', error);
    return {
      success: false,
      message: `连接测试失败: ${error.message}`,
      error: error
    };
  }
}

/**
 * 测试错误处理
 */
async function testErrorHandling() {
  try {
    console.log('测试错误处理...');

    // 清除API密钥
    liblibService.clearApiKeys();

    // 尝试在没有API密钥的情况下生成图片
    try {
      await liblibService.generateImage('test scene', '6-8岁');
      console.error('错误：应该抛出API密钥未初始化的错误');
      return false;
    } catch (error) {
      if (error.message.includes('API密钥未初始化')) {
        console.log('✓ 正确处理了API密钥未初始化的错误');
        return true;
      } else {
        console.error('错误处理不正确:', error.message);
        return false;
      }
    }
  } catch (error) {
    console.error('错误处理测试失败:', error);
    return false;
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('=== LIBLIB服务测试开始 ===');
  
  const results = {
    apiKeyInitialization: false,
    imageGeneration: false,
    apiConnection: false,
    errorHandling: false
  };
  
  try {
    // 测试API密钥初始化
    results.apiKeyInitialization = await testApiKeyInitialization();
    
    // 测试API连接
    const connectionResult = await testApiConnection();
    results.apiConnection = connectionResult.success;
    
    // 如果连接成功，测试图片生成
    if (results.apiConnection) {
      try {
        const imageUrl = await testImageGeneration();
        results.imageGeneration = !!imageUrl;
      } catch (error) {
        console.log('图片生成测试跳过（可能是API配置问题）:', error.message);
      }
    }
    
    // 测试错误处理
    results.errorHandling = await testErrorHandling();
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
  
  console.log('=== LIBLIB服务测试结果 ===');
  console.log('API密钥初始化:', results.apiKeyInitialization ? '✓' : '✗');
  console.log('API连接:', results.apiConnection ? '✓' : '✗');
  console.log('图片生成:', results.imageGeneration ? '✓' : '✗');
  console.log('错误处理:', results.errorHandling ? '✓' : '✗');
  
  const allPassed = Object.values(results).every(result => result);
  console.log('总体结果:', allPassed ? '✓ 所有测试通过' : '✗ 部分测试失败');
  
  return results;
}

/**
 * 快速测试（仅测试基本功能）
 */
export async function quickTest() {
  console.log('=== LIBLIB服务快速测试 ===');
  
  try {
    // 测试API密钥初始化
    const initResult = await testApiKeyInitialization();
    if (!initResult) {
      console.log('✗ API密钥初始化失败');
      return false;
    }
    
    // 测试API连接
    const connectionResult = await testApiConnection();
    if (!connectionResult.success) {
      console.log('✗ API连接失败:', connectionResult.message);
      return false;
    }
    
    console.log('✓ 快速测试通过');
    return true;
  } catch (error) {
    console.error('✗ 快速测试失败:', error);
    return false;
  }
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export default {
  runAllTests,
  quickTest,
  testApiKeyInitialization,
  testImageGeneration,
  testApiConnection,
  testErrorHandling
};
