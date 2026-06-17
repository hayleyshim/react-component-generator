import { useState } from 'react';
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

interface LivePreviewProps {
  code: string;
}

type Viewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

export function LivePreview({ code }: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const previewWidth = VIEWPORT_SIZES[viewport];

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
        <div className="viewport-controls">
          <button
            className={`viewport-btn ${viewport === 'mobile' ? 'viewport-btn--active' : ''}`}
            onClick={() => setViewport('mobile')}
            title="모바일 뷰 (375px)"
            aria-label="모바일"
          >
            📱
          </button>
          <button
            className={`viewport-btn ${viewport === 'tablet' ? 'viewport-btn--active' : ''}`}
            onClick={() => setViewport('tablet')}
            title="태블릿 뷰 (768px)"
            aria-label="태블릿"
          >
            📱
          </button>
          <button
            className={`viewport-btn ${viewport === 'desktop' ? 'viewport-btn--active' : ''}`}
            onClick={() => setViewport('desktop')}
            title="데스크탑 뷰 (1024px)"
            aria-label="데스크탑"
          >
            🖥
          </button>
        </div>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div
            className="preview-render"
            style={{
              maxWidth: `${previewWidth}px`,
              margin: '0 auto',
            }}
          >
            <ReactLivePreview />
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
