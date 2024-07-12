import { updateRecord } from '@/nodes/update/record/updateRecord';

describe('sql > nodes > update > record > updateRecord', () => {
  // export function updateRecord(rid: string) {
  //   return `UPDATE ${rid}`;
  // }
  it('it should return the UPDATE + input string', () => {
    const input = '#0:0';
    const result = updateRecord(input);

    expect(result).toBe(`UPDATE ${input}`);
  });
  it('it should handle different inputs', () => {
    const input = '#1:0';
    const result = updateRecord(input);

    expect(result).toBe(`UPDATE ${input}`);
  });
});
