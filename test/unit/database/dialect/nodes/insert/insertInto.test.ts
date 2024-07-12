import { insertInto } from '@/nodes/insert/insertInto';

describe('sql > nodes > insert > insertInto', () => {
  // export function insertInto<T>(type: T) {
  //   return `INSERT INTO ${type}`;
  // }
  it('should return a formatted INSERT INTO string with the provided type name', () => {
    const name = 'myType';
    const expectedResult = `INSERT INTO ${name}`;
    const result = insertInto(name);
    expect(result).toEqual(expectedResult);
  });
});
