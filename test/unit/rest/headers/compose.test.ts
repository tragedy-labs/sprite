// Lib
import { SpriteHeaders } from '@/rest/SpriteHeaders.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';

// Testing
import {
  testTransaction as TRX,
  TestServerSession as SESSION,
  headersWithTransaction as HEADERS
} from '@test/variables.js';

describe('SpriteHeaders.compose', () => {
  it('should compose headers with transaction id', () => {
    // Act
    const headers = SpriteHeaders.compose(SESSION, TRX);
    // Assert
    expect(headers).toEqual(HEADERS);
  });

  it('should throw an error if it recieves an invalid transaction', () => {
    // Arrange
    const invalidTransaction = {
      invalid: 'object'
    } as unknown as SpriteTransaction;
    // Assert
    expect(() =>
      SpriteHeaders.compose(SESSION, invalidTransaction)
    ).toThrowErrorMatchingSnapshot();
  });
});
