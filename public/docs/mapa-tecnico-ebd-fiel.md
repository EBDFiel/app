# Mapa técnico completo do EBD Fiel

**Atualizado em:** 28/06/2026
**Versão do mapa:** 1.0.3

Documento de continuidade técnica para manutenção do sistema por outra IA, desenvolvedor ou suporte.

---

## 1. Identificação do projeto

- **Nome:** EBD Fiel / Secretaria EBD Fiel
- **Domínio:** https://app.ebdfiel.com.br
- **Repositório:** https://github.com/EBDFiel/app.git
- **Stack:** React + Vite + Supabase + Vercel
- **Deploy:** Vercel conectado ao branch principal do GitHub
- **Pasta local:** C:\Users\user\OneDrive\Documents\ebdfiel-app-github
- **Objetivo:** Sistema web para secretaria da Escola Bíblica Dominical, com cadastro de igrejas, classes, alunos, professores, chamadas, relatórios, aniversariantes, administração e suporte.

## 2. Ambiente local

- O projeto local fica em C:\Users\user\OneDrive\Documents\ebdfiel-app-github.
- A pasta principal contém .git, public, src, package.json, vite.config.js, index.html e node_modules. O index.html concentra as metatags públicas de SEO, compartilhamento e PWA do app.
- O app é uma SPA. A maioria das telas é controlada por estado interno no App.jsx, não por rotas separadas.
- As variáveis locais do Supabase ficam em .env.local e não devem ser enviadas ao GitHub.
- O arquivo .env.local deve conter VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.

## 3. Comandos principais

- `npm.cmd run dev` — abre o servidor local do Vite para testes.
- `npm.cmd run build` — gera a versão de produção e executa o gerador automático do mapa técnico antes do build.
- `npm.cmd run preview` — pré-visualiza o build localmente.
- `npm.cmd run docs:mapa` — gera manualmente os arquivos public/docs/mapa-tecnico-ebd-fiel.md e .txt.
- `git status` — mostra arquivos alterados antes do commit.
- `git add src/App.css src/data/mapaTecnicoSistema.js public/docs/mapa-tecnico-ebd-fiel.md public/docs/mapa-tecnico-ebd-fiel.txt` — adiciona os arquivos de melhoria visual do app e mapa técnico desta atualização.
- `git commit -m "Melhora visual do login e dashboard"` — salva a atualização visual no Git.
- `git push origin main` — envia para o GitHub e aciona o deploy na Vercel.

## 4. Mapa de páginas e áreas

### Área pública

Telas acessíveis sem login.

- **Página inicial pública:** apresentação comercial e institucional do EBD Fiel, com recursos, benefícios, planos, dúvidas e entrada no sistema.
- **Login:** entrada de usuários cadastrados por e-mail e senha.
- **Recuperação de senha:** envio de link pelo Supabase Auth para redefinir a senha.
- **Cadastro público da igreja:** solicitação inicial de cadastro de nova igreja, com dados básicos do responsável e da igreja.
- **Cadastro enviado:** confirmação visual de que a solicitação foi enviada para análise administrativa.

### Área interna da secretaria

Telas usadas pela secretaria e perfis autorizados.

- **Painel:** visão inicial com resumo rápido, ações, alertas da EBD, aniversariantes e sugestões.
- **Resumo geral:** dashboard consolidado com frequência, classes, alunos, chamadas, alertas e indicadores visuais.
- **Classes:** cadastro, edição e acompanhamento das classes/turmas da EBD.
- **Alunos:** cadastro de alunos, telefone, data de nascimento, classe e histórico.
- **Professores:** cadastro e gestão de professores usados nas chamadas e vínculos.
- **Usuários:** gestão de usuários e perfis de acesso vinculados à igreja.
- **Chamada:** registro de presença de alunos e professores por data e classe.
- **Relatórios:** geração e visualização de relatórios, frequência e documentos para impressão/PDF.
- **Histórico do aluno:** consulta individual de presenças, faltas e participação.
- **Financeiro:** área reservada para controles financeiros da EBD.
- **Segurança e auditoria:** diagnóstico, auditoria, verificação de dados e rotinas de segurança.
- **Manual do usuário:** orientações de uso para secretaria, professores e usuários internos.
- **Configurações:** dados da igreja, cabeçalho de relatórios, contatos e personalizações internas.

### Administração do sistema

Área restrita para administradores do sistema.

- **Visão geral administrativa:** resumo das igrejas, cadastros, acessos, sugestões, diagnóstico e atalhos administrativos.
- **Sugestões recebidas:** lista e resposta às sugestões enviadas pelas igrejas.
- **Igrejas cadastradas:** controle de igrejas, status, liberação e edição de dados administrativos.
- **Auditoria:** conferência de registros, vínculos, dados e consistência operacional.
- **Diagnóstico:** verificação técnica do carregamento, dados e possíveis falhas.
- **Mapa técnico do sistema:** documento vivo para continuidade técnica e suporte por outra IA ou desenvolvedor.

## 5. Fluxos principais

### Cadastro público de igreja

Fluxo usado para solicitar entrada de uma nova igreja no sistema.

1. Visitante acessa a página pública.
2. Clica em solicitar cadastro da igreja.
3. Preenche dados do responsável, e-mail, senha, telefone, nome da igreja, cidade e estado.
4. O sistema cria usuário pelo Supabase Auth.
5. O sistema chama a RPC criar_cadastro_piloto para criar/vincular a igreja.
6. O perfil inicial é criado em perfis_usuarios.
7. O usuário é deslogado e vê a mensagem de cadastro enviado.
8. O administrador do sistema analisa e libera o acesso.

### Login e carregamento de dados

Fluxo de entrada de usuário autenticado.

1. Usuário entra com e-mail e senha.
2. Supabase Auth valida a sessão.
3. O sistema carrega perfil em perfis_usuarios.
4. O sistema identifica igreja_id, perfil, permissões e contexto de suporte administrativo.
5. As tabelas de classes, alunos, professores, chamadas, configurações e feedbacks são carregadas.
6. A tela interna é liberada conforme perfil.

### Chamada

Registro de presença usado para relatórios e indicadores.

1. Usuário acessa Chamada.
2. Seleciona tipo de chamada, classe e data.
3. Marca presença/falta de alunos ou professores.
4. Salva a chamada.
5. Os dados alimentam relatórios, frequência geral, frequência por classe e histórico.

### Relatórios

Fluxo de geração de documentos e resumos.

1. Usuário acessa Relatórios.
2. Seleciona classe/período quando aplicável.
3. Sistema calcula totais, presença, faltas, visitantes, Bíblias, revistas e ofertas quando disponíveis.
4. Usuário visualiza, imprime ou baixa PDF.

### Aniversariantes

Fluxo de identificação e compartilhamento de cartões.

1. Sistema identifica aniversariantes da semana com base na data de nascimento.
2. Usuário abre a janela de aniversariantes no painel.
3. Usuário visualiza lista e abre cartão individual.
4. O cartão pode ser baixado como imagem, PDF no tamanho do cartão, impresso ou compartilhado.

### Administração em modo suporte

Fluxo usado por administradores para acessar dados de uma igreja em suporte.

1. Administrador entra na área Administração.
2. Seleciona ou abre uma igreja cadastrada.
3. O sistema preserva contexto de suporte em localStorage.
4. O administrador visualiza a igreja como secretaria, sem perder permissão administrativa.
5. Ao retornar à aba ou após refresh, o contexto é restaurado quando possível.

## 6. Supabase, autenticação e banco

- **Provedor:** Supabase
- **Autenticação:** Supabase Auth com e-mail e senha.

### Variáveis de ambiente

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Tabelas citadas no sistema

- `perfis_usuarios`
- `igrejas`
- `classes`
- `alunos`
- `professores`
- `chamadas`
- `chamadas_professores`
- `configuracoes_igreja`
- `feedbacks`
- `vinculos_professores`

### RPCs/funções citadas

- `criar_cadastro_piloto`
- `vagas_piloto_disponiveis`

### Cuidados com banco

- Não alterar RLS, policies, tabelas, RPCs ou autenticação sem pedido explícito.
- Não remover nomes internos legados como piloto se eles ainda estiverem vinculados a RPCs ou colunas existentes.
- A linguagem visual/comercial não deve usar teste piloto, mas nomes técnicos legados podem permanecer no código para compatibilidade.
- Antes de mexer em cadastro, login ou carregamento, rodar build e testar login, cadastro, painel, chamada e administração.

## 7. Arquivos principais

### `index.html`

Arquivo HTML base do Vite. Define título, descrição, favicon, manifest, tags Open Graph/Twitter e metadados usados para miniatura de compartilhamento e atalho mobile.

- Manter og:image e twitter:image apontando para imagem absoluta em https://app.ebdfiel.com.br/preview-ebdfiel-whatsapp.jpg, no padrão 1200x630 em JPEG para melhor compatibilidade com WhatsApp.
- Evitar duplicar tags twitter:image ou og:image com imagens diferentes ou com parâmetros desnecessários, pois isso pode confundir WhatsApp, Facebook, Twitter/X e navegadores.
- Após alterar miniatura ou ícones, publicar na Vercel e testar URLs públicas, compartilhamento em WhatsApp/Telegram e atalho na tela inicial do celular. No WhatsApp, testar também em conversa nova por causa do cache.

### `public/manifest.webmanifest e public/icons`

Arquivos públicos usados pelo navegador para instalar/adicionar o app à tela inicial com nome, tema e ícones corretos.

- Manter ícones 192x192, 512x512 e maskable em public/icons, além de apple-touch-icon.png 180x180 para iPhone/Safari.
- Manter apple-touch-icon.png e favicon.png na pasta public para compatibilidade com iPhone, Android e navegadores.
- Quando trocar ícones, usar query string ou novo nome de arquivo para vencer cache dos celulares.

### `src/App.jsx`

Arquivo principal do sistema. Concentra estados, renderização de páginas, fluxo de autenticação, carregamento de dados, administração, chamada, relatórios e aniversariantes.

- Alterações devem ser feitas com muito cuidado, pois uma função fora do escopo pode gerar tela azul.
- Não usar substituições globais automáticas em termos técnicos como piloto.
- Preservar funções de autenticação e carregamento de dados.
- Preservar correções recentes do cartão de aniversário e menu mobile.

### `src/App.css`

Arquivo principal de estilos. Contém layout público, login, dashboard, menu mobile, administração, relatórios, aniversariantes e mapa técnico. Em 28/06/2026 recebeu a melhoria visual v1, focada em página pública, login, painel/dashboard e acabamento das telas internas sem alterar funcionamento.

- A melhoria visual v1 foi aplicada por regras CSS no final do arquivo para preservar a estrutura e o comportamento existentes.
- Preferir adicionar blocos no final quando possível.
- Evitar remover regras antigas sem testar telas mobile e desktop.
- Após qualquer alteração visual, testar login, painel, administração e cartão de aniversário.

### `src/lib/supabase.js`

Inicialização do cliente Supabase usando variáveis de ambiente.

- Não colocar chaves diretamente no código.
- Usar somente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.

### `src/data/mapaTecnicoSistema.js`

Fonte central do mapa técnico vivo exibido na Administração e usado para gerar arquivos Markdown/TXT.

- Sempre atualizar este arquivo quando criar nova página, fluxo, tabela ou comportamento importante.
- Este arquivo não deve conter senhas, tokens, chaves privadas ou dados sensíveis.

### `scripts/gerar-mapa-tecnico.cjs`

Script Node executado antes do build para gerar public/docs/mapa-tecnico-ebd-fiel.md e .txt.

- Não depende de Supabase.
- Não altera banco de dados.
- Pode ler package.json e App.jsx apenas para registrar dados técnicos de build.

### `package.json`

Define dependências e scripts do projeto.

- O script prebuild executa automaticamente o gerador do mapa técnico antes do Vite build.
- Não remover prebuild se quiser manter atualização automática dos documentos.

## 8. Perfis e permissões

### Visitante público

- Página inicial
- Login
- Recuperação de senha
- Cadastro público da igreja

### Secretaria

- Painel
- Resumo geral
- Classes
- Alunos
- Professores
- Usuários
- Chamada
- Relatórios
- Histórico
- Financeiro
- Segurança e auditoria
- Manual
- Configurações

### Professor

- Painel
- Chamada
- Alunos/classes permitidas
- Relatórios ou áreas autorizadas

### Administrador do sistema

- Administração
- Igrejas
- Sugestões
- Auditoria
- Diagnóstico
- Mapa técnico
- Modo suporte por igreja

## 9. Regras de ouro para outra IA

- Nunca mexer em Supabase, RLS, policies, tabelas ou RPCs sem necessidade real e sem backup.
- Sempre rodar npm.cmd run build antes de publicar. Para mudanças em index.html/public, conferir também se a miniatura e os ícones carregam pela URL pública.
- Sempre testar em desktop e mobile depois de alterar App.jsx ou App.css.
- Manter o mapa técnico atualizado quando criar página, botão, fluxo, tabela ou regra nova.
- Não apagar funções aparentemente antigas sem verificar se algum JSX ainda chama essas funções.
- Não substituir palavras globalmente no App.jsx; isso já causou riscos em fluxos técnicos.
- Ao entregar correções, preferir arquivo completo e passo a passo direto.
- Depois de alterações no sistema, atualizar também este mapa técnico vivo.

## 10. Checklist de publicação

1. Rodar npm.cmd run build.
2. Rodar npm.cmd run dev e testar localmente.
3. Testar login.
4. Testar Painel.
5. Testar menu mobile.
6. Testar Aniversariantes e cartão.
7. Testar Administração quando a alteração for administrativa.
8. Conferir git status.
9. Fazer commit.
10. Fazer git push origin main.
11. Aguardar Vercel publicar.
12. Testar https://app.ebdfiel.com.br com atualização forçada.

## 11. Prompt pronto para outra IA

```txt
Você vai me ajudar no projeto EBD Fiel. Antes de sugerir código, leia o mapa técnico do sistema. O projeto é React + Vite + Supabase, publicado na Vercel em https://app.ebdfiel.com.br. O arquivo principal é src/App.jsx e o CSS principal é src/App.css. Não altere Supabase, RLS, policies, tabelas ou RPCs sem pedido explícito. Evite substituições globais automáticas. Sempre preserve login, cadastro, painel, chamada, administração, cartão de aniversário e menu mobile. Ao sugerir alterações, entregue arquivos completos ou instruções seguras, rode npm.cmd run build e atualize o mapa técnico quando houver mudança estrutural.
```


---

## 12. Informações geradas automaticamente no build

- **Gerado em:** 28/06/2026, 00:55
- **Nome do package:** ebdfiel-app
- **Versão do package:** 0.0.0
- **Tipo do projeto:** module

### Scripts do package.json

- `dev`: `vite`
- `docs:mapa`: `node scripts/gerar-mapa-tecnico.cjs`
- `prebuild`: `node scripts/gerar-mapa-tecnico.cjs`
- `build`: `vite build`
- `lint`: `eslint .`
- `preview`: `vite preview`

### Dependências principais

- `@supabase/supabase-js`: `^2.106.1`
- `html2canvas`: `^1.4.1`
- `jspdf`: `^4.2.1`
- `react`: `^19.2.6`
- `react-dom`: `^19.2.6`

### Páginas internas extraídas do App.jsx

- `painel`
- `dashboard`
- `classes`
- `alunos`
- `professores`
- `usuarios`
- `chamada`
- `relatorios`
- `historico`
- `financeiro`
- `backup`
- `manual`
- `configuracoes`
- `administracao`

### Itens do menu extraídos do App.jsx

- Painel (painel)
- Resumo geral (dashboard)
- Classes (classes)
- Alunos (alunos)
- Professores (professores)
- Usuários (usuarios)
- Chamada (chamada)
- Relatórios (relatorios)
- Histórico do aluno (historico)
- Financeiro (financeiro)
- Segurança e auditoria (backup)
- Manual do usuário (manual)
- Configurações (configuracoes)
- Administração (administracao)

### Observação

Este arquivo é recriado automaticamente antes do build por `scripts/gerar-mapa-tecnico.cjs`. Para manter o conteúdo fiel ao sistema, atualize `src/data/mapaTecnicoSistema.js` sempre que criar telas, fluxos, tabelas, permissões ou comportamentos importantes.
