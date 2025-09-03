import { ArcadeBasicHeadersInit, ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { ArcadeAuthParameters } from '@/rest/Auth.js';
import {
    validateHostname,
    validatePassword,
    validatePort,
    validateUsername
} from '@/validation/ArcadeValidation.js';
import {
    ArcadeContextBaseUrlFactory,
    ArcadeContextBaseUrls
} from './ArcadeContextBaseUrls.js';

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
class ArcadeContext {
  #headers: ArcadeBasicHeadersInit;
  #urls: ArcadeContextBaseUrls;
  constructor(configuration: ArcadeContextConfiguration) {
    validateArcadeContextConfiguration(configuration);
    try {
      this.#headers = ArcadeHeaders.initialize(configuration);
      this.#urls = ArcadeContextBaseUrlFactory.initialize(configuration);
    } catch (error) {
      throw new Error('Failed to initialize ArcadeContext.', { cause: error });
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
 * `ArcadeContextConfiguration` object
 */
function validateArcadeContextConfiguration(
  configuration: ArcadeContextConfiguration
): asserts configuration is ArcadeContextConfiguration {
  try {
    if (!validateHostname(configuration.host)) {
      throw new TypeError(
        'ArcadeContextConfiguration.host is required and cannot be empty'
      );
    }

    if (!validatePort(configuration.port)) {
      throw new TypeError(
        'ArcadeContextConfiguration.port must be a valid port number (1-65535)'
      );
    }

    if (!validateUsername(configuration.username)) {
      throw new TypeError('ArcadeContextConfiguration.username is required');
    }

    if (!validatePassword(configuration.password)) {
      throw new TypeError('ArcadeContextConfiguration.password is required');
    }
  } catch (error) {
    throw new TypeError(
      'Could not validate the supplied ArcadeContextConfiguration object.',
      { cause: error }
    );
  }
}

export { ArcadeContext, type ArcadeContextConfiguration };
