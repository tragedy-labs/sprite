import { CreateDocumentType, DropType } from '../../../src/types/commands.js';
import { ArcadeSupportedQueryLanguages } from '../../../src/types/database.js';
import { testClient as client } from './testClient.js';

const typeName: string = 'CommandTestType';

describe('SpriteDatabase.command', () => {
  afterAll(async () => {
    client.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it('executes a command successfully', async () => {
    const language: ArcadeSupportedQueryLanguages = 'sql';
    const command = `CREATE document TYPE ${typeName}`;
    const result = await client.command<CreateDocumentType<typeof typeName>>(
      language,
      command
    );

    expect(result).toEqual([{ operation: 'create document type', typeName }]);
  });

  it('propagates errors from ArcadeDB', async () => {
    const command = 'INVALID COMMAND';
    const language = 'INVALID_LANGUAGE';
    await expect(
      // @ts-expect-error - Testing invalid input
      client.command(language, command)
    ).rejects.toMatchSnapshot();
  });
});
