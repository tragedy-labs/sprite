import { ArcadeDatabaseContext } from '@/context/ArcadeDatabaseContext.js';
import { QueryLanguages } from '@/database/constants/languages.js';
import { arcadeQuery } from '@/database/static/arcadeQuery.js';
import { EXPLAIN } from '@/database/static/sql/EXPLAIN.js';
import type { ArcadeSqlExplanation } from '@/types/database.js';

/**
 * Returns information about query execution planning of a specific statement,
 * without executing the statement itself.
 * @param database - An {@link ArcadeDatabaseContext `ArcadeDatabaseContext`} instance.
 * @param sql - The SQL command to explain.
 * @returns The explanation of the command.
 * @example
 * ```ts
 * const context = new ArcadeContext({
 *   username: 'root',
 *   password: 'admin1234',
 *   host: 'localhost',
 *   port: 5124
 * });
 *
 * const db = new ArcadeDatabaseContext('aDatabase', context);
 *
 * async function spriteExplainExample() {
 *   try {
 *     const explanation = await explain(db, "SELECT FROM schema:types");
 *     console.log(explanation);
 *     // {
 *     //   executionPlan: {
 *     //     type: 'QueryExecutionPlan',
 *     //     javaType: 'com.arcadedb.query.sql.executor.SelectExecutionPlan',
 *     //     cost: -1,
 *     //     prettyPrint: '+ FETCH DATABASE METADATA TYPES',
 *     //     steps: [ [Object] ]
 *     //   },
 *     //   executionPlanAsString: '+ FETCH DATABASE METADATA TYPES'
 *     // }
 *     return explanation;
 *   } catch (error) {
 *     console.error(error);
 *     // handle error conditions
 *   }
 * };
 *
 * spriteExplainExample();
 * ```
 */
export async function explain(
  databaseContext: ArcadeDatabaseContext,
  sql: string
): Promise<ArcadeSqlExplanation> {
  try {
    const result = await arcadeQuery<ArcadeSqlExplanation>(
      databaseContext,
      QueryLanguages.SQL,
      EXPLAIN(sql)
    );
    return result[0];
  } catch (error) {
    throw new Error(`Could not retreive explanation for ${sql}.`, {
      cause: error
    });
  }
}
