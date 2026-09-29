# Verificação — Studio 02

## Resultado local

**53 verificações passaram, sem erros JavaScript não tratados**, em Chromium via Playwright. CSS e JavaScript reais foram incorporados ao documento de teste, pois este ambiente restringe navegação de navegador para servidores e CDNs externos.

Isso valida a implementação nativa e o comportamento das demos, mas **não é uma medição de produção** nem um teste completo de todas as bibliotecas externas.

## Cobertura

- Renderização do SVG em grupos independentes; aceno, joinha e piscada.
- Alternância escuro/claro e transição de tema no Chromium.
- Pausa congelando o Canvas; respeito à preferência de movimento reduzido.
- Seis experiências: abertura, camada de decisões, fechamento com Escape e devolução do foco.
- Agenda: unicidade por unidade/horário e conflito ao repetir reserva.
- MagicDev: aprovação antes da execução, conclusão da fila e cancelamento.
- PickSide: voto sem duplicação, troca de lado e diferença entre retorno de checkout e confirmação simulada.
- Mapa: três respostas, figura SVG e valores textuais correspondentes.
- Beto: pontos fictícios concedidos uma vez por missão.
- Wallet: edição do JSON, mudança de acabamento e texto tratado sem interpretar HTML.
- Modo engenheiro nos seis projetos: operação normal, timeout/retry e reenvio idempotente sem gravação extra.
- Navegação das tabs por teclado; easter egg do monograma.
- Ausência de rolagem horizontal nas larguras 320, 390, 768, 1024 e 1440 pixels.
- Tema claro, menu e dialog em emulação móvel.
- Controles funcionais quando localStorage não está disponível.
- Cancelamento ao desmontar demos, sem atualizações tardias sobre outra experiência.
- Nenhuma requisição para API de produto, rastreamento, login ou pagamento durante esses testes.

## Limites

As requisições ao jsDelivr foram bloqueadas intencionalmente para exercitar o fallback. A execução completa de GSAP/ScrollTrigger/Lenis com CDN acessível não foi testada end-to-end neste ambiente. Persistência das preferências em uma origem real também não foi testada aqui. Safari, Firefox, dispositivos físicos e auditoria completa WCAG/performance permanecem fora deste escopo.

O exemplo Node.js em `google-wallet/` não foi exercitado com um Issuer ou credenciais reais. As demos da home não devem ser confundidas com esse fluxo.

## Integridade dos arquivos testados

Hashes Git dos arquivos enviados:

| Arquivo | Blob SHA |
|---|---|
| index.html | 33e3512ece547ad162dd43c17fb590d7b0ace4ad |
| styles.css | 37715499567cc10e6e7ee42bf083b73985346c9e |
| script.js | 355c0957a1309b33855c855ad1c4a07bb9bf3a52 |
| character.js | f5e7a51d036b80ad4a9ddcca3da9986fcf3a6ac3 |
| demos.js | e37c955256771d8df73fd3cafd276fc243e1dde7 |
| fluid.js | 17272bd2f4280e4754c503fef531be134608aad1 |

Os testes não consultam repositórios privados nem usam tokens ou chaves de serviço.
