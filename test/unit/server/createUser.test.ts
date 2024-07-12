import { endpoints } from '@/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.createUser()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `CREATE USER ${JSON.stringify({
          // ArcadeDB expects 'name' to be a property
          // Sprite uses 'username' as a convention
          // this is why there is a difference between
          // input and what the method sends to the server
          name: variables.username,
          password: variables.password,
          databases: {
            myDatabase: 'user'
          }
        })}`
      })
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.createUser({
      // See above comment for explanation on discrepancy
      // between input and output of createUser method in
      // regard to the username vs name property
      username: variables.username,
      password: variables.password,
      databases: {
        myDatabase: 'user'
      }
    });

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });

  it('should throw an error if no "username" is supplied', async () => {
    // Act
    await expect(
      // @ts-expect-error - Testing error handling for no username property in createUser
      client.createUser({
        password: 'myPassword',
        databases: {
          myDatabase: 'admin'
        }
      })
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if no "password" is supplied', async () => {
    // Act
    await expect(
      // @ts-expect-error - Testing error handling for no password property
      client.createUser({
        username: 'myUsername',
        databases: {
          myDatabase: 'admin'
        }
      })
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if no "databases" property is supplied', async () => {
    // Act
    await expect(
      // @ts-expect-error - Testing error handling for no databases property
      client.createUser({
        username: 'myUsername',
        password: 'myPassword'
      })
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if the password is under 4 characters long', async () => {
    await expect(
      client.createUser({
        username: 'myUsername',
        password: '1',
        databases: {
          aDatabase: ''
        }
      })
    ).rejects.toMatchSnapshot();
  });
});
