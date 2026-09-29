# Beto Delazane — edição em movimento

A página principal usa a ilustração fornecida pelo titular do portfólio. O personagem é uma composição SVG: recortes da mesma imagem para cabeça, corpo e braços, com pivôs independentes. Não é um vídeo nem um novo retrato gerado. A imagem WebP não contém credenciais ou metadados de localização.

## Interações

- Aceno inicial, movimento leve do corpo e da cabeça; clique no personagem ou em **Dê um oi** para acenar novamente.
- Superfície de aparência líquida/metálica em Canvas 2D, com contornos procedurais, deformação por ponteiro e ondas ao toque. É um efeito visual, não uma simulação física de fluidos.
- GSAP 3.13.0 + ScrollTrigger para entrada tipográfica, revelação de seções, paralaxe e botões magnéticos.
- Lenis 1.3.11 para rolagem suave em dispositivos com mouse; o toque mantém a rolagem nativa.
- Faixa tipográfica em movimento, órbitas, diagrama de arquitetura animado, seleção de projetos, acordeões e demonstração visual do fluxo Wallet.
- Tema escuro preto/cinza/branco e tema claro branco/cinza/azul. A preferência é salva localmente quando o navegador permite.

As bibliotecas são carregadas sob demanda, por versões fixas via jsDelivr. O conteúdo e os controles essenciais continuam funcionando se o CDN falhar. Nenhuma conta ou chave é necessária para as animações.

## Acessibilidade e desempenho

O botão **Pausar** interrompe o Canvas, o rig do personagem, animações CSS, animações nativas e os efeitos GSAP/Lenis. A preferência `prefers-reduced-motion` é respeitada na inicialização. Projetos têm semântica de tabs e navegação por setas, Home e End. O site inclui link para pular navegação, foco visível e menu móvel.

Canvas e personagem param fora da área visível e em aba oculta. A resolução do Canvas é limitada a DPR 1.5 e sua atualização em dispositivos de toque é reduzida. O site não inclui analytics nem rastreadores próprios; o CDN recebe as requisições normais de carregamento de bibliotecas.

## Verificação feita

A edição foi testada localmente com Chromium/Playwright em 1440px e 390px: temas, aceno, pausa, tabs por clique e teclado, acordeões, menu móvel, fluxo visual Wallet e ausência de rolagem horizontal em 390px. A execução local bloqueou os CDNs intencionalmente para testar a alternativa nativa; essa verificação não equivale a uma execução completa das bibliotecas externas. Os arquivos enviados ao GitHub foram comparados pelos hashes de blobs com os arquivos testados.

## Publicação

Manter o método já configurado: GitHub Pages, branch `main`, pasta `/ (root)`. O diretório `google-wallet/` permanece no repositório. O cartão animado na home é ilustrativo, não chama a API e não emite passes reais.

## Referências das bibliotecas

- GSAP: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis: https://github.com/darkroomengineering/lenis

A ilustração do personagem foi fornecida pelo titular do site; sua inclusão não concede automaticamente licença de redistribuição a terceiros.
