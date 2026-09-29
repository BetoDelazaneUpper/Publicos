/* Beto Delazane — coordinated motion. The site remains usable without the CDN. */
(() => {
  'use strict';
  const R = document.documentElement;
  const $ = (s, h = document) => h.querySelector(s);
  const projects = window.StudioDemos?.projects || {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const moving = () => R.dataset.motion !== 'off' && !reduced.matches && !document.hidden;
  const save = (k,v) => { try {localStorage.setItem(k,v);} catch {} };
  let lenis = null, scrollContext = null, themeBusy = false, themeTransition = null;
  const runningAnimations = new Set();
  function animate(el, frames, options) {
    if (!el || !moving() || !el.animate) return Promise.resolve();
    const a = el.animate(frames, options); runningAnimations.add(a);
    return a.finished.catch(() => {}).finally(() => runningAnimations.delete(a));
  }
  function notifyMotion() {document.dispatchEvent(new Event('studio:motion'));}
  function motionUI() {
    const enabled = R.dataset.motion !== 'off';
    $('#motionToggle').disabled = reduced.matches;
    $('#motionToggle').title = reduced.matches ? 'Movimento reduzido nas preferências do sistema.' : '';
    $('#motionLabel').textContent = enabled ? 'Pausar' : 'Animar';
    $('#motionIcon').textContent = enabled ? 'Ⅱ' : '▷';
    $('#motionToggle').setAttribute('aria-label', enabled ? 'Pausar animações' : 'Ativar animações');
    $('#motionToggle').setAttribute('aria-pressed', String(enabled));
  }
  function syncEnhancements() {
    scrollContext?.revert(); scrollContext = null;
    lenis?.destroy(); lenis = null;
    if (!moving() || $('#experience').open) return;
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      scrollContext = gsap.context(() => {
        gsap.to('.manifesto-mark', {rotation:90, ease:'none', scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:0.5}});
        if (fine.matches && innerWidth > 820) {
          gsap.to('.hero-copy', {y:-22,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:0.7}});
          gsap.to('.pass-outline', {rotation:15,ease:'none',scrollTrigger:{trigger:'.wallet-sculpture',start:'top bottom',end:'bottom top',scrub:0.5}});
        }
      });
    }
    if (window.Lenis && fine.matches) {
      lenis = new Lenis({autoRaf:true,lerp:.12,smoothWheel:true,syncTouch:false,anchors:{offset:-100},prevent:n=>n.hasAttribute?.('data-lenis-prevent')});
      if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    }
  }
  function setMotion(on) {
    R.dataset.motion = on && !reduced.matches ? 'on' : 'off';
    save('portfolio-motion',R.dataset.motion);
    if (!moving()) {
      runningAnimations.forEach(a=>a.cancel());
      themeTransition?.skipTransition();
      document.querySelectorAll('[data-magnetic]').forEach(el=>el.style.transform='');
      document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
    }
    motionUI(); notifyMotion(); syncEnhancements();
  }
  $('#motionToggle').addEventListener('click',()=>{setMotion(R.dataset.motion === 'off');if(moving() && R.dataset.libraries === 'native' && !window.gsap)enhance();});
  reduced.addEventListener('change',()=>setMotion(!reduced.matches));
  fine.addEventListener('change',syncEnhancements);
  motionUI();
  function themeUI() {
    const light = R.dataset.theme === 'light';
    $('#themeLabel').textContent = light ? 'Escuro' : 'Claro';
    $('#themeToggle').setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');
    $('meta[name="theme-color"]').content = light?'#fafaf8':'#0b0b0b';
  }
  themeUI();
  $('#themeToggle').addEventListener('click',async e=>{
    if (themeBusy) return;
    const next = R.dataset.theme === 'light' ? 'dark' : 'light';
    const update = () => {R.dataset.theme=next;save('portfolio-theme',next);themeUI();};
    document.getElementById('artSwitch')?.setAttribute('aria-label',next==='light'?'Luz acesa':'Luz apagada');
    window.BetoCharacter?.act('switch',next==='light'?'Acendendo as ideias.':'De volta ao modo noturno.',1000);
    if (!document.startViewTransition || !moving()) {update();return;}
    themeBusy = true;
    const rect=e.currentTarget.getBoundingClientRect();
    const x=e.clientX || rect.left+rect.width/2, y=e.clientY || rect.top+rect.height/2;
    const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    try {
      themeTransition=document.startViewTransition(update);
      await themeTransition.ready;
      await animate(R,[{clipPath:`circle(0px at ${x}px ${y}px)`},{clipPath:`circle(${radius}px at ${x}px ${y}px)`}],{duration:650,easing:'cubic-bezier(.22,.7,.2,1)',pseudoElement:'::view-transition-new(root)',fill:'forwards'});
      await themeTransition.finished;
    } catch {update();} finally {themeBusy=false;themeTransition=null;}
  });
  let scrollFrame=0;
  function progress(){scrollFrame=0;const max=R.scrollHeight-innerHeight;$('#pageProgress').style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;}
  addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(progress);},{passive:true});
  addEventListener('resize',progress);progress();
  if ('ResizeObserver' in window) new ResizeObserver(progress).observe(document.body);
  function menu(open){$('#mobileNav').hidden=!open;$('#menuToggle').setAttribute('aria-expanded',String(open));}
  $('#menuToggle').addEventListener('click',()=>menu($('#mobileNav').hidden));
  $('#mobileNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobileNav').hidden){menu(false);$('#menuToggle').focus();}});
  addEventListener('resize',()=>{if(innerWidth>820)menu(false);});
  // All content is visible before JavaScript enhancement and in reduced motion.
  if (moving() && 'IntersectionObserver' in window) {
    R.classList.add('js-reveal');
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
    ['.hero-intro','.name-line>span','.hero-note','.hero-desc','.hero-actions'].forEach((sel,i)=>document.querySelectorAll(sel).forEach(el=>animate(el,[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:i*75,easing:'cubic-bezier(.16,.8,.2,1)',fill:'backwards'})));
  }
  // Pause ongoing decorative loops when their section is not being viewed.
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('out-of-view',!e.isIntersecting)));
    document.querySelectorAll('.ticker,.desk-scene,.wallet-sculpture,.mini-guide,.preview-system').forEach(x=>observer.observe(x));
  }
  document.querySelectorAll('[data-magnetic]').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(!moving()||!fine.matches)return;const b=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.07}px,${(e.clientY-b.top-b.height/2)*.09}px)`;});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  document.addEventListener('visibilitychange',()=>{
    R.classList.toggle('hidden-page',document.hidden);
    if(document.hidden)runningAnimations.forEach(a=>a.cancel());
    notifyMotion();syncEnhancements();
  });
  // Project tabs and shared-title travel.
  let selected='agenda', view='experience', dispose=null, opener=null, closing=false, guideTimer;
  const dialog=$('#experience'), host=$('#demoHost');
  const projectTabs=[...document.querySelectorAll('[data-project]')];
  function selectProject(key) {
    const p=projects[key];if(!p)return;selected=key;
    projectTabs.forEach(t=>{const yes=t.dataset.project===key;t.setAttribute('aria-selected',String(yes));t.tabIndex=yes?0:-1;t.classList.toggle('active',yes);});
    $('#projectPanel').setAttribute('aria-labelledby',`tab-${key}`);
    $('#detailIndex').textContent=p.n+' / 06';$('#detailKind').textContent=p.kind;$('#detailTitle').textContent=p.name;$('#detailDescription').textContent=p.desc;
    const tags=$('#detailTags');tags.replaceChildren();p.stack.forEach(x=>{const s=document.createElement('span');s.textContent=x;tags.append(s);});
    const nodes=$('#previewSystem');nodes.replaceChildren();p.nodes.forEach((x,i)=>{const s=document.createElement('span');s.textContent=x;nodes.append(s);if(i<3){const a=document.createElement('i');a.setAttribute('aria-hidden','true');a.textContent='→';nodes.append(a);}});
    $('#guideText').textContent=p.intro;
    clearTimeout(guideTimer);$('#guideMascot').dataset.pose=moving()?'point':'rest';
    guideTimer=setTimeout(()=>$('#guideMascot').dataset.pose='rest',1600);
    window.BetoCharacter?.act('point','Vamos olhar o sistema por trás da ideia.',1600);
    animate($('.panel-copy'),[{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
  }
  function keyboardTabs(tabs,axis,onSelect){tabs.forEach((t,index)=>t.addEventListener('keydown',e=>{const prev=axis==='vertical'?'ArrowUp':'ArrowLeft',next=axis==='vertical'?'ArrowDown':'ArrowRight';let n;if(e.key===prev)n=(index+tabs.length-1)%tabs.length;else if(e.key===next)n=(index+1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();tabs[n].focus();onSelect(tabs[n]);}));}
  projectTabs.forEach(t=>t.addEventListener('click',()=>selectProject(t.dataset.project)));
  keyboardTabs(projectTabs,'vertical',t=>selectProject(t.dataset.project));
  function titleFlight(from,to,reverse=false,snapshot=null) {
    if(!moving()||innerWidth<700||!from||!to)return Promise.resolve();
    const a=snapshot?.rect||from.getBoundingClientRect(),b=to.getBoundingClientRect();
    if(a.top<0||a.top>innerHeight||b.top<0||b.top>innerHeight)return Promise.resolve();
    const clone=document.createElement('span');clone.className='flying-title';clone.textContent=snapshot?.text||from.textContent;clone.setAttribute('aria-hidden','true');
    const style=snapshot?.style||getComputedStyle(from);Object.assign(clone.style,{left:a.left+'px',top:a.top+'px',fontSize:style.fontSize});
    (dialog.open?dialog:document.body).append(clone);
    to.style.visibility='hidden';
    const ratio=parseFloat(getComputedStyle(to).fontSize)/parseFloat(style.fontSize);
    return animate(clone,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(${ratio})`,opacity:1}],{duration:reverse?260:430,easing:'cubic-bezier(.22,.7,.2,1)'}).finally(()=>{clone.remove();to.style.visibility='';});
  }
  function decisions(p) {
    host.replaceChildren();const wrapper=document.createElement('div');wrapper.className='decisions';
    [['01 / O PROBLEMA',p.problem],['02 / DECISÃO DEMONSTRADA',p.decision],['03 / LIMITE E COMPROMISSO',p.tradeoff]].forEach(([label,text],i)=>{const block=document.createElement('article');block.className='decision';const l=document.createElement('span');l.className='micro';l.textContent=label;const t=document.createElement(i===0?'h3':'p');t.textContent=text;block.append(l,t);wrapper.append(block);});
    host.append(wrapper);const n=document.createElement('p');n.className='decision-note';n.textContent='Cenário criado para explicar conceitos. Não é um laudo, benchmark ou garantia sobre a implementação privada.';host.append(n);
  }
  function mountView(next){
    dispose?.();dispose=null;view=next;
    document.querySelectorAll('[data-view]').forEach(t=>{const yes=t.dataset.view===view;t.setAttribute('aria-selected',String(yes));t.tabIndex=yes?0:-1;});
    host.setAttribute('aria-labelledby',`view-${view}`);
    if(view==='decisions')decisions(projects[selected]);
    else if(view==='engineer')dispose=StudioDemos.engineer(host,selected);
    else dispose=StudioDemos.mount(host,selected);
    animate(host,[{opacity:.5,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220});
  }
  function open(key=selected,next='experience',trigger=document.activeElement){
    if(!projects[key]||dialog.open)return;menu(false);if(key!==selected)selectProject(key);selected=key;opener=trigger;
    R.classList.add('demo-open');
    $('#experienceTitle').textContent=projects[key].name;$('#experienceLabel').textContent=projects[key].n+' / '+projects[key].kind;
    mountView(next);document.body.classList.add('modal-open');lenis?.stop();dialog.showModal();dialog.scrollTop=0;
    // Discrete title transfer, not a global motion effect.
    if(key===$('.project-row.active')?.dataset.project)titleFlight($('#detailTitle'),$('#experienceTitle'));
    $('#closeExperience').focus({preventScroll:true});
  }
  async function close(){
    if(!dialog.open||closing)return;closing=true;
    dispose?.();dispose=null;
    const from=$('#experienceTitle');const snapshot={rect:from.getBoundingClientRect(),text:from.textContent,style:{fontSize:getComputedStyle(from).fontSize}};
    if(moving())await animate(dialog,[{opacity:1},{opacity:.75}],{duration:120});
    dialog.close();R.classList.remove('demo-open');document.body.classList.remove('modal-open');host.replaceChildren();
    if(moving())lenis?.start();opener?.focus({preventScroll:true});closing=false;syncEnhancements();
    if(moving()&&innerWidth>700)titleFlight(from,$('#detailTitle'),true,snapshot);
  }
  $('#openExperience').onclick=()=>open();$('#openArchitecture').onclick=()=>open(selected,'engineer');
  $('#engineerShortcut').onclick=()=>open(selected,'engineer');$('#heroEngineer').onclick=()=>open(selected,'engineer');$('#practiceEngineer').onclick=()=>open('agenda','engineer');$('#walletDemo').onclick=()=>open('wallet');
  $('#closeExperience').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)close();}});
  document.querySelectorAll('[data-view]').forEach(t=>t.onclick=()=>mountView(t.dataset.view));
  keyboardTabs([...document.querySelectorAll('[data-view]')],'horizontal',t=>mountView(t.dataset.view));
  $('#resetDemo').onclick=()=>mountView(view);
  // Contact channels: only a confirmed public GitHub profile and this portfolio.
  $('#sharePortfolio').addEventListener('click',async()=>{
    const url='https://betodelazaneupper.github.io/Publicos/';
    try{if(navigator.share){await navigator.share({title:'Beto Delazane · Senior Software Engineer',url});$('#shareStatus').textContent='Compartilhamento concluído.';}
      else{await navigator.clipboard.writeText(url);$('#shareStatus').textContent='Endereço do portfólio copiado.';}}
    catch(e){$('#shareStatus').textContent=e.name==='AbortError'?'Compartilhamento cancelado.':`Copie este endereço: ${url}`;}
  });
  let clicks=0,bugTimer;
  $('#debugMark').addEventListener('click',()=>{
    clicks++;const status=$('#bugStatus');
    if(clicks<5){status.textContent=clicks===1?'CURIOSIDADE DETECTADA.':'MAIS '+(5-clicks)+' TOQUES…';return;}
    clicks=0;clearTimeout(bugTimer);const scene=$('.desk-scene');scene.classList.remove('caught');
    if(moving()){void scene.offsetWidth;scene.classList.add('caught');$('#deskMascot').dataset.pose='point';}
    status.textContent='BUG CAPTURADO. CURIOSIDADE: 1 / BUGS: 0.';
    bugTimer=setTimeout(()=>{scene.classList.remove('caught');$('#deskMascot').dataset.pose='rest';},1900);
  });
  // Libraries augment the native implementation; a blocked CDN never hides content.
  const load=(url)=>new Promise(resolve=>{const s=document.createElement('script');let finished=false;const done=()=>{if(finished)return;finished=true;clearTimeout(timer);resolve();};s.src=url;s.async=true;s.onload=done;s.onerror=done;const timer=setTimeout(done,6000);document.head.append(s);});
  async function enhance(){
    if(reduced.matches || R.dataset.motion === 'off'){R.dataset.libraries='native';return;}
    await load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    await Promise.all([window.gsap?load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'):Promise.resolve(),load('https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js')]);
    R.dataset.libraries=window.gsap&&window.ScrollTrigger&&window.Lenis?'ready':'native';syncEnhancements();
  }
  if('requestIdleCallback'in window)requestIdleCallback(enhance,{timeout:1800});else setTimeout(enhance,500);
  window.Studio={open,selectProject,setMotion,get selected(){return selected;},get view(){return view;}};
})();
