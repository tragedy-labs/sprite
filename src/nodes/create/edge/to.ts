import { TypeNames } from '../../../types/database.js';
import { SpriteEdgeVertexDescriptor } from '../../../types/edge.js';
import { buildEdgePoint } from '../../utilities/buildEdgePoint.js';

export function to<V, N extends TypeNames<V>>(
  to: SpriteEdgeVertexDescriptor<V, N>
) {
  return `TO ${buildEdgePoint(to)}`;
}
