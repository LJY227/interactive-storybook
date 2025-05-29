// 基于用户回答生成插画的核心逻辑实现
// 使用LIBLIB AI平台进行图片生成

import liblibService from './liblibService.js';
import { debugLiblibInBrowser } from './liblibServiceDebug.js';
import {
  IMAGE2IMAGE_PROMPT_TEMPLATE,
  INTERACTIVE_ILLUSTRATION_PROMPT_TEMPLATE
} from './promptTemplates.js';

// 增强的风格描述 - 专为自闭症儿童设计
const STYLE_DESCRIPTION = `
温暖友好的儿童插画，专为自闭症儿童设计，使用柔和的色彩和简单清晰的形状，角色表情丰富且易于理解。
水彩画风格，轮廓线条清晰且一致，色彩饱和度适中。主要使用温暖的棕色、绿色、蓝色和黄色，避免过于刺激的鲜艳色彩。
柔和的光影效果，避免强烈对比和复杂阴影，确保视觉舒适。轻微的水彩纹理，保持整体平滑感。
场景设计简洁不复杂，背景元素适量且有序排列，主体突出，避免过多分散注意力的细节。
保持与故事其他插图的一致风格和色调，确保整体视觉连贯性。
`;

// 增强的角色描述 - 增加了更多细节和一致性描述
const CHARACTER_DESCRIPTION = `
小熊波波：棕色毛发的小熊，圆脸，大眼睛，友好的表情。穿着红色上衣，蓝色短裤。身高约为画面高度的1/3。
小兔莉莉：灰白色的兔子，长耳朵，温柔的表情。穿着粉色连衣裙，有时戴着花朵发饰。身高略小于波波。
乌龟老师：绿色的乌龟，深棕色的壳，戴着圆形眼镜，智慧的表情。通常拿着一本书或教具。
松鼠兄弟：红棕色的松鼠，蓬松的尾巴，活泼的表情。一个穿黄色衣服，一个穿绿色衣服，以区分。
森林背景：温暖的绿色树木，点缀着黄色和橙色的花朵，蓝色的小溪，棕色的小路。天空通常是淡蓝色。
`;

// 情感表达指南 - 帮助生成更适合自闭症儿童理解的情感表达
const EMOTION_EXPRESSION_GUIDE = `
情感表达应清晰且易于识别：
- 开心/高兴：明显的微笑，眼睛弯曲成弧形
- 悲伤：嘴角下垂，眉毛向上倾斜
- 惊讶：圆形嘴巴，睁大的眼睛
- 害怕：缩小的身体姿势，略微后倾
- 友好：微笑并伸出手/爪子
- 好奇：略微倾斜的头部，专注的眼神

避免复杂或模糊的情感表达，确保情感状态一目了然。
`;

// 交互场景指南 - 针对交互页面的特殊处理
const INTERACTIVE_SCENE_GUIDE = `
交互场景应展现开放性和包容性：
- 角色之间保持适当距离，展示积极互动
- 场景应有邀请性，预留空间让想象中的新角色或元素加入
- 可以包含与用户回答相关的新元素，但保持与故事世界观的一致性
- 避免过于拥挤或混乱的场景，保持视觉清晰度
`;

/**
 * 从用户回答中提取关键内容
 * @param {string} answer - 用户的回答内容
 * @returns {Object} 提取的关键内容
 */
function extractKeyContent(answer) {
  // 提取角色 - 扩展了更多可能的角色名称变体
  const characterPatterns = [
    { names: ['波波', '小熊波波', '小熊'], character: '小熊波波' },
    { names: ['莉莉', '小兔莉莉', '小兔'], character: '小兔莉莉' },
    { names: ['乌龟', '乌龟老师', '老师'], character: '乌龟老师' },
    { names: ['松鼠', '松鼠兄弟'], character: '松鼠兄弟' }
  ];

  const characters = [];
  characterPatterns.forEach(pattern => {
    if (pattern.names.some(name => answer.includes(name))) {
      characters.push(pattern.character);
    }
  });

  // 提取动作和场景 - 扩展了更多关键词
  const actions = [];
  const actionKeywords = [
    '打招呼', '分享', '帮助', '玩', '说话', '微笑', '拥抱', '交朋友',
    '给予', '接受', '学习', '教导', '聆听', '阅读', '画画', '唱歌',
    '跳舞', '跑步', '散步', '探索', '发现', '思考', '想象'
  ];
  actionKeywords.forEach(action => {
    if (answer.includes(action)) actions.push(action);
  });

  // 提取情感 - 扩展了更多情感词汇
  const emotions = [];
  const emotionKeywords = [
    '开心', '高兴', '害怕', '紧张', '兴奋', '好奇', '担心', '勇敢', '友好',
    '快乐', '满足', '惊讶', '惊喜', '感激', '温暖', '安心', '自信', '骄傲',
    '期待', '专注', '平静', '满意'
  ];
  emotionKeywords.forEach(emotion => {
    if (answer.includes(emotion)) emotions.push(emotion);
  });

  // 提取场景元素 - 扩展了更多场景元素
  const sceneElements = [];
  const sceneKeywords = [
    '森林', '树', '花', '草地', '河流', '木屋', '阳光', '雨', '野餐',
    '学校', '教室', '操场', '图书馆', '桥', '山', '洞穴', '池塘', '瀑布',
    '彩虹', '云', '星星', '月亮', '沙滩', '海', '船', '帐篷', '篝火'
  ];
  sceneKeywords.forEach(element => {
    if (answer.includes(element)) sceneElements.push(element);
  });

  // 提取物品 - 新增物品提取
  const items = [];
  const itemKeywords = [
    '书', '玩具', '食物', '水果', '蛋糕', '礼物', '气球', '画', '信',
    '背包', '帽子', '伞', '望远镜', '地图', '笔', '纸', '乐器', '球',
    '风筝', '船', '车', '自行车', '灯笼', '花束', '相机'
  ];
  itemKeywords.forEach(item => {
    if (answer.includes(item)) items.push(item);
  });

  // 提取时间和天气 - 新增时间和天气提取
  const timeAndWeather = [];
  const timeWeatherKeywords = [
    '早晨', '中午', '下午', '傍晚', '晚上', '夜晚',
    '晴天', '雨天', '多云', '雾', '雪', '风', '彩虹'
  ];
  timeWeatherKeywords.forEach(tw => {
    if (answer.includes(tw)) timeAndWeather.push(tw);
  });

  // 如果没有提取到足够的内容，提供默认值
  return {
    characters: characters.length > 0 ? characters : ['小熊波波', '小兔莉莉'],
    actions: actions.length > 0 ? actions : ['微笑', '交朋友'],
    emotions: emotions.length > 0 ? emotions : ['友好', '开心'],
    sceneElements: sceneElements.length > 0 ? sceneElements : ['森林', '阳光'],
    items: items.length > 0 ? items : [],
    timeAndWeather: timeAndWeather.length > 0 ? timeAndWeather : ['白天']
  };
}

/**
 * 增强版：构建图像生成提示词
 * @param {string} answer - 用户的回答内容
 * @param {Object} context - 当前故事上下文
 * @param {number} pageId - 页面ID
 * @returns {string} 完整的提示词
 */
function buildImagePrompt(answer, context, pageId) {
  const keyContent = extractKeyContent(answer);

  // 构建场景描述
  let sceneDescription = `${keyContent.characters.join('和')}在${keyContent.sceneElements.join('和')}中`;

  // 添加时间和天气描述
  if (keyContent.timeAndWeather.length > 0) {
    sceneDescription += `的${keyContent.timeAndWeather.join('和')}`;
  }

  // 添加动作描述
  if (keyContent.actions.length > 0) {
    sceneDescription += `正在${keyContent.actions.join('和')}`;
  }

  // 添加物品描述
  if (keyContent.items.length > 0) {
    sceneDescription += `，周围有${keyContent.items.join('和')}`;
  }

  // 添加情感描述
  if (keyContent.emotions.length > 0) {
    sceneDescription += `，表情${keyContent.emotions.join('和')}`;
  }

  // 构建基础提示词
  let promptBase = `为自闭症儿童绘本创建一幅插图，描绘：${sceneDescription}。
这是基于儿童回答的交互式绘本第${pageId}页插图。

具体情境：${answer}

${CHARACTER_DESCRIPTION}

${EMOTION_EXPRESSION_GUIDE}

${INTERACTIVE_SCENE_GUIDE}

${STYLE_DESCRIPTION}`;

  // 添加上下文相关信息
  if (context && context.currentPage) {
    promptBase += `\n\n当前故事情境：${context.currentPage.content || context.currentPage.question}`;

    // 如果是交互页面，添加问题信息
    if (context.currentPage.isInteractive && context.currentPage.question) {
      promptBase += `\n\n交互问题：${context.currentPage.question}`;
    }
  }

  // 添加风格一致性强调
  promptBase += `\n\n重要：请确保插图风格与绘本其他页面保持一致，使用相同的艺术风格、色彩方案和角色设计。插图应该看起来像是同一位艺术家创作的同一本书的一部分。`;

  return promptBase;
}

/**
 * 增强版：获取参考图像URL
 * @param {number} currentPageIndex - 当前页面索引
 * @param {Array} allImages - 所有可用的图像URL
 * @returns {Array} 参考图像URL数组
 */
function getReferenceImages(currentPageIndex, allImages) {
  console.log(`🔍 为页面索引${currentPageIndex}选择参考图像...`);
  console.log('📚 可用图像列表:', allImages.map(img => `页面${img.pageIndex}: ${img.url.substring(0, 50)}...`));

  const references = [];

  // 添加前一页的图像作为参考（如果存在）
  const prevImages = allImages.filter(img => img.pageIndex < currentPageIndex)
    .sort((a, b) => b.pageIndex - a.pageIndex);

  if (prevImages.length > 0) {
    references.push(prevImages[0].url);
    console.log(`✅ 选择前一页图像作为主要参考: 页面${prevImages[0].pageIndex}`);

    // 添加第二个前置图像（如果存在）
    if (prevImages.length > 1) {
      references.push(prevImages[1].url);
      console.log(`✅ 选择第二个前置图像: 页面${prevImages[1].pageIndex}`);
    }
  }

  // 添加后一页的图像作为参考（如果存在）
  const nextImages = allImages.filter(img => img.pageIndex > currentPageIndex)
    .sort((a, b) => a.pageIndex - b.pageIndex);

  if (nextImages.length > 0) {
    references.push(nextImages[0].url);
    console.log(`✅ 选择后一页图像作为参考: 页面${nextImages[0].pageIndex}`);
  }

  // 如果没有找到足够的相邻页面图像，添加其他可用图像
  if (references.length < 2 && allImages.length > 0) {
    console.log('⚠️ 相邻页面图像不足，添加其他可用图像...');
    // 按页面索引排序
    const sortedImages = [...allImages].sort((a, b) => a.pageIndex - b.pageIndex);

    // 添加尚未包含的图像
    for (const img of sortedImages) {
      if (!references.includes(img.url) && references.length < 3) {
        references.push(img.url);
        console.log(`✅ 添加补充参考图像: 页面${img.pageIndex}`);
      }

      if (references.length >= 3) break;
    }
  }

  console.log(`🎯 最终选择的参考图像数量: ${references.length}`);
  console.log('📋 参考图像列表:', references.map((url, index) => `${index + 1}. ${url.substring(0, 50)}...`));

  return references;
}

/**
 * 调用LIBLIB API生成图像 - 使用image2image功能保持风格一致性
 * @param {string} prompt - 图像生成提示词
 * @param {Array} referenceImages - 参考图像URL数组（用于image2image）
 * @param {string} userAnswer - 用户回答
 * @param {string} sceneDescription - 场景描述
 * @returns {Promise<string>} 生成的图像URL
 */
async function generateImage(prompt, referenceImages = [], userAnswer = '', sceneDescription = '') {
  try {
    console.log('使用LIBLIB平台image2image功能生成图像...');
    console.log('生成图像的提示词:', prompt);
    console.log('参考图像:', referenceImages);
    console.log('用户回答:', userAnswer);

    // 如果有参考图像，使用image2image功能
    if (referenceImages && referenceImages.length > 0) {
      // 选择最佳的参考图像（通常是最近的页面）
      const primaryReferenceImage = referenceImages[0];

      console.log('使用image2image功能，参考图像:', primaryReferenceImage);

      // 为image2image优化提示词
      const optimizedPrompt = optimizePromptForImage2Image(prompt, userAnswer, sceneDescription);

      console.log('优化后的image2image提示词:', optimizedPrompt);

      // 使用LIBLIB的image2image功能
      return await liblibService.generateImageFromImage(
        primaryReferenceImage,
        optimizedPrompt,
        '6-8岁'
      );
    } else {
      // 如果没有参考图像，使用交互式插画模板
      console.log('没有参考图像，使用交互式插画模板');

      // 构建交互式插画提示词
      const interactivePrompt = buildInteractiveIllustrationPrompt(
        userAnswer,
        sceneDescription || prompt,
        1
      );

      console.log('交互式插画提示词:', interactivePrompt);

      return await liblibService.generateImage(interactivePrompt, '6-8岁');
    }
  } catch (error) {
    console.error('LIBLIB图像生成失败:', error);

    // 如果是网络错误，提供详细的诊断信息
    if (error.message.includes('Failed to fetch')) {
      console.error('🌐 检测到网络请求失败，开始诊断...');

      try {
        // 运行浏览器环境诊断
        const diagnosis = await debugLiblibInBrowser();
        console.error('📊 诊断结果:', diagnosis);

        // 提供更友好的错误信息
        const friendlyError = new Error(
          `生成插画失败: 网络连接问题。${diagnosis.suggestions ? '建议: ' + diagnosis.suggestions.join(', ') : ''}`
        );
        friendlyError.originalError = error;
        friendlyError.diagnosis = diagnosis;
        throw friendlyError;
      } catch (diagError) {
        console.error('诊断过程失败:', diagError);
        // 如果诊断也失败了，返回原始错误
        throw error;
      }
    } else {
      throw error;
    }
  }
}

/**
 * 为image2image功能优化提示词
 * @param {string} originalPrompt - 原始提示词
 * @param {string} userAnswer - 用户回答
 * @param {string} sceneDescription - 场景描述
 * @returns {string} 优化后的提示词
 */
function optimizePromptForImage2Image(originalPrompt, userAnswer = '', sceneDescription = '') {
  // 使用专门的image2image模板
  const optimizedPrompt = IMAGE2IMAGE_PROMPT_TEMPLATE
    .replace('{scene_description}', sceneDescription || originalPrompt)
    .replace('{user_answer}', userAnswer)
    .replace('{age_range}', '6-8');

  return optimizedPrompt;
}

/**
 * 清理和过滤用户输入，避免敏感内容
 * @param {string} input - 用户输入
 * @returns {string} 清理后的输入
 */
function sanitizeUserInput(input) {
  if (!input || typeof input !== 'string') {
    return 'happy children playing together';
  }

  // 移除可能被误判的词汇，替换为更安全的表达
  let cleanInput = input
    .replace(/暴力|打架|战斗|攻击/g, '玩耍')
    .replace(/武器|刀|枪|剑/g, '玩具')
    .replace(/死|杀|伤害/g, '睡觉')
    .replace(/血|受伤/g, '红色')
    .replace(/恐怖|可怕|害怕/g, '有趣')
    .replace(/黑暗|阴暗/g, '安静')
    .replace(/哭|难过/g, '思考')
    .replace(/生气|愤怒/g, '认真');

  // 确保内容积极正面，限制长度
  if (cleanInput.length > 100) {
    cleanInput = cleanInput.substring(0, 100);
  }

  // 如果清理后内容为空或过短，使用默认内容
  if (cleanInput.length < 3) {
    cleanInput = 'happy children playing together in a beautiful garden';
  }

  return cleanInput;
}

/**
 * 构建交互式插画提示词
 * @param {string} userAnswer - 用户回答
 * @param {string} storyContext - 故事上下文
 * @param {number} pageNumber - 页面编号
 * @returns {string} 交互式插画提示词
 */
function buildInteractiveIllustrationPrompt(userAnswer, storyContext, pageNumber) {
  // 清理用户输入以避免敏感内容检测
  const cleanUserAnswer = sanitizeUserInput(userAnswer);
  const cleanStoryContext = sanitizeUserInput(storyContext);

  return INTERACTIVE_ILLUSTRATION_PROMPT_TEMPLATE
    .replace('{user_answer}', cleanUserAnswer)
    .replace('{story_context}', cleanStoryContext)
    .replace('{page_number}', pageNumber);
}

/**
 * 生成基于用户回答的缓存键
 * @param {number} pageId - 页面ID
 * @param {string} answer - 用户回答
 * @returns {string} 缓存键
 */
function generateCacheKey(pageId, answer) {
  // 获取当前会话时间，用于区分不同的阅读会话
  const sessionTime = localStorage.getItem('last_session_time') || Date.now().toString();
  const sessionId = sessionTime.slice(-8); // 修复：使用slice而不是substring

  // 创建基于回答内容的哈希，确保相同回答使用相同缓存
  const answerHash = btoa(encodeURIComponent(answer)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

  // 添加时间戳确保每次交互都生成新图片
  const timestamp = Date.now().toString().slice(-6);

  return `generated_image_page_${pageId}_${answerHash}_session_${sessionId}_${timestamp}`;
}

/**
 * 保存生成的图像到本地缓存
 * @param {string} imageUrl - 生成的图像URL
 * @param {number} pageId - 页面ID
 * @param {string} answer - 用户回答（用于个性化缓存）
 * @returns {Promise<string>} 本地图像路径
 */
async function saveGeneratedImage(imageUrl, pageId, answer) {
  try {
    // 在实际应用中，这里会实现将远程图像保存到本地的逻辑
    // 在前端应用中，可以使用localStorage或IndexedDB存储图像URL

    // 生成基于回答内容的缓存键
    const cacheKey = generateCacheKey(pageId, answer);

    // 存储图像URL到localStorage
    localStorage.setItem(cacheKey, imageUrl);

    // 同时存储缓存元数据
    const metadataKey = `${cacheKey}_metadata`;
    const metadata = {
      pageId,
      answer,
      imageUrl,
      timestamp: Date.now(),
      answerLength: answer.length
    };
    localStorage.setItem(metadataKey, JSON.stringify(metadata));

    console.log(`保存图像: ${imageUrl} 到页面ID: ${pageId}，回答哈希: ${cacheKey}`);

    // 返回图像URL作为本地路径
    return imageUrl;
  } catch (error) {
    console.error('保存图像失败:', error);
    throw error;
  }
}

/**
 * 从缓存中获取已生成的图像
 * @param {number} pageId - 页面ID
 * @param {string} answer - 用户回答
 * @returns {string|null} 缓存的图像URL或null
 */
function getCachedImage(pageId, answer) {
  // 暂时禁用缓存功能，确保每次都生成新的插画
  console.log('🚫 缓存功能已禁用，跳过缓存检查');
  return null;

  // 原缓存逻辑（已禁用）
  /*
  try {
    const cacheKey = generateCacheKey(pageId, answer);
    const cachedUrl = localStorage.getItem(cacheKey);

    if (cachedUrl) {
      console.log(`找到缓存图像: ${cachedUrl}，缓存键: ${cacheKey}`);

      // 更新访问时间
      const metadataKey = `${cacheKey}_metadata`;
      const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
      metadata.lastAccessed = Date.now();
      localStorage.setItem(metadataKey, JSON.stringify(metadata));
    }

    return cachedUrl;
  } catch (error) {
    console.error('获取缓存图像失败:', error);
    return null;
  }
  */
}

/**
 * 获取页面的所有缓存图像
 * @param {number} pageId - 页面ID
 * @returns {Array} 缓存图像列表
 */
function getPageCachedImages(pageId) {
  try {
    const keys = Object.keys(localStorage);
    const pageImageKeys = keys.filter(key =>
      key.startsWith(`generated_image_page_${pageId}_`) &&
      !key.endsWith('_metadata')
    );

    return pageImageKeys.map(key => {
      const imageUrl = localStorage.getItem(key);
      const metadataKey = `${key}_metadata`;
      const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');

      return {
        cacheKey: key,
        imageUrl,
        metadata
      };
    }).sort((a, b) => (b.metadata.timestamp || 0) - (a.metadata.timestamp || 0));
  } catch (error) {
    console.error('获取页面缓存图像失败:', error);
    return [];
  }
}

/**
 * 主函数：根据用户回答生成插画
 * @param {string} answer - 用户的回答内容
 * @param {number} pageId - 交互页面ID
 * @param {Object} context - 当前故事上下文
 * @param {Array} allImages - 所有可用的图像
 * @returns {Promise<string>} 生成的图像URL或路径
 */
export async function generateIllustrationFromAnswer(answer, pageId, context, allImages) {
  try {
    // 确保每次都生成新的插画，不使用任何缓存
    console.log(`🎨 为页面${pageId}生成全新插画，基于用户回答: "${answer}"`);
    console.log('🚫 强制禁用所有缓存，确保每次都是新图片');

    // 清除该页面的所有旧缓存（防止意外使用）
    clearImageCache(pageId);

    // 生成唯一的时间戳，确保每次请求都是独一无二的
    const uniqueTimestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    console.log(`🔄 生成唯一标识: ${uniqueTimestamp}`);

    // 构建提示词
    const prompt = buildImagePrompt(answer, context, pageId);

    // 获取参考图像
    const referenceImages = getReferenceImages(context.currentPageIndex, allImages);

    console.log(`找到${referenceImages.length}个参考图像用于保持风格一致性`);

    // 提取场景描述
    const keyContent = extractKeyContent(answer);
    const sceneDescription = `${keyContent.characters.join('和')}在${keyContent.sceneElements.join('和')}中${keyContent.actions.join('和')}`;

    // 生成图像
    const imageUrl = await generateImage(prompt, referenceImages, answer, sceneDescription);

    // 不保存到缓存，直接返回图像URL
    console.log(`✅ 插画生成完成，URL: ${imageUrl}`);
    console.log('🚫 跳过缓存保存，确保下次重新生成');

    return imageUrl;
  } catch (error) {
    console.error('根据回答生成插画失败:', error);
    throw error;
  }
}

/**
 * 检查生成的插画是否与现有风格一致
 * @param {string} generatedImageUrl - 生成的图像URL
 * @param {Array} referenceImages - 参考图像URL数组
 * @returns {Promise<boolean>} 是否风格一致
 */
export async function checkStyleConsistency(generatedImageUrl, referenceImages) {
  // 在实际应用中，这里可以实现风格一致性检查逻辑
  // 可以使用计算机视觉API或简单的颜色分析

  // 模拟检查过程
  console.log('检查风格一致性:', generatedImageUrl, referenceImages);

  // 默认返回一致
  return true;
}

/**
 * 清除特定页面的图像缓存
 * @param {number} pageId - 页面ID
 * @param {string} answer - 可选，特定回答的缓存
 */
export function clearImageCache(pageId, answer = null) {
  try {
    if (answer) {
      // 清除特定回答的缓存
      const cacheKey = generateCacheKey(pageId, answer);
      const metadataKey = `${cacheKey}_metadata`;

      localStorage.removeItem(cacheKey);
      localStorage.removeItem(metadataKey);

      console.log(`已清除页面${pageId}特定回答的图像缓存`);
    } else {
      // 清除页面所有缓存
      const keys = Object.keys(localStorage);
      const pageKeys = keys.filter(key => key.startsWith(`generated_image_page_${pageId}_`));

      pageKeys.forEach(key => localStorage.removeItem(key));

      console.log(`已清除页面${pageId}的所有图像缓存，共${pageKeys.length}项`);
    }
  } catch (error) {
    console.error('清除图像缓存失败:', error);
  }
}

/**
 * 清除所有页面的图像缓存
 */
export function clearAllImageCache() {
  try {
    // 获取所有localStorage键
    const keys = Object.keys(localStorage);

    // 筛选出图像缓存键（包括元数据）
    const imageCacheKeys = keys.filter(key => key.startsWith('generated_image_page_'));

    // 删除所有图像缓存
    imageCacheKeys.forEach(key => localStorage.removeItem(key));

    console.log(`已清除所有图像缓存，共${imageCacheKeys.length}项`);
  } catch (error) {
    console.error('清除所有图像缓存失败:', error);
  }
}

/**
 * 清除旧会话的图像缓存
 * @param {number} maxAge - 最大缓存时间（毫秒），默认30分钟
 */
export function clearOldSessionCache(maxAge = 30 * 60 * 1000) {
  try {
    const currentTime = Date.now();
    const keys = Object.keys(localStorage);

    // 筛选出图像缓存的元数据键
    const metadataKeys = keys.filter(key =>
      key.startsWith('generated_image_page_') && key.endsWith('_metadata')
    );

    let clearedCount = 0;

    metadataKeys.forEach(metadataKey => {
      try {
        const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}');
        const cacheAge = currentTime - (metadata.timestamp || 0);

        if (cacheAge > maxAge) {
          // 清除过期的缓存项
          const cacheKey = metadataKey.replace('_metadata', '');
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(metadataKey);
          clearedCount++;
        }
      } catch (error) {
        console.warn('清除过期缓存项失败:', metadataKey, error);
      }
    });

    if (clearedCount > 0) {
      console.log(`已清除${clearedCount}个过期的图像缓存项`);
    }
  } catch (error) {
    console.error('清除旧会话缓存失败:', error);
  }
}

/**
 * 获取缓存统计信息
 * @returns {Object} 缓存统计信息
 */
export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const imageCacheKeys = keys.filter(key =>
      key.startsWith('generated_image_page_') &&
      !key.endsWith('_metadata')
    );

    const metadataKeys = keys.filter(key =>
      key.startsWith('generated_image_page_') &&
      key.endsWith('_metadata')
    );

    // 计算总缓存大小（估算）
    let totalSize = 0;
    imageCacheKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) totalSize += value.length;
    });

    // 按页面分组统计
    const pageStats = {};
    metadataKeys.forEach(key => {
      try {
        const metadata = JSON.parse(localStorage.getItem(key) || '{}');
        const pageId = metadata.pageId;

        if (pageId) {
          if (!pageStats[pageId]) {
            pageStats[pageId] = { count: 0, lastGenerated: 0 };
          }
          pageStats[pageId].count++;
          pageStats[pageId].lastGenerated = Math.max(
            pageStats[pageId].lastGenerated,
            metadata.timestamp || 0
          );
        }
      } catch (e) {
        // 忽略解析错误
      }
    });

    return {
      totalImages: imageCacheKeys.length,
      totalSizeEstimate: totalSize,
      pageStats,
      oldestCache: Math.min(...metadataKeys.map(key => {
        try {
          const metadata = JSON.parse(localStorage.getItem(key) || '{}');
          return metadata.timestamp || Date.now();
        } catch (e) {
          return Date.now();
        }
      }))
    };
  } catch (error) {
    console.error('获取缓存统计失败:', error);
    return { totalImages: 0, totalSizeEstimate: 0, pageStats: {}, oldestCache: Date.now() };
  }
}

export default {
  generateIllustrationFromAnswer,
  checkStyleConsistency,
  clearImageCache,
  clearAllImageCache,
  getCacheStats,
  getPageCachedImages,
  buildImagePrompt,
  extractKeyContent,
  optimizePromptForImage2Image,
  buildInteractiveIllustrationPrompt
};
