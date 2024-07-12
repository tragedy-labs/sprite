export function merge<T>(data: T) {
  return `MERGE ${JSON.stringify(data)}`;
}
