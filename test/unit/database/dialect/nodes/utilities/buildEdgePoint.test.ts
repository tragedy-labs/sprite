import { buildEdgePoint } from '@/nodes/utilities/buildEdgePoint';
import { SpriteEdgeVertexDescriptor } from '@/types';

type TestType = {
  aType: {
    aProperty: string;
  };
};

describe('sql > nodes > utilities > buildPoint', () => {
  // function buildEdgePoint<V, N extends TypeNames<V>>(
  //   point: SpriteEdgeVertexDescriptor<V, N>
  // ): string {
  //   return typeof point === 'string'
  //     ? point
  //     : `(${selectIndex(point.type, point.key, point.value)})`;
  // }
  it('should return a SELECT FROM SQL statement with type, key, and value, wrapped in parenthesis', () => {
    const point: SpriteEdgeVertexDescriptor<TestType, 'aType'> = {
      type: 'aType',
      key: 'aProperty',
      value: 'aValue'
    };
    const expectedResult = `(SELECT FROM ${point.type} WHERE ${point.key} = '${point.value}')`;
    const result = buildEdgePoint<TestType, 'aType'>(point);
    expect(result).toEqual(expectedResult);
  });
});
