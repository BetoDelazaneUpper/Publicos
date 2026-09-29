/* Beto Delazane / motion edition. All content and controls work without animation CDNs. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = id => document.getElementById(id);
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  let motion = root.dataset.motion !== 'off' && !media.matches;
  let gsapContext = null, lenis = null, lenisTick = null, waveFrame = 0, waveStart = -10000;
  let heroVisible = true, headX = 0, headTarget = 0, greetingCount = 0, librariesStarted = false;
  let greetTimer = 0, toastTimer = 0;
  const nativeAnimations = new Set();
  const diagnostics = {version:'motion-1',waveCount:0,libraries:{gsap:false,scrollTrigger:false,lenis:false}};
  window.__BETO_MOTION__ = diagnostics;
  const storage = {get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
  const gsapReady = () => typeof window.gsap !== 'undefined';

  function animate(el, frames, options) {
    if (!motion || !el || typeof el.animate !== 'function') return null;
    const animation = el.animate(frames, options);
    nativeAnimations.add(animation);
    animation.finished.then(() => nativeAnimations.delete(animation),() => nativeAnimations.delete(animation));
    return animation;
  }
  function toast(text) {
    const el = $('toast'); clearTimeout(toastTimer); el.textContent = text; el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 3900);
  }
  function theme(value) {
    root.dataset.theme = value; storage.set('portfolio-theme', value);
    const dark = value === 'dark';
    $('themeLabel').textContent = dark ? 'Claro' : 'Escuro';
    $('themeToggle').setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#090909' : '#f8f9fb';
  }
  theme(root.dataset.theme);
  $('themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; theme(next);
    animate($('themeToggle'), [{transform:'rotate(-15deg)'},{transform:'rotate(0deg)'}], {duration:400,easing:'cubic-bezier(.2,.8,.2,1)'});
  });

  function renderMascot(now) {
    const seconds = now / 1000;
    const p = Math.max(0, Math.min(1,(now - waveStart) / 2400));
    const envelope = p < 1 ? Math.sin(Math.PI * p) : 0;
    const wave = motion ? (-20 + Math.sin(p * Math.PI * 8) * 24) * envelope : 0;
    headX += (headTarget - headX) * .06;
    const lift = motion ? Math.sin(seconds * 1.7) * 1.4 : 0;
    $('mascotRig').setAttribute('transform',`translate(0 ${lift.toFixed(3)})`);
    $('mascotRightArm').setAttribute('transform',`rotate(${wave.toFixed(3)} 145 160)`);
    $('mascotLeftArm').setAttribute('transform',`rotate(${motion ? (Math.sin(seconds*1.2)*1.6).toFixed(3) : 0} 60 172)`);
    $('mascotHead').setAttribute('transform',`rotate(${motion ? (headX*3 + Math.sin(seconds*.9)*.55).toFixed(3) : 0} 102 128)`);
  }
  function tickMascot(now) {
    waveFrame = 0;
    if (!motion || !heroVisible || document.hidden) return;
    renderMascot(now); waveFrame = requestAnimationFrame(tickMascot);
  }
  function syncMascot() {
    if (waveFrame) cancelAnimationFrame(waveFrame); waveFrame = 0;
    if (motion && heroVisible && !document.hidden) waveFrame = requestAnimationFrame(tickMascot);
    else renderMascot(0);
  }
  const greetings = ['Oi! Bom te ver aqui.','Tudo bem por aí?','Bora construir algo?','Código também tem alma.'];
  function wave(userAction = false) {
    if (document.hidden) return;
    waveStart = performance.now(); diagnostics.waveCount++;
    const text = greetings[greetingCount % greetings.length]; greetingCount++;
    $('greetingText').textContent = text;
    clearTimeout(greetTimer);
    if (userAction) toast(text + ' — Beto');
    animate($('greeting'), [{opacity:.7,transform:'translateY(9px) rotate(-1deg)'},{opacity:1,transform:'translateY(0) rotate(-4deg)'}], {duration:450,easing:'cubic-bezier(.16,1,.3,1)'});
    syncMascot();
  }
  $('waveButton').addEventListener('click', () => wave(true));
  $('characterButton').addEventListener('click', () => wave(true));
  if (finePointer) {
    $('characterButton').addEventListener('pointerenter', () => {if (motion && performance.now()-waveStart>3500) wave();});
    $('heroArt').addEventListener('pointermove', event => {
      const r = $('heroArt').getBoundingClientRect(); headTarget = Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));
    }, {passive:true});
    $('heroArt').addEventListener('pointerleave',() => {headTarget=0;});
  }
  function summon() {
    if (lenis) lenis.scrollTo('#top',{offset:-90,onComplete:()=>wave(true)});
    else { $('top').scrollIntoView({behavior:motion?'smooth':'instant'}); setTimeout(()=>wave(true),motion?600:0); }
  }
  $('footerWave').addEventListener('click',summon); $('mascotDock').addEventListener('click',summon);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting; $('mascotDock').hidden = heroVisible;
      syncMascot();
    }, {threshold:0}).observe($('heroArt'));
  }
  document.addEventListener('visibilitychange', () => {
    syncMascot();
    if (gsapContext && window.gsap) window.gsap.globalTimeline.paused(document.hidden);
  });
  setTimeout(()=>{if(motion && heroVisible) wave();},1100);
  // Timer is visible-only, not a perpetually running render loop.
  const helloTimer = setInterval(()=>{if(motion && heroVisible && !document.hidden && performance.now()-waveStart>10000) wave();},15000);

  function destroyEnhancements() {
    if (lenisTick && gsapReady()) window.gsap.ticker.remove(lenisTick);
    lenisTick=null; if(lenis) lenis.destroy(); lenis=null;
    if(gsapContext) gsapContext.revert(); gsapContext=null;
  }
  function enhance() {
    destroyEnhancements();
    if (!motion || !gsapReady()) return;
    const g = window.gsap, st = window.ScrollTrigger;
    if(st) g.registerPlugin(st);
    gsapContext=g.context(()=>{
      if(window.scrollY<150){
        g.fromTo('.name-line>span',{yPercent:105},{yPercent:0,duration:1.05,stagger:.13,ease:'power4.out',clearProps:'transform'});
        g.fromTo('.hero-intro,.hero-note,.hero-description,.hero-actions',{opacity:.15,y:17},{opacity:1,y:0,duration:.8,stagger:.08,delay:.15,clearProps:'all'});
      }
      if(st){
        document.querySelectorAll('.reveal').forEach(el=>{
          if(el.getBoundingClientRect().top<innerHeight) return;
          g.from(el,{y:30,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'all'});
        });
        g.fromTo('.statement-text',{xPercent:1.5},{xPercent:-1.5,ease:'none',scrollTrigger:{trigger:'.statement',start:'top bottom',end:'bottom top',scrub:1}});
        g.to('.orbit-two',{y:30,rotation:50,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
        g.fromTo('.footer-signature',{xPercent:2},{xPercent:0,ease:'none',scrollTrigger:{trigger:'.contact',start:'top 80%',end:'bottom bottom',scrub:1}});
      }
    });
    if(window.Lenis && finePointer){
      lenis=new window.Lenis({duration:1.08,smoothWheel:true,syncTouch:false,anchors:{offset:-96},autoRaf:false});
      if(st) lenis.on('scroll',st.update);
      lenisTick=time=>lenis.raf(time*1000); g.ticker.add(lenisTick); g.ticker.lagSmoothing(0);
    }
  }
  function loadScript(url) {
    return new Promise(resolve=>{
      const node=document.createElement('script'); node.src=url; node.async=true; node.crossOrigin='anonymous';
      const timer=setTimeout(()=>resolve(false),9000);
      node.onload=()=>{clearTimeout(timer);resolve(true);}; node.onerror=()=>{clearTimeout(timer);resolve(false);};
      document.head.appendChild(node);
    });
  }
  async function loadLibraries() {
    if(librariesStarted || !motion) return; librariesStarted=true;
    const g=await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    const results=await Promise.all([
      g?loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'):Promise.resolve(false),
      loadScript('https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js')
    ]);
    diagnostics.libraries={gsap:!!window.gsap,scrollTrigger:!!window.ScrollTrigger,lenis:!!window.Lenis};
    if(g || results.some(Boolean)) enhance();
  }
  function applyMotion(value, persist=true) {
    motion=value; root.dataset.motion=value?'on':'off';
    if(persist) storage.set('portfolio-motion',value?'on':'off');
    $('motionToggle').setAttribute('aria-pressed',String(value));
    $('motionToggle').setAttribute('aria-label',value?'Pausar animações':'Ativar animações');
    $('motionLabel').textContent=value?'Pausar':'Animar'; $('motionIcon').textContent=value?'Ⅱ':'▷';
    if(!value){
      destroyEnhancements(); nativeAnimations.forEach(a=>a.cancel()); nativeAnimations.clear();
      document.querySelectorAll('[data-magnetic]').forEach(el=>el.style.removeProperty('transform'));
      waveStart=-10000; headTarget=headX=0;
    }else{loadLibraries(); enhance();}
    syncMascot();
  }
  $('motionToggle').addEventListener('click',()=>applyMotion(!motion));
  media.addEventListener('change',event=>applyMotion(!event.matches && storage.get('portfolio-motion')!=='off',false));
  applyMotion(motion,false);

  // Native reveal fallback: no CSS that permanently hides content if CDN/JS fails.
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting) return; observer.unobserve(entry.target);
      if(!gsapReady()) animate(entry.target,[{opacity:.25,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
    }),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }
  if(finePointer){
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      el.addEventListener('pointermove',event=>{
        if(!motion) return;const r=el.getBoundingClientRect(), x=(event.clientX-r.left-r.width/2)*.12, y=(event.clientY-r.top-r.height/2)*.22;
        if(gsapReady()) window.gsap.to(el,{x,y,duration:.35,ease:'power3.out',overwrite:true});
        else el.style.transform=`translate(${x}px,${y}px)`;
      },{passive:true});
      el.addEventListener('pointerleave',()=>{if(gsapReady()) window.gsap.to(el,{x:0,y:0,duration:motion?.5:0,ease:'elastic.out(1,.55)',overwrite:true});else el.style.removeProperty('transform');});
    });
  }
  const menu=$('mobileNav');
  function closeMenu(){menu.hidden=true;$('menuToggle').setAttribute('aria-expanded','false');}
  $('menuToggle').addEventListener('click',()=>{menu.hidden=!menu.hidden;$('menuToggle').setAttribute('aria-expanded',String(!menu.hidden));});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();$('menuToggle').focus();}});
  let scrollQueued=false;
  function progress(){scrollQueued=false;const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;$('pageProgress').style.transform=`scaleX(${Math.max(0,Math.min(1,p))})`;}
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(progress);}}, {passive:true});
  addEventListener('resize',progress);progress();

  const projects={
    agenda:{number:'01',kind:'PLATAFORMA SAAS',title:'Projeto Agenda',description:'Plataforma white-label e multi-tenant para reservas configuráveis, organizada em módulos com API, worker e frontend.',tags:['.NET 10','React','PostgreSQL','Docker'],focus:'Multi-tenancy, domínio e testes.',nodes:['Web','API + Worker','PostgreSQL']},
    magicdev:{number:'02',kind:'FERRAMENTA DE DESENVOLVIMENTO',title:'MagicDev',description:'Controle remoto de projetos locais, Git e desenvolvimento assistido. Agentes, aprovações e execução se conectam em tempo real.',tags:['Node.js','Expo','WebSocket','Git'],focus:'Orquestração de agentes e operações remotas.',nodes:['Mobile','Cloud + Agent','Git']},
    pickside:{number:'03',kind:'PRODUTO DIGITAL',title:'PickSide',description:'Batalhas virais com votação orgânica e promoção paga. O backend valida o pagamento antes de ativar o conteúdo.',tags:['Next.js','Supabase','Mercado Pago'],focus:'Produto, pagamentos e validação server-side.',nodes:['Next.js','Webhooks','Supabase']},
    mapa:{number:'04',kind:'DADOS E RELATÓRIOS',title:'Mapa da Percepção',description:'Diagnóstico público com coleta de respostas, persistência, administração protegida e relatórios em PDF.',tags:['Next.js','TypeScript','Supabase','PDF'],focus:'Coleta de dados, relatórios e controle de acesso.',nodes:['Questionário','API + Admin','PDF / Dados']},
    beto:{number:'05',kind:'PLATAFORMA GAMIFICADA',title:'Beto',description:'Apostas fictícias com créditos virtuais, ranking e administração. Sem dinheiro real, com domínio, aplicação e infraestrutura separados.',tags:['ASP.NET Core','React','SQL Server','JWT'],focus:'Regras de domínio, autenticação e gamificação.',nodes:['React','ASP.NET','SQL Server']}
  };
  const tabs=[...document.querySelectorAll('[data-project]')]; let selected='agenda', detailAnimation=null;
  function selectProject(key, focus=false){
    if(!projects[key])return;const data=projects[key];const changed=selected!==key;selected=key;
    tabs.forEach(tab=>{const active=tab.dataset.project===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
    $('projectPanel').setAttribute('aria-labelledby','tab-'+key);
    $('detailIndex').textContent=data.number+' / 05';$('detailKind').textContent=data.kind;$('detailTitle').textContent=data.title;$('detailDescription').textContent=data.description;$('detailFocus').textContent=data.focus;
    $('detailTags').replaceChildren(...data.tags.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
    ['mapClient','mapCore','mapData'].forEach((id,i)=>$(id).textContent=data.nodes[i]);
    if(changed){if(detailAnimation)detailAnimation.cancel();detailAnimation=animate(document.querySelector('.detail-copy'),[{opacity:.2,transform:'translateY(13px)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)'});}
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectProject(tab.dataset.project));
    tab.addEventListener('keydown',event=>{let next=null;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==null){event.preventDefault();selectProject(tabs[next].dataset.project,true);}});
  });
  const steps=[['01 — O navegador solicita.','O backend recebe o pedido para preparar o passe.'],['02 — O servidor assina.','A Service Account assina o JWT no backend.'],['03 — O Wallet valida.','O link leva à confirmação de salvamento no Google Wallet.']];
  let step=0,passAnimation=null;
  $('flowButton').addEventListener('click',()=>{
    step=(step+1)%steps.length;$('labStepTitle').textContent=steps[step][0];$('labStepText').textContent=steps[step][1];document.querySelector('.pass-bottom>span:last-child').textContent=`0${step+1} / 03`;
    if(passAnimation)passAnimation.cancel();passAnimation=animate($('walletPass'),[{transform:'rotate(-7deg) translateY(0)'},{transform:'rotate(4deg) translateY(-13px)',offset:.45},{transform:'rotate(-7deg) translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
  });
  // The year is presentation-only; no third-party analytics or trackers are installed.
  $('year').textContent=String(new Date().getFullYear());
  addEventListener('pagehide',()=>{clearInterval(helloTimer);clearTimeout(toastTimer);clearTimeout(greetTimer);if(waveFrame)cancelAnimationFrame(waveFrame);destroyEnhancements();});
})();
