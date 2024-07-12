import { OmitMeta, TypeNames } from './database.js';

export type ValidSuperTypeKey<S, N extends TypeNames<S>> = keyof Omit<S, N>;

export type ArcadeEmbeddedMap<T> = Record<string, T>;

export type SpriteSchemaDefinitionMinMax = {
  /**
   * Defines the minimum value for this property. For number types it is the
   * minimum number as a value. For strings it represents the minimum number of characters.
   * For dates is the minimum date (uses the database date format). For collections (lists, sets,
   * maps) this attribute determines the minimally required number of elements.
   * @default undefined
   */
  min?: number;
  /**
   * Defines the maximum value for this property. For number types it is the
   * maximum number as a value. For strings it represents the maximum number of characters.
   * For dates is the maximum date (uses the database date format). For collections (lists, sets,
   * maps) this attribute determines the maximum required number of elements.
   * @default undefined
   */
  max?: number;
};

export type SpriteSchemaStringDefinition = {
  type: 'string';
} & SpriteSchemaDefinitionMinMax;

export type SpriteSchemaNumberDefinition = {
  type: 'short' | 'integer' | 'long' | 'float' | 'double' | 'decimal';
} & SpriteSchemaDefinitionMinMax;

export type SpriteSchemaMapDefinition = {
  type: 'map';
};

export type SpriteSchemaBooleanDefinition = {
  type: 'boolean';
};
export type SpriteSchemaDateDefinition = {
  type: 'date' | 'datetime';
} & SpriteSchemaDefinitionMinMax;

export type SpriteSchemaBinaryDefinition = { type: 'binary' };

export type ArcadeSchemaDefaultValue<T> =
  T extends Map<unknown, unknown> ? { [key: string]: string } : T;

export type SpriteSchemaTypeDefinition<T> = T extends string
  ? SpriteSchemaStringDefinition
  : T extends ArcadeEmbeddedMap<unknown>
    ? SpriteSchemaMapDefinition
    : T extends boolean
      ? SpriteSchemaBooleanDefinition
      : T extends number
        ? SpriteSchemaNumberDefinition
        : T extends Buffer
          ? SpriteSchemaBinaryDefinition
          : T extends Date
            ? SpriteSchemaDateDefinition
            : never;

export type SpriteSchemaDefinitionConstraints<T> = {
  /**
   * If true, the property must be present.
   * @default false
   */
  mandatory?: boolean;
  /**
   * If true, the property, if present, cannot be null.
   * @default false
   */
  notnull?: boolean;
  /**
   * If true, the property cannot be changed after the creation of the record
   * @default false
   */
  readonly?: boolean;
  /**
   * Defines default value if not present.
   * @default null
   * @example { default: 0 }
   */
  default?: T;
  /**
   * Defines the mask to validate the input as a Regular Expression
   * @default undefined
   */
  regexp?: string;
};

export type ArcadeSchemaConstraints<T> = T extends string | number
  ? SpriteSchemaDefinitionConstraints<T> & SpriteSchemaDefinitionMinMax
  : SpriteSchemaDefinitionConstraints<T>;

export type SpriteSchemaProperty<
  S,
  N extends TypeNames<S>,
  P extends keyof S[N]
> = SpriteSchemaTypeDefinition<S[N][P]> & ArcadeSchemaConstraints<S[N][P]>;

export type SpriteSchemaDefinition<S, N extends TypeNames<S>> = {
  [key in keyof OmitMeta<S[N]>]: SpriteSchemaProperty<S, N, key>;
};

export type ArcadeSchemaDataType<T> = T extends string
  ? 'string'
  : T extends number
    ? 'integer' | 'float' | 'short' | 'long'
    : T extends ArcadeEmbeddedMap<unknown>
      ? 'map'
      : never;
