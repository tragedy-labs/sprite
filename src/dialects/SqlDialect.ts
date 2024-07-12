import { SpriteDatabase } from '../SpriteDatabase.js';
import {
  ArcadeRecordType,
  EdgeRecordMeta,
  ISpriteCreateTypeOptions,
  ISpriteDeleteFromOptions,
  ISpriteDropTypeOptions,
  ISpriteInsertRecordOptions,
  ISpriteSelectFromOptions,
  OmitMeta,
  RecordMeta,
  TypeNames,
  WithRid
} from '../types/database.js';
import { SpriteCommand } from '../SpriteCommand.js';
import {
  ArcadeDeleteReturnCount,
  ArcadeResultSortDirection,
  ArcadeSelectTimeoutStrategy
} from '../nodes/types.js';
import { nodes } from '../nodes/index.js';
import { SpriteType } from '../SpriteType.js';
import { SpriteTransaction } from '../SpriteTransaction.js';
import {
  ArcadeCreateTypeResponse,
  ArcadeDeleteFromResponse,
  ArcadeDropTypeResponse,
  ArcadeUpdateOneResponse,
  DeleteFromCount
} from '../types/operators.js';
import { validation } from '../validation/ArcadeParameterValidation.js';
import {
  ISpriteEdgeOptions,
  SpriteEdgeVertexDescriptor
} from '../types/edge.js';
import { ValidSuperTypeKey } from '../types/type.js';

class SqlDialect {
  database: SpriteDatabase;
  private _validate = validation;
  private _nodes = nodes;
  constructor(database: SpriteDatabase) {
    this.database = database;
  }
  /**
   * Create a type in the database.
   * @param typeName The name of the type to create
   * @param recordType The type of record to create (`document`, `edge`, or `vertex`)
   * @param transaction
   * @param options
   * @returns an instance of SpriteType for the created type.
   */
  createType = async <S, N extends TypeNames<S>>(
    typeName: N,
    recordType: ArcadeRecordType,
    options?: ISpriteCreateTypeOptions<S, N>
  ) => {
    try {
      // CREATE <DOCUMENT|VERTEX|EDGE> TYPE <type>
      // [ IF NOT EXISTS ]
      // [EXTENDS <super-type>] [BUCKET <bucket-id>[,]*] [BUCKETS <total-bucket-number>]

      this._validate.typeName(typeName);

      const createTypeCommand = new SpriteCommand({
        initial: this._nodes.create.type.create(recordType)
      });

      createTypeCommand.append<TypeNames<S>>(
        this._nodes.create.type.type,
        typeName
      );

      if (options?.ifNotExists) {
        createTypeCommand.append<boolean>(
          this._nodes.create.type.ifNotExists,
          options.ifNotExists
        );
      }

      if (options?.extends) {
        createTypeCommand.append<ValidSuperTypeKey<S, N>>(
          this._nodes.create.type.superType,
          options.extends
        );
      }

      if (options?.buckets) {
        createTypeCommand.append<Array<string> | string>(
          this._nodes.create.bucket,
          options.buckets
        );
      }

      if (options?.totalBuckets) {
        createTypeCommand.append<number>(
          this._nodes.create.type.totalBuckets,
          options.totalBuckets
        );
      }
      const response = await this._command<ArcadeCreateTypeResponse>(
        createTypeCommand.toString()
      );
      if (
        response[0]?.typeName === typeName ||
        (Array.isArray(response) &&
          response.length === 0 &&
          options?.ifNotExists)
      ) {
        return this.type<S, N>(typeName);
      } else {
        throw new Error(
          `Received an unexpected response from the server when attempting to create type: ['${
            typeName as string
          }'], of recordType: ['${recordType as string}'], into database ['${
            this.database.name
          }']`
        );
      }
    } catch (error) {
      throw new Error(
        `Unable to create type: ['${typeName as string}'], in database: ['${
          this.database.name
        }']`,
        { cause: error }
      );
    }
  };
  /**
   * Returns an instance of `SpriteType` for the provided `typeName`.
   * @see SpriteType
   * @param {string} typeName The name of the type to target
   * @returns {SpriteType} An instance of `SpriteType`.
   */
  type = <S, N extends TypeNames<S>>(typeName: N): SpriteType<S, N> =>
    new SpriteType<S, N>(this.database, typeName);
  /**
   * Create a new edge, of a specified type, in the database.
   * @note The type must be created before a record can be created.
   * @param type The type of edge to create.
   * @param from The starting vertex of the edge. It can be either the rid of the vertex (`@44:9`), or an index described by an object (`{type: 'user', key: 'name', value: 'Jeremiah'}`).
   * @param to The starting vertex of the edge. It can be either the rid of the vertex (`@44:9`), or an index described by an object (`{type: 'car', key: 'color', value: 'yellow'}`).
   * @param transaction The transaction to create the edge within.
   * @param options The options to create the edge with
   * @return The record that is created in the database.
   */
  createEdge = async <
    E,
    V,
    N extends TypeNames<E>,
    V1 extends TypeNames<V>,
    V2 extends TypeNames<V>
  >(
    type: N,
    from: SpriteEdgeVertexDescriptor<V, V1>,
    to: SpriteEdgeVertexDescriptor<V, V2>,
    transaction: SpriteTransaction,
    options?: ISpriteEdgeOptions<E[N]>
  ): Promise<Array<E[N] & EdgeRecordMeta>> => {
    // CREATE EDGE <type> [BUCKET <bucket>] [UPSERT] FROM <rid>|(<query>)|[<rid>]* TO <rid>|
    // (<query>)|[<rid>]*
    // [UNIDIRECTIONAL]
    // [IF NOT EXISTS]
    // [SET <field> = <expression>[,]*]|CONTENT {<JSON>}
    // [RETRY <retry> [WAIT <pauseBetweenRetriesInMs]] [BATCH <batch-size
    // >]
    try {
      const createEdgeCommand = new SpriteCommand({
        initial: this._nodes.create.edge.createEdge<N>(type)
      });

      if (options?.bucket) {
        createEdgeCommand.append(this._nodes.create.bucket, options.bucket);
      }

      if (options?.upsert) {
        createEdgeCommand.append<boolean>(
          this._nodes.create.edge.upsert,
          options.upsert
        );
      }

      createEdgeCommand.append<SpriteEdgeVertexDescriptor<V, V1>>(
        this._nodes.create.edge.from,
        from
      );

      createEdgeCommand.append<SpriteEdgeVertexDescriptor<V, V2>>(
        this._nodes.create.edge.to,
        to
      );

      if (options?.unidirectional) {
        createEdgeCommand.append<boolean>(
          this._nodes.create.edge.unidirectional,
          options.unidirectional
        );
      }

      if (options?.ifNotExists) {
        createEdgeCommand.append<boolean>(
          this._nodes.create.edge.ifNotExists,
          options.ifNotExists
        );
      }

      if (options?.data) {
        createEdgeCommand.append<OmitMeta<E[N]>>(
          this._nodes.create.edge.content,
          options.data
        );
      }
      if (options?.retry?.attempts) {
        createEdgeCommand.append<number>(
          this._nodes.create.edge.retry,
          options.retry.attempts
        );
      }

      if (options?.retry?.wait) {
        createEdgeCommand.append<number>(
          this._nodes.create.edge.wait,
          options.retry.wait
        );
      }

      if (options?.batchSize) {
        createEdgeCommand.append<number>(
          this._nodes.create.edge.batchSize,
          options.batchSize
        );
      }

      return await this._command<Array<E[N] & EdgeRecordMeta>>(
        createEdgeCommand.toString(),
        transaction
      );
    } catch (error) {
      throw Error(`Unable to build CREATE EDGE sql command.`, {
        cause: error
      });
    }
  };
  /**
   * Insert a new record, of a specified type, in the database. This can be used to create both document, and vertex records.
   * @note The type must be created before a record can be created.
   * @param typeName The type of the record to create.
   * @param transaction The transaction to create the record within.
   * @param options The options to insert the record with.
   * @return The record that is created in the database.
   */
  insertRecord = async <S, N extends TypeNames<S>>(
    typeName: N,
    transaction: SpriteTransaction,
    options?: ISpriteInsertRecordOptions<S[N]>
  ): Promise<Array<S[N] & RecordMeta>> => {
    try {
      // INSERT INTO [TYPE:]<type>|BUCKET:<bucket>
      // [CONTENT {<JSON>}|[{<JSON>}[,]*]]
      const insertIntoCommand = new SpriteCommand({
        initial: this._nodes.insert.record.insertInto<string>(
          options?.bucket
            ? this._nodes.insert.record.bucket(options.bucket)
            : (typeName as string)
        )
      });

      if (options?.data) {
        insertIntoCommand.append<OmitMeta<S[N]> | OmitMeta<S[N]>[]>(
          this._nodes.insert.record.content,
          options.data
        );
      }

      return await this._command<Array<S[N] & RecordMeta>>(
        insertIntoCommand.toString(),
        transaction
      );
    } catch (error) {
      throw new Error(
        `Unable to build SQL command for INSERT INTO [${typeName as string}] in database: [${
          this.database.name
        }]`
      );
    }
  };
  /**
   * Removes an existing type from the schema. Does not remove the property values
   * in the records, it just changes the schema information (existing records
   * keep their existing property values).
   * @param typeName The name of the type to drop.
   * @param options The options to perform to drop the type with.
   * @returns `true` if the type was successfully dropped.
   * @throws `Error` if the type could not be dropped.
   */
  dropType = async <S, N extends TypeNames<S>>(
    typeName: N,
    options?: ISpriteDropTypeOptions
  ) => {
    try {
      // DROP TYPE <type> [UNSAFE] [IF EXISTS]
      const dropTypeCommand = new SpriteCommand({
        initial: this._nodes.drop.type.drop<N>(typeName)
      });

      if (options?.unsafe) {
        dropTypeCommand.append<boolean>(
          this._nodes.drop.type.unsafe,
          options.unsafe
        );
      }

      if (options?.ifExists) {
        dropTypeCommand.append<boolean>(
          this._nodes.drop.type.ifExists,
          options.ifExists
        );
      }

      return await this._command<ArcadeDropTypeResponse>(
        dropTypeCommand.toString()
      );
    } catch (error) {
      throw new Error(
        `Unable to drop type [${typeName as string}] from database [${
          this.database.name
        }]`,
        { cause: error }
      );
    }
  };
  /**
   * Perform a `DELETE FROM` sql command by providing a typename and options.
   * @param typeName The name of the type to generate a `DELETE FROM` command for.
   * @param options The options to perform the command with
   * @returns An array containing the results of the query.
   */
  deleteFrom = async <S, N extends TypeNames<S>, P extends keyof WithRid<S, N>>(
    typeName: N,
    transaction: SpriteTransaction,
    options?: ISpriteDeleteFromOptions<S, N, P>
  ): Promise<DeleteFromCount> => {
    // DELETE FROM <Type> [RETURN <returning>]
    // [WHERE <Condition>*] [LIMIT <MaxRecords>] [TIMEOUT <MilliSeconds>] [UNSAFE]
    try {
      // TODO: If there no options (like you want delete all the records of a certain type)
      // you must use backticks on the typeName, so this is a hack for now (TODO)
      const command = new SpriteCommand({
        initial: this._nodes.delete.from.delete<N>(
          options?.where ? typeName : (`\`${typeName as string}\`` as N)
        )
      });

      if (options?.return) {
        command.append<ArcadeDeleteReturnCount>(
          this._nodes.delete.from.returnCount,
          options?.return
        );
      }

      if (options?.where) {
        command.append(this._nodes.delete.from.where, options.where);
      }

      if (options?.limit) {
        command.append<number>(this._nodes.delete.from.limit, options.limit);
      }

      if (options?.timeout) {
        command.append<number>(
          this._nodes.delete.from.timeout,
          options.timeout
        );
      }

      const [result] = await this._command<ArcadeDeleteFromResponse>(
        command.toString(),
        transaction
      );
      return result;
    } catch (error) {
      throw new Error(
        `Could not delete record of type: ['${
          typeName as string
        }'], from database ['${this.database.name}'], where: ['${JSON.stringify(
          options?.where
        )}'].`,
        { cause: error }
      );
    }
  };
  /**
   * A wrapper on the `SpriteDatabase.command()` method that sets the
   * language to SQL so it isn't set in multiple places.
   */
  private _command = async <T>(
    command: string,
    transaction?: SpriteTransaction
  ): Promise<T> => {
    const result = transaction
      ? await this.database.command<T>('sql', command, transaction)
      : await this.database.command<T>('sql', command);
    return result;
  };
  /**
   * A wrapper on the `SpriteDatabase.query()` method that sets
   * the language to SQL, so it isn't set in multiple places.
   */
  private _query = async <T>(command: string): Promise<T[]> =>
    await this.database.query<T>('sql', command);
  /**
   * Perform a `SELECT FROM` sql query by providing a typename and options.
   * @param typeName The name of the type to generate a `SELECT FROM` query for.
   * @param options The options to perform the query with
   * @returns An array containing the results of the query.
   */
  selectFrom = async <S, N extends TypeNames<S>, P extends keyof WithRid<S, N>>(
    typeName: N,
    options?: ISpriteSelectFromOptions<S, N, P>
  ): Promise<Array<S[N]>> => {
    // SELECT [ <Projections> ] [ FROM <Target> (([ LET <Assignment>* ] ])) ( not implemented)
    // [ WHERE <Condition>* ]
    // (([ GROUP BY <Field>* ])) (not implemented)
    // [ ORDER BY <Fields>* [ ASC|DESC ] * ]
    // (([ UNWIND <Field>* ])) (not implemented)
    // [ SKIP <SkipRecords> ]
    // [ LIMIT <MaxRecords> ]
    // [ TIMEOUT <MilliSeconds> [ <STRATEGY> ] ]
    try {
      const command = new SpriteCommand({
        initial: this._nodes.select.from.selectFrom<N>(typeName)
      });

      if (options?.where) {
        command.append(this._nodes.select.from.where, options.where);
      }

      if (options?.orderBy) {
        command.append<keyof S[N]>(
          this._nodes.select.from.orderBy,
          options.orderBy.field
        );
        if (options?.orderBy.direction) {
          command.append<ArcadeResultSortDirection>(
            this._nodes.select.from.direction,
            options.orderBy.direction
          );
        }
      }

      if (options?.skip) {
        command.append<number>(this._nodes.select.from.skip, options.skip);
      }

      if (options?.limit) {
        command.append<number>(this._nodes.select.from.limit, options.limit);
      }

      if (options?.timeout) {
        command.append<number>(
          this._nodes.select.from.timeout,
          options.timeout.duration
        );
        if (options?.timeout.strategy) {
          command.append<ArcadeSelectTimeoutStrategy>(
            this._nodes.select.from.strategy,
            options.timeout.strategy
          );
        }
      }

      const result = await this._query<S[N]>(command.toString());
      return result;
    } catch (error) {
      throw new Error(
        `Could not execute select command on type:${
          typeName as string
        } in database ${this.database.name}`,
        { cause: error }
      );
    }
  };
  /**
   * Select a record by providing the unique `@rid`.
   * @param rid The rid of the record.
   * @returns The record, if found.
   * @throws If the record could not be found.
   */
  selectOne = async <S, N extends TypeNames<S>>(rid: string): Promise<S[N]> => {
    try {
      const [result] = await this._query<S[N]>(`SELECT FROM ${rid}`);
      return result;
    } catch (error) {
      throw new Error(
        `Could not select RID: [${rid}], from database ${this.database.name}.`,
        { cause: error }
      );
    }
  };
  /**
   * Delete a record by providing the `rid`
   * @param rid The RID of the record to delete.
   * @param transaction The transaction to conduct the operation within.
   * @returns `true` if the record was deleted.
   * @throws If the record was not deleted.
   */
  deleteOne = async (
    rid: string,
    transaction: SpriteTransaction
  ): Promise<DeleteFromCount> => {
    try {
      const [result] = await this._command<ArcadeDeleteFromResponse>(
        `DELETE FROM ${rid}`,
        transaction
      );
      return result;
      // TODO: Should this have more robust error handling?
      // switch (result[0].count) {
      //   case 1:
      //     return result[0];
      //   case 0:
      //     throw new Error(
      //       `No record found with rid: [${rid}], in database: [${this.database.name}]`
      //     );
      //   default:
      //     throw new Error(
      //       `Unexpected result when deleting record by rid: [${rid}]`
      //     );
      // }
    } catch (error) {
      throw new Error(`Could not delete record: [${rid}]`, { cause: error });
    }
  };
  /**
   * Update a record by providing the `@rid`.
   * @param rid The RID of the record to update.
   * @param data The data to update the record with.
   * @returns `true` if the record was updated.
   * @throws If the record was not updated.
   */
  updateOne = async <S, N extends TypeNames<S>>(
    rid: string,
    data: OmitMeta<S[N]>,
    transaction: SpriteTransaction
  ): Promise<ArcadeUpdateOneResponse> => {
    // UPDATE <recordID>
    // [CONTENT <JSON>]
    // RETURN AFTER @this
    try {
      const command = new SpriteCommand({
        initial: this._nodes.update.record.updateRecord(rid)
      });

      if (data) {
        command.append<OmitMeta<S[N]>>(this._nodes.update.record.content, data);
      }

      command.append<boolean>(this._nodes.update.record.returnAfter, true);

      return await this._command<ArcadeUpdateOneResponse>(
        command.toString(),
        transaction
      );
    } catch (error) {
      throw new Error(
        `An error occured when attempting to update record @rid: ${rid}, in database ${this.database.name}`,
        { cause: error }
      );
    }
  };
}

export { SqlDialect };
