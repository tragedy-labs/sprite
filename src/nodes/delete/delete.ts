export function deleteFrom<T>(typeName: T) {
  return `DELETE FROM ${typeName}`;
}
