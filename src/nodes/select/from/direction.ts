export type ArcadeResultSortDirection = 'ASC' | 'DESC';

// TODO: Perhaps SpriteCommand.append() should just return
// the string instead of a calling another function to
// do it.
export function direction(direction: ArcadeResultSortDirection) {
  return direction as string;
}
