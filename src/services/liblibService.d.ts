declare module '../services/liblibService' {
  export function generateSignature(params: any): Promise<string>;
  export function testImg2ImgAPI(sourceImageUrl: string, prompt: string): Promise<string>;
  export default {
    generateSignature: (params: any) => Promise<string>;
    testImg2ImgAPI: (sourceImageUrl: string, prompt: string) => Promise<string>;
  };
}
