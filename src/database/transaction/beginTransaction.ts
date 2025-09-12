import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import type { ArcadeTransactionIsolationLevel } from '@/database/transaction/types.js';
import { HeaderKeys } from '@/rest/ArcadeHeaders.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Static method to begin a transaction.
 * @param session The {@link ArcadeDatabase `ArcadeDatabase`} to begin the transaction on.
 * @param isolationLevel The isolation level of the transaction.
 * @returns A {@link SpriteTransaction `SpriteTransaction`} instance for the target session.
 */
export async function beginTransaction(
  context: ArcadeDatabaseContext,
  isolationLevel?: ArcadeTransactionIsolationLevel
): Promise<Transaction> {
  try {
    // 'READ_COMMITTED' is default in ARCADEDB,
    // so we don't bother sending that
    const response = await Rest.post(
      context.endpoints.begin,
      context.arcade.headers,
      isolationLevel === 'REPEATABLE_READ'
        ? JSON.stringify({ isolationLevel })
        : null
    );

    if (response.status !== 204) {
      throw new Error(
        `Server returned an unexpected response. Status: ${response.status} / ${response.statusText}.`
      );
    }

    const transactionId = response.headers?.get(HeaderKeys.ArcadeSessionId);

    // because the headers could be null
    // TODO: this isn't a good way to check for the transactionId
    if (!transactionId || typeof transactionId !== 'string') {
      throw new Error('Invalid transaction key received from server.');
    } else {
      return new Transaction(context, transactionId);
    }
  } catch (error) {
    throw new Error(
      `Unable to begin transaction in database "${context.name}".`,
      { cause: error }
    );
  }
}
