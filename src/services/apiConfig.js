// API配置管理
// 专门用于LIBLIB AI服务的API配置

export const API_SERVICES = {
  // 图片生成服务（LIBLIB AI）
  IMAGE_GENERATION: 'liblib'
};

export const API_ENDPOINTS = {
  liblib: {
    baseUrl: 'https://openapi.liblibai.cloud',
    textToImage: '/api/generate/webui/text2img/ultra',
    imageToImage: '/api/generate/webui/img2img/ultra',
    queryResult: '/api/generate/query'
  }
};

export const API_MODELS = {
  liblib: {
    templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4' // 星流Star-3 Alpha模板ID
  }
};

// 获取环境变量中的LIBLIB API密钥
export function getLiblibApiKeys() {
  return {
    accessKey: import.meta.env.VITE_LIBLIB_ACCESS_KEY,
    secretKey: import.meta.env.VITE_LIBLIB_SECRET_KEY
  };
}

// 验证LIBLIB API密钥格式
export function validateLiblibApiKeys(accessKey, secretKey) {
  if (!accessKey || typeof accessKey !== 'string' || accessKey.trim() === '') {
    return false;
  }

  if (!secretKey || typeof secretKey !== 'string' || secretKey.trim() === '') {
    return false;
  }

  // LIBLIB AccessKey通常20-30位，SecretKey通常30位以上
  return accessKey.length >= 20 && secretKey.length >= 30;
}

// 获取LIBLIB服务配置
export function getLiblibConfig() {
  return {
    endpoints: API_ENDPOINTS.liblib,
    models: API_MODELS.liblib
  };
}

export default {
  API_SERVICES,
  API_ENDPOINTS,
  API_MODELS,
  getLiblibApiKeys,
  validateLiblibApiKeys,
  getLiblibConfig
};
