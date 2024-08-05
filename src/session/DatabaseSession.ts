import { ISpriteAuthParameters } from '../rest/Auth.js';
import { Routes } from '../database/routes.js';
import { Session } from './Session.js';

export interface ISpriteDatabaseNewSession extends ISpriteAuthParameters {
  databaseName: string;
}

export interface ISpriteDatabaseExistingSession {
  session: Session | DatabaseSession;
  databaseName: string;
}

class DatabaseSession extends Session {
  public databaseName: string;
  constructor(
    params: ISpriteDatabaseExistingSession | ISpriteDatabaseNewSession
  ) {
    super(params);
    this.databaseName = params.databaseName;
    this.endpoints = this.buildEndPoints(Routes, params.databaseName);
  }
}

export { DatabaseSession };
