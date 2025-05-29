# 🎨 快速开始：生成绘本插画

## 📋 准备清单

### ✅ 1. 确认API密钥已配置
确保您的`.env`文件包含LIBLIB API密钥：

```env
VITE_LIBLIB_ACCESS_KEY=your_access_key_here
VITE_LIBLIB_SECRET_KEY=your_secret_key_here
```

### ✅ 2. 安装依赖
```bash
npm install
```

## 🧪 第一步：测试单张插画

在生成全套插画之前，建议先测试一张：

```bash
npm run test-illustration
```

**预期输出：**
```
🧪 开始测试LIBLIB AI插画生成
✅ API密钥配置检查通过
✅ LIBLIB服务模块加载成功
✅ LIBLIB API密钥初始化成功
🎨 开始生成测试插画...
⏳ 预计需要1-2分钟，请耐心等待...

🎉 测试插画生成成功！
🔗 图片URL: https://example.com/generated-image.jpg
⏱️ 生成耗时: 85 秒
```

**如果测试成功**，您将看到生成的图片URL，可以在浏览器中查看效果。

## 🚀 第二步：生成全套插画

测试通过后，生成完整的9张插画：

```bash
npm run generate-illustrations
```

**生成过程：**
- 总共9张插画（非交互页面）
- 每张图片间隔3秒生成
- 预计总耗时：15-20分钟

**生成的页面：**
1. 第1页：波波在小木屋前
2. 第2页：波波离开家寻找歌声  
3. 第3页：波波发现莉莉在采花
4. 第5页：波波和莉莉初次相遇
5. 第6页：波波和莉莉一起采花
6. 第7页：波波对野餐会既兴奋又紧张
7. 第9页：森林野餐会场景
8. 第10页：莉莉安慰波波
9. 第12页：波波快乐地去拜访朋友

## 📊 第三步：获取结果

生成完成后，控制台会显示：

```
📊 生成结果统计:
✅ 成功: 9 张
❌ 失败: 0 张
⏱️ 总耗时: 1200 秒

🎉 成功生成的插画:
   第1页: https://cdn.liblibai.com/image1.jpg
   第2页: https://cdn.liblibai.com/image2.jpg
   ...

📋 插画URL列表（用于更新故事数据）:
page1: "https://cdn.liblibai.com/image1.jpg",
page2: "https://cdn.liblibai.com/image2.jpg",
...
```

## 🔄 第四步：更新故事数据

将生成的URL更新到`src/data/storyData.ts`：

```typescript
{
  id: 1,
  content: "波波是一只住在森林里的小棕熊...",
  isInteractive: false,
  image: "https://cdn.liblibai.com/generated-image1.jpg"  // 更新这里
},
```

## 🎯 第五步：测试效果

启动应用查看插画效果：

```bash
npm run dev
```

在浏览器中打开应用，查看新生成的插画是否正确显示。

## ⚠️ 常见问题

### Q: API密钥错误
**A:** 检查`.env`文件中的密钥格式，确保没有多余的空格或引号。

### Q: 生成失败
**A:** 
1. 检查网络连接
2. 确认LIBLIB账户余额
3. 稍后重试

### Q: 图片不显示
**A:**
1. 确认URL已正确更新到storyData.ts
2. 检查图片URL是否可访问
3. 清除浏览器缓存

### Q: 生成速度慢
**A:** 这是正常的，LIBLIB AI需要1-2分钟生成一张高质量插画。

## 💡 优化建议

### 成本控制
- 先测试1张确认效果
- 满意后再批量生成
- 避免重复生成相同内容

### 质量保证
- 生成的插画专为自闭症儿童设计
- 色彩温和，表情清晰
- 风格一致，符合绘本需求

### 备份建议
- 保存所有生成的图片URL
- 建议下载图片到本地备份
- 记录生成参数以便后续调整

## 🎊 完成！

完成以上步骤后，您将拥有一套完整的《小熊波波的友谊冒险》插画集，为自闭症儿童提供温暖、专业的视觉体验。

---

**需要帮助？** 查看详细文档：`ILLUSTRATION_GENERATION_GUIDE.md`
