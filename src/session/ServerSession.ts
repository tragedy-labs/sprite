import { Routes } from '../server/routes.js';
import { Session, ISpriteBaseSession } from './Session.js';

type RouteKeys = `${Routes}`;

class ServerSession extends Session {
  constructor(params: ISpriteBaseSession) {
    super(params);
    this.endpoints = this.buildEndPoints(Routes);
  }
}

export { ServerSession };
