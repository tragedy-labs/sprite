// Lib
import { Auth } from '@/rest/Auth.js';
import { HeaderKeys, SpriteHeaders } from '@/rest/SpriteHeaders.js';
import { variables } from '@test/variables.js';

describe('SpriteHeaders.initialize', () => {
  it('should return an object with the Content-Type and Authorization headers', () => {
    // Act
    const headers = SpriteHeaders.initialize(
      variables.username,
      variables.password
    );
    // Assert
    expect(headers).toEqual({
      [HeaderKeys.ContentType]: 'application/json',
      [HeaderKeys.Authorization]: Auth.basic(
        variables.username,
        variables.password
      )
    });
  });
});
