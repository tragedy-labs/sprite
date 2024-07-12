import { skip } from "@/nodes/select/from/skip";

describe('sql > nodes > select > from > skip', () => {
  // export function skip(records: number) {
  //   return `SKIP ${records}`;
  // }
  it('it should return the SKIP + string input', () => {
    const input = 1;
    const result = skip(input);

    expect(result).toBe(`SKIP ${input}`);
  });
  it('it should handle different inputs', () => {
    const input = 2;
    const result = skip(input);

    expect(result).toBe(`SKIP ${input}`);
  });
});
