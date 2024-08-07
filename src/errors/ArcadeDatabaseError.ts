export type SpriteArcadeErrorResult = {
  error: string;
  detail: string;
  exception: string;
};

/**
 * Converts exceptions from the ArcadeDB into JavaScript errors
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
