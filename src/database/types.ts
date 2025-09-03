export type AcceptedMapShape = Record<string, boolean | string | number>;

export type QueryParameters = Record<string, any>;

export type ArcadeQueryParameters<T extends QueryParameters = QueryParameters> =
  T;

export type ArcadeCommand =
  | string
  | { command: string; params: Record<string, unknown> };

/**
 * The Query languages supported by ArcadeDB, supplied as a parameter
 * to `SpriteDatabase.query()` and `SpriteDatabase.command()`
 */
export type ArcadeSupportedQueryLanguages =
  | 'sql'
  | 'sqlscript'
  | 'graphql'
  | 'cypher'
  | 'gremlin'
  | 'mongo';
