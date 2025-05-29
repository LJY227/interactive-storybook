// 浏览器环境下的LiblibAI API调试工具
// 专门用于诊断浏览器环境中的API调用问题

import liblibService from './liblibService.js';

/**
 * 在浏览器环境中测试LiblibAI API
 */
export async function debugLiblibInBrowser() {
  console.log('🔍 开始浏览器环境LiblibAI API调试');
  
  try {
    // 1. 检查API密钥初始化状态
    console.log('1️⃣ 检查API密钥初始化状态...');
    const isInitialized = liblibService.isApiKeyInitialized();
    console.log('   API密钥已初始化:', isInitialized);
    
    if (!isInitialized) {
      console.error('❌ API密钥未初始化');
      return { success: false, error: 'API密钥未初始化' };
    }
    
    // 2. 检查API状态
    console.log('2️⃣ 检查API状态...');
    const status = liblibService.getApiStatus();
    console.log('   API状态:', status);
    
    // 3. 测试签名生成
    console.log('3️⃣ 测试签名生成...');
    try {
      const testUri = '/api/generate/webui/img2img/ultra';
      const signatureResult = await liblibService.generateSignature(testUri);
      console.log('   签名生成成功:', signatureResult);
    } catch (signError) {
      console.error('❌ 签名生成失败:', signError);
      return { success: false, error: `签名生成失败: ${signError.message}` };
    }
    
    // 4. 测试图生图API调用
    console.log('4️⃣ 测试图生图API调用...');
    try {
      // 使用一个简单的测试图片URL
      const testImageUrl = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=512&h=512&fit=crop';
      const testPrompt = 'a cute brown bear sitting in front of a wooden house in the forest, children illustration style';
      
      console.log('   测试参数:');
      console.log('   - 参考图片:', testImageUrl);
      console.log('   - 提示词:', testPrompt);
      
      const imageUrl = await liblibService.generateImageFromImage(
        testImageUrl,
        testPrompt,
        '6-8岁'
      );
      
      console.log('✅ 图生图API调用成功!');
      console.log('   生成的图片URL:', imageUrl);
      
      return { 
        success: true, 
        imageUrl: imageUrl,
        message: '浏览器环境LiblibAI API调用成功'
      };
      
    } catch (apiError) {
      console.error('❌ 图生图API调用失败:', apiError);
      
      // 详细分析错误类型
      if (apiError.message.includes('Failed to fetch')) {
        console.error('🌐 网络请求失败，可能的原因:');
        console.error('   - CORS跨域问题');
        console.error('   - 网络连接问题');
        console.error('   - API服务器不可达');
        
        return { 
          success: false, 
          error: 'Failed to fetch - 网络请求失败',
          errorType: 'NETWORK_ERROR',
          suggestions: [
            '检查网络连接',
            '确认API服务器可访问',
            '检查CORS配置'
          ]
        };
      } else if (apiError.message.includes('密钥')) {
        return { 
          success: false, 
          error: `API密钥问题: ${apiError.message}`,
          errorType: 'API_KEY_ERROR'
        };
      } else {
        return { 
          success: false, 
          error: `API调用失败: ${apiError.message}`,
          errorType: 'API_ERROR'
        };
      }
    }
    
  } catch (error) {
    console.error('💥 调试过程中发生未知错误:', error);
    return { 
      success: false, 
      error: `调试失败: ${error.message}`,
      errorType: 'UNKNOWN_ERROR'
    };
  }
}

/**
 * 测试网络连接
 */
export async function testNetworkConnection() {
  console.log('🌐 测试网络连接...');
  
  try {
    // 测试对LiblibAI API服务器的基本连接
    const testUrl = 'https://openapi.liblibai.cloud';
    
    console.log(`   尝试连接: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'no-cors' // 避免CORS问题
    });
    
    console.log('✅ 网络连接正常');
    return { success: true, message: '网络连接正常' };
    
  } catch (error) {
    console.error('❌ 网络连接失败:', error);
    return { 
      success: false, 
      error: `网络连接失败: ${error.message}`,
      suggestions: [
        '检查网络连接',
        '确认防火墙设置',
        '尝试使用VPN'
      ]
    };
  }
}

/**
 * 检查浏览器环境兼容性
 */
export function checkBrowserCompatibility() {
  console.log('🔧 检查浏览器环境兼容性...');
  
  const compatibility = {
    fetch: typeof fetch !== 'undefined',
    crypto: typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',
    textEncoder: typeof TextEncoder !== 'undefined',
    webCrypto: typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined' && typeof crypto.subtle.importKey !== 'undefined'
  };
  
  console.log('   兼容性检查结果:', compatibility);
  
  const allCompatible = Object.values(compatibility).every(Boolean);
  
  if (allCompatible) {
    console.log('✅ 浏览器环境兼容性良好');
    return { success: true, compatibility };
  } else {
    console.error('❌ 浏览器环境存在兼容性问题');
    return { success: false, compatibility };
  }
}

/**
 * 完整的浏览器环境诊断
 */
export async function fullBrowserDiagnosis() {
  console.log('🏥 开始完整的浏览器环境诊断');
  
  const results = {
    compatibility: checkBrowserCompatibility(),
    network: await testNetworkConnection(),
    api: await debugLiblibInBrowser()
  };
  
  console.log('📊 诊断结果汇总:', results);
  
  // 生成诊断报告
  const report = {
    overall: results.api.success,
    details: results,
    recommendations: []
  };
  
  if (!results.compatibility.success) {
    report.recommendations.push('升级浏览器或使用现代浏览器');
  }
  
  if (!results.network.success) {
    report.recommendations.push('检查网络连接和防火墙设置');
  }
  
  if (!results.api.success) {
    if (results.api.errorType === 'NETWORK_ERROR') {
      report.recommendations.push('检查CORS配置或使用代理服务器');
    } else if (results.api.errorType === 'API_KEY_ERROR') {
      report.recommendations.push('检查API密钥配置');
    }
  }
  
  return report;
}

// 导出调试函数供控制台使用
if (typeof window !== 'undefined') {
  window.debugLiblibAI = {
    debug: debugLiblibInBrowser,
    testNetwork: testNetworkConnection,
    checkCompatibility: checkBrowserCompatibility,
    fullDiagnosis: fullBrowserDiagnosis
  };
  
  console.log('🔧 LiblibAI调试工具已加载到 window.debugLiblibAI');
  console.log('   使用方法:');
  console.log('   - window.debugLiblibAI.debug() - 调试API');
  console.log('   - window.debugLiblibAI.testNetwork() - 测试网络');
  console.log('   - window.debugLiblibAI.checkCompatibility() - 检查兼容性');
  console.log('   - window.debugLiblibAI.fullDiagnosis() - 完整诊断');
}
