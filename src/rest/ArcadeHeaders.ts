import { ArcadeConfiguration } from '@/context/Arcade.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import { Auth } from '@/rest/Auth.js';
import { validateTransaction } from '@/validation/index.js';

export const enum HeaderKeys {
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
    headers: ArcadeBasicHeadersInit,
    transaction?: Transaction
  ): ArcadeHeadersInit {
    try {
      if (transaction) {
        validateTransaction(transaction);
        return {
          [HeaderKeys.ContentType]: headers[HeaderKeys.ContentType],
          [HeaderKeys.Authorization]: headers[HeaderKeys.Authorization],
          [HeaderKeys.ArcadeSessionId]: transaction.id
        };
      } else {
        return headers;
      }
    } catch (error) {
      throw new Error(
        'Could not compose REST headers. Typically this is because a valid transaction object was not supplied.',
        { cause: error }
      );
    }
  }
  public static initialize = (
    configuration: ArcadeConfiguration
  ): ArcadeBasicHeadersInit => ({
    [HeaderKeys.ContentType]: 'application/json',
    [HeaderKeys.Authorization]: Auth.basic(
      configuration.username,
      configuration.password
    )
  });
}

export { ArcadeHeaders };
