// Testing
import assert from 'node:assert';
import test, { afterEach, beforeEach, it, mock, Mock, suite } from 'node:test';

// Lib
import { ArcadeContext } from '@/context/ArcadeContext.js';
import { ArcadeHeaders } from '@/rest/ArcadeHeaders.js';
import { baseContextConfiguration } from '@test/fixtures.js';
import { ArcadeContextBaseUrlFactory } from '@/context/ArcadeContextBaseUrls.js';

it('ArcadeContext', () => {
  suite('ArcadeHeaders integration', () => {
    let arcadeHeadersInitSpy: Mock<typeof ArcadeHeaders.initialize>;

    beforeEach(() => {
      arcadeHeadersInitSpy = mock.method(ArcadeHeaders, 'initialize');
    });

    afterEach(() => arcadeHeadersInitSpy.mock.restore());

    test('calls ArcadeHeaders.initialize exactly once', () => {
      new ArcadeContext(baseContextConfiguration);
      assert.strictEqual(arcadeHeadersInitSpy.mock.calls.length, 1);
    });

    test('calls ArcadeHeaders.initialize with supplied configuration', () => {
      new ArcadeContext(baseContextConfiguration);
      assert.deepStrictEqual(arcadeHeadersInitSpy.mock.calls[0].arguments, [
        baseContextConfiguration
      ]);
    });
  });

  suite('ArcadeContextBaseUrlFactory integration', () => {
    let baseUrlFactoryInitSpy: Mock<
      typeof ArcadeContextBaseUrlFactory.initialize
    >;

    beforeEach(() => {
      baseUrlFactoryInitSpy = mock.method(
        ArcadeContextBaseUrlFactory,
        'initialize'
      );
    });

    afterEach(() => baseUrlFactoryInitSpy.mock.restore());

    test('calls ArcadeContextBaseUrlFactory.initialize exactly once', () => {
      new ArcadeContext(baseContextConfiguration);
      assert.strictEqual(baseUrlFactoryInitSpy.mock.calls.length, 1);
    });

    test('calls ArcadeContextBaseUrlFactory.initialize with supplied configuration', () => {
      new ArcadeContext(baseContextConfiguration);
      assert.deepStrictEqual(baseUrlFactoryInitSpy.mock.calls[0].arguments, [
        baseContextConfiguration
      ]);
    });
  });

  suite('Immutibility', () => {
    test('headers property is immutible', () => {
      const context = new ArcadeContext(baseContextConfiguration);

      assert.throws(() => {
        // @ts-expect-error - Testing Immutibility
        context.headers = null;
      }, TypeError);
    });

    test('urls property is immutible', () => {
      const context = new ArcadeContext(baseContextConfiguration);

      assert.throws(() => {
        // @ts-expect-error - Testing Immutibility
        context.urls = null;
      }, TypeError);
    });
  });
});
