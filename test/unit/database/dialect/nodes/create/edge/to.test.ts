import { to } from '@/nodes/create/edge/to';
import { SpriteEdgeVertexDescriptor } from '@/types';

interface Vertices {
  aVertex: {
    aProperty: string;
  };
}

describe('sql > nodes > create > edge > to', () => {
  // export function to<V, N extends TypeNames<V>>(
  //   to: SpriteEdgeVertexDescriptor<V, N>
  // ) {
  //   try {
  //     return `TO ${buildEdgePoint(to)}`;
  //   } catch (error) {
  //     throw new Error(
  //       `Did not receive a valid input for the 'to' variable. Could not set TO on the command. 'to' must be `
  //     );
  //   }
  // }
  it('should build a TO statement from a SpriteEdgeVertexDescriptor', () => {
    const vertex: SpriteEdgeVertexDescriptor<Vertices, 'aVertex'> = {
      type: 'aVertex',
      key: 'aProperty',
      value: 'aValue'
    };
    const result = to(vertex);
    expect(result).toBe(
      `TO (SELECT FROM ${vertex.type} WHERE ${vertex.key} = '${vertex.value}')`
    );
  });
  it('should build a FROM statement from an @rid', () => {
    const result = to('#0:0');
    expect(result).toBe('TO #0:0');
  });
});
