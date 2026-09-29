'use strict';
// Reuse the portfolio's vector mascot. No browser, private data or credentials.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const scope = {
  window: {},
  document: {
    documentElement: { dataset: { motion: 'off' } },
    querySelectorAll: () => [], getElementById: () => null,
    addEventListener: () => {}, hidden: false
  },
  matchMedia: () => ({ matches: true }),
  setTimeout: () => 0, clearTimeout: () => {}
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'character.js'), 'utf8'), scope, {timeout: 1000});
const mascot = scope.window.BetoCharacter.drawing(false)
  .replace('<svg ', '<svg x="825" y="110" width="320" height="430" ')
  .replaceAll('var(--skin)', '#c4beb5').replaceAll('var(--shoe)', '#555555');
const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<style>.hand-point,.hand-thumb,.wink-line{display:none}text{font-family:Arial,'DejaVu Sans',sans-serif}</style>
<rect width="1200" height="630" fill="#0b0b0b"/>
<path d="M62 89H1138" stroke="#343434"/>
<text x="62" y="62" font-size="12" letter-spacing="3" fill="#a6a6a2">PORTFOLIO INTERATIVO / VOL. 02</text>
<text x="1113" y="62" font-size="14" fill="#a6a6a2">bd.</text>
<text x="62" y="231" font-size="96" font-weight="700" letter-spacing="-5" fill="#f4f4f2">Beto</text>
<text x="62" y="326" font-size="96" font-weight="700" letter-spacing="-5" fill="#aaa9a5">Delazane.</text>
<text x="64" y="383" font-size="23" fill="#f4f4f2">Senior Software Engineer</text>
<ellipse cx="978" cy="332" rx="195" ry="176" fill="#292929"/>
<ellipse cx="978" cy="332" rx="195" ry="176" fill="none" stroke="#515151" transform="rotate(-22 978 332)"/>
${mascot}
<text x="62" y="582" font-size="12" letter-spacing="1" fill="#a6a6a2">ESTRUTURA POR DENTRO. PERSONALIDADE POR FORA.</text>
</svg>`;
fs.mkdirSync(path.join(root, 'assets'), {recursive: true});
fs.writeFileSync(path.join(root, 'assets/social-cover.svg'), cover, 'utf8');
console.log('Created assets/social-cover.svg (1200x630), using the current mascot.');
