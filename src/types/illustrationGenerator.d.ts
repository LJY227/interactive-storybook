// TypeScript声明文件：插画生成器类型定义

/**
 * 从用户回答中提取的关键内容
 */
export interface ExtractedContent {
  characters: string[];
  actions: string[];
  emotions: string[];
  sceneElements: string[];
  items: string[];
  timeAndWeather: string[];
}

/**
 * 图像信息接口
 */
export interface ImageInfo {
  pageIndex: number;
  url: string;
}

/**
 * 故事上下文接口
 */
export interface StoryContext {
  currentPageIndex: number;
  currentPage: {
    id: number;
    content?: string;
    question?: string;
    isInteractive?: boolean;
  };
}

/**
 * 从用户回答中提取关键内容
 * @param answer - 用户的回答内容
 * @returns 提取的关键内容
 */
export function extractKeyContent(answer: string): ExtractedContent;

/**
 * 构建图像生成提示词
 * @param answer - 用户的回答内容
 * @param context - 当前故事上下文
 * @param pageId - 页面ID
 * @returns 完整的提示词
 */
export function buildImagePrompt(answer: string, context: StoryContext, pageId: number): string;

/**
 * 获取参考图像URL
 * @param currentPageIndex - 当前页面索引
 * @param allImages - 所有可用的图像URL
 * @returns 参考图像URL数组
 */
export function getReferenceImages(currentPageIndex: number, allImages: ImageInfo[]): string[];

/**
 * 调用LIBLIB AI API生成图像
 * @param prompt - 图像生成提示词
 * @param referenceImages - 参考图像URL数组（用于image2image）
 * @param userAnswer - 用户回答
 * @param sceneDescription - 场景描述
 * @returns 生成的图像URL
 */
export function generateImage(
  prompt: string, 
  referenceImages?: string[], 
  userAnswer?: string, 
  sceneDescription?: string
): Promise<string>;

/**
 * 保存生成的图像到本地缓存
 * @param imageUrl - 生成的图像URL
 * @param pageId - 页面ID
 * @param answer - 用户回答（用于个性化缓存）
 * @returns 本地图像路径
 */
export function saveGeneratedImage(imageUrl: string, pageId: number, answer: string): Promise<string>;

/**
 * 从缓存中获取已生成的图像
 * @param pageId - 页面ID
 * @param answer - 用户回答
 * @returns 缓存的图像URL或null
 */
export function getCachedImage(pageId: number, answer: string): string | null;

/**
 * 主函数：根据用户回答生成插画
 * @param answer - 用户的回答内容
 * @param pageId - 交互页面ID
 * @param context - 当前故事上下文
 * @param allImages - 所有可用的图像
 * @returns 生成的图像URL或路径
 */
export function generateIllustrationFromAnswer(
  answer: string, 
  pageId: number, 
  context: StoryContext, 
  allImages: ImageInfo[]
): Promise<string>;

/**
 * 检查生成的插画是否与现有风格一致
 * @param generatedImageUrl - 生成的图像URL
 * @param referenceImages - 参考图像URL数组
 * @returns 是否风格一致
 */
export function checkStyleConsistency(generatedImageUrl: string, referenceImages: string[]): Promise<boolean>;

/**
 * 为image2image功能优化提示词
 * @param originalPrompt - 原始提示词
 * @param userAnswer - 用户回答
 * @param sceneDescription - 场景描述
 * @returns 优化后的提示词
 */
export function optimizePromptForImage2Image(
  originalPrompt: string, 
  userAnswer?: string, 
  sceneDescription?: string
): string;

/**
 * 清理和过滤用户输入，避免敏感内容
 * @param input - 用户输入
 * @returns 清理后的输入
 */
export function sanitizeUserInput(input: string): string;

/**
 * 构建交互式插画提示词
 * @param userAnswer - 用户回答
 * @param storyContext - 故事上下文
 * @param pageNumber - 页面编号
 * @returns 交互式插画提示词
 */
export function buildInteractiveIllustrationPrompt(
  userAnswer: string, 
  storyContext: string, 
  pageNumber: number
): string;

/**
 * 生成基于用户回答的缓存键
 * @param pageId - 页面ID
 * @param answer - 用户回答
 * @returns 缓存键
 */
export function generateCacheKey(pageId: number, answer: string): string;

// 默认导出
declare const illustrationGenerator: {
  generateIllustrationFromAnswer: typeof generateIllustrationFromAnswer;
  checkStyleConsistency: typeof checkStyleConsistency;
  buildImagePrompt: typeof buildImagePrompt;
  extractKeyContent: typeof extractKeyContent;
  generateImage: typeof generateImage;
  saveGeneratedImage: typeof saveGeneratedImage;
  getCachedImage: typeof getCachedImage;
  optimizePromptForImage2Image: typeof optimizePromptForImage2Image;
  sanitizeUserInput: typeof sanitizeUserInput;
  buildInteractiveIllustrationPrompt: typeof buildInteractiveIllustrationPrompt;
  generateCacheKey: typeof generateCacheKey;
};

export default illustrationGenerator;
