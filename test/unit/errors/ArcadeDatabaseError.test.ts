// Lib
import { ArcadeDatabaseError } from '@/errors/ArcadeDatabaseError.js';

describe('ArcadeDatabaseError', () => {
  it('should create an ArcadeDatabaseError', async () => {
    const error = new ArcadeDatabaseError({
      error: 'error',
      exception: 'exception',
      detail: 'detail'
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.error).toBe('error');
    expect(error.exception).toBe('exception');
    expect(error.detail).toBe('detail');
    expect(error.message).toBe('error. detail.');
  });
});
