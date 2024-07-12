import { validation } from '../../validation/ArcadeParameterValidation.js';

export function bucket(bucketName: string | Array<string>) {
  try {
    validation.bucketName(bucketName);
    return Array.isArray(bucketName)
      ? `BUCKET ${bucketName.join(',')}`
      : `BUCKET ${bucketName}`;
  } catch (error) {
    throw new TypeError(
      `Could not set BUCKET [bucketName(s)] on the command.`,
      { cause: error }
    );
  }
}
