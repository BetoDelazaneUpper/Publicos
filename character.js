/* A small, hand-built SVG rig. No raster cut-outs, external assets or identity inference. */
(() => {
  'use strict';
  const R = document.documentElement;
  const arm = (side) => side === 'right' ? `
    <g class="arm arm-right">
      <path d="M204 209 Q220 213 228 228 L246 220 252 199" fill="none" stroke="#121212" stroke-width="22"/>
      <path d="M204 209 Q220 213 228 228 L246 220 252 199" fill="none" stroke="var(--skin)" stroke-width="15"/>
      <path d="M199 199 Q216 195 227 214 L212 230 196 221Z" fill="#f4f3ee"/>
      <g class="hand hand-open"><path d="M245 207L242 194 235 184Q233 179 237 178L246 184 244 166Q245 161 249 166L254 180 254 158Q257 154 260 159L261 179 265 162Q269 159 271 164L268 182 276 172Q281 171 281 176L270 194 265 207Z" fill="var(--skin)"/></g>
      <g class="hand hand-point"><path d="M244 205L244 187 244 164Q247 158 251 164L255 185 267 183Q274 185 273 193L264 209Z" fill="var(--skin)"/></g>
      <g class="hand hand-thumb"><path d="M243 204L238 190 244 185 248 169Q254 164 258 169L255 184 268 184Q274 186 271 193L265 207Z" fill="var(--skin)"/></g>
    </g>` : `
    <g class="arm arm-left"><path d="M116 209 Q103 220 97 238 L78 230" fill="none" stroke="#121212" stroke-width="22"/><path d="M116 209 Q103 220 97 238 L78 230" fill="none" stroke="var(--skin)" stroke-width="15"/><path d="M120 197Q105 194 94 214L108 228 124 218Z" fill="#f4f3ee"/><path d="M82 221L69 213Q64 213 65 219L68 224 57 221Q53 223 56 228L66 233 59 234Q54 238 61 241L75 242 86 236Z" fill="var(--skin)"/></g>`;
  function drawing(seated = false) {
    return `<svg class="mascot-svg ${seated ? 'seated' : ''}" viewBox="0 0 320 430" role="img" aria-label="Personagem ilustrado de Beto: cabelo curto, óculos e sorriso">
    <g stroke="#121212" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">
    <g class="rig">
      ${seated ? '<path d="M132 292L136 338 106 360 115 375 158 351 164 310M165 296L194 334 200 376 219 376 216 325 190 290" fill="#2a2c30"/><path d="M103 359L117 362 119 376 100 387 84 386Q80 381 91 375Z M198 372L221 372 228 380 247 386Q249 394 239 394L199 388Z" fill="#eee"/>' : '<path d="M123 289L120 372 140 375 159 315 177 375 200 371 190 288Z" fill="#27292c"/><path d="M131 305L130 356M184 305L189 357M160 303L156 311" fill="none" stroke="#646569" stroke-width="2"/><path d="M121 367L140 370 139 385 125 389 107 389 104 383Z M177 370L199 367 207 381 221 384 223 391 186 392 178 386Z" fill="var(--shoe)"/><path d="M105 384L138 382M185 384L218 384M115 378L127 376M193 377L203 379" fill="none" stroke="#f6f6f2" stroke-width="3"/>'}
      ${arm('left')}${arm('right')}
      <path d="M139 186L138 204 161 216 182 202 180 183Z" fill="var(--skin)"/>
      <path d="M134 197Q160 215 185 197L208 202 217 223 197 231 198 294Q162 302 119 294L123 231 104 222 111 203Z" fill="#f4f3ee"/>
      <path d="M140 200Q158 218 179 201M127 232L126 283M188 237L192 282" fill="none" stroke="#c0c0ba" stroke-width="2"/>
      <text x="143" y="251" fill="#171717" stroke="none" font-family="Arial,sans-serif" font-size="23" font-weight="800">bd.</text>
      <text x="134" y="268" fill="#5e5e59" stroke="none" font-family="Arial,sans-serif" font-size="6.5" letter-spacing="1.2">BUILD. THINK. REPEAT.</text>
      <g class="head">
        <path d="M112 108Q96 97 96 117 98 133 111 135M211 106Q224 98 225 115 222 133 211 136" fill="var(--skin)"/>
        <path d="M108 83Q105 50 157 45 204 43 213 78L211 137Q205 182 160 191 118 181 109 148Z" fill="var(--skin)"/>
        <path d="M110 120L104 105 102 80 107 65 106 57 119 52 116 43 136 40 129 33 151 35 164 26 175 32 189 29 194 37 211 37 207 47 218 58 211 89 206 103 199 78Q152 85 120 75L114 93Z" fill="#171719"/>
        <path d="M117 63Q144 42 163 45M131 66Q164 47 193 49M155 65L201 55M179 66L204 59" fill="none" stroke="#47474a" stroke-width="2.4"/>
        <path d="M121 102Q134 94 146 100M173 100Q187 92 200 101" fill="none" stroke-width="5.4"/>
        <g class="eyes"><path d="M123 120Q134 109 146 120Q135 127 123 120M174 118Q187 109 198 119Q187 127 174 118" fill="#fcfaf5" stroke-width="2"/><g class="pupils" fill="#202020"><ellipse cx="136" cy="119" rx="4" ry="5.3"/><ellipse cx="185" cy="119" rx="4" ry="5.3"/></g><g fill="#fff" stroke="none"><circle cx="137" cy="117" r="1.3"/><circle cx="186" cy="117" r="1.3"/></g></g>
        <path class="wink-line" d="M175 120Q185 126 198 117" fill="none"/>
        <g class="glasses" fill="none" stroke="#111" stroke-width="5.3"><path d="M116 108L151 107 150 130 119 131Z M169 108L205 106 203 129 171 130Z M152 114Q160 109 168 115M106 110L116 113M206 110L216 109"/></g>
        <path d="M156 122L151 137Q157 142 165 137" fill="none" stroke-width="2.3"/>
        <path d="M132 148Q157 158 186 146Q176 169 151 165 140 162 132 148Z" fill="#fff" stroke-width="2.5"/>
        <path d="M137 151Q158 160 182 150M137 145L146 144M170 143L180 144" fill="none" stroke-width="2"/>
        <path d="M117 142Q120 177 156 183 192 179 206 144" fill="none" stroke="#54514d" stroke-width="3" stroke-dasharray="1 5"/>
        <path d="M150 174L164 175M130 158L130 161M189 157L189 161" fill="none" stroke-width="2"/>
      </g>
    </g>
    ${seated ? '<g class="desk"><path d="M49 284H278V296H49Z" fill="#aaa"/><path d="M67 298V407M257 298V407" fill="none" stroke="#626262" stroke-width="7"/><path d="M123 248L227 248 214 283H141Z" fill="#b6b8bb"/><path d="M137 283H230" stroke="#eee"/><text x="165" y="271" font-size="12" stroke="none" fill="#333" font-family="monospace">&lt;/&gt;</text><path d="M69 263H91V284H69Z M92 268Q106 268 100 278H92" fill="#eee"/><path class="steam" d="M75 255Q82 249 76 243M84 255Q91 249 85 243" stroke="#969696" fill="none" stroke-width="2"/></g>' : ''}
    </g></svg>`;
  }
  document.querySelectorAll('[data-mascot]').forEach(el => { el.innerHTML = drawing(el.dataset.mascot === 'seated'); if(el.dataset.mascot==='guide')el.querySelector('svg').setAttribute('viewBox','70 20 210 260'); });
  const stage = document.getElementById('heroArt');
  const slot = document.getElementById('heroMascot');
  const bubble = document.getElementById('greetingText');
  let timer, visits = 0;
  const on = () => R.dataset.motion !== 'off' && !document.hidden;
  const poses = ['wave', 'approve', 'wink'];
  const words = ['Oi! Bom te ver aqui.', 'Bora tirar a ideia do papel?', 'Código sério. Um pouco de diversão.'];
  function act(pose = 'wave', message, duration = 2100) {
    if (!slot) return;
    clearTimeout(timer);
    if (bubble && message) bubble.textContent = message;
    slot.dataset.pose = on() ? pose : 'rest';
    timer = setTimeout(() => { slot.dataset.pose = 'rest'; }, duration);
  }
  function greet() { const n = visits++ % poses.length; act(poses[n], words[n]); }
  document.querySelectorAll('[data-wave]').forEach(b => b.addEventListener('click', greet));
  if (stage) {
    stage.addEventListener('pointermove', e => {
      if (!on() || e.pointerType === 'touch') return;
      const r = stage.getBoundingClientRect();
      slot.style.setProperty('--look-x', `${((e.clientX - r.left) / r.width - .5) * 4}px`);
      slot.style.setProperty('--look-y', `${((e.clientY - r.top) / r.height - .5) * 2}px`);
    }, {passive: true});
    stage.addEventListener('pointerleave', () => { slot.style.setProperty('--look-x', '0px'); slot.style.setProperty('--look-y', '0px'); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => {
      stage.classList.toggle('out-of-view', !e.isIntersecting);
    }).observe(stage);
  }
  document.addEventListener('studio:motion', () => {
    if (!on()) { clearTimeout(timer); if (slot) slot.dataset.pose = 'rest'; }
  });
  window.BetoCharacter = { act, drawing };
  // A brief entrance scene, never a looping interruption.
  if (on()) setTimeout(() => {
    if (!on() || !slot || slot.dataset.pose !== 'rest') return;
    act('glasses', 'Deixa eu ajeitar os óculos…', 900);
    setTimeout(() => { if (on()) act('wave', 'Oi! Eu sou o Beto. Vamos explorar?'); }, 1000);
  }, 650);
})();
