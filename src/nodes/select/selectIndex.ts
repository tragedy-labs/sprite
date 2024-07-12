import { TypeNames } from '../../types/database.js';

export function selectIndex<V, N extends TypeNames<V>>(
  type: N,
  key: keyof V[N],
  value: V[N][keyof V[N]]
) {
  return `SELECT FROM ${type as string} WHERE ${key as string} = '${value}'`;
}
