import {
  ArcadeRecordCategory,
  EdgeRecordMeta,
  RecordMeta
} from './database.js';
import { DeleteFromCount } from './operators.js';

/** Base Interface for a command response from ArcadeDB */
interface CommandResponse<T = string> {
  operation: T;
}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a command that is a `BUCKET` operation
 */
type BucketOperationResponse<T = string, R = string> = Array<
  CommandResponse<R> & {
    bucketName: T;
    bucketId: number;
  }
>;

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `ALTER BUCKET` command
 */
export interface AlterBucket<Name = string>
  extends BucketOperationResponse<Name, 'alter bucket'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `CREATE BUCKET` command
 */
export interface CreateBucket<Name = string>
  extends BucketOperationResponse<Name, 'create bucket'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `DROP BUCKET` command
 */
export interface DropBucket<Name = string>
  extends BucketOperationResponse<Name, 'drop bucket'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a command that is a `TYPE` operation
 */
type TypeOperationResponse<T = string, R = string> = Array<
  CommandResponse<R> & {
    typeName: T;
  }
>;

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `ALTER TYPE` command
 */
export interface AlterType<Name = string>
  extends TypeOperationResponse<Name, 'alter type'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `CREATE document TYPE <Name>` command
 */
export interface CreateDocumentType<Name = string>
  extends TypeOperationResponse<Name, 'create document type'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `CREATE edge TYPE <Name>` command
 */
export interface CreateEdgeType<Name = string>
  extends TypeOperationResponse<Name, 'create edge type'> {}

/**
 * An array, which contain an object returned from
 * ArcadeDB for a `CREATE vertex TYPE <Name>` command
 */
export interface CreateVertexType<Name = string>
  extends TypeOperationResponse<Name, 'create vertex type'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `DROP document TYPE <Name>` command
 */
export interface DropType<Name = string>
  extends TypeOperationResponse<Name, 'drop type'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `INSERT INTO <document-type>` or
 * a `INSERT INTO <vertex-type>` command
 */
type InsertRecord<T, C extends ArcadeRecordCategory> = Array<T & RecordMeta<C>>;

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `INSERT INTO <document-type>`
 * command
 * @template Type The type of the document to be inserted
 */
export interface InsertDocument<Type = unknown>
  extends InsertRecord<Type, 'd'> {}
/**
 * An array, which contains an object returned from
 * ArcadeDB for a `INSERT INTO <vertex-type>`
 * command
 * @template Type The type of the vertex to be inserted
 */
export interface InsertVertex<Type = unknown> extends InsertRecord<Type, 'v'> {}

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `CREATE EDGE <edge-type>` command
 * @template TypeName - The name of the edge type
 */
export type CreateEdge<Type = unknown> = Array<Type & EdgeRecordMeta>;

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `CREATE VERTEX <vertex-type>` command
 * @template Type - The type of the vertex to create
 */
export type CreateVertex<Type = unknown> = InsertVertex<Type>;

/**
 * An array, which contains an object returned from
 * ArcadeDB for a `DELETE FROM` command. The object
 * contains one property, `count` which is an
 * integer
 */
export type DeleteFrom = Array<DeleteFromCount>;
