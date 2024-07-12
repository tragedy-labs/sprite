export type ArcadeDeleteReturnCount = 'BEFORE' | 'COUNT';

export function returnCount(mode: ArcadeDeleteReturnCount) {
  return `RETURN ${mode}`;
}
