import { client as dbClient } from '../../client/testClient.js';
import { DocumentTypes } from '../../../types.js';

export { dbClient };

const client = dbClient.documentModality<DocumentTypes>();

export { client };
