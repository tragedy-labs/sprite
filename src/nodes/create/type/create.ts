import { ArcadeRecordType } from '../../../types/database.js';

export function create(recordType: ArcadeRecordType) {
  return `CREATE ${recordType}`;
}
