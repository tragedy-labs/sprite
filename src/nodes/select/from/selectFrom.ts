export function selectFrom<T>(type: T) {
  return `SELECT FROM ${type}`;
}
