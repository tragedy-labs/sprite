import {
  ArcadeGetSchemaResponse,
  ArcadeTypeDefinition
} from '../../../src/types/database.js';
import { testClient as client } from './testClient.js';

let schema: ArcadeGetSchemaResponse;

beforeAll(async () => {
  schema = await client.getSchema();
});

describe('SpriteDatabase.getSchema', () => {
  it('returns the schema of the database as an array', () => {
    expect(Array.isArray(schema)).toBe(true);
  });

  it('matches the schema snapshot', () => {
    // {
    //   name: 'Whisky',
    //   type: 'vertex',
    //   records: 72,
    //   buckets: [
    //     'Whisky_0',
    //     'Whisky_1',
    //     'Whisky_2',
    //     'Whisky_3',
    //     'Whisky_4',
    //     'Whisky_5',
    //     'Whisky_6',
    //     'Whisky_7'
    //   ],
    //   bucketSelectionStrategy: 'round-robin',
    //   parentTypes: [],
    //   properties: [],
    //   indexes: [],
    //   custom: {}
    // }

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
