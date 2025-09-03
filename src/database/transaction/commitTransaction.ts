import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { Routes } from '@/database/constants/routes.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Static method to commit a transaction.
 * @param database The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to commit the transaction on.
 * @param transaction The id of the transaction to commit.
 * @returns `true` if the transaction was committed.
 */
export async function commitTransaction(
  database: ArcadeDatabaseContext,
  transaction: Transaction
) {
  try {
    const result = await Rest.post(Routes.COMMIT, null, database, transaction);
    if (result.status === 204) {
      return true;
    } else {
      throw new Error(
        `Unexpected response from the server when attemping to commit transaction ${transaction.id}`
      );
    }
  } catch (error) {
    throw new Error(`Unable to commit transaction ${transaction.id}`, {
      cause: error
    });
  }
}
