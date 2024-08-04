export interface ArcadeFetchErrorDescription {
  statusText: string;
  extended: string;
}

/**
 * The error thrown when the fetch() method of the Sprite class encounters an error.
 * @class
 * @param description A detailed error message to display.
 * @param response The response from the fetch() method.
 * @extends Error
 * @example
 * const response = await sprite.fetch();
 * if (response.status !== 200 || response.status !== 204) {
 *   throw new ArcadeFetchError("It wasn't a 204 or 200", response);
 * }
 */
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

/**
 * The error thrown when the fetch() method of the Sprite class encounters an error.
 */
export class ArcadeFetchError extends Error {
  detail: string;
  error: string;
  exception: string;
  constructor(response: Response) {
    const detail = details[response.status];
    const error = `${response.status} ${
      response.statusText ? response.statusText : detail.statusText
    }`;
    const errorString = `${error}. ${detail.extended}`;
    super(errorString);
    this.error = error;
    this.name = 'ArcadeFetchError';
    this.detail = detail.extended;
    this.exception = `(http) ${this.error}. https://httpstatuses.io/${response.status}`;
  }
}
