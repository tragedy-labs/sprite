import { CONNECT_CLUSTER } from '@/server/commands/CONNECT_CLUSTER.js';
import { variables } from '@test/variables.js';

describe('CONNECT_CLUSTER', () => {
  it('given an address (string) as an argument should return a string that is the command to connect to that cluster', async () => {
    // Arrange
    const expected = `connect cluster ${variables.address}`;
    // Act
    const result = CONNECT_CLUSTER(variables.address);
    // Assert
    expect(result).toEqual(expected);
  });
});
