export const MAPA_TECNICO_SISTEMA = {
  titulo: 'Mapa técnico completo do EBD Fiel',
  subtitulo: 'Documento de continuidade técnica para manutenção do sistema por outra IA, desenvolvedor ou suporte.',
  atualizadoEm: '28/06/2026',
  versaoMapa: '1.0.3',
  projeto: {
    nome: 'EBD Fiel / Secretaria EBD Fiel',
    dominio: 'https://app.ebdfiel.com.br',
    repositorio: 'https://github.com/EBDFiel/app.git',
    stack: 'React + Vite + Supabase + Vercel',
    deploy: 'Vercel conectado ao branch principal do GitHub',
    pastaLocal: 'C:\\Users\\user\\OneDrive\\Documents\\ebdfiel-app-github',
    objetivo:
      'Sistema web para secretaria da Escola Bíblica Dominical, com cadastro de igrejas, classes, alunos, professores, chamadas, relatórios, aniversariantes, administração e suporte.',
  },
  ambienteLocal: [
    'O projeto local fica em C:\\Users\\user\\OneDrive\\Documents\\ebdfiel-app-github.',
    'A pasta principal contém .git, public, src, package.json, vite.config.js, index.html e node_modules. O index.html concentra as metatags públicas de SEO, compartilhamento e PWA do app.',
    'O app é uma SPA. A maioria das telas é controlada por estado interno no App.jsx, não por rotas separadas.',
    'As variáveis locais do Supabase ficam em .env.local e não devem ser enviadas ao GitHub.',
    'O arquivo .env.local deve conter VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.',
  ],
  comandos: [
    { comando: 'npm.cmd run dev', descricao: 'abre o servidor local do Vite para testes.' },
    { comando: 'npm.cmd run build', descricao: 'gera a versão de produção e executa o gerador automático do mapa técnico antes do build.' },
    { comando: 'npm.cmd run preview', descricao: 'pré-visualiza o build localmente.' },
    { comando: 'npm.cmd run docs:mapa', descricao: 'gera manualmente os arquivos public/docs/mapa-tecnico-ebd-fiel.md e .txt.' },
    { comando: 'git status', descricao: 'mostra arquivos alterados antes do commit.' },
    { comando: 'git add src/App.css src/data/mapaTecnicoSistema.js public/docs/mapa-tecnico-ebd-fiel.md public/docs/mapa-tecnico-ebd-fiel.txt', descricao: 'adiciona os arquivos de melhoria visual do app e mapa técnico desta atualização.' },
    { comando: 'git commit -m "Melhora visual do login e dashboard"', descricao: 'salva a atualização visual no Git.' },
    { comando: 'git push origin main', descricao: 'envia para o GitHub e aciona o deploy na Vercel.' },
  ],
  paginas: [
    {
      titulo: 'Área pública',
      descricao: 'Telas acessíveis sem login.',
      itens: [
        { nome: 'Página inicial pública', finalidade: 'apresentação comercial e institucional do EBD Fiel, com recursos, benefícios, planos, dúvidas e entrada no sistema.' },
        { nome: 'Login', finalidade: 'entrada de usuários cadastrados por e-mail e senha.' },
        { nome: 'Recuperação de senha', finalidade: 'envio de link pelo Supabase Auth para redefinir a senha.' },
        { nome: 'Cadastro público da igreja', finalidade: 'solicitação inicial de cadastro de nova igreja, com dados básicos do responsável e da igreja.' },
        { nome: 'Cadastro enviado', finalidade: 'confirmação visual de que a solicitação foi enviada para análise administrativa.' },
      ],
    },
    {
      titulo: 'Área interna da secretaria',
      descricao: 'Telas usadas pela secretaria e perfis autorizados.',
      itens: [
        { nome: 'Painel', finalidade: 'visão inicial com resumo rápido, ações, alertas da EBD, aniversariantes e sugestões.' },
        { nome: 'Resumo geral', finalidade: 'dashboard consolidado com frequência, classes, alunos, chamadas, alertas e indicadores visuais.' },
        { nome: 'Classes', finalidade: 'cadastro, edição e acompanhamento das classes/turmas da EBD.' },
        { nome: 'Alunos', finalidade: 'cadastro de alunos, telefone, data de nascimento, classe e histórico.' },
        { nome: 'Professores', finalidade: 'cadastro e gestão de professores usados nas chamadas e vínculos.' },
        { nome: 'Usuários', finalidade: 'gestão de usuários e perfis de acesso vinculados à igreja.' },
        { nome: 'Chamada', finalidade: 'registro de presença de alunos e professores por data e classe.' },
        { nome: 'Relatórios', finalidade: 'geração e visualização de relatórios, frequência e documentos para impressão/PDF.' },
        { nome: 'Histórico do aluno', finalidade: 'consulta individual de presenças, faltas e participação.' },
        { nome: 'Financeiro', finalidade: 'área reservada para controles financeiros da EBD.' },
        { nome: 'Segurança e auditoria', finalidade: 'diagnóstico, auditoria, verificação de dados e rotinas de segurança.' },
        { nome: 'Manual do usuário', finalidade: 'orientações de uso para secretaria, professores e usuários internos.' },
        { nome: 'Configurações', finalidade: 'dados da igreja, cabeçalho de relatórios, contatos e personalizações internas.' },
      ],
    },
    {
      titulo: 'Administração do sistema',
      descricao: 'Área restrita para administradores do sistema.',
      itens: [
        { nome: 'Visão geral administrativa', finalidade: 'resumo das igrejas, cadastros, acessos, sugestões, diagnóstico e atalhos administrativos.' },
        { nome: 'Sugestões recebidas', finalidade: 'lista e resposta às sugestões enviadas pelas igrejas.' },
        { nome: 'Igrejas cadastradas', finalidade: 'controle de igrejas, status, liberação e edição de dados administrativos.' },
        { nome: 'Auditoria', finalidade: 'conferência de registros, vínculos, dados e consistência operacional.' },
        { nome: 'Diagnóstico', finalidade: 'verificação técnica do carregamento, dados e possíveis falhas.' },
        { nome: 'Mapa técnico do sistema', finalidade: 'documento vivo para continuidade técnica e suporte por outra IA ou desenvolvedor.' },
      ],
    },
  ],
  fluxos: [
    {
      titulo: 'Cadastro público de igreja',
      descricao: 'Fluxo usado para solicitar entrada de uma nova igreja no sistema.',
      passos: [
        'Visitante acessa a página pública.',
        'Clica em solicitar cadastro da igreja.',
        'Preenche dados do responsável, e-mail, senha, telefone, nome da igreja, cidade e estado.',
        'O sistema cria usuário pelo Supabase Auth.',
        'O sistema chama a RPC criar_cadastro_piloto para criar/vincular a igreja.',
        'O perfil inicial é criado em perfis_usuarios.',
        'O usuário é deslogado e vê a mensagem de cadastro enviado.',
        'O administrador do sistema analisa e libera o acesso.',
      ],
    },
    {
      titulo: 'Login e carregamento de dados',
      descricao: 'Fluxo de entrada de usuário autenticado.',
      passos: [
        'Usuário entra com e-mail e senha.',
        'Supabase Auth valida a sessão.',
        'O sistema carrega perfil em perfis_usuarios.',
        'O sistema identifica igreja_id, perfil, permissões e contexto de suporte administrativo.',
        'As tabelas de classes, alunos, professores, chamadas, configurações e feedbacks são carregadas.',
        'A tela interna é liberada conforme perfil.',
      ],
    },
    {
      titulo: 'Chamada',
      descricao: 'Registro de presença usado para relatórios e indicadores.',
      passos: [
        'Usuário acessa Chamada.',
        'Seleciona tipo de chamada, classe e data.',
        'Marca presença/falta de alunos ou professores.',
        'Salva a chamada.',
        'Os dados alimentam relatórios, frequência geral, frequência por classe e histórico.',
      ],
    },
    {
      titulo: 'Relatórios',
      descricao: 'Fluxo de geração de documentos e resumos.',
      passos: [
        'Usuário acessa Relatórios.',
        'Seleciona classe/período quando aplicável.',
        'Sistema calcula totais, presença, faltas, visitantes, Bíblias, revistas e ofertas quando disponíveis.',
        'Usuário visualiza, imprime ou baixa PDF.',
      ],
    },
    {
      titulo: 'Aniversariantes',
      descricao: 'Fluxo de identificação e compartilhamento de cartões.',
      passos: [
        'Sistema identifica aniversariantes da semana com base na data de nascimento.',
        'Usuário abre a janela de aniversariantes no painel.',
        'Usuário visualiza lista e abre cartão individual.',
        'O cartão pode ser baixado como imagem, PDF no tamanho do cartão, impresso ou compartilhado.',
      ],
    },
    {
      titulo: 'Administração em modo suporte',
      descricao: 'Fluxo usado por administradores para acessar dados de uma igreja em suporte.',
      passos: [
        'Administrador entra na área Administração.',
        'Seleciona ou abre uma igreja cadastrada.',
        'O sistema preserva contexto de suporte em localStorage.',
        'O administrador visualiza a igreja como secretaria, sem perder permissão administrativa.',
        'Ao retornar à aba ou após refresh, o contexto é restaurado quando possível.',
      ],
    },
  ],
  bancoDados: {
    provedor: 'Supabase',
    autenticacao: 'Supabase Auth com e-mail e senha.',
    variaveisAmbiente: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_PUBLISHABLE_KEY',
    ],
    tabelas: [
      'perfis_usuarios',
      'igrejas',
      'classes',
      'alunos',
      'professores',
      'chamadas',
      'chamadas_professores',
      'configuracoes_igreja',
      'feedbacks',
      'vinculos_professores',
    ],
    rpcs: [
      'criar_cadastro_piloto',
      'vagas_piloto_disponiveis',
    ],
    cuidados: [
      'Não alterar RLS, policies, tabelas, RPCs ou autenticação sem pedido explícito.',
      'Não remover nomes internos legados como piloto se eles ainda estiverem vinculados a RPCs ou colunas existentes.',
      'A linguagem visual/comercial não deve usar teste piloto, mas nomes técnicos legados podem permanecer no código para compatibilidade.',
      'Antes de mexer em cadastro, login ou carregamento, rodar build e testar login, cadastro, painel, chamada e administração.',
    ],
  },
  arquivosPrincipais: [
    {
      caminho: 'index.html',
      descricao: 'Arquivo HTML base do Vite. Define título, descrição, favicon, manifest, tags Open Graph/Twitter e metadados usados para miniatura de compartilhamento e atalho mobile.',
      cuidados: [
        'Manter og:image e twitter:image apontando para imagem absoluta em https://app.ebdfiel.com.br/preview-ebdfiel-whatsapp.jpg, no padrão 1200x630 em JPEG para melhor compatibilidade com WhatsApp.',
        'Evitar duplicar tags twitter:image ou og:image com imagens diferentes ou com parâmetros desnecessários, pois isso pode confundir WhatsApp, Facebook, Twitter/X e navegadores.',
        'Após alterar miniatura ou ícones, publicar na Vercel e testar URLs públicas, compartilhamento em WhatsApp/Telegram e atalho na tela inicial do celular. No WhatsApp, testar também em conversa nova por causa do cache.',
      ],
    },
    {
      caminho: 'public/manifest.webmanifest e public/icons',
      descricao: 'Arquivos públicos usados pelo navegador para instalar/adicionar o app à tela inicial com nome, tema e ícones corretos.',
      cuidados: [
        'Manter ícones 192x192, 512x512 e maskable em public/icons, além de apple-touch-icon.png 180x180 para iPhone/Safari.',
        'Manter apple-touch-icon.png e favicon.png na pasta public para compatibilidade com iPhone, Android e navegadores.',
        'Quando trocar ícones, usar query string ou novo nome de arquivo para vencer cache dos celulares.',
      ],
    },
    {
      caminho: 'src/App.jsx',
      descricao: 'Arquivo principal do sistema. Concentra estados, renderização de páginas, fluxo de autenticação, carregamento de dados, administração, chamada, relatórios e aniversariantes.',
      cuidados: [
        'Alterações devem ser feitas com muito cuidado, pois uma função fora do escopo pode gerar tela azul.',
        'Não usar substituições globais automáticas em termos técnicos como piloto.',
        'Preservar funções de autenticação e carregamento de dados.',
        'Preservar correções recentes do cartão de aniversário e menu mobile.',
      ],
    },
    {
      caminho: 'src/App.css',
      descricao: 'Arquivo principal de estilos. Contém layout público, login, dashboard, menu mobile, administração, relatórios, aniversariantes e mapa técnico. Em 28/06/2026 recebeu a melhoria visual v1, focada em página pública, login, painel/dashboard e acabamento das telas internas sem alterar funcionamento.',
      cuidados: [
        'A melhoria visual v1 foi aplicada por regras CSS no final do arquivo para preservar a estrutura e o comportamento existentes.',
        'Preferir adicionar blocos no final quando possível.',
        'Evitar remover regras antigas sem testar telas mobile e desktop.',
        'Após qualquer alteração visual, testar login, painel, administração e cartão de aniversário.',
      ],
    },
    {
      caminho: 'src/lib/supabase.js',
      descricao: 'Inicialização do cliente Supabase usando variáveis de ambiente.',
      cuidados: [
        'Não colocar chaves diretamente no código.',
        'Usar somente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.',
      ],
    },
    {
      caminho: 'src/data/mapaTecnicoSistema.js',
      descricao: 'Fonte central do mapa técnico vivo exibido na Administração e usado para gerar arquivos Markdown/TXT.',
      cuidados: [
        'Sempre atualizar este arquivo quando criar nova página, fluxo, tabela ou comportamento importante.',
        'Este arquivo não deve conter senhas, tokens, chaves privadas ou dados sensíveis.',
      ],
    },
    {
      caminho: 'scripts/gerar-mapa-tecnico.cjs',
      descricao: 'Script Node executado antes do build para gerar public/docs/mapa-tecnico-ebd-fiel.md e .txt.',
      cuidados: [
        'Não depende de Supabase.',
        'Não altera banco de dados.',
        'Pode ler package.json e App.jsx apenas para registrar dados técnicos de build.',
      ],
    },
    {
      caminho: 'package.json',
      descricao: 'Define dependências e scripts do projeto.',
      cuidados: [
        'O script prebuild executa automaticamente o gerador do mapa técnico antes do Vite build.',
        'Não remover prebuild se quiser manter atualização automática dos documentos.',
      ],
    },
  ],
  perfis: [
    {
      nome: 'Visitante público',
      acessos: ['Página inicial', 'Login', 'Recuperação de senha', 'Cadastro público da igreja'],
    },
    {
      nome: 'Secretaria',
      acessos: ['Painel', 'Resumo geral', 'Classes', 'Alunos', 'Professores', 'Usuários', 'Chamada', 'Relatórios', 'Histórico', 'Financeiro', 'Segurança e auditoria', 'Manual', 'Configurações'],
    },
    {
      nome: 'Professor',
      acessos: ['Painel', 'Chamada', 'Alunos/classes permitidas', 'Relatórios ou áreas autorizadas'],
    },
    {
      nome: 'Administrador do sistema',
      acessos: ['Administração', 'Igrejas', 'Sugestões', 'Auditoria', 'Diagnóstico', 'Mapa técnico', 'Modo suporte por igreja'],
    },
  ],
  regrasDeOuro: [
    'Nunca mexer em Supabase, RLS, policies, tabelas ou RPCs sem necessidade real e sem backup.',
    'Sempre rodar npm.cmd run build antes de publicar. Para mudanças em index.html/public, conferir também se a miniatura e os ícones carregam pela URL pública.',
    'Sempre testar em desktop e mobile depois de alterar App.jsx ou App.css.',
    'Manter o mapa técnico atualizado quando criar página, botão, fluxo, tabela ou regra nova.',
    'Não apagar funções aparentemente antigas sem verificar se algum JSX ainda chama essas funções.',
    'Não substituir palavras globalmente no App.jsx; isso já causou riscos em fluxos técnicos.',
    'Ao entregar correções, preferir arquivo completo e passo a passo direto.',
    'Depois de alterações no sistema, atualizar também este mapa técnico vivo.',
  ],
  checklistPublicacao: [
    'Rodar npm.cmd run build.',
    'Rodar npm.cmd run dev e testar localmente.',
    'Testar login.',
    'Testar Painel.',
    'Testar menu mobile.',
    'Testar Aniversariantes e cartão.',
    'Testar Administração quando a alteração for administrativa.',
    'Conferir git status.',
    'Fazer commit.',
    'Fazer git push origin main.',
    'Aguardar Vercel publicar.',
    'Testar https://app.ebdfiel.com.br com atualização forçada.',
  ],
  promptParaOutraIA:
    'Você vai me ajudar no projeto EBD Fiel. Antes de sugerir código, leia o mapa técnico do sistema. O projeto é React + Vite + Supabase, publicado na Vercel em https://app.ebdfiel.com.br. O arquivo principal é src/App.jsx e o CSS principal é src/App.css. Não altere Supabase, RLS, policies, tabelas ou RPCs sem pedido explícito. Evite substituições globais automáticas. Sempre preserve login, cadastro, painel, chamada, administração, cartão de aniversário e menu mobile. Ao sugerir alterações, entregue arquivos completos ou instruções seguras, rode npm.cmd run build e atualize o mapa técnico quando houver mudança estrutural.',
}

function linhaMarkdown(texto = '') {
  return `${texto}\n`
}

function listaMarkdown(itens = []) {
  return itens.map((item) => `- ${item}`).join('\n')
}

function listaNumeradaMarkdown(itens = []) {
  return itens.map((item, indice) => `${indice + 1}. ${item}`).join('\n')
}

export function montarMapaTecnicoMarkdown(mapa = MAPA_TECNICO_SISTEMA) {
  let md = ''

  md += linhaMarkdown(`# ${mapa.titulo}`)
  md += linhaMarkdown()
  md += linhaMarkdown(`**Atualizado em:** ${mapa.atualizadoEm}`)
  md += linhaMarkdown(`**Versão do mapa:** ${mapa.versaoMapa}`)
  md += linhaMarkdown()
  md += linhaMarkdown(mapa.subtitulo)
  md += linhaMarkdown()
  md += linhaMarkdown('---')
  md += linhaMarkdown()
  md += linhaMarkdown('## 1. Identificação do projeto')
  md += linhaMarkdown()
  md += linhaMarkdown(`- **Nome:** ${mapa.projeto.nome}`)
  md += linhaMarkdown(`- **Domínio:** ${mapa.projeto.dominio}`)
  md += linhaMarkdown(`- **Repositório:** ${mapa.projeto.repositorio}`)
  md += linhaMarkdown(`- **Stack:** ${mapa.projeto.stack}`)
  md += linhaMarkdown(`- **Deploy:** ${mapa.projeto.deploy}`)
  md += linhaMarkdown(`- **Pasta local:** ${mapa.projeto.pastaLocal}`)
  md += linhaMarkdown(`- **Objetivo:** ${mapa.projeto.objetivo}`)
  md += linhaMarkdown()
  md += linhaMarkdown('## 2. Ambiente local')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.ambienteLocal))
  md += linhaMarkdown()
  md += linhaMarkdown('## 3. Comandos principais')
  md += linhaMarkdown()
  mapa.comandos.forEach((item) => {
    md += linhaMarkdown(`- \`${item.comando}\` — ${item.descricao}`)
  })
  md += linhaMarkdown()
  md += linhaMarkdown('## 4. Mapa de páginas e áreas')
  md += linhaMarkdown()
  mapa.paginas.forEach((grupo) => {
    md += linhaMarkdown(`### ${grupo.titulo}`)
    md += linhaMarkdown()
    md += linhaMarkdown(grupo.descricao)
    md += linhaMarkdown()
    grupo.itens.forEach((item) => {
      md += linhaMarkdown(`- **${item.nome}:** ${item.finalidade}`)
    })
    md += linhaMarkdown()
  })
  md += linhaMarkdown('## 5. Fluxos principais')
  md += linhaMarkdown()
  mapa.fluxos.forEach((fluxo) => {
    md += linhaMarkdown(`### ${fluxo.titulo}`)
    md += linhaMarkdown()
    md += linhaMarkdown(fluxo.descricao)
    md += linhaMarkdown()
    md += linhaMarkdown(listaNumeradaMarkdown(fluxo.passos))
    md += linhaMarkdown()
  })
  md += linhaMarkdown('## 6. Supabase, autenticação e banco')
  md += linhaMarkdown()
  md += linhaMarkdown(`- **Provedor:** ${mapa.bancoDados.provedor}`)
  md += linhaMarkdown(`- **Autenticação:** ${mapa.bancoDados.autenticacao}`)
  md += linhaMarkdown()
  md += linhaMarkdown('### Variáveis de ambiente')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.bancoDados.variaveisAmbiente.map((v) => `\`${v}\``)))
  md += linhaMarkdown()
  md += linhaMarkdown('### Tabelas citadas no sistema')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.bancoDados.tabelas.map((t) => `\`${t}\``)))
  md += linhaMarkdown()
  md += linhaMarkdown('### RPCs/funções citadas')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.bancoDados.rpcs.map((r) => `\`${r}\``)))
  md += linhaMarkdown()
  md += linhaMarkdown('### Cuidados com banco')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.bancoDados.cuidados))
  md += linhaMarkdown()
  md += linhaMarkdown('## 7. Arquivos principais')
  md += linhaMarkdown()
  mapa.arquivosPrincipais.forEach((arquivo) => {
    md += linhaMarkdown(`### \`${arquivo.caminho}\``)
    md += linhaMarkdown()
    md += linhaMarkdown(arquivo.descricao)
    md += linhaMarkdown()
    md += linhaMarkdown(listaMarkdown(arquivo.cuidados))
    md += linhaMarkdown()
  })
  md += linhaMarkdown('## 8. Perfis e permissões')
  md += linhaMarkdown()
  mapa.perfis.forEach((perfil) => {
    md += linhaMarkdown(`### ${perfil.nome}`)
    md += linhaMarkdown()
    md += linhaMarkdown(listaMarkdown(perfil.acessos))
    md += linhaMarkdown()
  })
  md += linhaMarkdown('## 9. Regras de ouro para outra IA')
  md += linhaMarkdown()
  md += linhaMarkdown(listaMarkdown(mapa.regrasDeOuro))
  md += linhaMarkdown()
  md += linhaMarkdown('## 10. Checklist de publicação')
  md += linhaMarkdown()
  md += linhaMarkdown(listaNumeradaMarkdown(mapa.checklistPublicacao))
  md += linhaMarkdown()
  md += linhaMarkdown('## 11. Prompt pronto para outra IA')
  md += linhaMarkdown()
  md += linhaMarkdown('```txt')
  md += linhaMarkdown(mapa.promptParaOutraIA)
  md += linhaMarkdown('```')

  return md
}

export function montarMapaTecnicoTexto(mapa = MAPA_TECNICO_SISTEMA) {
  return montarMapaTecnicoMarkdown(mapa)
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
}

// Atualização visual v2 (28/06/2026): refinamento da página pública e login desktop/mobile sem alteração de funcionamento.
