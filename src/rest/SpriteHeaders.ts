import { SpriteTransaction } from '../transaction/SpriteTransaction.js';
import { DatabaseSession } from '../session/DatabaseSession.js';
import { Auth } from './Auth.js';
import { ServerSession } from '@/session/ServerSession.js';
import { ArcadeValidation } from '@/validation/ArcadeValidation.js';

export enum HeaderKeys {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
  ArcadeSessionId = 'arcadedb-session-id'
}

export type SpriteBasicHeadersInit = HeadersInit & {
  [HeaderKeys.Authorization]: string;
  [HeaderKeys.ContentType]: 'application/json';
};

export type SpriteHeadersInit = SpriteBasicHeadersInit & {
  [HeaderKeys.ArcadeSessionId]?: string;
};

class SpriteHeaders {
  public static compose(
    session: DatabaseSession | ServerSession,
    transaction?: SpriteTransaction
  ): SpriteHeadersInit {
    try {
      if (transaction) {
        ArcadeValidation.transaction(transaction);
        return {
          [HeaderKeys.ContentType]: session.headers[HeaderKeys.ContentType],
          [HeaderKeys.Authorization]: session.headers[HeaderKeys.Authorization],
          [HeaderKeys.ArcadeSessionId]: transaction.id
        };
      } else {
        return session.headers;
      }
    } catch (error) {
      throw new Error(
        'Could not compose REST headers. Typically this is because a valid transaction object was not supplied.',
        { cause: error }
      );
    }
  }
  public static initialize = (
    username: string,
    password: string
  ): SpriteBasicHeadersInit => ({
    [HeaderKeys.ContentType]: 'application/json',
    [HeaderKeys.Authorization]: Auth.basic(username, password)
  });
}

export { SpriteHeaders };
