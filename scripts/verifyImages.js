// 验证图片文件的完整性和可访问性
// 使用方法：node scripts/verifyImages.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const projectRoot = path.join(__dirname, '..');
const imagesDir = path.join(projectRoot, 'public', 'images');

console.log('🔍 开始验证图片文件...');
console.log('📁 图片目录:', imagesDir);

// 预期的图片文件列表
const expectedImages = [
  'page1.png',
  'page2.png', 
  'page3.png',
  'page5.png',
  'page6.png',
  'page7.png',
  'page9.png',
  'page10.png',
  'page12.png'
];

// 验证图片文件
function verifyImages() {
  const results = {
    found: [],
    missing: [],
    extra: [],
    errors: []
  };

  // 检查目录是否存在
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ 图片目录不存在:', imagesDir);
    return results;
  }

  // 读取实际存在的文件
  let actualFiles = [];
  try {
    actualFiles = fs.readdirSync(imagesDir).filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    );
  } catch (error) {
    console.error('❌ 读取图片目录失败:', error.message);
    results.errors.push(`读取目录失败: ${error.message}`);
    return results;
  }

  console.log(`📊 找到 ${actualFiles.length} 个图片文件`);

  // 检查预期文件是否存在
  expectedImages.forEach(expectedFile => {
    if (actualFiles.includes(expectedFile)) {
      results.found.push(expectedFile);
      
      // 检查文件大小
      try {
        const filePath = path.join(imagesDir, expectedFile);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`✅ ${expectedFile} - ${sizeKB}KB`);
        
        if (stats.size === 0) {
          results.errors.push(`${expectedFile} 文件大小为0`);
        }
      } catch (error) {
        results.errors.push(`${expectedFile} 读取失败: ${error.message}`);
      }
    } else {
      results.missing.push(expectedFile);
      console.log(`❌ 缺失: ${expectedFile}`);
    }
  });

  // 检查额外的文件
  actualFiles.forEach(actualFile => {
    if (!expectedImages.includes(actualFile)) {
      results.extra.push(actualFile);
      console.log(`⚠️  额外文件: ${actualFile}`);
    }
  });

  return results;
}

// 验证图片URL的可访问性
async function verifyImageUrls() {
  console.log('\n🌐 验证图片URL可访问性...');
  
  const imageUrls = [
    'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/d43741e63e625278cec8c107a710fe36e9eba6a658baf4742dc33375c007da5a.png',
    'https://liblibai-tmp-image.liblib.cloud/img/9dbb5de4e30a42afaff5b04e13eb518e/f0913e968c15d15fef3a3c96493cfa78aa36895603f79d5ebae472d5b577e77d.png',
    // 可以添加更多URL
  ];

  const urlResults = {
    accessible: [],
    failed: []
  };

  for (const url of imageUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        urlResults.accessible.push(url);
        console.log(`✅ URL可访问: ${url.substring(0, 60)}...`);
      } else {
        urlResults.failed.push({ url, status: response.status });
        console.log(`❌ URL不可访问 (${response.status}): ${url.substring(0, 60)}...`);
      }
    } catch (error) {
      urlResults.failed.push({ url, error: error.message });
      console.log(`❌ URL访问失败: ${url.substring(0, 60)}... - ${error.message}`);
    }
  }

  return urlResults;
}

// 生成验证报告
function generateReport(results, urlResults) {
  console.log('\n📋 验证报告:');
  console.log('='.repeat(50));
  
  console.log(`\n📊 本地图片文件统计:`);
  console.log(`✅ 找到: ${results.found.length}/${expectedImages.length} 个预期文件`);
  console.log(`❌ 缺失: ${results.missing.length} 个文件`);
  console.log(`⚠️  额外: ${results.extra.length} 个文件`);
  console.log(`🚨 错误: ${results.errors.length} 个错误`);

  if (results.missing.length > 0) {
    console.log(`\n❌ 缺失的文件:`);
    results.missing.forEach(file => console.log(`   - ${file}`));
  }

  if (results.extra.length > 0) {
    console.log(`\n⚠️  额外的文件:`);
    results.extra.forEach(file => console.log(`   - ${file}`));
  }

  if (results.errors.length > 0) {
    console.log(`\n🚨 错误信息:`);
    results.errors.forEach(error => console.log(`   - ${error}`));
  }

  if (urlResults) {
    console.log(`\n🌐 远程URL验证:`);
    console.log(`✅ 可访问: ${urlResults.accessible.length} 个URL`);
    console.log(`❌ 失败: ${urlResults.failed.length} 个URL`);
  }

  // 总体状态
  const isHealthy = results.missing.length === 0 && results.errors.length === 0;
  console.log(`\n🎯 总体状态: ${isHealthy ? '✅ 健康' : '❌ 需要修复'}`);

  return isHealthy;
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始图片验证流程...\n');
    
    // 验证本地图片文件
    const results = verifyImages();
    
    // 验证远程URL（可选）
    let urlResults = null;
    try {
      urlResults = await verifyImageUrls();
    } catch (error) {
      console.log('⚠️  跳过URL验证:', error.message);
    }
    
    // 生成报告
    const isHealthy = generateReport(results, urlResults);
    
    console.log('\n💡 建议:');
    if (results.missing.length > 0) {
      console.log('   - 运行 downloadImages.js 下载缺失的图片');
    }
    if (results.extra.length > 0) {
      console.log('   - 检查额外文件是否需要保留');
    }
    if (results.errors.length > 0) {
      console.log('   - 修复文件错误后重新验证');
    }
    
    console.log('\n✨ 验证完成!');
    
    // 返回退出码
    process.exit(isHealthy ? 0 : 1);
    
  } catch (error) {
    console.error('💥 验证过程失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main();
