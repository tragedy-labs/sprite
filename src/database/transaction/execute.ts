import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { QueryLanguages } from '@/database/constants/languages.js';
import { Routes } from '@/database/constants/routes.js';
import { Transaction } from '@/database/transaction/Transaction.js';
import type {
  ArcadeQueryParameters,
  ArcadeSupportedQueryLanguages
} from '@/database/types.js';
import { Rest } from '@/rest/Rest.js';

/**
 * Static method to execute CRUD as part of a transaction.
 * @param language The {@link ArcadeSupportedQueryLanguages `ArcadeSupportedQueryLanguages`} to use for the command.
 * @param command The CRUD command to execute.
 * @param params The parameters to pass to the command.
 * @returns The result of the CRUD operation.
 * @throws Error if the CRUD operation fails.
 */
export async function execute<T>(
  database: ArcadeDatabaseContext,
  transaction: Transaction,
  language: QueryLanguages,
  command: string,
  params?: ArcadeQueryParameters
): Promise<T> {
  try {
    return await Rest.postJson<T>(
      Routes.COMMAND,
      { language, command, params },
      database,
      transaction
    );
  } catch (error) {
    throw new Error(`Could not execute ${command}`, {
      cause: error
    });
  }
}
