import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from 'node:fs';
import 'mocha';
import {assert} from 'chai';
import { khnormal } from '../src/index.js';

describe('khnormal', function () {
  it('should not change a valid syllable', function() {
    assert.equal(khnormal('ខ្មែរ'), 'ខ្មែរ');
  });

  describe('khnormal transform bad.txt to good.txt', function() {
    const bad = readFileSync(makePathToFixture('bad.txt'), 'utf-8').replace(/\r(\n?)/g, '\n').split('\n');
    const good = readFileSync(makePathToFixture('good.txt'), 'utf-8').replace(/\r(\n?)/g, '\n').split('\n');

    assert.equal(bad.length, good.length, `bad.length ${bad.length} should equal good.length ${good.length}`);
    for(let i = 0; i < bad.length; i++) {
      it(`should transform '${bad[i]}' to '${good[i]}'`, function() {
        assert.equal(khnormal(bad[i]), good[i]);
      });
    }
  });
});

/**
 * Builds a path to the fixture with the given path components.
 *
 * e.g., makePathToFixture('basic.xml')
 *
 * @param components One or more path components.
 */
function makePathToFixture(...components: string[]): string {
  return fileURLToPath(new URL(path.join('..', '..', 'test', 'fixtures', ...components), import.meta.url));
}
