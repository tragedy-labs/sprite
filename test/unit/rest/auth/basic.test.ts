// TODO: These tests are kind of a skeleton for browser / node.
// I'm guessing how to test this in the browser / deno from a
// nodejs environment.

import { Auth } from '@/rest/Auth.js';
import { variables } from '@test/variables.js';

describe('Auth.basic()', () => {
  it('it should return a properly formatted string for basic auth headers', async () => {
    const encoded = Auth.basic(variables.username, variables.password);

    expect(encoded).toBe(
      `Basic ${Buffer.from(
        `${variables.username}:${variables.password}`,
        'utf-8'
      ).toString('base64')}`
    );
  });

  it('should propagate errors from internal methods', async () => {
    jest.spyOn(Auth, 'encodeCredentials').mockImplementation(() => {
      throw new Error('Simulated error');
    });

    expect(() =>
      Auth.basic(variables.username, variables.password)
    ).toThrowErrorMatchingSnapshot();
  });
});
