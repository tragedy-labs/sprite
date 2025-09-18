// Testing
import { commitTransaction } from '@/database/transaction/commitTransaction.js';
import {
    SESSION_ID,
    TEST_DATABASE_CONTEXT,
    TEST_HEADERS_WITH_SESSION,
    TEST_TRX
} from '@test/fixtures/index.js';
import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  MockInstance,
  vi
} from 'vitest';

describe('commitTransaction()', () => {
  let fetchSpy: MockInstance;
  const ENDPOINT = TEST_DATABASE_CONTEXT.endpoints.commit.toString();

  afterEach(vi.resetAllMocks);
  afterAll(vi.restoreAllMocks);

  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 204
    } as Response);

    await commitTransaction(TEST_DATABASE_CONTEXT, TEST_TRX);

    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      body: null,
      headers: TEST_HEADERS_WITH_SESSION,
      keepalive: true
    };

    expect(fetchSpy).toHaveBeenCalledWith(
      TEST_DATABASE_CONTEXT.endpoints.commit,
      REQUEST_INIT
    );
  });

  it('should error if no transaction is provided', async () => {
    // @ts-expect-error - an instance of Transaction is required
    await expect(commitTransaction(SESSION_ID)).rejects.toMatchSnapshot();
  });

  it('should error if it receives a non-204 response', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 205
    } as Response);

    await expect(
      commitTransaction(TEST_DATABASE_CONTEXT, TEST_TRX)
    ).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(
      commitTransaction(TEST_DATABASE_CONTEXT, TEST_TRX)
    ).rejects.toMatchSnapshot();
  });
});
