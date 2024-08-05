import { ArcadeValidation } from '@/validation/ArcadeValidation.js';

describe('ArcadeParameterValidation.bucketName()', () => {
  it('should return true if the variable is a string that matches the bucket name regex', () => {
    // Arrange
    const variable = 'test';
    // Act
    const result = ArcadeValidation.bucketName(variable);
    // Assert
    expect(result).toBe(true);
  });
  it('should return true if the variable is an array of valid bucket names', () => {
    // Arrange
    const variable = ['test', 'bucket1', 'bucket_2'];
    // Act
    const result = ArcadeValidation.bucketName(variable);
    // Assert
    expect(result).toBe(true);
  });
  it('should throw a TypeError if the variable is not a string or array', () => {
    // Arrange
    const variable = 1;
    // Act
    // Assert
    expect(() =>
      ArcadeValidation.bucketName(variable)
    ).toThrowErrorMatchingSnapshot();
  });
});
