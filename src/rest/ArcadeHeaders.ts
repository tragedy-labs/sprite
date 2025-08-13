import { SpriteTransaction } from '../transaction/SpriteTransaction.js';
import { DatabaseSession } from '../session/DatabaseSession.js';
import { Auth } from './Auth.js';
import { ServerSession } from '../session/ServerSession.js';
import { ArcadeValidation } from '../validation/ArcadeValidation.js';
import { ArcadeContextConfiguration } from '@/context/ArcadeContext.js';

export enum HeaderKeys {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
  ArcadeSessionId = 'arcadedb-session-id'
}

export type ArcadeBasicHeadersInit = HeadersInit & {
  [HeaderKeys.Authorization]: string;
  [HeaderKeys.ContentType]: 'application/json';
};

export type ArcadeHeadersInit = ArcadeBasicHeadersInit & {
  [HeaderKeys.ArcadeSessionId]?: string;
};

class ArcadeHeaders {
  public static compose(
    session: DatabaseSession | ServerSession,
    transaction?: SpriteTransaction
  ): ArcadeHeadersInit {
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
    configuration: ArcadeContextConfiguration
  ): ArcadeBasicHeadersInit => ({
    [HeaderKeys.ContentType]: 'application/json',
    [HeaderKeys.Authorization]: Auth.basic(
      configuration.username,
      configuration.password
    )
  });
}

export { ArcadeHeaders };
