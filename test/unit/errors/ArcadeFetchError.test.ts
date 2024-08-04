// Lib
import { ArcadeFetchError } from '@/errors/ArcadeFetchError.js';

describe('ArcadeFetchError', () => {
  it('should create an ArcadeFetchError', () => {
    const error = new ArcadeFetchError({
      status: 404,
      statusText: 'Not Found'
    } as unknown as Response);
    expect(error.message).toBe(
      '404 Not Found. The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.'
    );
    expect(error.name).toBe('ArcadeFetchError');
  });
  it('should provide details if no statusText is provided in the response', () => {
    const error = new ArcadeFetchError({
      status: 500
    } as unknown as Response);
    expect(error.message).toBe(
      '500 Internal Server Error. The server encountered an unexpected condition that prevented it from fulfilling the request.'
    );
  });
});
