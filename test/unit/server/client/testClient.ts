// Lib
import { SpriteServer } from '@/server/SpriteServer.js';

// Testing
import { TestServerSession as SESSION } from '@test/variables.js';

export const client = new SpriteServer(SESSION);
