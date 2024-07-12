import { TypeNames } from '../../types/database.js';
import { SpriteEdgeVertexDescriptor } from '../../types/edge.js';
import { selectIndex } from '../../nodes/select/selectIndex.js';

/**
 * If the supplied value is a string (rid) it just returns the string,
 * if it's an object representing an index of a record, then it converts it
 * to a `SELECT FROM` string using a template.
 * TODO: This could be expanded to include more elaborate queries
 * instead of a basic `SELECT FROM` key / value thing
 * @param {SpriteEdgeVertexDescriptor} point
 * @returns
 */
export function buildEdgePoint<V, N extends TypeNames<V>>(
  point: SpriteEdgeVertexDescriptor<V, N>
): string {
  return typeof point === 'string'
    ? point
    : `(${selectIndex(point.type, point.key, point.value)})`;
}
