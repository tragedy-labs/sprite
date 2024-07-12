import { bucket } from '@/nodes/insert/bucket';

describe('sql > nodes > insert > bucket', () => {
  // export function bucket(bucketName: string) {
  //     return `BUCKET:${bucketName}`;
  // }
  it('should return a formatted BUCKET string with the provided bucket name', () => {
    const name = `myBucket`;
    const expectedResult = `BUCKET:${name}`;
    const result = bucket(name);
    expect(result).toEqual(expectedResult);
  });
});
