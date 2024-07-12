import { deleteFrom } from '@/nodes/delete/delete';

describe('sql > nodes > delete > delete', () => {
  // export function deleteFrom<T>(typeName: T) {
  //   return `DELETE FROM ${typeName}`;
  // }
  it('should return a DELETE FROM SQL statement for a given table name', () => {
    const tableName = 'users';
    const expectedResult = 'DELETE FROM users';
    const result = deleteFrom(tableName);
    expect(result).toEqual(expectedResult);
  });
});
