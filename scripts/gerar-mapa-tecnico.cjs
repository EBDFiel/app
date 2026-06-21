#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

function formatarDataHoraBrasil(data = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(data)
}

function lerJsonSeguro(caminho) {
  try {
    return JSON.parse(fs.readFileSync(caminho, 'utf8'))
  } catch {
    return null
  }
}

function extrairListaConstanteApp(appTexto, nomeConstante) {
  const regex = new RegExp(`const\\s+${nomeConstante}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*`, 'm')
  const encontrado = appTexto.match(regex)

  if (!encontrado) {
    return []
  }

  return Array.from(encontrado[1].matchAll(/['"]([^'"]+)['"]/g)).map((item) => item[1])
}

function extrairItensMenu(appTexto) {
  const trechoMenu = appTexto.match(/const\s+menu\s*=\s*\[([\s\S]*?)\]\s*\n\s*useEffect/)
  if (!trechoMenu) {
    return []
  }

  const itens = []
  const regexItem = /\{\s*id:\s*['"]([^'"]+)['"],\s*nome:\s*['"]([^'"]+)['"]/g
  let encontrado

  while ((encontrado = regexItem.exec(trechoMenu[1])) !== null) {
    itens.push(`${encontrado[2]} (${encontrado[1]})`)
  }

  return itens
}

;(async () => {
  const raiz = process.cwd()
  const caminhoData = path.join(raiz, 'src', 'data', 'mapaTecnicoSistema.js')
  const caminhoPackage = path.join(raiz, 'package.json')
  const caminhoApp = path.join(raiz, 'src', 'App.jsx')
  const pastaDocs = path.join(raiz, 'public', 'docs')

  if (!fs.existsSync(caminhoData)) {
    throw new Error('Arquivo src/data/mapaTecnicoSistema.js não encontrado.')
  }

  fs.mkdirSync(pastaDocs, { recursive: true })

  const moduloMapa = await import(pathToFileURL(caminhoData).href)
  const packageJson = lerJsonSeguro(caminhoPackage) || {}
  const appTexto = fs.existsSync(caminhoApp) ? fs.readFileSync(caminhoApp, 'utf8') : ''

  const paginasSistema = extrairListaConstanteApp(appTexto, 'PAGINAS_SISTEMA')
  const itensMenu = extrairItensMenu(appTexto)
  const dataGeracao = formatarDataHoraBrasil()

  let markdown = moduloMapa.montarMapaTecnicoMarkdown()

  markdown += '\n\n---\n\n'
  markdown += '## 12. Informações geradas automaticamente no build\n\n'
  markdown += `- **Gerado em:** ${dataGeracao}\n`
  markdown += `- **Nome do package:** ${packageJson.name || 'não identificado'}\n`
  markdown += `- **Versão do package:** ${packageJson.version || 'não informada'}\n`
  markdown += `- **Tipo do projeto:** ${packageJson.type || 'não informado'}\n\n`

  markdown += '### Scripts do package.json\n\n'
  Object.entries(packageJson.scripts || {}).forEach(([nome, comando]) => {
    markdown += `- \`${nome}\`: \`${comando}\`\n`
  })

  markdown += '\n### Dependências principais\n\n'
  Object.entries(packageJson.dependencies || {}).forEach(([nome, versao]) => {
    markdown += `- \`${nome}\`: \`${versao}\`\n`
  })

  markdown += '\n### Páginas internas extraídas do App.jsx\n\n'
  if (paginasSistema.length > 0) {
    paginasSistema.forEach((pagina) => {
      markdown += `- \`${pagina}\`\n`
    })
  } else {
    markdown += '- Não foi possível extrair PAGINAS_SISTEMA automaticamente.\n'
  }

  markdown += '\n### Itens do menu extraídos do App.jsx\n\n'
  if (itensMenu.length > 0) {
    itensMenu.forEach((item) => {
      markdown += `- ${item}\n`
    })
  } else {
    markdown += '- Não foi possível extrair os itens do menu automaticamente.\n'
  }

  markdown += '\n### Observação\n\n'
  markdown += 'Este arquivo é recriado automaticamente antes do build por `scripts/gerar-mapa-tecnico.cjs`. '
  markdown += 'Para manter o conteúdo fiel ao sistema, atualize `src/data/mapaTecnicoSistema.js` sempre que criar telas, fluxos, tabelas, permissões ou comportamentos importantes.\n'

  const texto = markdown
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')

  fs.writeFileSync(path.join(pastaDocs, 'mapa-tecnico-ebd-fiel.md'), markdown, 'utf8')
  fs.writeFileSync(path.join(pastaDocs, 'mapa-tecnico-ebd-fiel.txt'), texto, 'utf8')

  console.log(`Mapa técnico gerado em public/docs em ${dataGeracao}.`)
})().catch((error) => {
  console.error('Erro ao gerar mapa técnico do EBD Fiel:', error)
  process.exit(1)
})
