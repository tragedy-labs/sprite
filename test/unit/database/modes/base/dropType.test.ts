import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { ArcadeCommandResponse } from '../../../../../src/types/database.js';

const typeName = 'aDocument';

describe('ModalityBase.dropType()', () => {
  it(`correctly passes all options to SqlDialect._dropType`, async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async (): Promise<ArcadeCommandResponse<unknown>> => {
          return {
            user: variables.username,
            serverName: '',
            version: '',
            result: [{ typeName }]
          };
        }
      );

    await client.dropType(typeName, {
      ifExists: true,
      unsafe: true
    });

    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `DROP TYPE ${typeName} UNSAFE IF EXISTS`
    );
  });
});
