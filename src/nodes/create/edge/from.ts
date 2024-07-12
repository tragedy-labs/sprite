import { TypeNames } from '../../../types/database.js';
import { SpriteEdgeVertexDescriptor } from '../../../types/edge.js';
import { buildEdgePoint } from '../../utilities/buildEdgePoint.js';

export function from<V, N extends TypeNames<V>>(
  from: SpriteEdgeVertexDescriptor<V, N>
) {
  return `FROM ${buildEdgePoint(from)}`;
}
