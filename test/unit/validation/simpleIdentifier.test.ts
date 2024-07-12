import { validation } from "./validationInstance.js";

describe('ArcadeParameterValidation.simpleIdentifier()', () => {
  it('should return true if the variable is a string that matches the simple identifier regex', () => {
    // Arrange
    const variable = 'test';
    // Act
    const result = validation.simpleIdentifier(variable);
    // Assert
    expect(result).toBe(true);
  });
  it('should throw a TypeError if the variable is not a string', () => {
    // Arrange
    const variable = 1;
    // Act
    // Assert
    expect(() =>
      validation.simpleIdentifier(variable)
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw a TypeError if the variable does not match the regex', () => {
    // Arrange
    const variable = '_ _ _ _';
    // Act
    // Assert
    expect(() =>
      validation.simpleIdentifier(variable)
    ).toThrowErrorMatchingSnapshot();
  });
});