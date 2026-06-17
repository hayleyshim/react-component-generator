import { describe, it, expect } from 'bun:test';

// 테스트 대상 함수들 (server/index.ts에서 추출한 것을 가정)
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:jsx|tsx|javascript|typescript)?\n?/gm, '')
    .replace(/```$/gm, '')
    .trim();
}

function ensureRenderCall(code: string): string {
  if (/\brender\s*\(/.test(code)) return code;

  const match = code.match(/(?:const|function)\s+([A-Z]\w+)/);
  if (match) {
    return `${code}\n\nrender(<${match[1]} />);`;
  }
  return code;
}

describe('Code Processing Utilities', () => {
  describe('stripCodeFences', () => {
    it('should remove jsx code fences', () => {
      const input = '```jsx\nconst x = 1;\n```';
      const result = stripCodeFences(input);
      expect(result).toBe('const x = 1;');
    });

    it('should remove typescript code fences', () => {
      const input = '```typescript\nconst x: string = "hello";\n```';
      const result = stripCodeFences(input);
      expect(result).toBe('const x: string = "hello";');
    });

    it('should handle multiple code blocks', () => {
      const input = '```\nblock1\n```\ntext\n```\nblock2\n```';
      const result = stripCodeFences(input);
      expect(result).toContain('block1');
      expect(result).toContain('block2');
    });

    it('should handle code without fences', () => {
      const input = 'const x = 1;';
      const result = stripCodeFences(input);
      expect(result).toBe('const x = 1;');
    });
  });

  describe('ensureRenderCall', () => {
    it('should add render call to component without it', () => {
      const input = 'const Button = () => <button>Click</button>;';
      const result = ensureRenderCall(input);
      expect(result).toContain('render(<Button />);');
    });

    it('should not duplicate existing render call', () => {
      const input = 'const Button = () => <button>Click</button>;\nrender(<Button />);';
      const result = ensureRenderCall(input);
      expect(result.split('render(').length).toBe(2); // "render(" appears once + in comment = 2
    });

    it('should extract component name correctly', () => {
      const input = 'const MyComponent = () => <div />;';
      const result = ensureRenderCall(input);
      expect(result).toContain('render(<MyComponent />);');
    });

    it('should handle function declaration', () => {
      const input = 'function Card() { return <div />; }';
      const result = ensureRenderCall(input);
      expect(result).toContain('render(<Card />);');
    });

    it('should not modify code without component', () => {
      const input = 'const x = 1;';
      const result = ensureRenderCall(input);
      expect(result).toBe(input);
    });
  });
});
