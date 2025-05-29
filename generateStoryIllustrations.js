// 为《小熊波波的友谊冒险》生成完整插画集
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import hmacsha1 from 'hmacsha1';
import randomString from 'string-random';
import fetch from 'node-fetch';

// 加载环境变量
dotenv.config();

// LIBLIB API 配置
const API_CONFIG = {
  baseUrl: 'https://openapi.liblibai.cloud',
  textToImageEndpoint: '/api/generate/webui/text2img',
  queryEndpoint: '/api/generate/webui/status',
  templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4'
};

// 生成签名（按照官方示例）
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

// 非交互页面数据
const NON_INTERACTIVE_PAGES = [
  {
    id: 1,
    content: "波波是一只住在森林里的小棕熊。他有一双好奇的大眼睛和一颗善良的心。每天早晨，波波都会坐在自己的小木屋前，望着远处的大树和花朵，但他从来不敢走得太远。",
    filename: "page1.png"
  },
  {
    id: 2,
    content: "一天早晨，波波听到一阵欢快的歌声。\"那是谁在唱歌呢？\"波波好奇地想。他鼓起勇气，第一次离开了自己的小木屋，沿着小路向歌声传来的方向走去。",
    filename: "page2.png"
  },
  {
    id: 3,
    content: "波波来到了一片开阔的草地。他看到一只小兔子正在那里采摘野花。小兔子有着雪白的毛发和粉红的鼻子，正哼着波波从未听过的歌曲。",
    filename: "page3.png"
  }
];

// 角色描述（保持一致性）
const CHARACTER_DESCRIPTIONS = {
  bobo: "小熊波波：一只可爱的棕色小熊，有着圆圆的脸蛋、大大的眼睛、小小的黑鼻子，表情温和友善",
  lili: "兔子莉莉：一只优雅的白色小兔子，有着长长的耳朵、粉红色的鼻子、温柔的表情"
};

// 基础风格描述
const BASE_STYLE = "温馨友好的儿童插画风格，水彩画技法，柔和的色彩，清晰的轮廓，温暖的棕色、绿色、蓝色、黄色调，简洁的背景，主体突出";

// 为每个页面生成专门的提示词
function generatePromptForPage(pageData) {
  const { id, content } = pageData;
  
  let prompt = "";
  
  switch (id) {
    case 1:
      prompt = `${CHARACTER_DESCRIPTIONS.bobo}坐在森林中的小木屋前，背景是茂密的森林、大树和花朵，早晨的阳光透过树叶洒下，${BASE_STYLE}`;
      break;
    case 2:
      prompt = `${CHARACTER_DESCRIPTIONS.bobo}离开小木屋，沿着森林小路行走，表情好奇而勇敢，背景是森林小径，远处传来歌声的感觉，${BASE_STYLE}`;
      break;
    case 3:
      prompt = `${CHARACTER_DESCRIPTIONS.bobo}站在开阔的草地边缘，看着${CHARACTER_DESCRIPTIONS.lili}在采摘野花，草地上开满了各种颜色的野花，${BASE_STYLE}`;
      break;
    default:
      prompt = `${content}，${BASE_STYLE}`;
  }
  
  return prompt;
}

// 调用 LIBLIB API 生成图片
async function generateImage(prompt) {
  const accessKey = process.env.VITE_LIBLIB_ACCESS_KEY;
  const secretKey = process.env.VITE_LIBLIB_SECRET_KEY;
  
  if (!accessKey || !secretKey) {
    throw new Error('LIBLIB API 密钥未配置');
  }
  
  try {
    // 生成签名
    const uri = API_CONFIG.textToImageEndpoint;
    const { signature, timestamp, signatureNonce } = urlSignature(uri, secretKey);
    
    // 构建完整URL
    const fullUrl = `${API_CONFIG.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
    
    const requestBody = {
      templateUuid: API_CONFIG.templateUuid,
      generateParams: {
        prompt: prompt
      }
    };
    
    console.log('🎨 发送图片生成请求...');
    console.log('提示词:', prompt);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseData = await response.json();
    
    if (responseData.code === 0 && responseData.data) {
      const taskId = responseData.data.generateUuid;
      console.log('✅ 图片生成任务已提交，任务ID:', taskId);
      
      // 轮询查询结果
      return await pollGenerationResult(taskId, accessKey, secretKey);
    } else {
      throw new Error(`API调用失败: ${responseData.msg || '未知错误'}`);
    }
  } catch (error) {
    console.error('图片生成失败:', error);
    throw error;
  }
}

// 轮询查询生成结果
async function pollGenerationResult(taskId, accessKey, secretKey, maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔍 查询生成进度 (${attempt}/${maxAttempts})...`);
      
      const uri = API_CONFIG.queryEndpoint;
      const { signature, timestamp, signatureNonce } = urlSignature(uri, secretKey);
      
      const queryUrl = `${API_CONFIG.baseUrl}${uri}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
      
      const requestBody = {
        generateUuid: taskId
      };
      
      const response = await fetch(queryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const responseData = await response.json();
      
      if (responseData.code === 0 && responseData.data) {
        const generateStatus = responseData.data.generateStatus;
        const percentCompleted = responseData.data.percentCompleted;
        const images = responseData.data.images;
        
        console.log(`   进度: ${Math.round(percentCompleted * 100)}%, 状态: ${generateStatus}`);
        
        if (generateStatus === 3 && images && images.length > 0) {
          console.log('🎉 图片生成完成!');
          return images[0];
        } else if (generateStatus === 4) {
          throw new Error('图片生成失败');
        } else if (generateStatus === 2) {
          console.log('   ⏳ 生成中...');
        }
      } else {
        console.log(`   ⚠️  查询响应: ${JSON.stringify(responseData)}`);
      }
      
      // 等待5秒后重试
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`查询失败 (尝试 ${attempt}):`, error.message);
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  throw new Error('图片生成超时');
}

// 下载并保存图片
async function downloadAndSaveImage(imageUrl, filename) {
  try {
    console.log('📥 下载图片:', imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    
    // 确保public目录存在
    const publicDir = 'public';
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);
    
    console.log('💾 图片已保存:', filePath);
    return `/${filename}`;
  } catch (error) {
    console.error('保存图片失败:', error);
    throw error;
  }
}

// 主函数：生成所有插画
async function generateAllIllustrations() {
  console.log('🚀 开始为《小熊波波的友谊冒险》生成插画集...');
  console.log(`📚 共需生成 ${NON_INTERACTIVE_PAGES.length} 张插画`);
  
  const results = [];
  
  for (let i = 0; i < NON_INTERACTIVE_PAGES.length; i++) {
    const pageData = NON_INTERACTIVE_PAGES[i];
    
    try {
      console.log(`\n📖 处理第 ${pageData.id} 页 (${i + 1}/${NON_INTERACTIVE_PAGES.length})`);
      console.log('故事内容:', pageData.content.substring(0, 100) + '...');
      
      // 生成提示词
      const prompt = generatePromptForPage(pageData);
      
      // 生成图片
      const imageUrl = await generateImage(prompt);
      
      // 下载并保存图片
      const savedPath = await downloadAndSaveImage(imageUrl, pageData.filename);
      
      results.push({
        pageId: pageData.id,
        filename: pageData.filename,
        savedPath: savedPath,
        success: true
      });
      
      console.log(`✅ 第 ${pageData.id} 页插画生成完成`);
      
      // 避免请求过快，等待2秒
      if (i < NON_INTERACTIVE_PAGES.length - 1) {
        console.log('⏳ 等待2秒后继续...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ 第 ${pageData.id} 页插画生成失败:`, error.message);
      results.push({
        pageId: pageData.id,
        filename: pageData.filename,
        error: error.message,
        success: false
      });
    }
  }
  
  // 输出结果总结
  console.log('\n📊 插画生成结果总结:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ 成功生成: ${successful.length} 张`);
  console.log(`❌ 生成失败: ${failed.length} 张`);
  
  if (successful.length > 0) {
    console.log('\n成功生成的插画:');
    successful.forEach(result => {
      console.log(`  - 第 ${result.pageId} 页: ${result.savedPath}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n生成失败的插画:');
    failed.forEach(result => {
      console.log(`  - 第 ${result.pageId} 页: ${result.error}`);
    });
  }
  
  console.log('\n🎉 插画生成任务完成!');
  return results;
}

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllIllustrations().catch(console.error);
}

export { generateAllIllustrations };
