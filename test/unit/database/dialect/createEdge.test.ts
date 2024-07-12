import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction as headers
} from '../../../variables.js';
import { EdgeTypes, VertexTypes } from '../../types.js';
import { testTransaction } from '../client/testClient.js';

const vertexName = 'aVertex';
const propertyName = 'aProperty';
const typeName = 'anEdge';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

const data = {
  aProperty: 'aValue'
};

const stringifiedData = JSON.stringify(data);

const indexDescriptor = {
  type: 'aVertex',
  key: 'aProperty',
  value: 'aValue'
} as const;

const indexSelectStatement = `(SELECT FROM ${vertexName} WHERE ${propertyName} = 'aValue')`;

const createEdgeTyped = client.createEdge<
  EdgeTypes,
  VertexTypes,
  TypeName,
  'aVertex',
  'aVertex'
>;

const createEdgeResult = {
  user: variables.username,
  version: '',
  serverName: '',
  result: [{ count: 0 }]
};

describe('SqlDialect.insertRecord()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}/${variables.databaseName}`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => createEdgeResult
    } as Response);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      {
        data
      }
    );

    // Assert

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'sql',
          command: `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} CONTENT ${stringifiedData}`
        })
      }
    );
  });

  it(`handles string rids in the to and from fields by appending TO ${variables.rid} FROM ${variables.rid} to the command when supplied with ${variables.rid} in the TO and FROM fields`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid}`,
      testTransaction
    );
  });

  it('handles "ifNotExists" option by appending "IF NOT EXISTS" to the command when passed "true"', async () => {
    // Arrange
    jest.spyOn(SpriteDatabase, 'command').mockImplementationOnce(async () => {
      return createEdgeResult.result;
    });

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      { ifNotExists: true }
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} IF NOT EXISTS`,
      testTransaction
    );
  });

  it(`handles index descriptor objects in the TO and FROM arguments option by appending TO ${indexSelectStatement} FROM ${indexSelectStatement} to the command when an index descriptor object is supplied"`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      indexDescriptor,
      indexDescriptor,
      testTransaction
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${indexSelectStatement} TO ${indexSelectStatement}`,
      testTransaction
    );
  });

  it(`handles "data" option by appending CONTENT ${stringifiedData} to the command when data is set to ${data}`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      { data }
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} CONTENT ${stringifiedData}`,
      testTransaction
    );
  });

  it(`handles "upsert" option by appending "UPSERT" to the command when upsert is set to true`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      {
        upsert: true
      }
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} UPSERT FROM ${variables.rid} TO ${variables.rid}`,
      testTransaction
    );
  });

  it(`handles "unidirectional" option by appending "UNIDIRECTIONAL" to the command when unidirectional is set to true`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      {
        unidirectional: true
      }
    );
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} UNIDIRECTIONAL`,
      testTransaction
    );
  });

  it(`handles "retry" option by appending "RETRY 4 WAIT 1000" to the command when retry.attempts is set to 4 and retry.wait is set to 1000`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      {
        retry: { attempts: 4, wait: 1000 }
      }
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} RETRY 4 WAIT 1000`,
      testTransaction
    );
  });

  it(`handles "batchSize" option by appending "BATCH 1000" to the command when batchSize is set to 1000`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async () => createEdgeResult);

    // Act
    await createEdgeTyped(
      typeName,
      variables.rid,
      variables.rid,
      testTransaction,
      {
        batchSize: 1000
      }
    );

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `CREATE EDGE ${typeName} FROM ${variables.rid} TO ${variables.rid} BATCH 1000`,
      testTransaction
    );
  });

  it('propagates errors from internal methods', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    // Act
    await expect(
      createEdgeTyped(typeName, variables.rid, variables.rid, testTransaction)
    ).rejects.toMatchSnapshot();
  });
});
