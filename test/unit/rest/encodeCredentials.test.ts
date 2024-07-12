import { SpriteRestClient } from '../../../src/SpriteRestClient.js';
import { endpoints } from '../../../src/endpoints/server.js';
import { variables } from '../../variables.js';
import { client } from './utilities/testClient.js';

// TODO: These tests are kind of a skeleton for browser / node.
// I'm guessing how to test this in the browser / deno from a
// nodejs environment.

describe('SpriteBase.encodeCredentials()', () => {
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
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response());
    jest.spyOn(Buffer, 'from');

    client.encodeCredentials(variables.username, variables.password);

    expect(Buffer.from).toHaveBeenCalledWith(credentialString, 'utf-8');
  });

  it('should properly encode the credentials in a browser/deno environment (such as those passed to this.fetch in the `Authorization` header)', async () => {
    const originalWindow = global.window;
    global.window = {
      btoa: jest.fn((input) => Buffer.from(input, 'utf-8').toString('base64'))
    } as unknown as Window & typeof globalThis;

    jest.spyOn(global, 'fetch').mockResolvedValue(new Response());

    // We create a new `SpriteBase` instance with the `address`, `username`, and `password`
    // to test that the credentials are being encoded when client is created. Typically
    // tests just use the variable `testClient`, but in this case we need a new instance.
    const client = new SpriteRestClient({
      address: variables.address,
      username: variables.username,
      password: variables.password
    });

    await client.fetch(endpoints.ready);

    // The encodeCredentials method is written so that it uses `btoa`
    // if it's available on the window object (Browser and Deno), and
    // falls back to `Buffer.from` if it's not. We expect `btoa` is
    // called in this test because we've set it on the window object.
    expect(global.window.btoa).toHaveBeenCalledWith(credentialString);

    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.ready}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(
            credentialString,
            'utf-8'
          ).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    global.window = originalWindow;
  });

  it('should throw an error if no password is provided', async () => {
    expect(
      () =>
        // @ts-expect-error - We're testing the error thrown when the password is not provided
        new SpriteBase({
          username: variables.username,
          address: variables.address
        })
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if no username is provided', async () => {
    expect(
      () =>
        // @ts-expect-error - We're testing the error thrown when the username is not provided
        new SpriteBase({
          password: variables.password,
          address: variables.address
        })
    ).toThrowErrorMatchingSnapshot();
  });

  test('should throw an error when Buffer is not available', () => {
    global.window = undefined as unknown as typeof global.window;
    global.Buffer = undefined as unknown as typeof Buffer;

    expect(() => client.encodeCredentials('user', 'pass')).toThrowErrorMatchingSnapshot()
  });

  test('should throw an error when Buffer fails', () => {
    global.window = undefined as unknown as typeof global.window;
    global.Buffer = {
      from: jest.fn(() => { throw new Error('Buffer error'); })
    } as unknown as typeof Buffer;

    expect(() => client.encodeCredentials('user', 'pass')).toThrowErrorMatchingSnapshot();
  });



});
