import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';

const typeName = 'aDocument';

describe('ModalityBase.selectFrom()', () => {
  it(`correctly passes all options to SqlDialect._selectFrom`, async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async (): Promise<unknown[]> => {
        return [];
      });

    await client.selectFrom(typeName, {
      where: ['@rid', '!!', variables.rid],
      limit: 1,
      timeout: {
        duration: 10000,
        strategy: 'RETURN'
      },
      orderBy: {
        field: 'aProperty',
        direction: 'DESC'
      }
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      `sql`,
      `SELECT FROM ${typeName} WHERE @rid !! '${variables.rid}' ORDER BY aProperty DESC LIMIT 1 TIMEOUT 10000 RETURN`
    );
  });
});
