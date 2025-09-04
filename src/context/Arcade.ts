import { ArcadeBasicHeadersInit, ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { ArcadeAuthParameters } from '@/rest/Auth.js';
import {
  validateHostname,
  validatePassword,
  validatePort,
  validateUsername
} from '@/validation/ArcadeValidation.js';
import {
  ArcadeServerBaseUrlFactory,
  ArcadeServerBaseUrls
} from './ArcadeContextBaseUrls.js';

/**
 * Configurable properties for creating an `ArcadeServerContext`.
 */
export interface ArcadeConfiguration extends ArcadeAuthParameters {
  /**
   * The host address of the database to connect to.
   * @example `localhost`, `127.0.0.1`, or `www.tragedy.dev`
   */
  host: string;
  /**
   * The port that the database is served at.
   * Must be a valid TCP port number (1-65535)
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
export class Arcade {
  #headers: ArcadeBasicHeadersInit;
  #urls: ArcadeServerBaseUrls;
  constructor(configuration: ArcadeConfiguration) {
    validateArcadeConfiguration(configuration);
    try {
      this.#headers = ArcadeHeaders.initialize(configuration);
      this.#urls = ArcadeServerBaseUrlFactory.initialize(configuration);
    } catch (error) {
      throw new Error('Failed to initialize ArcadeServer.', { cause: error });
    }
  }
  /** The HTTP Header object for connecting to the ArcadeDB instance. */
  get headers() {
    return this.#headers;
  }
  /** The URL's for connecting to the ArcadeDB instance */
  get urls() {
    return this.#urls;
  }
}

/**
 * Static methods for performing validation on the
 * `ArcadeConfiguration` object
 */
function validateArcadeConfiguration(
  configuration: ArcadeConfiguration
): asserts configuration is ArcadeConfiguration {
  try {
    if (!validateHostname(configuration.host)) {
      throw new TypeError(
        'ArcadeConfiguration.host is required and cannot be empty'
      );
    }

    if (!validatePort(configuration.port)) {
      throw new TypeError(
        'ArcadeConfiguration.port must be a valid port number (1-65535)'
      );
    }

    if (!validateUsername(configuration.username)) {
      throw new TypeError('ArcadeConfiguration.username is required');
    }

    if (!validatePassword(configuration.password)) {
      throw new TypeError('ArcadeConfiguration.password is required');
    }
  } catch (error) {
    throw new TypeError(
      'Could not validate the supplied ArcadeConfiguration object.',
      { cause: error }
    );
  }
}
