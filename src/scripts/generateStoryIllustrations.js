// 批量生成《小熊波波的友谊冒险》非交互页面插画
// 使用LIBLIB AI API生成一套完整的绘本插画

import liblibService from '../services/liblibService.js';
import { getLiblibApiKeys } from '../services/apiConfig.js';

// 故事数据 - 非交互页面
const NON_INTERACTIVE_PAGES = [
  {
    id: 1,
    content: "波波是一只住在森林里的小棕熊。他有一双好奇的大眼睛和一颗善良的心。每天早晨，波波都会坐在自己的小木屋前，望着远处的大树和花朵，但他从来不敢走得太远。",
    imagePath: "/page1.png"
  },
  {
    id: 2,
    content: "一天早晨，波波听到一阵欢快的歌声。\"那是谁在唱歌呢？\"波波好奇地想。他鼓起勇气，第一次离开了自己的小木屋，沿着小路向歌声传来的方向走去。",
    imagePath: "/page2.png"
  },
  {
    id: 3,
    content: "波波来到了一片开阔的草地。他看到一只小兔子正在那里采摘野花。小兔子有着雪白的毛发和粉红的鼻子，正哼着波波从未听过的歌曲。",
    imagePath: "/page3.png"
  },
  {
    id: 5,
    content: "小兔子看到了波波，友好地笑了笑。\"你好，我叫莉莉！\"小兔子说，\"我正在采集这些美丽的花朵，准备做一个花环。你想一起来吗？\"波波点点头，慢慢地走近了莉莉。",
    imagePath: "/page5.png"
  },
  {
    id: 6,
    content: "波波和莉莉一起采集花朵，他们边采边聊。莉莉告诉波波，森林里还有许多其他的动物朋友。\"我们每周五都会在大橡树下举行野餐会，\"莉莉说，\"你愿意来参加吗？\"",
    imagePath: "/page6.png"
  },
  {
    id: 7,
    content: "波波既兴奋又紧张。他从来没有参加过野餐会，也没有见过那么多的动物朋友。但莉莉的笑容让他感到安心，于是他答应了。",
    imagePath: "/page7.png"
  },
  {
    id: 9,
    content: "野餐会上，大家分享了各自带来的美食。猫头鹰带来了蜂蜜饼干，松鼠兄弟带来了坚果沙拉，乌龟带来了新鲜的浆果。波波没有带任何东西，他感到有些难过。",
    imagePath: "/page9.png"
  },
  {
    id: 10,
    content: "\"别担心，波波，\"莉莉轻声说，\"重要的不是你带了什么，而是你来了。友谊不是用礼物来衡量的，而是用心来感受的。\"波波听了，心里暖暖的。",
    imagePath: "/page10.png"
  },
  {
    id: 12,
    content: "现在，每天早晨，波波都会兴高采烈地离开自己的小木屋，去拜访他的朋友们。他知道，真正的友谊需要勇气去开始，需要时间去培养，更需要真心去维护。在森林里，波波找到了属于自己的幸福。",
    imagePath: "/page12.png"
  }
];

// 角色描述
const CHARACTERS = {
  bobo: "小熊波波：一只可爱的小棕熊，有着圆圆的脸庞、大大的眼睛、小小的黑鼻子，毛发是温暖的棕色，表情善良友好",
  lili: "小兔莉莉：一只优雅的小白兔，有着雪白的毛发、粉红的鼻子、长长的耳朵，表情温柔友善",
  owl: "猫头鹰：一只聪明的猫头鹰，有着大大的圆眼睛和棕色的羽毛，看起来很有智慧",
  squirrels: "松鼠兄弟：两只活泼的小松鼠，有着红棕色的毛发和蓬松的尾巴，表情活泼可爱",
  turtle: "乌龟：一只慢吞吞的乌龟，有着绿色的壳和温和的表情，看起来很友善"
};

// 基础风格描述
const BASE_STYLE = `
Children's illustration style, warm and friendly watercolor painting designed for autistic children aged 6-8:
- Soft, gentle colors with clear outlines
- Watercolor technique with consistent line thickness
- Warm color palette: browns, greens, blues, yellows
- Simple, uncluttered backgrounds
- Clear emotional expressions
- Consistent character design throughout the story
`;

// 为每个页面构建专门的英文提示词
function buildPromptForPage(page) {
  let prompt = BASE_STYLE;
  
  switch (page.id) {
    case 1:
      prompt += `
Scene: A cute brown bear (Bobo) sitting in front of a small wooden house in the forest, looking curiously at distant trees and flowers. The bear has big curious eyes and a kind expression. Morning sunlight filters through the trees. The wooden house is cozy and small. In the background, there are tall trees and colorful wildflowers. The bear appears shy but curious, sitting peacefully on a tree stump or small chair.
Characters: ${CHARACTERS.bobo}
Mood: Peaceful, curious, slightly shy
Setting: Forest clearing with a small wooden house, morning light
`;
      break;
      
    case 2:
      prompt += `
Scene: The same brown bear (Bobo) leaving his wooden house for the first time, walking along a forest path toward the source of singing. He looks determined but nervous, taking his first brave steps away from home. The path winds through the forest with dappled sunlight. Musical notes or sound waves could be subtly indicated in the air to show the singing.
Characters: ${CHARACTERS.bobo}
Mood: Brave, curious, slightly nervous
Setting: Forest path leading away from the wooden house, morning atmosphere
`;
      break;
      
    case 3:
      prompt += `
Scene: Bobo the brown bear arriving at an open meadow where a white rabbit (Lili) is picking wildflowers. The rabbit has snow-white fur, pink nose, and long ears, humming while collecting colorful flowers. The meadow is filled with various wildflowers - daisies, buttercups, and other colorful blooms. Bobo is watching from the edge of the meadow, amazed by the beautiful scene.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}
Mood: Wonder, beauty, peaceful discovery
Setting: Open flower meadow with colorful wildflowers, sunny day
`;
      break;
      
    case 5:
      prompt += `
Scene: Bobo and Lili meeting for the first time. Lili the white rabbit is smiling warmly at Bobo, welcoming him. She's holding some flowers and appears to be making a flower crown. Bobo is slowly approaching, looking shy but happy. The scene shows the beginning of their friendship with both characters having friendly, welcoming expressions.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}
Mood: Friendly, welcoming, beginning of friendship
Setting: Flower meadow, warm and inviting atmosphere
`;
      break;
      
    case 6:
      prompt += `
Scene: Bobo and Lili working together to collect flowers in the meadow. They are chatting while picking flowers, both looking happy and comfortable with each other. Lili is explaining about other forest friends while they work. Both characters show growing friendship and trust. Flowers are scattered around them as they work together.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}
Mood: Collaborative, friendly, growing trust
Setting: Flower meadow, afternoon light, flowers everywhere
`;
      break;
      
    case 7:
      prompt += `
Scene: Bobo looking both excited and nervous about the upcoming picnic. Lili is beside him with an encouraging, reassuring smile. Bobo's expression shows mixed emotions - excitement about making new friends but also nervousness about meeting so many animals. Lili's presence is comforting and supportive.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}
Mood: Mixed emotions - excitement and nervousness, supportive friendship
Setting: Still in the meadow or transitioning toward the forest
`;
      break;
      
    case 9:
      prompt += `
Scene: A forest picnic under a large oak tree with all the animal friends sharing food. The owl has honey cookies, the squirrel brothers have nut salad, the turtle has fresh berries. Bobo sits among them but looks a bit sad because he didn't bring anything. The other animals are happily sharing their food. The scene shows a warm community gathering.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}, ${CHARACTERS.owl}, ${CHARACTERS.squirrels}, ${CHARACTERS.turtle}
Mood: Community warmth but Bobo feels left out
Setting: Under a large oak tree, picnic setup with various foods
`;
      break;
      
    case 10:
      prompt += `
Scene: Lili comforting Bobo with gentle words. Lili is speaking softly to Bobo, who is starting to feel better. The other animal friends are also showing acceptance and warmth toward Bobo. The scene emphasizes the emotional support and understanding that true friendship provides. Bobo's expression is changing from sad to warm and grateful.
Characters: ${CHARACTERS.bobo}, ${CHARACTERS.lili}, other forest friends in background
Mood: Comfort, understanding, emotional warmth
Setting: Continuing the picnic scene, focus on emotional connection
`;
      break;
      
    case 12:
      prompt += `
Scene: Bobo happily leaving his wooden house in the morning to visit his friends. He looks confident, joyful, and transformed from the shy bear he once was. The forest around him feels welcoming and familiar. Perhaps some of his friends can be seen in the distance or he's walking toward where they gather. This shows his complete transformation and happiness.
Characters: ${CHARACTERS.bobo}, possibly glimpses of friends in the distance
Mood: Joy, confidence, fulfillment, transformation complete
Setting: Forest path from his house, morning light, welcoming atmosphere
`;
      break;
  }
  
  return prompt.trim();
}

// 初始化LIBLIB服务
async function initializeLiblibService() {
  try {
    // 从环境变量获取API密钥
    const accessKey = process.env.VITE_LIBLIB_ACCESS_KEY;
    const secretKey = process.env.VITE_LIBLIB_SECRET_KEY;
    
    if (!accessKey || !secretKey) {
      throw new Error('请在.env文件中设置LIBLIB API密钥：VITE_LIBLIB_ACCESS_KEY 和 VITE_LIBLIB_SECRET_KEY');
    }
    
    // 初始化LIBLIB服务
    liblibService.initializeApiKeys(accessKey, secretKey);
    console.log('✅ LIBLIB API服务初始化成功');
    
    return true;
  } catch (error) {
    console.error('❌ LIBLIB API服务初始化失败:', error.message);
    return false;
  }
}

// 生成单个页面的插画
async function generatePageIllustration(page, index, total) {
  try {
    console.log(`\n🎨 正在生成第${page.id}页插画 (${index + 1}/${total})`);
    console.log(`📝 页面内容: ${page.content.substring(0, 100)}...`);
    
    // 构建提示词
    const prompt = buildPromptForPage(page);
    console.log(`🔤 提示词长度: ${prompt.length} 字符`);
    
    // 生成图片
    const imageUrl = await liblibService.generateImage(prompt, '6-8岁');
    
    console.log(`✅ 第${page.id}页插画生成成功`);
    console.log(`🔗 图片URL: ${imageUrl}`);
    
    return {
      pageId: page.id,
      imageUrl: imageUrl,
      imagePath: page.imagePath,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ 第${page.id}页插画生成失败:`, error.message);
    return {
      pageId: page.id,
      imageUrl: null,
      imagePath: page.imagePath,
      success: false,
      error: error.message
    };
  }
}

// 主函数：批量生成所有插画
export async function generateAllStoryIllustrations() {
  console.log('🚀 开始批量生成《小熊波波的友谊冒险》插画');
  console.log(`📊 总共需要生成 ${NON_INTERACTIVE_PAGES.length} 张插画`);
  
  // 初始化服务
  const initialized = await initializeLiblibService();
  if (!initialized) {
    return { success: false, message: 'API服务初始化失败' };
  }
  
  const results = [];
  const startTime = Date.now();
  
  // 逐个生成插画（避免并发限制）
  for (let i = 0; i < NON_INTERACTIVE_PAGES.length; i++) {
    const page = NON_INTERACTIVE_PAGES[i];
    const result = await generatePageIllustration(page, i, NON_INTERACTIVE_PAGES.length);
    results.push(result);
    
    // 在生成之间添加延迟，避免API限制
    if (i < NON_INTERACTIVE_PAGES.length - 1) {
      console.log('⏳ 等待5秒后继续下一张...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  // 统计结果
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n📊 生成结果统计:');
  console.log(`✅ 成功: ${successful} 张`);
  console.log(`❌ 失败: ${failed} 张`);
  console.log(`⏱️ 总耗时: ${duration} 秒`);
  
  if (successful > 0) {
    console.log('\n🎉 成功生成的插画:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   第${r.pageId}页: ${r.imageUrl}`);
    });
  }
  
  if (failed > 0) {
    console.log('\n⚠️ 生成失败的页面:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   第${r.pageId}页: ${r.error}`);
    });
  }
  
  return {
    success: failed === 0,
    results: results,
    statistics: {
      total: NON_INTERACTIVE_PAGES.length,
      successful: successful,
      failed: failed,
      duration: duration
    }
  };
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllStoryIllustrations()
    .then(result => {
      if (result.success) {
        console.log('\n🎊 所有插画生成完成！');
      } else {
        console.log('\n⚠️ 插画生成过程中遇到问题，请查看上方详细信息。');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 插画生成过程中发生严重错误:', error);
      process.exit(1);
    });
}

export default {
  generateAllStoryIllustrations,
  NON_INTERACTIVE_PAGES,
  buildPromptForPage
};
