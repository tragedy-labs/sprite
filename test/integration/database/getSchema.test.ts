// Lib
import {
  ArcadeGetSchemaResponse,
  ArcadeTypeDefinition
} from '@/types/database.js';

// Testing
import { testClient as client } from './testClient.js';

describe('SpriteDatabase.getSchema', () => {
  let schema: ArcadeGetSchemaResponse;
  beforeAll(async () => {
    await client.command('sql', 'CREATE document TYPE GetSchemaTestType');
    schema = await client.getSchema();
  });
  afterAll(async () => {
    await client.command('sql', 'DROP TYPE GetSchemaTestType');
  });
  it('returns the schema of the database as an array', () => {
    expect(Array.isArray(schema)).toBe(true);
  });

  it('has the expected structure', async () => {
    // {
    //   name: 'Name',
    //   type: 'vertex',
    //   records: 72,
    //   buckets: [
    //   ...
    //   ],
    //   bucketSelectionStrategy: 'round-robin',
    //   parentTypes: [],
    //   properties: [],
    //   indexes: [],
    //   custom: {}
    //

    // Arrange

    const isArray = (property: Array<unknown>) => Array.isArray(property);

    const definition: ArcadeTypeDefinition = schema[0];
    expect(definition).toHaveProperty('name');
    expect(definition).toHaveProperty('type');
    expect(definition).toHaveProperty('records');
    expect(isArray(definition.buckets)).toBe(true);
    expect(definition).toHaveProperty('bucketSelectionStrategy');
    expect(isArray(definition.parentTypes)).toBe(true);
    expect(isArray(definition.properties)).toBe(true);
    expect(isArray(definition.indexes)).toBe(true);
    expect(definition).toHaveProperty('custom');
  });
});
