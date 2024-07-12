import { SpriteDatabase } from '../SpriteDatabase.js';
import { ModalityBase } from './ModalityBase.js';
import {
  ISpriteCreateTypeOptions,
  ISpriteInsertRecordOptions,
  TypeNames
} from '../types/database.js';
import { SpriteTransaction } from '../SpriteTransaction.js';
import { SqlDialect } from '../dialects/SqlDialect.js';

/**
 * Handles the operations related to document records in the database.
 * It wraps the methods of the SpriteOperations class with types.
 * @param client The instance of Database to target
 * @param operators The operators instance to use
 */
class DocumentModality<S> extends ModalityBase<S> {
  constructor(client: SpriteDatabase, dialect: SqlDialect) {
    super(client, dialect);
  }
  /**
   * Insert a new document into the database.
   * @param type The type of document to create. It must be a type that currently exists in the schema.
   * @param options The options for the document insertion.
   * @returns The record that is created in the database.
   * @see createType
   * @example
   *
   * const database = new Database({
   *   username: 'root',
   *   password: 'rootPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aDatabase'
   * });
   *
   * interface DocumentTypes {
   *   aDocument: {
   *     aProperty: string
   *   }
   * }
   *
   * const client = database.documentModality<DocumentTypes>();
   *
   * // inserts / record creation must be conducted within a transaction
   * client.transaction(async (trx)=>{
   *   // to create a document, a type must be created first
   *   await client.createType('aDocument', trx);
   *   const document = await client.newDocument('aDocument', trx, {
   *     aProperty: 'aValue',
   *   });
   *   console.log(document);
   *   // {
   *   //   '@rid': '#0:0',
   *   //   '@cat': 'd',
   *   //   '@type': 'aDocument',
   *   //   aProperty: 'aValue'
   *   // }
   * });
   */
  newDocument = <N extends keyof S>(
    typeName: N,
    transaction: SpriteTransaction,
    options?: ISpriteInsertRecordOptions<S[N]>
  ) => this._sql.insertRecord<S, N>(typeName, transaction, options);
  /**
   * Create a new document type in the schema.
   * @param typeName The name of the type to create.
   * @param options Options to create the type with.
   * @returns an instance of SpriteType.
   * @throws `Error` if the type could not be created.
   * @note non-idempotent commands (such a creating types) must be issued as part of a transaction
   * @example
   *
   * const database = new Database({
   *   username: 'root',
   *   password: 'rootPassword',
   *   address: 'http://localhost:2480',
   *   databaseName: 'aDatabase'
   * });
   *
   * interface DocumentTypes {
   *   aDocument: {
   *     aProperty: string
   *   }
   * }
   *
   * const client = database.documentModality<DocumentTypes>();
   *
   * async function createDocumentTypeExample() {
   *   try {
   *     const type = await client.createType('aDocument');
   *     console.log(type.name);
   *     // 'aType'
   *   } catch (error) {
   *     // handle error conditions
   *     console.error(error);
   *   }
   * };
   *
   * createDocumentTypeExample();
   */
  createType = <N extends TypeNames<S>>(
    typeName: N,
    options?: ISpriteCreateTypeOptions<S, N>
  ) => this._sql.createType<S, N>(typeName, 'document', options);
}

export { DocumentModality };
