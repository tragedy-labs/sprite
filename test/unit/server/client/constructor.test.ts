// Lib
import { Server } from '@/server/Server.js';
import { SpriteServer } from '@/server/SpriteServer.js';
import { ServerSession } from '@/session/ServerSession.js';

// Test

import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.constructor()', () => {
  it('it should accept a ServerSession instance', async () => {
    // Arrange
    const serverInstance = new SpriteServer(SESSION);
    jest
      .spyOn(Server, 'command')
      .mockImplementationOnce(
        async (session: ServerSession, command: string) => session
      );

    const passedSession = await serverInstance.command(
      variables.nonEmptyString
    );
    // Asserts
    expect(serverInstance).toBeInstanceOf(SpriteServer);
    expect(passedSession).toBe(SESSION);
  });

  it('it should accept a parameter to create a new session', async () => {
    // Arrange

    const uniqueAddress = 'http://localhost:1234';

    const serverInstance = new SpriteServer({
      username: variables.username,
      password: variables.password,
      address: uniqueAddress
    });

    jest
      .spyOn(Server, 'command')
      .mockImplementationOnce(
        async (session: ServerSession, command: string) => session
      );

    const createdSession = await serverInstance.command<ServerSession>(
      variables.nonEmptyString
    );

    // Asserts
    expect(serverInstance).toBeInstanceOf(SpriteServer);
    expect(createdSession).toBeInstanceOf(ServerSession);
    expect(createdSession.address).toBe(uniqueAddress);
  });
});
