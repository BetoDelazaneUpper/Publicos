# Studio 02 — movimento com propósito

## Personagem

A edição anterior usava recortes raster. Esta usa um desenho SVG com formas independentes: cabeça, cabelo, olhos, óculos, braços, mãos e corpo. Ele mantém características visuais da ilustração fornecida por Beto; não é um novo retrato fotográfico.

- Cena inicial curta: ajuste dos óculos e aceno.
- Clique em **Dê um oi** ou no personagem: aceno, joinha e piscada em sequência.
- Ao selecionar projeto, o personagem aponta e o pequeno guia apresenta uma dica.
- Ao alternar tema, há um gesto de interruptor e uma nova saudação.
- No contato, uma versão sentada trabalha à bancada. Cinco cliques no monograma **bd.** revelam a captura de um bug ilustrativo.

## Transições

Canvas 2D desenha contornos metálicos deformáveis. O ponteiro altera sua aparência e o toque produz ondas. É um efeito visual procedural, não um solver físico de fluidos.

A troca de tema usa `document.startViewTransition`, quando suportado, com expansão circular partindo do botão. O título do projeto se desloca até a janela de experiência e retorna ao fechamento em telas maiores, quando ambos estão visíveis. Sem suporte ou com movimento reduzido, a mudança é direta.

GSAP 3.13.0, ScrollTrigger e Lenis 1.3.11 são complementos opcionais, carregados por versão fixa. Revelações, conteúdo, controles e demos funcionam sem CDN. Lenis é reservado a dispositivos com mouse; o modal e o toque usam rolagem nativa.

## Modo engenheiro

Cada uma das seis experiências inclui:

1. Demonstração de interface com dados fictícios.
2. Fluxo conceitual com componentes selecionáveis, operação normal, timeout antes da gravação, retry e reenvio da mesma chave.
3. Texto de problema, decisão demonstrada e limite/compromisso.

A trilha é ilustrativa. Não mede a produção, não inspeciona o código privado e não deve ser interpretada como garantia de arquitetura ou benchmark.

## Acessibilidade

- Link para pular navegação, foco visível e menu móvel.
- Tabs com seleção por clique e teclado, setas, Home e End.
- Dialog nativo com Escape e restauração do foco.
- O botão **Pausar** interrompe animações decorativas, Canvas, poses e melhorias de rolagem.
- `prefers-reduced-motion` tem prioridade, inclusive quando a preferência muda durante a visita.
- Operações das demos continuam utilizáveis sem movimento. Suas mensagens de estado não dependem só de cor.
- Conteúdo não fica oculto se JavaScript ou CDN não carregar.

## Desempenho e privacidade

Canvas tem DPR limitado a 1.5 e taxa reduzida em toque. Efeitos contínuos param fora da área visível, em aba oculta e atrás do modal. Ao fechar ou trocar uma demo, seus temporizadores são cancelados e seu estado é descartado.

Não há backend para as demos. Nenhuma resposta, voto, tarefa ou cartão é enviado a APIs. O Wallet da home não assina JWTs e não emite passes. Os canais de contato usam apenas o GitHub confirmado; compartilhamento usa Web Share ou clipboard com alternativa textual.

## Capa social

A capa 1200 × 630 contém o nome, cargo e o mesmo personagem vetorial. `scripts/render-cover.cjs` gera a fonte SVG. Um renderizador SVG pode convertê-la para PNG; a imagem final é referenciada nos metadados Open Graph. A atualização de previews em redes sociais depende do cache de cada plataforma.

## Referências oficiais

- GSAP: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis: https://github.com/darkroomengineering/lenis
- View Transitions: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition

O escopo e as limitações dos testes estão em [TESTING.md](TESTING.md).
