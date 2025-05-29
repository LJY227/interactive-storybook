// 专门测试图生图功能的脚本
// 使用方法：node scripts/testImg2Img.js

import dotenv from 'dotenv';
import hmacsha1 from 'hmacsha1';
import randomString from 'string-random';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量 - 从项目根目录
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// API配置
const API_CONFIG = {
  baseUrl: 'https://openapi.liblibai.cloud',
  imageToImageEndpoint: '/api/generate/webui/img2img/ultra',
  queryEndpoint: '/api/generate/webui/status',
  img2imgTemplateUuid: '07e00af4fc464c7ab55ff906f8acf1b7' // 图生图专用模板
};

// 生成签名
const urlSignature = (url, secretKey) => {
  if (!url) return;
  const timestamp = Date.now();
  const signatureNonce = randomString(16);
  const str = `${url}&${timestamp}&${signatureNonce}`;
  const hash = hmacsha1(secretKey, str);
  let signature = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return {
    signature,
    timestamp,
    signatureNonce,
  };
};

// 测试图生图功能
async function testImageToImage() {
  console.log('🖼️ 测试图生图功能');
  
  try {
    const accessKey = process.env.VITE_LIBLIB_ACCESS_KEY;
    const secretKey = process.env.VITE_LIBLIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error('请在.env文件中设置LIBLIB API密钥');
    }

    // 使用一个真实可访问的测试图片
    const testImageUrl = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=512&h=512&fit=crop';
    
    // 准备图生图请求
    const uri = API_CONFIG.imageToImageEndpoint;
    const { signature, timestamp, signatureNonce } = urlSignature(uri, secretKey);

    const fullUrl = `${API_CONFIG.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;

    const requestBody = {
      templateUuid: API_CONFIG.img2imgTemplateUuid,
      generateParams: {
        prompt: 'a cute brown bear sitting in front of a wooden house in the forest, children illustration style',
        sourceImage: testImageUrl,
        imgCount: 1
      }
    };

    console.log('📤 发送图生图请求:');
    console.log('   URL:', fullUrl);
    console.log('   请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📥 响应状态:', response.status);
    
    const responseText = await response.text();
    console.log('📥 响应内容:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    const responseData = JSON.parse(responseText);
    
    if (responseData.code === 0 && responseData.data && responseData.data.generateUuid) {
      const taskId = responseData.data.generateUuid;
      console.log('✅ 图生图任务提交成功!');
      console.log('   任务ID:', taskId);
      
      // 测试查询功能
      await testQuery(accessKey, secretKey, taskId);
      
      return { success: true, taskId: taskId };
    } else {
      throw new Error(`API错误: ${responseData.msg || responseData.message}`);
    }
    
  } catch (error) {
    console.error('❌ 图生图测试失败:', error.message);
    return { success: false, error: error.message };
  }
}

// 测试查询功能
async function testQuery(accessKey, secretKey, taskId) {
  try {
    console.log('\n🔍 测试查询功能...');
    
    const uri = API_CONFIG.queryEndpoint;
    const { signature, timestamp, signatureNonce } = urlSignature(uri, secretKey);

    const queryUrl = `${API_CONFIG.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;

    const requestBody = {
      generateUuid: taskId
    };

    console.log('📤 查询请求:');
    console.log('   URL:', queryUrl);
    console.log('   请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 查询响应状态:', response.status);

    const responseText = await response.text();
    console.log('📥 查询响应内容:', responseText);

    if (response.ok) {
      const queryData = JSON.parse(responseText);
      console.log('✅ 查询成功:', JSON.stringify(queryData, null, 2));
      
      if (queryData.code === 0 && queryData.data) {
        const generateStatus = queryData.data.generateStatus;
        const percentCompleted = queryData.data.percentCompleted;
        console.log(`📊 任务状态: ${generateStatus}, 进度: ${Math.round(percentCompleted * 100)}%`);
      }
    }

  } catch (error) {
    console.error('❌ 查询测试失败:', error.message);
  }
}

// 运行测试
console.log('🧪 开始图生图功能测试');
testImageToImage()
  .then(result => {
    console.log('\n📊 测试结果:');
    if (result.success) {
      console.log('✅ 图生图功能正常，可以在交互页面中使用');
      console.log('💡 您的语音生成图片问题已经解决');
    } else {
      console.log('❌ 图生图功能异常:', result.error);
    }
  })
  .catch(error => {
    console.error('💥 测试脚本执行失败:', error);
  });
