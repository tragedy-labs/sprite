import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { beginTransaction, Transaction } from '@/database/transaction/index.js';
import type { ArcadeTransactionIsolationLevel } from '@/database/transaction/types.js';

/**
 * Static method to manage a transaction within the scope.
 * @param session The {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} to execute the transaction on.
 * @param callback The callback to execute within transaction context.
 * @param isolationLevel The {@link ArcadeTransactionIsolationLevel isolationLevel} of the transaction.
 * @returns A touple containing result of the transaction, and a boolean indicating if the transaction was committed or rolled-back.
 */
export async function manageTransaction<T = void>(
  context: ArcadeDatabaseContext,
  callback: (trx: Transaction) => Promise<T>,
  isolationLevel?: ArcadeTransactionIsolationLevel
): Promise<[boolean, T]> {
  const trx = await beginTransaction(context, isolationLevel);
  try {
    const result = await callback(trx);
    if (trx.rolledBack) {
      return [false, result];
    } else {
      await trx.commit();
      return [true, result];
    }
  } catch (error) {
    // Attempt to rollback the transaction
    try {
      await trx.rollback();
      throw new Error(`Transaction ${trx.id} failed and was rolled back.`, {
        cause: error
      });
    } catch (rollbackError) {
      throw new Error(
        `Transaction ${trx.id} failed and rollback also failed.`,
        { cause: rollbackError }
      );
    }
  }
}
