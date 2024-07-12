import { returnCount } from "@/nodes/delete/returnCount";

describe('sql > nodes > delete > returnCount', () => {
  it('should return "RETURN BEFORE" when mode is "BEFORE"', () => {
    const mode = 'BEFORE';
    const expectedResult = 'RETURN BEFORE';
    const result = returnCount(mode);
    expect(result).toEqual(expectedResult);
  });
});