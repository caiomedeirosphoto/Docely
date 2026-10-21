# docely — instruções do projeto

App de pedidos de mousses, docinhos e encomendas do Caio e da Mirielly (Miri). Começa vendendo nos trabalhos deles; precisa estar pronto para crescer.
Marca: **docely** (logo "docely" com ponto framboesa; ícone "d." com ponto framboesa). Frase: "O seu doce, do seu jeito!"

## Como trabalhar (regras do Caio)
- Responder sempre em **português**, simples, para quem não é técnico.
- Toda mudança vai na branch **`dev`**. Só vai para a **`main`** (site no ar) depois do "pode subir" do Caio.
- A cada atualização: testar tudo (390px e 320px, sem erro no console) e mandar a prévia antes de pedir o ok.
- Pedidos de storyboard: desenhar primeiro no storyboard (artefato de Design), depois mexer no código.

## Estrutura
- `index.html` — página única (PWA). `styles.css` — visual. `app.js` — telas e ações (rotas por `#/...`).
- `logic.js` — regras puras: preços, prazos de entrega, Pix (BR Code), status. Testes em `.dev/logic_test.mjs` (`node .dev/logic_test.mjs`).
- `data.js` — dados. Sem Firebase configurado roda em **modo de teste** (localStorage). Com Firebase: Auth + Firestore.
- `config.js` — chave Pix, WhatsApp da Miri, e-mails do painel, horário limite, config do Firebase.
- `firestore.rules` — segurança do banco (painel só para os 2 e-mails, com e-mail verificado).
- `.dev/` (fora do git) — testes Playwright: `smoke.py`, `flow.py [largura]`, `edge.py`. Servidor: `python3 -m http.server 8822` na raiz.

## Regras do negócio
- Pedido normal: entrega em mãos **no próximo dia útil**. Limite 22h30. Sexta/sábado/domingo → segunda. (`deliveryDate` em logic.js)
- Encomenda de festa: 25/50 docinhos = 2 dias, 100 = 3 dias, 200 = 4 dias de antecedência; data escolhida pela pessoa.
- Pagamento só Pix (estático, direto na conta). Pix vale 24h. Fluxo: aguardando_pix → (cliente envia comprovante no WhatsApp da Miri) comprovante → painel aprova (confirmado) ou recusa com motivo (recusado → cliente tenta de novo) → separado → entregue. Expirou: cancelado.
- Status mostrados ao cliente: Pedido confirmado → Separado pra você → Entregue ("Bom apetite!"). Não mostrar nome de quem entrega.
- Tamanhos de mousse: só Tradicional e Grande. Preços de caixinha e encomenda ainda são exemplo (Caio vai mandar).

## Visual
Fundo creme #FBF7F4, texto cacau #2B1D16, framboesa #B4234D (botões), manteiga #F6EFC4 (avisos), verde #2F7D4F (confirmado). Painel em grafite escuro (#161618) com botões de contorno (texto verde/vermelho claro).
Fontes locais: Bricolage Grotesque (títulos) e Inter (texto). Sem barras de rolagem visíveis. Barra de navegação: Início, Cardápio, Pedidos, Conta.

## Prévia
Artefato de prévia (modo de teste): https://claude.ai/artifact/MNin7WFxibmuf4ZEFWgMFr — página em `.dev/preview/docely.html` + arquivos do app publicados junto. Atualizar a cada mudança na `dev`.
