import { ArcadeValidation } from '@/validation/ArcadeValidation.js';

describe('ArcadeParameterValidation.url()', () => {
  it('should return true if the variable is a string that matches the url regex', () => {
    // Arrange
    const variable = 'https://www.google.com';
    // Act
    const result = ArcadeValidation.url(variable);
    // Assert
    expect(result).toBe(true);
  });
  it('should throw an error if the URL is not valid', () => {
    // Arrange
    const variable = 'not a url';
    // Act
    // Assert
    expect(() => ArcadeValidation.url(variable)).toThrowErrorMatchingSnapshot();
  });
});
