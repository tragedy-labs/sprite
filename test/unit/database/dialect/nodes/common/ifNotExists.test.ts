import { ifNotExists } from '@/nodes/common/index.js';

describe('SqlDialect > Nodes > ifNotExists', () => {
  it('returns the IF NOT EXISTS keyword', () => {
    const result = ifNotExists();

    expect(result).toBe('IF NOT EXISTS');
  });
});
