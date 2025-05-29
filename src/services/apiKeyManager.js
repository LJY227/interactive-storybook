// 安全的API密钥处理
// 专门用于LIBLIB AI API密钥管理
// 注意：实际部署时，应使用环境变量或安全的密钥管理服务

// 创建一个安全的API密钥存储类
class ApiKeyManager {
  constructor() {
    // LIBLIB API密钥（AccessKey + SecretKey）
    this._liblibAccessKey = null;
    this._liblibSecretKey = null;
    this._liblibInitialized = false;
  }

  // 初始化LIBLIB API密钥
  initializeLiblib(accessKey, secretKey) {
    if (!accessKey || typeof accessKey !== 'string' || accessKey.trim() === '') {
      throw new Error('无效的LIBLIB AccessKey');
    }

    if (!secretKey || typeof secretKey !== 'string' || secretKey.trim() === '') {
      throw new Error('无效的LIBLIB SecretKey');
    }

    this._liblibAccessKey = accessKey;
    this._liblibSecretKey = secretKey;
    this._liblibInitialized = true;
    console.log('LIBLIB API密钥已安全初始化');
  }

  // 获取LIBLIB API密钥
  getLiblibKeys() {
    if (!this._liblibInitialized) {
      throw new Error('LIBLIB API密钥未初始化');
    }
    return {
      accessKey: this._liblibAccessKey,
      secretKey: this._liblibSecretKey
    };
  }

  // 检查LIBLIB API密钥是否已初始化
  isLiblibInitialized() {
    return this._liblibInitialized;
  }

  // 清除LIBLIB API密钥
  clearLiblib() {
    this._liblibAccessKey = null;
    this._liblibSecretKey = null;
    this._liblibInitialized = false;
    console.log('LIBLIB API密钥已清除');
  }

  // 获取初始化状态
  getStatus() {
    return {
      liblib: this._liblibInitialized
    };
  }

  // 向后兼容的方法（保留以防其他代码调用）
  isInitialized() {
    return this._liblibInitialized;
  }

  clear() {
    this.clearLiblib();
  }
}

// 创建单例实例
const apiKeyManager = new ApiKeyManager();

// 导出单例实例
export default apiKeyManager;

// 导出获取API密钥的函数
export function getApiKey() {
  return apiKeyManager.getApiKey();
}
