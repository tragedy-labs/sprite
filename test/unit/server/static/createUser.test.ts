// Lib
import { Routes } from '@/server/routes.js';
import { ISpriteCreateArcadeUser, Server } from '@/server/Server.js';

// Testing
import {
  CREATE_USER_PARAMS,
  TestServerSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.COMMAND}`;

describe('Server.createUser()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
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
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.createUser(SESSION, CREATE_USER_PARAMS);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it('should throw an error if no "username" is supplied', async () => {
    const incompleteParams = {
      password: 'myPassword',
      databases: {
        myDatabase: 'admin'
      }
    } as unknown as ISpriteCreateArcadeUser;

    await expect(
      Server.createUser(SESSION, incompleteParams)
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if no "password" is supplied', async () => {
    const incompleteParams = {
      username: 'myUsername',
      databases: {
        myDatabase: 'admin'
      }
    } as unknown as ISpriteCreateArcadeUser;

    await expect(
      Server.createUser(SESSION, incompleteParams)
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if no "databases" property is supplied', async () => {
    const incompleteParams = {
      username: 'myUsername',
      password: 'myPassword'
    } as unknown as ISpriteCreateArcadeUser;

    await expect(
      Server.createUser(SESSION, incompleteParams)
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if the password is under 4 characters long', async () => {
    await expect(
      Server.createUser(SESSION, {
        username: 'myUsername',
        password: '1',
        databases: {
          aDatabase: ''
        }
      })
    ).rejects.toMatchSnapshot();
  });
});
