# Beto Delazane · Senior Software Engineer

Portfólio público, edição **Studio 02**.

**Site:** https://betodelazaneupper.github.io/Publicos/

## Experimente

Escolha um projeto e abra **Experimentar projeto**. Cada experiência oferece três camadas: **Experimentar**, **Modo engenheiro** e **Decisões**.

| Experiência | Interação local |
|---|---|
| Projeto Agenda | Reservas por unidade e tratamento de conflito |
| MagicDev | Fila de tarefas com aprovação e cancelamento |
| PickSide | Voto único, troca de lado e confirmação fictícia de promoção |
| Mapa da Percepção | Três respostas e visualização vetorial |
| Beto | Pontos virtuais e repetição idempotente de eventos |
| Google Wallet Lab | Prévia personalizável e JSON sem assinatura |

São **demonstrações sintéticas criadas para o portfólio**, não cópias dos produtos. Nenhuma delas acessa sistemas privados, executa comandos, cobra dinheiro, emite passes reais ou envia dados. Fechar a janela ou trocar de camada descarta seu estado.

## Identidade e movimento

Personagem vetorial 2D, inspirado na ilustração fornecida por Beto, com aceno, ajuste dos óculos, joinha, piscada, gesto de apontar e reação à troca de tema. O rodapé tem uma versão sentada e um pequeno easter egg no monograma.

Tema escuro preto/cinza/branco; claro branco/cinza/azul. Efeito metálico procedural em Canvas, transição circular de tema quando suportada, transferência de título para a experiência, movimento de entrada e rolagem opcional.

Veja [MOTION.md](MOTION.md) para detalhes e [TESTING.md](TESTING.md) para o escopo da verificação.

## Publicação

GitHub Pages: branch `main`, pasta `/ (root)`, usando a publicação nativa já configurada. Não há build de aplicação ou backend no Pages.

Para uma prévia local estática:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000`. Esse servidor precisa rodar na mesma máquina do navegador.

## Organização

- `index.html`, `styles.css`: apresentação e estrutura acessível.
- `script.js`: navegação, temas, camadas e animações coordenadas.
- `character.js`: formas SVG e poses do personagem.
- `demos.js`: experimentos descartáveis em memória.
- `fluid.js`: superfície metálica artística (não é simulação física).
- `assets/social-cover.png`: capa raster de compartilhamento.
- `scripts/render-cover.cjs`: recria a fonte SVG da capa a partir do personagem atual.
- `google-wallet/`: documentação e exemplo separado que exige credenciais locais próprias.

O exemplo Node.js do Wallet é diferente da prévia da home; siga seu README para configurar Issuer e Service Account. Nunca coloque credenciais no portfólio.

## Privacidade

Não há analytics nem conexões com APIs dos produtos. Apenas bibliotecas de animação versionadas podem ser carregadas do jsDelivr; o CDN recebe as requisições usuais do navegador. As preferências de tema e movimento ficam localmente quando permitido. Os únicos canais de contato publicados são o perfil GitHub confirmado e o compartilhamento do portfólio; nenhum LinkedIn ou e-mail foi adivinhado.

A ilustração de referência foi fornecida pelo titular do portfólio. Sua inclusão não concede licença automática de redistribuição a terceiros.
