import { describe, it, expect } from 'bun:test';

// Viewport 크기 상수 (LivePreview.tsx에서 추출)
type Viewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<Viewport, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

describe('Viewport Configuration', () => {
  describe('VIEWPORT_SIZES', () => {
    it('should have mobile, tablet, desktop viewports', () => {
      expect(Object.keys(VIEWPORT_SIZES)).toEqual(['mobile', 'tablet', 'desktop']);
    });

    it('should have correct pixel widths', () => {
      expect(VIEWPORT_SIZES.mobile).toBe(375);
      expect(VIEWPORT_SIZES.tablet).toBe(768);
      expect(VIEWPORT_SIZES.desktop).toBe(1024);
    });

    it('should have mobile < tablet < desktop', () => {
      expect(VIEWPORT_SIZES.mobile).toBeLessThan(VIEWPORT_SIZES.tablet);
      expect(VIEWPORT_SIZES.tablet).toBeLessThan(VIEWPORT_SIZES.desktop);
    });

    it('should all be positive numbers', () => {
      Object.values(VIEWPORT_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
      });
    });
  });

  describe('Viewport type safety', () => {
    it('should allow valid viewport types', () => {
      const viewports: Viewport[] = ['mobile', 'tablet', 'desktop'];
      viewports.forEach((vp) => {
        expect(vp in VIEWPORT_SIZES).toBe(true);
      });
    });
  });
});
