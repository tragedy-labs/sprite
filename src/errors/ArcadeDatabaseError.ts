export type SpriteArcadeErrorResult = {
  error: string;
  detail: string;
  exception: string;
};

/**
 * Custom `Error` class extended to match errors returned by ArcadeDB server.
 */
export class ArcadeDatabaseError extends Error {
  error: string;
  exception: string;
  detail: string;
  constructor({ error, detail, exception }: SpriteArcadeErrorResult) {
    super(`${error}. ${detail}.`);
    this.name = 'ArcadeDatabaseError';
    this.error = error;
    this.detail = detail;
    this.exception = exception;
  }
}
