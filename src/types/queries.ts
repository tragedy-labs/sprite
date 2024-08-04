import { ArcadeRecordCategory, RecordMeta } from './database.js';

/**
 * The `DOCUMENT`, `EDGE`, or `VERTEX` with ArcadeDB
 * meta attached. If being used in a query command,
 * expect it to be delivered as an array of the
 * described object.
 */
type ArcadeRecord<T, C extends ArcadeRecordCategory> = T & RecordMeta<C>;

/**
 * The `DOCUMENT` record of a certain type, with ArcadeDB meta
 * attached.
 *
 * @note If being used in a query command, expect it
 * to be delivered as an array of the described object.
 *
 * @template T The base `DOCUMENT` type definition (without meta)
 */
export type ArcadeDocument<T = unknown> = ArcadeRecord<T, 'd'>;

/**
 * The `EDGE` record of a certain type, with ArcadeDB meta
 * attached.
 *
 * @note If being used in a query command, expect it
 * to be delivered as an array of the described object.
 *
 * @template T The base `EDGE` type definition (without meta)
 */
export type ArcadeEdge<T = unknown> = ArcadeRecord<T, 'e'>;

/**
 * The `VERTEX` record of a certain type, with ArcadeDB meta
 * attached.
 *
 * @note If being used in a query command, expect it
 * to be delivered as an array of the described object.
 *
 * @template T The base `VERTEX` type definition (without meta)
 */
export type ArcadeVertex<T = unknown> = ArcadeRecord<T, 'v'>;
