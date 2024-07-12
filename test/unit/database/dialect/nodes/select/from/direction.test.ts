import { direction } from '@/nodes/select/from/direction';

describe('sql > nodes > select > from > direction', () => {
  // export function direction(direction: ArcadeResultSortDirection) {
  //   return direction as string;
  // }
  it('should return the provided direction as a string', () => {
    const inputDirection = 'ASC';
    const result = direction(inputDirection);
    expect(result).toEqual('ASC');
  });
  it('should handle different directions correctly', () => {
    const inputDirection = 'DESC';
    const result = direction(inputDirection);
    expect(result).toEqual('DESC');
  });
});
