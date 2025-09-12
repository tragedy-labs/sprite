import { Transaction } from '@/database/transaction/index.js';
import { getVariableDescription } from '@/validation/utilities/getVariableDescription.js';

/**
 * Validate an `Transaction` object
 * @private
 */
export function validateTransaction(trx: Transaction) {
  if (trx instanceof Transaction && trx.id) {
    return true;
  } else {
    throw new TypeError(
      `Recieved an argument that could not be validated as a SpriteTransaction. ${getVariableDescription(
        trx
      )}`
    );
  }
}
