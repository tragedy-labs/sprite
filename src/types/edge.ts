import { OmitMeta, TypeNames } from './database.js';

export interface ISpriteIndexdescriptor<S, N extends TypeNames<S>> {
  /**
   * The type of the record to select an index for.
   */
  type: N;
  /**
   * The key of the property to select an index for.
   */
  key: keyof S[N];
  /**
   * The value of the property key to select an index for.
   */
  value: S[N][keyof S[N]];
}

/**
 * Describes a `to` or `from` point of an edge, either as a string (the record's `@rid`),
 * or, by providing an object which describes an index of a vertex to use a
 * `to`/`from` point (i.e. `{type: 'user', key: 'name', value: 'Jeremiah'}`)
 */
export type SpriteEdgeVertexDescriptor<V, N extends keyof V> =
  | ISpriteIndexdescriptor<V, N>
  | string;

/**
 * Options associated with creating a new edge.
 */
export interface ISpriteEdgeOptions<D> {
  /**
   * Data to populate the edge with.
   */
  data?: OmitMeta<D>;
  /**
   * The bucket to store the edge in.
   * @default undefined
   */
  bucket?: string;
  /**
   * Skip creation if the edge already exists between two vertices (i.e. the edge
   * must be unique between the vertices). This works only if the edge type has a
   * `UNIQUE` index on `from`/`to` fields, otherwise the creation fails.
   * @default false
   */
  upsert?: boolean;
  /**
   * Creates a unidirectional edge; by default edges are bidirectional
   * @default false
   */
  unidirectional?: boolean;
  /**
   * When set to `true`, skips the creation of the edge in another edge already exists with the same
   * direction (same from/to) and same edge type, instead of throwing an error.
   * @default false
   */
  ifNotExists?: boolean;
  retry?: {
    /**
     * The number of retries to attempt in the event of conflict, (optimistic approach).
     */
    attempts?: number;
    /**
     * The wait time (in ms), between retries.
     */
    wait?: number;
  };
  /**
   * Defines whether it breaks the command down into smaller blocks and the size of
   * the batches. This helps to avoid memory issues when the number of vertices is
   * too high.
   * @default 100
   */
  batchSize?: number;
}
