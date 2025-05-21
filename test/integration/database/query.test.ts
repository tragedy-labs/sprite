import { ArcadeSupportedQueryLanguages } from '@/database/Database.js';
import { testClient as client } from './testClient.js';

type DBSettings = {
  dateFormat: string;
  dateTimeFormat: string;
  encoding: string;
};

describe('SpriteDatabase.query', () => {
  it('executes a query successfully', async () => {
    const command = 'SELECT FROM schema:database';
    const language: ArcadeSupportedQueryLanguages = 'sql';
    const result: Array<DBSettings> = await client.query<DBSettings>(
      language,
      command
    );

    expect(result[0].dateFormat).toBeDefined();
    expect(result[0].dateTimeFormat).toBeDefined();
    expect(result[0].encoding).toBeDefined();
  });

  it('propagates errors from ArcadeDB', async () => {
    const command = 'INVALID COMMAND';
    const language = 'INVALID_LANGUAGE';
    await expect(
      // @ts-expect-error - Testing invalid input
      client.query(language, command)
    ).rejects.toMatchSnapshot();
  });
});
