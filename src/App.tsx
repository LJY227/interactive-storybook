import { useState, useEffect } from 'react';
import React from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [StoryContainer, setStoryContainer] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // 动态导入StoryContainer以捕获任何导入错误
    const loadStoryContainer = async () => {
      try {
        console.log('开始加载StoryContainer...');
        const module = await import('./components/StoryContainer');
        console.log('StoryContainer加载成功');
        setStoryContainer(() => module.StoryContainer);
        setIsLoading(false);
      } catch (err) {
        console.error('加载StoryContainer失败:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadStoryContainer();
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🐻 交互式绘本</h1>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>正在加载应用...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🐻 交互式绘本</h1>
          <div style={{ textAlign: 'center', color: 'red' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
            <p>应用加载失败</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>错误信息: {error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (StoryContainer) {
    return (
      <div className="App">
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🐻 交互式绘本</h1>
          <StoryContainer />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🐻 交互式绘本</h1>
        <p style={{ textAlign: 'center' }}>未知错误，请刷新页面</p>
      </div>
    </div>
  );
}

export default App;
