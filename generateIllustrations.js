// 运行脚本：生成《小熊波波的友谊冒险》插画
// 使用方法：node generateIllustrations.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 动态导入LIBLIB服务
async function loadServices() {
  try {
    // 导入LIBLIB服务
    const { default: liblibService } = await import('./src/services/liblibService.js');
    return { liblibService };
  } catch (error) {
    console.error('❌ 无法加载服务模块:', error.message);
    throw error;
  }
}

// 故事页面数据
const STORY_PAGES = [
  {
    id: 1,
    content: "波波是一只住在森林里的小棕熊。他有一双好奇的大眼睛和一颗善良的心。每天早晨，波波都会坐在自己的小木屋前，望着远处的大树和花朵，但他从来不敢走得太远。",
    prompt: "A cute brown bear (Bobo) sitting in front of a small wooden house in the forest, looking curiously at distant trees and flowers. Children's watercolor illustration style, warm and friendly, designed for autistic children aged 6-8. Soft gentle colors, clear outlines, warm browns and greens. The bear has big curious eyes, round face, kind expression. Morning sunlight, cozy wooden house, tall trees and colorful wildflowers in background. Peaceful, curious, slightly shy mood."
  },
  {
    id: 2,
    content: "一天早晨，波波听到一阵欢快的歌声。\"那是谁在唱歌呢？\"波波好奇地想。他鼓起勇气，第一次离开了自己的小木屋，沿着小路向歌声传来的方向走去。",
    prompt: "Brown bear (Bobo) leaving his wooden house for the first time, walking along a forest path toward singing sounds. Children's watercolor illustration, warm friendly style for autistic children 6-8 years. The bear looks determined but nervous, taking brave first steps. Forest path winds through trees with dappled sunlight. Musical notes subtly shown in air. Brave, curious, slightly nervous mood. Consistent character design with previous illustration."
  },
  {
    id: 3,
    content: "波波来到了一片开阔的草地。他看到一只小兔子正在那里采摘野花。小兔子有着雪白的毛发和粉红的鼻子，正哼着波波从未听过的歌曲。",
    prompt: "Bobo the brown bear arriving at an open meadow where a white rabbit (Lili) picks wildflowers. Children's watercolor illustration for autistic children 6-8. White rabbit has snow-white fur, pink nose, long ears, humming while collecting colorful flowers. Meadow filled with daisies, buttercups, colorful blooms. Bobo watching from meadow edge, amazed. Wonder, beauty, peaceful discovery mood. Consistent warm color palette."
  },
  {
    id: 5,
    content: "小兔子看到了波波，友好地笑了笑。\"你好，我叫莉莉！\"小兔子说，\"我正在采集这些美丽的花朵，准备做一个花环。你想一起来吗？\"波波点点头，慢慢地走近了莉莉。",
    prompt: "Bobo and Lili meeting for the first time. White rabbit Lili smiling warmly at brown bear Bobo, welcoming him. She holds flowers, making flower crown. Bobo slowly approaching, shy but happy. Children's watercolor illustration for autistic children 6-8. Beginning of friendship, both with friendly welcoming expressions. Flower meadow setting, warm inviting atmosphere. Consistent character design."
  },
  {
    id: 6,
    content: "波波和莉莉一起采集花朵，他们边采边聊。莉莉告诉波波，森林里还有许多其他的动物朋友。\"我们每周五都会在大橡树下举行野餐会，\"莉莉说，\"你愿意来参加吗？\"",
    prompt: "Bobo and Lili working together collecting flowers in meadow. Both chatting while picking flowers, looking happy and comfortable. Lili explaining about forest friends while working. Growing friendship and trust shown. Flowers scattered around them. Children's watercolor illustration for autistic children 6-8. Collaborative, friendly, growing trust mood. Afternoon light, flowers everywhere."
  },
  {
    id: 7,
    content: "波波既兴奋又紧张。他从来没有参加过野餐会，也没有见过那么多的动物朋友。但莉莉的笑容让他感到安心，于是他答应了。",
    prompt: "Bobo looking both excited and nervous about upcoming picnic. Lili beside him with encouraging, reassuring smile. Bobo's expression shows mixed emotions - excitement about new friends but nervousness about meeting many animals. Lili's presence comforting and supportive. Children's watercolor illustration for autistic children 6-8. Mixed emotions - excitement and nervousness, supportive friendship mood."
  },
  {
    id: 9,
    content: "野餐会上，大家分享了各自带来的美食。猫头鹰带来了蜂蜜饼干，松鼠兄弟带来了坚果沙拉，乌龟带来了新鲜的浆果。波波没有带任何东西，他感到有些难过。",
    prompt: "Forest picnic under large oak tree with animal friends sharing food. Owl with honey cookies, squirrel brothers with nut salad, turtle with fresh berries. Bobo sits among them looking sad because he brought nothing. Other animals happily sharing food. Warm community gathering. Children's watercolor illustration for autistic children 6-8. Community warmth but Bobo feels left out. Oak tree setting, picnic with various foods."
  },
  {
    id: 10,
    content: "\"别担心，波波，\"莉莉轻声说，\"重要的不是你带了什么，而是你来了。友谊不是用礼物来衡量的，而是用心来感受的。\"波波听了，心里暖暖的。",
    prompt: "Lili comforting Bobo with gentle words. Lili speaking softly to Bobo, who starts feeling better. Other animal friends showing acceptance and warmth toward Bobo. Scene emphasizes emotional support and understanding of true friendship. Bobo's expression changing from sad to warm and grateful. Children's watercolor illustration for autistic children 6-8. Comfort, understanding, emotional warmth mood."
  },
  {
    id: 12,
    content: "现在，每天早晨，波波都会兴高采烈地离开自己的小木屋，去拜访他的朋友们。他知道，真正的友谊需要勇气去开始，需要时间去培养，更需要真心去维护。在森林里，波波找到了属于自己的幸福。",
    prompt: "Bobo happily leaving his wooden house in morning to visit friends. He looks confident, joyful, transformed from shy bear he once was. Forest feels welcoming and familiar. Friends glimpsed in distance or he's walking toward gathering place. Shows complete transformation and happiness. Children's watercolor illustration for autistic children 6-8. Joy, confidence, fulfillment, transformation complete mood. Forest path from house, morning light, welcoming atmosphere."
  }
];

// 生成单个插画
async function generateSingleIllustration(liblibService, page, index, total) {
  try {
    console.log(`\n🎨 正在生成第${page.id}页插画 (${index + 1}/${total})`);
    console.log(`📝 页面内容: ${page.content.substring(0, 80)}...`);
    
    // 生成图片
    const imageUrl = await liblibService.generateImage(page.prompt, '6-8岁');
    
    console.log(`✅ 第${page.id}页插画生成成功`);
    console.log(`🔗 图片URL: ${imageUrl}`);
    
    return {
      pageId: page.id,
      imageUrl: imageUrl,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ 第${page.id}页插画生成失败:`, error.message);
    return {
      pageId: page.id,
      success: false,
      error: error.message
    };
  }
}

// 主函数
async function main() {
  console.log('🚀 开始生成《小熊波波的友谊冒险》插画');
  console.log(`📊 总共需要生成 ${STORY_PAGES.length} 张插画`);
  
  try {
    // 检查环境变量
    const accessKey = process.env.VITE_LIBLIB_ACCESS_KEY;
    const secretKey = process.env.VITE_LIBLIB_SECRET_KEY;
    
    if (!accessKey || !secretKey) {
      throw new Error('请在.env文件中设置LIBLIB API密钥：\nVITE_LIBLIB_ACCESS_KEY=your_access_key\nVITE_LIBLIB_SECRET_KEY=your_secret_key');
    }
    
    // 加载服务
    const { liblibService } = await loadServices();
    
    // 初始化LIBLIB服务
    liblibService.initializeApiKeys(accessKey, secretKey);
    console.log('✅ LIBLIB API服务初始化成功');
    
    const results = [];
    const startTime = Date.now();
    
    // 逐个生成插画
    for (let i = 0; i < STORY_PAGES.length; i++) {
      const page = STORY_PAGES[i];
      const result = await generateSingleIllustration(liblibService, page, i, STORY_PAGES.length);
      results.push(result);
      
      // 在生成之间添加延迟
      if (i < STORY_PAGES.length - 1) {
        console.log('⏳ 等待3秒后继续下一张...');
        await new Promise(resolve => setTimeout(resolve, 3000));
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
      
      console.log('\n📋 插画URL列表（用于更新故事数据）:');
      results.filter(r => r.success).forEach(r => {
        console.log(`page${r.pageId}: "${r.imageUrl}",`);
      });
    }
    
    if (failed > 0) {
      console.log('\n⚠️ 生成失败的页面:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`   第${r.pageId}页: ${r.error}`);
      });
    }
    
    if (failed === 0) {
      console.log('\n🎊 所有插画生成完成！');
      console.log('💡 接下来您可以：');
      console.log('   1. 将生成的图片URL保存到本地');
      console.log('   2. 更新故事数据文件中的图片路径');
      console.log('   3. 测试绘本应用中的图片显示');
    }
    
  } catch (error) {
    console.error('\n💥 插画生成过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('💥 程序执行失败:', error);
  process.exit(1);
});
