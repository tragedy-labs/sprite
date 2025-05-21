import { SHUTDOWN } from '@/server/commands/SHUTDOWN.js';

describe('SHUTDOWN', () => {
  it('should return the string command to shutdown the server', async () => {
    // Arrange
    const expected = 'shutdown';
    // Act
    const received = SHUTDOWN;
    // Assert
    expect(received).toEqual(expected);
  });
});
