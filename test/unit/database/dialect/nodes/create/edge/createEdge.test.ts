import { createEdge } from '@/nodes/create/edge/createEdge';

describe('sql > nodes > createEdge', () => {
  // export function createEdge<T>(typeName: T) {
  //   return `CREATE EDGE ${typeName}`;
  // }
  it('should return a string containing CREATE EDGE, with the type name appended', () => {
    expect(createEdge('myEdge')).toBe('CREATE EDGE myEdge');
  });
});
