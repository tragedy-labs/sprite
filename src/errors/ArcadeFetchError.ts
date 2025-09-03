export interface ArcadeFetchErrorDescription {
  statusText: string;
  extended: string;
}

/**
 * Details about HTTP errors.
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
 * Custom `Error` extended to include specifics about HTTP errors.
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
