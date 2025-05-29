// 下载插画到本地public文件夹
// 使用方法：node scripts/downloadImages.js

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 插画数据
const illustrations = [
  {
    pageId: 1,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png",
    filename: "page1.png",
    description: "波波坐在小木屋前"
  },
  {
    pageId: 2,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/f0913e968c15d15fef3a3c96493cfa78aa36895603f79d5ebae472d5b577e77d.png",
    filename: "page2.png",
    description: "波波听到歌声离开木屋"
  },
  {
    pageId: 3,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/8acc5eb6536c623de7691cb153a67c6710d6f21bec47e9a88649f1b2e008999d.png",
    filename: "page3.png",
    description: "波波看到莉莉采花"
  },
  {
    pageId: 5,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/a8e2577bc0b4b5b4090c3a10b98100223a02bc6d4536a9e768f4f00faeda0a31.png",
    filename: "page5.png",
    description: "莉莉欢迎波波"
  },
  {
    pageId: 6,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/7bcd44a0f7e6262cceb55518bb7e653d19a4b33953b384426d14f6bb67ddfa25.png",
    filename: "page6.png",
    description: "波波和莉莉一起采花"
  },
  {
    pageId: 7,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/25f2f241307064a8d349dc9e6da17f9f4d8032be18290371adf9d5e03aa31c3a.png",
    filename: "page7.png",
    description: "波波既兴奋又紧张"
  },
  {
    pageId: 9,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/10405b84e0f1ecd9b10d1dd932eaec2075fdd1fffbbeed1125a29a7e87f78689.png",
    filename: "page9.png",
    description: "野餐会分享美食"
  },
  {
    pageId: 10,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/871e52cd0151f742e041ebd426271c0dcb2529a133ddf9b9451e55313f82b8a8.png",
    filename: "page10.png",
    description: "莉莉安慰波波"
  },
  {
    pageId: 12,
    url: "https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/f3323f833f8502476094baed4b9c9b5ee6bfaa227dacd58b04b8c53c4bc932ba.png",
    filename: "page12.png",
    description: "波波快乐地去拜访朋友"
  }
];

// 确保目录存在 - 修改路径为相对于项目根目录
const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ 创建images目录');
}

// 下载单个图片
function downloadImage(illustration) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, illustration.filename);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  第${illustration.pageId}页插画已存在: ${illustration.filename}`);
      resolve({ success: true, pageId: illustration.pageId, skipped: true });
      return;
    }

    console.log(`📥 正在下载第${illustration.pageId}页插画: ${illustration.description}`);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(illustration.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ 第${illustration.pageId}页插画下载完成: ${illustration.filename}`);
        resolve({ success: true, pageId: illustration.pageId, skipped: false });
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // 删除不完整的文件
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 主函数
async function main() {
  console.log('🚀 开始下载《小熊波波的友谊冒险》插画到本地');
  console.log(`📊 总共需要下载 ${illustrations.length} 张插画\n`);
  
  const results = [];
  const startTime = Date.now();
  
  try {
    // 逐个下载插画
    for (let i = 0; i < illustrations.length; i++) {
      const illustration = illustrations[i];
      try {
        const result = await downloadImage(illustration);
        results.push(result);
        
        // 在下载之间添加短暂延迟
        if (i < illustrations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ 第${illustration.pageId}页插画下载失败:`, error.message);
        results.push({ success: false, pageId: illustration.pageId, error: error.message });
      }
    }
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    // 统计结果
    const successful = results.filter(r => r.success).length;
    const skipped = results.filter(r => r.success && r.skipped).length;
    const downloaded = results.filter(r => r.success && !r.skipped).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n📊 下载结果统计:');
    console.log(`✅ 成功: ${successful} 张`);
    console.log(`📥 新下载: ${downloaded} 张`);
    console.log(`⏭️  已存在: ${skipped} 张`);
    console.log(`❌ 失败: ${failed} 张`);
    console.log(`⏱️  总耗时: ${duration} 秒`);
    
    if (failed === 0) {
      console.log('\n🎉 所有插画下载完成！');
      console.log('📁 图片保存位置: public/images/');
      console.log('💡 接下来您可以：');
      console.log('   1. 运行更新脚本将图片路径改为本地路径');
      console.log('   2. 检查public/images/文件夹中的图片');
      console.log('   3. 测试绘本应用中的图片显示');
    } else {
      console.log('\n⚠️  部分图片下载失败，请检查网络连接后重试');
    }
    
  } catch (error) {
    console.error('\n💥 下载过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('💥 程序执行失败:', error);
  process.exit(1);
});
