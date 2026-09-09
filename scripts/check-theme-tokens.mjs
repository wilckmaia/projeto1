// Checks all palette pairs and the pre-paint bootstrap without a database.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const css = readFileSync('src/app/themes.css', 'utf8');
const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255)
    .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
let palettes = 0;
for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
  const tokens = Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map(m => [m[1], m[2]]));
  if (!tokens.ink) continue;
  palettes++;
  const pairs = ['paper', 'surface', 'surface-soft', 'surface-hover', 'accent-soft']
    .flatMap(bg => [['ink', bg], ['muted', bg], ['accent-text', bg]]);
  pairs.push(['on-accent', 'accent'], ['on-accent', 'accent-hover']);
  for (const prefix of ['success', 'danger', 'warm', 'cool', 'gold']) {
    if (tokens[`${prefix}-text`]) pairs.push([`${prefix}-text`, `${prefix}-bg`]);
  }
  if (tokens['disabled-bg']) pairs.push(['disabled-text', 'disabled-bg']);
  for (const [fg, bg] of pairs) {
    const a = luminance(tokens[fg]), b = luminance(tokens[bg]);
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(ratio >= 4.5, `${selector.trim()}: ${fg}/${bg} = ${ratio.toFixed(2)}`);
  }
}
assert.equal(palettes, 10, 'Two global palettes and eight political world palettes');

const source = ts.transpileModule(readFileSync('src/lib/theme.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const themeModule = { exports: {} };
runInNewContext(source, { exports: themeModule.exports });
const { THEME_KEY, themeBootstrapScript } = themeModule.exports;
for (const saved of [null, 'light', 'dark', 'invalid']) {
  // Each fresh document represents a reload or reopening with the saved value.
  for (let visit = 0; visit < 2; visit++) {
    const document = { documentElement: { dataset: {} } };
    runInNewContext(themeBootstrapScript, { document, localStorage: {
      getItem(key) { assert.equal(key, THEME_KEY); return saved; },
    } });
    assert.equal(document.documentElement.dataset.theme, saved === 'dark' ? 'dark' : 'light');
  }
}
const document = { documentElement: { dataset: {} } };
runInNewContext(themeBootstrapScript, { document, localStorage: {
  getItem() { throw new Error('Storage blocked'); },
} });
assert.equal(document.documentElement.dataset.theme, 'light');
console.log('PASS: 10 palettes, WCAG AA text contrast, saved theme bootstrap and blocked storage fallback');
