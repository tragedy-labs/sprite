// Lib
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { ArcadeValidation } from '@/validation/ArcadeValidation.js';

describe('ArcadeValidation.transaction()', () => {
  it('should throw a TypeError if the variable is not a string', () => {
    // Arrange
    const INVALID_TRANSACTION = {} as unknown as SpriteTransaction;
    // Act
    // Assert
    expect(() =>
      ArcadeValidation.transaction(INVALID_TRANSACTION)
    ).toThrowErrorMatchingSnapshot();
  });
});
