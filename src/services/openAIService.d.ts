declare module '../services/openAIService.js' {
  export default {
    isApiKeyInitialized: () => boolean;
    generateStory: (ageGroup: string, theme: string) => Promise<any>;
    generateImage: (prompt: string, ageGroup: string) => Promise<string>;
    analyzePerformance: (questions: string[], answers: string[]) => Promise<any>;
  };
}
