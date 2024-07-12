import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, testAuth } from '../../../variables.js';

import { DocumentTypes } from '../../types.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

describe('TypedOperations.selectFrom()', () => {
  it(`should make a properly formatted POST request to ${endpoints.query}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: [{ count: 1 }] })
    } as Response);

    await client.selectFrom<DocumentTypes, TypeName, '@rid'>('aDocument', {
      where: ['@rid', '=', variables.rid]
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.query}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${testAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: 'sql',
          command: `SELECT FROM ${typeName} WHERE @rid = '${variables.rid}'`
        })
      }
    );
  });

  it('handles "skip" option by appending SKIP 10 to the command when skip is set to 10', async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async () => [] as unknown[]);

    await client.selectFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >('aDocument', {
      skip: 10,
      where: [variables.propertyName, '!!', 'ok']
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      'sql',
      `SELECT FROM aDocument WHERE aProperty !! 'ok' SKIP 10`
    );
  });

  it('handles "limit" option by appending LIMIT 10 to the command when limit is set to 10', async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async () => [] as unknown[]);

    await client.selectFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >('aDocument', {
      limit: 10,
      where: [variables.propertyName, '!!', 'ok']
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      'sql',
      `SELECT FROM aDocument WHERE aProperty !! 'ok' LIMIT 10`
    );
  });

  it('handles "timeout" option by appending TIMEOUT 1000 EXCEPTION to the command when timeout.duration is set to 1000 and timeout.strategy is set to EXCEPTION', async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async () => [] as unknown[]);

    await client.selectFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >('aDocument', {
      timeout: {
        duration: 1000,
        strategy: 'EXCEPTION'
      },
      where: [variables.propertyName, '!!', 'ok']
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      'sql',
      `SELECT FROM aDocument WHERE aProperty !! 'ok' TIMEOUT 1000 EXCEPTION`
    );
  });

  it('handles "orderBy" option by appending ORDER BY aProperty ASC to the command when orderBy.field is set to variables.propertyName. amd orderBy.direction is set to "ASC"', async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async () => [] as unknown[]);

    await client.selectFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >('aDocument', {
      orderBy: {
        field: variables.propertyName,
        direction: 'ASC'
      },
      where: [variables.propertyName, '!!', 'ok']
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      'sql',
      `SELECT FROM aDocument WHERE aProperty !! 'ok' ORDER BY aProperty ASC`
    );
  });

  it('handles "where" option by appending "WHERE @rid = #0:0" to the command when where is set to ["@rid", "=", "#0:0"]', async () => {
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockImplementationOnce(async () => [] as unknown[]);

    await client.selectFrom<DocumentTypes, TypeName, '@rid'>('aDocument', {
      where: ['@rid', '=', variables.rid]
    });

    expect(SpriteDatabase.query).toHaveBeenCalledWith(
      'sql',
      `SELECT FROM aDocument WHERE @rid = '${variables.rid}'`
    );
  });

  it('should propagate errors from internal methods calls', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    expect(() =>
      client.selectFrom<DocumentTypes, TypeName, '@rid'>(typeName)
    ).rejects.toMatchSnapshot();
  });
});
