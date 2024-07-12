export type ArcadeSelectTimeoutStrategy = 'EXCEPTION' | 'RETURN';

export function strategy(strategy: ArcadeSelectTimeoutStrategy) {
  return `${strategy}`;
}
