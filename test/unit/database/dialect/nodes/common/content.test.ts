import { content } from '@/nodes/common/index.js';

describe('SqlDialect > Nodes > content', () => {
  it('stringifies an object, and appends it to the CONTENT keyword', () => {
    const data = { key: 'value' };
    const result = content(data);

    expect(result).toBe(`CONTENT ${JSON.stringify(data)}`);
  });
});
