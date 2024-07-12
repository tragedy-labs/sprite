import { client } from './testClient.js';
import { endpoints } from '@/endpoints/database.js';
import { variables, headersWithTransaction } from '../../../variables.js';
import { testTransaction } from '../client/testClient.js';

interface Documents {
  aDocument: {
    aProperty: string;
  };
}

const newData: Documents['aDocument'] = {
  aProperty: 'bValue'
};

describe('SpriteDatabase.updateOne()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);
    await client.updateOne<Documents, 'aDocument'>(
      variables.rid,
      newData,
      testTransaction
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: headersWithTransaction,
        body: JSON.stringify({
          language: 'sql',
          command: `UPDATE ${variables.rid} CONTENT ${JSON.stringify(
            newData
          )} RETURN AFTER @this`
        })
      }
    );
  });
  // The merge option was removed for initial release
  // it('handles "merge" option by appending "MERGE" + stringified JSON data to the command when passed a boolean true', async () => {
  //   jest
  //     .spyOn(client.database, 'command')
  //     .mockImplementationOnce(() => ({ result: ['no'] }) as any);

  //   await client.updateOne<Documents, 'aDocument'>(
  //     variables.rid,
  //     newData,
  //     testTransaction
  //   );

  //   expect(client.database.command).toHaveBeenCalledWith(
  //     'sql',
  //     `UPDATE ${variables.rid} MERGE ${JSON.stringify(
  //       newData
  //     )} RETURN AFTER @this`
  //   );
  // });
  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(client.database, 'command')
      .mockRejectedValueOnce(new Error('Failed to update'));

    const updatePromise = client.updateOne<Documents, 'aDocument'>(
      variables.rid,
      newData,
      testTransaction
    );

    await expect(updatePromise).rejects.toMatchSnapshot();
  });
});
