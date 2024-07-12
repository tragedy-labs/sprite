export function drop<N = string>(typeName: N) {
  return `DROP TYPE ${typeName}`;
}
