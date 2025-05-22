import { GET_SERVER_EVENTS } from '@/server/commands/GET_SERVER_EVENTS.js';

describe('GET_SERVER_EVENTS', () => {
  it('should return a string that is the command to get the server events', async () => {
    // Arrange
    const expected = `get server events`;
    // Act
    const result = GET_SERVER_EVENTS;
    // Assert
    expect(result).toEqual(expected);
  });
});
