declare module '../services/illustrationGenerator' {
  export function generateIllustrationFromAnswer(
    userAnswer: string,
    pageId: number,
    context: any,
    allImages: any[]
  ): Promise<string>;
  
  export function clearImageCache(): void;
  export function getPageCachedImages(pageId: number): any[];
  export function getCacheStats(): any;
}
