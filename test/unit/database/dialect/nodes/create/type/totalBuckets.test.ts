// export function totalBuckets(totalNumberOfBuckets: number) {
//   return `BUCKETS ${totalNumberOfBuckets}`;
// }

import { totalBuckets } from '@/nodes/create/type/totalBuckets';

describe('sql > nodes > create > type > totalBuckets', () => {
  it('should return a string BUCKETS + [numberOfBuckets]', () => {
    const numberOfBuckets = 0;
    expect(totalBuckets(numberOfBuckets)).toBe(`BUCKETS ${numberOfBuckets}`);
  });
});
