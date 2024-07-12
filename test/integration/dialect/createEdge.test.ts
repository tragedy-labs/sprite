import {
  CreateEdgeType,
  CreateVertexType,
  DropType,
  InsertVertex
} from 'src/types/commands.js';
import { RID_REGEX } from '../regex.js';
import { testClient } from './testclient.js';

interface EdgeTypes {
  CreateEdgeTestEdge: {
    aProperty: string;
  };
}

type CreateEdgeTestVertex = {
  aProperty: string;
};

interface VertexTypes {
  CreateEdgeTestVertex: CreateEdgeTestVertex;
}

const dbClient = testClient.database;

const data = {
  aProperty: 'aValue'
};

const vertexTypeName = 'CreateEdgeTestVertex';
const edgeTypeName = 'CreateEdgeTestEdge';

const indexDescriptor = {
  type: vertexTypeName,
  key: 'aProperty',
  value: 'aValue'
} as const;

const createEdge = testClient.createEdge<
  EdgeTypes,
  VertexTypes,
  typeof edgeTypeName,
  typeof vertexTypeName,
  typeof vertexTypeName
>;

describe('SqlDialect.createEdge()', () => {
  beforeAll(async () => {
    await dbClient.command<CreateVertexType<typeof vertexTypeName>>(
      'sql',
      `CREATE vertex TYPE ${vertexTypeName}`
    );
    await dbClient.command<CreateEdgeType<typeof edgeTypeName>>(
      'sql',
      `CREATE edge TYPE ${edgeTypeName}`
    );
  });
  afterAll(async () => {
    await dbClient.command<DropType<typeof vertexTypeName>>(
      'sql',
      `DROP TYPE ${vertexTypeName}`
    );
    await dbClient.command<DropType<typeof edgeTypeName>>(
      'sql',
      `DROP TYPE ${edgeTypeName}`
    );
  });
  it(`should create an edge`, async () => {
    const trx = await dbClient.newTransaction();

    // Arrange
    const [vertexOne, vertexTwo] = await dbClient.command<
      InsertVertex<CreateEdgeTestVertex>
    >(
      'sql',
      `INSERT INTO ${vertexTypeName} CONTENT ${JSON.stringify([data, data])}`,
      trx
    );

    // Act
    const [edge] = await createEdge(
      edgeTypeName,
      vertexOne['@rid'],
      vertexTwo['@rid'],
      trx,
      {
        data
      }
    );

    // reverse the creation of test records
    trx.rollback();

    // Assert
    expect(edge['@rid']).toMatch(RID_REGEX);
    expect(edge['@cat']).toBe('e');
    expect(edge['@type']).toBe(edgeTypeName);
    expect(edge['@in']).toBe(vertexTwo['@rid']);
    expect(edge['@out']).toBe(vertexOne['@rid']);
    expect(edge.aProperty).toBe('aValue');
  });

  it(`should create an edge(s) using the vertex descriptor instead of an @rid`, async () => {
    // Arrange
    const trx = await dbClient.newTransaction();
    const [vertexOne] = await dbClient.command<
      InsertVertex<CreateEdgeTestVertex>
    >(
      'sql',
      `INSERT INTO ${vertexTypeName} CONTENT ${JSON.stringify([data, data])}`,
      trx
    );

    // Act
    const [edge] = await createEdge(
      edgeTypeName,
      indexDescriptor,
      vertexOne['@rid'],
      trx,
      {
        data
      }
    );

    // reverse the creation of test records
    trx.rollback();

    // Assert
    expect(edge['@rid']).toMatch(RID_REGEX);
    expect(edge['@cat']).toBe('e');
    expect(edge['@type']).toBe(edgeTypeName);
    expect(edge['@in']).toMatch(RID_REGEX);
    expect(edge['@out']).toMatch(RID_REGEX);
    expect(edge.aProperty).toBe('aValue');
  });

  it(`should propagate errors from the database`, async () => {
    const trx = await dbClient.newTransaction();

    // Assert
    await expect(
      createEdge(edgeTypeName, 'INVALID_RID', 'INVALID_RID', trx, {
        data
      })
    ).rejects.toMatchSnapshot();

    // rollback the transaction
    trx.rollback();
  });
});
