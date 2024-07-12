export function orderBy<K>(field: K) {
  return `ORDER BY ${field}`;
}
