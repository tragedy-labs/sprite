import { from } from '@/nodes/create/edge/from';
import { SpriteEdgeVertexDescriptor } from '@/types';

interface Vertices {
  aVertex: {
    aProperty: string;
  };
}

describe('sql > nodes > create > edge > from', () => {
  // function from<V, N extends TypeNames<V>>(
  //   from: SpriteEdgeVertexDescriptor<V, N>
  // ) {
  //   try {
  //     return `FROM ${buildEdgePoint(from)}`;
  //   } catch (error) {
  //     throw new Error(
  //       `Did not receive a valid input for the 'from' variable. Could not set FROM on the command. 'from' must be `
  //     );
  //   }
  // }
  it('should build a FROM statement from a SpriteEdgeVertexDescriptor', () => {
    const vertex: SpriteEdgeVertexDescriptor<Vertices, 'aVertex'> = {
      type: 'aVertex',
      key: 'aProperty',
      value: 'aValue'
    };
    const result = from(vertex);
    expect(result).toBe(
      `FROM (SELECT FROM ${vertex.type} WHERE ${vertex.key} = '${vertex.value}')`
    );
  });
  it('should build a FROM statement from an @rid', () => {
    const result = from('#0:0');
    expect(result).toBe('FROM #0:0');
  });
});
