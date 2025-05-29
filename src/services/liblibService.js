// LIBLIB AI API服务实现
// 基于LIBLIB AI官方API文档实现的图片生成服务

import apiKeyManager from './apiKeyManager.js';
import { IMAGE_PROMPT_TEMPLATE } from './promptTemplates.js';

class LiblibService {
  constructor() {
    // LIBLIB API配置（基于官方文档）
    // 在开发环境中使用代理路径解决CORS问题
    this.baseUrl = import.meta.env.DEV ? '/api/liblib' : 'https://openapi.liblibai.cloud';
    this.textToImageEndpoint = '/api/generate/webui/text2img/ultra';
    this.imageToImageEndpoint = '/api/generate/webui/img2img/ultra';
    this.queryEndpoint = '/api/generate/webui/status';

    // 星流Star-3 Alpha模板ID
    this.templateUuid = '5d7e67009b344550bc1aa6ccbfa1d7f4'; // 文生图模板

    // 星流Star-3 Alpha图生图专用模板UUID（根据官方文档）
    this.img2imgTemplateUuid = '07e00af4fc464c7ab55ff906f8acf1b7';

    // 默认参考图片URL（使用用户提供的page1.png）
    this.defaultReferenceImageUrl = 'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png';

    console.log('🔧 LiblibService初始化:', {
      isDev: import.meta.env.DEV,
      baseUrl: this.baseUrl,
      mode: import.meta.env.DEV ? '开发模式(使用代理)' : '生产模式(直连)',
      defaultReferenceImage: this.defaultReferenceImageUrl
    });
  }

  // 初始化API密钥
  initializeApiKeys(accessKey, secretKey) {
    apiKeyManager.initializeLiblib(accessKey, secretKey);
  }

  // 检查API密钥是否已初始化
  isApiKeyInitialized() {
    return apiKeyManager.isLiblibInitialized();
  }

  // 获取API密钥
  getApiKeys() {
    return apiKeyManager.getLiblibKeys();
  }

  // 生成签名（浏览器兼容版本）
  async generateSignature(uri) {
    const { secretKey } = this.getApiKeys();

    if (!secretKey) {
      throw new Error('SecretKey未设置');
    }

    // 生成时间戳（毫秒）
    const timestamp = Date.now();

    // 生成随机字符串
    const signatureNonce = this.generateRandomString(16);

    // 构建原文（与debugLiblibAPI.js保持一致）
    const str = `${uri}&${timestamp}&${signatureNonce}`;

    // 使用Web Crypto API生成HMAC-SHA1签名（浏览器兼容）
    const signature = await this.hmacSha1Browser(str, secretKey);

    return {
      signature,
      timestamp,
      signatureNonce
    };
  }

  // 浏览器兼容的HMAC-SHA1实现
  async hmacSha1Browser(content, key) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const contentData = encoder.encode(content);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, contentData);

      // 转换为Base64
      const uint8Array = new Uint8Array(signature);
      const base64 = btoa(String.fromCharCode(...uint8Array));

      // 转换为URL安全格式并移除填充等号（与debugLiblibAPI.js保持一致）
      return base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    } catch (error) {
      console.error('HMAC-SHA1签名生成失败:', error);
      throw new Error(`签名生成失败: ${error.message}`);
    }
  }

  // 生成随机字符串（与debugLiblibAPI.js保持一致）
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 生成图片（异步模式）
  async generateImage(sceneDescription, ageRange) {
    try {
      if (!this.isApiKeyInitialized()) {
        throw new Error('LIBLIB API密钥未初始化，请先调用initializeApiKeys()');
      }

      // 构建提示词
      const prompt = IMAGE_PROMPT_TEMPLATE
        .replace('{scene_description}', sceneDescription)
        .replace('{age_range}', ageRange);

      console.log('使用LIBLIB AI生成图片，提示词:', prompt);

      // 第一步：发起图片生成任务
      const generateUuid = await this.submitGenerationTask(prompt);
      console.log('图片生成任务已提交，UUID:', generateUuid);

      // 第二步：轮询查询结果
      const imageUrl = await this.pollGenerationResult(generateUuid);
      console.log('图片生成完成，URL:', imageUrl);

      return imageUrl;
    } catch (error) {
      console.error('LIBLIB图片生成失败:', error);
      throw error;
    }
  }

  // 提交图片生成任务
  async submitGenerationTask(prompt) {
    const uri = this.textToImageEndpoint;
    const { signature, timestamp, signatureNonce } = await this.generateSignature(uri);
    const { accessKey } = this.getApiKeys();

    // 使用URL参数方式传递认证信息（按照官方示例）
    const url = `${this.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;

    const requestBody = {
      templateUuid: this.templateUuid,
      generateParams: {
        prompt: prompt,
        aspectRatio: "square",  // 使用官方预设：square (1:1, 1024*1024)
        imgCount: 1,           // 必填参数：生成图片数量
        steps: 30              // 推荐的采样步数
      }
    };

    console.log('🔗 请求URL:', url);
    console.log('📤 请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 错误响应内容:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(`提交生成任务失败: ${error.msg || error.message || error.error || '未知错误'}`);
      } catch (parseError) {
        throw new Error(`提交生成任务失败: HTTP ${response.status} - ${errorText}`);
      }
    }

    const responseText = await response.text();
    console.log('📥 响应内容:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`API响应解析失败: ${responseText}`);
    }

    console.log('📊 解析后的数据:', JSON.stringify(data, null, 2));

    // 根据LIBLIB API的实际响应格式处理结果
    if (data.code === 0 && data.data && data.data.generateUuid) {
      const taskId = data.data.generateUuid;
      console.log('✅ 获取到任务ID:', taskId);
      return taskId;
    } else {
      throw new Error(`API返回数据中缺少任务ID。响应数据: ${JSON.stringify(data)}`);
    }
  }

  // 轮询查询生成结果
  async pollGenerationResult(generateUuid, maxAttempts = 30, interval = 5000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`查询生成结果，第${attempt}次尝试...`);

        const result = await this.queryGenerationResult(generateUuid);

        if (result.status === 'success') {
          if (result.imageUrl) {
            return result.imageUrl;
          } else {
            throw new Error('生成成功但未返回图片URL');
          }
        } else if (result.status === 'failed') {
          throw new Error(`图片生成失败: ${result.message || '未知原因'}`);
        } else {
          // 仍在生成中，等待后重试
          console.log(`图片生成中，${interval/1000}秒后重试...`);
          await this.sleep(interval);
        }
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`查询生成结果失败，已重试${maxAttempts}次: ${error.message}`);
        }
        console.warn(`查询失败，${interval/1000}秒后重试:`, error.message);
        await this.sleep(interval);
      }
    }

    throw new Error(`图片生成超时，已等待${maxAttempts * interval / 1000}秒`);
  }

  // 查询单次生成结果
  async queryGenerationResult(generateUuid) {
    const uri = this.queryEndpoint;
    const { signature, timestamp, signatureNonce } = await this.generateSignature(uri);
    const { accessKey } = this.getApiKeys();

    // 使用URL参数方式传递认证信息（按照官方示例）
    const url = `${this.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;

    const requestBody = {
      generateUuid: generateUuid
    };

    console.log('🔍 查询请求URL:', url);
    console.log('📤 查询请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 查询响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 查询错误响应:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(`查询生成结果失败: ${error.msg || error.message || '未知错误'}`);
      } catch (parseError) {
        throw new Error(`查询生成结果失败: HTTP ${response.status} - ${errorText}`);
      }
    }

    const responseText = await response.text();
    console.log('📥 查询响应内容:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`查询响应解析失败: ${responseText}`);
    }

    console.log('📊 查询解析后的数据:', JSON.stringify(data, null, 2));

    // 根据LIBLIB API的实际响应格式处理结果
    if (data.code === 0 && data.data) {
      const generateStatus = data.data.generateStatus;
      const percentCompleted = data.data.percentCompleted;
      const images = data.data.images;

      console.log(`📊 任务状态: ${generateStatus}, 进度: ${Math.round(percentCompleted * 100)}%, 图片数量: ${images ? images.length : 0}`);

      if (generateStatus === 5 && images && images.length > 0) {
        // 生成成功 (状态5表示完成)
        const imageUrl = images[0].imageUrl || images[0];
        console.log('🎉 图片生成成功!');
        return {
          status: 'success',
          imageUrl: imageUrl,
          progress: percentCompleted
        };
      } else if (generateStatus === 4) {
        // 生成失败
        return {
          status: 'failed',
          message: data.data.generateMsg || '图片生成失败'
        };
      } else if (generateStatus === 2) {
        // 生成中
        return {
          status: 'processing',
          progress: percentCompleted
        };
      } else if (generateStatus === 1) {
        // 排队中
        return {
          status: 'processing',
          progress: percentCompleted,
          message: '任务排队中'
        };
      } else {
        // 其他状态，继续等待
        console.log(`⏳ 未知状态 ${generateStatus}，继续等待...`);
        return {
          status: 'processing',
          progress: percentCompleted,
          generateStatus: generateStatus
        };
      }
    } else {
      throw new Error(`查询API返回错误: ${data.msg || '未知错误'}`);
    }
  }

  // 工具方法：延时
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 图生图功能（基于参考图像生成）
  async generateImageFromImage(referenceImageUrl, prompt, ageRange) {
    try {
      if (!this.isApiKeyInitialized()) {
        throw new Error('LIBLIB API密钥未初始化，请先调用initializeApiKeys()');
      }

      // 如果没有提供参考图片URL，使用默认的page1.png
      let finalReferenceImageUrl = referenceImageUrl;
      if (!finalReferenceImageUrl) {
        finalReferenceImageUrl = this.getDefaultReferenceImageUrl();
        console.log('🎯 使用默认参考图片:', finalReferenceImageUrl);
      }

      // 构建完整提示词
      const fullPrompt = IMAGE_PROMPT_TEMPLATE
        .replace('{scene_description}', prompt)
        .replace('{age_range}', ageRange);

      console.log('使用LIBLIB AI图生图功能，提示词:', fullPrompt);
      console.log('参考图片URL:', finalReferenceImageUrl);

      // 发起图生图任务
      const generateUuid = await this.submitImageToImageTask(finalReferenceImageUrl, fullPrompt);
      console.log('图生图任务已提交，UUID:', generateUuid);

      // 轮询查询结果
      const imageUrl = await this.pollGenerationResult(generateUuid);
      console.log('图生图完成，URL:', imageUrl);

      return imageUrl;
    } catch (error) {
      console.error('LIBLIB图生图失败:', error);
      throw error;
    }
  }

  // 获取默认参考图片URL（使用公网可访问的测试图片）
  getDefaultReferenceImageUrl() {
    // 直接返回公网可访问的测试图片URL
    return this.defaultReferenceImageUrl;
  }

  // 设置默认参考图片URL
  setDefaultReferenceImageUrl(url) {
    this.defaultReferenceImageUrl = url;
    console.log('🎯 更新默认参考图片URL:', url);
  }

  // 新增：使用默认参考图片生成图像的便捷方法
  async generateImageWithDefaultReference(prompt, ageRange) {
    const defaultReferenceUrl = this.getDefaultReferenceImageUrl();
    return this.generateImageFromImage(defaultReferenceUrl, prompt, ageRange);
  }

  // 提交图生图任务
  async submitImageToImageTask(referenceImageUrl, prompt) {
    const uri = this.imageToImageEndpoint; // 使用专用的img2img端点
    const { signature, timestamp, signatureNonce } = await this.generateSignature(uri);
    const { accessKey } = this.getApiKeys();

    // 使用URL参数方式传递认证信息（按照官方示例）
    const url = `${this.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;

    const requestBody = {
      templateUuid: this.img2imgTemplateUuid, // 使用图生图专用模板UUID
      generateParams: {
        prompt: prompt,
        sourceImage: referenceImageUrl, // 图生图必需的参考图片URL
        imgCount: 1,           // 必填参数：生成图片数量
        steps: 30              // 推荐的采样步数
        // 注意：根据官方文档，img2img API的controlnet参数是可选的
        // 先移除controlnet参数，使用基础的图生图功能
      }
    };

    console.log('🔗 Image2Image请求URL:', url);
    console.log('📤 Image2Image请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Image2Image响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Image2Image错误响应:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(`提交图生图任务失败: ${error.msg || error.message || '未知错误'}`);
      } catch (parseError) {
        throw new Error(`提交图生图任务失败: HTTP ${response.status} - ${errorText}`);
      }
    }

    const responseText = await response.text();
    console.log('📥 Image2Image响应内容:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Image2Image响应解析失败: ${responseText}`);
    }

    console.log('📊 Image2Image解析后的数据:', JSON.stringify(data, null, 2));

    // 根据LIBLIB API的实际响应格式处理结果
    if (data.code === 0 && data.data && data.data.generateUuid) {
      const taskId = data.data.generateUuid;
      console.log('✅ 获取到Image2Image任务ID:', taskId);
      return taskId;
    } else if (data.generateUuid) {
      // 直接返回generateUuid的情况
      console.log('✅ 获取到Image2Image任务ID:', data.generateUuid);
      return data.generateUuid;
    } else {
      throw new Error(`Image2Image API返回数据中缺少任务ID。响应数据: ${JSON.stringify(data)}`);
    }
  }

  // 清除API密钥
  clearApiKeys() {
    apiKeyManager.clearLiblib();
  }

  // 测试API连接
  async testConnection() {
    try {
      if (!this.isApiKeyInitialized()) {
        throw new Error('API密钥未初始化');
      }

      // 使用简单的测试提示词
      const testPrompt = 'a cute bear, children illustration style';
      const imageUrl = await this.generateImage(testPrompt, '6-8岁');

      return {
        success: true,
        message: 'LIBLIB API连接成功',
        testImageUrl: imageUrl
      };
    } catch (error) {
      return {
        success: false,
        message: `LIBLIB API连接失败: ${error.message}`,
        error: error
      };
    }
  }

  // 获取API使用状态
  getApiStatus() {
    const isInitialized = this.isApiKeyInitialized();
    let hasAccessKey = false;
    let hasSecretKey = false;

    if (isInitialized) {
      const keys = this.getApiKeys();
      hasAccessKey = !!keys.accessKey;
      hasSecretKey = !!keys.secretKey;
    }

    return {
      isInitialized,
      baseUrl: this.baseUrl,
      templateUuid: this.templateUuid,
      img2imgTemplateUuid: this.img2imgTemplateUuid,
      defaultReferenceImageUrl: this.defaultReferenceImageUrl,
      fullDefaultReferenceImageUrl: this.getDefaultReferenceImageUrl(),
      hasAccessKey,
      hasSecretKey
    };
  }
}

// 创建单例实例
const liblibService = new LiblibService();

// 导出单例实例
export default liblibService;
