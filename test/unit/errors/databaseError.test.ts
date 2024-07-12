import { ArcadeDatabaseError, SpriteArcadeErrorResult } from '@/errors/ArcadeDatabaseError';

describe('ArcadeDatabaseError', () => {

  // export class ArcadeDatabaseError extends Error {
  //   error: string;
  //   exception: string;
  //   detail: string;
  //   constructor({ error, detail, exception }: SpriteArcadeErrorResult) {
  //     super(`${error}. ${detail}.`);
  //     this.name = 'ArcadeDatabaseError';
  //     this.error = error;
  //     this.detail = detail;
  //     this.exception = exception;
  //   }
  // }
  it('should set the error, detail, and exception properties', () => {
    // Arrange
    const error = 'test error';
    const detail = 'test details';
    const exception = 'test exception';
    const result: SpriteArcadeErrorResult = { error, detail, exception };

    // Act
    const arcadeError = new ArcadeDatabaseError(result);

    // Assert
    expect(arcadeError.error).toBe(error);
    expect(arcadeError.detail).toBe(detail);
    expect(arcadeError.exception).toBe(exception);
  });
});
