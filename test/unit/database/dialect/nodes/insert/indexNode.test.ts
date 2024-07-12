import { index } from '@/nodes/insert/indexNode';

describe('sql > nodes > insert > index', () => {
  // export function index(indexName: string) {
  //   return `INDEX:${indexName}`;
  // }
  it('should return a formatted INDEX string with the provided index name', () => {
    const name = 'myIndex';
    const expectedResult = `INDEX:${name}`;
    const result = index(name);
    expect(result).toEqual(expectedResult);
  });
});
