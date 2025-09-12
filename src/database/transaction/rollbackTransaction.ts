import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Static method to rollback a transaction.
 * @param session The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to rollback the transaction on.
 * @param transaction The id of the transaction to rollback.
 * @returns `true` if the transaction was rolled back.
 */
export async function rollbackTransaction(
  context: ArcadeDatabaseContext,
  transaction: Transaction
) {
  try {
    const result = await Rest.post(
      context.endpoints.rollback,
      context.arcade.headers,
      null,
      transaction
    );
    if (result.status === 204) {
      return true;
    } else {
      throw new Error(
        `Unexpected response from the.arcade when attemping to rollback transaction ${transaction.id}`
      );
    }
  } catch (error) {
    throw new Error(`Unable to rollback transaction ${transaction.id}`, {
      cause: error
    });
  }
}
