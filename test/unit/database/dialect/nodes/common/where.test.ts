import { where } from '@/nodes/common/where.js';

describe('SqlDialect > Nodes > where', () => {
  it('returns a WHERE clause with a string value', () => {
    const result = where(['key', '=', 'value']);

    expect(result).toBe("WHERE key = 'value'");
  });

  it('returns a WHERE clause with an object value', () => {
    const result = where(['key', '=', { key: 'value' }]);

    expect(result).toBe('WHERE key = {"key":"value"}');
  });
});
