import {
  ArcadeContextBaseUrlFactory,
  ArcadeContextBaseUrls
} from './ArcadeContextBaseUrls.js';
import { ArcadeAuthParameters } from '@/rest/Auth.js';
import { ArcadeBasicHeadersInit, ArcadeHeaders } from '@/rest/ArcadeHeaders.js';

/**
 * Configurable properties for creating an `ArcadeServerContext`.
 */
interface ArcadeContextConfiguration extends ArcadeAuthParameters {
  /**
   * The host address of the database to connect to.
   * @example `localhost`, `127.0.0.1`, or `www.tragedy.dev`
   */
  host: string;
  /**
   * The port that the database is served at.
   * @example 2480, 2481
   */
  port: number;
  /**
   * Whether or not the server is using security protocol
   * such as `tls`, or `ssl`
   * @example true
   */
  secure?: boolean;
}

/**
 * Contextual information used to connect to an ArcadeDB server.
 * @param configuration - The properties for the context being constructed.
 */
class ArcadeContext {
  /** The HTTP Header object for connecting to the ArcadeDB instance in context. */
  readonly headers: ArcadeBasicHeadersInit;
  /** The URL's used to connect to the ArcadeDB instance */
  readonly urls: ArcadeContextBaseUrls;
  constructor(configuration: ArcadeContextConfiguration) {
    this.headers = ArcadeHeaders.initialize(configuration);
    this.urls = ArcadeContextBaseUrlFactory.initialize(configuration);
  }
}

export { ArcadeContext, type ArcadeContextConfiguration };
