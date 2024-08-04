import { ArcadeValidation } from '@/validation/ArcadeValidation.js';

describe('ArcadeParameterValidation.databaseName()', () => {
  it('should return true if the variable is a string that matches the database name regex', () => {
    // Arrange
    const variable = 'test';
    // Act
    const result = ArcadeValidation.databaseName(variable);
    // Assert
    expect(result).toBe(true);
  });
  it('should throw a TypeError if the variable is not a string', () => {
    // Arrange
    const variable = 1;
    // Act
    // Assert
    expect(() =>
      ArcadeValidation.databaseName(variable)
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw a TypeError if the variable does not match the regex', () => {
    // Arrange
    const variable = '_ _ _ _';
    // Act
    // Assert
    expect(() =>
      ArcadeValidation.databaseName(variable)
    ).toThrowErrorMatchingSnapshot();
  });
});
