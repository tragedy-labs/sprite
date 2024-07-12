import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';

describe('ModalityBase.selectOne()', () => {
  beforeEach(() => {
    jest.spyOn(SpriteDatabase, 'query').mockImplementationOnce(async () => {
      return [
        {
          '@rid': variables.rid,
          '@cat': 'd',
          '@type': 'aDocument',
          aProperty: 'aValue'
        }
      ];
    });
  });

  it(`correctly passes all arguments and options to SqlDialect.selectOne`, async () => {
    await client.selectOne(variables.rid);

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      `sql`,
      `SELECT FROM ${variables.rid}`
    );
  });
  it('returns the record from the query result', async () => {
    const record = await client.selectOne(variables.rid);

    expect(record).toMatchObject({
      '@rid': variables.rid,
      '@cat': 'd',
      '@type': 'aDocument',
      aProperty: 'aValue'
    });
  });
});
