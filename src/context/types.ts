import { Arcade } from '@/context/Arcade.js';

/**
 * @internal
 */
export type ArcadeClientEndpoints<E extends Record<string, string>> = Record<
  E[keyof E],
  URL
>;

/**
 * @internal
 */
export interface ArcadeClientContext<E extends Record<string, string>> {
  readonly arcade: Arcade;
  readonly endpoints: ArcadeClientEndpoints<E>;
}
