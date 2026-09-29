/* All experiments are isolated, in-memory illustrations. They never call a product API. */
(() => {
  'use strict';
  const projects = {
    agenda: { n:'01', name:'Projeto Agenda', kind:'SaaS / Multi-tenant', desc:'Reservas configuráveis. Um mesmo produto, contextos diferentes.', stack:['.NET','React','PostgreSQL'], nodes:['Interface','API','Worker','Banco'], problem:'Duas pessoas podem tentar reservar o mesmo horário.', decision:'Neste exemplo, a combinação de unidade e horário é única. A interface trata o conflito, mas a decisão final pertence ao banco.', tradeoff:'A validação em memória ilustra a regra, não garante concorrência real. Em produção, a restrição precisa existir dentro da transação no banco.', intro:'Escolha um horário, reserve e tente reservá-lo de novo.' },
    magicdev: { n:'02', name:'MagicDev', kind:'Agentes / Tempo real', desc:'Uma central para tarefas, aprovações e execução assistida.', stack:['Node.js','Expo','WebSocket'], nodes:['Mobile','Cloud','Agente','Git'], problem:'Uma execução remota não deve confundir intenção com autorização.', decision:'A fila desta demo exige aprovação explícita antes de executar. Cancelar interrompe o trabalho simulado e libera o próximo item.', tradeoff:'A fila é local e não sobrevive a um refresh. Um sistema real precisa persistir estado, autenticar comandos e tratar reconexões.', intro:'Enfileire uma tarefa, aprove sua execução e acompanhe cada etapa.' },
    pickside: { n:'03', name:'PickSide', kind:'Produto / Pagamentos', desc:'Disputas de ideias, votos orgânicos e promoção separada da votação.', stack:['Next.js','Supabase','Pagamentos'], nodes:['Checkout','API','Webhook','Banco'], problem:'Uma página de retorno do checkout não prova que um pagamento foi aprovado.', decision:'Na demo, voltar do checkout mantém a promoção pendente. Só o evento de confirmação simulado altera o estado.', tradeoff:'Nenhuma cobrança é feita. Em um backend real, a assinatura do webhook, o valor e o estado devem ser verificados com o provedor.', intro:'Vote uma vez, troque de lado e explore a confirmação de uma promoção.' },
    mapa: { n:'04', name:'Mapa da Percepção', kind:'Dados / Relatórios', desc:'Transformar respostas em uma visualização que convida à leitura.', stack:['TypeScript','Next.js','Supabase'], nodes:['Formulário','API','Dados','Relatório'], problem:'Respostas precisam se transformar em informação legível, sem perder o contexto.', decision:'Três respostas desta demonstração viram uma figura vetorial. Os valores são exibidos junto do gráfico, não apenas como cor ou forma.', tradeoff:'Não é um diagnóstico, uma métrica profissional ou o questionário do produto. É um exercício ilustrativo, sem armazenamento ou envio das respostas.', intro:'Responda três perguntas e veja seu pequeno mapa se formar.' },
    beto: { n:'05', name:'Beto', kind:'Plataforma / Gamificação', desc:'Créditos virtuais, regras de domínio e eventos rastreáveis.', stack:['ASP.NET Core','React','SQL Server'], nodes:['Interface','Domínio','Eventos','Saldo'], problem:'Um evento entregue duas vezes não deveria conceder pontos duas vezes.', decision:'Este livro-razão virtual aplica cada missão uma única vez. Repetir o evento retorna o resultado existente.', tradeoff:'O ledger vive na memória da página. Persistência, transações e restrições de unicidade são necessárias para reproduzir essa garantia no servidor.', intro:'Conclua uma missão de arquitetura e teste a repetição do evento.' },
    wallet: { n:'06', name:'Google Wallet Lab', kind:'Laboratório / Público', desc:'Um passe por fora. Um objeto estruturado por dentro.', stack:['Generic Pass','JSON','Node.js'], nodes:['Browser','Backend','Assinatura','Wallet'], problem:'Como mostrar o passe sem colocar uma chave privada no navegador?', decision:'Aqui você personaliza só a prévia e o JSON. No exemplo Node.js, a assinatura RS256 fica no servidor e gera a Save URL.', tradeoff:'A demo não assina JWTs, não emite passes e não consulta o Google. Issuer autorizado e backend seguro são necessários para o fluxo real.', intro:'Personalize o passe; compare a aparência com o JSON correspondente.' }
  };
  const $ = (s,h=document) => h.querySelector(s);
  function mount(host, key) {
    const p = projects[key];
    const abort = new AbortController();
    let alive = true;
    const pending = new Map();
    const listen = (s,event,fn) => $(s,host)?.addEventListener(event, fn, {signal:abort.signal});
    function wait(ms) { return new Promise(resolve => { const id=setTimeout(()=>{pending.delete(id);resolve(alive);},ms); pending.set(id,resolve); }); }
    const message = text => { const el=$('[data-result]',host); if(el) el.textContent=text; };
    const head = title => `<div class="demo-top"><span class="micro">EXPERIMENTO INTERATIVO</span><h3>${title}</h3><p>${p.intro}</p></div>`;
    const result = '<p class="result" data-result role="status">Pronto para experimentar.</p>';
    if (key === 'agenda') {
      host.innerHTML=head('Uma reserva. Nenhum conflito escondido.')+`<div class="booking-layout"><div><label class="field">Unidade demonstrativa<select id="unit"><option value="a">Estúdio A</option><option value="b">Estúdio B</option></select></label><div class="slot-grid" role="group" aria-label="Horário de demonstração">${['09:00','10:00','14:00','16:00'].map((x,i)=>`<button type="button" class="slot ${!i?'selected':''}" data-slot="${x}" aria-pressed="${!i}">${x}<small>Selecionar</small></button>`).join('')}</div><div class="demo-actions"><button class="button primary" id="reserve">Reservar horário ↗</button><button class="button" id="conflict" disabled>Testar conflito</button></div></div><aside class="demo-note"><span class="micro">LIVRO DE RESERVAS</span><strong id="bookCount" class="big-number">0</strong><p>reservas fictícias nesta sessão</p><ul id="bookings" class="ledger"></ul></aside></div>`+result;
      let slot='09:00', last=null;
      const bookings=new Set();
      host.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{slot=b.dataset.slot;host.querySelectorAll('[data-slot]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});},{signal:abort.signal}));
      function reserve(id) {
        if(bookings.has(id)) { message('409 · Conflito tratado. Este horário já foi reservado. Nenhuma reserva duplicada.'); return; }
        bookings.add(id); last=id; $('#conflict',host).disabled=false;
        $('#bookCount',host).textContent=String(bookings.size);
        const li=document.createElement('li');li.textContent=`Estúdio ${id[0].toUpperCase()} · ${id.slice(2)}`;$('#bookings',host).append(li);
        message('201 · Reserva fictícia confirmada. Agora teste reservar o mesmo horário.');
      }
      listen('#reserve','click',()=>reserve(`${$('#unit',host).value}|${slot}`));
      listen('#conflict','click',()=>last && reserve(last));
    }
    if(key === 'magicdev') {
      host.innerHTML=head('A intenção entra. A aprovação vem antes.')+`<div class="queue-tools"><label class="field">Tarefa demonstrativa<select id="task"><option>Revisar documentação</option><option>Verificar interface</option><option>Organizar testes</option></select></label><button class="button primary" id="enqueue">＋ Enfileirar</button></div><div id="queue" class="queue-list"><p class="empty">A fila está vazia. Nenhum comando será executado.</p></div>`+result;
      const tasks=[];let count=0;
      function render() {
        const q=$('#queue',host);q.innerHTML='';
        tasks.forEach(t=>{
          const row=document.createElement('article');row.className='queue-item';
          const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`0${t.id} / ${t.name}`;
          const status=document.createElement('small');status.textContent=t.state;
          info.append(title,status);row.append(info);
          if(t.state==='Aguardando aprovação') { const btn=document.createElement('button');btn.className='button small';btn.textContent='Aprovar';btn.onclick=()=>{t.state='Aprovada · na fila';render();process();};row.append(btn); }
          if(!['Concluída (simulação)','Cancelada'].includes(t.state)) {const cancel=document.createElement('button');cancel.className='quiet';cancel.textContent='Cancelar';cancel.onclick=()=>{t.cancelled=true;t.state='Cancelada';render();message('Tarefa cancelada. Nenhum comando real foi executado.');};row.append(cancel);}
          q.append(row);
        });
      }
      let running=false;
      async function process() {
        if(running)return;running=true;
        while(alive) {
          const t=tasks.find(x=>x.state==='Aprovada · na fila');if(!t)break;
          for(const label of ['Preparando ambiente fictício','Executando etapas simuladas','Organizando resultado']) {if(t.cancelled||!alive)break;t.state=label;render();if(!await wait(450))return;}
          if(!t.cancelled&&alive){t.state='Concluída (simulação)';render();message('Fluxo concluído. Somente estados visuais: nenhum shell, agente ou teste real foi acionado.');}
        }
        running=false;
      }
      listen('#enqueue','click',()=>{if(tasks.length>=6){message('Limite demonstrativo de seis tarefas. Reinicie a demo para continuar.');return;}tasks.push({id:++count,name:$('#task',host).value,state:'Aguardando aprovação',cancelled:false});render();message('Tarefa enfileirada. A execução só começa depois da aprovação.');});
    }
    if(key === 'pickside') {
      host.innerHTML=head('Voto é uma coisa. Pagamento é outra.')+`<div class="vote-grid"><button class="vote-card" data-side="a"><span>01 / IDEIA</span><strong>Monólito<br>modular</strong><b id="votesA">24</b><small>votos fictícios</small></button><button class="vote-card" data-side="b"><span>02 / IDEIA</span><strong>Micros-<br>serviços</strong><b id="votesB">18</b><small>votos fictícios</small></button></div><div class="demo-actions"><button class="button" id="promote">Simular promoção</button><button class="button" id="return" disabled>Voltar do checkout</button><button class="button primary" id="webhook" disabled>Simular confirmação</button></div><p class="micro" id="promotion">PROMOÇÃO INATIVA · NÃO HÁ COBRANÇA</p>`+result;
      let vote=null, promoted=false, pendingPayment=false;
      host.querySelectorAll('[data-side]').forEach(b=>b.setAttribute('aria-pressed','false'));
      host.querySelectorAll('[data-side]').forEach(b=>b.addEventListener('click',()=>{
        const same=vote===b.dataset.side;vote=b.dataset.side;
        $('#votesA',host).textContent=String(24+(vote==='a'?1:0));$('#votesB',host).textContent=String(18+(vote==='b'?1:0));
        host.querySelectorAll('[data-side]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
        message(same?'Voto já computado. Clicar de novo não cria outro voto.':'Escolha registrada apenas nesta demo. Você pode trocar de lado sem duplicar o voto.');
      },{signal:abort.signal}));
      listen('#promote','click',()=>{if(promoted)return;pendingPayment=true;$('#return',host).disabled=false;$('#webhook',host).disabled=false;$('#promotion',host).textContent='AGUARDANDO CONFIRMAÇÃO SIMULADA';message('Checkout fictício iniciado. Não há cobrança ou comunicação com um gateway.');});
      listen('#return','click',()=>message('Retorno do checkout recebido. A promoção continua pendente: a página de retorno não comprova pagamento.'));
      listen('#webhook','click',()=>{if(!pendingPayment)return;promoted=true;$('#promotion',host).textContent='PROMOÇÃO ATIVA · RESULTADO SIMULADO';$('#return',host).disabled=true;$('#promote',host).disabled=true;message('Evento de confirmação simulado recebido. O voto não foi alterado; repetir o evento não duplica a promoção.');});
    }
    if(key === 'mapa') {
      host.innerHTML=head('Três respostas. Uma leitura visual.')+`<div class="mapa-layout"><form id="mapForm"><div class="range-fields">${['Clareza das prioridades','Previsibilidade das entregas','Visibilidade do sistema'].map((x,i)=>`<label class="field">${x}<div class="range-line"><input type="range" min="1" max="5" value="3" id="score${i}" aria-label="${x}"><output for="score${i}">3 / 5</output></div></label>`).join('')}</div><button class="button primary">Desenhar meu mapa ↗</button></form><figure class="radar"><svg viewBox="0 0 320 290" role="img" aria-label="Mapa ilustrativo das três respostas"><g fill="none" stroke="currentColor" opacity=".22"><path d="M160 35L275 225H45Z M160 71L250 210H70Z M160 110L224 196H96Z M160 35V161L275 225M160 161L45 225"/></g><polygon id="radarShape" points="160,161 160,161 160,161"/><g class="radar-labels" fill="currentColor"><text x="160" y="19" text-anchor="middle">CLAREZA</text><text x="312" y="250" text-anchor="end">ENTREGAS</text><text x="8" y="250">VISIBILIDADE</text></g></svg><figcaption id="radarCaption">Uma figura aparece depois das suas respostas.</figcaption></figure></div>`+result;
      for(let i=0;i<3;i++)listen(`#score${i}`,'input',e=>{e.target.nextElementSibling.textContent=`${e.target.value} / 5`;});
      listen('#mapForm','submit',e=>{e.preventDefault();const values=[0,1,2].map(i=>Number($(`#score${i}`,host).value));const ends=[[160,35],[275,225],[45,225]];$('#radarShape',host).setAttribute('points',ends.map(([x,y],i)=>`${160+(x-160)*values[i]/5},${161+(y-161)*values[i]/5}`).join(' '));$('#radarCaption',host).textContent=`Clareza ${values[0]}/5 · Entregas ${values[1]}/5 · Visibilidade ${values[2]}/5`;message('Mapa desenhado. Este exercício não é o questionário do produto nem uma avaliação profissional. As respostas não foram enviadas.');});
    }
    if(key === 'beto') {
      host.innerHTML=head('Um evento. Uma recompensa.')+`<div class="booking-layout"><div><label class="field">Missão fictícia<select id="mission"><option value="domain">Separar a regra de domínio</option><option value="test">Escrever um teste de conflito</option><option value="trace">Rastrear uma operação</option></select></label><p class="muted">Cada missão concede 10 pontos virtuais, uma única vez. Não há aposta, dinheiro ou prêmio.</p><div class="demo-actions"><button class="button primary" id="complete">Concluir missão</button><button class="button" id="duplicate" disabled>Reenviar evento</button></div></div><aside class="demo-note"><span class="micro">SALDO DEMONSTRATIVO</span><strong class="big-number" id="score">0</strong><p>pontos virtuais</p><ul id="events" class="ledger"></ul></aside></div>`+result;
      const applied=new Set();let last;
      function apply(id){if(applied.has(id)){message('Evento já aplicado. Resultado reutilizado: 0 pontos adicionais.');return;}applied.add(id);last=id;$('#duplicate',host).disabled=false;$('#score',host).textContent=String(applied.size*10);const li=document.createElement('li');li.textContent=`mission:${id} → +10`;$('#events',host).append(li);message('Missão fictícia concluída. Tente reenviar o evento para testar idempotência.');}
      listen('#complete','click',()=>apply($('#mission',host).value));listen('#duplicate','click',()=>last&&apply(last));
    }
    if(key === 'wallet') {
      host.innerHTML=head('O design e o objeto, lado a lado.')+`<div class="wallet-editor"><div><label class="field">Título do passe<input id="passTitle" maxlength="32" value="Engineering Lab" autocomplete="off"></label><label class="field">Nome demonstrativo<input id="passName" maxlength="40" value="Visitante" autocomplete="off"></label><label class="field">Acabamento<select id="passColor"><option value="#171717">Grafite</option><option value="#e9edf3">Prata</option><option value="#175cd3">Azul</option></select></label><div class="demo-actions"><button class="button" id="jsonToggle" aria-pressed="false">Ver JSON</button><button class="button" id="copyJson">Copiar JSON</button></div><p class="micro">SEM JWT · SEM EMISSÃO · SEM CHAVES</p></div><div id="passPreview" class="pass-preview"><div class="pass-card"><span class="pass-brand">bd. / WALLET LAB</span><h4 id="previewTitle">Engineering Lab</h4><span class="micro">TITULAR DEMONSTRATIVO</span><strong id="previewName">Visitante</strong><div class="pass-bars" aria-hidden="true"></div><span class="pass-disclaimer">PRÉVIA ILUSTRATIVA · SEM VALIDADE</span></div></div><pre id="passJson" class="json-code" tabindex="0" hidden></pre></div>`+result;
      function update(){const title=$('#passTitle',host).value.trim()||'Engineering Lab';const name=$('#passName',host).value.trim()||'Visitante';const color=$('#passColor',host).value;$('#previewTitle',host).textContent=title;$('#previewName',host).textContent=name;const card=$('.pass-card',host);card.style.background=color;card.style.color=color==='#e9edf3'?'#171717':'#fff';const object={id:'ISSUER_ID.visitor_demo',classId:'ISSUER_ID.lab',state:'ACTIVE',cardTitle:{defaultValue:{language:'pt-BR',value:title}},header:{defaultValue:{language:'pt-BR',value:name}},hexBackgroundColor:color,textModulesData:[{id:'notice',header:'Demonstração',body:'Passe sem validade. Substitua os placeholders e assine no backend.'}]};$('#passJson',host).textContent=JSON.stringify({genericObjects:[object]},null,2);}
      ['#passTitle','#passName','#passColor'].forEach(s=>listen(s,'input',update));update();
      listen('#jsonToggle','click',e=>{const show=$('#passJson',host).hidden;$('#passJson',host).hidden=!show;$('#passPreview',host).hidden=show;e.target.textContent=show?'Ver prévia':'Ver JSON';e.target.setAttribute('aria-pressed',String(show));});
      listen('#copyJson','click',async()=>{try{await navigator.clipboard.writeText($('#passJson',host).textContent);if(alive)message('JSON copiado. Contém placeholders, não credenciais nem um passe emitido.');}catch{if(!alive)return;$('#passJson',host).hidden=false;$('#passPreview',host).hidden=true;$('#jsonToggle',host).textContent='Ver prévia';$('#jsonToggle',host).setAttribute('aria-pressed','true');message('A cópia automática foi bloqueada. O JSON está visível para selecionar e copiar.');}});
    }
    return () => {alive=false;abort.abort();pending.forEach((resolve,id)=>{clearTimeout(id);resolve(false);});pending.clear();host.innerHTML='';};
  }
  function engineer(host,key) {
    const p=projects[key];let alive=true,locked=false,writes=0,hasResult=false,operation=0,lastKey='';const timers=new Map();
    const wait=ms=>new Promise(resolve=>{const t=setTimeout(()=>{timers.delete(t);resolve(alive);},ms);timers.set(t,resolve);});
    host.innerHTML=`<div class="demo-top"><span class="micro">MODO ENGENHEIRO / CENÁRIO DIDÁTICO</span><h3>Veja a requisição atravessar o sistema.</h3><p>O diagrama é conceitual, não uma inspeção da infraestrutura privada.</p></div><div class="pipeline">${p.nodes.map((n,i)=>`<button class="pipeline-node" data-node="${i}"><small>0${i+1}</small><strong>${n}</strong><span>Em espera</span></button>${i<3?'<i class="pipe" aria-hidden="true"></i>':''}`).join('')}</div><p id="nodeExplanation" class="node-explanation">Selecione um componente para ler sua responsabilidade.</p><div class="demo-actions"><button class="button primary" data-run="normal">Enviar requisição</button><button class="button" data-run="fault">Simular falha + retry</button><button class="button" data-run="duplicate">Reenviar mesma chave</button></div><div class="trace-head"><span>TRACE ILUSTRATIVO</span><span id="writeCount">Gravações simuladas: 0</span></div><ol id="trace" class="trace" aria-live="polite"><li>Nenhum tráfego real é gerado. Durações não são benchmarks.</li></ol>`;
    const notes=['Recebe a intenção do usuário. Não decide sozinha o resultado de uma operação.','Valida contexto, autorização e entrada antes de seguir.','Executa ou coordena a operação. Falhas precisam ter estados explícitos.','Persistência ou destino final. A chave de idempotência evita repetir o efeito.'];
    host.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>{$('#nodeExplanation',host).textContent=`${p.nodes[Number(b.dataset.node)]}: ${notes[Number(b.dataset.node)]}`;});
    function log(t){if(!alive)return;const li=document.createElement('li');li.textContent=t;$('#trace',host).append(li);}
    function state(i,t){const el=host.querySelectorAll('[data-node]')[i];el.dataset.state=t==='OK'?'ok':'active';$('span',el).textContent=t;}
    async function run(scenario){
      if(locked||!alive)return;locked=true;host.querySelectorAll('[data-run]').forEach(b=>b.disabled=true);
      $('#trace',host).textContent='';host.querySelectorAll('[data-node]').forEach(b=>{delete b.dataset.state;$('span',b).textContent='Em espera';});
      if(scenario==='duplicate'&&!hasResult){log('Envie uma requisição primeiro para criar uma chave de referência.');locked=false;host.querySelectorAll('[data-run]').forEach(b=>b.disabled=false);return;}
      const opKey=scenario==='duplicate'?lastKey:`demo-key-${++operation}`;
      log(scenario==='duplicate'?`Reenviando ${opKey}.`:`Nova operação demonstrativa: ${opKey}.`);
      for(let i=0;i<4;i++){
        if(!alive)return;state(i,'Processando');if(!await wait(220))return;
        if(i===1&&scenario==='fault'){state(i,'Timeout');log('Tentativa 1: timeout injetado antes de qualquer gravação.');if(!await wait(400))return;log('Retry 2/2: mesma chave; nenhuma operação financeira é repetida.');state(i,'Retry');if(!await wait(220))return;}
        state(i,'OK');log(`${p.nodes[i]}: etapa simulada concluída.`);
      }
      if(scenario==='duplicate'){log('Chave já processada. Resultado reutilizado; nenhuma gravação adicional.');}else{writes++;hasResult=true;lastKey=opKey;log(`Operação concluída uma vez. Resultado associado à chave ${opKey}.`);}
      $('#writeCount',host).textContent=`Gravações simuladas: ${writes}`;locked=false;host.querySelectorAll('[data-run]').forEach(b=>b.disabled=false);
    }
    host.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>run(b.dataset.run));
    return ()=>{alive=false;timers.forEach((resolve,t)=>{clearTimeout(t);resolve(false);});timers.clear();host.innerHTML='';};
  }
  window.StudioDemos={projects,mount,engineer};
})();
