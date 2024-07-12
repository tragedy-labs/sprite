export function insertInto<T>(type: T) {
  return `INSERT INTO ${type}`;
}
