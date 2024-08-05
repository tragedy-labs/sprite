import { DISCONNECT_CLUSTER } from '@/server/commands/DISCONNECT_CLUSTER.js';

describe('DISCONNECT_CLUSTER', () => {
  it('should return a string that is the command to disconnect from the cluster', async () => {
    // Arrange
    const expected = `DISCONNECT CLUSTER`;
    // Act
    const result = DISCONNECT_CLUSTER;
    // Assert
    expect(result).toEqual(expected);
  });
});
