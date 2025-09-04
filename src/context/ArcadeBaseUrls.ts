import { ArcadeConfiguration } from './Arcade.js';

/**
 * An object containing the base REST and WebSocket urls
 * for communicating with an ArcadeDB server.
 */
export interface ArcadeBaseUrls {
  rest: URL;
  socket: URL;
}

/**
 * Static class that contains methods for building `URL`'s
 * and string endpoints for ArcadeDB.
 */
export class ArcadeBaseUrlFactory {
  static initialize(configuration: ArcadeConfiguration): ArcadeBaseUrls {
    return {
      rest: this.rest(configuration),
      socket: this.websocket(configuration)
    };
  }
  /**
   * Builds a base URL for the `http` endpoints of the ArcadeDB server.
   */
  static rest(configuration: ArcadeConfiguration): URL {
    return new URL(
      `/api/v1`,
      `${configuration.secure ? 'https' : 'http'}://${configuration.host}:${configuration.port}`
    );
  }
  /**
   * Builds a URL for the `websocket` endpoint of the ArcadeDB server.
   */
  static websocket(configuration: ArcadeConfiguration): URL {
    return new URL(
      '/ws',
      `${configuration.secure ? 'wss' : 'ws'}://${configuration.host}:${configuration.port}`
    );
  }
}
