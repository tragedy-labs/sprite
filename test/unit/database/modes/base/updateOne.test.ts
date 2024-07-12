import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { testTransaction } from '../../client/testClient.js';
import { ArcadeDocument } from '@/api';

describe('ModalityBase.updateOne', () => {
  it(`correctly passes all options to SqlDialect._updateOne`, async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async (): Promise<ArcadeDocument[]> => {
        return [
          {
            '@rid': variables.rid,
            '@type': 'aDocument',
            '@cat': 'd'
          }
        ];
      });

    const newData = {
      aProperty: 'bValue'
    };

    await client.updateOne<'aDocument'>(
      variables.rid,
      newData,
      testTransaction
    );

    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `UPDATE ${variables.rid} CONTENT ${JSON.stringify(newData)} RETURN AFTER @this`,
      testTransaction
    );
  });
});
