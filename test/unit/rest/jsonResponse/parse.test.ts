import { JsonResponse } from '@/rest/JsonResponse.js';
import { ArcadeDatabaseError } from '@/errors/ArcadeDatabaseError.js';

describe('JsonResponse.parse', () => {
  it('should return the result property from the object return from from ArcadeDB, if present', async () => {
    const response = new Response(JSON.stringify({ result: 'result' }));
    const json = await JsonResponse.parse(response);
    expect(json).toBe('result');
  });

  it('should throw an ArcadeDatabaseError if ArcadeDB returns an exception', async () => {
    const response = new Response(
      JSON.stringify({ error: 'error', exception: '', detail: '' })
    );
    await expect(JsonResponse.parse(response)).rejects.toEqual(
      expect.any(ArcadeDatabaseError)
    );
  });

  it('if not result property is present, and it is not an ArcadeDB exception, it should just return the json', async () => {
    const response = new Response(JSON.stringify({ something: '' }));
    const json = await JsonResponse.parse(response);
    expect(json).toEqual({ something: '' });
  });
});
