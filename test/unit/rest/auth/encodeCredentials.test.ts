// TODO: These tests are kind of a skeleton for browser / node.
// I'm guessing how to test this in the browser / deno from a
// nodejs environment.

import { Auth } from '@/rest/Auth.js';
import { variables } from '@test/variables.js';

describe('Auth.encodeCredentials()', () => {
  let originalWindow: Window & typeof globalThis;
  let originalBuffer: typeof Buffer;
  beforeEach(() => {
    originalWindow = global.window;
    originalBuffer = global.Buffer;
  });
  afterEach(() => {
    global.window = originalWindow;
    global.Buffer = originalBuffer;
  });

  const credentialString = `${variables.username}:${variables.password}`;

  it('should properly encode the credentials in a nodejs environment (such as those passed to this.fetch in the `Authorization` header)', async () => {
    jest.spyOn(Buffer, 'from');

    const encoded = Auth.encodeCredentials(
      variables.username,
      variables.password
    );

    expect(Buffer.from).toHaveBeenCalledWith(credentialString, 'utf-8');
    expect(encoded).toBe(
      Buffer.from(credentialString, 'utf-8').toString('base64')
    );
  });

  it('should properly encode the credentials in a browser/deno environment (such as those passed to this.fetch in the `Authorization` header)', async () => {
    const originalWindow = global.window;
    global.window = {
      btoa: jest.fn((input) => Buffer.from(input, 'utf-8').toString('base64'))
    } as unknown as Window & typeof globalThis;

    const encoded = Auth.encodeCredentials(
      variables.username,
      variables.password
    );

    // The encodeCredentials method is written so that it uses `btoa`
    // if it's available on the window object (Browser and Deno), and
    // falls back to `Buffer.from` if it's not. We expect `btoa` is
    // called in this test because we've set it on the window object.
    expect(global.window.btoa).toHaveBeenCalledWith(credentialString);
    expect(encoded).toBe(
      Buffer.from(credentialString, 'utf-8').toString('base64')
    );

    global.window = originalWindow;
  });

  it('should throw an error if no password is provided', async () => {
    expect(() =>
      // @ts-expect-error - We're testing the error thrown when the password is not provided
      Auth.encodeCredentials(variables.username)
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if no username is provided', async () => {
    expect(() =>
      // @ts-expect-error - We're testing the error thrown when the username is not provided
      Auth.encodeCredentials(null, variables.password)
    ).toThrowErrorMatchingSnapshot();
  });

  test('should throw an error when Buffer is not available', () => {
    global.window = undefined as unknown as typeof global.window;
    global.Buffer = undefined as unknown as typeof Buffer;

    expect(() =>
      Auth.encodeCredentials('user', 'pass')
    ).toThrowErrorMatchingSnapshot();
  });

  test('should throw an error when Buffer fails', () => {
    global.window = undefined as unknown as typeof global.window;
    global.Buffer = {
      from: jest.fn(() => {
        throw new Error('Buffer error');
      })
    } as unknown as typeof Buffer;

    expect(() =>
      Auth.encodeCredentials('user', 'pass')
    ).toThrowErrorMatchingSnapshot();
  });
});
