// export function bucket(bucketName: string | Array<string>) {
//   try {
//     validation.bucketName(bucketName);
//     return Array.isArray(bucketName)
//       ? `BUCKET ${bucketName.join(',')}`
//       : `BUCKET ${bucketName}`;
//   } catch (error) {
//     throw new TypeError(
//       `Could not set BUCKET [bucketName(s)] on the command.`,
//       { cause: error }
//     );
//   }
// }

import { bucket } from '../../../../../../src/nodes/create/bucket.js';
import { validation } from '../../../../../../src/validation/ArcadeParameterValidation.js';

describe('SQL > nodes > create > bucket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(validation, 'bucketName');
  });

  it('validates the bucket name, erroring if invalid', () => {
    const invalidBucketName = '+ ThI$ wIll nEvEr Do';

    expect(() => bucket(invalidBucketName)).toThrowErrorMatchingSnapshot();
    expect(validation.bucketName).toHaveBeenCalledWith(invalidBucketName);
  });

  it('accepts a string, and appends it to the BUCKET keyword', () => {
    const validBucketName = 'BucketName';
    (validation.bucketName as jest.Mock).mockImplementation(() => {});

    expect(bucket(validBucketName)).toEqual(`BUCKET ${validBucketName}`);
    expect(validation.bucketName).toHaveBeenCalledWith(validBucketName);
  });

  it('accepts an array, performs a join, and appends it to the BUCKET keyword', () => {
    const validBucketNames = ['bucket1', 'bucket2', 'bucket3'];
    (validation.bucketName as jest.Mock).mockImplementation(() => {});

    expect(bucket(validBucketNames)).toEqual(
      `BUCKET ${validBucketNames.join(',')}`
    );
    expect(validation.bucketName).toHaveBeenCalledWith(validBucketNames);
  });
});
