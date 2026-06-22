
## O que vou entregar

### 1. Bug crítico (rápido)
- A página `/criar/$category` está caindo em loop infinito de setState (Zustand). Corrijo o `subscribe` do autosave guardando contra reentrada (`if (state.saving === "saving") return`) — sem isso o builder trava com "Maximum call stack size exceeded".

### 2. Identidade visual "Memora" (paleta enviada)
Reescrevo `src/styles.css` com a paleta do board:
- `--background #0D1B2A`, `--surface #1E3A5F`
- `--primary #F5C46A` (amarelo estrela), `--cream #FFF4E1`, `--accent #E6EBFF`
- Tipografia: **Poppins** (display + sans). Removo Playfair/Inter/JetBrains.
- Bordas mais arredondadas, glow dourado, fundo "céu noturno" com estrelinhas sutis.

Crio o personagem **Memo** (a estrelinha) como ilustração SVG inline reutilizável (`src/components/Memo.tsx`) com variantes: `idle`, `wave`, `heart`, `photo`, `thinking`, `celebrate`. Aparece na landing, no builder guiando cada etapa e no preview.

### 3. Mais categorias de homenagem
De 6 para **12**: Amor, Mãe, Pai, Amiga(o), Filho(a), Avós, Casamento/Bodas, Aniversário, Formatura, Pet, Time/Empresa, Em memória. Cada uma com cor de destaque e copy próprio do Memo.

### 4. Templates com identidade (não mais gradientes genéricos)
Cada template vira uma cena animada de verdade, ligada ao tipo de homenagem:
- **Coração Pulsante** (amor) — corações flutuantes + pulsação.
- **Jardim de Memórias** (mãe/amiga) — pétalas caindo (CSS keyframes).
- **Constelação** (pai/formatura) — estrelas conectadas se desenhando.
- **Polaroid** (aniversário) — fotos caindo e girando.
- **Patinhas** (pet) — pegadas aparecendo no scroll.
- **Vela Eterna** (memória) — chama tremulando, fade de luz.
- **Bodas de Ouro** (casamento) — partículas douradas.

Preview de cada template no Step 4 mostra a animação real (não só swatch).

### 5. Busca de música (API gratuita)
Uso **iTunes Search API** (`https://itunes.apple.com/search?term=...&media=music&limit=10`) — sem auth, CORS aberto, retorna `previewUrl` 30s + capa + artista. No Step 4: input de busca → grid de resultados → tocar prévia → selecionar. Salvo no store: `{ title, artist, artwork, previewUrl }`. (Spotify exigiria OAuth e backend; iTunes resolve sem fricção.)

### 6. Preview ao vivo durante o builder
- Botão flutuante **"Ver prévia"** (canto direito) em toda etapa do builder. Abre painel lateral (desktop) ou tela cheia (mobile) com a homenagem renderizada em tempo real conforme o usuário digita.
- Painel atualiza instantaneamente (já que tudo está no Zustand).

### 7. Etapa de Preview Final antes de pagar
Step 5 deixa de ser "Publicar/Pagar" direto. Vira fluxo de 2 telas:
- **5a — Pré-visualizar**: tela cheia da homenagem final, com botão "Editar" (volta) e "Está perfeito, publicar".
- **5b — Publicar**: slug + plano + checkout mock.

### 8. Componente público da homenagem (reutilizável)
Crio `src/components/Tribute.tsx` que renderiza a homenagem dado um state — usado tanto no preview ao vivo, no preview final, quanto futuramente em `/h/$slug`. Tem:
- Hero com nome + frase + contador de tempo juntos
- Galeria de mídia com captions
- Linha do tempo animada (fade-in no scroll)
- Player flutuante com a música escolhida
- Tema visual aplicado conforme template

### 9. Navegação mais rápida
- `defaultPreload: "intent"` no router + `preload="intent"` nos `<Link>`.
- Substituo navegação por `<Link>` onde tem `useNavigate` desnecessário.
- Reduzo trabalho do subscribe do Zustand (causa parte do lag percebido).
- Animações com CSS puro (sem libs pesadas).

### Detalhes técnicos
- Arquivos novos: `src/components/Memo.tsx`, `src/components/Tribute.tsx`, `src/components/PreviewPanel.tsx`, `src/components/MusicSearch.tsx`, `src/components/templates/*.tsx` (1 por tema), `src/lib/itunes.ts`.
- Arquivos editados: `src/styles.css` (paleta + Poppins + animações), `src/lib/builder-store.ts` (fix loop, novos campos `music`, mais categorias/templates), `src/routes/index.tsx` (rebrand landing), `src/routes/criar.index.tsx` (12 categorias), `src/routes/criar.$category.tsx` (preview button, music search, novo step preview final).
- Sem backend ainda (você pediu só frontend). iTunes API é client-side direta.

### Fora do escopo desta entrega
- Página pública real `/h/$slug` persistida (sem backend ainda).
- Checkout Stripe real (mantém mock).
- Geração de IA real (mantém mock — sem backend para guardar a chave).

Posso ir nessa ordem ou você quer reordenar?
