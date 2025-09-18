// Vitest
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

// Lib
import { Arcade, ArcadeConfiguration } from '@/context/Arcade.js';
import { ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { Endpoints } from '@/routes/Endpoints.js';

// Fixtures
import {
    TEST_ARCADE,
    TEST_ARCADE_CONFIGURATION
} from '@test/fixtures/index.js';
import { afterEach } from 'node:test';

describe('Arcade', () => {
  describe('ArcadeHeaders integration', () => {
    let arcadeHeadersInitSpy: MockInstance;

    beforeEach(() => {
      arcadeHeadersInitSpy = vi.spyOn(ArcadeHeaders, 'initialize');
    });

    afterEach(() => arcadeHeadersInitSpy.mockRestore());

    it('calls ArcadeHeaders.initialize exactly once', () => {
      new Arcade(TEST_ARCADE_CONFIGURATION);
      expect(arcadeHeadersInitSpy).toHaveBeenCalledTimes(1);
    });

    it('calls ArcadeHeaders.initialize with supplied configuration', () => {
      new Arcade(TEST_ARCADE_CONFIGURATION);
      expect(arcadeHeadersInitSpy).toHaveBeenCalledWith(
        TEST_ARCADE_CONFIGURATION
      );
    });
  });

  describe('ArcadeContextBaseUrlFactory integration', () => {
    let baseUrlFactoryInitSpy: MockInstance;

    beforeEach(() => {
      baseUrlFactoryInitSpy = vi.spyOn(Endpoints, 'arcade');
    });
    afterEach(() => baseUrlFactoryInitSpy.mockRestore());

    it('calls Endpoints.arcade exactly once', () => {
      new Arcade(TEST_ARCADE_CONFIGURATION);
      expect(baseUrlFactoryInitSpy).toHaveBeenCalledTimes(1);
    });

    it('calls Endpoints.arcade with supplied configuration', () => {
      new Arcade(TEST_ARCADE_CONFIGURATION);
      expect(baseUrlFactoryInitSpy).toHaveBeenCalledWith(
        TEST_ARCADE_CONFIGURATION
      );
    });
  });

  describe('Internal properties', () => {
    it('sets headers property', () => {
      const headers = ArcadeHeaders.initialize(TEST_ARCADE_CONFIGURATION);
      expect(TEST_ARCADE.headers).toEqual(headers);
    });

    it('sets urls property', () => {
      const urls = Endpoints.arcade(TEST_ARCADE_CONFIGURATION);
      expect(TEST_ARCADE.urls).toEqual(urls);
    });
  });

  describe('Propagates errors encountered during initialization', () => {
    it('throws on invalid config', () => {
      const badConfiguration: ArcadeConfiguration = {
        ...TEST_ARCADE_CONFIGURATION,
        // @ts-expect-error - Testing error propagation
        username: true
      };

      expect(() => new Arcade(badConfiguration)).toThrow();
    });
  });

  describe('Immutability', () => {
    it('headers property is immutable', () => {
      const TEST_ARCADE = new Arcade(TEST_ARCADE_CONFIGURATION);

      expect(() => {
        // @ts-expect-error - Testing immutability
        TEST_ARCADE.headers = null;
      }).toThrow(TypeError);
    });

    it('urls property is immutable', () => {
      const TEST_ARCADE = new Arcade(TEST_ARCADE_CONFIGURATION);

      expect(() => {
        // @ts-expect-error - Testing immutability
        TEST_ARCADE.urls = null;
      }).toThrow(TypeError);
    });
  });
});
