// export function selectIndex<V, N extends TypeNames<V> = string>(
//   type: N,
//   key: keyof V[N],
//   value: V[N][keyof V[N]]
// ) {
//   return `SELECT FROM ${type as string} WHERE ${key as string} = '${value}'`;
// }

import { selectIndex } from '@/nodes/select/selectIndex';

type TestType = {
  aType: {
    aProperty: string;
  };
};

describe('sql > nodes > select > selectIndex', () => {
  it('should return a SELECT FROM SQL statement with type, key, and value', () => {
    const type = 'aType';
    const key = 'aProperty';
    const value = 'aValue';
    const expectedResult = `SELECT FROM ${type} WHERE ${key} = '${value}'`;
    const result = selectIndex<TestType, 'aType'>(type, key, value);
    expect(result).toEqual(expectedResult);
  });
});
