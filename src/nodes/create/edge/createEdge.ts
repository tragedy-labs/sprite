export function createEdge<T>(typeName: T) {
  return `CREATE EDGE ${typeName}`;
}
