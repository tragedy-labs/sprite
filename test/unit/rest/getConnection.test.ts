import { client } from './utilities/testClient.js';

describe('SpriteRestClient.getConnection()', () => {
  it('should return a connection object', () => {
    /* Arrange */
    const params = {
      username: 'test',
      password: 'password',
      address: 'http://localhost:8080'
    };

    /* Act */
    const connection = client.getConnection(params);

    /* Assert */
    expect(connection).toEqual({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${params.username}:${params.password}`)}`
      },
      address: params.address
    });
  });

  it('should propagate errors form internal methods calls', () => {
    /* Arrange */
    jest.spyOn(client, 'encodeCredentials').mockImplementation(() => {
      throw new Error('test error');
    });

    /* Act */
    /* Assert */
    expect(() =>
      client.getConnection({
        address: 'http://localhost:8080',
        username: 'test',
        password: 'password'
      })
    ).toThrowErrorMatchingSnapshot();
  });
});
