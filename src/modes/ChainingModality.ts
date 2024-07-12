import {
  ArcadeResultSortDirection,
  ArcadeSelectTimeoutStrategy
} from '../nodes/types.js';
import {
  ISpriteSelectFromOptions,
  SpriteOperators,
  TypeNames,
  WithRid
} from '../types/database.js';
import { SpriteDatabase } from '../SpriteDatabase.js';
import { SqlDialect } from '../dialects/SqlDialect.js';

class ChainingModality<S> {
  private database: SpriteDatabase;
  private _sql: SqlDialect;
  constructor(database: SpriteDatabase, dialect: SqlDialect) {
    this.database = database;
    this._sql = dialect;
  }
  /**
   * Perform a `SELECT FROM` query on a specific type.
   * @param typeName The type to perform a select from query on
   * @returns An array containing the records found during the query.
   */
  selectFrom = <N extends TypeNames<S>, P extends keyof WithRid<S, N>>(
    typeName: N
  ) => new SelectFrom<S, N, P>(this._sql, typeName);
}

// SELECT [ <Projections> ] [ FROM <Target> (([ LET <Assignment>* ] ])) ( not implemented)
// [ WHERE <Condition>* ]
// (([ GROUP BY <Field>* ])) (not implemented)
// [ ORDER BY <Fields>* [ ASC|DESC ] * ]
// (([ UNWIND <Field>* ])) (not implemented)
// [ SKIP <SkipRecords> ]
// [ LIMIT <MaxRecords> ]
// [ TIMEOUT <MilliSeconds> [ <STRATEGY> ] ]

class SelectFrom<S, N extends TypeNames<S>, P extends keyof WithRid<S, N>> {
  private typeName: N;
  private _sql: SqlDialect;
  private options?: ISpriteSelectFromOptions<S, N, P>;
  constructor(operators: SqlDialect, typeName: N) {
    this.typeName = typeName;
    this._sql = operators;
  }
  /**
   * Designates conditions to filter the result-set.
   * @param reference The field/property to target in the where statement
   * @param operator The operator (i.e. !=, !!, <=, etc)
   * @param value The value to check again the operator.
   */
  where = (
    reference: P,
    operator: SpriteOperators,
    value: WithRid<S, N>[P]
  ) => {
    this.options = {
      ...this.options,
      where: [reference, operator, value]
    };
    return this;
  };
  /**
   * Designates the field with which to order the result-set.
   * @param field The field to order the result-set by.
   * @param direction Defines the direction to sort the result (ASCending or DESCending).
   */
  orderBy = (field: keyof S[N], direction: ArcadeResultSortDirection) => {
    this.options = {
      ...this.options,
      orderBy: {
        field,
        direction
      }
    };
    return this;
  };
  /**
   * Defines the number of records you want to skip from the start of the result-set.
   * You mayfind this useful in Pagination, when using it in conjunction with the
   * limit `option`.
   * @param numberOfRecords The number of records to skip
   * @returns
   */
  skip = (numberOfRecords: number) => {
    this.options = {
      ...this.options,
      skip: numberOfRecords
    };
    return this;
  };
  /**
   * Defines the maximum number of records in the result-set. You may find this useful in
   * Pagination, when using it in conjunction with the `skip` option.
   * @param numberOfRecords The number of records to limit the query to.
   */
  limit = (numberOfRecords: number) => {
    this.options = {
      ...this.options,
      skip: numberOfRecords
    };
    return this;
  };
  /**
   * Defines the maximum time in milliseconds for the query, and optionally the
   * exception strategy to use.
   * @param timeout The duration of the timeout in milliseconds.
   * @param strategy The timeout strategy to use. `RETURN` Truncates the result-set, returning the data collected up to the timeout. `EXCEPTION` Raises an exception.
   */
  timeout = (duration: number, strategy?: ArcadeSelectTimeoutStrategy) => {
    this.options = {
      ...this.options,
      timeout: { duration, strategy }
    };
    return this;
  };
  /**
   * Executes the SQL query / command on the database.
   * @returns The result of the operation.
   */
  execute = () => this._sql.selectFrom<S, N, P>(this.typeName, this.options);
}

export { ChainingModality };
