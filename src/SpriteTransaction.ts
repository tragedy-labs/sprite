import { SpriteDatabase } from './SpriteDatabase.js';

export class SpriteTransaction {
  private _id: string;
  private _committed: boolean = false;
  private database: SpriteDatabase;
  constructor(database: SpriteDatabase, transactionId: string) {
    this.database = database;
    this._id = transactionId;
  }
  /** The trasaction ID */
  get id() {
    return this._id;
  }
  /** Whether or not the transaction has been committed */
  get committed() {
    return this._committed;
  }
  commit = async () => {
    // TODO: This old committed logic is flawed and perhaps replacing
    // with a status would be a better approach.
    this._committed = await this.database.commitTransaction(this.id);
    return this.committed;
  };
  rollback = async () => this.database.rollbackTransaction(this.id);
}
