import { ArcadeServer } from '@/context/ArcadeServer.js';

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
  readonly server: ArcadeServer;
  readonly endpoints: ArcadeClientEndpoints<E>;
}
