import { ArcadeFetchError } from '@/errors/ArcadeFetchError';

export interface ArcadeFetchErrorDescription {
  statusText: string;
  extended: string;
}

const details: Record<number, ArcadeFetchErrorDescription> = {
  400: {
    statusText: 'Bad Request',
    extended: `The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing). In the context of ArcadeDB, this could be the result of the server being sent an invalid language, or an invalid command.`
  },
  403: {
    statusText: 'Forbidden / Invalid Credentials',
    extended: `The server understood the request but refuses to authorize it. If authentication credentials were provided in the request, the server considers them insufficient to grant access.`
  },
  404: {
    statusText: 'Not Found',
    extended: `The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.`
  },
  500: {
    statusText: 'Internal Server Error',
    extended: `The server encountered an unexpected condition that prevented it from fulfilling the request.`
  }
};
describe('ArcadeFetchError.details', () => {
  // export class ArcadeFetchError extends Error {
  //   detail: string;
  //   error: string;
  //   exception: string;
  //   constructor(response: Response) {
  //     const detail = details[response.status];
  //     const error = `${response.status} ${
  //       response.statusText ? response.statusText : detail.statusText
  //     }`;
  //     const errorString = `${error}. ${detail.extended}`;
  //     super(errorString);
  //     this.error = error;
  //     this.name = 'ArcadeFetchError';
  //     this.detail = detail.extended;
  //     this.exception = `(http) ${this.error}. https://httpstatuses.io/${response.status}`;
  //   }
  // }
  it('should return the correct error details for a 400 status code', () => {
    const response = { status: 400 } as Response;
    const error = new ArcadeFetchError(response);
    expect(error.detail).toBe(details[400].extended);
  });
  it('should return the correct error details for a 403 status code', () => {
    const response = { status: 403 } as Response;
    const error = new ArcadeFetchError(response);
    expect(error.detail).toBe(details[403].extended);
  });
  it('should return the correct error details for a 404 status code', () => {
    const response = { status: 404 } as Response;
    const error = new ArcadeFetchError(response);
    expect(error.detail).toBe(details[404].extended);
  });
  it('should return the correct error details for a 500 status code', () => {
    const response = { status: 500 } as Response;
    const error = new ArcadeFetchError(response);
    expect(error.detail).toBe(details[500].extended);
  });

  it('should use the statusText property of the response if it is defined', () => {
    const response = { status: 400, statusText: 'Included Status Text' } as Response;
    const error = new ArcadeFetchError(response);
    expect(error.error).toBe(`400 ${response.statusText}`);
  });

});
