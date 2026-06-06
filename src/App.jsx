import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './App.css'
import { supabase } from './lib/supabase'

const classesIniciais = [
  { id: 1, nome: 'Jovens', professor: 'Ev. Lucas' },
  { id: 2, nome: 'Adultos', professor: 'Pr. Carlos' },
  { id: 3, nome: 'Crianças', professor: 'Irmã Ana' },
]

const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
]


const alunosIniciais = [
  { id: 1, nome: 'Pedro Silva', classeId: 1, telefone: '(11) 99999-0000', dataNascimento: '', tipoPessoa: 'aluno' },
  { id: 2, nome: 'Maria Souza', classeId: 2, telefone: '', dataNascimento: '', tipoPessoa: 'aluno' },
  { id: 3, nome: 'João Santos', classeId: 3, telefone: '(11) 98888-1111', dataNascimento: '', tipoPessoa: 'aluno' },
]


function Icone({ nome, className = '' }) {
  const comum = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    className,
  }

  switch (nome) {
    case 'igreja':
      return (
        <svg {...comum}>
          <path d="M12 3l2.2 3.2L18 8v11H6V8l3.8-1.8L12 3Z" />
          <path d="M12 7v12" />
          <path d="M9.5 10.5h5" />
          <path d="M10 19v-3a2 2 0 0 1 4 0v3" />
        </svg>
      )
    case 'painel':
      return (
        <svg {...comum}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      )
    case 'inicio':
      return (
        <svg {...comum}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10.5V20h13v-9.5" />
          <path d="M9.5 20v-5.2a2.5 2.5 0 0 1 5 0V20" />
        </svg>
      )
    case 'classes':
      return (
        <svg {...comum}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5v-14Z" />
          <path d="M6.5 4A2.5 2.5 0 0 0 4 6.5V20" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
        </svg>
      )
    case 'alunos':
      return (
        <svg {...comum}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3.5" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M14.5 3.2a3.5 3.5 0 0 1 0 6.6" />
        </svg>
      )
    case 'chamada':
      return (
        <svg {...comum}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h3" />
          <path d="m14 15 1.5 1.5L18 13" />
        </svg>
      )
    case 'relatorios':
      return (
        <svg {...comum}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      )
    case 'configuracoes':
      return (
        <svg {...comum}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-1 1 1 0 0 0-1 .2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7 1 1 1 0 0 0 1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1V9c0 .4.2.8.6.9h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.7Z" />
        </svg>
      )
    case 'sair':
      return (
        <svg {...comum}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      )
    case 'usuarios':
      return (
        <svg {...comum}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0" />
          <path d="M16 8h5" />
          <path d="M18.5 5.5v5" />
        </svg>
      )
    case 'biblia':
      return (
        <svg {...comum}>
          <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H20v17H8.5A2.5 2.5 0 0 0 6 21.5v-17Z" />
          <path d="M8.5 2A2.5 2.5 0 0 0 6 4.5V22" />
          <path d="M13 6v6" />
          <path d="M10 9h6" />
        </svg>
      )
    case 'check':
      return (
        <svg {...comum}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      )
    default:
      return (
        <svg {...comum}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

function CardResumo({ icone, titulo, valor, descricao, destaque = false }) {
  return (
    <div className={`card card-estatistica${destaque ? ' destaque' : ''}`}>
      <div className="card-icone">
        <Icone nome={icone} className="icone-svg" />
      </div>
      <div className="card-conteudo">
        <span className="card-titulo">{titulo}</span>
        <strong className="card-valor">{valor}</strong>
        <p>{descricao}</p>
      </div>
    </div>
  )
}


function iniciarCorrecaoGlobalDeAcentos() {
  if (typeof window === 'undefined' || window.__ebdFielCorretorAcentosAtivo) {
    return
  }

  window.__ebdFielCorretorAcentosAtivo = true

  const c = (...codigos) => String.fromCharCode(...codigos)

  const pares = [
    [c(0x00C3, 0x0081), c(0x00C1)],
    [c(0x00C3, 0x0080), c(0x00C0)],
    [c(0x00C3, 0x0082), c(0x00C2)],
    [c(0x00C3, 0x0083), c(0x00C3)],
    [c(0x00C3, 0x0089), c(0x00C9)],
    [c(0x00C3, 0x008A), c(0x00CA)],
    [c(0x00C3, 0x008D), c(0x00CD)],
    [c(0x00C3, 0x0093), c(0x00D3)],
    [c(0x00C3, 0x0094), c(0x00D4)],
    [c(0x00C3, 0x0095), c(0x00D5)],
    [c(0x00C3, 0x009A), c(0x00DA)],
    [c(0x00C3, 0x0087), c(0x00C7)],
    [c(0x00C3, 0x00A1), c(0x00E1)],
    [c(0x00C3, 0x00A0), c(0x00E0)],
    [c(0x00C3, 0x00A2), c(0x00E2)],
    [c(0x00C3, 0x00A3), c(0x00E3)],
    [c(0x00C3, 0x00A9), c(0x00E9)],
    [c(0x00C3, 0x00AA), c(0x00EA)],
    [c(0x00C3, 0x00AD), c(0x00ED)],
    [c(0x00C3, 0x00B3), c(0x00F3)],
    [c(0x00C3, 0x00B4), c(0x00F4)],
    [c(0x00C3, 0x00B5), c(0x00F5)],
    [c(0x00C3, 0x00BA), c(0x00FA)],
    [c(0x00C3, 0x00A7), c(0x00E7)],
    [c(0x00C2, 0x00BA), c(0x00BA)],
    [c(0x00C2, 0x00AA), c(0x00AA)],
    [c(0x00C2, 0x00B7), c(0x00B7)],
    [c(0x00C2), ''],
    [c(0x00E2, 0x0086, 0x0092), c(0x2192)],
    [c(0x00E2, 0x009C, 0x0093), c(0x2713)],
    [c(0x00E2, 0x0080, 0x00A2), c(0x2022)],
  ]

  const palavras = [
    ['B' + c(0x00C3, 0x00AD) + 'blica', 'B' + c(0x00ED) + 'blica'],
    ['Gest' + c(0x00C3, 0x00A3) + 'o', 'Gest' + c(0x00E3) + 'o'],
    ['Administra' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00A3) + 'o', 'Administra' + c(0x00E7) + c(0x00E3) + 'o'],
    ['Configura' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00B5) + 'es', 'Configura' + c(0x00E7) + c(0x00F5) + 'es'],
    ['Relat' + c(0x00C3, 0x00B3) + 'rios', 'Relat' + c(0x00F3) + 'rios'],
    ['usu' + c(0x00C3, 0x00A1) + 'rios', 'usu' + c(0x00E1) + 'rios'],
    ['usu' + c(0x00C3, 0x00A1) + 'rio', 'usu' + c(0x00E1) + 'rio'],
    ['aprova' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00A3) + 'o', 'aprova' + c(0x00E7) + c(0x00E3) + 'o'],
    ['recupera' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00A3) + 'o', 'recupera' + c(0x00E7) + c(0x00E3) + 'o'],
    ['congrega' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00B5) + 'es', 'congrega' + c(0x00E7) + c(0x00F5) + 'es'],
    ['congrega' + c(0x00C3, 0x00A7) + c(0x00C3, 0x00A3) + 'o', 'congrega' + c(0x00E7) + c(0x00E3) + 'o'],
    ['respons' + c(0x00C3, 0x00A1) + 'vel', 'respons' + c(0x00E1) + 'vel'],
    ['Voc' + c(0x00C3, 0x00AA), 'Voc' + c(0x00EA)],
    ['voc' + c(0x00C3, 0x00AA), 'voc' + c(0x00EA)],
    ['c' + c(0x00C3, 0x00B3) + 'digo', 'c' + c(0x00F3) + 'digo'],
    ['j' + c(0x00C3, 0x00A1), 'j' + c(0x00E1)],
    ['J' + c(0x00C3, 0x00A1), 'J' + c(0x00E1)],
  ]

  function corrigir(texto) {
    if (!texto || typeof texto !== 'string') {
      return texto
    }

    let novo = texto

    pares.forEach(([errado, certo]) => {
      novo = novo.split(errado).join(certo)
    })

    palavras.forEach(([errado, certo]) => {
      novo = novo.split(errado).join(certo)
    })

    return novo
  }

  function varrer() {
    if (!document.body) {
      return
    }

    const walker = document.createTreeWalker(document.body, 4)
    const nodes = []

    while (walker.nextNode()) {
      nodes.push(walker.currentNode)
    }

    nodes.forEach((node) => {
      const novo = corrigir(node.nodeValue)
      if (novo !== node.nodeValue) {
        node.nodeValue = novo
      }
    })

    document.querySelectorAll('input, textarea').forEach((campo) => {
      if (campo.placeholder) {
        campo.placeholder = corrigir(campo.placeholder)
      }
    })

    document.querySelectorAll('[title], [aria-label], [alt]').forEach((elemento) => {
      ;['title', 'aria-label', 'alt'].forEach((atributo) => {
        const valor = elemento.getAttribute(atributo)
        if (valor) {
          const novo = corrigir(valor)
          if (novo !== valor) {
            elemento.setAttribute(atributo, novo)
          }
        }
      })
    })
  }

  window.setInterval(varrer, 250)
  window.addEventListener('load', varrer)
  window.requestAnimationFrame(varrer)
}

iniciarCorrecaoGlobalDeAcentos()

const CHAVE_PAGINA_ATUAL = 'ebdfiel_pagina_atual'
const CHAVE_SUPORTE_ADMIN = 'ebdfiel_igreja_suporte_admin'

const PAGINAS_SISTEMA = [
  'painel',
  'dashboard',
  'classes',
  'alunos',
  'professores',
  'usuarios',
  'chamada',
  'relatorios',
  'historico',
  'financeiro',
  'backup',
  'manual',
  'configuracoes',
  'administracao',
]

function lerPaginaAtualSalva() {
  if (typeof window === 'undefined') {
    return 'painel'
  }

  const paginaSalva = window.localStorage.getItem(CHAVE_PAGINA_ATUAL)

  return PAGINAS_SISTEMA.includes(paginaSalva) ? paginaSalva : 'painel'
}

function salvarPaginaAtualSalva(paginaId) {
  if (typeof window === 'undefined' || !PAGINAS_SISTEMA.includes(paginaId)) {
    return
  }

  try {
    window.localStorage.setItem(CHAVE_PAGINA_ATUAL, paginaId)
  } catch (error) {
    console.error('Erro ao salvar página atual:', error)
  }
}

function lerIgrejaSuporteAdminSalva() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const igrejaSalva = JSON.parse(window.localStorage.getItem(CHAVE_SUPORTE_ADMIN) || 'null')
    const igrejaId = Number(igrejaSalva?.id)

    if (!igrejaId) {
      return null
    }

    return {
      id: igrejaId,
      nome_igreja: igrejaSalva.nome_igreja || igrejaSalva.nome || 'Igreja',
      congregacao: igrejaSalva.congregacao || '',
      status_piloto: igrejaSalva.status_piloto || '',
      cidade: igrejaSalva.cidade || '',
      estado: igrejaSalva.estado || '',
    }
  } catch (error) {
    console.error('Erro ao recuperar igreja de suporte:', error)
    window.localStorage.removeItem(CHAVE_SUPORTE_ADMIN)
    return null
  }
}

function salvarIgrejaSuporteAdminSalva(igreja) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!igreja?.id) {
      window.localStorage.removeItem(CHAVE_SUPORTE_ADMIN)
      return
    }

    window.localStorage.setItem(CHAVE_SUPORTE_ADMIN, JSON.stringify(igreja))
  } catch (error) {
    console.error('Erro ao salvar igreja de suporte:', error)
  }
}

function removerIgrejaSuporteAdminSalva() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(CHAVE_SUPORTE_ADMIN)
}

function App() {
  const [paginaAtual, setPaginaAtual] = useState(() => lerPaginaAtualSalva())
  const [carregando, setCarregando] = useState(true)
  const [erroSistema, setErroSistema] = useState('')
  const [alertaPainelFechado, setAlertaPainelFechado] = useState(false)
  const [relatorioExtraVisualizacao, setRelatorioExtraVisualizacao] = useState(null)

  const [sessao, setSessao] = useState(null)
  const [verificandoSessao, setVerificandoSessao] = useState(true)
  const [diagnosticoCarregamento, setDiagnosticoCarregamento] = useState(null)
  const [carregandoDiagnostico, setCarregandoDiagnostico] = useState(false)
  const [mensagemDiagnosticoAdmin, setMensagemDiagnosticoAdmin] = useState(null)
  const [mensagemHistoricoChamadas, setMensagemHistoricoChamadas] = useState(null)
  const [excluindoChamadaId, setExcluindoChamadaId] = useState(null)
  const [dataHistoricoChamadasSelecionada, setDataHistoricoChamadasSelecionada] = useState('')
  const [tipoHistoricoChamadasSelecionado, setTipoHistoricoChamadasSelecionado] = useState('todos')
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [carregandoRecuperacao, setCarregandoRecuperacao] = useState(false)
  const [mensagemRecuperacao, setMensagemRecuperacao] = useState('')
  const [erroRecuperacao, setErroRecuperacao] = useState('')
  const [novaSenhaRecuperacao, setNovaSenhaRecuperacao] = useState('')
  const [confirmarNovaSenhaRecuperacao, setConfirmarNovaSenhaRecuperacao] = useState('')
  const [carregandoNovaSenha, setCarregandoNovaSenha] = useState(false)
  const [erroNovaSenha, setErroNovaSenha] = useState('')
  const codigoPilotoOficial = 'EBDFIEL2026'
  const [carregandoCadastroPiloto, setCarregandoCadastroPiloto] = useState(false)
  const [erroCadastroPiloto, setErroCadastroPiloto] = useState('')
  const [sucessoCadastroPiloto, setSucessoCadastroPiloto] = useState('')
  const [ultimoCadastroPilotoEnviado, setUltimoCadastroPilotoEnviado] = useState({
    nomeIgreja: '',
    responsavel: '',
    email: '',
  })
  const [cadastroPiloto, setCadastroPiloto] = useState({
    nomeResponsavel: '',
    cargoResponsavel: 'secretario',
    email: '',
    senha: '',
    confirmarSenha: '',
    codigoPiloto: '',
    nomeIgreja: '',
    tipoIgreja: 'congregacao',
    congregacao: '',
    sedeFiliadaNome: '',
    sedeFiliadaEndereco: '',
    sedeFiliadaNumero: '',
    sedeFiliadaComplemento: '',
    sedeFiliadaCep: '',
    pastorDirigente: '',
    telefoneDdd: '',
    telefoneNumero: '',
    telefone: '',
    cidade: '',
    estado: '',
    bairro: '',
    endereco: '',
    numeroEndereco: '',
    complementoEndereco: '',
    cep: '',
  })
  const [carregandoLogin, setCarregandoLogin] = useState(false)
  const [erroLogin, setErroLogin] = useState('')
  const [telaPublica, setTelaPublica] = useState('landing')
  const [menuPublicoAberto, setMenuPublicoAberto] = useState(false)
  const [menuInternoAberto, setMenuInternoAberto] = useState(false)

  const [classes, setClasses] = useState([])
  const [alunos, setAlunos] = useState([])
  const [chamadasSalvas, setChamadasSalvas] = useState([])
  const [chamadasProfessores, setChamadasProfessores] = useState([])
  const [igrejaAtualPiloto, setIgrejaAtualPiloto] = useState(null)
  const [feedbackPiloto, setFeedbackPiloto] = useState({
    tipo: 'sugestao',
    mensagem: '',
  })
  const [janelaAniversariantesAberta, setJanelaAniversariantesAberta] = useState(false)
  const [aniversarianteCartaoId, setAniversarianteCartaoId] = useState(null)
  const [formularioSugestaoAberto, setFormularioSugestaoAberto] = useState(false)
  const [feedbacksIgreja, setFeedbacksIgreja] = useState([])
  const [feedbacksAdmin, setFeedbacksAdmin] = useState([])
  const [feedbackRespondendoId, setFeedbackRespondendoId] = useState(null)
  const [respostaFeedbackAdmin, setRespostaFeedbackAdmin] = useState('')
  const [enviandoRespostaFeedback, setEnviandoRespostaFeedback] = useState(false)
  const [carregandoFeedback, setCarregandoFeedback] = useState(false)
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [perfisIgreja, setPerfisIgreja] = useState([])
  const [vinculosProfessores, setVinculosProfessores] = useState([])
  const [igrejaId, setIgrejaId] = useState(null)
  const [igrejaSuporteAdmin, setIgrejaSuporteAdmin] = useState(() => lerIgrejaSuporteAdminSalva())
  const sessaoRef = useRef(sessao)
  const perfilUsuarioRef = useRef(perfilUsuario)
  const igrejaSuporteAdminRef = useRef(igrejaSuporteAdmin)
  const paginaAtualRef = useRef(paginaAtual)
  const aniversariantesSemanaRef = useRef(null)
  const cartaoAniversarioRef = useRef(null)
  const usuarioCarregadoRef = useRef(null)
  const carregamentoDadosEmAndamentoRef = useRef(false)
  const suporteAdminEmTransicaoRef = useRef(false)

  function definirSessao(sessaoNova) {
    sessaoRef.current = sessaoNova
    setSessao(sessaoNova)
  }

  function definirPerfilUsuario(valorOuAtualizador) {
    const perfilAtualizado =
      typeof valorOuAtualizador === 'function'
        ? valorOuAtualizador(perfilUsuarioRef.current)
        : valorOuAtualizador

    perfilUsuarioRef.current = perfilAtualizado
    setPerfilUsuario(perfilAtualizado)
  }

  function definirIgrejaSuporteAdmin(igreja) {
    igrejaSuporteAdminRef.current = igreja || null
    setIgrejaSuporteAdmin(igreja || null)

    if (igreja?.id) {
      salvarIgrejaSuporteAdminSalva(igreja)
    } else {
      removerIgrejaSuporteAdminSalva()
    }
  }

  function definirPaginaAtual(paginaId) {
    const paginaSegura = PAGINAS_SISTEMA.includes(paginaId) ? paginaId : 'painel'

    paginaAtualRef.current = paginaSegura
    setPaginaAtual(paginaSegura)
    salvarPaginaAtualSalva(paginaSegura)
  }

  function normalizarIgrejaSuporteAdmin(igreja) {
    const igrejaIdSuporte = Number(igreja?.id)

    if (!igrejaIdSuporte) {
      return null
    }

    return {
      id: igrejaIdSuporte,
      nome_igreja: igreja.nome_igreja || igreja.nome || 'Igreja',
      congregacao: igreja.congregacao || '',
      status_piloto: igreja.status_piloto || '',
      cidade: igreja.cidade || '',
      estado: igreja.estado || '',
    }
  }

  function montarPerfilSuporteAdmin(igreja, sessaoAtual) {
    const igrejaNormalizada = normalizarIgrejaSuporteAdmin(igreja)
    const perfilAnterior = perfilUsuarioRef.current || perfilUsuario || {}
    const emailSessaoAtual = String(
      sessaoAtual?.user?.email || perfilAnterior?.email || ''
    ).toLowerCase()

    return {
      ...perfilAnterior,
      id: perfilAnterior?.id || null,
      user_id: sessaoAtual?.user?.id || perfilAnterior?.user_id || null,
      nome: perfilAnterior?.nome || 'Administrador do sistema',
      email: emailSessaoAtual,
      perfil: 'secretaria',
      igreja_id: Number(igrejaNormalizada?.id || 0) || null,
      classe_id: null,
      modo_suporte_admin: true,
    }
  }

  function manterContextoSuporteAdmin(igreja, sessaoAtual, opcoes = {}) {
    const igrejaNormalizada = normalizarIgrejaSuporteAdmin(igreja)

    if (!igrejaNormalizada?.id) {
      return null
    }

    definirIgrejaSuporteAdmin(igrejaNormalizada)
    setIgrejaId(Number(igrejaNormalizada.id))
    definirPerfilUsuario(montarPerfilSuporteAdmin(igrejaNormalizada, sessaoAtual))

    setIgrejaAtualPiloto((igrejaAtual) => {
      if (Number(igrejaAtual?.id) === Number(igrejaNormalizada.id)) {
        return igrejaAtual
      }

      return {
        ...igrejaAtual,
        ...igrejaNormalizada,
      }
    })

    if (opcoes?.forcarPainel || paginaAtualRef.current === 'administracao') {
      definirPaginaAtual('painel')
    }

    return igrejaNormalizada
  }

  function recuperarContextoSuporteAdminAtual() {
    const igrejaAtual = igrejaSuporteAdminRef.current || igrejaSuporteAdmin

    if (igrejaAtual?.id) {
      return normalizarIgrejaSuporteAdmin(igrejaAtual)
    }

    return lerIgrejaSuporteAdminSalva()
  }

  function eventoAuthMesmaSessaoJaCarregada(event, session) {
    if (!['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED'].includes(event)) {
      return false
    }

    const userIdEvento = session?.user?.id || null

    return Boolean(
      userIdEvento &&
        perfilUsuarioRef.current &&
        (suporteAdminEmTransicaoRef.current ||
          (usuarioCarregadoRef.current && userIdEvento === usuarioCarregadoRef.current))
    )
  }

  const [igrejasAdmin, setIgrejasAdmin] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const igrejasSalvas = JSON.parse(
        window.localStorage.getItem('ebdfiel_igrejas_admin_cache') || '[]'
      )

      return Array.isArray(igrejasSalvas) ? igrejasSalvas : []
    } catch {
      return []
    }
  })
  const [acessosAdmin, setAcessosAdmin] = useState([])
  const [cadastrosIncompletosAdmin, setCadastrosIncompletosAdmin] = useState([])
  const [carregandoCadastrosIncompletosAdmin, setCarregandoCadastrosIncompletosAdmin] = useState(false)
  const [erroCadastrosIncompletosAdmin, setErroCadastrosIncompletosAdmin] = useState('')
  const [buscaAcessoAdmin, setBuscaAcessoAdmin] = useState('')
  const [mostrarFormularioAcessoAdmin, setMostrarFormularioAcessoAdmin] = useState(false)
  const [acessoAdminEditandoUserId, setAcessoAdminEditandoUserId] = useState(null)
  const [novoAcessoAdmin, setNovoAcessoAdmin] = useState({
    userId: '',
    nome: '',
    email: '',
    perfil: 'secretaria',
    igrejaId: '',
    classeId: '',
    dataNascimento: '',
  })
  const [mostrarFormularioIgrejaAdmin, setMostrarFormularioIgrejaAdmin] = useState(false)
  const [igrejaAdminEditandoId, setIgrejaAdminEditandoId] = useState(null)
  const [buscaIgrejaAdmin, setBuscaIgrejaAdmin] = useState('')
  const [abaAdministracao, setAbaAdministracao] = useState('visao')
  const [igrejaUsuariosAbertaId, setIgrejaUsuariosAbertaId] = useState(null)
  const [novaIgrejaAdmin, setNovaIgrejaAdmin] = useState({
    nome_igreja: '',
    congregacao: '',
    pastor_dirigente: '',
    superintendente_ebd: '',
    cidade: '',
    estado: '',
    bairro: '',
    endereco: '',
    numero_endereco: '',
    complemento_endereco: '',
    cep: '',
    tipo_igreja: 'congregacao',
    sede_filiada_nome: '',
    sede_filiada_endereco: '',
    sede_filiada_numero: '',
    sede_filiada_complemento: '',
    sede_filiada_cep: '',
    telefone: '',
    email: '',
    status_piloto: 'teste',
    responsavel_nome: '',
    responsavel_email: '',
    responsavel_whatsapp: '',
    observacoes_piloto: '',
    data_inicio_piloto: '',
    data_fim_piloto: '',
    limite_usuarios: 10,
  })
  const [configuracaoIgreja, setConfiguracaoIgreja] = useState({
    id: null,
    nome_igreja: '',
    congregacao: '',
    pastor_dirigente: '',
    cidade: '',
    estado: '',
    bairro: '',
    endereco: '',
    telefone: '',
    email: '',
  })
  const [salvandoConfiguracaoIgreja, setSalvandoConfiguracaoIgreja] = useState(false)
  const [mostrarFormularioPerfil, setMostrarFormularioPerfil] = useState(false)
  const [perfilEditandoId, setPerfilEditandoId] = useState(null)
  const [novoPerfil, setNovoPerfil] = useState({
    userId: '',
    nome: '',
    email: '',
    perfil: 'professor',
    classeIds: [],
    dataNascimento: '',
  })



  const [mostrarFormularioClasse, setMostrarFormularioClasse] = useState(false)
  const [classeEditandoId, setClasseEditandoId] = useState(null)
  const [novaClasse, setNovaClasse] = useState({
    nome: '',
    professor: '',
  })
  const [classeAlunosAbertaId, setClasseAlunosAbertaId] = useState(null)

  const [mostrarFormularioAluno, setMostrarFormularioAluno] = useState(false)
  const [alunoEditandoId, setAlunoEditandoId] = useState(null)
  const [salvandoAluno, setSalvandoAluno] = useState(false)
  const [novoAluno, setNovoAluno] = useState({
    nome: '',
    classeId: '',
    telefone: '',
    dataNascimento: '',
    tipoPessoa: 'aluno',
  })

  const [buscaAluno, setBuscaAluno] = useState('')
  const [filtroClasseAluno, setFiltroClasseAluno] = useState('')
  const [alunoHistoricoSelecionadoId, setAlunoHistoricoSelecionadoId] = useState('')
  const [classeHistoricoFiltroId, setClasseHistoricoFiltroId] = useState('')

  const [tipoChamada, setTipoChamada] = useState('alunos')
  const [classeChamadaId, setClasseChamadaId] = useState('')
  const [dataAulaChamada, setDataAulaChamada] = useState(() => new Date().toISOString().slice(0, 10))
  const [presencas, setPresencas] = useState({})
  const [mensagemChamada, setMensagemChamada] = useState(null)
  const [presencasProfessores, setPresencasProfessores] = useState({})
  const [observacoesChamadaProfessores, setObservacoesChamadaProfessores] = useState('')
  const [dadosExtrasChamada, setDadosExtrasChamada] = useState({
    visitantes: '',
    biblias: '',
    revistas: '',
    ofertas: '',
  })

  useEffect(() => {
    if (!mensagemChamada || mensagemChamada.tipo !== 'sucesso') {
      return undefined
    }

    const temporizadorMensagemChamada = window.setTimeout(() => {
      setMensagemChamada(null)
    }, 5200)

    return () => window.clearTimeout(temporizadorMensagemChamada)
  }, [mensagemChamada])

  useEffect(() => {
    if (!mensagemDiagnosticoAdmin || mensagemDiagnosticoAdmin.tipo !== 'sucesso') {
      return undefined
    }

    const temporizadorMensagemDiagnostico = window.setTimeout(() => {
      setMensagemDiagnosticoAdmin(null)
    }, 4800)

    return () => window.clearTimeout(temporizadorMensagemDiagnostico)
  }, [mensagemDiagnosticoAdmin])

  useEffect(() => {
    if (!mensagemHistoricoChamadas || mensagemHistoricoChamadas.tipo !== 'sucesso') {
      return undefined
    }

    const temporizadorMensagemHistorico = window.setTimeout(() => {
      setMensagemHistoricoChamadas(null)
    }, 5200)

    return () => window.clearTimeout(temporizadorMensagemHistorico)
  }, [mensagemHistoricoChamadas])

  const menu = [
    { id: 'painel', nome: 'Painel', icone: 'inicio' },
    { id: 'dashboard', nome: 'Resumo geral', icone: 'painel' },
    { id: 'classes', nome: 'Classes', icone: 'classes', apenasSecretaria: true },
    { id: 'alunos', nome: 'Alunos', icone: 'alunos' },
    { id: 'professores', nome: 'Professores', icone: 'usuarios', apenasSecretaria: true },
    { id: 'usuarios', nome: 'Usuários', icone: 'usuarios', apenasSecretaria: true },
    { id: 'chamada', nome: 'Chamada', icone: 'chamada' },
    { id: 'relatorios', nome: 'Relatórios', icone: 'relatorios' },
    { id: 'historico', nome: 'Histórico do aluno', icone: 'alunos' },
    { id: 'financeiro', nome: 'Financeiro', icone: 'relatorios', apenasSecretaria: true },
    { id: 'backup', nome: 'Segurança e auditoria', icone: 'configuracoes', apenasSecretaria: true },
    { id: 'manual', nome: 'Manual do usuário', icone: 'relatorios' },
    {
      id: 'configuracoes',
      nome: 'Configurações',
      icone: 'configuracoes',
      apenasSecretaria: true,
    },
    {
      id: 'administracao',
      nome: 'Administração',
      icone: 'configuracoes',
      apenasAdminSistema: true,
    },
  ]

  useEffect(() => {
    sessaoRef.current = sessao
  }, [sessao])

  useEffect(() => {
    perfilUsuarioRef.current = perfilUsuario
  }, [perfilUsuario])

  useEffect(() => {
    igrejaSuporteAdminRef.current = igrejaSuporteAdmin
  }, [igrejaSuporteAdmin])

  useEffect(() => {
    paginaAtualRef.current = paginaAtual
    salvarPaginaAtualSalva(paginaAtual)
  }, [paginaAtual])

  useEffect(() => {
    iniciarCorrecaoGlobalDeAcentos()

    iniciarAutenticacao()

    const destravarVerificacaoInicial = window.setTimeout(() => {
      setVerificandoSessao(false)
      setCarregando(false)
    }, 6000)

    function restaurarSuporteAoVoltarParaAba() {
      const sessaoAtual = sessaoRef.current
      const igrejaSuporteSalva = recuperarContextoSuporteAdminAtual()
      const emailSessaoAtual = String(sessaoAtual?.user?.email || '').toLowerCase()

      if (!igrejaSuporteSalva?.id || !emailsAdminSistema.includes(emailSessaoAtual)) {
        return
      }

      manterContextoSuporteAdmin(igrejaSuporteSalva, sessaoAtual, {
        forcarPainel: paginaAtualRef.current === 'administracao',
      })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Importante: o callback do Supabase Auth não deve aguardar consultas ao Supabase.
      // Depois do F5, chamadas assíncronas com await dentro deste callback podem prender
      // a restauração da sessão e deixar o app com dados zerados. Por isso, quando
      // precisamos carregar dados, agendamos para depois do callback terminar.
      if (typeof window !== 'undefined' && window.__ebdFielSaindoDoSistema) {
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (typeof window !== 'undefined' && window.__ebdFielCadastroEmAndamento) {
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (event === 'PASSWORD_RECOVERY') {
        definirSessao(session)
        setTelaPublica('novaSenha')
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (event === 'SIGNED_OUT') {
        usuarioCarregadoRef.current = null
        definirSessao(null)
        limparDadosDoSistema()
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (!session) {
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      const deveManterEstadoAtual = eventoAuthMesmaSessaoJaCarregada(event, session)
      const igrejaSuporteSalva = recuperarContextoSuporteAdminAtual()

      definirSessao(session)
      setVerificandoSessao(false)

      if (deveManterEstadoAtual) {
        if (igrejaSuporteSalva?.id) {
          manterContextoSuporteAdmin(igrejaSuporteSalva, session, {
            forcarPainel: paginaAtualRef.current === 'administracao',
          })
        }

        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (event === 'TOKEN_REFRESHED') {
        if (igrejaSuporteSalva?.id) {
          manterContextoSuporteAdmin(igrejaSuporteSalva, session, {
            forcarPainel: paginaAtualRef.current === 'administracao',
          })
        }

        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      // A sessão inicial após F5 é carregada por iniciarAutenticacao().
      // Não carregamos dados aqui para evitar corrida/lock com getSession().
      if (event === 'INITIAL_SESSION') {
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setCarregando(true)

        window.setTimeout(() => {
          carregarDadosOnline(session, igrejaSuporteSalva)
            .catch((erroCarregamentoSessao) => {
              console.error('Erro ao validar sessão:', erroCarregamentoSessao)
              setErroSistema(
                erroCarregamentoSessao?.message ||
                  'Não foi possível validar sua sessão.'
              )
            })
            .finally(() => {
              setCarregando(false)
              setVerificandoSessao(false)
            })
        }, 0)

        return
      }

      setCarregando(false)
      setVerificandoSessao(false)
    })

    const restaurarAoFocar = () => restaurarSuporteAoVoltarParaAba()
    const restaurarAoFicarVisivel = () => {
      if (document.visibilityState === 'visible') {
        restaurarSuporteAoVoltarParaAba()
      }
    }

    window.addEventListener('focus', restaurarAoFocar)
    document.addEventListener('visibilitychange', restaurarAoFicarVisivel)

    return () => {
      window.clearTimeout(destravarVerificacaoInicial)
      window.removeEventListener('focus', restaurarAoFocar)
      document.removeEventListener('visibilitychange', restaurarAoFicarVisivel)
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (usuarioEhAdminSistema() && igrejasAdmin.length > 0) {
      salvarIgrejasAdminCache(igrejasAdmin)
    }
  }, [igrejasAdmin.length, perfilUsuario?.perfil, sessao?.user?.email])

  useEffect(() => {
    if (
      paginaAtual === 'administracao' &&
      usuarioEhAdminSistema() &&
      igrejasAdmin.length === 0
    ) {
      carregarIgrejasAdmin()
    }
  }, [paginaAtual, perfilUsuario?.perfil, sessao?.user?.email])

  async function iniciarAutenticacao() {
    setVerificandoSessao(true)
    setCarregando(true)

    const igrejaSuporteSalva = lerIgrejaSuporteAdminSalva()

    if (igrejaSuporteSalva?.id) {
      definirIgrejaSuporteAdmin(igrejaSuporteSalva)
    }

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      const sessaoAtual = data.session || null
      definirSessao(sessaoAtual)

      setVerificandoSessao(false)

      if (sessaoAtual) {
        carregarDadosOnline(sessaoAtual, igrejaSuporteSalva).catch((erroCarregamentoInicial) => {
          console.error('Erro ao carregar dados iniciais:', erroCarregamentoInicial)
          setErroSistema(
            erroCarregamentoInicial?.message ||
              'Não foi possível carregar os dados iniciais.'
          )
          setCarregando(false)
        })
      } else {
        limparDadosDoSistema()
        setCarregando(false)
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      setErroSistema('Erro ao verificar login.')
      setVerificandoSessao(false)
      setCarregando(false)
    }
  }

  function limparDadosDoSistema() {
    setClasses([])
    setAlunos([])
    setChamadasSalvas([])
    setChamadasProfessores([])
    definirPerfilUsuario(null)
    setPerfisIgreja([])
    setVinculosProfessores([])
    setIgrejaId(null)
    definirIgrejaSuporteAdmin(null)

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ebdfiel_igreja_suporte_admin')
    }

    setConfiguracaoIgreja({
      id: null,
      nome_igreja: '',
      congregacao: '',
      pastor_dirigente: '',
      superintendente_ebd: '',
      cidade: '',
      estado: '',
      bairro: '',
      endereco: '',
      telefone: '',
      email: '',
    })
    navegarParaPagina('painel')
    setTelaPublica('landing')
    setErroCadastroPiloto('')
    setSucessoCadastroPiloto('')
    setUltimoCadastroPilotoEnviado({
      nomeIgreja: '',
      responsavel: '',
      email: '',
    })
    setCadastroPiloto({
      nomeResponsavel: '',
      cargoResponsavel: 'secretario',
      email: '',
      senha: '',
      confirmarSenha: '',
      codigoPiloto: '',
      nomeIgreja: '',
      tipoIgreja: 'congregacao',
      congregacao: '',
      sedeFiliadaNome: '',
      sedeFiliadaEndereco: '',
      sedeFiliadaCep: '',
      pastorDirigente: '',
      telefone: '',
      cidade: '',
      estado: '',
      bairro: '',
      endereco: '',
      cep: '',
    })
    setMostrarFormularioClasse(false)
    setMostrarFormularioAluno(false)
    setClasseEditandoId(null)
    setAlunoEditandoId(null)
    setNovaClasse({ nome: '', professor: '' })
    setNovoAluno({ nome: '', classeId: '', telefone: '', dataNascimento: '', tipoPessoa: 'aluno' })
    setMostrarFormularioPerfil(false)
    setPerfilEditandoId(null)
    setNovoPerfil({
      userId: '',
      nome: '',
      email: '',
      perfil: 'professor',
      classeIds: [],
      dataNascimento: '',
    })
    setBuscaAluno('')
    setFiltroClasseAluno('')
    setTipoChamada('alunos')
    setClasseChamadaId('')
    setPresencas({})
    setPresencasProfessores({})
    setObservacoesChamadaProfessores('')
    setDataAulaChamada(new Date().toISOString().slice(0, 10))
    setDadosExtrasChamada({
      visitantes: '',
      biblias: '',
      revistas: '',
      ofertas: '',
    })
  }

  function criarSlugPiloto(texto) {
    return String(texto || 'igreja')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60)
  }

  async function cadastrarAcessoPiloto(event) {
    event.preventDefault()

    setErroCadastroPiloto('')
    setSucessoCadastroPiloto('')

    const codigoInformado = cadastroPiloto.codigoPiloto.trim().toUpperCase()
    const emailCadastro = cadastroPiloto.email.trim().toLowerCase()

    if (codigoInformado !== codigoPilotoOficial) {
      setErroCadastroPiloto('Código do piloto inválido. Confira o código informado no grupo.')
      return
    }

    if (!cadastroPiloto.nomeResponsavel.trim()) {
      setErroCadastroPiloto('Informe seu nome.')
      return
    }

    const telefoneDdd = limparNumeroWhatsApp(cadastroPiloto.telefoneDdd).slice(0, 2)
    const telefoneNumero = limparNumeroWhatsApp(cadastroPiloto.telefoneNumero)
    const telefoneCompleto = `${telefoneDdd}${telefoneNumero}`

    if (telefoneDdd.length !== 2) {
      setErroCadastroPiloto('Informe o DDD com 2 números.')
      return
    }

    if (telefoneNumero.length < 8) {
      setErroCadastroPiloto('Informe o número de telefone/WhatsApp.')
      return
    }

    if (!emailCadastro) {
      setErroCadastroPiloto('Informe seu e-mail.')
      return
    }

    if (cadastroPiloto.senha.length < 6) {
      setErroCadastroPiloto('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (cadastroPiloto.senha !== cadastroPiloto.confirmarSenha) {
      setErroCadastroPiloto('A confirmação de senha não confere.')
      return
    }

    if (!cadastroPiloto.nomeIgreja.trim()) {
      setErroCadastroPiloto('Informe o nome da igreja.')
      return
    }

    if (!cadastroPiloto.cidade.trim() || !cadastroPiloto.estado.trim()) {
      setErroCadastroPiloto('Informe cidade e estado.')
      return
    }

    if (cadastroPiloto.tipoIgreja === 'congregacao' && !cadastroPiloto.sedeFiliadaNome.trim()) {
      setErroCadastroPiloto('Informe a sede à qual a congregação é filiada.')
      return
    }

    setCarregandoCadastroPiloto(true)

    if (typeof window !== 'undefined') {
      window.__ebdFielCadastroEmAndamento = true
    }

    try {
      const { data: vagasDisponiveis, error: erroVagasDisponiveis } = await supabase.rpc(
        'vagas_piloto_disponiveis'
      )

      if (!erroVagasDisponiveis && Number(vagasDisponiveis) <= 0) {
        setErroCadastroPiloto(
          'O limite inicial de 10 igrejas para o teste piloto já foi atingido. Aguarde a liberação de novas vagas.'
        )
        setCarregandoCadastroPiloto(false)
        return
      }

      const { data: cadastroAuth, error: erroCadastroAuth } = await supabase.auth.signUp({
        email: emailCadastro,
        password: cadastroPiloto.senha,
      })

      if (erroCadastroAuth) {
        throw erroCadastroAuth
      }

      let sessaoCadastro = cadastroAuth.session
      let usuarioCadastro = cadastroAuth.user

      if (!sessaoCadastro) {
        const { data: loginCadastro, error: erroLoginCadastro } =
          await supabase.auth.signInWithPassword({
            email: emailCadastro,
            password: cadastroPiloto.senha,
          })

        if (erroLoginCadastro) {
          setSucessoCadastroPiloto(
            'Seu usuário foi criado. Confira seu e-mail para confirmar o cadastro e depois faça login.'
          )
          return
        }

        sessaoCadastro = loginCadastro.session
        usuarioCadastro = loginCadastro.user
      }

      if (!usuarioCadastro?.id || !sessaoCadastro) {
        setSucessoCadastroPiloto(
          'Seu usuário foi criado. Confira seu e-mail para confirmar o cadastro e depois faça login.'
        )
        return
      }

      const slugBase = criarSlugPiloto(cadastroPiloto.nomeIgreja)

      const { data: igrejaCriadaId, error: erroCadastroPilotoRpc } = await supabase.rpc(
        'criar_cadastro_piloto',
        {
          p_nome: cadastroPiloto.nomeIgreja.trim(),
          p_slug: `${slugBase}-${Date.now()}`,
          p_nome_igreja: cadastroPiloto.nomeIgreja.trim(),
          p_congregacao: cadastroPiloto.congregacao.trim(),
          p_pastor_dirigente: cadastroPiloto.pastorDirigente.trim(),
          p_cidade: cadastroPiloto.cidade.trim(),
          p_estado: cadastroPiloto.estado.trim().toUpperCase(),
          p_bairro: cadastroPiloto.bairro.trim(),
          p_endereco: cadastroPiloto.endereco.trim(),
          p_numero_endereco: cadastroPiloto.numeroEndereco.trim(),
          p_complemento_endereco: cadastroPiloto.complementoEndereco.trim(),
          p_cep: cadastroPiloto.cep.trim(),
          p_telefone: telefoneCompleto,
          p_tipo_igreja: cadastroPiloto.tipoIgreja,
          p_sede_filiada_nome:
            cadastroPiloto.tipoIgreja === 'congregacao'
              ? cadastroPiloto.sedeFiliadaNome.trim()
              : '',
          p_sede_filiada_endereco:
            cadastroPiloto.tipoIgreja === 'congregacao'
              ? cadastroPiloto.sedeFiliadaEndereco.trim()
              : '',
          p_sede_filiada_numero:
            cadastroPiloto.tipoIgreja === 'congregacao'
              ? cadastroPiloto.sedeFiliadaNumero.trim()
              : '',
          p_sede_filiada_complemento:
            cadastroPiloto.tipoIgreja === 'congregacao'
              ? cadastroPiloto.sedeFiliadaComplemento.trim()
              : '',
          p_sede_filiada_cep:
            cadastroPiloto.tipoIgreja === 'congregacao'
              ? cadastroPiloto.sedeFiliadaCep.trim()
              : '',
          p_responsavel_nome: cadastroPiloto.nomeResponsavel.trim(),
          p_responsavel_whatsapp: telefoneCompleto,
          p_cargo_responsavel: cadastroPiloto.cargoResponsavel,
        }
      )

      if (erroCadastroPilotoRpc) {
        throw erroCadastroPilotoRpc
      }

      const igrejaCriadaIdNormalizada = Array.isArray(igrejaCriadaId)
        ? Number(igrejaCriadaId[0]?.id || igrejaCriadaId[0])
        : Number(igrejaCriadaId)

      if (!igrejaCriadaIdNormalizada) {
        throw new Error(
          'O cadastro da igreja foi iniciado, mas não foi possível confirmar o vínculo. Entre em contato com o administrador.'
        )
      }

      const { error: erroCriarPerfilCadastro } = await supabase
        .from('perfis_usuarios')
        .upsert(
          {
            user_id: usuarioCadastro.id,
            nome: cadastroPiloto.nomeResponsavel.trim(),
            email: emailCadastro,
            perfil: 'secretaria',
            igreja_id: igrejaCriadaIdNormalizada,
            classe_id: null,
            data_nascimento: null,
          },
          { onConflict: 'user_id' }
        )

      if (erroCriarPerfilCadastro) {
        throw erroCriarPerfilCadastro
      }

      await supabase.auth.signOut()
      definirSessao(null)

      setSucessoCadastroPiloto(
        'Cadastro enviado com sucesso! Sua igreja está aguardando aprovação do administrador.'
      )
      setUltimoCadastroPilotoEnviado({
        nomeIgreja: cadastroPiloto.nomeIgreja.trim(),
        responsavel: cadastroPiloto.nomeResponsavel.trim(),
        email: emailCadastro,
      })
      setEmailLogin(emailCadastro)
      setSenhaLogin('')
      setTelaPublica('cadastroEnviado')
    } catch (error) {
      console.error(error)

      if (
        String(error?.message || '').includes('limite_piloto_atingido') ||
        String(error?.details || '').includes('limite_piloto_atingido')
      ) {
        setErroCadastroPiloto(
          'O limite inicial de 10 igrejas para o teste piloto já foi atingido. Aguarde a liberação de novas vagas.'
        )
      } else if (
        String(error?.message || '').includes('usuario_ja_possui_perfil') ||
        String(error?.details || '').includes('usuario_ja_possui_perfil')
      ) {
        setErroCadastroPiloto(
          'Este e-mail já iniciou um cadastro anteriormente. Use “Esqueci minha senha” para recuperar o acesso ou fale com o administrador para concluir o vínculo.'
        )
      } else {
        setErroCadastroPiloto(
          traduzirErroSistema(error, 'Não foi possível criar o acesso do piloto.')
        )
      }
    } finally {
      if (typeof window !== 'undefined') {
        window.__ebdFielCadastroEmAndamento = false
      }

      setCarregandoCadastroPiloto(false)
    }
  }

  async function enviarLinkRecuperacaoSenha(event) {
    event.preventDefault()

    const email = emailRecuperacao.trim().toLowerCase()

    setErroRecuperacao('')
    setMensagemRecuperacao('')

    if (!email) {
      setErroRecuperacao('Informe seu e-mail para receber o link de recuperação.')
      return
    }

    setCarregandoRecuperacao(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })

      if (error) {
        throw error
      }

      setMensagemRecuperacao(
        'Link de recuperação enviado. Confira sua caixa de entrada e também a pasta de spam.'
      )
    } catch (error) {
      console.error(error)
      setErroRecuperacao(
        traduzirErroSistema(error, 'Não foi possível enviar o link de recuperação.')
      )
    } finally {
      setCarregandoRecuperacao(false)
    }
  }

  async function salvarNovaSenhaRecuperacao(event) {
    event.preventDefault()

    setErroNovaSenha('')

    if (novaSenhaRecuperacao.length < 6) {
      setErroNovaSenha('A nova senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (novaSenhaRecuperacao !== confirmarNovaSenhaRecuperacao) {
      setErroNovaSenha('A confirmação da nova senha não confere.')
      return
    }

    setCarregandoNovaSenha(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: novaSenhaRecuperacao,
      })

      if (error) {
        throw error
      }

      setNovaSenhaRecuperacao('')
      setConfirmarNovaSenhaRecuperacao('')
      alert('Senha atualizada com sucesso. Entre novamente com sua nova senha.')
      await supabase.auth.signOut()
      definirSessao(null)
      setTelaPublica('login')
    } catch (error) {
      console.error(error)
      setErroNovaSenha(
        traduzirErroSistema(error, 'Não foi possível atualizar a senha.')
      )
    } finally {
      setCarregandoNovaSenha(false)
    }
  }

  async function entrarComEmailSenha(event) {
    event.preventDefault()

    if (!emailLogin.trim() || !senhaLogin.trim()) {
      setErroLogin('Informe o e-mail e a senha.')
      return
    }

    setCarregandoLogin(true)
    setErroLogin('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLogin.trim(),
        password: senhaLogin,
      })

      if (error) {
        throw error
      }

      definirSessao(data.session)
      setEmailLogin('')
      setSenhaLogin('')

      await carregarDadosOnline(data.session)
    } catch (error) {
      console.error('Erro ao entrar:', error)
      setErroLogin('E-mail ou senha inválidos.')
    } finally {
      setCarregandoLogin(false)
    }
  }

  async function sairDoSistema() {
    const confirmar = window.confirm('Deseja sair do sistema?')

    if (!confirmar) {
      return
    }

    if (typeof window !== 'undefined') {
      window.__ebdFielSaindoDoSistema = true
    }

    setCarregando(false)
    setVerificandoSessao(false)

    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (error) {
      console.error('Erro ao sair do Supabase:', error)
    }

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(CHAVE_SUPORTE_ADMIN)
        window.localStorage.removeItem(CHAVE_PAGINA_ATUAL)
        window.localStorage.removeItem('ebdfiel_igrejas_admin_cache')
      }
    } catch (error) {
      console.error('Erro ao limpar dados locais do EBD Fiel:', error)
    }

    usuarioCarregadoRef.current = null
    definirSessao(null)
    limparDadosDoSistema()
    setTelaPublica('login')

    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        window.__ebdFielSaindoDoSistema = false
      }, 600)
    }
  }

  async function carregarDadosOnline(sessaoAtual = sessaoRef.current, igrejaSuporteForcada = null) {
    const suporteParaPreservar = igrejaSuporteForcada || recuperarContextoSuporteAdminAtual()

    if (
      carregamentoDadosEmAndamentoRef.current &&
      !igrejaSuporteForcada &&
      usuarioCarregadoRef.current === sessaoAtual?.user?.id
    ) {
      return
    }

    carregamentoDadosEmAndamentoRef.current = true
    setCarregando(true)
    setErroSistema('')

    try {
      let sessaoParaUsar = sessaoAtual

      if (!sessaoParaUsar?.user?.id) {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        sessaoParaUsar = data?.session || null

        if (sessaoParaUsar) {
          definirSessao(sessaoParaUsar)
        }
      }

      await buscarTodosOsDados(sessaoParaUsar, suporteParaPreservar)

      if (sessaoParaUsar?.user?.id) {
        usuarioCarregadoRef.current = sessaoParaUsar.user.id
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)

      const mensagemErro = error?.message || 'Não foi possível carregar os dados do Supabase.'
      setErroSistema(mensagemErro)

      if (suporteParaPreservar?.id && sessaoAtual?.user?.id) {
        manterContextoSuporteAdmin(suporteParaPreservar, sessaoAtual, {
          forcarPainel: true,
        })
      }

      if (
        !suporteParaPreservar?.id &&
        (mensagemErro.toLowerCase().includes('cadastro incompleto') ||
          mensagemErro.toLowerCase().includes('ainda não liberado') ||
          mensagemErro.toLowerCase().includes('aguardando aprovação') ||
          mensagemErro.toLowerCase().includes('sem igreja vinculada'))
      ) {
        limparDadosOperacionaisSemTrocarTela()
        setTelaPublica('login')
      }
    } finally {
      carregamentoDadosEmAndamentoRef.current = false
      setCarregando(false)
    }
  }


  function limparDadosOperacionaisSemTrocarTela(opcoes = {}) {
    const preservarContextoSuporte = Boolean(opcoes?.preservarContextoSuporte)

    setClasses([])
    setAlunos([])
    setChamadasSalvas([])
    setChamadasProfessores([])

    if (!preservarContextoSuporte) {
      definirPerfilUsuario(null)
      setIgrejaId(null)
      setIgrejaAtualPiloto(null)
    }

    setPerfisIgreja([])
    setVinculosProfessores([])
    setFeedbacksIgreja([])
  }

  async function inserirDadosIniciais(igrejaAtualId, sessaoAtual = sessao) {
    // PROTEÇÃO v51:
    // Esta função deixou de criar dados automáticos com IDs fixos.
    // Antes, classes/alunos iniciais usavam id 1, 2 e 3 com upsert, o que podia
    // interferir em registros existentes de outras igrejas quando havia conflito de ID.
    // Para proteger as igrejas ativas, nenhuma classe ou aluno será criado automaticamente
    // ao carregar uma igreja. Se uma igreja nova precisar de classes, cadastre manualmente
    // pela tela Classes.
    if (!igrejaAtualId) {
      throw new Error('Igreja não identificada para criar os dados iniciais.')
    }

    console.warn(
      'Criação automática de dados iniciais bloqueada para proteger cadastros existentes.',
      { igrejaAtualId, userId: sessaoAtual?.user?.id }
    )

    return false
  }


  async function migrarProfessoresDasClasses(
    igrejaAtualId,
    classesBanco,
    alunosBanco,
    sessaoAtual = sessao
  ) {
    const professoresExistentes = (alunosBanco || [])
      .filter((pessoa) => pessoa.tipo_pessoa === 'professor')
      .map(
        (pessoa) =>
          `${String(pessoa.nome || '').trim().toLowerCase()}-${Number(
            pessoa.classe_id || 0
          )}`
      )

    const professoresParaCriar = []

    ;(classesBanco || []).forEach((classe) => {
      const textoProfessores = String(classe.professor || '').trim()

      if (!textoProfessores) {
        return
      }

      const nomes = textoProfessores
        .split(/,|;|\/| e /i)
        .map((nome) => nome.trim())
        .filter(Boolean)

      nomes.forEach((nome) => {
        const chave = `${nome.toLowerCase()}-${Number(classe.id)}`

        if (!professoresExistentes.includes(chave)) {
          professoresExistentes.push(chave)

          professoresParaCriar.push({
            id: Date.now() + professoresParaCriar.length,
            igreja_id: igrejaAtualId,
            user_id: sessaoAtual?.user?.id,
            nome,
            classe_id: Number(classe.id),
            telefone: '',
            data_nascimento: null,
            tipo_pessoa: 'professor',
          })
        }
      })
    })

    if (professoresParaCriar.length === 0) {
      return false
    }

    const { error } = await supabase.from('alunos').insert(professoresParaCriar)

    if (error) {
      throw error
    }

    return true
  }

  function usuarioEhProfessor() {
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario

    return perfilAtual?.perfil === 'professor'
  }

  function buscarIgrejaIdAtual() {
    const suporteAtual = igrejaSuporteAdminRef.current || igrejaSuporteAdmin
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario

    if (usuarioEhAdminSistema() && suporteAtual?.id) {
      return Number(suporteAtual.id)
    }

    return perfilAtual?.igreja_id || igrejaId || null
  }

  function navegarParaPagina(paginaId) {
    setMenuInternoAberto(false)
    definirPaginaAtual(paginaId)

    if (paginaId === 'painel') {
      setAlertaPainelFechado(false)
    }

    if (paginaId === 'administracao') {
      carregarIgrejasAdmin()
    }

    window.setTimeout(() => {
      const areaPrincipal =
        document.querySelector('.area-principal') ||
        document.querySelector('main')

      if (!areaPrincipal) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const distanciaDoTopo =
        areaPrincipal.getBoundingClientRect().top + window.pageYOffset - 8

      window.scrollTo({
        top: Math.max(distanciaDoTopo, 0),
        behavior: 'smooth',
      })
    }, 180)
  }

  const emailsAdminSistema = ['ebdfiel7@gmail.com']

  function usuarioEhAdminSistema() {
    const sessaoAtual = sessaoRef.current || sessao
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario
    const emailSessao = String(sessaoAtual?.user?.email || '').toLowerCase()

    return (
      perfilAtual?.perfil === 'admin_sistema' ||
      emailsAdminSistema.includes(emailSessao)
    )
  }

  function buscarIgrejaSuporteAdminSalva() {
    const igrejaAtual = igrejaSuporteAdminRef.current || igrejaSuporteAdmin

    if (igrejaAtual?.id) {
      return igrejaAtual
    }

    const igrejaSalva = lerIgrejaSuporteAdminSalva()

    if (igrejaSalva?.id) {
      definirIgrejaSuporteAdmin(igrejaSalva)
      return igrejaSalva
    }

    return null
  }

  async function acessarIgrejaComoSuporte(igreja, event = null) {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    if (event?.stopPropagation) {
      event.stopPropagation()
    }

    const igrejaIdSelecionada = Number(igreja?.id)

    if (!igrejaIdSelecionada) {
      alert('Não foi possível identificar a igreja selecionada.')
      return
    }

    let sessaoAtual = sessaoRef.current || sessao

    try {
      if (!sessaoAtual?.user?.id) {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        sessaoAtual = data?.session || null

        if (sessaoAtual) {
          definirSessao(sessaoAtual)
        }
      }

      const emailSessaoAtual = String(sessaoAtual?.user?.email || '').toLowerCase()
      const adminAutorizado =
        perfilUsuarioRef.current?.perfil === 'admin_sistema' ||
        emailsAdminSistema.includes(emailSessaoAtual)

      if (!adminAutorizado) {
        alert('Apenas administradores do sistema podem acessar igrejas em modo suporte.')
        return
      }

      const igrejaSelecionada = normalizarIgrejaSuporteAdmin(igreja)

      suporteAdminEmTransicaoRef.current = true
      setCarregando(true)
      setErroSistema('')

      manterContextoSuporteAdmin(igrejaSelecionada, sessaoAtual, {
        forcarPainel: true,
      })

      await buscarTodosOsDados(sessaoAtual, igrejaSelecionada)

      manterContextoSuporteAdmin(igrejaSelecionada, sessaoAtual, {
        forcarPainel: true,
      })
      usuarioCarregadoRef.current = sessaoAtual?.user?.id || usuarioCarregadoRef.current

      if (typeof window !== 'undefined') {
        window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
      }
    } catch (erroSuporte) {
      console.error('Erro ao acessar igreja em modo suporte:', erroSuporte)

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('ebdfiel_igreja_suporte_admin')
      }

      definirIgrejaSuporteAdmin(null)
      setErroSistema(
        erroSuporte?.message ||
          'Não foi possível acessar esta igreja em modo suporte agora.'
      )
      alert(
        erroSuporte?.message ||
          'Não foi possível acessar esta igreja em modo suporte agora.'
      )
    } finally {
      setCarregando(false)

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          suporteAdminEmTransicaoRef.current = false
        }, 700)
      } else {
        suporteAdminEmTransicaoRef.current = false
      }
    }
  }

  async function sairDoModoSuporteAdmin() {
    suporteAdminEmTransicaoRef.current = true

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ebdfiel_igreja_suporte_admin')
    }

    definirIgrejaSuporteAdmin(null)
    setClasses([])
    setAlunos([])
    setChamadasSalvas([])
    setChamadasProfessores([])
    setVinculosProfessores([])
    setIgrejaId(null)
    setIgrejaAtualPiloto(null)

    const sessaoAtual = sessaoRef.current || sessao
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario
    const emailSessaoAtual = String(sessaoAtual?.user?.email || '').toLowerCase()

    definirPerfilUsuario({
      id: perfilAtual?.id || null,
      user_id: sessaoAtual?.user?.id,
      nome: perfilAtual?.nome || 'Administrador do sistema',
      email: emailSessaoAtual,
      perfil: 'admin_sistema',
      igreja_id: 19,
      classe_id: null,
    })

    definirPaginaAtual('administracao')
    await carregarIgrejasAdmin()

    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        suporteAdminEmTransicaoRef.current = false
      }, 500)
    } else {
      suporteAdminEmTransicaoRef.current = false
    }
  }

  function modoSuporteAdminAtivo() {
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario
    const suporteAtual = igrejaSuporteAdminRef.current || igrejaSuporteAdmin

    return usuarioEhAdminSistema() && Boolean(perfilAtual?.modo_suporte_admin || suporteAtual?.id)
  }

  function limparFormularioIgrejaAdmin() {
    setNovaIgrejaAdmin({
      nome_igreja: '',
      congregacao: '',
      pastor_dirigente: '',
      cidade: '',
      estado: '',
      bairro: '',
      endereco: '',
      telefone: '',
      email: '',
      status_piloto: 'teste',
      responsavel_nome: '',
      responsavel_email: '',
      responsavel_whatsapp: '',
      observacoes_piloto: '',
      data_inicio_piloto: '',
      data_fim_piloto: '',
      limite_usuarios: 10,
    })
    setIgrejaAdminEditandoId(null)
    setMostrarFormularioIgrejaAdmin(false)
  }

  function abrirNovaIgrejaAdmin() {
    limparFormularioIgrejaAdmin()
    setMostrarFormularioIgrejaAdmin(true)
  }

  function editarIgrejaAdmin(igreja) {
    setNovaIgrejaAdmin({
      nome_igreja: igreja.nome_igreja || '',
      congregacao: igreja.congregacao || '',
      pastor_dirigente: igreja.pastor_dirigente || '',
      cidade: igreja.cidade || '',
      estado: igreja.estado || '',
      bairro: igreja.bairro || '',
      endereco: igreja.endereco || '',
      numero_endereco: igreja.numero_endereco || '',
      complemento_endereco: igreja.complemento_endereco || '',
      cep: igreja.cep || '',
      tipo_igreja: igreja.tipo_igreja || 'congregacao',
      sede_filiada_nome: igreja.sede_filiada_nome || '',
      sede_filiada_endereco: igreja.sede_filiada_endereco || '',
      sede_filiada_numero: igreja.sede_filiada_numero || '',
      sede_filiada_complemento: igreja.sede_filiada_complemento || '',
      sede_filiada_cep: igreja.sede_filiada_cep || '',
      telefone: igreja.telefone || '',
      email: igreja.email || '',
      status_piloto: igreja.status_piloto || 'teste',
      responsavel_nome: igreja.responsavel_nome || '',
      responsavel_email: igreja.responsavel_email || '',
      responsavel_whatsapp: igreja.responsavel_whatsapp || '',
      observacoes_piloto: igreja.observacoes_piloto || '',
      data_inicio_piloto: igreja.data_inicio_piloto || '',
      data_fim_piloto: igreja.data_fim_piloto || '',
      limite_usuarios: igreja.limite_usuarios || 10,
    })
    setIgrejaAdminEditandoId(igreja.id)
    setMostrarFormularioIgrejaAdmin(true)
  }

  function limparFormularioAcessoAdmin() {
    setNovoAcessoAdmin({
      userId: '',
      nome: '',
      email: '',
      perfil: 'secretaria',
      igrejaId: '',
      classeId: '',
      dataNascimento: '',
    })
    setAcessoAdminEditandoUserId(null)
    setMostrarFormularioAcessoAdmin(false)
  }

  function abrirNovoAcessoAdmin(igreja = null) {
    setNovoAcessoAdmin({
      userId: '',
      nome: igreja?.responsavel_nome || '',
      email: igreja?.responsavel_email || '',
      perfil: 'secretaria',
      igrejaId: igreja?.id ? String(igreja.id) : '',
      classeId: '',
      dataNascimento: '',
    })
    setAcessoAdminEditandoUserId(null)
    setMostrarFormularioAcessoAdmin(true)
  }

  function editarAcessoAdmin(acesso) {
    setNovoAcessoAdmin({
      userId: acesso.user_id || '',
      nome: acesso.nome || '',
      email: acesso.email || '',
      perfil: acesso.perfil || 'secretaria',
      igrejaId: acesso.igreja_id ? String(acesso.igreja_id) : '',
      classeId: acesso.classe_id ? String(acesso.classe_id) : '',
      dataNascimento: acesso.data_nascimento || '',
    })
    setAcessoAdminEditandoUserId(acesso.user_id)
    setMostrarFormularioAcessoAdmin(true)
  }

  function buscarNomeIgrejaAdmin(igrejaBuscaId) {
    const igreja = igrejasAdmin.find((item) => Number(item.id) === Number(igrejaBuscaId))

    return igreja?.nome_igreja || igreja?.nome || `Igreja ID ${igrejaBuscaId || '-'}`
  }

  function contarAcessosDaIgreja(igrejaBuscaId) {
    return acessosAdmin.filter((acesso) => Number(acesso.igreja_id) === Number(igrejaBuscaId)).length
  }

  function buscarAcessosDaIgrejaAdmin(igrejaBuscaId) {
    return acessosAdmin
      .filter((acesso) => Number(acesso.igreja_id) === Number(igrejaBuscaId))
      .sort((a, b) => String(a.nome || a.email || '').localeCompare(String(b.nome || b.email || '')))
  }

  function alternarUsuariosDaIgreja(igrejaBuscaId) {
    setIgrejaUsuariosAbertaId((idAtual) =>
      Number(idAtual) === Number(igrejaBuscaId) ? null : igrejaBuscaId
    )
  }

  function filtrarAcessosAdmin() {
    const termo = buscaAcessoAdmin.toLowerCase()

    return acessosAdmin.filter((acesso) => {
      const igrejaNome = buscarNomeIgrejaAdmin(acesso.igreja_id).toLowerCase()

      return (
        String(acesso.nome || '').toLowerCase().includes(termo) ||
        String(acesso.email || '').toLowerCase().includes(termo) ||
        String(acesso.perfil || '').toLowerCase().includes(termo) ||
        igrejaNome.includes(termo)
      )
    })
  }

  async function carregarAcessosAdmin() {
    if (!usuarioEhAdminSistema()) {
      return
    }

    const { data, error } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    setAcessosAdmin(data || [])
  }

  async function carregarCadastrosIncompletosAdmin() {
    if (!usuarioEhAdminSistema()) {
      return
    }

    setCarregandoCadastrosIncompletosAdmin(true)
    setErroCadastrosIncompletosAdmin('')

    const { data, error } = await supabase.rpc('listar_cadastros_incompletos_admin')

    setCarregandoCadastrosIncompletosAdmin(false)

    if (error) {
      console.error(error)
      setErroCadastrosIncompletosAdmin(
        traduzirErroSistema(error, 'Não foi possível carregar os cadastros incompletos.')
      )
      setCadastrosIncompletosAdmin([])
      return
    }

    setCadastrosIncompletosAdmin(data || [])
  }

  async function salvarAcessoAdmin(event) {
    event.preventDefault()

    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem gerenciar acessos.')
      return
    }

    if (!novoAcessoAdmin.userId.trim()) {
      alert('Informe o User UID do Supabase Authentication.')
      return
    }

    if (!novoAcessoAdmin.nome.trim()) {
      alert('Informe o nome do usuário.')
      return
    }

    if (!novoAcessoAdmin.email.trim()) {
      alert('Informe o e-mail do usuário.')
      return
    }

    if (!novoAcessoAdmin.igrejaId) {
      alert('Selecione a igreja vinculada.')
      return
    }

    const dadosAcesso = {
      user_id: novoAcessoAdmin.userId.trim(),
      nome: novoAcessoAdmin.nome.trim(),
      email: novoAcessoAdmin.email.trim().toLowerCase(),
      perfil: novoAcessoAdmin.perfil,
      igreja_id: Number(novoAcessoAdmin.igrejaId),
      classe_id: novoAcessoAdmin.classeId ? Number(novoAcessoAdmin.classeId) : null,
      data_nascimento: novoAcessoAdmin.dataNascimento || null,
    }

    const { error } = await supabase
      .from('perfis_usuarios')
      .upsert(dadosAcesso, { onConflict: 'user_id' })

    if (error) {
      mostrarErroSistema(error, 'Não foi possível salvar o acesso.')
      return
    }

    await carregarAcessosAdmin()
    limparFormularioAcessoAdmin()
    alert('Acesso salvo com sucesso!')
  }

  async function removerAcessoAdmin(acesso) {
    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem remover acessos.')
      return
    }

    const confirmar = window.confirm(
      `Deseja remover o acesso de ${acesso.nome || acesso.email}? O usuário continuará existindo no Authentication, mas ficará sem vínculo no sistema.`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase
      .from('perfis_usuarios')
      .delete()
      .eq('user_id', acesso.user_id)

    if (error) {
      mostrarErroSistema(error, 'Não foi possível remover o acesso.')
      return
    }

    await carregarAcessosAdmin()
  }

  async function enviarRecuperacaoSenhaAdmin(email) {
    if (!email) {
      alert('Este usuário não possui e-mail cadastrado.')
      return
    }

    const confirmar = window.confirm(
      `Enviar link de recuperação de senha para ${email}?`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    if (error) {
      mostrarErroSistema(error, 'Não foi possível enviar o link de recuperação de senha.')
      return
    }

    alert('Link de recuperação enviado. Peça para o usuário conferir o e-mail.')
  }

  function buscarIgrejasAdminCache() {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const igrejasSalvas = JSON.parse(
        window.localStorage.getItem('ebdfiel_igrejas_admin_cache') || '[]'
      )

      return Array.isArray(igrejasSalvas) ? igrejasSalvas : []
    } catch {
      return []
    }
  }

  function salvarIgrejasAdminCache(igrejas) {
    if (typeof window === 'undefined' || !Array.isArray(igrejas) || igrejas.length === 0) {
      return
    }

    try {
      window.localStorage.setItem('ebdfiel_igrejas_admin_cache', JSON.stringify(igrejas))
    } catch (error) {
      console.error('Erro ao salvar cache de igrejas admin:', error)
    }
  }

  async function buscarIgrejasAdminBanco() {
    const cacheIgrejas = buscarIgrejasAdminCache()

    const { data: igrejasRpc, error: erroRpc } = await supabase.rpc('admin_listar_igrejas')

    if (!erroRpc && Array.isArray(igrejasRpc) && igrejasRpc.length > 0) {
      salvarIgrejasAdminCache(igrejasRpc)
      return igrejasRpc
    }

    if (erroRpc) {
      console.error('Erro ao carregar igrejas via RPC:', erroRpc)
    }

    const { data: igrejasTabela, error: erroTabela } = await supabase
      .from('igrejas')
      .select('*')
      .order('created_at', { ascending: false })

    if (!erroTabela && Array.isArray(igrejasTabela) && igrejasTabela.length > 0) {
      salvarIgrejasAdminCache(igrejasTabela)
      return igrejasTabela
    }

    if (erroTabela) {
      console.error('Erro ao carregar igrejas pela tabela:', erroTabela)
    }

    if (cacheIgrejas.length > 0) {
      return cacheIgrejas
    }

    return []
  }

  async function carregarIgrejasAdmin() {
    if (!usuarioEhAdminSistema()) {
      return
    }

    try {
      const igrejas = await buscarIgrejasAdminBanco()

      if (igrejas.length > 0 || igrejasAdmin.length === 0) {
        setIgrejasAdmin(igrejas || [])
      }

      if (igrejas.length > 0) {
        salvarIgrejasAdminCache(igrejas)
      }
    } catch (error) {
      const cacheIgrejas = buscarIgrejasAdminCache()

      if (cacheIgrejas.length > 0) {
        setIgrejasAdmin(cacheIgrejas)
        return
      }

      mostrarErroSistema(error, 'Erro ao carregar igrejas do piloto.')
      return
    }
    await carregarAcessosAdmin()
    await carregarFeedbacksAdmin()
    await carregarCadastrosIncompletosAdmin()
  }

  async function salvarIgrejaAdmin(event) {
    event.preventDefault()

    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem cadastrar igrejas.')
      return
    }

    if (!novaIgrejaAdmin.nome_igreja.trim()) {
      alert('Informe o nome da igreja.')
      return
    }

    const dadosIgreja = {
      nome_igreja: novaIgrejaAdmin.nome_igreja.trim(),
      congregacao: novaIgrejaAdmin.congregacao.trim(),
      pastor_dirigente: novaIgrejaAdmin.pastor_dirigente.trim(),
      cidade: novaIgrejaAdmin.cidade.trim(),
      estado: novaIgrejaAdmin.estado.trim(),
      bairro: novaIgrejaAdmin.bairro.trim(),
      endereco: novaIgrejaAdmin.endereco.trim(),
      numero_endereco: novaIgrejaAdmin.numero_endereco.trim(),
      complemento_endereco: novaIgrejaAdmin.complemento_endereco.trim(),
      cep: novaIgrejaAdmin.cep.trim(),
      tipo_igreja: novaIgrejaAdmin.tipo_igreja,
      sede_filiada_nome:
        novaIgrejaAdmin.tipo_igreja === 'congregacao'
          ? novaIgrejaAdmin.sede_filiada_nome.trim()
          : '',
      sede_filiada_endereco:
        novaIgrejaAdmin.tipo_igreja === 'congregacao'
          ? novaIgrejaAdmin.sede_filiada_endereco.trim()
          : '',
      sede_filiada_numero:
        novaIgrejaAdmin.tipo_igreja === 'congregacao'
          ? novaIgrejaAdmin.sede_filiada_numero.trim()
          : '',
      sede_filiada_complemento:
        novaIgrejaAdmin.tipo_igreja === 'congregacao'
          ? novaIgrejaAdmin.sede_filiada_complemento.trim()
          : '',
      sede_filiada_cep:
        novaIgrejaAdmin.tipo_igreja === 'congregacao'
          ? novaIgrejaAdmin.sede_filiada_cep.trim()
          : '',
      telefone: novaIgrejaAdmin.telefone.trim(),
      email: novaIgrejaAdmin.email.trim(),
      status_piloto: novaIgrejaAdmin.status_piloto,
      responsavel_nome: novaIgrejaAdmin.responsavel_nome.trim(),
      responsavel_email: novaIgrejaAdmin.responsavel_email.trim(),
      responsavel_whatsapp: novaIgrejaAdmin.responsavel_whatsapp.trim(),
      observacoes_piloto: novaIgrejaAdmin.observacoes_piloto.trim(),
      data_inicio_piloto: novaIgrejaAdmin.data_inicio_piloto || null,
      data_fim_piloto: novaIgrejaAdmin.data_fim_piloto || null,
      limite_usuarios: Number(novaIgrejaAdmin.limite_usuarios || 10),
    }

    let resposta

    if (igrejaAdminEditandoId) {
      resposta = await supabase
        .from('igrejas')
        .update(dadosIgreja)
        .eq('id', igrejaAdminEditandoId)
    } else {
      resposta = await supabase.from('igrejas').insert(dadosIgreja)
    }

    if (resposta.error) {
      mostrarErroSistema(resposta.error, 'Erro ao salvar igreja.')
      return
    }

    await carregarIgrejasAdmin()
    limparFormularioIgrejaAdmin()
    alert('Igreja salva com sucesso!')
  }

  async function excluirIgrejaAdmin(igreja) {
    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem excluir igrejas.')
      return
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir a igreja ${igreja.nome_igreja}? Esta ação pode apagar os dados vinculados.`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase.from('igrejas').delete().eq('id', igreja.id)

    if (error) {
      mostrarErroSistema(error, 'Erro ao excluir igreja.')
      return
    }

    await carregarIgrejasAdmin()
  }

  async function alterarStatusIgrejaAdmin(igreja, novoStatus) {
    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem alterar o status da igreja.')
      return
    }

    const nomeIgreja = igreja.nome_igreja || igreja.nome || 'esta igreja'
    const textoAcao =
      novoStatus === 'teste'
        ? 'liberar esta igreja para uso da plataforma'
        : novoStatus === 'cancelada'
          ? 'não aprovar esta igreja'
          : `alterar o status para ${novoStatus}`

    const confirmar = window.confirm(`Deseja ${textoAcao}: ${nomeIgreja}?`)

    if (!confirmar) {
      return
    }

    const { error } = await supabase
      .from('igrejas')
      .update({ status_piloto: novoStatus })
      .eq('id', igreja.id)

    if (error) {
      mostrarErroSistema(error, 'Não foi possível alterar o status da igreja.')
      return
    }

    await carregarIgrejasAdmin()

    if (novoStatus === 'teste') {
      const avisarAgora = window.confirm(
        'Igreja liberada para uso da plataforma. Deseja abrir o WhatsApp com uma mensagem pronta para avisar o responsável?'
      )

      if (avisarAgora) {
        abrirWhatsAppAprovacao({ ...igreja, status_piloto: 'teste' })
      }
    }

    if (novoStatus === 'cancelada') {
      alert('Igreja marcada como não aprovada.')
    }
  }

  async function aprovarIgrejaPiloto(igreja) {
    await alterarStatusIgrejaAdmin(igreja, 'teste')
  }

  async function naoAprovarIgrejaPiloto(igreja) {
    await alterarStatusIgrejaAdmin(igreja, 'cancelada')
  }

  function gerarMensagemAprovacaoIgreja(igreja) {
    const nomeIgreja = igreja.nome_igreja || igreja.nome || 'sua igreja'

    return `Paz do Senhor!

O cadastro da ${nomeIgreja} no EBD Fiel foi liberado para uso.

Acesse o sistema pelo link:

https://app.ebdfiel.com.br

Entre com o e-mail e a senha cadastrados no momento da inscrição.

Manual rápido para começar:

1. Confira os dados da igreja no painel.
2. Vá em Classes e cadastre as turmas da EBD.
3. Vá em Alunos ou entre em uma classe para cadastrar os alunos.
4. Vá em Professores para cadastrar os professores da EBD.
5. Vincule os professores às classes correspondentes.
6. Vá em Chamada para registrar a presença dos alunos.
7. Use Chamada dos professores para registrar a presença dos professores.
8. Em Relatórios, gere o relatório da EBD em PDF.
9. Durante o uso da plataforma, use a área de mensagens para enviar sugestões, dúvidas ou dificuldades.

Qualquer dificuldade, pode me chamar por aqui.`
  }

  function limparNumeroWhatsApp(numero) {
    return String(numero || '').replace(/\D/g, '')
  }

  function abrirWhatsAppAprovacao(igreja) {
    const numeroLimpo = limparNumeroWhatsApp(igreja.responsavel_whatsapp)
    const mensagem = gerarMensagemAprovacaoIgreja(igreja)
    const texto = encodeURIComponent(mensagem)

    if (!numeroLimpo) {
      alert('Esta igreja não possui WhatsApp cadastrado. Use o botão “Copiar mensagem”.')
      return
    }

    const numeroComPais = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`
    window.open(`https://wa.me/${numeroComPais}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  async function copiarMensagemAprovacao(igreja) {
    const mensagem = gerarMensagemAprovacaoIgreja(igreja)

    try {
      await navigator.clipboard.writeText(mensagem)
      alert('Mensagem de aprovação copiada.')
    } catch {
      window.prompt('Copie a mensagem abaixo:', mensagem)
    }
  }

  function buscarIgrejaAdminPorId(igrejaId) {
    return igrejasAdmin.find((item) => Number(item.id) === Number(igrejaId)) || null
  }

  function buscarContatoIgrejaAdmin(igrejaId) {
    const igreja = buscarIgrejaAdminPorId(igrejaId)

    if (!igreja) {
      return {
        responsavel: '',
        email: '',
        whatsapp: '',
        telefone: '',
      }
    }

    return {
      responsavel: igreja.responsavel_nome || '',
      email: igreja.responsavel_email || igreja.email || '',
      whatsapp: igreja.responsavel_whatsapp || '',
      telefone: igreja.telefone || '',
    }
  }

  function copiarContatoAcessoAdmin(acesso) {
    const contato = buscarContatoIgrejaAdmin(acesso.igreja_id)
    const texto = [
      `Nome: ${acesso.nome || contato.responsavel || 'Não informado'}`,
      `E-mail de acesso: ${acesso.email || 'Não informado'}`,
      `Igreja: ${buscarNomeIgrejaAdmin(acesso.igreja_id)}`,
      `Responsável: ${contato.responsavel || 'Não informado'}`,
      `WhatsApp: ${contato.whatsapp || 'Não informado'}`,
      `Telefone: ${contato.telefone || 'Não informado'}`,
      `E-mail da igreja/responsável: ${contato.email || 'Não informado'}`,
    ].join('\n')

    navigator.clipboard
      ?.writeText(texto)
      .then(() => alert('Contato copiado.'))
      .catch(() => window.prompt('Copie os dados abaixo:', texto))
  }

  function abrirWhatsAppAcessoAdmin(acesso) {
    const contato = buscarContatoIgrejaAdmin(acesso.igreja_id)
    const numero = limparNumeroWhatsApp(contato.whatsapp || contato.telefone)

    if (!numero) {
      alert('Não há WhatsApp/telefone cadastrado para este acesso.')
      return
    }

    const numeroComPais = numero.startsWith('55') ? numero : `55${numero}`
    const mensagem = encodeURIComponent(
      `Paz do Senhor! Aqui é o suporte do EBD Fiel. Estou entrando em contato sobre o acesso da igreja ${buscarNomeIgrejaAdmin(acesso.igreja_id)}.`
    )

    window.open(`https://wa.me/${numeroComPais}?text=${mensagem}`, '_blank', 'noopener,noreferrer')
  }


  function filtrarIgrejasAdmin() {
    const termo = buscaIgrejaAdmin.toLowerCase()

    return igrejasAdmin.filter((igreja) => {
      return (
        String(igreja.nome_igreja || '').toLowerCase().includes(termo) ||
        String(igreja.congregacao || '').toLowerCase().includes(termo) ||
        String(igreja.responsavel_nome || '').toLowerCase().includes(termo) ||
        String(igreja.responsavel_email || '').toLowerCase().includes(termo)
      )
    })
  }

  function traduzirErroSistema(erro, mensagemPadrao = 'Não foi possível concluir a operação.') {
    const mensagemOriginal =
      typeof erro === 'string'
        ? erro
        : erro?.message || erro?.error_description || mensagemPadrao

    const mensagem = String(mensagemOriginal || '').toLowerCase()

    if (mensagem.includes('could not find') && mensagem.includes('column')) {
      const colunaEncontrada = String(mensagemOriginal).match(/'([^']+)' column/)
      const tabelaEncontrada = String(mensagemOriginal).match(/of '([^']+)'/)

      const coluna = colunaEncontrada?.[1] || 'necessária'
      const tabela = tabelaEncontrada?.[1] || 'do banco de dados'

      return `O campo "${coluna}" ainda não existe na tabela "${tabela}" do Supabase. Rode o SQL de atualização do banco, aguarde alguns segundos e tente novamente.`
    }

    if (mensagem.includes('schema cache')) {
      return 'O Supabase ainda está atualizando o cache do banco de dados. Aguarde alguns segundos, aperte Ctrl + F5 e tente novamente.'
    }

    if (mensagem.includes('duplicate key') || mensagem.includes('already exists')) {
      return 'Esse cadastro já existe. Verifique os dados informados e tente novamente.'
    }

    if (mensagem.includes('violates foreign key constraint')) {
      return 'Não foi possível salvar porque há uma ligação obrigatória faltando no banco de dados. Verifique se a igreja, classe ou usuário vinculado existe.'
    }

    if (mensagem.includes('violates row-level security') || mensagem.includes('row-level security')) {
      return 'Você não tem permissão para realizar esta ação. Verifique se está logado com o perfil correto.'
    }

    if (mensagem.includes('invalid input syntax')) {
      return 'Algum campo foi preenchido com um formato inválido. Confira números, datas e campos obrigatórios.'
    }

    if (mensagem.includes('failed to fetch') || mensagem.includes('networkerror')) {
      return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
    }

    if (mensagem.includes('jwt') || mensagem.includes('token')) {
      return 'Sua sessão expirou. Saia do sistema e entre novamente.'
    }

    if (mensagem.includes('auth')) {
      return 'Não foi possível confirmar seu login. Saia do sistema e entre novamente.'
    }

    return mensagemPadrao
  }

  function mostrarErroSistema(erro, mensagemPadrao = 'Não foi possível concluir a operação.') {
    console.error(erro)
    alert(traduzirErroSistema(erro, mensagemPadrao))
  }

  function igrejaEstaEmTestePiloto() {
    return igrejaAtualPiloto?.status_piloto === 'teste'
  }

  function formatarDataHoraFeedback(valor) {
    if (!valor) {
      return ''
    }

    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(valor))
    } catch {
      return valor
    }
  }

  async function carregarFeedbacksDaIgreja(igrejaAtualId = buscarIgrejaIdAtual()) {
    if (!igrejaAtualId) {
      return
    }

    const { data, error } = await supabase
      .from('feedbacks_piloto')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error(error)
      return
    }

    setFeedbacksIgreja(data || [])
  }

  async function carregarFeedbacksAdmin() {
    if (!usuarioEhAdminSistema()) {
      return
    }

    const { data, error } = await supabase
      .from('feedbacks_piloto')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(80)

    if (error) {
      console.error(error)
      return
    }

    setFeedbacksAdmin(data || [])
  }

  async function enviarFeedbackPiloto(event) {
    event.preventDefault()

    if (!igrejaEstaEmTestePiloto()) {
      alert('A área de sugestões está disponível para igrejas liberadas na plataforma.')
      return
    }

    if (!feedbackPiloto.mensagem.trim()) {
      alert('Escreva sua mensagem antes de enviar.')
      return
    }

    setCarregandoFeedback(true)

    const { error } = await supabase.from('feedbacks_piloto').insert({
      igreja_id: buscarIgrejaIdAtual(),
      user_id: sessao?.user?.id || null,
      nome_usuario: perfilUsuario?.nome || sessao?.user?.email || 'Usuário',
      email_usuario: perfilUsuario?.email || sessao?.user?.email || '',
      perfil_usuario: perfilUsuario?.perfil || '',
      tipo: feedbackPiloto.tipo,
      mensagem: feedbackPiloto.mensagem.trim(),
      lido: false,
    })

    setCarregandoFeedback(false)

    if (error) {
      mostrarErroSistema(error, 'Não foi possível enviar sua mensagem.')
      return
    }

    setFeedbackPiloto({ tipo: 'sugestao', mensagem: '' })
    setFormularioSugestaoAberto(false)
    await carregarFeedbacksDaIgreja()
    alert('Mensagem enviada com sucesso. Obrigado por ajudar a melhorar a plataforma!')
  }

  async function marcarFeedbackComoLido(feedbackId) {
    if (!usuarioEhAdminSistema()) {
      return
    }

    const { error } = await supabase
      .from('feedbacks_piloto')
      .update({ lido: true, lido_em: new Date().toISOString() })
      .eq('id', feedbackId)

    if (error) {
      mostrarErroSistema(error, 'Não foi possível marcar a mensagem como lida.')
      return
    }

    await carregarFeedbacksAdmin()
  }

  function abrirRespostaFeedback(feedback) {
    setFeedbackRespondendoId(feedback.id)
    setRespostaFeedbackAdmin(feedback.resposta_admin || '')
  }

  function cancelarRespostaFeedback() {
    setFeedbackRespondendoId(null)
    setRespostaFeedbackAdmin('')
  }

  function buscarIgrejaDoFeedback(feedback) {
    return igrejasAdmin.find(
      (item) => Number(item.id) === Number(feedback.igreja_id)
    )
  }

  function buscarWhatsAppFeedback(feedback) {
    const igreja = buscarIgrejaDoFeedback(feedback)

    return (
      igreja?.responsavel_whatsapp ||
      igreja?.telefone ||
      feedback.whatsapp_usuario ||
      ''
    )
  }

  function montarMensagemRespostaFeedback(feedback) {
    const nome = feedback.nome_usuario || 'irmão(ã)'
    const resposta = feedback.resposta_admin || respostaFeedbackAdmin

    return `Paz do Senhor, ${nome}!

Obrigado pela mensagem enviada sobre o EBD Fiel.

Resposta da equipe:
${resposta}

Seguimos à disposição para ajudar no uso da plataforma.

EBD Fiel — Fiel à Palavra, organizado para servir melhor.`
  }

  async function salvarRespostaFeedback(feedback) {
    if (!usuarioEhAdminSistema()) {
      return
    }

    if (!respostaFeedbackAdmin.trim()) {
      alert('Escreva a resposta antes de salvar.')
      return
    }

    setEnviandoRespostaFeedback(true)

    const { error } = await supabase
      .from('feedbacks_piloto')
      .update({
        resposta_admin: respostaFeedbackAdmin.trim(),
        respondido_em: new Date().toISOString(),
        respondido_por: sessao?.user?.email || 'Administrador',
        lido: true,
        lido_em: feedback.lido_em || new Date().toISOString(),
      })
      .eq('id', feedback.id)

    setEnviandoRespostaFeedback(false)

    if (error) {
      mostrarErroSistema(error, 'Não foi possível salvar a resposta da mensagem.')
      return
    }

    setFeedbackRespondendoId(null)
    setRespostaFeedbackAdmin('')
    await carregarFeedbacksAdmin()
    alert('Resposta salva. A igreja verá a resposta na área de mensagens.')
  }

  async function registrarNotificacaoFeedback(feedbackId) {
    await supabase
      .from('feedbacks_piloto')
      .update({ notificado_em: new Date().toISOString() })
      .eq('id', feedbackId)
  }

  async function copiarRespostaFeedback(feedback) {
    const mensagem = montarMensagemRespostaFeedback(feedback)

    try {
      await navigator.clipboard.writeText(mensagem)
      await registrarNotificacaoFeedback(feedback.id)
      await carregarFeedbacksAdmin()
      alert('Mensagem copiada. Agora cole no WhatsApp ou e-mail da pessoa.')
    } catch {
      alert(mensagem)
    }
  }

  async function enviarRespostaEmailFeedback(feedback) {
    const emailDestino = feedback.email_usuario

    if (!emailDestino) {
      alert('Esta mensagem não possui e-mail vinculado.')
      return
    }

    const assunto = encodeURIComponent('Resposta à sua mensagem no EBD Fiel')
    const corpo = encodeURIComponent(montarMensagemRespostaFeedback(feedback))

    await registrarNotificacaoFeedback(feedback.id)
    await carregarFeedbacksAdmin()

    window.location.href = `mailto:${emailDestino}?subject=${assunto}&body=${corpo}`
  }

  async function enviarRespostaWhatsAppFeedback(feedback) {
    const telefone = buscarWhatsAppFeedback(feedback)
    const apenasNumeros = String(telefone || '').replace(/\D/g, '')

    if (!apenasNumeros) {
      alert('Não encontrei WhatsApp/telefone vinculado a esta mensagem. Use o botão copiar mensagem ou enviar e-mail.')
      return
    }

    const telefoneComPais = apenasNumeros.length <= 11 ? `55${apenasNumeros}` : apenasNumeros
    const mensagem = encodeURIComponent(montarMensagemRespostaFeedback(feedback))

    await registrarNotificacaoFeedback(feedback.id)
    await carregarFeedbacksAdmin()

    window.open(`https://wa.me/${telefoneComPais}?text=${mensagem}`, '_blank')
  }

  function buscarNomeIgrejaFeedback(feedback) {
    const igreja = igrejasAdmin.find(
      (item) => Number(item.id) === Number(feedback.igreja_id)
    )

    return (
      igreja?.nome_igreja ||
      igreja?.nome ||
      feedback.nome_igreja ||
      `Igreja ID ${feedback.igreja_id}`
    )
  }

  function contarFeedbacksNaoLidos() {
    return feedbacksAdmin.filter((feedback) => !feedback.lido).length
  }

  function usuarioEhSecretaria() {
    const perfilAtual = perfilUsuarioRef.current || perfilUsuario

    if (usuarioEhAdminSistema() && !perfilAtual?.igreja_id) {
      return false
    }

    return perfilAtual?.perfil !== 'professor'
  }

  function buscarClassesVinculadasAoProfessor(perfilId = perfilUsuario?.id) {
    const ids = vinculosProfessores
      .filter((vinculo) => Number(vinculo.perfil_usuario_id) === Number(perfilId) && vinculo.ativo !== false)
      .map((vinculo) => Number(vinculo.classe_id))
      .filter(Boolean)

    if (ids.length === 0 && perfilUsuario?.classe_id && Number(perfilId) === Number(perfilUsuario?.id)) {
      return [Number(perfilUsuario.classe_id)]
    }

    return [...new Set(ids)]
  }

  function buscarNomesClassesDoProfessor(perfilId, classeIdFallback = null) {
    let ids = buscarClassesVinculadasAoProfessor(perfilId)

    if (ids.length === 0 && classeIdFallback) {
      ids = [Number(classeIdFallback)]
    }

    return ids
      .map((classeId) => buscarNomeClasse(classeId))
      .filter(Boolean)
      .join(', ')
  }

  function professorPodeAcessarClasse(classeId) {
    if (!usuarioEhProfessor()) {
      return true
    }

    return buscarClassesVinculadasAoProfessor().includes(Number(classeId))
  }

  function buscarClasseDoProfessorId() {
    return buscarClassesVinculadasAoProfessor()[0] || Number(perfilUsuario?.classe_id || 0)
  }

  function podeGerenciarCadastros() {
    return usuarioEhSecretaria()
  }

  function menuPermitidoParaUsuario(item) {
    if (item.apenasAdminSistema && !usuarioEhAdminSistema()) {
      return false
    }

    if (item.apenasSecretaria && !usuarioEhSecretaria()) {
      return false
    }

    return true
  }

  async function buscarTodosOsDados(sessaoAtual = sessaoRef.current, igrejaSuporteForcada = null) {
    if (!sessaoAtual?.user?.id) {
      throw new Error('Não foi possível confirmar sua sessão. Saia e entre novamente no sistema.')
    }

    const emailSessaoAtual = String(sessaoAtual?.user?.email || '').toLowerCase()
    const igrejaSuporteSelecionada = igrejaSuporteForcada || recuperarContextoSuporteAdminAtual()
    const suporteAdminDeveSerPreservado = Boolean(
      igrejaSuporteSelecionada?.id && emailsAdminSistema.includes(emailSessaoAtual)
    )

    // v76: não limpar classes/alunos/chamadas antes do retorno do Supabase.
    // Em celulares e redes mais lentas, a limpeza antecipada fazia a tela aparecer
    // zerada durante atualizações, troca de versão ou novo login. Os dados antigos
    // permanecem visíveis até os dados atualizados chegarem com sucesso.

    const { data: perfilBanco, error: erroPerfil } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .eq('user_id', sessaoAtual.user.id)
      .maybeSingle()

    if (erroPerfil) {
      throw erroPerfil
    }

    let perfilAtual = perfilBanco
    const ehAdminSessaoAtual =
      emailsAdminSistema.includes(emailSessaoAtual) ||
      perfilBanco?.perfil === 'admin_sistema'

    if (ehAdminSessaoAtual && igrejaSuporteSelecionada?.id) {
      const igrejaSuporteNormalizada = manterContextoSuporteAdmin(
        igrejaSuporteSelecionada,
        sessaoAtual,
        {
          forcarPainel: paginaAtualRef.current === 'administracao',
        }
      )

      perfilAtual = montarPerfilSuporteAdmin(igrejaSuporteNormalizada, sessaoAtual)
    }

    if (ehAdminSessaoAtual && !igrejaSuporteSelecionada?.id) {
      const perfilAdminSistema = {
        ...perfilBanco,
        id: perfilBanco?.id || null,
        user_id: sessaoAtual.user.id,
        nome: perfilBanco?.nome || 'Administrador do sistema',
        email: emailSessaoAtual,
        perfil: 'admin_sistema',
        igreja_id: Number(perfilBanco?.igreja_id || 19),
        classe_id: null,
      }

      definirPerfilUsuario(perfilAdminSistema)
      setIgrejaId(Number(perfilAdminSistema.igreja_id || 19))
      definirIgrejaSuporteAdmin(null)
      setIgrejaAtualPiloto(null)
      setClasses([])
      setAlunos([])
      setChamadasSalvas([])
      setChamadasProfessores([])
      setVinculosProfessores([])
      setPerfisIgreja([])
      definirPaginaAtual('administracao')

      const igrejasAdminBanco = await buscarIgrejasAdminBanco()
      setIgrejasAdmin(igrejasAdminBanco || [])

      const { data: acessosAdminBanco, error: erroAcessosAdmin } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .order('nome', { ascending: true })

      if (erroAcessosAdmin) {
        console.error(erroAcessosAdmin)
      } else {
        setAcessosAdmin(acessosAdminBanco || [])
      }

      const { data: feedbacksAdminBanco, error: erroFeedbacksAdmin } = await supabase
        .from('feedbacks_piloto')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(80)

      if (erroFeedbacksAdmin) {
        console.error(erroFeedbacksAdmin)
      } else {
        setFeedbacksAdmin(feedbacksAdminBanco || [])
      }

      await carregarCadastrosIncompletosAdmin()

      setCarregando(false)
      return
    }

    if (!perfilAtual?.igreja_id) {
      if (ehAdminSessaoAtual && igrejaSuporteSelecionada?.id) {
        perfilAtual = {
          id: null,
          user_id: sessaoAtual.user.id,
          nome: 'Administrador do sistema',
          email: emailSessaoAtual,
          perfil: 'secretaria',
          igreja_id: Number(igrejaSuporteSelecionada.id),
          classe_id: null,
          modo_suporte_admin: true,
        }

        manterContextoSuporteAdmin(igrejaSuporteSelecionada, sessaoAtual, {
          forcarPainel: paginaAtualRef.current === 'administracao',
        })
      } else if (ehAdminSessaoAtual) {
        const perfilAdminSistema = {
          id: null,
          user_id: sessaoAtual.user.id,
          nome: 'Administrador do sistema',
          email: emailSessaoAtual,
          perfil: 'admin_sistema',
          igreja_id: null,
          classe_id: null,
        }

        definirPerfilUsuario(perfilAdminSistema)
        setIgrejaId(null)
        setClasses([])
        setAlunos([])
        setChamadasSalvas([])
        setChamadasProfessores([])
        setVinculosProfessores([])
        definirPaginaAtual('administracao')

        const igrejasAdminBanco = await buscarIgrejasAdminBanco()
        setIgrejasAdmin(igrejasAdminBanco || [])

        const { data: acessosAdminBanco, error: erroAcessosAdmin } = await supabase
          .from('perfis_usuarios')
          .select('*')
          .order('nome', { ascending: true })

        if (erroAcessosAdmin) {
          console.error(erroAcessosAdmin)
        } else {
          setAcessosAdmin(acessosAdminBanco || [])
        }

        const { data: feedbacksAdminBanco, error: erroFeedbacksAdmin } = await supabase
          .from('feedbacks_piloto')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(80)

        if (erroFeedbacksAdmin) {
          console.error(erroFeedbacksAdmin)
        } else {
          setFeedbacksAdmin(feedbacksAdminBanco || [])
        }

        await carregarCadastrosIncompletosAdmin()

        setCarregando(false)
        return
      } else {
        definirPerfilUsuario(null)
        setIgrejaId(null)
        setTelaPublica('login')
        throw new Error(
          'Cadastro incompleto ou ainda não liberado. Entre em contato com a administração.'
        )
      }
    }

    const igrejaAtualId = Number(perfilAtual.igreja_id)

    definirPerfilUsuario(perfilAtual)
    setIgrejaId(igrejaAtualId)

    const { data: vinculosBanco, error: erroVinculos } = await supabase
      .from('classes_professores')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .eq('ativo', true)

    if (erroVinculos) {
      throw erroVinculos
    }

    const idsClassesPermitidas =
      perfilAtual?.perfil === 'professor'
        ? [
            ...new Set(
              (vinculosBanco || [])
                .filter((vinculo) => Number(vinculo.perfil_usuario_id) === Number(perfilAtual.id))
                .map((vinculo) => Number(vinculo.classe_id))
                .filter(Boolean)
            ),
          ]
        : []

    if (
      perfilAtual?.perfil === 'professor' &&
      idsClassesPermitidas.length === 0 &&
      perfilAtual?.classe_id
    ) {
      idsClassesPermitidas.push(Number(perfilAtual.classe_id))
    }

    const classePermitidaId =
      perfilAtual?.perfil === 'professor'
        ? idsClassesPermitidas[0] || null
        : null

    let consultaClasses = supabase
      .from('classes')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .order('id', { ascending: true })

    if (perfilAtual.perfil === 'professor') {
      if (idsClassesPermitidas.length > 0) {
        consultaClasses = consultaClasses.in('id', idsClassesPermitidas)
      } else {
        consultaClasses = consultaClasses.eq('id', -1)
      }
    }

    let { data: classesBanco, error: erroClasses } = await consultaClasses

    if (erroClasses) {
      throw erroClasses
    }

    if ((!classesBanco || classesBanco.length === 0) && perfilAtual.perfil === 'secretaria') {
      await inserirDadosIniciais(igrejaAtualId, sessaoAtual)

      let novaConsultaClasses = supabase
        .from('classes')
        .select('*')
        .eq('igreja_id', igrejaAtualId)
        .order('id', { ascending: true })

      if (perfilAtual.perfil === 'professor') {
        if (idsClassesPermitidas.length > 0) {
          novaConsultaClasses = novaConsultaClasses.in('id', idsClassesPermitidas)
        } else {
          novaConsultaClasses = novaConsultaClasses.eq('id', -1)
        }
      }

      const resultadoClasses = await novaConsultaClasses
      classesBanco = resultadoClasses.data
      erroClasses = resultadoClasses.error

      if (erroClasses) {
        throw erroClasses
      }
    }

    let consultaAlunos = supabase
      .from('alunos')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .order('id', { ascending: true })

    if (perfilAtual.perfil === 'professor') {
      if (idsClassesPermitidas.length > 0) {
        consultaAlunos = consultaAlunos.in('classe_id', idsClassesPermitidas)
      } else {
        consultaAlunos = consultaAlunos.eq('classe_id', -1)
      }
    }

    let { data: alunosBanco, error: erroAlunos } = await consultaAlunos

    if (erroAlunos) {
      throw erroAlunos
    }

    if (perfilAtual.perfil === 'secretaria') {
      const criouProfessoresDasClasses = await migrarProfessoresDasClasses(
        igrejaAtualId,
        classesBanco || [],
        alunosBanco || [],
        sessaoAtual
      )

      if (criouProfessoresDasClasses) {
        const { data: alunosAtualizados, error: erroAlunosAtualizados } =
          await consultaAlunos

        if (erroAlunosAtualizados) {
          throw erroAlunosAtualizados
        }

        alunosBanco = alunosAtualizados || []
      }
    }

    let consultaChamadas = supabase
      .from('chamadas')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .order('id', { ascending: true })

    if (perfilAtual.perfil === 'professor') {
      if (idsClassesPermitidas.length > 0) {
        consultaChamadas = consultaChamadas.in('classe_id', idsClassesPermitidas)
      } else {
        consultaChamadas = consultaChamadas.eq('classe_id', -1)
      }
    }

    const { data: chamadasBanco, error: erroChamadas } = await consultaChamadas

    if (erroChamadas) {
      throw erroChamadas
    }

    let chamadasProfessoresBanco = []

    if (perfilAtual.perfil === 'secretaria') {
      const { data: chamadasProfessoresEncontradas, error: erroChamadasProfessores } =
        await supabase
          .from('chamadas_professores')
          .select('*')
          .eq('igreja_id', igrejaAtualId)
          .order('id', { ascending: true })

      if (erroChamadasProfessores) {
        throw erroChamadasProfessores
      }

      chamadasProfessoresBanco = chamadasProfessoresEncontradas || []
    }

    let perfisBanco = []

    if (perfilAtual.perfil === 'secretaria') {
      const { data: perfisEncontrados, error: erroPerfis } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .eq('igreja_id', igrejaAtualId)
        .order('nome', { ascending: true })

      if (erroPerfis) {
        throw erroPerfis
      }

      perfisBanco = perfisEncontrados || []
    } else {
      perfisBanco = [perfilAtual]
    }

    const { data: configuracoesBanco, error: erroConfiguracoes } = await supabase
      .from('configuracoes_igreja')
      .select('*')
      .eq('igreja_id', igrejaAtualId)
      .order('created_at', { ascending: true })

    if (erroConfiguracoes) {
      throw erroConfiguracoes
    }

    const { data: igrejaPilotoBanco, error: erroIgrejaPiloto } = await supabase
      .from('igrejas')
      .select('*')
      .eq('id', igrejaAtualId)
      .maybeSingle()

    if (erroIgrejaPiloto) {
      console.error(erroIgrejaPiloto)
    }

    const statusPilotoAtual = String(igrejaPilotoBanco?.status_piloto || '').toLowerCase()
    const igrejaLiberadaParaAcesso = [
      'teste',
      'ativa',
      'ativo',
      'aprovada',
      'aprovado',
      'liberada',
      'liberado',
    ].includes(statusPilotoAtual)

    if (
      !ehAdminSessaoAtual &&
      !perfilAtual?.modo_suporte_admin &&
      !igrejaLiberadaParaAcesso
    ) {
      definirPerfilUsuario(null)
      setIgrejaId(null)
      setIgrejaAtualPiloto(null)
      setClasses([])
      setAlunos([])
      setChamadasSalvas([])
      setChamadasProfessores([])
      setVinculosProfessores([])
      setTelaPublica('login')
      throw new Error(
        statusPilotoAtual === 'pendente'
          ? 'Seu cadastro foi recebido e ainda está aguardando aprovação do administrador.'
          : 'Seu acesso ainda não está liberado. Entre em contato com a administração.'
      )
    }

    setIgrejaAtualPiloto(igrejaPilotoBanco || null)

    if (igrejaPilotoBanco?.status_piloto === 'teste') {
      await carregarFeedbacksDaIgreja(igrejaAtualId)
    } else {
      setFeedbacksIgreja([])
    }

    setClasses(
      (classesBanco || []).map((classe) => ({
        id: Number(classe.id),
        nome: classe.nome,
        professor: classe.professor,
      }))
    )

    setAlunos(
      (alunosBanco || []).map((aluno) => ({
        id: Number(aluno.id),
        nome: aluno.nome,
        classeId: Number(aluno.classe_id),
        telefone: aluno.telefone || '',
        dataNascimento: aluno.data_nascimento || '',
        tipoPessoa: aluno.tipo_pessoa || 'aluno',
      }))
    )

    setPerfisIgreja(perfisBanco)
    setVinculosProfessores(vinculosBanco || [])

    setChamadasProfessores(
      (chamadasProfessoresBanco || []).map((chamada) => ({
        id: Number(chamada.id),
        data: chamada.data,
        totalProfessores: Number(chamada.total_professores || 0),
        totalPresentes: Number(chamada.total_presentes || 0),
        totalFaltas: Number(chamada.total_faltas || 0),
        totalJustificadas: Number(chamada.total_justificadas || 0),
        observacoes: chamada.observacoes || '',
        registros: Array.isArray(chamada.registros) ? chamada.registros : [],
      }))
    )

    setChamadasSalvas(
      (chamadasBanco || []).map((chamada) => ({
        id: Number(chamada.id),
        data: chamada.data,
        classeId: Number(chamada.classe_id),
        matricula: Number(chamada.matricula || 0),
        totalPresentes: Number(chamada.total_presentes || 0),
        totalFaltas: Number(chamada.total_faltas || 0),
        visitantes: Number(chamada.visitantes || 0),
        biblias: Number(chamada.biblias || 0),
        revistas: Number(chamada.revistas || 0),
        ofertas: Number(chamada.ofertas || 0),
        totalGeralClasse: Number(chamada.total_geral_classe || 0),
        registros: Array.isArray(chamada.registros) ? chamada.registros : [],
      }))
    )

    if (classePermitidaId) {
      setClasseChamadaId(String(classePermitidaId))
    }

    const configuracaoAtual = configuracoesBanco?.[0]

    setConfiguracaoIgreja({
      id: configuracaoAtual?.id || null,
      nome_igreja:
        configuracaoAtual?.nome_igreja ||
        igrejaPilotoBanco?.nome_igreja ||
        igrejaPilotoBanco?.nome ||
        '',
      congregacao: configuracaoAtual?.congregacao || igrejaPilotoBanco?.congregacao || '',
      pastor_dirigente:
        configuracaoAtual?.pastor_dirigente || igrejaPilotoBanco?.pastor_dirigente || '',
      superintendente_ebd:
        configuracaoAtual?.superintendente_ebd || igrejaPilotoBanco?.superintendente_ebd || '',
      cidade: configuracaoAtual?.cidade || igrejaPilotoBanco?.cidade || '',
      estado: configuracaoAtual?.estado || igrejaPilotoBanco?.estado || '',
      bairro: configuracaoAtual?.bairro || igrejaPilotoBanco?.bairro || '',
      endereco: configuracaoAtual?.endereco || igrejaPilotoBanco?.endereco || '',
      telefone: configuracaoAtual?.telefone || igrejaPilotoBanco?.telefone || '',
      email: configuracaoAtual?.email || igrejaPilotoBanco?.email || '',
    })
  }

  function converterNumero(valor) {
    const numero = Number(valor)
    return Number.isNaN(numero) ? 0 : numero
  }

  function buscarNomeClasse(classeId) {
    const classeEncontrada = classes.find(
      (classe) => classe.id === Number(classeId)
    )

    return classeEncontrada ? classeEncontrada.nome : 'Sem classe'
  }

  function buscarProfessoresDaClasse(classeId) {
    return professoresSomente()
      .filter((professor) => professor.classeId === Number(classeId))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }

  function buscarTextoProfessoresDaClasse(classeId) {
    const professoresDaClasse = buscarProfessoresDaClasse(classeId)

    if (professoresDaClasse.length === 0) {
      return 'Nenhum professor vinculado'
    }

    return professoresDaClasse.map((professor) => professor.nome).join(', ')
  }

  function buscarDataAtual() {
    return new Date().toLocaleDateString('pt-BR')
  }

  function buscarDataUltimaChamada() {
    if (chamadasSalvas.length === 0) {
      return buscarDataAtual()
    }

    const ultimaChamada = chamadasSalvas[chamadasSalvas.length - 1]
    return ultimaChamada.data || buscarDataAtual()
  }

  function formatarDataRelatorio(dataTexto) {
    if (!dataTexto) {
      return buscarDataAtual()
    }

    const partes = dataTexto.split('/')

    if (partes.length !== 3) {
      return dataTexto
    }

    const dia = Number(partes[0])
    const mes = Number(partes[1]) - 1
    const ano = Number(partes[2])

    const data = new Date(ano, mes, dia)

    if (Number.isNaN(data.getTime())) {
      return dataTexto
    }

    const dataFormatada = data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)
  }

  function formatarDataCurtaRelatorio(dataTexto) {
    if (!dataTexto) {
      return buscarDataAtual()
    }

    const texto = String(dataTexto).trim()

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      return texto
    }

    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (iso) {
      return `${iso[3]}/${iso[2]}/${iso[1]}`
    }

    const partes = texto.split('/')

    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0')
      const mes = partes[1].padStart(2, '0')
      const ano = partes[2]
      return `${dia}/${mes}/${ano}`
    }

    const data = new Date(texto)

    if (!Number.isNaN(data.getTime())) {
      return data.toLocaleDateString('pt-BR')
    }

    return texto
  }

  function buscarNomeIgrejaParaExibicao() {
    return configuracaoIgreja.nome_igreja.trim() || 'EBD Fiel'
  }

  function montarEnderecoIgreja() {
    return [
      configuracaoIgreja.endereco,
      configuracaoIgreja.bairro,
      configuracaoIgreja.cidade,
      configuracaoIgreja.estado,
    ]
      .filter((valor) => valor && valor.trim())
      .join(' - ')
  }

  function alunosSomente() {
    return alunos.filter((aluno) => (aluno.tipoPessoa || 'aluno') === 'aluno')
  }

  function professoresSomente() {
    return alunos.filter((aluno) => aluno.tipoPessoa === 'professor')
  }

  function calcularMatriculaDaClasse(classeId) {
    return alunos.filter(
      (aluno) =>
        aluno.classeId === Number(classeId) &&
        (aluno.tipoPessoa || 'aluno') === 'aluno'
    ).length
  }

  function buscarAlunosDaClasse(classeId) {
    return alunos
      .filter(
        (aluno) =>
          aluno.classeId === Number(classeId) &&
          (aluno.tipoPessoa || 'aluno') === 'aluno'
      )
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
  }

  function alternarAlunosDaClasse(classeId) {
    setClasseAlunosAbertaId((classeAtualId) =>
      Number(classeAtualId) === Number(classeId) ? null : Number(classeId)
    )
  }

  function formatarMoeda(valor) {
    return converterNumero(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function calcularTotalPresentes() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.totalPresentes),
      0
    )
  }

  function calcularTotalFaltas() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.totalFaltas),
      0
    )
  }

  function calcularTotalVisitantes() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.visitantes),
      0
    )
  }

  function calcularTotalBiblias() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.biblias),
      0
    )
  }

  function calcularTotalRevistas() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.revistas),
      0
    )
  }

  function calcularTotalOfertas() {
    return chamadasSalvas.reduce(
      (total, chamada) => total + converterNumero(chamada.ofertas),
      0
    )
  }

  function calcularFrequenciaGeral() {
    const presentes = calcularTotalPresentes()
    const faltas = calcularTotalFaltas()
    const total = presentes + faltas

    if (total === 0) {
      return 0
    }

    return Math.round((presentes / total) * 100)
  }


  function calcularPercentualSeguro(parte, total) {
    const parteNumero = converterNumero(parte)
    const totalNumero = converterNumero(total)

    if (totalNumero <= 0) {
      return 0
    }

    return Math.round((parteNumero / totalNumero) * 100)
  }

  function buscarChamadasDaClasse(classeId) {
    return chamadasSalvas.filter(
      (chamada) => Number(chamada.classeId) === Number(classeId)
    )
  }

  function montarDashboardPorClasse() {
    return classes.map((classe) => {
      const chamadasDaClasse = buscarChamadasDaClasse(classe.id)
      const presentes = chamadasDaClasse.reduce(
        (total, chamada) => total + converterNumero(chamada.totalPresentes),
        0
      )
      const faltas = chamadasDaClasse.reduce(
        (total, chamada) => total + converterNumero(chamada.totalFaltas),
        0
      )
      const total = presentes + faltas

      return {
        classe,
        matricula: calcularMatriculaDaClasse(classe.id),
        chamadas: chamadasDaClasse.length,
        presentes,
        faltas,
        frequencia: calcularPercentualSeguro(presentes, total),
      }
    })
  }

  function montarResumoFinanceiroEbd() {
    const chamadasComOferta = chamadasSalvas.filter(
      (chamada) => converterNumero(chamada.ofertas) > 0
    )
    const totalOfertas = calcularTotalOfertas()
    const mediaPorChamada = chamadasComOferta.length > 0
      ? totalOfertas / chamadasComOferta.length
      : 0

    const porClasse = classes.map((classe) => {
      const chamadasDaClasse = buscarChamadasDaClasse(classe.id)
      const total = chamadasDaClasse.reduce(
        (soma, chamada) => soma + converterNumero(chamada.ofertas),
        0
      )

      return {
        classe,
        chamadas: chamadasDaClasse.length,
        total,
      }
    })

    return {
      totalOfertas,
      mediaPorChamada,
      chamadasComOferta: chamadasComOferta.length,
      porClasse,
    }
  }

  function buscarAlunoHistoricoSelecionado() {
    return alunosSomente().find(
      (aluno) => String(aluno.id) === String(alunoHistoricoSelecionadoId)
    ) || null
  }

  function montarHistoricoDoAluno(alunoId) {
    const aluno = alunosSomente().find((item) => String(item.id) === String(alunoId))

    if (!aluno) {
      return null
    }

    const registros = []

    chamadasSalvas.forEach((chamada) => {
      const registro = (chamada.registros || []).find(
        (item) => String(item.alunoId ?? item.aluno_id) === String(aluno.id)
      )

      if (registro) {
        registros.push({
          data: chamada.data,
          classe: buscarNomeClasse(chamada.classeId || aluno.classeId),
          status: registro.status === 'presente' ? 'Presente' : 'Faltou',
          visitantes: chamada.visitantes || 0,
          biblias: chamada.biblias || 0,
          revistas: chamada.revistas || 0,
        })
      }
    })

    const presentes = registros.filter((registro) => registro.status === 'Presente').length
    const faltas = registros.filter((registro) => registro.status !== 'Presente').length

    return {
      aluno,
      registros: registros.reverse(),
      presentes,
      faltas,
      frequencia: calcularPercentualSeguro(presentes, registros.length),
    }
  }

  function montarMensagemFaltosoWhatsApp(item) {
    const nomeIgreja = buscarNomeIgrejaParaExibicao()
    return [
      `Olá, paz do Senhor! Aqui é da secretaria da EBD ${nomeIgreja}.`,
      `Sentimos a falta de ${item.aluno.nome} na Escola Bíblica Dominical.`,
      `Registramos ${item.motivo.toLowerCase()} e queremos saber se está tudo bem.`,
      'Conte conosco. Será uma alegria receber vocês novamente na próxima EBD.',
    ].join('\n')
  }

  function abrirWhatsAppFaltoso(item) {
    const telefone = limparNumeroWhatsApp(item.aluno.telefone || '')

    if (!telefone) {
      alert('Este aluno não possui telefone/WhatsApp cadastrado.')
      return
    }

    const mensagem = encodeURIComponent(montarMensagemFaltosoWhatsApp(item))
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, '_blank', 'noopener,noreferrer')
  }

  function copiarMensagemFaltoso(item) {
    const mensagem = montarMensagemFaltosoWhatsApp(item)

    if (navigator.clipboard) {
      navigator.clipboard.writeText(mensagem)
      alert('Mensagem copiada. Agora cole no WhatsApp do aluno/responsável.')
      return
    }

    window.prompt('Copie a mensagem abaixo:', mensagem)
  }

  function montarBackupLocalSeguro() {
    return {
      versao: 'v41-backup-local-seguro',
      geradoEm: new Date().toISOString(),
      igrejaId: buscarIgrejaIdAtual(),
      igreja: configuracaoIgreja,
      totais: {
        classes: classes.length,
        alunos: alunosSomente().length,
        professores: professoresSomente().length,
        chamadas: chamadasSalvas.length,
      },
      dados: {
        classes,
        alunos,
        chamadas: chamadasSalvas,
        chamadasProfessores,
        perfisIgreja,
        vinculosProfessores,
      },
      observacao:
        'Cópia de segurança exportada pelo painel da igreja. Não altera dados no Supabase e serve como arquivo de consulta em JSON.',
    }
  }

  function baixarBackupLocalSeguro() {
    const backup = montarBackupLocalSeguro()
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const data = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `backup-ebd-fiel-${buscarIgrejaIdAtual() || 'igreja'}-${data}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function copiarResumoAuditoriaLocal() {
    const linhas = [
      `Igreja: ${buscarNomeIgrejaParaExibicao()}`,
      `Igreja ID: ${buscarIgrejaIdAtual() || 'não identificado'}`,
      `Usuário: ${sessao?.user?.email || 'não identificado'}`,
      `Perfil: ${perfilUsuario?.perfil || 'não identificado'}`,
      `Classes: ${classes.length}`,
      `Alunos: ${alunosSomente().length}`,
      `Professores: ${professoresSomente().length}`,
      `Chamadas de alunos: ${chamadasSalvas.length}`,
      `Chamadas de professores: ${chamadasProfessores.length}`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    ]

    const texto = linhas.join('\n')

    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto)
      alert('Resumo de auditoria copiado.')
      return
    }

    window.prompt('Copie o resumo de auditoria:', texto)
  }


  function converterDataParaObjeto(dataTexto) {
    if (!dataTexto) {
      return null
    }

    const texto = String(dataTexto).trim()

    if (!texto) {
      return null
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      const [ano, mes, dia] = texto.split('-').map(Number)
      const data = new Date(ano, mes - 1, dia)
      return Number.isNaN(data.getTime()) ? null : data
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      const [dia, mes, ano] = texto.split('/').map(Number)
      const data = new Date(ano, mes - 1, dia)
      return Number.isNaN(data.getTime()) ? null : data
    }

    const data = new Date(texto)
    return Number.isNaN(data.getTime()) ? null : data
  }

  function chamadaEhDoMesAtual(chamada) {
    const data = converterDataParaObjeto(chamada?.data)

    if (!data) {
      return false
    }

    const hoje = new Date()
    return data.getFullYear() === hoje.getFullYear() && data.getMonth() === hoje.getMonth()
  }

  function formatarMesAtualExtenso() {
    return new Date().toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  }

  function calcularIdadePorDataNascimento(dataNascimento) {
    if (!dataNascimento) {
      return ''
    }

    const partes = String(dataNascimento).split('-')

    if (partes.length !== 3) {
      return ''
    }

    const hoje = new Date()
    const ano = Number(partes[0])
    const mes = Number(partes[1]) - 1
    const dia = Number(partes[2])

    if (!ano || Number.isNaN(mes) || !dia) {
      return ''
    }

    let idade = hoje.getFullYear() - ano
    const aniversarioEsteAno = new Date(hoje.getFullYear(), mes, dia)

    if (hoje < aniversarioEsteAno) {
      idade -= 1
    }

    return idade >= 0 ? idade : ''
  }

  function buscarAniversariantesDoMes() {
    const hoje = new Date()
    const mesAtual = hoje.getMonth() + 1

    return alunosSomente()
      .filter((aluno) => {
        const partes = String(aluno.dataNascimento || aluno.data_nascimento || '').split('-')
        return partes.length === 3 && Number(partes[1]) === mesAtual
      })
      .map((aluno) => ({
        ...aluno,
        classeNome: buscarNomeClasse(aluno.classeId ?? aluno.classe_id),
        dataNascimentoFormatada: formatarDataNascimento(aluno.dataNascimento || aluno.data_nascimento),
        idade: calcularIdadePorDataNascimento(aluno.dataNascimento || aluno.data_nascimento),
      }))
      .sort((a, b) => {
        const diaA = Number(String(a.dataNascimento || a.data_nascimento || '').split('-')[2] || 0)
        const diaB = Number(String(b.dataNascimento || b.data_nascimento || '').split('-')[2] || 0)
        return diaA - diaB || String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR')
      })
  }

  function montarMapaFrequenciaAlunos(filtrarMesAtual = true) {
    const mapa = new Map()

    alunosSomente().forEach((aluno) => {
      mapa.set(String(aluno.id), {
        aluno,
        classeNome: buscarNomeClasse(aluno.classeId ?? aluno.classe_id),
        presentes: 0,
        faltas: 0,
        total: 0,
        chamadas: [],
      })
    })

    chamadasSalvas
      .filter((chamada) => !filtrarMesAtual || chamadaEhDoMesAtual(chamada))
      .forEach((chamada) => {
        const dataChamada = converterDataParaObjeto(chamada.data)

        ;(chamada.registros || []).forEach((registro) => {
          const alunoId = String(registro.alunoId ?? registro.aluno_id ?? '')
          const item = mapa.get(alunoId)

          if (!item) {
            return
          }

          const status = String(registro.status || '').toLowerCase()
          const presente = status === 'presente'
          const falta = status === 'faltou' || status === 'falta' || status.includes('falt')

          if (!presente && !falta) {
            return
          }

          item.total += 1

          if (presente) {
            item.presentes += 1
          }

          if (falta) {
            item.faltas += 1
          }

          item.chamadas.push({
            data: dataChamada,
            dataTexto: chamada.data,
            status: presente ? 'presente' : 'faltou',
          })
        })
      })

    return mapa
  }

  function buscarDestaquesFrequencia() {
    return Array.from(montarMapaFrequenciaAlunos(true).values())
      .filter((item) => item.total > 0)
      .map((item) => ({
        ...item,
        frequencia: Math.round((item.presentes / item.total) * 100),
      }))
      .filter((item) => item.frequencia >= 80)
      .sort((a, b) =>
        b.frequencia - a.frequencia ||
        b.presentes - a.presentes ||
        String(a.aluno.nome || '').localeCompare(String(b.aluno.nome || ''), 'pt-BR')
      )
  }

  function calcularFaltasConsecutivas(chamadasAluno) {
    const chamadasOrdenadas = [...chamadasAluno]
      .filter((item) => item.data)
      .sort((a, b) => b.data.getTime() - a.data.getTime())

    let total = 0

    for (const chamada of chamadasOrdenadas) {
      if (chamada.status === 'faltou') {
        total += 1
      } else {
        break
      }
    }

    return total
  }

  function buscarAlertasDeFaltas() {
    return Array.from(montarMapaFrequenciaAlunos(false).values())
      .map((item) => {
        const chamadasDoMes = item.chamadas.filter((chamada) => {
          if (!chamada.data) return false
          const hoje = new Date()
          return chamada.data.getFullYear() === hoje.getFullYear() && chamada.data.getMonth() === hoje.getMonth()
        })

        const faltasMes = chamadasDoMes.filter((chamada) => chamada.status === 'faltou').length
        const faltasConsecutivas = calcularFaltasConsecutivas(item.chamadas)
        const ultimaChamada = [...item.chamadas]
          .filter((chamada) => chamada.data)
          .sort((a, b) => b.data.getTime() - a.data.getTime())[0]

        return {
          ...item,
          faltasMes,
          faltasConsecutivas,
          ultimaData: ultimaChamada?.dataTexto || '',
          motivo:
            faltasConsecutivas >= 2
              ? `${faltasConsecutivas} faltas consecutivas`
              : `${faltasMes} faltas no mês`,
        }
      })
      .filter((item) => item.faltasConsecutivas >= 2 || item.faltasMes >= 3)
      .sort((a, b) =>
        b.faltasConsecutivas - a.faltasConsecutivas ||
        b.faltasMes - a.faltasMes ||
        String(a.aluno.nome || '').localeCompare(String(b.aluno.nome || ''), 'pt-BR')
      )
  }

  function imprimirHtmlEmIframe(htmlDocumento, idIframe = 'iframe-impressao-relatorio-extra') {
    const iframeAnterior = document.getElementById(idIframe)

    if (iframeAnterior) {
      iframeAnterior.remove()
    }

    const iframe = document.createElement('iframe')
    iframe.id = idIframe
    iframe.title = 'Impressão EBD Fiel'
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'

    document.body.appendChild(iframe)

    const documentoIframe = iframe.contentWindow?.document

    if (!documentoIframe) {
      alert('Não foi possível preparar a impressão. Tente novamente.')
      iframe.remove()
      return
    }

    documentoIframe.open()
    documentoIframe.write(htmlDocumento)
    documentoIframe.close()

    const imprimirIframe = () => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } catch (error) {
        console.error('Erro ao imprimir relatório:', error)
        alert('Não foi possível abrir a impressão automaticamente. Tente novamente.')
      }

      setTimeout(() => {
        iframe.remove()
      }, 1500)
    }

    iframe.onload = () => {
      setTimeout(imprimirIframe, 400)
    }

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        imprimirIframe()
      }
    }, 900)
  }

  function montarDocumentoRelatorioExtra(titulo, subtitulo, conteudoHtml, orientacao = 'portrait') {
    const nomeIgreja = configuracaoIgreja.nome_igreja || configuracaoIgreja.nome || 'EBD Fiel'
    const endereco = montarEnderecoIgreja()

    return `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escaparHtmlRelatorio(titulo)} - EBD Fiel</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #fff;
            }
            .folha-extra {
              width: 100%;
              max-width: ${orientacao === 'landscape' ? '1120px' : '900px'};
              margin: 0 auto;
            }
            .cabecalho-extra {
              text-align: center;
              margin-bottom: 18px;
              padding-bottom: 10px;
              border-bottom: 2px solid #103058;
            }
            .cabecalho-extra img {
              width: 64px;
              height: 64px;
              object-fit: contain;
              display: block;
              margin: 0 auto 8px;
            }
            .cabecalho-extra h1 {
              margin: 0 0 6px;
              font-size: 22px;
              color: #103058;
              text-transform: uppercase;
            }
            .cabecalho-extra h2 {
              margin: 0 0 5px;
              font-size: 16px;
              color: #111827;
            }
            .cabecalho-extra p {
              margin: 2px 0;
              font-size: 12px;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 7px;
              vertical-align: middle;
              word-break: break-word;
            }
            th {
              background: #e0f2fe;
              color: #103058;
              text-align: left;
              font-weight: 800;
            }
            td.numero, th.numero {
              width: 44px;
              text-align: center;
            }
            .texto-centro { text-align: center; }
            .vazio {
              padding: 26px;
              border: 1px dashed #94a3b8;
              border-radius: 12px;
              text-align: center;
              color: #475569;
              font-weight: 700;
            }
            .cartoes-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
            }
            .cartao-aniversario {
              min-height: 210px;
              padding: 18px;
              border: 2px solid #f2b705;
              border-radius: 18px;
              background: linear-gradient(135deg, #fff7cc, #e0f7ff 70%, #ffffff);
              page-break-inside: avoid;
            }
            .cartao-aniversario h3 {
              margin: 0 0 10px;
              font-size: 20px;
              color: #103058;
            }
            .cartao-aniversario strong {
              display: block;
              margin: 10px 0;
              font-size: 24px;
              color: #111827;
            }
            .cartao-aniversario p {
              margin: 0 0 8px;
              font-size: 14px;
              line-height: 1.45;
            }
            .assinatura-cartao {
              margin-top: 14px !important;
              font-weight: 800;
              color: #103058;
            }
            @media print {
              body { padding: 0; }
              .folha-extra { max-width: none; }
              @page { size: A4 ${orientacao}; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <main class="folha-extra">
            <div class="cabecalho-extra">
              <img src="/logo-oficial-ebd-fiel.png" alt="Logo EBD Fiel" />
              <h1>${escaparHtmlRelatorio(nomeIgreja)}</h1>
              ${configuracaoIgreja.congregacao ? `<p>${escaparHtmlRelatorio(configuracaoIgreja.congregacao)}</p>` : ''}
              ${configuracaoIgreja.pastor_dirigente ? `<p>Dirigente: ${escaparHtmlRelatorio(configuracaoIgreja.pastor_dirigente)}</p>` : ''}
              ${endereco ? `<p>${escaparHtmlRelatorio(endereco)}</p>` : ''}
              <h2>${escaparHtmlRelatorio(titulo)}</h2>
              ${subtitulo ? `<p>${escaparHtmlRelatorio(subtitulo)}</p>` : ''}
            </div>
            ${conteudoHtml}
          </main>
        </body>
      </html>
    `
  }


  function mostrarRelatorioExtraNaTela(titulo, subtitulo, conteudoHtml, orientacao = 'portrait', idIframe = 'iframe-relatorio-extra') {
    setRelatorioExtraVisualizacao({
      titulo,
      subtitulo,
      conteudoHtml,
      orientacao,
      idIframe,
    })
    definirPaginaAtual('relatorios')

    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        document.getElementById('visualizacao-relatorio-extra')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 120)
    }
  }

  function imprimirRelatorioExtraVisualizado() {
    if (!relatorioExtraVisualizacao) {
      return
    }

    imprimirHtmlEmIframe(
      montarDocumentoRelatorioExtra(
        relatorioExtraVisualizacao.titulo,
        relatorioExtraVisualizacao.subtitulo,
        relatorioExtraVisualizacao.conteudoHtml,
        relatorioExtraVisualizacao.orientacao
      ),
      relatorioExtraVisualizacao.idIframe
    )
  }

  function abrirRelatorioAniversariantesSemana() {
    const aniversariantes = buscarAniversariantesDaSemana()

    const conteudo = aniversariantes.length > 0
      ? `
        <table>
          <thead>
            <tr>
              <th class="numero">Nº</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Classe/área</th>
              <th>Data</th>
              <th>Quando</th>
            </tr>
          </thead>
          <tbody>
            ${aniversariantes.map((pessoa, indice) => `
              <tr>
                <td class="numero">${indice + 1}</td>
                <td>${escaparHtmlRelatorio(pessoa.nome)}</td>
                <td>${escaparHtmlRelatorio(pessoa.tipo || '')}</td>
                <td>${escaparHtmlRelatorio(pessoa.detalhe || 'Sem informação')}</td>
                <td>${escaparHtmlRelatorio(formatarDataNascimento(pessoa.dataNascimento))}</td>
                <td>${escaparHtmlRelatorio(descreverAniversario(pessoa.dias))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<div class="vazio">Nenhum aniversariante encontrado para os próximos 7 dias.</div>'

    mostrarRelatorioExtraNaTela(
      'Aniversariantes da semana',
      'Pessoas com aniversário hoje ou nos próximos 7 dias.',
      conteudo,
      'portrait',
      'iframe-aniversariantes-semana'
    )
  }

  function abrirRelatorioAniversariantesMes() {
    const aniversariantes = buscarAniversariantesDoMes()

    const conteudo = aniversariantes.length > 0
      ? `
        <table>
          <thead>
            <tr>
              <th class="numero">Nº</th>
              <th>Nome</th>
              <th>Classe</th>
              <th>Data</th>
              <th>Idade</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            ${aniversariantes.map((aluno, indice) => `
              <tr>
                <td class="numero">${indice + 1}</td>
                <td>${escaparHtmlRelatorio(aluno.nome)}</td>
                <td>${escaparHtmlRelatorio(aluno.classeNome || 'Sem classe')}</td>
                <td>${escaparHtmlRelatorio(aluno.dataNascimentoFormatada)}</td>
                <td class="texto-centro">${escaparHtmlRelatorio(aluno.idade || '')}</td>
                <td>${escaparHtmlRelatorio(aluno.telefone || '')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<div class="vazio">Nenhum aniversariante encontrado para este mês.</div>'

    mostrarRelatorioExtraNaTela(
      'Aniversariantes do mês',
      `Referência: ${formatarMesAtualExtenso()}`,
      conteudo,
      'portrait',
      'iframe-aniversariantes-mes'
    )
  }

  function abrirRelatorioAlertasFaltas() {
    const alertas = buscarAlertasDeFaltas()

    const conteudo = alertas.length > 0
      ? `
        <table>
          <thead>
            <tr>
              <th class="numero">Nº</th>
              <th>Aluno</th>
              <th>Classe</th>
              <th>Faltas consecutivas</th>
              <th>Faltas no mês</th>
              <th>Última chamada</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            ${alertas.map((item, indice) => `
              <tr>
                <td class="numero">${indice + 1}</td>
                <td>${escaparHtmlRelatorio(item.aluno.nome)}</td>
                <td>${escaparHtmlRelatorio(item.classeNome || 'Sem classe')}</td>
                <td class="texto-centro">${item.faltasConsecutivas}</td>
                <td class="texto-centro">${item.faltasMes}</td>
                <td>${escaparHtmlRelatorio(item.ultimaData || '-')}</td>
                <td>${escaparHtmlRelatorio(item.motivo)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<div class="vazio">Nenhum alerta de faltas encontrado no momento.</div>'

    mostrarRelatorioExtraNaTela(
      'Alertas de faltas',
      'Alunos com 2 faltas consecutivas ou 3 faltas no mês.',
      conteudo,
      'landscape',
      'iframe-alertas-faltas'
    )
  }

  function abrirRelatorioDestaquesFrequencia() {
    const destaques = buscarDestaquesFrequencia()

    const conteudo = destaques.length > 0
      ? `
        <table>
          <thead>
            <tr>
              <th class="numero">Nº</th>
              <th>Aluno</th>
              <th>Classe</th>
              <th>Presenças</th>
              <th>Chamadas</th>
              <th>Frequência</th>
            </tr>
          </thead>
          <tbody>
            ${destaques.map((item, indice) => `
              <tr>
                <td class="numero">${indice + 1}</td>
                <td>${escaparHtmlRelatorio(item.aluno.nome)}</td>
                <td>${escaparHtmlRelatorio(item.classeNome || 'Sem classe')}</td>
                <td class="texto-centro">${item.presentes}</td>
                <td class="texto-centro">${item.total}</td>
                <td class="texto-centro">${item.frequencia}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<div class="vazio">Nenhum destaque de frequência encontrado para este mês.</div>'

    mostrarRelatorioExtraNaTela(
      'Destaques de frequência',
      `Alunos com 80% ou mais de presença em ${formatarMesAtualExtenso()}.`,
      conteudo,
      'portrait',
      'iframe-destaques-frequencia'
    )
  }

  function abrirCartoesAniversariantes() {
    const aniversariantes = buscarAniversariantesDoMes()

    if (aniversariantes.length === 0) {
      alert('Nenhum aniversariante encontrado para este mês.')
      return
    }

    const textoOpcoes = [
      '0 - Todos os aniversariantes do mês',
      ...aniversariantes.map((aluno, indice) => `${indice + 1} - ${aluno.nome}`),
    ].join('\n')

    const escolha = window.prompt(
      `Quais cartões deseja gerar?\n\n${textoOpcoes}\n\nDigite 0 para todos ou o número de uma pessoa.`,
      '0'
    )

    if (escolha === null) {
      return
    }

    const escolhaNumerica = Number.parseInt(escolha, 10)

    if (Number.isNaN(escolhaNumerica) || escolhaNumerica < 0 || escolhaNumerica > aniversariantes.length) {
      alert('Opção inválida. Tente novamente e escolha um número da lista.')
      return
    }

    const selecionados = escolhaNumerica === 0
      ? aniversariantes
      : [aniversariantes[escolhaNumerica - 1]]

    const conteudo = `
      <div class="cartoes-grid">
        ${selecionados.map((aluno) => `
          <article class="cartao-aniversario">
            <h3>Feliz aniversário!</h3>
            <p>A Escola Bíblica Dominical parabeniza:</p>
            <strong>${escaparHtmlRelatorio(aluno.nome)}</strong>
            <p>
              Desejamos que o Senhor abençoe sua vida com paz, alegria, saúde e muitos frutos.
              Que este novo ciclo seja repleto da graça de Deus e de lindas vitórias.
            </p>
            <p><strong>Versículo bíblico:</strong> “Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.”</p>
            <p><strong>Salmo 118:24</strong></p>
            <p><strong>Data:</strong> ${escaparHtmlRelatorio(aluno.dataNascimentoFormatada)}</p>
            <p class="assinatura-cartao">Com carinho, Escola Bíblica Dominical</p>
          </article>
        `).join('')}
      </div>
    `

    mostrarRelatorioExtraNaTela(
      'Cartões de aniversariantes',
      `Referência: ${formatarMesAtualExtenso()}`,
      conteudo,
      'portrait',
      'iframe-cartoes-aniversariantes'
    )
  }

  function abrirRelatorioParaImpressao() {
    const relatorio = document.querySelector('.relatorio-folha')

    if (!relatorio) {
      alert('Relatório não encontrado para impressão.')
      return
    }

    const janela = window.open('', '_blank')

    if (!janela) {
      alert(
        'O navegador bloqueou a abertura da impressão. No celular, use o botão Baixar PDF.'
      )
      return
    }

    janela.document.open()
    janela.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Relatório EBD Fiel</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              color: #000;
              background: #fff;
            }

            .area-acoes {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 20px;
            }

            .area-acoes button {
              border: 0;
              border-radius: 8px;
              padding: 12px 18px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              background: #2563eb;
              color: #fff;
            }

            .area-acoes .secundario {
              background: #e5e7eb;
              color: #111827;
            }

            .relatorio-folha {
              width: 100%;
              max-width: 980px;
              margin: 0 auto;
              background: #fff;
            }

            .cabecalho-relatorio {
              text-align: center;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px dotted #000;
            }

            .logo-relatorio {
              width: 76px;
              height: 76px;
              object-fit: contain;
              display: block;
              margin: 0 auto 8px;
            }

            .cabecalho-relatorio h3 {
              margin: 0 0 6px 0;
              font-size: 20px;
              font-weight: 700;
            }

            .cabecalho-relatorio p {
              margin: 0;
              font-size: 14px;
              font-weight: 600;
            }

            .tabela-container {
              width: 100%;
              overflow-x: visible;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 11px;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 5px 4px;
              text-align: center;
              vertical-align: middle;
              word-break: break-word;
            }

            th {
              font-weight: 700;
              background: #f3f4f6;
            }

            td:nth-child(2),
            th:nth-child(2) {
              text-align: left;
              width: 22%;
            }

            .linha-total td {
              font-weight: 700;
              background: #f3f4f6;
            }

            .linha-domingo-anterior td {
              font-weight: 700;
            }

            .relatorio-folha {
              max-width: 1120px;
              border: 1px solid #cbd5e1;
              border-radius: 18px;
              padding: 20px;
              box-shadow: none;
            }

            .cabecalho-relatorio-oficial {
              display: grid;
              grid-template-columns: 1.2fr 1.4fr 170px;
              gap: 14px;
              align-items: center;
              text-align: left;
              margin-bottom: 16px;
              padding-bottom: 14px;
              border-bottom: 1px solid #d8e0eb;
            }

            .cabecalho-relatorio-marca {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .logo-relatorio {
              width: 58px;
              height: 58px;
              margin: 0;
            }

            .relatorio-selo-institucional {
              display: inline-block;
              margin-bottom: 4px;
              color: #b7791f;
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .cabecalho-relatorio h3 {
              margin: 0 0 4px;
              color: #0f2a44;
              font-size: 18px;
              line-height: 1.15;
              text-transform: uppercase;
            }

            .cabecalho-relatorio p,
            .relatorio-info-igreja p {
              margin: 0 0 3px;
              color: #475569;
              font-size: 10.5px;
              line-height: 1.35;
              font-weight: 500;
            }

            .relatorio-info-igreja strong {
              color: #0f2a44;
            }

            .relatorio-data-selo {
              border: 1px solid #d6c28b;
              background: #fffaf0;
              border-radius: 12px;
              padding: 10px;
              text-align: center;
            }

            .relatorio-data-selo span,
            .relatorio-data-selo small {
              display: block;
              color: #64748b;
              font-size: 9px;
              font-weight: 700;
            }

            .relatorio-data-selo strong {
              display: block;
              color: #0f2a44;
              font-size: 16px;
              margin: 2px 0;
            }

            table {
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              overflow: hidden;
              font-size: 10.5px;
            }

            th,
            td {
              border: 1px solid #d6dee9;
              padding: 7px 6px;
              color: #1f2937;
            }

            th {
              background: #123c63;
              color: #ffffff;
              font-size: 10px;
              letter-spacing: 0.01em;
            }

            .linha-total td {
              background: #eef6ff;
              color: #0f2a44;
              border-top: 2px solid #8aa4bf;
              font-weight: 800;
            }

            .linha-domingo-anterior td {
              background: #fffaf0;
              color: #5f4b16;
              text-align: left;
              font-weight: 700;
            }

            .linha-domingo-anterior span,
            .linha-domingo-anterior small {
              display: inline-block;
              margin-right: 8px;
            }

            .linha-professores-titulo td {
              background: #123c63 !important;
              color: #ffffff !important;
              padding: 9px 8px;
              border-color: #123c63;
            }

            .relatorio-professores-titulo-conteudo {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;
              text-align: center;
            }

            .relatorio-professores-titulo-conteudo strong {
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }

            .relatorio-professores-titulo-conteudo span {
              background: rgba(255, 255, 255, 0.15);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 999px;
              padding: 3px 7px;
              font-size: 9.5px;
            }

            .linha-professores-cabecalho td {
              background: #f7eec7 !important;
              color: #0f2a44 !important;
              font-weight: 800;
            }

            .linha-professor-tabela-relatorio td {
              border-color: #d6dee9 !important;
            }

            .status-relatorio-professor {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 999px;
              padding: 3px 8px;
              font-size: 9.5px;
              font-weight: 800;
              background: #e2e8f0;
              color: #334155;
            }

            .status-relatorio-professor.status-presente {
              background: #dcfce7;
              color: #166534;
            }

            .status-relatorio-professor.status-falta {
              background: #fee2e2;
              color: #991b1b;
            }

            .rodape-relatorio-oficial {
              margin-top: 12px;
              padding-top: 8px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              text-align: center;
              font-size: 9.5px;
            }

            @media print {
              body {
                padding: 0;
              }

              .area-acoes {
                display: none;
              }

              .relatorio-folha {
                max-width: none;
              }

              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            }
          </style>
        </head>

        <body>
          <div class="area-acoes">
            <button onclick="window.print()">Imprimir / Salvar PDF</button>
            <button class="secundario" onclick="window.close()">Fechar</button>
          </div>

          ${relatorio.outerHTML}

          <script>
            setTimeout(function () {
              try {
                window.print()
              } catch (error) {
                console.log(error)
              }
            }, 800)
          </script>
        </body>
      </html>
    `)
    janela.document.close()
  }

  function escaparHtmlRelatorio(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function montarRelatorioEmBrancoHTML() {
    const endereco = montarEnderecoIgreja()
    const nomeIgreja = configuracaoIgreja.nome_igreja || configuracaoIgreja.nome || 'Relatório em branco'
    const linhasClasses = classes.length > 0 ? classes : classesIniciais

    const linhasTabela = linhasClasses
      .map((classe, indice) => `
        <tr>
          <td>${indice + 1}</td>
          <td>${escaparHtmlRelatorio(classe.nome)}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `)
      .join('')

    const linhasProfessores = Array.from({ length: Math.max(8, professoresSomente().length || 0) })
      .map((_, indice) => {
        const professor = professoresSomente()[indice]
        return `
          <tr>
            <td>${indice + 1}</td>
            <td colspan="3">${escaparHtmlRelatorio(professor?.nome || '')}</td>
            <td colspan="3">${escaparHtmlRelatorio(buscarNomeClasse(professor?.classeId))}</td>
            <td colspan="2"></td>
            <td colspan="1"></td>
            <td colspan="1"></td>
          </tr>
        `
      })
      .join('')

    return `
      <div class="relatorio-folha relatorio-folha-em-branco">
        <div class="cabecalho-relatorio">
          <img src="/logo-oficial-ebd-fiel.png" alt="Logo EBD Fiel" class="logo-relatorio" />
          <h3>${escaparHtmlRelatorio(nomeIgreja)}</h3>
          ${configuracaoIgreja.congregacao ? `<p>${escaparHtmlRelatorio(configuracaoIgreja.congregacao)}</p>` : ''}
          ${configuracaoIgreja.pastor_dirigente ? `<p>Dirigente: ${escaparHtmlRelatorio(configuracaoIgreja.pastor_dirigente)}</p>` : ''}
          ${configuracaoIgreja.superintendente_ebd ? `<p>Superintendente da EBD: ${escaparHtmlRelatorio(configuracaoIgreja.superintendente_ebd)}</p>` : ''}
          ${endereco ? `<p>${escaparHtmlRelatorio(endereco)}</p>` : ''}
          <p>RELATÓRIO EM BRANCO PARA RASCUNHO</p>
          <p>Data: ____ / ____ / ______</p>
        </div>

        <div class="tabela-container">
          <table class="tabela tabela-ebd">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Classes</th>
                <th>Matrícula</th>
                <th>Ausência</th>
                <th>Presença</th>
                <th>Visitante</th>
                <th>Total</th>
                <th>Bíblia</th>
                <th>Revista</th>
                <th>Ofertas</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabela}
              <tr class="linha-total">
                <td colspan="2">TOTAL GERAL</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr class="linha-domingo-anterior">
                <td colspan="11">DOMINGO anterior</td>
              </tr>
              <tr class="linha-professores-titulo">
                <td colspan="11">CHAMADA DOS PROFESSORES</td>
              </tr>
              <tr class="linha-professores-cabecalho">
                <td>Nº</td>
                <td colspan="3">Professor</td>
                <td colspan="3">Classe de referência</td>
                <td colspan="2">Presente</td>
                <td colspan="1">Faltou</td>
                <td colspan="1">Justificou</td>
              </tr>
              ${linhasProfessores}
            </tbody>
          </table>
        </div>

        <div class="area-observacoes-rascunho">
          <strong>Observações:</strong>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `
  }

  function abrirRelatorioEmBrancoParaImpressao() {
    const htmlRelatorio = montarRelatorioEmBrancoHTML()
    const janela = window.open('', '_blank')

    if (!janela) {
      alert('O navegador bloqueou a abertura da impressão. Permita pop-ups para imprimir o modelo em branco.')
      return
    }

    janela.document.open()
    janela.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Relatório em branco - EBD Fiel</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              color: #000;
              background: #fff;
            }
            .area-acoes {
              display: flex;
              gap: 12px;
              justify-content: center;
              margin-bottom: 20px;
            }
            .area-acoes button {
              border: 0;
              border-radius: 8px;
              padding: 12px 18px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              background: #103058;
              color: #fff;
            }
            .area-acoes .secundario {
              background: #e5e7eb;
              color: #111827;
            }
            .relatorio-folha {
              width: 100%;
              max-width: 1100px;
              margin: 0 auto;
              background: #fff;
            }
            .cabecalho-relatorio {
              text-align: center;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px dotted #000;
            }
            .logo-relatorio {
              width: 76px;
              height: 76px;
              object-fit: contain;
              display: block;
              margin: 0 auto 8px;
            }
            .cabecalho-relatorio h3 {
              margin: 0 0 6px 0;
              font-size: 20px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .cabecalho-relatorio p {
              margin: 0;
              font-size: 13px;
              font-weight: 600;
            }
            .tabela-container { width: 100%; overflow: visible; }
            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #000;
              padding: 7px 5px;
              text-align: center;
              vertical-align: middle;
              height: 28px;
              word-break: break-word;
            }
            th { font-weight: 700; background: #f3f4f6; }
            td:nth-child(2), th:nth-child(2) { text-align: left; width: 22%; }
            .linha-total td, .linha-professores-titulo td, .linha-professores-cabecalho td {
              font-weight: 700;
              background: #f3f4f6;
            }
            .linha-domingo-anterior td { font-weight: 700; text-align: left; }
            .area-observacoes-rascunho {
              margin-top: 14px;
              font-size: 12px;
              page-break-inside: avoid;
            }
            .area-observacoes-rascunho strong { display: block; margin-bottom: 8px; }
            .area-observacoes-rascunho div {
              height: 24px;
              border-bottom: 1px solid #000;
            }
            @media print {
              body { padding: 0; }
              .area-acoes { display: none; }
              .relatorio-folha { max-width: none; }
              @page { size: A4 landscape; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="area-acoes">
            <button onclick="window.print()">Imprimir / Salvar PDF</button>
            <button class="secundario" onclick="window.close()">Fechar</button>
          </div>
          ${htmlRelatorio}
          <script>
            setTimeout(function () {
              try { window.print() } catch (error) { console.log(error) }
            }, 800)
          </script>
        </body>
      </html>
    `)
    janela.document.close()
  }


  function montarChamadaPorClasseEmBrancoHTML(classesSelecionadas = null) {
    const endereco = montarEnderecoIgreja()
    const nomeIgreja = configuracaoIgreja.nome_igreja || configuracaoIgreja.nome || 'EBD Fiel'
    const linhasClassesBase = classes.length > 0 ? classes : classesIniciais
    const linhasClasses = classesSelecionadas && classesSelecionadas.length > 0 ? classesSelecionadas : linhasClassesBase

    const paginasClasses = linhasClasses
      .map((classe) => {
        const alunosDaClasse = alunos
          .filter((aluno) => {
            const classeDoAluno = aluno.classeId ?? aluno.classe_id
            const tipoPessoa = (aluno.tipoPessoa || aluno.tipo_pessoa || 'aluno').toLowerCase()
            return classeDoAluno === classe.id && tipoPessoa !== 'professor'
          })
          .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR'))

        const totalLinhasPorClasse = alunosDaClasse.length > 0 ? alunosDaClasse.length + 5 : 20

        const linhasAlunos = Array.from({ length: totalLinhasPorClasse })
          .map((_, indice) => {
            const aluno = alunosDaClasse[indice]

            return `
              <tr>
                <td>${String(indice + 1).padStart(2, '0')}</td>
                <td>${aluno?.nome ? escaparHtmlRelatorio(aluno.nome) : ''}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `
          })
          .join('')

        return `
          <section class="folha-chamada-classe">
            <div class="cabecalho-relatorio cabecalho-chamada-classe">
              <img src="/logo-oficial-ebd-fiel.png" alt="Logo EBD Fiel" class="logo-relatorio" />
              <h3>${escaparHtmlRelatorio(nomeIgreja)}</h3>
              ${configuracaoIgreja.congregacao ? `<p>${escaparHtmlRelatorio(configuracaoIgreja.congregacao)}</p>` : ''}
              ${configuracaoIgreja.pastor_dirigente ? `<p>Dirigente: ${escaparHtmlRelatorio(configuracaoIgreja.pastor_dirigente)}</p>` : ''}
              ${configuracaoIgreja.superintendente_ebd ? `<p>Superintendente da EBD: ${escaparHtmlRelatorio(configuracaoIgreja.superintendente_ebd)}</p>` : ''}
              ${endereco ? `<p>${escaparHtmlRelatorio(endereco)}</p>` : ''}
              <p class="titulo-chamada-classe">CHAMADA DA CLASSE</p>
            </div>

            <div class="dados-chamada-classe">
              <p><strong>Classe:</strong> ${escaparHtmlRelatorio(classe.nome)}</p>
              <p><strong>Professor(a):</strong> ___________________________________________</p>
              <p><strong>Data:</strong> ____ / ____ / ______</p>
            </div>

            <table class="tabela-chamada-classe">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Nome do aluno</th>
                  <th>Presente</th>
                  <th>Falta</th>
                  <th>Bíblia</th>
                  <th>Revista</th>
                  <th>Observação</th>
                </tr>
              </thead>
              <tbody>
                ${linhasAlunos}
              </tbody>
            </table>

            <div class="resumo-chamada-classe">
              <div><strong>Presentes:</strong> ______</div>
              <div><strong>Faltas:</strong> ______</div>
              <div><strong>Visitantes:</strong> ______</div>
              <div><strong>Bíblias:</strong> ______</div>
              <div><strong>Revistas:</strong> ______</div>
              <div><strong>Oferta:</strong> R$ ______</div>
            </div>

            <div class="observacoes-chamada-classe">
              <strong>Observações:</strong>
              <div></div>
              <div></div>
            </div>
          </section>
        `
      })
      .join('')

    return `
      <div class="chamadas-por-classe-em-branco">
        ${paginasClasses}
      </div>
    `
  }

  function abrirChamadaPorClasseParaImpressao() {
    const classesDisponiveis = classes.length > 0 ? classes : classesIniciais

    if (!classesDisponiveis.length) {
      alert('Nenhuma classe encontrada para gerar a chamada.')
      return
    }

    const textoOpcoes = [
      '0 - Todas as classes',
      ...classesDisponiveis.map((classe, indice) => `${indice + 1} - ${classe.nome}`),
    ].join('\n')

    const escolha = window.prompt(
      `Qual chamada deseja gerar?\n\n${textoOpcoes}\n\nDigite 0 para todas ou o número de uma classe.`,
      '0'
    )

    if (escolha === null) {
      return
    }

    const escolhaNumerica = Number.parseInt(escolha, 10)

    if (Number.isNaN(escolhaNumerica) || escolhaNumerica < 0 || escolhaNumerica > classesDisponiveis.length) {
      alert('Opção inválida. Tente novamente e escolha um número da lista.')
      return
    }

    const classesSelecionadas = escolhaNumerica === 0
      ? classesDisponiveis
      : [classesDisponiveis[escolhaNumerica - 1]]

    const htmlChamada = montarChamadaPorClasseEmBrancoHTML(classesSelecionadas)
    const documentoChamada = `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>PDF por classe - EBD Fiel</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              color: #000;
              background: #fff;
            }
            .folha-chamada-classe {
              width: 100%;
              max-width: 980px;
              margin: 0 auto 28px;
              padding: 0;
              background: #fff;
              page-break-after: always;
            }
            .folha-chamada-classe:last-child {
              page-break-after: auto;
            }
            .cabecalho-relatorio {
              text-align: center;
              margin-bottom: 14px;
              padding-bottom: 8px;
              border-bottom: 2px dotted #000;
            }
            .logo-relatorio {
              width: 68px;
              height: 68px;
              object-fit: contain;
              display: block;
              margin: 0 auto 6px;
            }
            .cabecalho-relatorio h3 {
              margin: 0 0 5px 0;
              font-size: 19px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .cabecalho-relatorio p {
              margin: 0;
              font-size: 12px;
              font-weight: 600;
            }
            .titulo-chamada-classe {
              margin-top: 6px !important;
              font-size: 14px !important;
              font-weight: 800 !important;
              letter-spacing: 0.04em;
            }
            .dados-chamada-classe {
              display: grid;
              grid-template-columns: 1.4fr 1fr 0.7fr;
              gap: 10px;
              margin-bottom: 12px;
              font-size: 12px;
              font-weight: 600;
            }
            .dados-chamada-classe p {
              margin: 0;
              padding: 8px;
              border: 1px solid #000;
              min-height: 34px;
            }
            .tabela-chamada-classe {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 11px;
            }
            .tabela-chamada-classe th,
            .tabela-chamada-classe td {
              border: 1px solid #000;
              padding: 6px 5px;
              text-align: center;
              height: 28px;
              vertical-align: middle;
            }
            .tabela-chamada-classe th {
              background: #f3f4f6;
              font-weight: 700;
            }
            .tabela-chamada-classe th:nth-child(1),
            .tabela-chamada-classe td:nth-child(1) {
              width: 42px;
            }
            .tabela-chamada-classe th:nth-child(2),
            .tabela-chamada-classe td:nth-child(2) {
              width: 34%;
              text-align: left;
            }
            .resumo-chamada-classe {
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 8px;
              margin-top: 12px;
              font-size: 11px;
            }
            .resumo-chamada-classe div {
              border: 1px solid #000;
              padding: 8px;
              min-height: 34px;
            }
            .observacoes-chamada-classe {
              margin-top: 10px;
              font-size: 12px;
              page-break-inside: avoid;
            }
            .observacoes-chamada-classe strong {
              display: block;
              margin-bottom: 6px;
            }
            .observacoes-chamada-classe div {
              height: 22px;
              border-bottom: 1px solid #000;
            }
            @media print {
              body { padding: 0; }
              .folha-chamada-classe { max-width: none; margin-bottom: 0; }
              @page { size: A4 portrait; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${htmlChamada}
        </body>
      </html>
    `

    const iframeAnterior = document.getElementById('iframe-impressao-chamada-classe')
    if (iframeAnterior) {
      iframeAnterior.remove()
    }

    const iframe = document.createElement('iframe')
    iframe.id = 'iframe-impressao-chamada-classe'
    iframe.title = 'Impressão da chamada por classe'
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'

    document.body.appendChild(iframe)

    const documentoIframe = iframe.contentWindow?.document

    if (!documentoIframe) {
      alert('Não foi possível preparar a impressão. Tente novamente.')
      iframe.remove()
      return
    }

    documentoIframe.open()
    documentoIframe.write(documentoChamada)
    documentoIframe.close()

    const imprimirIframe = () => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } catch (error) {
        console.error('Erro ao imprimir chamada por classe:', error)
        alert('Não foi possível abrir a impressão automaticamente. Tente novamente.')
      }

      setTimeout(() => {
        iframe.remove()
      }, 1500)
    }

    iframe.onload = () => {
      setTimeout(imprimirIframe, 400)
    }

    setTimeout(() => {
      if (document.body.contains(iframe)) {
        imprimirIframe()
      }
    }, 900)
  }


  async function baixarRelatorioPDF() {
    const relatorioOriginal = document.querySelector('.relatorio-folha')

    if (!relatorioOriginal) {
      alert('Relatório não encontrado para gerar PDF.')
      return
    }

    try {
      const areaTemporaria = document.createElement('div')

      areaTemporaria.style.position = 'fixed'
      areaTemporaria.style.left = '-9999px'
      areaTemporaria.style.top = '0'
      areaTemporaria.style.width = '1200px'
      areaTemporaria.style.background = '#ffffff'
      areaTemporaria.style.padding = '24px'
      areaTemporaria.style.zIndex = '-1'

      const relatorioClone = relatorioOriginal.cloneNode(true)

      relatorioClone.style.width = '1150px'
      relatorioClone.style.maxWidth = '1150px'
      relatorioClone.style.background = '#ffffff'

      const tabelaContainer = relatorioClone.querySelector('.tabela-container')
      if (tabelaContainer) {
        tabelaContainer.style.overflow = 'visible'
        tabelaContainer.style.width = '100%'
      }

      const tabela = relatorioClone.querySelector('table')
      if (tabela) {
        tabela.style.width = '100%'
        tabela.style.tableLayout = 'fixed'
        tabela.style.borderCollapse = 'collapse'
      }

      areaTemporaria.appendChild(relatorioClone)
      document.body.appendChild(areaTemporaria)

      const canvas = await html2canvas(relatorioClone, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        windowWidth: 1200,
      })

      document.body.removeChild(areaTemporaria)

      const imagem = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const larguraPagina = pdf.internal.pageSize.getWidth()
      const alturaPagina = pdf.internal.pageSize.getHeight()

      const margem = 8
      const larguraUtil = larguraPagina - margem * 2
      const alturaImagem = (canvas.height * larguraUtil) / canvas.width

      if (alturaImagem <= alturaPagina - margem * 2) {
        pdf.addImage(imagem, 'PNG', margem, margem, larguraUtil, alturaImagem)
      } else {
        let alturaRestante = alturaImagem
        let deslocamento = 0

        while (alturaRestante > 0) {
          pdf.addImage(
            imagem,
            'PNG',
            margem,
            margem - deslocamento,
            larguraUtil,
            alturaImagem
          )

          alturaRestante -= alturaPagina - margem * 2
          deslocamento += alturaPagina - margem * 2

          if (alturaRestante > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save('relatorio-ebd-fiel.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Não foi possível gerar o PDF. Tente novamente.')
    }
  }

  function abrirNovaClasse() {
    setNovaClasse({ nome: '', professor: '' })
    setClasseEditandoId(null)
    setMostrarFormularioClasse(true)
  }

  function editarClasse(classe) {
    setNovaClasse({
      nome: classe.nome,
      professor: classe.professor,
    })
    setClasseEditandoId(classe.id)
    setMostrarFormularioClasse(true)
  }

  function cancelarFormularioClasse() {
    setNovaClasse({ nome: '', professor: '' })
    setClasseEditandoId(null)
    setMostrarFormularioClasse(false)
  }

  async function salvarClasse(event) {
    event.preventDefault()

    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode cadastrar ou editar classes.')
      return
    }

    if (!novaClasse.nome.trim()) {
      alert('Preencha o nome da classe.')
      return
    }

    if (classeEditandoId) {
      const { error } = await supabase
        .from('classes')
        .update({
          nome: novaClasse.nome,
          professor: novaClasse.professor || '',
        })
        .eq('id', classeEditandoId)

      if (error) {
        console.error(error)
        alert('Erro ao salvar alterações da classe.')
        return
      }
    } else {
      const { error } = await supabase.from('classes').insert({
        id: Date.now(),
        nome: novaClasse.nome,
        professor: novaClasse.professor,
        igreja_id: buscarIgrejaIdAtual(),
      })

      if (error) {
        console.error(error)
        alert('Erro ao salvar classe.')
        return
      }
    }

    await buscarTodosOsDados()
    cancelarFormularioClasse()
  }

  async function excluirClasse(classeId) {
    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode excluir classes.')
      return
    }

    const existemAlunos = alunos.some(
      (aluno) => aluno.classeId === Number(classeId)
    )

    if (existemAlunos) {
      alert('Não é possível excluir essa classe porque existem alunos nela.')
      return
    }

    const confirmar = window.confirm('Tem certeza que deseja excluir esta classe?')

    if (!confirmar) {
      return
    }

    const { error } = await supabase.from('classes').delete().eq('id', classeId)

    if (error) {
      console.error(error)
      alert('Erro ao excluir classe.')
      return
    }

    await buscarTodosOsDados()
  }

  function abrirNovoAluno(tipoPessoa = 'aluno') {
    setNovoAluno({
      nome: '',
      classeId: '',
      telefone: '',
      dataNascimento: '',
      tipoPessoa,
    })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(true)
  }

  function abrirNovoAlunoDaClasse(classeId) {
    setNovoAluno({
      nome: '',
      classeId: String(classeId),
      telefone: '',
      dataNascimento: '',
      tipoPessoa: 'aluno',
    })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(true)
  }

  function abrirNovoProfessorDaClasse(classeId) {
    setNovoAluno({
      nome: '',
      classeId: String(classeId),
      telefone: '',
      dataNascimento: '',
      tipoPessoa: 'professor',
    })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(true)
  }

  function editarProfessorDaClasse(professor) {
    editarAluno(professor)
    setNovoAluno({
      nome: professor.nome,
      classeId: String(professor.classeId),
      telefone: professor.telefone,
      dataNascimento: professor.dataNascimento || '',
      tipoPessoa: 'professor',
    })
  }

  function editarAluno(aluno) {
    setNovoAluno({
      nome: aluno.nome,
      classeId: String(aluno.classeId),
      telefone: aluno.telefone,
      dataNascimento: aluno.dataNascimento || '',
      tipoPessoa: aluno.tipoPessoa || 'aluno',
    })
    setAlunoEditandoId(aluno.id)
    setMostrarFormularioAluno(true)
  }

  function cancelarFormularioAluno() {
    setNovoAluno({ nome: '', classeId: '', telefone: '', dataNascimento: '', tipoPessoa: 'aluno' })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(false)
  }

  function normalizarNomeCadastro(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
  }

  function removerNomeProfessorDoTextoClasse(textoProfessores, nomeProfessor) {
    const nomeNormalizado = normalizarNomeCadastro(nomeProfessor)

    return String(textoProfessores || '')
      .split(/,|;|\/| e /i)
      .map((nome) => nome.trim())
      .filter(Boolean)
      .filter((nome) => normalizarNomeCadastro(nome) !== nomeNormalizado)
      .join(', ')
  }

  async function existePessoaDuplicadaNaClasse({ nome, classeId, tipoPessoa, ignorarId = null }) {
    const igrejaAtualId = buscarIgrejaIdAtual()

    if (!igrejaAtualId || !nome || !classeId) {
      return false
    }

    const nomeNormalizado = normalizarNomeCadastro(nome)

    const duplicadoLocal = alunos.some((aluno) => {
      return (
        Number(aluno.igreja_id || igrejaAtualId) === Number(igrejaAtualId) &&
        Number(aluno.classeId || aluno.classe_id) === Number(classeId) &&
        String(aluno.tipoPessoa || aluno.tipo_pessoa || 'aluno') === String(tipoPessoa || 'aluno') &&
        normalizarNomeCadastro(aluno.nome) === nomeNormalizado &&
        String(aluno.id) !== String(ignorarId || '')
      )
    })

    if (duplicadoLocal) {
      return true
    }

    const { data, error } = await supabase
      .from('alunos')
      .select('id, nome')
      .eq('igreja_id', igrejaAtualId)
      .eq('classe_id', Number(classeId))
      .eq('tipo_pessoa', tipoPessoa || 'aluno')

    if (error) {
      console.error('Erro ao verificar duplicidade:', error)
      return false
    }

    return (data || []).some((registro) => {
      return (
        normalizarNomeCadastro(registro.nome) === nomeNormalizado &&
        String(registro.id) !== String(ignorarId || '')
      )
    })
  }

  async function salvarAluno(event) {
    event.preventDefault()

    if (salvandoAluno) {
      return
    }

    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode cadastrar ou editar alunos.')
      return
    }

    const nomeLimpo = novoAluno.nome.replace(/\s+/g, ' ').trim()
    const tipoPessoaCadastro = novoAluno.tipoPessoa || 'aluno'

    if (!nomeLimpo || !novoAluno.classeId) {
      alert('Preencha o nome do aluno e selecione uma classe.')
      return
    }

    setSalvandoAluno(true)

    try {
      const duplicado = await existePessoaDuplicadaNaClasse({
        nome: nomeLimpo,
        classeId: novoAluno.classeId,
        tipoPessoa: tipoPessoaCadastro,
        ignorarId: alunoEditandoId,
      })

      if (duplicado) {
        alert(
          tipoPessoaCadastro === 'professor'
            ? 'Já existe um professor com esse nome vinculado a esta classe.'
            : 'Já existe um aluno com esse nome matriculado nesta classe.'
        )
        return
      }

      const alunoBanco = {
        nome: nomeLimpo,
        classe_id: Number(novoAluno.classeId),
        telefone: novoAluno.telefone,
        data_nascimento: novoAluno.dataNascimento || null,
        tipo_pessoa: tipoPessoaCadastro,
      }

      if (alunoEditandoId) {
        const { error } = await supabase
          .from('alunos')
          .update(alunoBanco)
          .eq('id', alunoEditandoId)

        if (error) {
          console.error(error)
          alert('Erro ao salvar alterações do aluno.')
          return
        }
      } else {
        const { error } = await supabase.from('alunos').insert({
          id: Date.now(),
          ...alunoBanco,
          igreja_id: buscarIgrejaIdAtual(),
        })

        if (error) {
          console.error(error)
          alert('Erro ao salvar aluno.')
          return
        }
      }

      await buscarTodosOsDados()
      cancelarFormularioAluno()
    } finally {
      setSalvandoAluno(false)
    }
  }

    async function excluirAluno(alunoId) {
    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode excluir alunos ou professores.')
      return
    }

    const cadastroEncontrado = alunos.find((aluno) => Number(aluno.id) === Number(alunoId))
    const ehProfessor = cadastroEncontrado?.tipoPessoa === 'professor'

    const confirmar = window.confirm(
      ehProfessor
        ? 'Tem certeza que deseja excluir este professor?'
        : 'Tem certeza que deseja excluir este aluno?'
    )

    if (!confirmar) {
      return
    }

    if (ehProfessor && cadastroEncontrado?.classeId) {
      const classeDoProfessor = classes.find(
        (classe) => Number(classe.id) === Number(cadastroEncontrado.classeId)
      )

      if (classeDoProfessor?.professor) {
        const textoAtualizado = removerNomeProfessorDoTextoClasse(
          classeDoProfessor.professor,
          cadastroEncontrado.nome
        )

        const { error: erroAtualizarClasse } = await supabase
          .from('classes')
          .update({ professor: textoAtualizado })
          .eq('id', cadastroEncontrado.classeId)

        if (erroAtualizarClasse) {
          console.error(erroAtualizarClasse)
          alert('Erro ao remover o professor da classe.')
          return
        }
      }
    }

    const { error } = await supabase.from('alunos').delete().eq('id', alunoId)

    if (error) {
      console.error(error)
      alert(ehProfessor ? 'Erro ao excluir professor.' : 'Erro ao excluir aluno.')
      return
    }

    await buscarTodosOsDados()
  }

  function filtrarCadastrosPorTipo(tipoPessoa) {
    return alunos.filter((aluno) => {
      const nomeCombina = aluno.nome
        .toLowerCase()
        .includes(buscaAluno.toLowerCase())

      const classeCombina =
        !filtroClasseAluno || aluno.classeId === Number(filtroClasseAluno)

      const tipoCombina = (aluno.tipoPessoa || 'aluno') === tipoPessoa

      return nomeCombina && classeCombina && tipoCombina
    })
  }

  function filtrarAlunos() {
    return filtrarCadastrosPorTipo('aluno')
  }

  function filtrarProfessores() {
    return filtrarCadastrosPorTipo('professor')
  }

  function limparFiltrosAlunos() {
    setBuscaAluno('')
    setFiltroClasseAluno('')
  }

  function buscarProfessoresDaIgreja() {
    return alunos
      .filter((pessoa) => pessoa.tipoPessoa === 'professor')
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
  }

  function alterarPresencaProfessor(perfilId, status) {
    setPresencasProfessores({
      ...presencasProfessores,
      [perfilId]: status,
    })
  }

  function buscarDataUltimaChamadaProfessores() {
    if (chamadasProfessores.length === 0) {
      return buscarDataAtual()
    }

    const ultimaChamada = chamadasProfessores[chamadasProfessores.length - 1]
    return ultimaChamada.data || buscarDataAtual()
  }

  function calcularTotalProfessoresPresentes() {
    return chamadasProfessores.reduce(
      (total, chamada) => total + converterNumero(chamada.totalPresentes),
      0
    )
  }

  function calcularTotalProfessoresFaltas() {
    return chamadasProfessores.reduce(
      (total, chamada) => total + converterNumero(chamada.totalFaltas),
      0
    )
  }

  function calcularTotalProfessoresJustificadas() {
    return chamadasProfessores.reduce(
      (total, chamada) => total + converterNumero(chamada.totalJustificadas),
      0
    )
  }

  function buscarUltimaChamadaProfessores() {
    if (chamadasProfessores.length === 0) {
      return null
    }

    return chamadasProfessores[chamadasProfessores.length - 1]
  }

  function calcularResumoUltimaChamadaProfessores() {
    const ultimaChamada = buscarUltimaChamadaProfessores()

    if (!ultimaChamada) {
      return {
        totalProfessores: professoresSomente().length,
        presentes: 0,
        faltaram: 0,
        justificaram: 0,
        data: buscarDataAtual(),
        registros: [],
      }
    }

    return {
      totalProfessores: ultimaChamada.totalProfessores,
      presentes: ultimaChamada.totalPresentes,
      faltaram: ultimaChamada.totalFaltas,
      justificaram: ultimaChamada.totalJustificadas,
      data: ultimaChamada.data,
      registros: ultimaChamada.registros || [],
    }
  }

  function traduzirStatusProfessor(status) {
    if (status === 'presente') return 'Presente'
    if (status === 'faltou') return 'Faltou'
    if (status === 'justificou') return 'Justificou'
    return 'Sem marcação'
  }

  function calcularPercentualPresencaProfessores() {
    const resumo = calcularResumoUltimaChamadaProfessores()
    const total = converterNumero(resumo.totalProfessores)

    if (total === 0) {
      return 0
    }

    return Math.round((converterNumero(resumo.presentes) / total) * 100)
  }

  function alterarPresenca(alunoId, status) {
    setPresencas((presencasAtuais) => ({
      ...presencasAtuais,
      [String(alunoId)]: status,
    }))
  }

  function marcarTodosAlunos(status) {
    setMensagemChamada(null)

    if (!classeChamadaId) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Selecione uma classe antes de marcar a chamada.',
      })
      return
    }

    const alunosDaClasse = alunos.filter(
      (aluno) =>
        Number(aluno.classeId) === Number(classeChamadaId) &&
        String(aluno.tipoPessoa || 'aluno').toLowerCase() === 'aluno'
    )

    if (alunosDaClasse.length === 0) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Não encontrei alunos nessa classe. Verifique se os alunos estão vinculados à classe escolhida.',
      })
      return
    }

    setPresencas((presencasAtuais) => {
      const novasPresencas = { ...presencasAtuais }

      alunosDaClasse.forEach((aluno) => {
        novasPresencas[String(aluno.id)] = status
      })

      return novasPresencas
    })
  }

  function alterarDadosExtras(campo, valor) {
    setDadosExtrasChamada({
      ...dadosExtrasChamada,
      [campo]: valor,
    })
  }

  function buscarDataAtualIso() {
    return new Date().toISOString().slice(0, 10)
  }

  function confirmarDataDaChamada(dataInformada, tipoChamadaTexto) {
    const dataNormalizada = dataInformada || buscarDataAtualIso()
    const hojeIso = buscarDataAtualIso()

    if (dataNormalizada === hojeIso) {
      return true
    }

    const dataFormatada = formatarDataCurtaRelatorio(dataNormalizada)

    return window.confirm(
      `Você está salvando a ${tipoChamadaTexto} para a data ${dataFormatada}.

Confirme se essa é realmente a data correta da EBD antes de continuar.`
    )
  }

  async function salvarChamada() {
    setMensagemChamada(null)

    if (usuarioEhProfessor() && !professorPodeAcessarClasse(classeChamadaId)) {
      setMensagemChamada({
        tipo: 'erro',
        texto: 'Professor pode fazer chamada apenas das classes vinculadas pela secretaria.',
      })
      return
    }

    if (!classeChamadaId) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Selecione uma classe antes de salvar a chamada.',
      })
      return
    }

    const classeSelecionadaId = Number(classeChamadaId)
    const classeSelecionada = classes.find(
      (classe) => Number(classe.id) === classeSelecionadaId
    )

    if (!classeSelecionada) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'A classe selecionada não foi encontrada. Atualize a página e escolha a classe novamente.',
      })
      return
    }

    const alunosDaClasse = alunos.filter(
      (aluno) =>
        Number(aluno.classeId) === classeSelecionadaId &&
        String(aluno.tipoPessoa || 'aluno').toLowerCase() === 'aluno'
    )

    if (alunosDaClasse.length === 0) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: `Não encontrei alunos cadastrados na classe ${classeSelecionada.nome}. Verifique se os alunos estão vinculados a essa classe.`,
      })
      return
    }

    const presencasAtuais = { ...presencas }

    const alunosSemMarcacao = alunosDaClasse.filter(
      (aluno) => !presencasAtuais[String(aluno.id)]
    )

    if (alunosSemMarcacao.length > 0) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: `Ainda falta marcar ${alunosSemMarcacao.length} aluno(s): ${alunosSemMarcacao
          .map((aluno) => aluno.nome)
          .join(', ')}`,
      })
      return
    }

    const totalPresentes = alunosDaClasse.filter(
      (aluno) => presencasAtuais[String(aluno.id)] === 'presente'
    ).length

    const totalFaltas = alunosDaClasse.filter(
      (aluno) => presencasAtuais[String(aluno.id)] === 'faltou'
    ).length

    if (!confirmarDataDaChamada(dataAulaChamada, 'chamada dos alunos')) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Chamada não salva. Confira a data da aula e tente novamente.',
      })
      return
    }

    const visitantes = converterNumero(dadosExtrasChamada.visitantes)
    const biblias = converterNumero(dadosExtrasChamada.biblias)
    const revistas = converterNumero(dadosExtrasChamada.revistas)
    const ofertas = converterNumero(dadosExtrasChamada.ofertas)

    const chamadaBanco = {
      id: Date.now(),
      data: dataAulaChamada || buscarDataAtual(),
      igreja_id: buscarIgrejaIdAtual(),
      classe_id: classeSelecionadaId,
      matricula: alunosDaClasse.length,
      total_presentes: totalPresentes,
      total_faltas: totalFaltas,
      visitantes,
      biblias,
      revistas,
      ofertas,
      total_geral_classe: totalPresentes + visitantes,
      registros: alunosDaClasse.map((aluno) => ({
        alunoId: aluno.id,
        nome: aluno.nome,
        status: presencasAtuais[String(aluno.id)],
      })),
    }

    const { error } = await supabase.from('chamadas').insert(chamadaBanco)

    if (error) {
      console.error(error)
      setMensagemChamada({
        tipo: 'erro',
        texto: 'Não foi possível salvar a chamada. Verifique sua conexão e tente novamente.',
      })
      return
    }

    await buscarTodosOsDados()

    setPresencas({})
    setDataAulaChamada(new Date().toISOString().slice(0, 10))
    setDadosExtrasChamada({
      visitantes: '',
      biblias: '',
      revistas: '',
      ofertas: '',
    })
    setClasseChamadaId(String(classeSelecionadaId))
    setMensagemChamada({
      tipo: 'sucesso',
      texto: `Chamada dos alunos da classe ${classeSelecionada.nome} salva com sucesso.`,
    })
  }

  function alterarConfiguracaoIgreja(campo, valor) {
    setConfiguracaoIgreja({
      ...configuracaoIgreja,
      [campo]: valor,
    })
  }

  async function salvarConfiguracaoIgreja(event) {
    event.preventDefault()

    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode alterar as configurações da igreja.')
      return
    }

    if (!sessao?.user?.id) {
      alert('Não foi possível confirmar sua sessão. Saia e entre novamente no sistema.')
      return
    }

    if (!buscarIgrejaIdAtual()) {
      alert('Igreja não identificada. Saia e entre novamente no sistema.')
      return
    }

    setSalvandoConfiguracaoIgreja(true)

    const dadosConfiguracao = {
      user_id: sessao.user.id,
      igreja_id: buscarIgrejaIdAtual(),
      nome_igreja: configuracaoIgreja.nome_igreja.trim(),
      congregacao: configuracaoIgreja.congregacao.trim(),
      pastor_dirigente: configuracaoIgreja.pastor_dirigente.trim(),
      superintendente_ebd: configuracaoIgreja.superintendente_ebd.trim(),
      cidade: configuracaoIgreja.cidade.trim(),
      estado: configuracaoIgreja.estado.trim(),
      bairro: configuracaoIgreja.bairro.trim(),
      endereco: configuracaoIgreja.endereco.trim(),
      telefone: configuracaoIgreja.telefone.trim(),
      email: configuracaoIgreja.email.trim(),
      updated_at: new Date().toISOString(),
    }

    try {
      if (configuracaoIgreja.id) {
        const { error } = await supabase
          .from('configuracoes_igreja')
          .update(dadosConfiguracao)
          .eq('id', configuracaoIgreja.id)

        if (error) {
          throw error
        }
      } else {
        const { data, error } = await supabase
          .from('configuracoes_igreja')
          .insert(dadosConfiguracao)
          .select()
          .single()

        if (error) {
          throw error
        }

        setConfiguracaoIgreja({
          id: data.id,
          nome_igreja: data.nome_igreja || '',
          congregacao: data.congregacao || '',
          pastor_dirigente: data.pastor_dirigente || '',
          superintendente_ebd: data.superintendente_ebd || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          bairro: data.bairro || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          email: data.email || '',
        })
      }

      await buscarTodosOsDados(sessao)
      alert('Configurações da igreja salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações da igreja:', error)
      alert(error?.message || 'Erro ao salvar configurações da igreja.')
    } finally {
      setSalvandoConfiguracaoIgreja(false)
    }
  }

  function montarRelatorioPorClasse() {
    return classes.map((classe, indice) => {
      const chamadasDaClasse = chamadasSalvas.filter(
        (chamada) => chamada.classeId === classe.id
      )

      const ultimaChamada = chamadasDaClasse[chamadasDaClasse.length - 1]
      const matricula = calcularMatriculaDaClasse(classe.id)
      const presenca = ultimaChamada ? ultimaChamada.totalPresentes : 0
      const ausencia = ultimaChamada ? ultimaChamada.totalFaltas : 0
      const visitantes = ultimaChamada ? ultimaChamada.visitantes : 0
      const biblias = ultimaChamada ? ultimaChamada.biblias : 0
      const revistas = ultimaChamada ? ultimaChamada.revistas : 0
      const ofertas = ultimaChamada ? ultimaChamada.ofertas : 0
      const frequencia =
        matricula === 0 ? 0 : Math.round((presenca / matricula) * 100)

      return {
        numero: indice + 1,
        classeId: classe.id,
        classe: classe.nome,
        matricula,
        ausencia,
        presenca,
        visitantes,
        total: presenca + visitantes,
        biblias,
        revistas,
        ofertas,
        frequencia,
      }
    })
  }

  function calcularTotaisRelatorio() {
    const linhas = montarRelatorioPorClasse()

    const totais = linhas.reduce(
      (acc, linha) => ({
        matricula: acc.matricula + linha.matricula,
        ausencia: acc.ausencia + linha.ausencia,
        presenca: acc.presenca + linha.presenca,
        visitantes: acc.visitantes + linha.visitantes,
        total: acc.total + linha.total,
        biblias: acc.biblias + linha.biblias,
        revistas: acc.revistas + linha.revistas,
        ofertas: acc.ofertas + linha.ofertas,
      }),
      {
        matricula: 0,
        ausencia: 0,
        presenca: 0,
        visitantes: 0,
        total: 0,
        biblias: 0,
        revistas: 0,
        ofertas: 0,
      }
    )

    return {
      ...totais,
      frequencia:
        totais.matricula === 0
          ? 0
          : Math.round((totais.presenca / totais.matricula) * 100),
    }
  }

  if (verificandoSessao && !sessao) {
    return (
      <div className="tela-login tela-mensagem">
        <section className="painel-apresentacao">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Gestão inteligente para Escola Bíblica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Sistema comercial pronto para igrejas</span>
            <h2>Organize classes, alunos, chamadas e relatórios em um só lugar.</h2>
            <p>
              Acesse o painel para acompanhar os dados da sua EBD com uma interface
              moderna, simples e profissional.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-mensagem">
          <div className="mensagem-status-icone">
            <Icone nome="check" className="icone-status" />
          </div>
          <h2>Verificando acesso...</h2>
          <p>Aguarde um momento enquanto conferimos sua sessão.</p>
        </section>
      </div>
    )
  }

  if (sessao && telaPublica === 'novaSenha') {
    return (
      <div className="tela-login tela-recuperacao-senha">
        <section className="painel-apresentacao painel-recuperacao-senha">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Redefinição segura de senha.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Nova senha</span>
            <h2>Crie uma nova senha de acesso.</h2>
            <p>
              Digite uma nova senha para continuar usando o sistema com segurança.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-recuperacao-senha">
          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="usuarios" className="icone-status" />
            </div>
            <div>
              <h2>Definir nova senha</h2>
              <p>Sua nova senha precisa ter pelo menos 6 caracteres.</p>
            </div>
          </div>

          <form className="formulario formulario-login" onSubmit={salvarNovaSenhaRecuperacao}>
            <label>
              Nova senha
              <input
                type="password"
                value={novaSenhaRecuperacao}
                onChange={(event) => setNovaSenhaRecuperacao(event.target.value)}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirmar nova senha
              <input
                type="password"
                value={confirmarNovaSenhaRecuperacao}
                onChange={(event) =>
                  setConfirmarNovaSenhaRecuperacao(event.target.value)
                }
                placeholder="Digite a nova senha novamente"
                autoComplete="new-password"
              />
            </label>

            {erroNovaSenha && <div className="aviso aviso-cadastro-piloto">{erroNovaSenha}</div>}

            <button
              className="botao-principal botao-largura-total"
              type="submit"
              disabled={carregandoNovaSenha}
            >
              {carregandoNovaSenha ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (!sessao && telaPublica === 'recuperarSenha') {
    return (
      <div className="tela-login tela-recuperacao-senha">
        <section className="painel-apresentacao painel-recuperacao-senha">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Recuperação de acesso.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Esqueci minha senha</span>
            <h2>Receba um link para redefinir sua senha.</h2>
            <p>
              Informe o e-mail usado no cadastro. O sistema enviará um link seguro para
              você criar uma nova senha.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-recuperacao-senha">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('login')}
          >
            ← Voltar para login
          </button>

          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="usuarios" className="icone-status" />
            </div>
            <div>
              <h2>Recuperar senha</h2>
              <p>Digite seu e-mail para receber o link de recuperação.</p>
            </div>
          </div>

          <form className="formulario formulario-login" onSubmit={enviarLinkRecuperacaoSenha}>
            <label>
              E-mail cadastrado
              <input
                type="email"
                value={emailRecuperacao}
                onChange={(event) => setEmailRecuperacao(event.target.value)}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
              />
            </label>

            {erroRecuperacao && <div className="aviso aviso-cadastro-piloto">{erroRecuperacao}</div>}
            {mensagemRecuperacao && (
              <div className="aviso aviso-sucesso-cadastro">{mensagemRecuperacao}</div>
            )}

            <button
              className="botao-principal botao-largura-total"
              type="submit"
              disabled={carregandoRecuperacao}
            >
              {carregandoRecuperacao ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (!sessao && telaPublica === 'cadastroEnviado') {
    return (
      <div className="tela-login tela-cadastro-enviado">
        <section className="painel-apresentacao painel-cadastro-enviado">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Cadastro recebido com sucesso.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Aguardando aprovação</span>
            <h2>Sua solicitação foi enviada.</h2>
            <p>
              O administrador vai conferir os dados da igreja e liberar o acesso para
              o teste piloto.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-cadastro-enviado">
          <div className="mensagem-status-icone mensagem-status-sucesso">
            <Icone nome="check" className="icone-status" />
          </div>

          <h2>Cadastro enviado!</h2>

          <p>
            {ultimoCadastroPilotoEnviado.nomeIgreja
              ? `Recebemos o cadastro da igreja ${ultimoCadastroPilotoEnviado.nomeIgreja}.`
              : 'Recebemos o cadastro da sua igreja.'}
          </p>

          <div className="resumo-cadastro-enviado">
            {ultimoCadastroPilotoEnviado.responsavel && (
              <span>Responsável: {ultimoCadastroPilotoEnviado.responsavel}</span>
            )}
            {ultimoCadastroPilotoEnviado.email && (
              <span>E-mail: {ultimoCadastroPilotoEnviado.email}</span>
            )}
            <span>Status: aguardando aprovação</span>
          </div>

          <div className="aviso-aprovacao-cadastro">
            <strong>O que acontece agora?</strong>
            <p>
              Aguarde a aprovação do administrador. Após a liberação, você poderá
              entrar normalmente com o e-mail e a senha cadastrados.
            </p>
          </div>

          <button
            className="botao-principal botao-largura-total"
            type="button"
            onClick={() => setTelaPublica('login')}
          >
            Voltar para login
          </button>
        </section>
      </div>
    )
  }

  if (!sessao && telaPublica === 'cadastroPiloto') {
    return (
      <div className="tela-login tela-cadastro-piloto">
        <section className="painel-apresentacao painel-cadastro-piloto">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Cadastro do teste piloto fechado.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Exclusivo para o grupo</span>
            <h2>Crie o acesso da sua igreja para avaliação.</h2>
            <p>
              O cadastro será enviado para aprovação. Após a liberação, a igreja poderá
              testar classes, alunos, professores, chamadas, relatórios e mensagens.
            </p>
          </div>

          <div className="beneficios-login">
            <div className="beneficio-item">
              <Icone nome="check" className="icone-beneficio" />
              <span>Código do piloto obrigatório</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="igreja" className="icone-beneficio" />
              <span>Sede ou congregação</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="usuarios" className="icone-beneficio" />
              <span>Secretaria ou superintendência</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="relatorios" className="icone-beneficio" />
              <span>Aprovação pelo administrador</span>
            </div>
          </div>
        </section>

        <section className="cartao-login cartao-cadastro-piloto">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('login')}
          >
            ← Voltar para login
          </button>

          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="igreja" className="icone-status" />
            </div>
            <div>
              <h2>Criar acesso do piloto</h2>
              <p>Preencha seus dados e os dados da igreja participante.</p>
            </div>
          </div>

          <form className="formulario formulario-cadastro-piloto" onSubmit={cadastrarAcessoPiloto}>
            <div className="grupo-cadastro-piloto">
              <h3>Responsável</h3>

              <label>
                Nome
                <input
                  type="text"
                  value={cadastroPiloto.nomeResponsavel}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      nomeResponsavel: event.target.value,
                    })
                  }
                  placeholder="Seu nome completo"
                />
              </label>

              <label>
                Cargo
                <select
                  value={cadastroPiloto.cargoResponsavel}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      cargoResponsavel: event.target.value,
                    })
                  }
                >
                  <option value="secretario">Secretário(a)</option>
                  <option value="superintendente">Superintendente</option>
                </select>
              </label>

              <label>
                E-mail de acesso
                <input
                  type="email"
                  value={cadastroPiloto.email}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, email: event.target.value })
                  }
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                />
              </label>

              <div className="campo-telefone-cadastro">
                <label>
                  DDD
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="2"
                    value={cadastroPiloto.telefoneDdd || ''}
                    onChange={(event) =>
                      setCadastroPiloto({
                        ...cadastroPiloto,
                        telefoneDdd: event.target.value.replace(/\D/g, '').slice(0, 2),
                      })
                    }
                    placeholder="27"
                    required
                  />
                </label>

                <label>
                  WhatsApp / telefone
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cadastroPiloto.telefoneNumero || ''}
                    onChange={(event) =>
                      setCadastroPiloto({
                        ...cadastroPiloto,
                        telefoneNumero: event.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="999999999"
                    required
                  />
                </label>
              </div>

              <label>
                Senha
                <input
                  type="password"
                  value={cadastroPiloto.senha}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, senha: event.target.value })
                  }
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </label>

              <label>
                Confirmar senha
                <input
                  type="password"
                  value={cadastroPiloto.confirmarSenha}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      confirmarSenha: event.target.value,
                    })
                  }
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                />
              </label>

              <label>
                Código do piloto
                <input
                  type="text"
                  value={cadastroPiloto.codigoPiloto}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      codigoPiloto: event.target.value,
                    })
                  }
                  placeholder="Código informado no grupo"
                />
              </label>
            </div>

            <div className="grupo-cadastro-piloto">
              <h3>Dados da igreja</h3>

              <label>
                Nome da igreja
                <input
                  type="text"
                  value={cadastroPiloto.nomeIgreja}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      nomeIgreja: event.target.value,
                    })
                  }
                  placeholder="Ex: Assembleia de Deus..."
                />
              </label>

              <label>
                Tipo
                <select
                  value={cadastroPiloto.tipoIgreja}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      tipoIgreja: event.target.value,
                    })
                  }
                >
                  <option value="sede">Sede</option>
                  <option value="congregacao">Congregação</option>
                </select>
              </label>

              <label>
                Congregação
                <input
                  type="text"
                  value={cadastroPiloto.congregacao}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      congregacao: event.target.value,
                    })
                  }
                  placeholder="Ex: Sede, Betel, Vila Nova..."
                />
              </label>

              <label>
                Pastor/Dirigente
                <input
                  type="text"
                  value={cadastroPiloto.pastorDirigente}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      pastorDirigente: event.target.value,
                    })
                  }
                  placeholder="Ex: Pr. João Silva"
                />
              </label>

              <label>
                Cidade
                <input
                  type="text"
                  value={cadastroPiloto.cidade}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, cidade: event.target.value })
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={cadastroPiloto.estado}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, estado: event.target.value })
                  }
                  required
                >
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BRASIL.map((estado) => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla} - {estado.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Bairro
                <input
                  type="text"
                  value={cadastroPiloto.bairro}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, bairro: event.target.value })
                  }
                />
              </label>

              <label className="campo-cadastro-piloto-largo">
                Endereço
                <input
                  type="text"
                  value={cadastroPiloto.endereco}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      endereco: event.target.value,
                    })
                  }
                  placeholder="Rua ou avenida"
                />
              </label>

              <label>
                Número
                <input
                  type="text"
                  value={cadastroPiloto.numeroEndereco}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      numeroEndereco: event.target.value,
                    })
                  }
                  placeholder="Ex: 146"
                />
              </label>

              <label className="campo-cadastro-piloto-largo">
                Complemento
                <input
                  type="text"
                  value={cadastroPiloto.complementoEndereco}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      complementoEndereco: event.target.value,
                    })
                  }
                  placeholder="Opcional: sala, fundos, referência..."
                />
              </label>

              <label>
                CEP
                <input
                  type="text"
                  value={cadastroPiloto.cep}
                  onChange={(event) =>
                    setCadastroPiloto({ ...cadastroPiloto, cep: event.target.value })
                  }
                  placeholder="Ex: 36000-000"
                />
              </label>

              {cadastroPiloto.tipoIgreja === 'congregacao' && (
                <>
                  <label>
                    Sede filiada
                    <input
                      type="text"
                      value={cadastroPiloto.sedeFiliadaNome}
                      onChange={(event) =>
                        setCadastroPiloto({
                          ...cadastroPiloto,
                          sedeFiliadaNome: event.target.value,
                        })
                      }
                      placeholder="Nome da igreja sede"
                    />
                  </label>

                  <label className="campo-cadastro-piloto-largo">
                    Endereço da sede
                    <input
                      type="text"
                      value={cadastroPiloto.sedeFiliadaEndereco}
                      onChange={(event) =>
                        setCadastroPiloto({
                          ...cadastroPiloto,
                          sedeFiliadaEndereco: event.target.value,
                        })
                      }
                      placeholder="Rua ou avenida da sede"
                    />
                  </label>

                  <label>
                    Número da sede
                    <input
                      type="text"
                      value={cadastroPiloto.sedeFiliadaNumero}
                      onChange={(event) =>
                        setCadastroPiloto({
                          ...cadastroPiloto,
                          sedeFiliadaNumero: event.target.value,
                        })
                      }
                      placeholder="Ex: 100"
                    />
                  </label>

                  <label className="campo-cadastro-piloto-largo">
                    Complemento da sede
                    <input
                      type="text"
                      value={cadastroPiloto.sedeFiliadaComplemento}
                      onChange={(event) =>
                        setCadastroPiloto({
                          ...cadastroPiloto,
                          sedeFiliadaComplemento: event.target.value,
                        })
                      }
                      placeholder="Opcional"
                    />
                  </label>

                  <label>
                    CEP da sede
                    <input
                      type="text"
                      value={cadastroPiloto.sedeFiliadaCep}
                      onChange={(event) =>
                        setCadastroPiloto({
                          ...cadastroPiloto,
                          sedeFiliadaCep: event.target.value,
                        })
                      }
                      placeholder="Ex: 36000-000"
                    />
                  </label>
                </>
              )}
            </div>

            {erroCadastroPiloto && <div className="aviso aviso-cadastro-piloto">{erroCadastroPiloto}</div>}
            {sucessoCadastroPiloto && <div className="aviso aviso-sucesso-cadastro">{sucessoCadastroPiloto}</div>}

            <button
              className="botao-principal botao-largura-total"
              type="submit"
              disabled={carregandoCadastroPiloto}
            >
              {carregandoCadastroPiloto ? 'Enviando cadastro...' : 'Enviar cadastro para aprovação'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (!sessao && telaPublica === 'login') {
    return (
      <div className="tela-login tela-login-v70">
        <section className="painel-apresentacao painel-login-v70">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Gestão inteligente para Escola Bíblica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto apresentacao-login-v70">
            <span className="selo-apresentacao">Área segura da igreja</span>
            <h2>Acesse o sistema da sua Escola Bíblica Dominical.</h2>
            <p>
              Entre para cuidar de classes, alunos, professores, chamadas, relatórios
              e configurações em um ambiente simples e organizado.
            </p>
          </div>

          <div className="preview-login-v70" aria-hidden="true">
            <div className="preview-login-card preview-login-card-maior">
              <span>Chamada digital</span>
              <strong>Presenças registradas</strong>
              <small>Dados separados por igreja</small>
            </div>
            <div className="preview-login-card">
              <span>Relatórios</span>
              <strong>PDF pronto</strong>
              <small>Organização para a secretaria</small>
            </div>
            <div className="preview-login-card">
              <span>Frequência</span>
              <strong>100%</strong>
              <small>Acompanhamento semanal</small>
            </div>
          </div>

          <div className="beneficios-login beneficios-login-v70">
            <div className="beneficio-item">
              <Icone nome="classes" className="icone-beneficio" />
              <span>Classes organizadas</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="alunos" className="icone-beneficio" />
              <span>Alunos e professores</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="chamada" className="icone-beneficio" />
              <span>Chamada digital</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="relatorios" className="icone-beneficio" />
              <span>Relatórios modernos</span>
            </div>
          </div>
        </section>

        <section className="cartao-login cartao-login-v70">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('landing')}
          >
            ← Voltar para apresentação
          </button>

          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="usuarios" className="icone-status" />
            </div>
            <div>
              <h2>Acesse sua conta</h2>
              <p>Entre com o e-mail e a senha cadastrados para gerenciar sua igreja.</p>
            </div>
          </div>

          <div className="aviso-login-aprovado aviso-login-v70">
            Use este acesso somente se sua igreja já foi aprovada pelo administrador.
          </div>

          <form className="formulario formulario-login" onSubmit={entrarComEmailSenha}>
            <label>
              E-mail
              <input
                type="email"
                value={emailLogin}
                onChange={(event) => setEmailLogin(event.target.value)}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={senhaLogin}
                onChange={(event) => setSenhaLogin(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
            </label>

            {erroLogin && <div className="aviso">{erroLogin}</div>}

            <button
              className="botao-principal botao-largura-total"
              type="submit"
              disabled={carregandoLogin}
            >
              {carregandoLogin ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="bloco-criar-piloto bloco-cadastro-destaque bloco-cadastro-v70">
            <span className="selo-primeiro-acesso">Primeiro acesso?</span>
            <h3>Solicitar cadastro da igreja</h3>
            <p>
              Ainda não tem acesso? Cadastre sua igreja para análise e liberação do
              administrador.
            </p>

            <button
              className="botao-cadastrar-igreja botao-largura-total"
              type="button"
              onClick={() => setTelaPublica('cadastroPiloto')}
            >
              Solicitar cadastro da igreja
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (!sessao) {
    return (
      <div className="pagina-publica modelo-exato-ebd">
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo logo-com-imagem-oficial">
              <div className="logo-icon logo-icon-oficial">
                <img
                  src="/logo-oficial-ebd-fiel.png"
                  alt="Logo oficial EBD Fiel"
                  className="logo-oficial-navbar"
                />
              </div>
              <div>
                <div className="logo-text">
                  {'EBD '}<span>{'Fiel'}</span>
                </div>
                <div className="logo-sub">{'ESCOLA B\u00cdBLICA DOMINICAL'}</div>
              </div>
            </div>

            <button
              className={`menu-toggle ${menuPublicoAberto ? 'active' : ''}`}
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMenuPublicoAberto(!menuPublicoAberto)}
            >
              <span className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            <div className="nav-links">
              <a href="#recursos">{'Recursos'}</a>
              <a href="#beneficios">{'Benef\u00edcios'}</a>
              <a href="#planos">{'Planos'}</a>
              <a href="#faq">{'Dúvidas'}</a>
              <button className="btn-nav" type="button" onClick={() => setTelaPublica('login')}>
                {'Entrar no sistema'}
              </button>
            </div>
          </div>
        </nav>

        <div className={`mobile-menu ${menuPublicoAberto ? 'active' : ''}`}>
          <a href="#recursos" onClick={() => setMenuPublicoAberto(false)}>
            {'Recursos'}
          </a>
          <a href="#beneficios" onClick={() => setMenuPublicoAberto(false)}>
            {'Benef\u00edcios'}
          </a>
          <a href="#planos" onClick={() => setMenuPublicoAberto(false)}>
            {'Planos'}
          </a>
          <a href="#faq" onClick={() => setMenuPublicoAberto(false)}>
            {'Dúvidas'}
          </a>
          <button
            className="btn-nav-mobile"
            type="button"
            onClick={() => {
              setMenuPublicoAberto(false)
              setTelaPublica('login')
            }}
          >
            {'Entrar no sistema'}
          </button>
        </div>

        {menuPublicoAberto && (
          <button
            className="menu-overlay active"
            aria-label="Fechar menu"
            type="button"
            onClick={() => setMenuPublicoAberto(false)}
          />
        )}

        <main>
          <section className="hero">
            <div className="hero-content">
              <div className="hero-copy">

                <h1>
                  {'Organize sua '}
                  <span>{'Escola Bíblica Dominical'}</span>
                  {' em poucos minutos'}
                </h1>

                <p>
                  {'Controle classes, alunos, professores, chamadas e relatórios em um só lugar, sem planilhas e sem retrabalho.'}
                </p>

                <button className="btn-primary btn-hero-login-v70" type="button" onClick={() => setTelaPublica('login')}>
                  {'Entrar no sistema'}
                </button>

                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-number">{'10'}</div>
                    <div className="stat-label">{'Igrejas no piloto'}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{'PDF'}</div>
                    <div className="stat-label">{'Relatórios prontos'}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{'24/7'}</div>
                    <div className="stat-label">{'Online'}</div>
                  </div>
                </div>
              </div>

              <div className="hero-mockup">
                <div className="mockup-header">
                  <div className="mockup-dot mockup-red"></div>
                  <div className="mockup-dot mockup-gold"></div>
                  <div className="mockup-dot mockup-green"></div>
                </div>

                <div className="mockup-body">
                  <div className="mockup-check">{'✓'}</div>
                  <h3>{'Painel da EBD'}</h3>
                  <p>{'Resumo simples para secretaria, professores e liderança.'}</p>

                  <div className="mockup-metricas-v70">
                    <div>
                      <strong>{'24'}</strong>
                      <span>{'presentes'}</span>
                    </div>
                    <div>
                      <strong>{'92%'}</strong>
                      <span>{'frequência'}</span>
                    </div>
                    <div>
                      <strong>{'PDF'}</strong>
                      <span>{'relatório'}</span>
                    </div>
                  </div>

                  <div className="mockup-lista-v70">
                    <span>{'Classes organizadas'}</span>
                    <span>{'Chamada digital'}</span>
                    <span>{'Aniversariantes da semana'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="recursos">
            <div className="container">
              <h2 className="section-title">{'Recursos que fazem a diferen\u00e7a'}</h2>
              <p className="section-subtitle">
                {'Tudo o que sua igreja precisa para uma gest\u00e3o eficiente da EBD.'}
              </p>

              <div className="features-grid">
                <article className="feature-card">
                  <div className="feature-icon">{'\u2713'}</div>
                  <h3>{'Chamada digital simples'}</h3>
                  <p>{'Registre a presen\u00e7a dos alunos e professores pelo computador ou celular.'}</p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">{'\u26EA'}</div>
                  <h3>{'Dados separados por igreja'}</h3>
                  <p>{'Cada igreja tem suas pr\u00f3prias informa\u00e7\u00f5es organizadas com seguran\u00e7a.'}</p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">{'\uD83D\uDCC4'}</div>
                  <h3>{'Relat\u00f3rios prontos em PDF'}</h3>
                  <p>{'A secretaria gera relat\u00f3rios organizados sem montar tudo manualmente.'}</p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">{'\uD83C\uDF10'}</div>
                  <h3>{'Acesso online'}</h3>
                  <p>{'Use o sistema pelo navegador, sem instala\u00e7\u00e3o complicada.'}</p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">{'\uD83D\uDC65'}</div>
                  <h3>{'Gest\u00e3o de classes e alunos'}</h3>
                  <p>{'Cadastre turmas, alunos, professores e acompanhe tudo em um s\u00f3 lugar.'}</p>
                </article>

                <article className="feature-card">
                  <div className="feature-icon">{'\uD83D\uDCCA'}</div>
                  <h3>{'Apoio para lideran\u00e7a'}</h3>
                  <p>{'Acompanhe frequ\u00eancia, organiza\u00e7\u00e3o e evolu\u00e7\u00e3o da EBD com mais clareza.'}</p>
                </article>
              </div>
            </div>
          </section>

          <section className="section section-soft">
            <div className="container">
              <h2 className="section-title">{'Chega de planilhas, pap\u00e9is e relat\u00f3rios manuais'}</h2>

              <div className="comparison">
                <div className="comparison-grid">
                  <article className="comparison-card before">
                    <div className="comparison-icon">{'\u26A0'}</div>
                    <h3>{'Antes'}</h3>
                    <ul>
                      <li>{'Listas de presen\u00e7a em papel'}</li>
                      <li>{'Dados espalhados'}</li>
                      <li>{'Relat\u00f3rios feitos manualmente'}</li>
                    </ul>
                  </article>

                  <article className="comparison-card after">
                    <div className="comparison-icon">{'\u2714'}</div>
                    <h3>{'Depois com o EBD Fiel'}</h3>
                    <ul>
                      <li>{'Chamada digital'}</li>
                      <li>{'Classes e alunos organizados'}</li>
                      <li>{'Relat\u00f3rios prontos em PDF'}</li>
                    </ul>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="beneficios">
            <div className="container">
              <h2 className="section-title">{'Feito para quem cuida da EBD'}</h2>

              <div className="personas-grid">
                <article className="persona-card">
                  <div className="persona-avatar">{'\uD83D\uDCCB'}</div>
                  <h3>{'Secretaria'}</h3>
                  <p>{'Organiza cadastros, classes, relat\u00f3rios e informa\u00e7\u00f5es gerais.'}</p>
                </article>

                <article className="persona-card">
                  <div className="persona-avatar">{'\uD83D\uDCDA'}</div>
                  <h3>{'Professores'}</h3>
                  <p>{'Fazem chamada, acompanham suas turmas e ajudam na organiza\u00e7\u00e3o semanal.'}</p>
                </article>

                <article className="persona-card">
                  <div className="persona-avatar">{'\u2B50'}</div>
                  <h3>{'Lideran\u00e7a'}</h3>
                  <p>{'Visualiza dados importantes para cuidar melhor da Escola B\u00edblica Dominical.'}</p>
                </article>
              </div>
            </div>
          </section>

          <section className="section section-plans" id="planos">
            <div className="container">
              <h2 className="section-title">{'Planos e acesso'}</h2>

              <div className="plans-grid">
                <article className="plan-card">
                  <div className="plan-badge">{'Fechado'}</div>
                  <h3>{'Teste piloto'}</h3>
                  <div className="plan-price">{'Gratuito'}</div>
                  <p>{'Para igrejas do grupo selecionadas.'}</p>
                  <button className="btn-outline" type="button" onClick={() => setTelaPublica('login')}>
                    {'Entrar'}
                  </button>
                </article>

                <article className="plan-card featured">
                  <div className="plan-badge">{'Mais usado'}</div>
                  <h3>{'Plano Igreja'}</h3>
                  <div className="plan-price">{'Sob consulta'}</div>
                  <p>{'Para uso completo na rotina da EBD.'}</p>
                  <button className="btn-primary" type="button" onClick={() => setTelaPublica('login')}>
                    {'J\u00e1 sou cliente'}
                  </button>
                </article>

                <article className="plan-card">
                  <h3>{'Plano Personalizado'}</h3>
                  <div className="plan-price">{'Sob consulta'}</div>
                  <p>{'Para igrejas com necessidades espec\u00edficas.'}</p>
                  <button className="btn-outline" type="button" onClick={() => setTelaPublica('login')}>
                    {'Acessar sistema'}
                  </button>
                </article>
              </div>

              <p className="plans-note">{'Sem cadastro p\u00fablico. Libera\u00e7\u00e3o manual pelo administrador.'}</p>
            </div>
          </section>

          <section className="section" id="faq">
            <div className="container">
              <h2 className="section-title">{'Perguntas frequentes'}</h2>

              <div className="faq-list">
                <details className="faq-item">
                  <summary>{'Como fa\u00e7o para participar do teste piloto?'}</summary>
                  <p>
                    {'O teste piloto \u00e9 exclusivo para participantes do grupo de WhatsApp da EBD Fiel.'}
                  </p>
                </details>

                <details className="faq-item">
                  <summary>{'O sistema funciona no celular?'}</summary>
                  <p>{'Sim. O EBD Fiel funciona no celular, tablet e computador.'}</p>
                </details>

                <details className="faq-item">
                  <summary>{'Os dados da minha igreja s\u00e3o seguros?'}</summary>
                  <p>{'Sim. Cada igreja tem seus dados separados e acesso controlado por usu\u00e1rio.'}</p>
                </details>

                <details className="faq-item">
                  <summary>{'Preciso instalar algum software?'}</summary>
                  <p>{'N\u00e3o. O EBD Fiel \u00e9 online e acessado pelo navegador.'}</p>
                </details>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">{'EBD FIEL'}</div>
              <p>{'Fiel \u00e0 Palavra, organizado para servir melhor.'}</p>
              <p className="footer-gold">{'Escola B\u00edblica Dominical'}</p>
            </div>

            <div className="footer-col">
              <h4>{'Mapa do site'}</h4>
              <a href="#recursos">{'Recursos'}</a>
              <a href="#beneficios">{'Benef\u00edcios'}</a>
              <a href="#planos">{'Planos'}</a>
              <a href="#faq">{'Dúvidas'}</a>
            </div>

            <div className="footer-col">
              <h4>{'Contato'}</h4>
              <span>{'WhatsApp'}</span>
              <span>{'contato@ebdfiel.com.br'}</span>
            </div>

            <div className="footer-col">
              <h4>{'Teste exclusivo'}</h4>
              <p>{'Grupo fechado para participantes'}</p>
              <button className="btn-outline footer-button" type="button" onClick={() => setTelaPublica('login')}>
                {'J\u00e1 sou cliente'}
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{'\u00a9 2026 EBD Fiel - Todos os direitos reservados.'}</p>
          </div>
        </footer>
      </div>
    )
  }

  if (carregando && !sessao) {
    return (
      <div className="tela-login tela-mensagem">
        <section className="painel-apresentacao">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Gestão inteligente para Escola Bíblica Dominical.</p>
            </div>
          </div>
        </section>

        <section className="cartao-login cartao-mensagem">
          <div className="mensagem-status-icone">
            <Icone nome="painel" className="icone-status" />
          </div>
          <h2>Carregando...</h2>
          <p>Buscando dados da igreja, classes, alunos e chamadas.</p>
        </section>
      </div>
    )
  }

  if (sessao && igrejaAtualPiloto?.status_piloto === 'pendente' && !usuarioEhAdminSistema()) {
    return (
      <div className="tela-login tela-mensagem">
        <section className="painel-apresentacao">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Gestão da Escola Bíblica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Cadastro recebido</span>
            <h2>Seu acesso está aguardando aprovação.</h2>
            <p>
              A equipe administradora vai conferir os dados da igreja e liberar o uso
              do sistema.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-mensagem">
          <div className="mensagem-status-icone">
            <Icone nome="check" className="icone-status" />
          </div>
          <h2>Aguardando aprovação</h2>
          <p>
            Assim que sua igreja for aprovada, você poderá entrar normalmente e começar
            a validação.
          </p>
          <button className="botao-secundario" onClick={sairDoSistema}>
            Sair
          </button>
        </section>
      </div>
    )
  }

  if (erroSistema) {
    return (
      <div className="tela-login tela-mensagem">
        <section className="painel-apresentacao">
          <div className="marca-login">
            <div className="logo-simbolo">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <h1>EBD Fiel</h1>
              <p>Gestão inteligente para Escola Bíblica Dominical.</p>
            </div>
          </div>
        </section>

        <section className="cartao-login cartao-mensagem">
          <div className="mensagem-status-icone mensagem-erro-icone">
            <Icone nome="configuracoes" className="icone-status" />
          </div>
          <h2>Erro ao carregar</h2>
          <p>{erroSistema}</p>

          <button
            className="botao-principal botao-largura-total"
            onClick={() => carregarDadosOnline()}
          >
            Tentar novamente
          </button>
        </section>
      </div>
    )
  }


  function formatarDataNascimento(dataTexto) {
    if (!dataTexto) {
      return ''
    }

    const partes = dataTexto.split('-')

    if (partes.length !== 3) {
      return dataTexto
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  function calcularDiasAteAniversario(dataNascimento) {
    if (!dataNascimento) {
      return null
    }

    const partes = dataNascimento.split('-')

    if (partes.length !== 3) {
      return null
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const mes = Number(partes[1]) - 1
    const dia = Number(partes[2])

    let aniversario = new Date(hoje.getFullYear(), mes, dia)
    aniversario.setHours(0, 0, 0, 0)

    if (aniversario < hoje) {
      aniversario = new Date(hoje.getFullYear() + 1, mes, dia)
      aniversario.setHours(0, 0, 0, 0)
    }

    const diferenca = aniversario.getTime() - hoje.getTime()
    return Math.round(diferenca / (1000 * 60 * 60 * 24))
  }

  function buscarAniversariantesDaSemana() {
    if (!usuarioEhSecretaria()) {
      return []
    }

    const aniversariantesAlunos = alunos
      .filter((aluno) => aluno.dataNascimento)
      .map((aluno) => ({
        id: `aluno-${aluno.id}`,
        nome: aluno.nome,
        tipo: aluno.tipoPessoa === 'professor' ? 'Professor' : 'Aluno',
        detalhe: buscarNomeClasse(aluno.classeId),
        dataNascimento: aluno.dataNascimento,
        dias: calcularDiasAteAniversario(aluno.dataNascimento),
      }))

    const aniversariantesEquipe = perfisIgreja
      .filter((perfil) => perfil.data_nascimento)
      .map((perfil) => ({
        id: `perfil-${perfil.id}`,
        nome: perfil.nome || perfil.email,
        tipo: perfil.perfil === 'professor' ? 'Professor' : 'Secretaria',
        detalhe:
          perfil.perfil === 'professor' && perfil.classe_id
            ? buscarNomeClasse(perfil.classe_id)
            : 'Equipe da igreja',
        dataNascimento: perfil.data_nascimento,
        dias: calcularDiasAteAniversario(perfil.data_nascimento),
      }))

    return [...aniversariantesAlunos, ...aniversariantesEquipe]
      .filter((pessoa) => pessoa.dias !== null && pessoa.dias >= 0 && pessoa.dias <= 7)
      .sort((a, b) => a.dias - b.dias || a.nome.localeCompare(b.nome))
  }

  function descreverAniversario(dias) {
    if (dias === 0) {
      return 'Hoje'
    }

    if (dias === 1) {
      return 'Amanhã'
    }

    return `Em ${dias} dias`
  }

  function abrirNovoPerfil() {
    setNovoPerfil({
      userId: '',
      nome: '',
      email: '',
      perfil: 'professor',
      classeIds: [],
      dataNascimento: '',
    })
    setPerfilEditandoId(null)
    setMostrarFormularioPerfil(true)
  }

  function editarPerfil(perfil) {
    setNovoPerfil({
      userId: perfil.user_id || '',
      nome: perfil.nome || '',
      email: perfil.email || '',
      perfil: perfil.perfil || 'professor',
      classeIds:
        perfil.perfil === 'professor'
          ? buscarClassesVinculadasAoProfessor(perfil.id).map(String)
          : [],
      dataNascimento: perfil.data_nascimento || '',
    })
    setPerfilEditandoId(perfil.id)
    setMostrarFormularioPerfil(true)
  }

  function cancelarFormularioPerfil() {
    setNovoPerfil({
      userId: '',
      nome: '',
      email: '',
      perfil: 'professor',
      classeIds: [],
      dataNascimento: '',
    })
    setPerfilEditandoId(null)
    setMostrarFormularioPerfil(false)
  }

  async function salvarPerfilUsuario(event) {
    event.preventDefault()

    if (!usuarioEhSecretaria()) {
      alert('Apenas a secretaria pode cadastrar usuários.')
      return
    }

    if (!novoPerfil.userId.trim()) {
      alert('Informe o User UID do usuário criado no Supabase Auth.')
      return
    }

    if (!novoPerfil.nome.trim() || !novoPerfil.email.trim()) {
      alert('Informe o nome e o e-mail do usuário.')
      return
    }

    if (novoPerfil.perfil === 'professor' && novoPerfil.classeIds.length === 0) {
      alert('Selecione pelo menos uma classe do professor.')
      return
    }

    const dadosPerfil = {
      user_id: novoPerfil.userId.trim(),
      nome: novoPerfil.nome.trim(),
      email: novoPerfil.email.trim(),
      perfil: novoPerfil.perfil,
      classe_id:
        novoPerfil.perfil === 'professor'
          ? Number(novoPerfil.classeIds[0])
          : null,
      data_nascimento: novoPerfil.dataNascimento || null,
      igreja_id: buscarIgrejaIdAtual(),
    }

    const { data: perfilSalvo, error } = await supabase
      .from('perfis_usuarios')
      .upsert(dadosPerfil, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      mostrarErroSistema(error, 'Erro ao salvar usuário.')
      return
    }

    const { error: erroRemoverVinculos } = await supabase
      .from('classes_professores')
      .delete()
      .eq('perfil_usuario_id', perfilSalvo.id)

    if (erroRemoverVinculos) {
      mostrarErroSistema(erroRemoverVinculos, 'Erro ao atualizar vínculos do professor.')
      return
    }

    if (perfilSalvo.perfil === 'professor' && novoPerfil.classeIds.length > 0) {
      const vinculosParaSalvar = novoPerfil.classeIds.map((classeId) => ({
        igreja_id: buscarIgrejaIdAtual(),
        classe_id: Number(classeId),
        perfil_usuario_id: perfilSalvo.id,
        ativo: true,
      }))

      const { error: erroInserirVinculos } = await supabase
        .from('classes_professores')
        .insert(vinculosParaSalvar)

      if (erroInserirVinculos) {
        mostrarErroSistema(erroInserirVinculos, 'Erro ao vincular professor às classes.')
        return
      }
    }

    await buscarTodosOsDados()
    cancelarFormularioPerfil()
    alert('Usuário salvo com sucesso!')
  }

  async function excluirPerfilUsuario(perfil) {
    if (!usuarioEhSecretaria()) {
      alert('Apenas a secretaria pode excluir usuários.')
      return
    }

    if (perfil.user_id === sessao?.user?.id) {
      alert('Você não pode excluir o seu próprio perfil de secretaria.')
      return
    }

    const confirmar = window.confirm(
      `Deseja remover o perfil de ${perfil.nome || perfil.email}?`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase
      .from('perfis_usuarios')
      .delete()
      .eq('id', perfil.id)

    if (error) {
      mostrarErroSistema(error, 'Erro ao remover perfil.')
      return
    }

    await buscarTodosOsDados()
  }

  function abrirJanelaAniversariantesSemana() {
    setJanelaAniversariantesAberta(true)
  }

  function fecharJanelaAniversariantesSemana() {
    setJanelaAniversariantesAberta(false)
    setAniversarianteCartaoId(null)
  }

  function montarHtmlTabelaAniversariantesSemana(aniversariantes = buscarAniversariantesDaSemana()) {
    return aniversariantes.length > 0
      ? `
        <table>
          <thead>
            <tr>
              <th class="numero">Nº</th>
              <th>Nome</th>
              <th>Função</th>
              <th>Classe/área</th>
              <th>Data</th>
              <th>Quando</th>
            </tr>
          </thead>
          <tbody>
            ${aniversariantes.map((pessoa, indice) => `
              <tr>
                <td class="numero">${indice + 1}</td>
                <td>${escaparHtmlRelatorio(pessoa.nome)}</td>
                <td>${escaparHtmlRelatorio(pessoa.tipo || '')}</td>
                <td>${escaparHtmlRelatorio(pessoa.detalhe || 'Sem informação')}</td>
                <td>${escaparHtmlRelatorio(formatarDataNascimento(pessoa.dataNascimento))}</td>
                <td>${escaparHtmlRelatorio(descreverAniversario(pessoa.dias))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
      : '<div class="vazio">Nenhum aniversariante encontrado para os próximos 7 dias.</div>'
  }

  function imprimirAniversariantesSemana() {
    const aniversariantes = buscarAniversariantesDaSemana()

    imprimirHtmlEmIframe(
      montarDocumentoRelatorioExtra(
        'Aniversariantes da semana',
        'Pessoas com aniversário hoje ou nos próximos 7 dias.',
        montarHtmlTabelaAniversariantesSemana(aniversariantes),
        'portrait'
      ),
      'iframe-aniversariantes-semana-painel'
    )
  }

  async function baixarPdfAniversariantesSemana() {
    const area = aniversariantesSemanaRef.current

    if (!area) {
      alert('Não foi possível encontrar a lista de aniversariantes para gerar o PDF.')
      return
    }

    try {
      const canvas = await html2canvas(area, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })

      const imagem = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const larguraPagina = pdf.internal.pageSize.getWidth()
      const alturaPagina = pdf.internal.pageSize.getHeight()
      const margem = 10
      const larguraUtil = larguraPagina - margem * 2
      const alturaImagem = (canvas.height * larguraUtil) / canvas.width

      if (alturaImagem <= alturaPagina - margem * 2) {
        pdf.addImage(imagem, 'PNG', margem, margem, larguraUtil, alturaImagem)
      } else {
        let alturaRestante = alturaImagem
        let deslocamento = 0

        while (alturaRestante > 0) {
          pdf.addImage(imagem, 'PNG', margem, margem - deslocamento, larguraUtil, alturaImagem)
          alturaRestante -= alturaPagina - margem * 2
          deslocamento += alturaPagina - margem * 2

          if (alturaRestante > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save('aniversariantes-da-semana-ebd-fiel.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF de aniversariantes:', error)
      alert('Não foi possível gerar o PDF. Tente novamente.')
    }
  }


  function obterAniversarianteSelecionadoCartao(aniversariantes) {
    if (!Array.isArray(aniversariantes) || aniversariantes.length === 0) {
      return null
    }

    return aniversariantes.find((pessoa) => pessoa.id === aniversarianteCartaoId) || aniversariantes[0]
  }

  function limparNomeParaArquivo(valor) {
    return String(valor || 'aniversariante')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'aniversariante'
  }

  const mensagensCartaoAniversario = [
    'Desejamos que o Senhor derrame paz, alegria e saúde sobre sua vida. Que este novo ciclo seja marcado por graça, crescimento espiritual e muitas vitórias.',
    'Que Deus abençoe ricamente a sua caminhada e renove suas forças neste novo ano de vida. Receba um tempo de alegria, proteção, esperança e muitas bênçãos.',
    'Oramos para que o Senhor conduza cada passo da sua vida com amor, sabedoria e paz. Que este aniversário abra uma fase linda de conquistas e comunhão com Deus.',
    'Que esta nova etapa seja iluminada pela presença do Senhor. Desejamos um aniversário feliz, com saúde, serenidade, frutos espirituais e lindas respostas de oração.',
    'Receba o carinho da Escola Bíblica Dominical neste dia especial. Que Deus fortaleça sua fé, alegre o seu coração e conceda um ano cheio de graça e vitórias.'
  ]

  const versiculosCartaoAniversario = [
    {
      texto: '“Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.”',
      referencia: 'Salmo 118:24',
    },
    {
      texto: '“O Senhor te abençoe e te guarde; o Senhor faça resplandecer o rosto sobre ti.”',
      referencia: 'Números 6:24-25',
    },
    {
      texto: '“Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz.”',
      referencia: 'Jeremias 29:11',
    },
    {
      texto: '“Deleita-te também no Senhor, e ele te concederá o que deseja o teu coração.”',
      referencia: 'Salmo 37:4',
    },
    {
      texto: '“O choro pode durar uma noite, mas a alegria vem pela manhã.”',
      referencia: 'Salmo 30:5',
    },
  ]

  function obterIndiceVariacaoCartao(aniversariante) {
    const chave = `${aniversariante?.id || ''}-${aniversariante?.nome || ''}-${aniversariante?.dataNascimento || ''}`

    return Array.from(chave).reduce((total, caractere) => total + caractere.charCodeAt(0), 0)
  }

  function obterConteudoCartaoAniversario(aniversariante) {
    const indiceBase = obterIndiceVariacaoCartao(aniversariante)
    const mensagem = mensagensCartaoAniversario[indiceBase % mensagensCartaoAniversario.length]
    const versiculo = versiculosCartaoAniversario[indiceBase % versiculosCartaoAniversario.length]

    return {
      mensagem,
      versiculoTexto: versiculo.texto,
      versiculoReferencia: versiculo.referencia,
      assinaturaLinha1: 'com carinho,',
      assinaturaLinha2: 'escola bíblica dominical.',
    }
  }

  function obterClasseNomeCartao(nome) {
    const tamanho = String(nome || '').trim().length

    if (tamanho >= 24) return 'cartao-aniversario-nome-muito-longo'
    if (tamanho >= 16) return 'cartao-aniversario-nome-longo'
    return ''
  }

  function baixarCanvasComoPng(canvas, nomeArquivo) {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function transformarCanvasEmArquivoPng(canvas, nomeArquivo) {
    return new Promise((resolve, reject) => {
      if (!canvas) {
        reject(new Error('Cartão não encontrado.'))
        return
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Não foi possível preparar a imagem do cartão.'))
          return
        }

        resolve(new File([blob], nomeArquivo, { type: 'image/png' }))
      }, 'image/png')
    })
  }

  async function capturarCartaoAniversario() {
    const area = cartaoAniversarioRef.current

    if (!area) {
      alert('Selecione um aniversariante para gerar o cartão.')
      return null
    }

    return html2canvas(area, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
    })
  }

  async function baixarImagemCartaoAniversario() {
    try {
      const aniversariante = obterAniversarianteSelecionadoCartao(buscarAniversariantesDaSemana())
      const canvas = await capturarCartaoAniversario()

      if (!canvas) {
        return
      }

      baixarCanvasComoPng(
        canvas,
        `cartao-aniversario-${limparNomeParaArquivo(aniversariante?.nome)}.png`
      )
    } catch (error) {
      console.error('Erro ao baixar cartão de aniversário:', error)
      alert('Não foi possível baixar o cartão. Tente novamente.')
    }
  }

  async function enviarCartaoPeloWhatsApp() {
    try {
      const aniversariante = obterAniversarianteSelecionadoCartao(buscarAniversariantesDaSemana())
      const canvas = await capturarCartaoAniversario()

      if (!canvas) {
        return
      }

      const nomeArquivo = `cartao-aniversario-${limparNomeParaArquivo(aniversariante?.nome)}.png`
      const conteudoCartao = obterConteudoCartaoAniversario(aniversariante)
      const mensagemWhatsApp = `Feliz aniversário, ${aniversariante?.nome || ''}! 🎉

${conteudoCartao.mensagem}

${conteudoCartao.versiculoTexto} (${conteudoCartao.versiculoReferencia})

${conteudoCartao.assinaturaLinha1} ${conteudoCartao.assinaturaLinha2}`

      try {
        const arquivo = await transformarCanvasEmArquivoPng(canvas, nomeArquivo)
        const dadosCompartilhamento = {
          title: `Cartão de aniversário - ${aniversariante?.nome || 'Aniversariante'}`,
          text: mensagemWhatsApp,
          files: [arquivo],
        }

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [arquivo] })) {
          await navigator.share(dadosCompartilhamento)
          return
        }
      } catch (erroCompartilhamento) {
        console.warn('Compartilhamento direto com imagem indisponível neste navegador:', erroCompartilhamento)
      }

      baixarCanvasComoPng(canvas, nomeArquivo)

      const mensagem = encodeURIComponent(
        `${mensagemWhatsApp}\n\nO cartão foi baixado em imagem. Anexe a imagem no WhatsApp para enviar ao aniversariante.`
      )
      const janelaWhatsApp = window.open(`https://wa.me/?text=${mensagem}`, '_blank', 'noopener,noreferrer')

      if (!janelaWhatsApp) {
        alert('O cartão foi baixado. Abra o WhatsApp e anexe a imagem para enviar ao aniversariante.')
      } else {
        alert('Neste navegador não foi possível enviar imagem e mensagem juntos automaticamente. O cartão foi baixado e o WhatsApp foi aberto com a mensagem pronta.')
      }
    } catch (error) {
      console.error('Erro ao abrir WhatsApp para envio do cartão:', error)
      alert('Não foi possível abrir o WhatsApp. O cartão pode ser baixado pelo botão Baixar cartão.')
    }
  }

  async function baixarPdfCartaoAniversario() {
    try {
      const aniversariante = obterAniversarianteSelecionadoCartao(buscarAniversariantesDaSemana())
      const canvas = await capturarCartaoAniversario()

      if (!canvas) {
        return
      }

      const imagem = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const larguraPagina = pdf.internal.pageSize.getWidth()
      const alturaPagina = pdf.internal.pageSize.getHeight()
      const margemPagina = 10
      let larguraCartao = Math.min(170, larguraPagina - margemPagina * 2)
      let alturaCartao = (canvas.height * larguraCartao) / canvas.width

      if (alturaCartao > alturaPagina - margemPagina * 2) {
        alturaCartao = alturaPagina - margemPagina * 2
        larguraCartao = (canvas.width * alturaCartao) / canvas.height
      }

      const x = (larguraPagina - larguraCartao) / 2
      const y = Math.max(margemPagina, (alturaPagina - alturaCartao) / 2)

      pdf.addImage(imagem, 'PNG', x, y, larguraCartao, alturaCartao)
      pdf.save(`cartao-aniversario-${limparNomeParaArquivo(aniversariante?.nome)}.pdf`)
    } catch (error) {
      console.error('Erro ao gerar PDF do cartão de aniversário:', error)
      alert('Não foi possível gerar o PDF do cartão. Tente novamente.')
    }
  }

  async function imprimirCartaoAniversario() {
    try {
      const canvas = await capturarCartaoAniversario()

      if (!canvas) {
        return
      }

      const imagem = canvas.toDataURL('image/png')

      imprimirHtmlEmIframe(
        `
          <!doctype html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Cartão de aniversário</title>
              <style>
                * { box-sizing: border-box; }
                body {
                  margin: 0;
                  min-height: 100vh;
                  display: grid;
                  place-items: center;
                  padding: 10mm;
                  background: #ffffff;
                }
                img {
                  width: min(170mm, 100%);
                  height: auto;
                  display: block;
                  border-radius: 10mm;
                }
                @media print {
                  @page { size: A4 portrait; margin: 8mm; }
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <img src="${imagem}" alt="Cartão de aniversário" />
            </body>
          </html>
        `,
        'iframe-cartao-aniversario-individual'
      )
    } catch (error) {
      console.error('Erro ao imprimir cartão de aniversário:', error)
      alert('Não foi possível imprimir o cartão. Tente novamente.')
    }
  }

  function renderizarJanelaAniversariantesSemana() {
    const aniversariantes = buscarAniversariantesDaSemana()
    const aniversariantesHoje = aniversariantes.filter((pessoa) => Number(pessoa.dias) === 0)
    const proximosAniversariantes = aniversariantes.filter((pessoa) => Number(pessoa.dias) > 0)
    const aniversarianteCartao = obterAniversarianteSelecionadoCartao(aniversariantes)
    const conteudoCartaoAniversariante = aniversarianteCartao
      ? obterConteudoCartaoAniversario(aniversarianteCartao)
      : null

    return (
      <div
        className="janela-aniversariantes-fundo"
        role="dialog"
        aria-modal="true"
        aria-label="Aniversariantes da semana"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            fecharJanelaAniversariantesSemana()
          }
        }}
      >
        <div className="janela-aniversariantes-conteudo">
          <button
            type="button"
            className="janela-aniversariantes-fechar"
            aria-label="Fechar aniversariantes da semana"
            onClick={fecharJanelaAniversariantesSemana}
          >
            ×
          </button>

          <div className="janela-aniversariantes-papel" ref={aniversariantesSemanaRef}>
            <div className="janela-aniversariantes-topo">
              <div>
                <span className="hero-tag">Agenda da semana</span>
                <h3>Aniversariantes da semana</h3>
                <p>
                  Confira alunos, professores e secretarias que fazem aniversário hoje ou nos próximos 7 dias.
                </p>
              </div>
              <div className="janela-aniversariantes-selo">🎁</div>
            </div>

            <div className="janela-aniversariantes-resumo">
              <div>
                <strong>{aniversariantes.length}</strong>
                <span>Total na semana</span>
              </div>
              <div>
                <strong>{aniversariantesHoje.length}</strong>
                <span>Hoje</span>
              </div>
              <div>
                <strong>{proximosAniversariantes.length}</strong>
                <span>Próximos dias</span>
              </div>
            </div>

            {aniversariantes.length > 0 ? (
              <div className="janela-aniversariantes-lista">
                {aniversariantes.map((pessoa) => (
                  <article
                    className={`janela-aniversariante-item${aniversarianteCartao?.id === pessoa.id ? ' ativo' : ''}`}
                    key={pessoa.id}
                  >
                    <div className="janela-aniversariante-icone">🎉</div>
                    <div>
                      <strong>{pessoa.nome}</strong>
                      <p>{pessoa.tipo} • {pessoa.detalhe || 'Sem informação'}</p>
                    </div>
                    <span>{formatarDataNascimento(pessoa.dataNascimento)}</span>
                    <em>{descreverAniversario(pessoa.dias)}</em>
                    <button
                      type="button"
                      className="botao-mini-cartao"
                      onClick={() => setAniversarianteCartaoId(pessoa.id)}
                    >
                      Ver cartão
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="janela-aniversariantes-vazio">
                Nenhum aniversário cadastrado para os próximos 7 dias.
              </div>
            )}

            {aniversarianteCartao && (
              <div className="cartao-aniversario-area">
                <div className="cartao-aniversario-info">
                  <span className="hero-tag">Cartão individual</span>
                  <h4>Cartão pronto para {aniversarianteCartao.nome}</h4>
                  <p>
                    Baixe a imagem para enviar pelo WhatsApp ou imprima em papel A4.
                    A assinatura foi ajustada e cada aniversariante recebe uma mensagem diferente.
                  </p>
                </div>

                <div className="cartao-aniversario-visualizacao">
                  <article className="cartao-aniversario-oficial" ref={cartaoAniversarioRef}>
                    <div className="cartao-aniversario-moldura">
                      <div className="cartao-aniversario-livro" aria-hidden="true">📖</div>
                      <div className="cartao-aniversario-pomba" aria-hidden="true">🕊️</div>
                      <div className="cartao-aniversario-flores cartao-aniversario-flores-esquerda" aria-hidden="true">
                        <span></span><span></span><span></span><span></span>
                      </div>
                      <div className="cartao-aniversario-presente" aria-hidden="true">
                        <div className="presente-laco"></div>
                        <div className="presente-caixa"></div>
                      </div>
                      <div className="cartao-aniversario-bolo" aria-hidden="true">
                        <div className="bolo-camada bolo-camada-superior"></div>
                        <div className="bolo-camada bolo-camada-inferior"></div>
                        <div className="bolo-base"></div>
                      </div>

                      <div className="cartao-aniversario-texto">
                        <h4>
                          <span>Feliz</span>
                          <em>aniversário,</em>
                          <strong className={obterClasseNomeCartao(aniversarianteCartao.nome)}>{aniversarianteCartao.nome}!</strong>
                        </h4>

                        <div className="cartao-aniversario-divisor" aria-hidden="true">❤</div>

                        <p className="cartao-aniversario-mensagem">
                          {conteudoCartaoAniversariante?.mensagem}
                        </p>

                        <section className="cartao-aniversario-versiculo">
                          <span>📖 Versículo bíblico</span>
                          <p>{conteudoCartaoAniversariante?.versiculoTexto}</p>
                          <strong>{conteudoCartaoAniversariante?.versiculoReferencia}</strong>
                        </section>

                        <footer>
                          <em>{conteudoCartaoAniversariante?.assinaturaLinha1}</em>
                          <strong>{conteudoCartaoAniversariante?.assinaturaLinha2}</strong>
                        </footer>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}

            <div className="janela-aniversariantes-rodape">
              <strong>Mensagem sugerida:</strong>
              <p>
                {conteudoCartaoAniversariante?.mensagem || 'Escolha um aniversariante para visualizar uma mensagem personalizada.'}
              </p>
            </div>
          </div>

          <div className="janela-aniversariantes-acoes janela-aniversariantes-acoes-completas">
            <button className="botao-principal" type="button" onClick={baixarImagemCartaoAniversario} disabled={!aniversarianteCartao}>
              Baixar cartão
            </button>
            <button className="botao-secundario" type="button" onClick={enviarCartaoPeloWhatsApp} disabled={!aniversarianteCartao}>
              Enviar imagem no WhatsApp
            </button>
            <button className="botao-secundario" type="button" onClick={baixarPdfCartaoAniversario} disabled={!aniversarianteCartao}>
              Baixar PDF do cartão
            </button>
            <button className="botao-secundario" type="button" onClick={imprimirCartaoAniversario} disabled={!aniversarianteCartao}>
              Imprimir cartão
            </button>
            <button className="botao-secundario" type="button" onClick={baixarPdfAniversariantesSemana}>
              PDF da lista
            </button>
            <button className="botao-secundario" type="button" onClick={imprimirAniversariantesSemana}>
              Imprimir lista
            </button>
            <button className="botao-secundario" type="button" onClick={fecharJanelaAniversariantesSemana}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderizarFeedbackPiloto() {
    if (!igrejaEstaEmTestePiloto()) {
      return null
    }

    return (
      <div className={`feedback-piloto-card feedback-piloto-card-compacto${formularioSugestaoAberto ? ' feedback-piloto-card-aberto' : ''}`}>
        <div className="feedback-piloto-topo feedback-piloto-topo-compacto">
          <div>
            <span className="hero-tag">Ajude a melhorar</span>
            <h3>Enviar sugestão para a equipe EBD Fiel</h3>
            <p>
              Registre dúvidas, sugestões, elogios ou pontos de melhoria. A equipe poderá acompanhar e responder pela plataforma.
            </p>
          </div>

          <button
            className="botao-secundario"
            type="button"
            onClick={() => setFormularioSugestaoAberto((aberto) => !aberto)}
          >
            {formularioSugestaoAberto ? 'Ocultar formulário' : 'Enviar sugestão'}
          </button>
        </div>

        {formularioSugestaoAberto && (
          <form className="feedback-piloto-form feedback-piloto-form-moderno" onSubmit={enviarFeedbackPiloto}>
            <div className="feedback-form-grid">
              <label className="feedback-campo feedback-campo-tipo">
                <span>Tipo de mensagem</span>
                <select
                  value={feedbackPiloto.tipo}
                  onChange={(event) =>
                    setFeedbackPiloto({ ...feedbackPiloto, tipo: event.target.value })
                  }
                >
                  <option value="sugestao">Sugestão</option>
                  <option value="erro">Erro encontrado</option>
                  <option value="duvida">Dúvida</option>
                  <option value="elogio">Elogio</option>
                </select>
              </label>

              <div className="feedback-dica">
                <strong>Ajude a melhorar o piloto</strong>
                <span>Descreva com detalhes o que aconteceu, onde aconteceu e o que você esperava.</span>
              </div>
            </div>

            <label className="feedback-campo feedback-campo-mensagem">
              <div className="feedback-label-linha">
                <span>Mensagem</span>
                <small>{feedbackPiloto.mensagem.length}/1000</small>
              </div>

              <textarea
                value={feedbackPiloto.mensagem}
                maxLength="1000"
                onChange={(event) =>
                  setFeedbackPiloto({ ...feedbackPiloto, mensagem: event.target.value })
                }
                placeholder="Ex: Na chamada dos professores, senti falta de visualizar todos os professores cadastrados antes de salvar..."
                rows="6"
              />
            </label>

            <div className="feedback-acoes">
              <button className="botao-feedback-enviar" type="submit" disabled={carregandoFeedback}>
                <span>{carregandoFeedback ? 'Enviando...' : 'Enviar mensagem'}</span>
                <strong>→</strong>
              </button>

              <p>
                Sua mensagem fica registrada para os administradores acompanharem e responderem pela própria plataforma.
              </p>
            </div>
          </form>
        )}

        {feedbacksIgreja.length > 0 && (
          <div className="feedbacks-recentes-igreja feedbacks-recentes-igreja-compacto">
            <h4>Últimas mensagens enviadas</h4>

            {feedbacksIgreja.slice(0, formularioSugestaoAberto ? 4 : 2).map((feedback) => (
              <div
                className={`feedback-recente-item ${feedback.resposta_admin ? 'feedback-com-resposta' : ''}`}
                key={feedback.id}
              >
                <strong>{feedback.tipo}</strong>
                <p>{feedback.mensagem}</p>
                <span>{formatarDataHoraFeedback(feedback.created_at)}</span>

                {feedback.resposta_admin ? (
                  <div className="feedback-resposta-igreja">
                    <strong>Resposta da equipe EBD Fiel</strong>
                    <p>{feedback.resposta_admin}</p>
                    <small>{formatarDataHoraFeedback(feedback.respondido_em)}</small>
                  </div>
                ) : (
                  <small className="feedback-aguardando-resposta">
                    Aguardando resposta da equipe.
                  </small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }


  function renderizarDashboardAvancado() {
    const dadosClasse = montarDashboardPorClasse()
    const maiorFrequencia = dadosClasse.reduce(
      (maior, item) => Math.max(maior, item.frequencia),
      0
    )
    const alertasFaltas = buscarAlertasDeFaltas()
    const destaques = buscarDestaquesFrequencia().slice(0, 5)

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Resumo geral da EBD</h2>
            <p>Indicadores visuais sem alterar os cadastros existentes.</p>
          </div>
          <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('relatorios')}>
            Abrir relatórios
          </button>
        </div>

        <div className="dashboard-v41-hero">
          <div>
            <span className="selo-publico">Visão geral</span>
            <h3>{buscarNomeIgrejaParaExibicao()}</h3>
            <p>Resumo automático de presença, matrícula, classes e acompanhamento pastoral da secretaria.</p>
          </div>
          <div className="dashboard-v41-circulo">
            <strong>{calcularFrequenciaGeral()}%</strong>
            <span>frequência geral</span>
          </div>
        </div>

        <div className="cards cards-estatisticas dashboard-v41-cards">
          <CardResumo icone="alunos" titulo="Matrícula" valor={alunosSomente().length} descricao="alunos cadastrados" />
          <CardResumo icone="classes" titulo="Classes" valor={classes.length} descricao="turmas ativas" />
          <CardResumo icone="chamada" titulo="Chamadas" valor={chamadasSalvas.length} descricao="registros de alunos" />
          <CardResumo icone="check" titulo="Alertas" valor={alertasFaltas.length} descricao="alunos para acompanhar" destaque />
        </div>

        <div className="dashboard-v41-grid">
          <div className="dashboard-v41-bloco">
            <h3>Frequência por classe</h3>
            <div className="lista-graficos-v41">
              {dadosClasse.map((item) => (
                <div className="linha-grafico-v41" key={item.classe.id}>
                  <div className="linha-grafico-v41-topo">
                    <strong>{item.classe.nome}</strong>
                    <span>{item.frequencia}%</span>
                  </div>
                  <div className="barra-grafico-v41" aria-label={`Frequência ${item.frequencia}%`}>
                    <span style={{ width: `${item.frequencia}%` }} />
                  </div>
                  <p>{item.presentes} presenças, {item.faltas} faltas, {item.chamadas} chamada(s).</p>
                </div>
              ))}
              {dadosClasse.length === 0 && <p className="texto-sem-aniversariantes">Nenhuma classe cadastrada ainda.</p>}
            </div>
          </div>

          <div className="dashboard-v41-bloco">
            <h3>Destaques e cuidado</h3>
            <div className="lista-dashboard-v41">
              {destaques.map((item) => (
                <div className="item-dashboard-v41" key={item.aluno.id}>
                  <div>
                    <strong>{item.aluno.nome}</strong>
                    <p>{item.classeNome} - {item.frequencia}% de frequência</p>
                  </div>
                  <span>⭐</span>
                </div>
              ))}
              {alertasFaltas.slice(0, 5).map((item) => (
                <div className="item-dashboard-v41 item-dashboard-alerta-v41" key={`alerta-${item.aluno.id}`}>
                  <div>
                    <strong>{item.aluno.nome}</strong>
                    <p>{item.classeNome} - {item.motivo}</p>
                  </div>
                  <button className="botao-secundario botao-pequeno botao-sem-margem" type="button" onClick={() => abrirWhatsAppFaltoso(item)}>
                    WhatsApp
                  </button>
                </div>
              ))}
              {destaques.length === 0 && alertasFaltas.length === 0 && (
                <p className="texto-sem-aniversariantes">Faça chamadas para gerar indicadores.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  function renderizarHistoricoAluno() {
    const alunosFiltrados = alunosSomente()
      .filter((aluno) => !classeHistoricoFiltroId || Number(aluno.classeId) === Number(classeHistoricoFiltroId))
      .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR'))
    const historico = montarHistoricoDoAluno(alunoHistoricoSelecionadoId)

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Histórico individual do aluno</h2>
            <p>Consulta somente leitura, usando chamadas já salvas.</p>
          </div>
        </div>

        <div className="filtros filtros-historico-v41">
          <label>
            Filtrar por classe
            <select value={classeHistoricoFiltroId} onChange={(event) => {
              setClasseHistoricoFiltroId(event.target.value)
              setAlunoHistoricoSelecionadoId('')
            }}>
              <option value="">Todas as classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>{classe.nome}</option>
              ))}
            </select>
          </label>

          <label>
            Aluno
            <select value={alunoHistoricoSelecionadoId} onChange={(event) => setAlunoHistoricoSelecionadoId(event.target.value)}>
              <option value="">Selecione um aluno</option>
              {alunosFiltrados.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
              ))}
            </select>
          </label>

          <button className="botao-secundario" type="button" onClick={() => setAlunoHistoricoSelecionadoId('')}>
            Limpar
          </button>
        </div>

        {historico ? (
          <div className="historico-v41">
            <div className="historico-v41-resumo">
              <div>
                <span className="selo-publico">Aluno</span>
                <h3>{historico.aluno.nome}</h3>
                <p>{buscarNomeClasse(historico.aluno.classeId)} • {historico.aluno.telefone || 'sem telefone'}</p>
              </div>
              <div className="historico-v41-numeros">
                <div><strong>{historico.frequencia}%</strong><span>frequência</span></div>
                <div><strong>{historico.presentes}</strong><span>presenças</span></div>
                <div><strong>{historico.faltas}</strong><span>faltas</span></div>
              </div>
            </div>

            <div className="tabela-container">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Classe</th>
                    <th>Status</th>
                    <th>Visitantes</th>
                    <th>Bíblias</th>
                    <th>Revistas</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.registros.map((registro, indice) => (
                    <tr key={`${registro.data}-${indice}`}>
                      <td>{registro.data}</td>
                      <td>{registro.classe}</td>
                      <td>{registro.status}</td>
                      <td>{registro.visitantes}</td>
                      <td>{registro.biblias}</td>
                      <td>{registro.revistas}</td>
                    </tr>
                  ))}
                  {historico.registros.length === 0 && (
                    <tr>
                      <td colSpan="6">Nenhuma chamada encontrada para este aluno.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="aviso"><p>Selecione um aluno para visualizar o histórico.</p></div>
        )}
      </section>
    )
  }

  function renderizarFinanceiroEbd() {
    const resumo = montarResumoFinanceiroEbd()

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Controle financeiro da EBD</h2>
            <p>Resumo das ofertas lançadas nas chamadas. Não cria nem altera lançamentos no banco.</p>
          </div>
        </div>

        <div className="cards cards-estatisticas">
          <CardResumo icone="relatorios" titulo="Total de ofertas" valor={formatarMoeda(resumo.totalOfertas)} descricao="soma das chamadas" destaque />
          <CardResumo icone="chamada" titulo="Chamadas com oferta" valor={resumo.chamadasComOferta} descricao="registros com valor informado" />
          <CardResumo icone="check" titulo="Média por chamada" valor={formatarMoeda(resumo.mediaPorChamada)} descricao="média dos registros com oferta" />
        </div>

        <div className="financeiro-v41-bloco">
          <h3>Ofertas por classe</h3>
          <div className="tabela-container">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Classe</th>
                  <th>Chamadas</th>
                  <th>Total lançado</th>
                </tr>
              </thead>
              <tbody>
                {resumo.porClasse.map((item) => (
                  <tr key={item.classe.id}>
                    <td>{item.classe.nome}</td>
                    <td>{item.chamadas}</td>
                    <td>{formatarMoeda(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="aviso aviso-financeiro-v41">
            <p>Para preservar segurança, esta fase usa somente o campo “ofertas” das chamadas existentes. Lançamentos financeiros avançados podem ser ativados depois em tabela própria.</p>
          </div>
        </div>
      </section>
    )
  }


  async function executarDiagnosticoCarregamento() {
    setCarregandoDiagnostico(true)

    const montarErro = (erro) => {
      if (!erro) return null
      return {
        message: erro.message || '',
        details: erro.details || '',
        hint: erro.hint || '',
        code: erro.code || '',
      }
    }

    const comTempoLimite = (promessa, nome, ms = 8000) =>
      Promise.race([
        promessa,
        new Promise((resolve) => {
          window.setTimeout(() => {
            resolve({
              data: null,
              error: {
                message: `Tempo esgotado ao consultar ${nome}.`,
                details: 'A consulta não respondeu dentro do tempo esperado.',
                code: 'TIMEOUT_DIAGNOSTICO',
              },
              count: null,
            })
          }, ms)
        }),
      ])

    const resultado = {
      momento: new Date().toLocaleString('pt-BR'),
      url: typeof window !== 'undefined' ? window.location.href : '',
      navegador: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      sessao: null,
      usuario: null,
      perfilPorUserId: null,
      perfilPorEmail: null,
      perfilUsado: null,
      igreja: null,
      contagens: {},
      amostras: {},
      erros: {},
      estadoTela: {
        paginaAtual: paginaAtualRef.current,
        igrejaIdEstado: igrejaId,
        perfilEstado: perfilUsuarioRef.current,
        classesNaTela: classes.length,
        alunosNaTela: alunos.length,
        professoresNaTela: professoresSomente().length,
        chamadasNaTela: chamadasSalvas.length,
      },
    }

    try {
      const { data: sessaoData, error: erroSessao } = await comTempoLimite(supabase.auth.getSession(), 'getSession')
      resultado.erros.getSession = montarErro(erroSessao)
      const sessaoAtual = sessaoData?.session || sessaoRef.current || null

      resultado.sessao = sessaoAtual
        ? {
            existe: true,
            email: sessaoAtual.user?.email || '',
            userId: sessaoAtual.user?.id || '',
            expiraEm: sessaoAtual.expires_at || null,
          }
        : { existe: false }

      const { data: usuarioData, error: erroUsuario } = await comTempoLimite(supabase.auth.getUser(), 'getUser')
      resultado.erros.getUser = montarErro(erroUsuario)
      resultado.usuario = usuarioData?.user
        ? {
            email: usuarioData.user.email || '',
            userId: usuarioData.user.id || '',
          }
        : null

      const userId = sessaoAtual?.user?.id || usuarioData?.user?.id || ''
      const email = String(sessaoAtual?.user?.email || usuarioData?.user?.email || '').toLowerCase()

      if (userId) {
        const { data, error } = await comTempoLimite(
          supabase
            .from('perfis_usuarios')
            .select('*')
            .eq('user_id', userId),
          'perfilPorUserId'
        )

        resultado.perfilPorUserId = data || []
        resultado.erros.perfilPorUserId = montarErro(error)
      }

      if (email) {
        const { data, error } = await comTempoLimite(
          supabase
            .from('perfis_usuarios')
            .select('*')
            .ilike('email', email),
          'perfilPorEmail'
        )

        resultado.perfilPorEmail = data || []
        resultado.erros.perfilPorEmail = montarErro(error)
      }

      const perfilUsado =
        (Array.isArray(resultado.perfilPorUserId) && resultado.perfilPorUserId[0]) ||
        (Array.isArray(resultado.perfilPorEmail) && resultado.perfilPorEmail[0]) ||
        perfilUsuarioRef.current ||
        null

      resultado.perfilUsado = perfilUsado

      const igrejaAtualId = Number(perfilUsado?.igreja_id || igrejaId || 0)

      if (igrejaAtualId) {
        const consultas = [
          ['classes', supabase.from('classes').select('id,nome,igreja_id', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
          ['alunos', supabase.from('alunos').select('id,nome,igreja_id,classe_id,tipo_pessoa', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
          ['chamadas', supabase.from('chamadas').select('id,igreja_id,classe_id,data', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
          ['chamadas_professores', supabase.from('chamadas_professores').select('id,igreja_id,data', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
          ['classes_professores', supabase.from('classes_professores').select('id,igreja_id,classe_id,perfil_usuario_id,ativo', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
          ['configuracoes_igreja', supabase.from('configuracoes_igreja').select('id,igreja_id,nome_igreja', { count: 'exact' }).eq('igreja_id', igrejaAtualId).limit(5)],
        ]

        for (const [nome, consulta] of consultas) {
          const { data, error, count } = await comTempoLimite(consulta, nome)
          resultado.contagens[nome] = typeof count === 'number' ? count : Array.isArray(data) ? data.length : 0
          resultado.amostras[nome] = data || []
          resultado.erros[nome] = montarErro(error)
        }

        const { data: igrejaData, error: erroIgreja } = await comTempoLimite(
          supabase
            .from('igrejas')
            .select('*')
            .eq('id', igrejaAtualId)
            .maybeSingle(),
          'igreja'
        )

        resultado.igreja = igrejaData || null
        resultado.erros.igreja = montarErro(erroIgreja)
      } else {
        resultado.erros.igrejaId = { message: 'Nenhum igreja_id foi encontrado no perfil carregado.' }
      }
    } catch (error) {
      resultado.erros.geral = montarErro(error) || { message: String(error) }
    }

    console.log('Diagnóstico EBD Fiel:', resultado)
    setDiagnosticoCarregamento(resultado)
    setCarregandoDiagnostico(false)
  }

  function textoDiagnosticoCarregamento() {
    return JSON.stringify(diagnosticoCarregamento || {}, null, 2)
  }

  function copiarTextoComFallback(texto) {
    if (typeof document === 'undefined') {
      return false
    }

    const textarea = document.createElement('textarea')
    textarea.value = texto
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    textarea.style.left = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, texto.length)

    let copiado = false

    try {
      copiado = document.execCommand('copy')
    } catch (error) {
      console.error('Fallback de cópia falhou:', error)
      copiado = false
    }

    document.body.removeChild(textarea)
    return copiado
  }

  function baixarDiagnosticoCarregamento(event) {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    if (!diagnosticoCarregamento || typeof document === 'undefined') {
      setMensagemDiagnosticoAdmin({ tipo: 'erro', texto: 'Execute o diagnóstico antes de baixar.' })
      return
    }

    const texto = textoDiagnosticoCarregamento()
    const blob = new Blob([texto], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `diagnostico-ebd-fiel-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'Diagnóstico baixado com sucesso.' })
  }

  async function copiarDiagnosticoCarregamento(event) {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    if (!diagnosticoCarregamento) {
      setMensagemDiagnosticoAdmin({ tipo: 'erro', texto: 'Execute o diagnóstico antes de copiar.' })
      return
    }

    const texto = textoDiagnosticoCarregamento()

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto)
        setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'Diagnóstico copiado para a área de transferência.' })
        return
      }

      const copiado = copiarTextoComFallback(texto)
      if (copiado) {
        setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'Diagnóstico copiado para a área de transferência.' })
        return
      }

      baixarDiagnosticoCarregamento(event)
      setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'O navegador bloqueou a cópia. Baixei o diagnóstico em arquivo.' })
    } catch (error) {
      console.error('Erro ao copiar diagnóstico:', error)
      const copiado = copiarTextoComFallback(texto)

      if (copiado) {
        setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'Diagnóstico copiado para a área de transferência.' })
        return
      }

      baixarDiagnosticoCarregamento(event)
      setMensagemDiagnosticoAdmin({ tipo: 'sucesso', texto: 'O navegador bloqueou a cópia. Baixei o diagnóstico em arquivo.' })
    }
  }

  function renderizarBackupAuditoria() {
    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Segurança e auditoria</h2>
            <p>Ferramentas seguras de leitura para conferência e cópia local da igreja.</p>
          </div>
        </div>

        <div className="backup-v41-grid">
          <div className="backup-v41-card">
            <span className="selo-publico">Cópia de segurança local</span>
            <h3>Exportar dados da igreja</h3>
            <p>Gera um arquivo JSON com os dados carregados na sessão atual. Não modifica cadastros no Supabase.</p>
            <button className="botao-principal" type="button" onClick={baixarBackupLocalSeguro}>
              Baixar backup JSON
            </button>
          </div>

          <div className="backup-v41-card">
            <span className="selo-publico">Auditoria</span>
            <h3>Resumo da sessão</h3>
            <p>Copie um resumo com igreja, usuário, perfil e totais para suporte técnico.</p>
            <button className="botao-secundario" type="button" onClick={copiarResumoAuditoriaLocal}>
              Copiar resumo
            </button>
          </div>
        </div>

        <div className="resumo resumo-alerta-claro">
          <h3>Próxima camada recomendada</h3>
          <p>Para backup automático real, use o SQL seguro enviado junto com esta versão para criar tabela de auditoria/backups sem alterar tabelas existentes.</p>
        </div>
      </section>
    )
  }

  function renderizarPainel() {
    const aniversariantesDaSemana = buscarAniversariantesDaSemana()
    const aniversariantesDoMesPainel = usuarioEhSecretaria() ? buscarAniversariantesDoMes() : []
    const aniversariantesHojePainel = aniversariantesDaSemana.filter((pessoa) => Number(pessoa.dias) === 0)
    const alertasDeFaltasPainel = usuarioEhSecretaria() ? buscarAlertasDeFaltas() : []
    const destaquesDeFrequenciaPainel = usuarioEhSecretaria() ? buscarDestaquesFrequencia() : []
    const aniversariantesPreviewPainel = aniversariantesDaSemana.slice(0, 3)

    return (
      <section className="conteudo">
        <div className="hero-painel">
          <div className="hero-painel-conteudo">
            <div className="linha-tags-painel">
              <span className="hero-tag">Painel da igreja</span>
              <span className="hero-tag hero-tag-clara">
                {usuarioEhProfessor() ? 'Perfil: Professor' : 'Perfil: Secretaria'}
              </span>
            </div>
            <h2>{buscarNomeIgrejaParaExibicao()}</h2>
            <p>
              Controle classes, alunos, chamadas e relatórios da Escola Bíblica Dominical
              com uma estrutura pronta para uso e comercialização.
            </p>

            <div className="hero-painel-metricas" aria-label="Resumo da igreja">
              <span><strong>{classes.length}</strong> classes</span>
              <span><strong>{alunosSomente().length}</strong> alunos</span>
              <span><strong>{professoresSomente().length}</strong> professores</span>
              <span><strong>{calcularFrequenciaGeral()}%</strong> frequência</span>
            </div>

            {(usuarioEhSecretaria() || usuarioEhProfessor()) && (
              <button
                className="atalho-chamada-topo"
                type="button"
                onClick={() => navegarParaPagina('chamada')}
                aria-label="Ir para chamada"
              >
                <span className="atalho-chamada-topo-icone">
                  <Icone nome="chamada" className="icone-svg" />
                </span>
                <span className="atalho-chamada-topo-texto">
                  <strong>Fazer chamada</strong>
                  <small>Atalho principal para registrar presença</small>
                </span>
              </button>
            )}

            <div className="hero-acoes">
              {usuarioEhSecretaria() && (
                <button className="botao-principal" type="button" onClick={() => navegarParaPagina('configuracoes')}>
                  Ajustar dados da igreja
                </button>
              )}
              <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('relatorios')}>
                Ver relatórios
              </button>

              <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('dashboard')}>
                Ver resumo geral
              </button>

              <button className="botao-secundario botao-manual-painel" type="button" onClick={() => navegarParaPagina('manual')}>
                Ver manual do usuário
              </button>
            </div>
          </div>

          <div className="hero-painel-destaque">
            <div className="hero-icone-area">
              <Icone nome="biblia" className="icone-hero" />
            </div>
            <h3>Resumo rápido</h3>
            <p>Dados sincronizados automaticamente no Supabase.</p>
            <ul>
              <li>{classes.length} classes ativas</li>
              <li>{alunosSomente().length} alunos cadastrados</li>
              <li>{professoresSomente().length} professores cadastrados</li>
              <li>{chamadasSalvas.length} chamadas registradas</li>
              <li>{calcularFrequenciaGeral()}% de frequência geral</li>
            </ul>
          </div>
        </div>

        <div className="cards cards-estatisticas">
          <CardResumo
            icone="classes"
            titulo="Classes"
            valor={classes.length}
            descricao="Turmas organizadas para a EBD."
          />
          <CardResumo
            icone="alunos"
            titulo="Alunos"
            valor={alunos.length}
            descricao="Participantes cadastrados no sistema."
          />
          <CardResumo
            icone="usuarios"
            titulo="Professores"
            valor={professoresSomente().length}
            descricao="Participantes da chamada dos professores."
          />

          <CardResumo
            icone="chamada"
            titulo="Chamadas"
            valor={chamadasSalvas.length}
            descricao="Registros salvos de presença."
          />
          <CardResumo
            icone="check"
            titulo="Frequência geral"
            valor={`${calcularFrequenciaGeral()}%`}
            descricao="Média de presença nas chamadas lançadas."
            destaque
          />
        </div>

        {usuarioEhSecretaria() && (
          <div className="acoes-rapidas-painel">
            <div>
              <span className="hero-tag">Ações rápidas</span>
              <h3>O que deseja fazer agora?</h3>
            </div>

            <div className="acoes-rapidas-grade">
              <button className="acao-rapida-principal" type="button" onClick={() => navegarParaPagina('chamada')}>
                <strong>Fazer chamada</strong>
                <span>Registrar presença da classe</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navegarParaPagina('alunos')
                  abrirNovoAluno('aluno')
                }}
              >
                <strong>Cadastrar aluno</strong>
                <span>Adicionar novo participante</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navegarParaPagina('professores')
                  abrirNovoAluno('professor')
                }}
              >
                <strong>Cadastrar professor</strong>
                <span>Adicionar professor da EBD</span>
              </button>

              <button type="button" onClick={abrirJanelaAniversariantesSemana}>
                <strong>Ver aniversariantes</strong>
                <span>Semana, PDF e impressão</span>
              </button>
            </div>
          </div>
        )}

        {usuarioEhSecretaria() && (
          <div className="alertas-ebd-painel">
            <div className="alertas-ebd-cabecalho">
              <div>
                <span className="hero-tag">Acompanhamento da secretaria</span>
                <h3>Alertas da EBD</h3>
                <p>
                  Acompanhe aniversariantes, faltas recorrentes e alunos com boa frequência.
                </p>
              </div>
              <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('relatorios')}>
                Ver relatórios
              </button>
            </div>

            <div className="alertas-ebd-grade">
              <button className="alerta-ebd-card" type="button" onClick={abrirJanelaAniversariantesSemana}>
                <span className="alerta-ebd-icone alerta-ebd-icone-aniversario">🎂</span>
                <div>
                  <strong>Aniversariantes</strong>
                  <p>
                    {aniversariantesDaSemana.length > 0
                      ? `${aniversariantesDaSemana.length} pessoa${aniversariantesDaSemana.length === 1 ? '' : 's'} com aniversário nesta semana.`
                      : 'Nenhum aniversariante encontrado nesta semana.'}
                  </p>
                </div>
                <em>{aniversariantesHojePainel.length > 0 ? `${aniversariantesHojePainel.length} hoje` : 'Semana'}</em>
              </button>

              <button className="alerta-ebd-card" type="button" onClick={abrirRelatorioAlertasFaltas}>
                <span className="alerta-ebd-icone alerta-ebd-icone-faltas">⚠️</span>
                <div>
                  <strong>Alertas de faltas</strong>
                  <p>
                    {alertasDeFaltasPainel.length > 0
                      ? `${alertasDeFaltasPainel.length} aluno${alertasDeFaltasPainel.length === 1 ? '' : 's'} precisando de atenção.`
                      : 'Nenhum alerta de faltas no momento.'}
                  </p>
                </div>
                <em>{alertasDeFaltasPainel.length}</em>
              </button>

              <button className="alerta-ebd-card" type="button" onClick={abrirRelatorioDestaquesFrequencia}>
                <span className="alerta-ebd-icone alerta-ebd-icone-destaque">⭐</span>
                <div>
                  <strong>Destaques de frequência</strong>
                  <p>
                    {destaquesDeFrequenciaPainel.length > 0
                      ? `${destaquesDeFrequenciaPainel.length} aluno${destaquesDeFrequenciaPainel.length === 1 ? '' : 's'} com boa frequência.`
                      : 'Sem destaques calculados ainda.'}
                  </p>
                </div>
                <em>{destaquesDeFrequenciaPainel.length}</em>
              </button>
            </div>
          </div>
        )}



        {usuarioEhSecretaria() && (
          <div className="painel-aniversariantes-resumo">
            <div className="painel-aniversariantes-topo">
              <div>
                <span className="hero-tag">Agenda da semana</span>
                <h3>Aniversariantes da semana</h3>
                <p>Veja rapidamente quem deve receber atenção especial nos próximos dias.</p>
              </div>
              <button className="botao-secundario" type="button" onClick={abrirJanelaAniversariantesSemana}>
                Ver lista completa
              </button>
            </div>

            {aniversariantesPreviewPainel.length > 0 ? (
              <div className="painel-aniversariantes-lista">
                {aniversariantesPreviewPainel.map((pessoa) => (
                  <button
                    className="painel-aniversariante-item"
                    type="button"
                    key={pessoa.id}
                    onClick={abrirJanelaAniversariantesSemana}
                  >
                    <span className="avatar-aniversariante-painel">
                      {String(pessoa.nome || '?').trim().charAt(0).toUpperCase() || '?'}
                    </span>
                    <div className="painel-aniversariante-dados">
                      <strong>{pessoa.nome}</strong>
                      <p>{pessoa.tipo} • {pessoa.detalhe}</p>
                    </div>
                    <span className="tag-prazo-aniversario">{descreverAniversario(pessoa.dias)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="texto-sem-aniversariantes">
                Nenhum aniversário cadastrado para os próximos 7 dias.
              </p>
            )}
          </div>
        )}

        {janelaAniversariantesAberta && renderizarJanelaAniversariantesSemana()}


        {renderizarFeedbackPiloto()}

        <div className="grade-resumos-comerciais grade-configuracoes-rapidas">
          <button
            className="resumo resumo-comercial resumo-alerta-claro card-configuracao-rapida"
            type="button"
            onClick={() => navegarParaPagina('configuracoes')}
          >
            <span className="icone-configuracao-rapida"><Icone nome="configuracoes" className="icone-svg" /></span>
            <div>
              <h3>Personalização da igreja</h3>
              <p>
                {configuracaoIgreja.nome_igreja
                  ? 'Dados configurados para relatórios e PDFs.'
                  : 'Configure nome, endereço e contatos da igreja.'}
              </p>
            </div>
          </button>
        </div>
      </section>
    )
  }

  function renderizarFormularioProfessorClasse() {
    if (!mostrarFormularioAluno || !['professor', 'aluno'].includes(novoAluno.tipoPessoa)) {
      return null
    }

    const formularioProfessor = novoAluno.tipoPessoa === 'professor'

    return (
      <form className="formulario formulario-professor-classe formulario-pessoa-classe" onSubmit={salvarAluno}>
        <div className="topo-formulario-inline">
          <div>
            <h3>
              {alunoEditandoId
                ? formularioProfessor
                  ? 'Editar professor'
                  : 'Editar aluno'
                : formularioProfessor
                  ? 'Novo professor'
                  : 'Novo aluno'}
            </h3>
            <p>
              {formularioProfessor
                ? 'Este cadastro também aparece no menu Professores e na Chamada dos professores.'
                : 'Este aluno será cadastrado diretamente na classe selecionada e aparecerá na chamada dos alunos.'}
            </p>
          </div>
        </div>

        <div className="grade-campos grade-campos-configuracoes">
          <label>
            Nome
            <input
              type="text"
              value={novoAluno.nome}
              onChange={(event) =>
                setNovoAluno({ ...novoAluno, nome: event.target.value })
              }
              placeholder={formularioProfessor ? 'Ex: Leandro Silva' : 'Ex: Ana Clara'}
            />
          </label>

          <label>
            Classe de referência
            <select
              value={novoAluno.classeId}
              onChange={(event) =>
                setNovoAluno({ ...novoAluno, classeId: event.target.value })
              }
            >
              <option value="">Selecione uma classe</option>

              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            Telefone
            <input
              type="text"
              value={novoAluno.telefone}
              onChange={(event) =>
                setNovoAluno({ ...novoAluno, telefone: event.target.value })
              }
              placeholder="Ex: (11) 99999-0000"
            />
          </label>

          <label>
            Data de nascimento
            <input
              type="date"
              value={novoAluno.dataNascimento}
              onChange={(event) =>
                setNovoAluno({
                  ...novoAluno,
                  dataNascimento: event.target.value,
                })
              }
            />
          </label>
        </div>

        <div className="grupo-botoes">
          <button className="botao-principal" type="submit" disabled={salvandoAluno}>
            {salvandoAluno
              ? 'Salvando...'
              : alunoEditandoId
                ? 'Salvar alterações'
                : formularioProfessor
                  ? 'Salvar professor'
                  : 'Salvar aluno'}
          </button>

          <button
            className="botao-secundario"
            type="button"
            onClick={cancelarFormularioAluno}
          >
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  function renderizarClasses() {
    if (!podeGerenciarCadastros()) {
      return (
        <section className="conteudo">
          <h2>Acesso restrito</h2>
          <p>O cadastro de classes é gerenciado pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo pagina-interna pagina-classes">
        <div className="topo-pagina topo-pagina-interna">
          <div>
            <span className="subtitulo-pagina-interna">Gestão de turmas</span>
            <h2>Classes</h2>
            <p>Organize as classes da EBD, veja matrículas em destaque e cadastre alunos ou professores diretamente pela turma.</p>
          </div>

          {!mostrarFormularioClasse && (
            <button className="botao-principal" type="button" onClick={abrirNovaClasse}>
              Nova classe
            </button>
          )}
        </div>

        {mostrarFormularioClasse && (
          <form className="formulario formulario-editar-classe" onSubmit={salvarClasse}>
            <div className="cabecalho-formulario-editar-classe">
              <span>{classeEditandoId ? 'Editar classe' : 'Nova classe'}</span>
              <h3>{classeEditandoId ? 'Alterar nome da classe' : 'Cadastrar nova classe'}</h3>
              <p>
                {classeEditandoId
                  ? 'Atualize o nome da classe. Os alunos e professores vinculados continuarão nesta mesma turma.'
                  : 'Crie uma nova turma para organizar alunos, professores e chamadas da EBD.'}
              </p>
            </div>

            <label>
              Nome da classe
              <input
                type="text"
                value={novaClasse.nome}
                onChange={(event) =>
                  setNovaClasse({ ...novaClasse, nome: event.target.value })
                }
                placeholder="Ex: Jovens, Adultos, Crianças..."
                autoFocus
              />
            </label>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {classeEditandoId ? 'Salvar novo nome da classe' : 'Salvar classe'}
              </button>

              <button
                className="botao-secundario"
                type="button"
                onClick={cancelarFormularioClasse}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {renderizarFormularioProfessorClasse()}

        <div className="aviso aviso-classes-professores aviso-classes-moderno">
          <p>
            Clique em uma classe para cadastrar alunos, vincular professores e acompanhar a matrícula de cada turma.
          </p>
        </div>

        <div className="lista lista-classes-modernas">
          {classes.map((classe, indiceClasse) => {
            const professoresDaClasse = buscarProfessoresDaClasse(classe.id)
            const matriculaClasse = calcularMatriculaDaClasse(classe.id)

            return (
              <div
                className={`item-lista classe-card-moderno classe-cor-${(indiceClasse % 5) + 1}`}
                key={classe.id}
              >
                <div className="classe-card-faixa">
                  <div className="classe-card-titulo-bloco">
                    <span className="classe-card-selo">Classe</span>
                    <h3>{classe.nome}</h3>
                  </div>

                  <div className="classe-card-matricula">
                    <strong>{matriculaClasse}</strong>
                    <span>alunos</span>
                  </div>
                </div>

                <div className="classe-card-corpo">
                  <div className="classe-card-resumo">
                    <div className="classe-card-resumo-item resumo-matricula">
                      <strong>Matrícula</strong>
                      <span>{matriculaClasse} alunos</span>
                    </div>
                  </div>

                  <div className="professores-na-classe professores-na-classe-compacto">
                    {professoresDaClasse.length > 0 ? (
                      professoresDaClasse.map((professor) => (
                        <div className="professor-classe-linha" key={professor.id}>
                          <span className="professor-classe-nome">Professor: {professor.nome}</span>

                          <div className="professor-classe-acoes">
                            <button
                              className="botao-editar botao-pequeno"
                              onClick={() => editarProfessorDaClasse(professor)}
                            >
                              Editar
                            </button>

                            <button
                              className="botao-excluir botao-pequeno"
                              onClick={() => excluirAluno(professor.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="texto-sem-professor">
                        Nenhum professor vinculado a esta classe.
                      </p>
                    )}
                  </div>

                  <div className="classe-card-acoes">
                    <button
                      className="botao-principal botao-sem-margem"
                      onClick={() => abrirNovoAlunoDaClasse(classe.id)}
                    >
                      Novo aluno
                    </button>

                    <button
                      className="botao-principal botao-verde"
                      onClick={() => abrirNovoProfessorDaClasse(classe.id)}
                    >
                      Novo professor
                    </button>

                    <button
                      className="botao-secundario"
                      onClick={() => alternarAlunosDaClasse(classe.id)}
                    >
                      {Number(classeAlunosAbertaId) === Number(classe.id)
                        ? 'Ocultar alunos'
                        : `Ver alunos (${matriculaClasse})`}
                    </button>

                    <button
                      className="botao-editar"
                      onClick={() => editarClasse(classe)}
                    >
                      Alterar nome
                    </button>

                    <button
                      className="botao-excluir"
                      onClick={() => excluirClasse(classe.id)}
                    >
                      Excluir classe
                    </button>
                  </div>

                  {Number(classeAlunosAbertaId) === Number(classe.id) && (
                    <div className="alunos-da-classe">
                      <div className="alunos-da-classe-topo">
                        <strong>Alunos da classe</strong>
                        <span>{matriculaClasse} aluno(s)</span>
                      </div>

                      {buscarAlunosDaClasse(classe.id).length > 0 ? (
                        <div className="alunos-da-classe-lista">
                          {buscarAlunosDaClasse(classe.id).map((aluno) => (
                            <div className="aluno-classe-linha" key={aluno.id}>
                              <span>{aluno.nome}</span>

                              <div className="aluno-classe-acoes">
                                <button
                                  className="botao-editar botao-pequeno"
                                  onClick={() => editarAluno(aluno)}
                                >
                                  Editar
                                </button>

                                <button
                                  className="botao-excluir botao-pequeno"
                                  onClick={() => excluirAluno(aluno.id)}
                                >
                                  Excluir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="texto-sem-professor">
                          Nenhum aluno cadastrado nesta classe.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  function renderizarCadastroPessoas(tipoPessoaPagina) {
    const ehPaginaProfessor = tipoPessoaPagina === 'professor'
    const cadastrosFiltrados = ehPaginaProfessor ? filtrarProfessores() : filtrarAlunos()
    const tituloPagina = ehPaginaProfessor ? 'Professores' : 'Alunos'
    const descricaoPagina = ehPaginaProfessor
      ? 'Cadastre, edite e organize os professores. A classe de referência também atualiza a lista de professores em Classes.'
      : usuarioEhProfessor()
        ? 'Veja os alunos vinculados às suas classes.'
        : 'Cadastre, edite, busque e organize os alunos por classe.'
    const obterInicialCadastro = (nome) => String(nome || '?').trim().charAt(0).toUpperCase() || '?'

    return (
      <section className={`conteudo pagina-interna pagina-cadastros pagina-${tipoPessoaPagina}s`}>
        <div className="topo-pagina topo-pagina-interna">
          <div>
            <span className="subtitulo-pagina-interna">{ehPaginaProfessor ? 'Equipe de ensino' : 'Cadastro e acompanhamento'}</span>
            <h2>{tituloPagina}</h2>
            <p>{descricaoPagina}</p>
          </div>

          {podeGerenciarCadastros() && !mostrarFormularioAluno && (
            <button
              className="botao-principal"
              type="button"
              onClick={() => abrirNovoAluno(tipoPessoaPagina)}
            >
              {ehPaginaProfessor ? 'Novo professor' : 'Novo aluno'}
            </button>
          )}
        </div>

        {mostrarFormularioAluno && novoAluno.tipoPessoa === tipoPessoaPagina && (
          <form className="formulario" onSubmit={salvarAluno}>
            <label>
              Nome
              <input
                type="text"
                value={novoAluno.nome}
                onChange={(event) =>
                  setNovoAluno({ ...novoAluno, nome: event.target.value })
                }
                placeholder={ehPaginaProfessor ? 'Ex: Leandro Silva' : 'Ex: Ana Clara'}
              />
            </label>

            <label>
              Tipo
              <select
                value={novoAluno.tipoPessoa}
                onChange={(event) =>
                  setNovoAluno({ ...novoAluno, tipoPessoa: event.target.value })
                }
              >
                <option value="aluno">Aluno</option>
                <option value="professor">Professor</option>
              </select>
            </label>

            <label>
              Classe de referência
              <select
                value={novoAluno.classeId}
                onChange={(event) =>
                  setNovoAluno({ ...novoAluno, classeId: event.target.value })
                }
              >
                <option value="">Selecione uma classe</option>

                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nome}
                  </option>
                ))}
              </select>
              <small className="texto-ajuda-campo">
                Aluno aparece na chamada dos alunos. Professor aparece na chamada dos professores e na lista de professores da classe.
              </small>
            </label>

            <label>
              Telefone
              <input
                type="text"
                value={novoAluno.telefone}
                onChange={(event) =>
                  setNovoAluno({ ...novoAluno, telefone: event.target.value })
                }
                placeholder="Ex: (11) 99999-0000"
              />
            </label>

            <label>
              Data de nascimento
              <input
                type="date"
                value={novoAluno.dataNascimento}
                onChange={(event) =>
                  setNovoAluno({
                    ...novoAluno,
                    dataNascimento: event.target.value,
                  })
                }
              />
            </label>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit" disabled={salvandoAluno}>
                {salvandoAluno ? 'Salvando...' : alunoEditandoId ? 'Salvar alterações' : 'Salvar cadastro'}
              </button>

              <button
                className="botao-secundario"
                type="button"
                onClick={cancelarFormularioAluno}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="filtros">
          <label>
            Buscar {ehPaginaProfessor ? 'professor' : 'aluno'}
            <input
              type="text"
              value={buscaAluno}
              onChange={(event) => setBuscaAluno(event.target.value)}
              placeholder={ehPaginaProfessor ? 'Digite o nome do professor' : 'Digite o nome do aluno'}
            />
          </label>

          {usuarioEhSecretaria() && (
            <label>
              Filtrar por classe
              <select
                value={filtroClasseAluno}
                onChange={(event) => setFiltroClasseAluno(event.target.value)}
              >
                <option value="">Todas as classes</option>

                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nome}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button className="botao-secundario" type="button" onClick={limparFiltrosAlunos}>
            Limpar filtros
          </button>
        </div>

        <p className="contador-resultados">
          Mostrando {cadastrosFiltrados.length} de{' '}
          {ehPaginaProfessor ? professoresSomente().length : alunosSomente().length}{' '}
          {ehPaginaProfessor ? 'professores' : 'alunos'}
        </p>

        <div className="lista lista-cadastros-moderna">
          {cadastrosFiltrados.map((aluno) => (
            <div className="item-lista item-com-acoes cadastro-card-moderno" key={aluno.id}>
              <div className="cadastro-card-identidade">
                <span className="cadastro-avatar" aria-hidden="true">
                  {obterInicialCadastro(aluno.nome)}
                </span>

                <div className="cadastro-card-textos">
                  <h3>{aluno.nome}</h3>
                  <div className="cadastro-metadados">
                    <span>{(aluno.tipoPessoa || 'aluno') === 'professor' ? 'Professor' : 'Aluno'}</span>
                    <span>{buscarNomeClasse(aluno.classeId)}</span>
                    {aluno.telefone && <span>{aluno.telefone}</span>}
                    {aluno.dataNascimento && (
                      <span>Nasc.: {formatarDataNascimento(aluno.dataNascimento)}</span>
                    )}
                  </div>
                </div>
              </div>

              {podeGerenciarCadastros() && (
                <div className="acoes-item acoes-cadastro">
                  <button
                    className="botao-editar"
                    onClick={() => editarAluno(aluno)}
                  >
                    Editar
                  </button>

                  <button
                    className="botao-excluir"
                    onClick={() => excluirAluno(aluno.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderizarAlunos() {
    return renderizarCadastroPessoas('aluno')
  }

  function renderizarProfessores() {
    return renderizarCadastroPessoas('professor')
  }

  function renderizarUsuarios() {
    if (!usuarioEhSecretaria()) {
      return (
        <section className="conteudo">
          <h2>Acesso restrito</h2>
          <p>O cadastro de usuários é gerenciado pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Usuários</h2>
            <p>
              Cadastre secretarias e professores da igreja. O login precisa existir
              primeiro em Authentication no Supabase.
            </p>
          </div>

          {!mostrarFormularioPerfil && (
            <button className="botao-principal" onClick={abrirNovoPerfil}>
              Novo usuário
            </button>
          )}
        </div>

        <div className="aviso aviso-usuarios">
          <p>
            <strong>Importante:</strong> primeiro crie o usuário em
            Supabase → Authentication → Users. Depois copie o User UID e cadastre
            aqui para vincular o perfil, a classe e a data de nascimento.
          </p>
        </div>

        {mostrarFormularioPerfil && (
          <form className="formulario" onSubmit={salvarPerfilUsuario}>
            <div className="grade-campos grade-campos-configuracoes">
              <label>
                User UID do Supabase
                <input
                  type="text"
                  value={novoPerfil.userId}
                  onChange={(event) =>
                    setNovoPerfil({ ...novoPerfil, userId: event.target.value })
                  }
                  placeholder="Ex: 5fd49a5b-b331-4d66-aace-e458384f2f51"
                />
              </label>

              <label>
                Nome
                <input
                  type="text"
                  value={novoPerfil.nome}
                  onChange={(event) =>
                    setNovoPerfil({ ...novoPerfil, nome: event.target.value })
                  }
                  placeholder="Ex: Leandro Silva"
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  value={novoPerfil.email}
                  onChange={(event) =>
                    setNovoPerfil({ ...novoPerfil, email: event.target.value })
                  }
                  placeholder="Ex: professor@igreja.com"
                />
              </label>

              <label>
                Perfil
                <select
                  value={novoPerfil.perfil}
                  onChange={(event) =>
                    setNovoPerfil({
                      ...novoPerfil,
                      perfil: event.target.value,
                      classeIds:
                        event.target.value === 'secretaria'
                          ? []
                          : novoPerfil.classeIds,
                    })
                  }
                >
                  <option value="professor">Professor</option>
                  <option value="secretaria">Secretaria</option>
                </select>
              </label>

              {novoPerfil.perfil === 'professor' && (
                <div className="campo-classes-professor">
                  <span>Classes do professor</span>
                  <div className="lista-checkboxes-classes">
                    {classes.map((classe) => {
                      const classeIdTexto = String(classe.id)
                      const selecionada = novoPerfil.classeIds.includes(classeIdTexto)

                      return (
                        <label key={classe.id} className="checkbox-classe-professor">
                          <input
                            type="checkbox"
                            checked={selecionada}
                            onChange={(event) => {
                              const novasClasses = event.target.checked
                                ? [...novoPerfil.classeIds, classeIdTexto]
                                : novoPerfil.classeIds.filter((id) => id !== classeIdTexto)

                              setNovoPerfil({
                                ...novoPerfil,
                                classeIds: novasClasses,
                              })
                            }}
                          />
                          <span>{classe.nome}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <label>
                Data de nascimento
                <input
                  type="date"
                  value={novoPerfil.dataNascimento}
                  onChange={(event) =>
                    setNovoPerfil({
                      ...novoPerfil,
                      dataNascimento: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {perfilEditandoId ? 'Salvar alterações' : 'Salvar usuário'}
              </button>

              <button
                className="botao-secundario"
                type="button"
                onClick={cancelarFormularioPerfil}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="lista">
          {perfisIgreja.map((perfil) => (
            <div className="item-lista item-com-acoes" key={perfil.id}>
              <div>
                <h3>{perfil.nome || perfil.email}</h3>
                <p>E-mail: {perfil.email}</p>
                <p>
                  Perfil:{' '}
                  {perfil.perfil === 'professor' ? 'Professor' : 'Secretaria'}
                </p>
                {perfil.perfil === 'professor' && (
                  <p>
                    Classes:{' '}
                    {buscarNomesClassesDoProfessor(perfil.id, perfil.classe_id) ||
                      'Nenhuma classe vinculada'}
                  </p>
                )}
                {perfil.data_nascimento && (
                  <p>
                    Nascimento: {formatarDataNascimento(perfil.data_nascimento)}
                  </p>
                )}
              </div>

              <div className="acoes-item">
                <button
                  className="botao-editar"
                  onClick={() => editarPerfil(perfil)}
                >
                  Editar
                </button>

                <button
                  className="botao-excluir"
                  onClick={() => excluirPerfilUsuario(perfil)}
                >
                  Remover perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  async function salvarChamadaProfessores() {
    setMensagemChamada(null)

    if (!usuarioEhSecretaria()) {
      setMensagemChamada({
        tipo: 'erro',
        texto: 'Apenas a secretaria pode salvar a chamada dos professores.',
      })
      return
    }

    const professores = buscarProfessoresDaIgreja()

    if (professores.length === 0) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Ainda não há professores cadastrados em Usuários.',
      })
      return
    }

    const professoresSemMarcacao = professores.filter(
      (professor) => !presencasProfessores[professor.id]
    )

    if (professoresSemMarcacao.length > 0) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: `Ainda falta marcar ${professoresSemMarcacao.length} professor(es): ${professoresSemMarcacao
          .map((professor) => professor.nome)
          .join(', ')}`,
      })
      return
    }

    const totalPresentes = professores.filter(
      (professor) => presencasProfessores[professor.id] === 'presente'
    ).length

    const totalFaltas = professores.filter(
      (professor) => presencasProfessores[professor.id] === 'faltou'
    ).length

    const totalJustificadas = professores.filter(
      (professor) => presencasProfessores[professor.id] === 'justificou'
    ).length

    if (!confirmarDataDaChamada(dataAulaChamada, 'chamada dos professores')) {
      setMensagemChamada({
        tipo: 'aviso',
        texto: 'Chamada dos professores não salva. Confira a data da aula e tente novamente.',
      })
      return
    }

    const chamadaBanco = {
      id: Date.now(),
      igreja_id: buscarIgrejaIdAtual(),
      data: dataAulaChamada || buscarDataAtual(),
      total_professores: professores.length,
      total_presentes: totalPresentes,
      total_faltas: totalFaltas,
      total_justificadas: totalJustificadas,
      observacoes: observacoesChamadaProfessores.trim(),
      registros: professores.map((professor) => ({
        pessoaId: professor.id,
        nome: professor.nome,
        telefone: professor.telefone || '',
        status: presencasProfessores[professor.id],
        classeReferencia: buscarNomeClasse(professor.classeId),
      })),
    }

    const { error } = await supabase
      .from('chamadas_professores')
      .insert(chamadaBanco)

    if (error) {
      console.error(error)
      setMensagemChamada({
        tipo: 'erro',
        texto: 'Não foi possível salvar a chamada dos professores. Verifique sua conexão e tente novamente.',
      })
      return
    }

    await buscarTodosOsDados()

    setPresencasProfessores({})
    setObservacoesChamadaProfessores('')
    setMensagemChamada({
      tipo: 'sucesso',
      texto: 'Chamada dos professores salva com sucesso.',
    })
  }

  function renderizarChamada() {
    const classeSelecionadaId = classeChamadaId ? Number(classeChamadaId) : null
    const classeSelecionada = classes.find(
      (classe) => Number(classe.id) === Number(classeSelecionadaId)
    )
    const alunosDaClasse = alunos.filter(
      (aluno) =>
        Number(aluno.classeId) === Number(classeSelecionadaId) &&
        String(aluno.tipoPessoa || 'aluno').toLowerCase() === 'aluno'
    )
    const professoresDaIgreja = buscarProfessoresDaIgreja()

    return (
      <section className="conteudo pagina-interna pagina-chamada">
        <div className="topo-pagina topo-pagina-interna">
          <div>
            <span className="subtitulo-pagina-interna">Registro de frequência</span>
            <h2>Chamada</h2>
            <p>
              {usuarioEhProfessor()
                ? 'Faça a chamada das classes vinculadas pela secretaria.'
                : 'Registre a chamada dos alunos e a chamada separada dos professores.'}
            </p>
          </div>
        </div>

        {usuarioEhSecretaria() && (
          <div className="abas-chamada">
            <button
              className={tipoChamada === 'alunos' ? 'ativo' : ''}
              type="button"
              onClick={() => {
                setTipoChamada('alunos')
                setMensagemChamada(null)
              }}
            >
              Chamada dos alunos
            </button>

            <button
              className={tipoChamada === 'professores' ? 'ativo' : ''}
              type="button"
              onClick={() => {
                setTipoChamada('professores')
                setMensagemChamada(null)
              }}
            >
              Chamada dos professores
            </button>
          </div>
        )}

        {mensagemChamada && (
          <div
            className={`mensagem-chamada ${mensagemChamada.tipo}`}
            role="status"
            aria-live="polite"
          >
            <p>{mensagemChamada.texto}</p>
            <button
              type="button"
              onClick={() => setMensagemChamada(null)}
              aria-label="Fechar mensagem da chamada"
            >
              ×
            </button>
          </div>
        )}

        {(tipoChamada === 'alunos' || usuarioEhProfessor()) && (
          <>
            <div className="formulario">
              <label>
                Classe
                <select
                  value={classeChamadaId}
                  onChange={(event) => {
                    setMensagemChamada(null)
                    setClasseChamadaId(event.target.value)
                    setPresencas({})
                    setDadosExtrasChamada({
                      visitantes: '',
                      biblias: '',
                      revistas: '',
                      ofertas: '',
                    })
                  }}
                >
                  <option value="">Selecione uma classe</option>

                  {classes.map((classe) => (
                    <option key={classe.id} value={classe.id}>
                      {classe.nome}
                    </option>
                  ))}
                </select>
                {usuarioEhProfessor() && (
                  <small className="texto-ajuda-campo">
                    Você só verá as classes vinculadas pela secretaria.
                  </small>
                )}
              </label>

              <label>
                Data da aula
                <input
                  type="date"
                  value={dataAulaChamada}
                  onChange={(event) => setDataAulaChamada(event.target.value)}
                />
                <small className="texto-ajuda-campo">
                  O sistema preenche com a data de hoje, mas você pode alterar.
                </small>
              </label>

              {classeChamadaId && (
                <div className="grade-campos">
                  <label>
                    Visitantes
                    <input
                      type="number"
                      min="0"
                      value={dadosExtrasChamada.visitantes}
                      onChange={(event) =>
                        alterarDadosExtras('visitantes', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Bíblias
                    <input
                      type="number"
                      min="0"
                      value={dadosExtrasChamada.biblias}
                      onChange={(event) =>
                        alterarDadosExtras('biblias', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Revistas
                    <input
                      type="number"
                      min="0"
                      value={dadosExtrasChamada.revistas}
                      onChange={(event) =>
                        alterarDadosExtras('revistas', event.target.value)
                      }
                    />
                  </label>

                  <label>
                    Ofertas R$
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={dadosExtrasChamada.ofertas}
                      onChange={(event) =>
                        alterarDadosExtras('ofertas', event.target.value)
                      }
                      placeholder="Ex: 25.50"
                    />
                  </label>
                </div>
              )}
            </div>

            {classeChamadaId && classeSelecionada && alunosDaClasse.length === 0 && !mensagemChamada && (
              <div className="aviso">
                <p>
                  Não encontrei alunos vinculados à classe {classeSelecionada.nome}.
                  Verifique o cadastro dos alunos antes de salvar a chamada.
                </p>
              </div>
            )}

            {alunosDaClasse.length > 0 && (
              <>
                <div className="resumo-chamada">
                  <p>
                    <strong>Matrícula:</strong> {alunosDaClasse.length}
                  </p>

                  <p>
                    <strong>Visitantes:</strong>{' '}
                    {converterNumero(dadosExtrasChamada.visitantes)}
                  </p>

                  <p>
                    <strong>Ofertas:</strong>{' '}
                    {formatarMoeda(dadosExtrasChamada.ofertas)}
                  </p>
                </div>

                <div className="acoes-chamada-rapida">
                  <button
                    type="button"
                    className="botao-marcar-todos presente"
                    onClick={() => marcarTodosAlunos('presente')}
                  >
                    Marcar todos como presentes
                  </button>

                  <button
                    type="button"
                    className="botao-marcar-todos faltou"
                    onClick={() => marcarTodosAlunos('faltou')}
                  >
                    Marcar todos como faltaram
                  </button>
                </div>

                <div className="lista">
                  {alunosDaClasse.map((aluno) => (
                    <div className="item-lista item-chamada" key={aluno.id}>
                      <div>
                        <h3>{aluno.nome}</h3>
                        <p>Classe: {buscarNomeClasse(aluno.classeId)}</p>
                      </div>

                      <div className="acoes-chamada">
                        <button
                          type="button"
                          className={
                            presencas[String(aluno.id)] === 'presente'
                              ? 'botao-presenca ativo-presente'
                              : 'botao-presenca'
                          }
                          onClick={() => alterarPresenca(aluno.id, 'presente')}
                        >
                          Presente
                        </button>

                        <button
                          type="button"
                          className={
                            presencas[String(aluno.id)] === 'faltou'
                              ? 'botao-falta ativo-falta'
                              : 'botao-falta'
                          }
                          onClick={() => alterarPresenca(aluno.id, 'faltou')}
                        >
                          Faltou
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" className="botao-principal" onClick={salvarChamada}>
                  Salvar chamada dos alunos
                </button>
              </>
            )}
          </>
        )}

        {usuarioEhSecretaria() && tipoChamada === 'professores' && (
          <>
            <div className="formulario formulario-data-chamada">
              <label>
                Data da aula
                <input
                  type="date"
                  value={dataAulaChamada}
                  onChange={(event) => setDataAulaChamada(event.target.value)}
                />
                <small className="texto-ajuda-campo">
                  Use a data do domingo/aula referente à chamada.
                </small>
              </label>
            </div>

            <div className="resumo-chamada resumo-professores">
              <p>
                <strong>Professores cadastrados:</strong> {professoresDaIgreja.length}
              </p>
              <p>
                <strong>Última chamada:</strong> {buscarDataUltimaChamadaProfessores()}
              </p>
              <p>
                <strong>Chamadas salvas:</strong> {chamadasProfessores.length}
              </p>
            </div>

            {professoresDaIgreja.length === 0 && (
              <div className="aviso">
                <p>
                  Nenhum professor cadastrado. Vá em Alunos e Professores,
                  cadastre uma pessoa com tipo Professor.
                </p>
              </div>
            )}

            {professoresDaIgreja.length > 0 && (
              <>
                <div className="lista">
                  {professoresDaIgreja.map((professor) => (
                    <div className="item-lista item-chamada" key={professor.id}>
                      <div>
                        <h3>{professor.nome}</h3>
                        {professor.telefone && <p>Telefone: {professor.telefone}</p>}
                        <p>Classe de referência: {buscarNomeClasse(professor.classeId)}</p>
                      </div>

                      <div className="acoes-chamada acoes-chamada-professores">
                        <button
                          type="button"
                          className={
                            presencasProfessores[professor.id] === 'presente'
                              ? 'botao-presenca ativo-presente'
                              : 'botao-presenca'
                          }
                          onClick={() =>
                            alterarPresencaProfessor(professor.id, 'presente')
                          }
                        >
                          Presente
                        </button>

                        <button
                          type="button"
                          className={
                            presencasProfessores[professor.id] === 'faltou'
                              ? 'botao-falta ativo-falta'
                              : 'botao-falta'
                          }
                          onClick={() =>
                            alterarPresencaProfessor(professor.id, 'faltou')
                          }
                        >
                          Faltou
                        </button>

                        <button
                          type="button"
                          className={
                            presencasProfessores[professor.id] === 'justificou'
                              ? 'botao-justificou ativo-justificou'
                              : 'botao-justificou'
                          }
                          onClick={() =>
                            alterarPresencaProfessor(professor.id, 'justificou')
                          }
                        >
                          Justificou
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="formulario formulario-observacao-professores">
                  <label>
                    Observações da chamada dos professores
                    <input
                      type="text"
                      value={observacoesChamadaProfessores}
                      onChange={(event) =>
                        setObservacoesChamadaProfessores(event.target.value)
                      }
                      placeholder="Ex: troca de professor, viagem, justificativa geral..."
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="botao-principal"
                  onClick={salvarChamadaProfessores}
                >
                  Salvar chamada dos professores
                </button>
              </>
            )}
          </>
        )}
      </section>
    )
  }

  function obterChaveDataHistoricoChamada(dataTexto) {
    const texto = String(dataTexto || '').trim()

    if (!texto) {
      return ''
    }

    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (iso) {
      return `${iso[1]}-${iso[2]}-${iso[3]}`
    }

    const br = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

    if (br) {
      const dia = String(br[1]).padStart(2, '0')
      const mes = String(br[2]).padStart(2, '0')
      return `${br[3]}-${mes}-${dia}`
    }

    const dataLivre = new Date(texto)

    if (!Number.isNaN(dataLivre.getTime())) {
      const ano = dataLivre.getFullYear()
      const mes = String(dataLivre.getMonth() + 1).padStart(2, '0')
      const dia = String(dataLivre.getDate()).padStart(2, '0')
      return `${ano}-${mes}-${dia}`
    }

    return texto
  }

  function obterTempoOrdenacaoChamada(dataTexto, id = 0) {
    const texto = String(dataTexto || '').trim()

    if (!texto) {
      return Number(id) || 0
    }

    const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (iso) {
      const dataIso = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      return Number.isNaN(dataIso.getTime()) ? Number(id) || 0 : dataIso.getTime()
    }

    const br = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

    if (br) {
      const dataBr = new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]))
      return Number.isNaN(dataBr.getTime()) ? Number(id) || 0 : dataBr.getTime()
    }

    const dataLivre = new Date(texto)
    return Number.isNaN(dataLivre.getTime()) ? Number(id) || 0 : dataLivre.getTime()
  }

  function montarHistoricoChamadasRecentes() {
    const historicoAlunos = chamadasSalvas.map((chamada) => {
      const classe = classes.find((item) => Number(item.id) === Number(chamada.classeId))

      return {
        id: chamada.id,
        chave: `alunos-${chamada.id}`,
        tipo: 'alunos',
        titulo: `Chamada dos alunos${classe?.nome ? ` — ${classe.nome}` : ''}`,
        classe: classe?.nome || 'Classe não encontrada',
        data: chamada.data,
        dataChave: obterChaveDataHistoricoChamada(chamada.data),
        resumo: [
          `Presentes: ${converterNumero(chamada.totalPresentes)}`,
          `Faltas: ${converterNumero(chamada.totalFaltas)}`,
          `Visitantes: ${converterNumero(chamada.visitantes)}`,
          `Total: ${converterNumero(chamada.totalGeralClasse)}`,
        ],
      }
    })

    const historicoProfessores = chamadasProfessores.map((chamada) => ({
      id: chamada.id,
      chave: `professores-${chamada.id}`,
      tipo: 'professores',
      titulo: 'Chamada dos professores',
      classe: 'Professores da igreja',
      data: chamada.data,
      dataChave: obterChaveDataHistoricoChamada(chamada.data),
      resumo: [
        `Presentes: ${converterNumero(chamada.totalPresentes)}`,
        `Faltaram: ${converterNumero(chamada.totalFaltas)}`,
        `Justificaram: ${converterNumero(chamada.totalJustificadas)}`,
        `Total: ${converterNumero(chamada.totalProfessores)}`,
      ],
    }))

    return [...historicoAlunos, ...historicoProfessores]
      .sort((a, b) => {
        const tempoA = obterTempoOrdenacaoChamada(a.data, a.id)
        const tempoB = obterTempoOrdenacaoChamada(b.data, b.id)

        if (tempoA !== tempoB) {
          return tempoB - tempoA
        }

        return Number(b.id || 0) - Number(a.id || 0)
      })
      .slice(0, 24)
  }

  function montarDatasHistoricoChamadas(historicoChamadas = []) {
    const mapaDatas = new Map()

    historicoChamadas.forEach((item) => {
      const chave = item.dataChave || obterChaveDataHistoricoChamada(item.data)

      if (!chave) {
        return
      }

      const dataAtual = mapaDatas.get(chave) || {
        chave,
        rotulo: formatarDataCurtaRelatorio(item.data),
        total: 0,
        alunos: 0,
        professores: 0,
        tempo: obterTempoOrdenacaoChamada(item.data, item.id),
      }

      dataAtual.total += 1

      if (item.tipo === 'professores') {
        dataAtual.professores += 1
      } else {
        dataAtual.alunos += 1
      }

      if (obterTempoOrdenacaoChamada(item.data, item.id) > dataAtual.tempo) {
        dataAtual.tempo = obterTempoOrdenacaoChamada(item.data, item.id)
      }

      mapaDatas.set(chave, dataAtual)
    })

    return Array.from(mapaDatas.values()).sort((a, b) => b.tempo - a.tempo)
  }

  async function excluirChamadaHistorico(item, event) {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    if (!item?.id) {
      setMensagemHistoricoChamadas({
        tipo: 'erro',
        texto: 'Não encontrei o identificador dessa chamada.',
      })
      return
    }

    const igrejaAtualId = buscarIgrejaIdAtual()

    if (!igrejaAtualId) {
      setMensagemHistoricoChamadas({
        tipo: 'erro',
        texto: 'Não foi possível confirmar a igreja atual. Atualize os dados e tente novamente.',
      })
      return
    }

    const dataFormatada = formatarDataCurtaRelatorio(item.data)
    const confirmou = window.confirm(
      `Deseja realmente excluir esta chamada?\n\n${item.titulo}\nData: ${dataFormatada}\n\nEssa ação remove apenas o registro da chamada. Alunos, classes e professores não serão apagados.`
    )

    if (!confirmou) {
      return
    }

    setExcluindoChamadaId(item.chave)
    setMensagemHistoricoChamadas(null)

    try {
      const tabela = item.tipo === 'professores' ? 'chamadas_professores' : 'chamadas'
      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq('id', item.id)
        .eq('igreja_id', igrejaAtualId)

      if (error) {
        throw error
      }

      if (item.tipo === 'professores') {
        setChamadasProfessores((atuais) => atuais.filter((chamada) => Number(chamada.id) !== Number(item.id)))
      } else {
        setChamadasSalvas((atuais) => atuais.filter((chamada) => Number(chamada.id) !== Number(item.id)))
      }

      setMensagemHistoricoChamadas({
        tipo: 'sucesso',
        texto: 'Chamada excluída com sucesso. Os cadastros da igreja não foram alterados.',
      })
    } catch (error) {
      console.error('Erro ao excluir chamada:', error)
      setMensagemHistoricoChamadas({
        tipo: 'erro',
        texto: 'Não foi possível excluir a chamada. Verifique sua permissão e tente novamente.',
      })
    } finally {
      setExcluindoChamadaId(null)
    }
  }

  function renderizarHistoricoChamadasRelatorio() {
    if (!usuarioEhSecretaria()) {
      return null
    }

    const historicoChamadas = montarHistoricoChamadasRecentes()
    const datasHistorico = montarDatasHistoricoChamadas(historicoChamadas)
    const dataSelecionadaValida = datasHistorico.some((data) => data.chave === dataHistoricoChamadasSelecionada)
      ? dataHistoricoChamadasSelecionada
      : ''
    const dataSelecionada = datasHistorico.find((data) => data.chave === dataSelecionadaValida)
    const historicoDaData = dataSelecionadaValida
      ? historicoChamadas.filter((item) => {
          const mesmaData = (item.dataChave || obterChaveDataHistoricoChamada(item.data)) === dataSelecionadaValida
          const mesmoTipo = tipoHistoricoChamadasSelecionado === 'todos' || item.tipo === tipoHistoricoChamadasSelecionado
          return mesmaData && mesmoTipo
        })
      : []

    return (
      <div className="historico-chamadas-relatorio no-print">
        <div className="historico-chamadas-topo">
          <div>
            <span className="selo-publico">Histórico</span>
            <h3>Histórico de chamadas</h3>
            <p>Consulte as chamadas por data e acompanhe os registros lançados na EBD.</p>
          </div>

          <button
            className="botao-secundario"
            type="button"
            onClick={() =>
              buscarTodosOsDados().catch((error) => {
                console.error('Erro ao atualizar histórico de chamadas:', error)
                setMensagemHistoricoChamadas({
                  tipo: 'erro',
                  texto: 'Não foi possível atualizar o histórico agora. Tente novamente.',
                })
              })
            }
          >
            Atualizar histórico
          </button>
        </div>

        {historicoChamadas.length > 0 && (
          <div className="historico-chamadas-controles">
            <label className="historico-campo">
              <span>Data da chamada</span>
              <select
                value={dataSelecionadaValida}
                onChange={(event) => setDataHistoricoChamadasSelecionada(event.target.value)}
              >
                <option value="">Selecione uma data</option>
                {datasHistorico.map((data) => (
                  <option value={data.chave} key={data.chave}>
                    {data.rotulo} — {data.total} {data.total === 1 ? 'chamada' : 'chamadas'}
                  </option>
                ))}
              </select>
            </label>

            <label className="historico-campo">
              <span>Tipo</span>
              <select
                value={tipoHistoricoChamadasSelecionado}
                onChange={(event) => setTipoHistoricoChamadasSelecionado(event.target.value)}
              >
                <option value="todos">Alunos e professores</option>
                <option value="alunos">Somente alunos</option>
                <option value="professores">Somente professores</option>
              </select>
            </label>
          </div>
        )}

        {datasHistorico.length > 1 && (
          <div className="datas-historico-atalhos" aria-label="Datas com chamadas registradas">
            {datasHistorico.slice(0, 8).map((data) => (
              <button
                type="button"
                className={`botao-data-historico ${data.chave === dataSelecionadaValida ? 'ativo' : ''}`}
                onClick={() => setDataHistoricoChamadasSelecionada(data.chave)}
                key={data.chave}
              >
                <strong>{data.rotulo}</strong>
                <span>{data.total} {data.total === 1 ? 'chamada' : 'chamadas'}</span>
              </button>
            ))}
          </div>
        )}

        {mensagemHistoricoChamadas && (
          <div className={`aviso-historico-chamadas ${mensagemHistoricoChamadas.tipo}`}>
            <p>{mensagemHistoricoChamadas.texto}</p>
            <button
              type="button"
              onClick={() => setMensagemHistoricoChamadas(null)}
              aria-label="Fechar mensagem do histórico de chamadas"
            >
              ×
            </button>
          </div>
        )}

        {historicoChamadas.length > 0 ? (
          dataSelecionadaValida ? (
            <>
              <div className="historico-chamadas-cabecalho-lista">
                <div>
                  <span>Data selecionada</span>
                  <strong>{dataSelecionada?.rotulo || 'Selecione uma data'}</strong>
                </div>
                <p>
                  {historicoDaData.length} {historicoDaData.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </p>
              </div>

              {historicoDaData.length > 0 ? (
                <div className="lista-historico-chamadas">
                  {historicoDaData.map((item) => (
                    <article className="card-historico-chamada" key={item.chave}>
                      <div className="historico-chamada-data">
                        <strong>{formatarDataCurtaRelatorio(item.data)}</strong>
                        <span>{item.tipo === 'professores' ? 'Professores' : 'Alunos'}</span>
                      </div>

                      <div className="historico-chamada-conteudo">
                        <h4>{item.titulo}</h4>
                        <p>{item.classe}</p>
                        <div className="historico-chamada-resumo">
                          {item.resumo.map((linha) => (
                            <span key={linha}>{linha}</span>
                          ))}
                        </div>
                      </div>

                      <button
                        className="botao-excluir botao-excluir-chamada"
                        type="button"
                        onClick={(event) => excluirChamadaHistorico(item, event)}
                        disabled={excluindoChamadaId === item.chave}
                      >
                        {excluindoChamadaId === item.chave ? 'Excluindo...' : 'Excluir chamada'}
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="aviso aviso-historico-vazio">
                  <p>Nenhuma chamada encontrada para essa combinação de filtros.</p>
                </div>
              )}
            </>
          ) : (
            <div className="aviso aviso-historico-vazio historico-selecione-data">
              <p>Selecione uma data para visualizar as chamadas registradas.</p>
            </div>
          )
        ) : (
          <div className="aviso aviso-historico-vazio">
            <p>Nenhuma chamada registrada até o momento.</p>
          </div>
        )}
      </div>
    )
  }

  function renderizarRelatorios() {
    const linhasRelatorio = montarRelatorioPorClasse()
    const totaisRelatorio = calcularTotaisRelatorio()
    const dataRelatorio = buscarDataUltimaChamada()
    const dataRelatorioFormatada = formatarDataRelatorio(dataRelatorio)
    const dataRelatorioCurta = formatarDataCurtaRelatorio(dataRelatorio)
    const resumoProfessores = calcularResumoUltimaChamadaProfessores()
    const percentualProfessores = calcularPercentualPresencaProfessores()

    return (
      <section className="conteudo pagina-interna pagina-relatorios">
        <div className="topo-pagina topo-pagina-interna no-print">
          <div>
            <span className="subtitulo-pagina-interna">Análises e documentos</span>
            <h2>Relatórios</h2>
            <p>
              {usuarioEhProfessor()
                ? 'Relatório da sua classe no modelo da Escola Bíblica Dominical.'
                : 'Relatório geral no modelo da Escola Bíblica Dominical.'}
            </p>
          </div>

          <div className="relatorio-orientacao no-print">
            <span>Confira o relatório abaixo e use os botões no final da folha.</span>
          </div>
        </div>

        <div className="relatorios-dashboard no-print">
          <div className="relatorios-hero">
            <div>
              <span className="selo-publico">Relatórios da EBD</span>
              <h3>Resumo geral da Escola Bíblica Dominical</h3>
              <p>
                Acompanhe alunos, classes, frequência e presença dos professores
                com uma visualização mais clara e moderna.
              </p>
            </div>

            <div className="relatorios-percentual">
              <strong>{calcularFrequenciaGeral()}%</strong>
              <span>frequência geral</span>
            </div>
          </div>

          <div className="cards cards-relatorios-modernas">
            <div className="card card-relatorio-moderna">
              <span>Classes</span>
              <strong>{classes.length}</strong>
              <p>classes cadastradas</p>
            </div>

            <div className="card card-relatorio-moderna">
              <span>Alunos</span>
              <strong>{alunosSomente().length}</strong>
              <p>alunos na chamada</p>
            </div>

            <div className="card card-relatorio-moderna">
              <span>Chamadas</span>
              <strong>{chamadasSalvas.length}</strong>
              <p>chamadas de alunos salvas</p>
            </div>

            <div className="card card-relatorio-moderna destaque">
              <span>Frequência</span>
              <strong>{calcularFrequenciaGeral()}%</strong>
              <p>média geral de presença</p>
            </div>
          </div>

          {usuarioEhSecretaria() && (
            <div className="relatorio-professores-moderno">
              <div className="cabecalho-relatorio-professores">
                <div>
                  <span className="selo-publico">Professores</span>
                  <h3>Resumo da última chamada dos professores</h3>
                  <p>Data da chamada: {formatarDataRelatorio(resumoProfessores.data)}</p>
                </div>

                <div className="circulo-presenca-professores">
                  <strong>{percentualProfessores}%</strong>
                  <span>presentes</span>
                </div>
              </div>

              <div className="grade-professores-resumo">
                <div>
                  <span>Total de professores</span>
                  <strong>{resumoProfessores.totalProfessores}</strong>
                </div>

                <div>
                  <span>Presentes</span>
                  <strong>{resumoProfessores.presentes}</strong>
                </div>

                <div>
                  <span>Faltaram</span>
                  <strong>{resumoProfessores.faltaram}</strong>
                </div>

                <div>
                  <span>Justificaram</span>
                  <strong>{resumoProfessores.justificaram}</strong>
                </div>
              </div>

              {resumoProfessores.registros.length > 0 && (
                <div className="lista-professores-relatorio">
                  {resumoProfessores.registros.map((registro, indice) => (
                    <div className="linha-professor-relatorio" key={`${registro.nome}-${indice}`}>
                      <div>
                        <strong>{registro.nome}</strong>
                        {registro.classeReferencia && <p>{registro.classeReferencia}</p>}
                        {registro.classes && <p>{registro.classes}</p>}
                      </div>

                      <span className={`status-professor status-${registro.status}`}>
                        {traduzirStatusProfessor(registro.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relatorio-folha">
          <div className="cabecalho-relatorio cabecalho-relatorio-oficial">
            <div className="cabecalho-relatorio-marca">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-relatorio"
              />

              <div className="cabecalho-relatorio-titulos">
                <span className="relatorio-selo-institucional">Relatório oficial da EBD</span>
                <h3>{configuracaoIgreja.nome_igreja || 'Relatório do Domingo'}</h3>
                {configuracaoIgreja.congregacao && <p>{configuracaoIgreja.congregacao}</p>}
              </div>
            </div>

            <div className="relatorio-info-igreja">
              {configuracaoIgreja.pastor_dirigente && (
                <p><strong>Dirigente:</strong> {configuracaoIgreja.pastor_dirigente}</p>
              )}
              {configuracaoIgreja.superintendente_ebd && (
                <p><strong>Superintendente:</strong> {configuracaoIgreja.superintendente_ebd}</p>
              )}
              {montarEnderecoIgreja() && <p><strong>Endereço:</strong> {montarEnderecoIgreja()}</p>}
              {(configuracaoIgreja.telefone || configuracaoIgreja.email) && (
                <p>
                  <strong>Contato:</strong>{' '}
                  {[configuracaoIgreja.telefone, configuracaoIgreja.email]
                    .filter(Boolean)
                    .join(' | ')}
                </p>
              )}
            </div>

            <div className="relatorio-data-selo">
              <span>Data da EBD</span>
              <strong>{dataRelatorioCurta}</strong>
              <small>{dataRelatorioFormatada}</small>
            </div>
          </div>

          <div className="tabela-container">
            <table className="tabela tabela-ebd">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Classes</th>
                  <th>Matrícula</th>
                  <th>Ausência</th>
                  <th>Presença</th>
                  <th>Visitante</th>
                  <th>Total</th>
                  <th>Bíblia</th>
                  <th>Revista</th>
                  <th>Ofertas</th>
                  <th>Frequência</th>
                </tr>
              </thead>

              <tbody>
                {linhasRelatorio.map((linha) => (
                  <tr key={linha.classeId}>
                    <td>{linha.numero}</td>
                    <td>{linha.classe}</td>
                    <td>{linha.matricula}</td>
                    <td>{linha.ausencia}</td>
                    <td>{linha.presenca}</td>
                    <td>{linha.visitantes}</td>
                    <td>{linha.total}</td>
                    <td>{linha.biblias}</td>
                    <td>{linha.revistas}</td>
                    <td>{formatarMoeda(linha.ofertas)}</td>
                    <td>{linha.frequencia}%</td>
                  </tr>
                ))}

                <tr className="linha-total">
                  <td colSpan="2">TOTAL GERAL</td>
                  <td>{totaisRelatorio.matricula}</td>
                  <td>{totaisRelatorio.ausencia}</td>
                  <td>{totaisRelatorio.presenca}</td>
                  <td>{totaisRelatorio.visitantes}</td>
                  <td>{totaisRelatorio.total}</td>
                  <td>{totaisRelatorio.biblias}</td>
                  <td>{totaisRelatorio.revistas}</td>
                  <td>{formatarMoeda(totaisRelatorio.ofertas)}</td>
                  <td>{totaisRelatorio.frequencia}%</td>
                </tr>

                <tr className="linha-domingo-anterior">
                  <td colSpan="11">
                    <span>Domingo anterior</span>
                    <small>Dados comparativos da última Escola Bíblica Dominical.</small>
                  </td>
                </tr>

                {usuarioEhSecretaria() && (
                  <>
                    <tr className="linha-professores-titulo">
                      <td colSpan="11">
                        <div className="relatorio-professores-titulo-conteudo">
                          <strong>Chamada dos professores</strong>
                          <span>Total: {resumoProfessores.totalProfessores}</span>
                          <span>Presentes: {resumoProfessores.presentes}</span>
                          <span>Faltaram: {resumoProfessores.faltaram}</span>
                          <span>Justificaram: {resumoProfessores.justificaram}</span>
                          <span>Frequência: {percentualProfessores}%</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="linha-professores-cabecalho">
                      <td>Nº</td>
                      <td colSpan="3">Professor</td>
                      <td colSpan="3">Classe de referência</td>
                      <td colSpan="2">Situação</td>
                      <td colSpan="2">Data</td>
                    </tr>

                    {resumoProfessores.registros.length > 0 ? (
                      resumoProfessores.registros.map((registro, indice) => (
                        <tr
                          className="linha-professor-tabela-relatorio"
                          key={`${registro.nome}-${indice}`}
                        >
                          <td>{indice + 1}</td>
                          <td colSpan="3">{registro.nome}</td>
                          <td colSpan="3">
                            {registro.classeReferencia || registro.classes || '-'}
                          </td>
                          <td colSpan="2">
                            <span className={`status-relatorio-professor status-${registro.status}`}>
                              {traduzirStatusProfessor(registro.status)}
                            </span>
                          </td>
                          <td colSpan="2">{formatarDataCurtaRelatorio(resumoProfessores.data)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="linha-professor-tabela-relatorio">
                        <td colSpan="11">Nenhuma chamada de professor lançada neste período.</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="rodape-relatorio-oficial">
            Relatório gerado pelo EBD Fiel — Gestão inteligente para Escola Bíblica Dominical • Gerado em {buscarDataAtual()}
          </div>
        </div>

        {renderizarHistoricoChamadasRelatorio()}

        <div className="relatorio-acoes-rodape no-print">
          <div>
            <strong>Ações do relatório</strong>
            <span>Imprima, salve em PDF ou gere uma folha em branco para rascunho.</span>
          </div>

          <div className="relatorio-acoes-botoes">
            <button
              className="botao-principal"
              onClick={abrirRelatorioParaImpressao}
            >
              Imprimir / Salvar PDF
            </button>

            <button className="botao-secundario" onClick={baixarRelatorioPDF}>
              Baixar PDF
            </button>

            <button
              className="botao-secundario"
              onClick={abrirRelatorioEmBrancoParaImpressao}
            >
              Relatório em branco
            </button>

            <button
              className="botao-secundario"
              onClick={abrirChamadaPorClasseParaImpressao}
            >
              PDF por classe
            </button>


            <button
              className="botao-secundario"
              onClick={abrirRelatorioAniversariantesMes}
            >
              Aniversariantes do mês
            </button>

            <button
              className="botao-secundario"
              onClick={abrirRelatorioAlertasFaltas}
            >
              Alertas de faltas
            </button>

            <button
              className="botao-secundario"
              onClick={abrirRelatorioDestaquesFrequencia}
            >
              Destaques de frequência
            </button>

            <button
              className="botao-secundario"
              onClick={abrirCartoesAniversariantes}
            >
              Cartões de aniversariantes
            </button>
          </div>
        </div>

        {relatorioExtraVisualizacao && (
          <div className="visualizacao-relatorio-extra no-print" id="visualizacao-relatorio-extra">
            <div className="visualizacao-relatorio-extra-topo">
              <div>
                <span className="selo-publico">Visualização</span>
                <h3>{relatorioExtraVisualizacao.titulo}</h3>
                <p>{relatorioExtraVisualizacao.subtitulo}</p>
                <small>Confira as informações antes de gerar o PDF ou mandar para impressão. Esta visualização não altera nenhum cadastro da igreja.</small>
              </div>
              <div className="visualizacao-relatorio-extra-acoes">
                <button className="botao-principal" type="button" onClick={imprimirRelatorioExtraVisualizado}>
                  Baixar ou imprimir
                </button>
                <button className="botao-secundario" type="button" onClick={() => setRelatorioExtraVisualizacao(null)}>
                  Fechar visualização
                </button>
              </div>
            </div>
            <div className="visualizacao-relatorio-extra-corpo" dangerouslySetInnerHTML={{ __html: relatorioExtraVisualizacao.conteudoHtml }} />
          </div>
        )}
      </section>
    )
  }

  function renderizarConfiguracoes() {
    if (!podeGerenciarCadastros()) {
      return (
        <section className="conteudo">
          <h2>Acesso restrito</h2>
          <p>As configurações da igreja são gerenciadas pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Configurações da Igreja</h2>
            <p>Preencha os dados que aparecerão nos relatórios e PDFs.</p>
          </div>
        </div>

        <form className="formulario" onSubmit={salvarConfiguracaoIgreja}>
          <div className="grade-campos grade-campos-configuracoes">
            <label>
              Nome da igreja
              <input
                type="text"
                value={configuracaoIgreja.nome_igreja}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('nome_igreja', event.target.value)
                }
                placeholder="Ex: Assembleia de Deus Ministério..."
              />
            </label>

            <label>
              Congregação / departamento
              <input
                type="text"
                value={configuracaoIgreja.congregacao}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('congregacao', event.target.value)
                }
                placeholder="Ex: Escola Bíblica Dominical"
              />
            </label>

            <label>
              Pastor ou dirigente
              <input
                type="text"
                value={configuracaoIgreja.pastor_dirigente}
                onChange={(event) =>
                  alterarConfiguracaoIgreja(
                    'pastor_dirigente',
                    event.target.value
                  )
                }
                placeholder="Ex: Pr. João Silva"
              />
            </label>

            <label>
              Superintendente da EBD
              <input
                type="text"
                value={configuracaoIgreja.superintendente_ebd}
                onChange={(event) =>
                  alterarConfiguracaoIgreja(
                    'superintendente_ebd',
                    event.target.value
                  )
                }
                placeholder="Ex: Irmã Maria Helena"
              />
            </label>

            <label>
              Telefone / WhatsApp
              <input
                type="text"
                value={configuracaoIgreja.telefone}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('telefone', event.target.value)
                }
                placeholder="Ex: (11) 99999-0000"
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={configuracaoIgreja.email}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('email', event.target.value)
                }
                placeholder="Ex: contato@igreja.com.br"
              />
            </label>

            <label>
              Endereço
              <input
                type="text"
                value={configuracaoIgreja.endereco}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('endereco', event.target.value)
                }
                placeholder="Ex: Rua das Flores, 123"
              />
            </label>

            <label>
              Bairro
              <input
                type="text"
                value={configuracaoIgreja.bairro}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('bairro', event.target.value)
                }
                placeholder="Ex: Centro"
              />
            </label>

            <label>
              Cidade
              <input
                type="text"
                value={configuracaoIgreja.cidade}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('cidade', event.target.value)
                }
                placeholder="Ex: São Paulo"
              />
            </label>

            <label>
              Estado
              <select
                value={configuracaoIgreja.estado}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('estado', event.target.value)
                }
              >
                <option value="">Selecione o estado</option>
                {ESTADOS_BRASIL.map((estado) => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grupo-botoes">
            <button
              className="botao-principal"
              type="submit"
              disabled={salvandoConfiguracaoIgreja}
            >
              {salvandoConfiguracaoIgreja ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>
        </form>

        <div className="resumo">
          <h3>Prévia do cabeçalho</h3>
          <p>
            <strong>{buscarNomeIgrejaParaExibicao()}</strong>
          </p>
          {configuracaoIgreja.congregacao && (
            <p>{configuracaoIgreja.congregacao}</p>
          )}
          {configuracaoIgreja.pastor_dirigente && (
            <p>Dirigente: {configuracaoIgreja.pastor_dirigente}</p>
          )}
          {configuracaoIgreja.superintendente_ebd && (
            <p>Superintendente da EBD: {configuracaoIgreja.superintendente_ebd}</p>
          )}
          {montarEnderecoIgreja() && <p>{montarEnderecoIgreja()}</p>}
        </div>
      </section>
    )
  }

  function renderizarAlertasFeedbackAdmin() {
    if (!usuarioEhAdminSistema()) {
      return null
    }

    const feedbacksNaoLidos = feedbacksAdmin.filter((feedback) => !feedback.lido)

    return (
      <div className="admin-feedback-alertas">
        <div className="admin-feedback-topo">
          <div>
            <span className="selo-admin">Mensagens das igrejas</span>
            <h3>Respostas recebidas</h3>
            <p>
              Toda mensagem enviada pelas igrejas aparece aqui para acompanhamento.
            </p>
          </div>

          <strong>{feedbacksNaoLidos.length}</strong>
        </div>

        {feedbacksAdmin.length === 0 ? (
          <p className="texto-sem-feedback">Nenhuma mensagem recebida ainda.</p>
        ) : (
          <div className="lista-feedbacks-admin">
            {feedbacksAdmin.slice(0, 12).map((feedback) => (
              <article
                className={`feedback-admin-item ${feedback.lido ? 'feedback-lido' : 'feedback-novo'}`}
                key={feedback.id}
              >
                <div className="feedback-admin-conteudo">
                  <div className="linha-feedback-admin">
                    <strong>{buscarNomeIgrejaFeedback(feedback)}</strong>
                    <span>
                      {feedback.resposta_admin ? 'Respondido' : feedback.lido ? 'Lido' : 'Novo'}
                    </span>
                  </div>

                  <p>{feedback.mensagem}</p>

                  <small>
                    {feedback.tipo} - {feedback.nome_usuario || feedback.email_usuario || 'Usuário'} •{' '}
                    {formatarDataHoraFeedback(feedback.created_at)}
                  </small>

                  {feedback.resposta_admin && (
                    <div className="feedback-resposta-admin">
                      <strong>Resposta enviada:</strong>
                      <p>{feedback.resposta_admin}</p>
                      <small>
                        Respondido por {feedback.respondido_por || 'administrador'} em{' '}
                        {formatarDataHoraFeedback(feedback.respondido_em)}
                        {feedback.notificado_em
                          ? ` - Notificado em ${formatarDataHoraFeedback(feedback.notificado_em)}`
                          : ''}
                      </small>
                    </div>
                  )}

                  {feedbackRespondendoId === feedback.id && (
                    <div className="feedback-responder-box">
                      <label>
                        Resposta à mensagem
                        <textarea
                          value={respostaFeedbackAdmin}
                          onChange={(event) => setRespostaFeedbackAdmin(event.target.value)}
                          placeholder="Escreva a resposta que a igreja verá na área de mensagens..."
                          rows="5"
                        />
                      </label>

                      <div className="feedback-responder-acoes">
                        <button
                          type="button"
                          className="botao-principal"
                          disabled={enviandoRespostaFeedback}
                          onClick={() => salvarRespostaFeedback(feedback)}
                        >
                          {enviandoRespostaFeedback ? 'Salvando...' : 'Salvar resposta'}
                        </button>

                        <button
                          type="button"
                          className="botao-secundario"
                          onClick={cancelarRespostaFeedback}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="acoes-feedback-admin">
                  {!feedback.lido && (
                    <button
                      className="botao-secundario"
                      onClick={() => marcarFeedbackComoLido(feedback.id)}
                    >
                      Marcar como lido
                    </button>
                  )}

                  <button
                    className="botao-secundario"
                    onClick={() => abrirRespostaFeedback(feedback)}
                  >
                    {feedback.resposta_admin ? 'Editar resposta' : 'Responder'}
                  </button>

                  {feedback.resposta_admin && (
                    <>
                      <button
                        className="botao-secundario"
                        onClick={() => copiarRespostaFeedback(feedback)}
                      >
                        Copiar resposta
                      </button>

                      <button
                        className="botao-secundario"
                        onClick={() => enviarRespostaEmailFeedback(feedback)}
                      >
                        Enviar e-mail
                      </button>

                      <button
                        className="botao-verde"
                        onClick={() => enviarRespostaWhatsAppFeedback(feedback)}
                      >
                        WhatsApp
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderizarUsuariosVinculadosIgreja(igreja) {
    const acessosDaIgreja = buscarAcessosDaIgrejaAdmin(igreja.id)

    return (
      <div className="usuarios-vinculados-igreja">
        <div className="usuarios-vinculados-topo">
          <div>
            <strong>Usuários vinculados a esta igreja</strong>
            <span>{acessosDaIgreja.length} usuário(s)</span>
          </div>

          <button
            type="button"
            className="botao-secundario"
            onClick={() => abrirNovoAcessoAdmin(igreja)}
          >
            Novo acesso para esta igreja
          </button>
        </div>

        {acessosDaIgreja.length === 0 && (
          <div className="aviso usuarios-vinculados-vazio">
            <p>Nenhum usuário vinculado a esta igreja.</p>
          </div>
        )}

        {acessosDaIgreja.map((acesso) => (
          <article className="usuario-vinculado-card" key={acesso.user_id}>
            <div>
              <div className="linha-acesso-admin">
                <h4>{acesso.nome || acesso.email}</h4>
                <span>{acesso.perfil}</span>
              </div>

              <p>{acesso.email}</p>
              <small>User UID: {acesso.user_id}</small>
            </div>

            <div className="acoes-usuario-vinculado">
              <button
                className="botao-secundario"
                onClick={() => enviarRecuperacaoSenhaAdmin(acesso.email)}
              >
                Enviar recuperação
              </button>

              <button className="botao-verde" onClick={() => abrirWhatsAppAcessoAdmin(acesso)}>
                WhatsApp
              </button>

              <button className="botao-secundario" onClick={() => copiarContatoAcessoAdmin(acesso)}>
                Copiar contato
              </button>

              <button className="botao-editar" onClick={() => editarAcessoAdmin(acesso)}>
                Editar acesso
              </button>

              <button className="botao-excluir" onClick={() => removerAcessoAdmin(acesso)}>
                Remover acesso
              </button>
            </div>
          </article>
        ))}
      </div>
    )
  }

  function copiarCadastroIncompletoAdmin(cadastro) {
    const texto = [
      `User UID: ${cadastro.user_id}`,
      `E-mail: ${cadastro.email || 'Sem e-mail'}`,
      `Criado em: ${formatarDataHoraFeedback(cadastro.criado_em) || 'Data não informada'}`,
    ].join('\n')

    navigator.clipboard
      ?.writeText(texto)
      .then(() => alert('Dados do cadastro incompleto copiados.'))
      .catch(() => window.prompt('Copie os dados abaixo:', texto))
  }

  function prepararVinculoCadastroIncompleto(cadastro) {
    setNovoAcessoAdmin({
      userId: cadastro.user_id || '',
      nome: '',
      email: cadastro.email || '',
      perfil: 'secretaria',
      igrejaId: '',
      classeId: '',
      dataNascimento: '',
    })
    setAcessoAdminEditandoUserId(null)
    setMostrarFormularioAcessoAdmin(true)

    window.setTimeout(() => {
      const formulario = document.querySelector('.formulario-admin-acesso')

      if (formulario) {
        formulario.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 120)
  }

  function renderizarCadastrosIncompletosAdmin() {
    if (!usuarioEhAdminSistema()) {
      return null
    }

    return (
      <div className="admin-acessos-bloco">
        <div className="admin-acessos-bloco-topo">
          <div>
            <span className="selo-admin">Auditoria de acessos</span>
            <h3>Cadastros incompletos</h3>
            <p>
              Usuários que existem no Supabase Authentication, mas ainda não possuem perfil
              em perfis_usuarios. A solução mais limpa costuma ser excluir o
              usuário no Authentication e pedir novo cadastro.
            </p>
          </div>

          <strong>{cadastrosIncompletosAdmin.length}</strong>
        </div>

        <div className="grupo-botoes">
          <button
            className="botao-secundario"
            type="button"
            onClick={carregarCadastrosIncompletosAdmin}
            disabled={carregandoCadastrosIncompletosAdmin}
          >
            {carregandoCadastrosIncompletosAdmin ? 'Atualizando...' : 'Atualizar auditoria'}
          </button>
        </div>

        {erroCadastrosIncompletosAdmin && (
          <div className="aviso aviso-cadastro-piloto">
            <p>{erroCadastrosIncompletosAdmin}</p>
          </div>
        )}

        {!erroCadastrosIncompletosAdmin && cadastrosIncompletosAdmin.length === 0 && (
          <div className="aviso aviso-sucesso-cadastro">
            <p>Nenhum cadastro incompleto encontrado agora.</p>
          </div>
        )}

        {cadastrosIncompletosAdmin.length > 0 && (
          <div className="lista-acessos-admin">
            {cadastrosIncompletosAdmin.map((cadastro) => (
              <article className="acesso-admin-card" key={cadastro.user_id}>
                <div>
                  <div className="linha-acesso-admin">
                    <h4>{cadastro.email || 'Usuário sem e-mail'}</h4>
                    <span>Sem perfil</span>
                  </div>

                  <p>Criado em: {formatarDataHoraFeedback(cadastro.criado_em) || 'Data não informada'}</p>
                  <small>User UID: {cadastro.user_id}</small>
                </div>

                <div className="acoes-acesso-admin">
                  <button
                    className="botao-secundario"
                    type="button"
                    onClick={() => copiarCadastroIncompletoAdmin(cadastro)}
                  >
                    Copiar dados
                  </button>

                  <button
                    className="botao-editar"
                    type="button"
                    onClick={() => prepararVinculoCadastroIncompleto(cadastro)}
                  >
                    Preparar vínculo
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderizarAcessosAdmin() {
    if (!usuarioEhAdminSistema()) {
      return null
    }

    const acessosFiltrados = filtrarAcessosAdmin()
    const totalSecretarias = acessosAdmin.filter((acesso) => acesso.perfil === 'secretaria').length
    const totalProfessores = acessosAdmin.filter((acesso) => acesso.perfil === 'professor').length

    return (
      <div className="admin-acessos-bloco">
        <div className="admin-acessos-topo">
          <div>
            <span className="selo-admin">Igrejas e acessos</span>
            <h3>Controle comercial de usuários</h3>
            <p>
              Vincule secretarias e professores às igrejas cadastradas. Para criar o login,
              primeiro crie o usuário em Supabase → Authentication → Users e cole o User UID aqui.
            </p>
          </div>

          <button className="botao-principal" onClick={() => abrirNovoAcessoAdmin()}>
            Novo acesso
          </button>
        </div>

        <div className="admin-acessos-resumo">
          <div>
            <strong>{acessosAdmin.length}</strong>
            <span>acessos vinculados</span>
          </div>

          <div>
            <strong>{totalSecretarias}</strong>
            <span>secretarias</span>
          </div>

          <div>
            <strong>{totalProfessores}</strong>
            <span>professores</span>
          </div>
        </div>

        {mostrarFormularioAcessoAdmin && (
          <form className="formulario formulario-admin-acesso" onSubmit={salvarAcessoAdmin}>
            <div className="topo-formulario-inline">
              <div>
                <h3>{acessoAdminEditandoUserId ? 'Editar acesso' : 'Novo acesso'}</h3>
                <p>
                  Este vínculo define qual igreja o usuário acessa e qual perfil ele terá no sistema.
                </p>
              </div>
            </div>

            <div className="grade-campos grade-campos-configuracoes">
              <label>
                Igreja
                <select
                  value={novoAcessoAdmin.igrejaId}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, igrejaId: event.target.value })
                  }
                >
                  <option value="">Selecione uma igreja</option>
                  {igrejasAdmin.map((igreja) => (
                    <option value={igreja.id} key={igreja.id}>
                      {igreja.nome_igreja || igreja.nome} {igreja.congregacao ? `- ${igreja.congregacao}` : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Perfil
                <select
                  value={novoAcessoAdmin.perfil}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, perfil: event.target.value })
                  }
                >
                  <option value="secretaria">Secretaria</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Administrador local</option>
                </select>
              </label>

              <label>
                User UID do Supabase
                <input
                  type="text"
                  value={novoAcessoAdmin.userId}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, userId: event.target.value })
                  }
                  placeholder="Ex: 9a764fab-2000-4fb4-8ee0-9275a139e0f6"
                />
              </label>

              <label>
                Nome
                <input
                  type="text"
                  value={novoAcessoAdmin.nome}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, nome: event.target.value })
                  }
                  placeholder="Ex: Secretaria da igreja"
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  value={novoAcessoAdmin.email}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, email: event.target.value })
                  }
                  placeholder="Ex: secretaria@igreja.com"
                />
              </label>

              <label>
                ID da classe
                <input
                  type="number"
                  value={novoAcessoAdmin.classeId}
                  onChange={(event) =>
                    setNovoAcessoAdmin({ ...novoAcessoAdmin, classeId: event.target.value })
                  }
                  placeholder="Opcional, normalmente só para professor"
                />
              </label>

              <label>
                Data de nascimento
                <input
                  type="date"
                  value={novoAcessoAdmin.dataNascimento}
                  onChange={(event) =>
                    setNovoAcessoAdmin({
                      ...novoAcessoAdmin,
                      dataNascimento: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                Salvar acesso
              </button>

              <button
                className="botao-secundario"
                type="button"
                onClick={limparFormularioAcessoAdmin}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="filtros filtros-admin-acessos">
          <label>
            Buscar acesso
            <input
              type="text"
              value={buscaAcessoAdmin}
              onChange={(event) => setBuscaAcessoAdmin(event.target.value)}
              placeholder="Buscar por nome, e-mail, telefone, WhatsApp, perfil ou igreja"
            />
          </label>

          <button className="botao-secundario" onClick={carregarAcessosAdmin}>
            Atualizar acessos
          </button>
        </div>

        <div className="lista-acessos-admin">
          {acessosFiltrados.map((acesso) => (
            <article className="acesso-admin-card" key={acesso.user_id}>
              <div>
                <div className="linha-acesso-admin">
                  <h4>{acesso.nome || acesso.email}</h4>
                  <span>{acesso.perfil}</span>
                </div>

                <p>{acesso.email}</p>
                <p>Igreja: {buscarNomeIgrejaAdmin(acesso.igreja_id)}</p>

                {(() => {
                  const contato = buscarContatoIgrejaAdmin(acesso.igreja_id)

                  return (
                    <div className="contato-acesso-admin">
                      {contato.responsavel && (
                        <p>Responsável: {contato.responsavel}</p>
                      )}

                      {contato.whatsapp && (
                        <p>WhatsApp: {contato.whatsapp}</p>
                      )}

                      {contato.telefone && contato.telefone !== contato.whatsapp && (
                        <p>Telefone: {contato.telefone}</p>
                      )}

                      {contato.email && contato.email !== acesso.email && (
                        <p>E-mail da igreja: {contato.email}</p>
                      )}
                    </div>
                  )
                })()}

                <small>User UID: {acesso.user_id}</small>
              </div>

              <div className="acoes-acesso-admin">
                <button className="botao-secundario" onClick={() => enviarRecuperacaoSenhaAdmin(acesso.email)}>
                  Enviar recuperação
                </button>

                <button className="botao-verde" onClick={() => abrirWhatsAppAcessoAdmin(acesso)}>
                  WhatsApp
                </button>

                <button className="botao-secundario" onClick={() => copiarContatoAcessoAdmin(acesso)}>
                  Copiar contato
                </button>

                <button className="botao-editar" onClick={() => editarAcessoAdmin(acesso)}>
                  Editar
                </button>

                <button className="botao-excluir" onClick={() => removerAcessoAdmin(acesso)}>
                  Remover
                </button>
              </div>
            </article>
          ))}

          {acessosFiltrados.length === 0 && (
            <div className="aviso">
              <p>Nenhum acesso encontrado.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderizarAdministracao() {
    if (!usuarioEhAdminSistema()) {
      return (
        <section className="conteudo">
          <h2>Acesso restrito</h2>
          <p>Esta área é exclusiva para administradores do sistema.</p>
        </section>
      )
    }

    const igrejasFiltradas = filtrarIgrejasAdmin()
    const igrejasPendentes = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'pendente').length
    const igrejasTeste = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'teste').length
    const igrejasAtivas = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'ativa').length
    const igrejasPausadas = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'pausada').length

    return (
      <section className="conteudo conteudo-admin-comercial">
        <div className="topo-pagina topo-admin-sistema">
          <div>
            <span className="selo-admin">Administração do sistema</span>
            <h2>Administração comercial</h2>
            <p>
              Gerencie igrejas, sedes, congregações, acessos, uso da plataforma, recuperação de senha e respostas em um único lugar.
            </p>
          </div>

          {!mostrarFormularioIgrejaAdmin && (
            <button
              className="botao-principal"
              onClick={() => {
                setAbaAdministracao('igrejas')
                abrirNovaIgrejaAdmin()
              }}
            >
              Nova igreja
            </button>
          )}
        </div>

        <div className="cards cards-admin-sistema">
          <div className="card card-admin">
            <span>Total</span>
            <strong>{igrejasAdmin.length}</strong>
            <p>igrejas cadastradas</p>
          </div>

          <div className="card card-admin">
            <span>Pendentes</span>
            <strong>{igrejasPendentes}</strong>
            <p>aguardando aprovação</p>
          </div>

          <div className="card card-admin">
            <span>Em uso</span>
            <strong>{igrejasTeste}</strong>
            <p>usando a plataforma</p>
          </div>

          <div className="card card-admin">
            <span>Ativas</span>
            <strong>{igrejasAtivas}</strong>
            <p>liberadas para uso</p>
          </div>

          <div className="card card-admin">
            <span>Pausadas</span>
            <strong>{igrejasPausadas}</strong>
            <p>aguardando retorno</p>
          </div>
        </div>

        <div className="admin-abas-navegacao" role="tablist" aria-label="Áreas da administração">
          <button
            type="button"
            className={`admin-aba-botao ${abaAdministracao === 'visao' ? 'ativo' : ''}`}
            onClick={() => setAbaAdministracao('visao')}
          >
            Visão geral
          </button>

          <button
            type="button"
            className={`admin-aba-botao ${abaAdministracao === 'sugestoes' ? 'ativo' : ''}`}
            onClick={() => setAbaAdministracao('sugestoes')}
          >
            Sugestões recebidas
          </button>

          <button
            type="button"
            className={`admin-aba-botao ${abaAdministracao === 'igrejas' ? 'ativo' : ''}`}
            onClick={() => setAbaAdministracao('igrejas')}
          >
            Igrejas cadastradas
          </button>

          <button
            type="button"
            className={`admin-aba-botao ${abaAdministracao === 'auditoria' ? 'ativo' : ''}`}
            onClick={() => setAbaAdministracao('auditoria')}
          >
            Auditoria
          </button>

          <button
            type="button"
            className={`admin-aba-botao ${abaAdministracao === 'diagnostico' ? 'ativo' : ''}`}
            onClick={() => setAbaAdministracao('diagnostico')}
          >
            Diagnóstico
          </button>
        </div>

        {abaAdministracao === 'visao' && (
          <div className="admin-visao-geral-grid">
            <article className="admin-visao-card admin-visao-card-destaque">
              <span className="selo-admin">Acompanhamento</span>
              <h3>Sugestões das igrejas</h3>
              <strong>{feedbacksAdmin.length}</strong>
              <p>mensagens registradas para acompanhamento da equipe.</p>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => setAbaAdministracao('sugestoes')}
              >
                Abrir sugestões
              </button>
            </article>

            <article className="admin-visao-card">
              <span className="selo-admin">Cadastro</span>
              <h3>Igrejas cadastradas</h3>
              <strong>{igrejasAdmin.length}</strong>
              <p>igrejas, sedes e congregações registradas na plataforma.</p>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => setAbaAdministracao('igrejas')}
              >
                Ver igrejas
              </button>
            </article>

            <article className="admin-visao-card">
              <span className="selo-admin">Acessos</span>
              <h3>Auditoria</h3>
              <strong>{cadastrosIncompletosAdmin.length}</strong>
              <p>cadastros incompletos ou pendências de vínculo.</p>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => setAbaAdministracao('auditoria')}
              >
                Abrir auditoria
              </button>
            </article>

            <article className="admin-visao-card">
              <span className="selo-admin">Suporte</span>
              <h3>Diagnóstico técnico</h3>
              <strong>{diagnosticoCarregamento ? 'OK' : '—'}</strong>
              <p>ferramenta para analisar sessão, perfil e dados carregados.</p>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => setAbaAdministracao('diagnostico')}
              >
                Abrir diagnóstico
              </button>
            </article>
          </div>
        )}

        {abaAdministracao === 'diagnostico' && (
        <div className="diagnostico-carregamento-card diagnostico-admin-card">
          <div className="diagnostico-carregamento-cabecalho">
            <div>
              <span className="hero-tag">Suporte técnico</span>
              <h3>Diagnóstico do carregamento</h3>
              <p>
                Ferramenta exclusiva do administrador para conferir sessão, perfil,
                igreja vinculada e retorno das consultas do Supabase quando alguma igreja relatar dados zerados.
              </p>
            </div>
            <div className="diagnostico-acoes">
              <button
                className="botao-secundario botao-diagnostico"
                type="button"
                onClick={executarDiagnosticoCarregamento}
                disabled={carregandoDiagnostico}
              >
                {carregandoDiagnostico ? 'Verificando...' : 'Executar diagnóstico'}
              </button>

              <button
                className="botao-secundario botao-diagnostico"
                type="button"
                onClick={() => carregarDadosOnline(sessaoRef.current, recuperarContextoSuporteAdminAtual())}
              >
                Recarregar dados atuais
              </button>
            </div>
          </div>

          {diagnosticoCarregamento ? (
            <>
              <div className="diagnostico-grid">
                <div><strong>E-mail</strong><span>{diagnosticoCarregamento.sessao?.email || 'sem sessão'}</span></div>
                <div><strong>User ID</strong><span>{diagnosticoCarregamento.sessao?.userId || 'não encontrado'}</span></div>
                <div><strong>Perfil</strong><span>{diagnosticoCarregamento.perfilUsado?.perfil || 'não encontrado'}</span></div>
                <div><strong>Igreja ID</strong><span>{diagnosticoCarregamento.perfilUsado?.igreja_id || 'não encontrado'}</span></div>
                <div><strong>Classes Supabase</strong><span>{diagnosticoCarregamento.contagens?.classes ?? 'sem consulta'}</span></div>
                <div><strong>Alunos Supabase</strong><span>{diagnosticoCarregamento.contagens?.alunos ?? 'sem consulta'}</span></div>
                <div><strong>Chamadas Supabase</strong><span>{diagnosticoCarregamento.contagens?.chamadas ?? 'sem consulta'}</span></div>
                <div><strong>Classes na tela</strong><span>{diagnosticoCarregamento.estadoTela?.classesNaTela ?? classes.length}</span></div>
              </div>

              <div className="grupo-botoes diagnostico-botoes-final">
                <button className="botao-secundario" type="button" onClick={copiarDiagnosticoCarregamento}>
                  Copiar diagnóstico
                </button>
                <button className="botao-secundario" type="button" onClick={baixarDiagnosticoCarregamento}>
                  Baixar diagnóstico
                </button>
              </div>

              {mensagemDiagnosticoAdmin && (
                <div className={`mensagem-diagnostico-admin ${mensagemDiagnosticoAdmin.tipo}`} role="status" aria-live="polite">
                  <p>{mensagemDiagnosticoAdmin.texto}</p>
                  <button
                    type="button"
                    onClick={() => setMensagemDiagnosticoAdmin(null)}
                    aria-label="Fechar mensagem do diagnóstico"
                  >
                    ×
                  </button>
                </div>
              )}

              <details className="diagnostico-detalhes">
                <summary>Ver diagnóstico completo</summary>
                <pre>{JSON.stringify(diagnosticoCarregamento, null, 2)}</pre>
              </details>
            </>
          ) : (
            <div className="aviso diagnostico-admin-aviso">
              <p>Execute o diagnóstico quando precisar conferir carregamento de sessão, perfil, igreja e dados retornados.</p>
            </div>
          )}
        </div>
        )}

        {abaAdministracao === 'sugestoes' && renderizarAlertasFeedbackAdmin()}

        {abaAdministracao === 'auditoria' && renderizarCadastrosIncompletosAdmin()}

        {/* Usuários vinculados agora aparecem dentro de cada igreja. */}

        {abaAdministracao === 'igrejas' && (
          <>
        {mostrarFormularioIgrejaAdmin && (
          <form className="formulario formulario-admin-igreja" onSubmit={salvarIgrejaAdmin}>
            <div className="topo-formulario-inline">
              <div>
                <h3>{igrejaAdminEditandoId ? 'Editar igreja' : 'Nova igreja'}</h3>
                <p>
                  Cadastre a igreja com endereço completo, tipo de igreja e vínculo com a sede.
                  Depois crie o usuário no Supabase, em Authentication → Users, e vincule o acesso.
                </p>
              </div>
            </div>

            <div className="grade-campos grade-campos-configuracoes">
              <label>
                Nome da igreja
                <input
                  type="text"
                  value={novaIgrejaAdmin.nome_igreja}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      nome_igreja: event.target.value,
                    })
                  }
                  placeholder="Ex: Assembleia de Deus Campo..."
                />
              </label>

              <label>
                Congregação
                <input
                  type="text"
                  value={novaIgrejaAdmin.congregacao}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      congregacao: event.target.value,
                    })
                  }
                  placeholder="Ex: Sede, Betel, Vila Nova..."
                />
              </label>

              <label>
                Pastor/Dirigente
                <input
                  type="text"
                  value={novaIgrejaAdmin.pastor_dirigente}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      pastor_dirigente: event.target.value,
                    })
                  }
                  placeholder="Ex: Pr. João Silva"
                />
              </label>

              <label>
                Status da plataforma
                <select
                  value={novaIgrejaAdmin.status_piloto}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      status_piloto: event.target.value,
                    })
                  }
                >
                  <option value="pendente">Pendente</option>
                  <option value="teste">Em uso</option>
                  <option value="ativa">Ativa</option>
                  <option value="pausada">Pausada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </label>

              <label>
                Cidade
                <input
                  type="text"
                  value={novaIgrejaAdmin.cidade}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      cidade: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={novaIgrejaAdmin.estado}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      estado: event.target.value,
                    })
                  }
                >
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BRASIL.map((estado) => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla} - {estado.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Bairro
                <input
                  type="text"
                  value={novaIgrejaAdmin.bairro}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      bairro: event.target.value,
                    })
                  }
                />
              </label>

              <label className="campo-sede-filiada">
                Endereço da igreja
                <input
                  type="text"
                  value={novaIgrejaAdmin.endereco}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      endereco: event.target.value,
                    })
                  }
                  placeholder="Rua ou avenida"
                />
              </label>

              <label>
                Número
                <input
                  type="text"
                  value={novaIgrejaAdmin.numero_endereco}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      numero_endereco: event.target.value,
                    })
                  }
                  placeholder="Ex: 146"
                />
              </label>

              <label className="campo-sede-filiada">
                Complemento
                <input
                  type="text"
                  value={novaIgrejaAdmin.complemento_endereco}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      complemento_endereco: event.target.value,
                    })
                  }
                  placeholder="Opcional"
                />
              </label>

              <label>
                CEP da igreja
                <input
                  type="text"
                  value={novaIgrejaAdmin.cep}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      cep: event.target.value,
                    })
                  }
                  placeholder="Ex: 36000-000"
                />
              </label>

              <label>
                Tipo de igreja
                <select
                  value={novaIgrejaAdmin.tipo_igreja}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      tipo_igreja: event.target.value,
                    })
                  }
                >
                  <option value="sede">Sede</option>
                  <option value="congregacao">Congregação</option>
                </select>
              </label>

              {novaIgrejaAdmin.tipo_igreja === 'congregacao' && (
                <>
                  <label>
                    Sede filiada
                    <input
                      type="text"
                      value={novaIgrejaAdmin.sede_filiada_nome}
                      onChange={(event) =>
                        setNovaIgrejaAdmin({
                          ...novaIgrejaAdmin,
                          sede_filiada_nome: event.target.value,
                        })
                      }
                      placeholder="Ex: Assembleia de Deus Sede"
                    />
                  </label>

                  <label className="campo-sede-filiada">
                    Endereço da sede
                    <input
                      type="text"
                      value={novaIgrejaAdmin.sede_filiada_endereco}
                      onChange={(event) =>
                        setNovaIgrejaAdmin({
                          ...novaIgrejaAdmin,
                          sede_filiada_endereco: event.target.value,
                        })
                      }
                      placeholder="Rua ou avenida da sede"
                    />
                  </label>

                  <label>
                    Número da sede
                    <input
                      type="text"
                      value={novaIgrejaAdmin.sede_filiada_numero}
                      onChange={(event) =>
                        setNovaIgrejaAdmin({
                          ...novaIgrejaAdmin,
                          sede_filiada_numero: event.target.value,
                        })
                      }
                      placeholder="Ex: 100"
                    />
                  </label>

                  <label className="campo-sede-filiada">
                    Complemento da sede
                    <input
                      type="text"
                      value={novaIgrejaAdmin.sede_filiada_complemento}
                      onChange={(event) =>
                        setNovaIgrejaAdmin({
                          ...novaIgrejaAdmin,
                          sede_filiada_complemento: event.target.value,
                        })
                      }
                      placeholder="Opcional"
                    />
                  </label>

                  <label>
                    CEP da sede
                    <input
                      type="text"
                      value={novaIgrejaAdmin.sede_filiada_cep}
                      onChange={(event) =>
                        setNovaIgrejaAdmin({
                          ...novaIgrejaAdmin,
                          sede_filiada_cep: event.target.value,
                        })
                      }
                      placeholder="Ex: 36000-000"
                    />
                  </label>
                </>
              )}

              <label>
                Telefone da igreja
                <input
                  type="text"
                  value={novaIgrejaAdmin.telefone}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      telefone: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                E-mail da igreja
                <input
                  type="email"
                  value={novaIgrejaAdmin.email}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Responsável
                <input
                  type="text"
                  value={novaIgrejaAdmin.responsavel_nome}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      responsavel_nome: event.target.value,
                    })
                  }
                  placeholder="Nome da secretaria responsável"
                />
              </label>

              <label>
                E-mail do responsável
                <input
                  type="email"
                  value={novaIgrejaAdmin.responsavel_email}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      responsavel_email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                WhatsApp do responsável
                <input
                  type="text"
                  value={novaIgrejaAdmin.responsavel_whatsapp}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      responsavel_whatsapp: event.target.value,
                    })
                  }
                  placeholder="Ex: 27 99999-9999"
                />
              </label>

              <label>
                Limite de usuários
                <input
                  type="number"
                  min="1"
                  value={novaIgrejaAdmin.limite_usuarios}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      limite_usuarios: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Início do acompanhamento
                <input
                  type="date"
                  value={novaIgrejaAdmin.data_inicio_piloto}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      data_inicio_piloto: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Fim do acompanhamento
                <input
                  type="date"
                  value={novaIgrejaAdmin.data_fim_piloto}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      data_fim_piloto: event.target.value,
                    })
                  }
                />
              </label>

              <label className="campo-observacoes-admin">
                Observações internas
                <input
                  type="text"
                  value={novaIgrejaAdmin.observacoes_piloto}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      observacoes_piloto: event.target.value,
                    })
                  }
                  placeholder="Ex: igreja em implantação ou acompanhamento inicial"
                />
              </label>
            </div>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {igrejaAdminEditandoId ? 'Salvar alterações' : 'Salvar igreja'}
              </button>

              <button
                className="botao-secundario"
                type="button"
                onClick={limparFormularioIgrejaAdmin}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="filtros filtros-admin">
          <label>
            Buscar igreja
            <input
              type="text"
              value={buscaIgrejaAdmin}
              onChange={(event) => setBuscaIgrejaAdmin(event.target.value)}
              placeholder="Buscar por igreja, congregação, responsável ou e-mail"
            />
          </label>

          <button className="botao-secundario" onClick={carregarIgrejasAdmin}>
            Atualizar lista
          </button>
        </div>

        <div className="lista lista-admin-igrejas">
          {igrejasFiltradas.map((igreja) => (
            <div className="item-lista item-com-acoes igreja-admin-card" key={igreja.id}>
              <div>
                <div className="linha-titulo-admin">
                  <h3>{igreja.nome_igreja}</h3>
                  <span className={`status-piloto status-${igreja.status_piloto || 'teste'}`}>
                    {igreja.status_piloto === 'teste'
                      ? 'Em uso'
                      : igreja.status_piloto === 'ativa'
                        ? 'Ativa'
                        : igreja.status_piloto === 'pendente'
                          ? 'Pendente'
                          : igreja.status_piloto === 'pausada'
                            ? 'Pausada'
                            : igreja.status_piloto === 'cancelada'
                              ? 'Cancelada'
                              : 'Em uso'}
                  </span>
                  {igreja.status_piloto === 'pendente' && (
                    <span className="selo-aguardando-aprovacao">
                      aguardando decisão
                    </span>
                  )}
                </div>

                {igreja.congregacao && <p>Congregação: {igreja.congregacao}</p>}
                {igreja.pastor_dirigente && <p>Dirigente: {igreja.pastor_dirigente}</p>}
                <div className="dados-igreja-admin">
                  <p>
                    Tipo:{' '}
                    <strong>
                      {igreja.tipo_igreja === 'sede' ? 'Sede' : 'Congregação'}
                    </strong>
                  </p>

                  {(igreja.cidade || igreja.estado) && (
                    <p>
                      Local: {igreja.cidade}
                      {igreja.estado ? `/${igreja.estado}` : ''}
                    </p>
                  )}

                  {(igreja.endereco || igreja.bairro || igreja.cep) && (
                    <p>
                      Endereço: {igreja.endereco}
                      {igreja.numero_endereco ? `, nº ${igreja.numero_endereco}` : ''}
                      {igreja.complemento_endereco ? `, ${igreja.complemento_endereco}` : ''}
                      {igreja.bairro ? `, ${igreja.bairro}` : ''}
                      {igreja.cep ? ` - CEP ${igreja.cep}` : ''}
                    </p>
                  )}

                  {igreja.tipo_igreja === 'congregacao' && igreja.sede_filiada_nome && (
                    <p>
                      Sede filiada: <strong>{igreja.sede_filiada_nome}</strong>
                    </p>
                  )}

                  {igreja.tipo_igreja === 'congregacao' && igreja.sede_filiada_endereco && (
                    <p>
                      Endereço da sede: {igreja.sede_filiada_endereco}
                      {igreja.sede_filiada_numero ? `, nº ${igreja.sede_filiada_numero}` : ''}
                      {igreja.sede_filiada_complemento ? `, ${igreja.sede_filiada_complemento}` : ''}
                      {igreja.sede_filiada_cep ? ` - CEP ${igreja.sede_filiada_cep}` : ''}
                    </p>
                  )}
                </div>

                {igreja.responsavel_nome && <p>Responsável: {igreja.responsavel_nome}</p>}
                {igreja.responsavel_email && <p>E-mail: {igreja.responsavel_email}</p>}
                {igreja.responsavel_whatsapp && <p>WhatsApp: {igreja.responsavel_whatsapp}</p>}
                <p>Usuários vinculados: {contarAcessosDaIgreja(igreja.id)}</p>
                {(igreja.data_inicio_piloto || igreja.data_fim_piloto) && (
                  <p>
                    Acompanhamento: {igreja.data_inicio_piloto || 'sem início'} até{' '}
                    {igreja.data_fim_piloto || 'sem fim'}
                  </p>
                )}
              </div>

              <div className="acoes-item acoes-aprovacao-igreja">
                {igreja.status_piloto === 'pendente' && (
                  <div className="grupo-aprovacao-rapida">
                    <button
                      className="botao-aprovar-igreja"
                      onClick={() => aprovarIgrejaPiloto(igreja)}
                    >
                      Aprovar
                    </button>

                    <button
                      className="botao-nao-aprovar-igreja"
                      onClick={() => naoAprovarIgrejaPiloto(igreja)}
                    >
                      Não aprovar
                    </button>
                  </div>
                )}

                {igreja.status_piloto !== 'pendente' && igreja.status_piloto !== 'teste' && (
                  <button
                    className="botao-aprovar-igreja"
                    onClick={() => aprovarIgrejaPiloto(igreja)}
                  >
                    Liberar uso
                  </button>
                )}

                {igreja.status_piloto === 'teste' && (
                  <div className="grupo-aviso-aprovacao">
                    <button
                      className="botao-whatsapp-admin"
                      onClick={() => abrirWhatsAppAprovacao(igreja)}
                    >
                      Avisar WhatsApp
                    </button>

                    <button
                      className="botao-copiar-admin"
                      onClick={() => copiarMensagemAprovacao(igreja)}
                    >
                      Copiar mensagem
                    </button>
                  </div>
                )}

                <button type="button" className="botao-acessar-igreja" onClick={(event) => acessarIgrejaComoSuporte(igreja, event)}>
                  Acessar igreja
                </button>

                <button type="button" className="botao-principal" onClick={() => abrirNovoAcessoAdmin(igreja)}>
                  Vincular acesso
                </button>

                <button
                  className="botao-secundario botao-usuarios-vinculados"
                  type="button"
                  onClick={() => alternarUsuariosDaIgreja(igreja.id)}
                >
                  {Number(igrejaUsuariosAbertaId) === Number(igreja.id)
                    ? 'Ocultar usuários'
                    : `Usuários vinculados (${contarAcessosDaIgreja(igreja.id)})`}
                </button>

                <button type="button" className="botao-editar" onClick={() => editarIgrejaAdmin(igreja)}>
                  Editar dados
                </button>

                <button type="button" className="botao-excluir" onClick={() => excluirIgrejaAdmin(igreja)}>
                  Excluir
                </button>
              </div>

              {Number(igrejaUsuariosAbertaId) === Number(igreja.id) &&
                renderizarUsuariosVinculadosIgreja(igreja)}
            </div>
          ))}

          {igrejasFiltradas.length === 0 && (
            <div className="aviso">
              <p>Nenhuma igreja encontrada.</p>
            </div>
          )}
        </div>
          </>
        )}
      </section>
    )
  }

  function renderizarManualUsuario() {
    const passosManual = [
      {
        numero: '01',
        titulo: 'Confira os dados da igreja',
        texto:
          'Antes de começar, confira nome da igreja, congregação, dirigente, superintendente, endereço, telefone e e-mail. Esses dados aparecem nos relatórios e PDFs.',
        local: 'Painel ou Configurações',
      },
      {
        numero: '02',
        titulo: 'Cadastre as classes da EBD',
        texto:
          'Crie as turmas da Escola Bíblica Dominical e mantenha nomes claros, como Crianças, Adolescentes, Jovens, Adultos ou Novos Convertidos.',
        local: 'Menu Classes',
      },
      {
        numero: '03',
        titulo: 'Cadastre alunos e professores',
        texto:
          'Inclua alunos em suas classes e cadastre professores como professores da EBD. Depois vincule cada professor à classe correta.',
        local: 'Menus Alunos, Professores ou Classes',
      },
      {
        numero: '04',
        titulo: 'Faça a chamada dos alunos',
        texto:
          'Na data da EBD, selecione a classe, marque Presente ou Faltou para cada aluno e preencha visitantes, Bíblias, revistas e ofertas.',
        local: 'Menu Chamada',
      },
      {
        numero: '05',
        titulo: 'Faça a chamada dos professores',
        texto:
          'Registre também a presença, falta ou justificativa dos professores. Essa chamada aparece no relatório junto com os dados da EBD.',
        local: 'Menu Chamada',
      },
      {
        numero: '06',
        titulo: 'Gere relatórios e PDFs',
        texto:
          'Após salvar as chamadas, gere o relatório da Escola Bíblica Dominical, imprima, salve em PDF ou baixe o arquivo pelo sistema.',
        local: 'Menu Relatórios',
      },
      {
        numero: '07',
        titulo: 'Corrija chamadas feitas por engano',
        texto:
          'Se uma chamada foi feita como teste ou em data fictícia, use o Histórico de chamadas para localizar e excluir somente aquele registro.',
        local: 'Relatórios > Histórico de chamadas',
      },
      {
        numero: '08',
        titulo: 'Acompanhe aniversariantes',
        texto:
          'Veja os aniversariantes da semana, abra o cartão individual, baixe o cartão ou envie a imagem com mensagem pelo WhatsApp quando o dispositivo permitir.',
        local: 'Painel > Aniversariantes',
      },
      {
        numero: '09',
        titulo: 'Use o atalho Fazer chamada',
        texto:
          'O botão Fazer chamada no topo do painel leva direto para a chamada, que é a ação principal do dia a dia da secretaria e dos professores.',
        local: 'Painel',
      },
      {
        numero: '10',
        titulo: 'Envie sugestão ou dúvida',
        texto:
          'Durante o uso, envie mensagem para a equipe do EBD Fiel sempre que encontrar dúvida, erro, dificuldade ou sugestão de melhoria.',
        local: 'Painel > Enviar sugestão',
      },
      {
        numero: '11',
        titulo: 'Volte ao painel quando precisar',
        texto:
          'Em qualquer área interna, use o botão Página inicial para retornar ao painel principal da igreja sem precisar sair do sistema.',
        local: 'Topo do sistema',
      },
      {
        numero: '12',
        titulo: 'Saia com segurança',
        texto:
          'Ao terminar o uso, clique em Sair. A sessão será encerrada e a próxima pessoa precisará fazer login novamente.',
        local: 'Menu lateral',
      },
    ]

    return (
      <section className="conteudo manual-usuario-pagina">
        <div className="manual-hero">
          <div>
            <span className="selo-manual">Manual atualizado</span>
            <h2>Manual do usuário EBD Fiel</h2>
            <p>
              Guia prático para secretaria, professores e liderança usarem o sistema
              com segurança: cadastros, chamadas, relatórios, aniversariantes,
              histórico de chamadas e suporte.
            </p>
          </div>

          <div className="grupo-botoes">
            <button className="botao-principal" type="button" onClick={() => navegarParaPagina('chamada')}>
              Fazer chamada
            </button>
            <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('relatorios')}>
              Ver relatórios
            </button>
          </div>
        </div>

        <div className="manual-alerta">
          <strong>Ordem recomendada:</strong>
          <span>
            confira os dados da igreja, cadastre classes, alunos e professores,
            faça as chamadas, acompanhe aniversariantes e gere os relatórios.
          </span>
        </div>

        <div className="manual-grid">
          {passosManual.map((passo) => (
            <article className="manual-card" key={passo.numero}>
              <div className="manual-numero">{passo.numero}</div>

              <div>
                <span className="manual-local">{passo.local}</span>
                <h3>{passo.titulo}</h3>
                <p>{passo.texto}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="manual-secao-detalhada">
          <div className="manual-secao-cabecalho">
            <span className="selo-manual">Chamada dos alunos</span>
            <h3>Como registrar a chamada da classe</h3>
            <p>
              A chamada dos alunos é a rotina principal do EBD Fiel. Ela alimenta os
              relatórios de frequência, presença, ausência, visitantes, Bíblias,
              revistas e ofertas.
            </p>
          </div>

          <div className="manual-lista-passos">
            <article>
              <strong>1. Acesse Chamada</strong>
              <p>
                No menu lateral ou no atalho do painel, clique em <b>Chamada</b>.
                Selecione a aba <b>Chamada dos alunos</b>.
              </p>
            </article>

            <article>
              <strong>2. Escolha a classe e confira a data</strong>
              <p>
                Selecione a classe correta. A data é preenchida automaticamente, mas
                pode ser conferida antes de salvar.
              </p>
            </article>

            <article>
              <strong>3. Marque cada aluno</strong>
              <p>
                Use <b>Presente</b> ou <b>Faltou</b> em cada aluno. Também é possível
                marcar todos como presentes ou faltaram quando isso facilitar a rotina.
              </p>
            </article>

            <article>
              <strong>4. Salve a chamada</strong>
              <p>
                Depois de conferir os dados, clique em <b>Salvar chamada dos alunos</b>.
                O sistema mostrará uma mensagem de confirmação.
              </p>
            </article>
          </div>

          <div className="manual-observacao">
            <strong>Importante:</strong> se uma chamada for feita por engano, use o
            Histórico de chamadas em Relatórios para excluir apenas aquele registro.
          </div>
        </div>

        <div className="manual-secao-detalhada manual-secao-secretaria">
          <div className="manual-secao-cabecalho">
            <span className="selo-manual">Histórico de chamadas</span>
            <h3>Como apagar uma chamada feita como teste</h3>
            <p>
              Essa opção serve para remover uma chamada lançada por engano, como uma
              data fictícia usada em teste, sem apagar alunos, classes ou professores.
            </p>
          </div>

          <div className="manual-lista-passos">
            <article>
              <strong>1. Abra Relatórios</strong>
              <p>
                No menu principal, clique em <b>Relatórios</b> e procure a área
                <b> Histórico de chamadas</b>.
              </p>
            </article>

            <article>
              <strong>2. Localize a chamada</strong>
              <p>
                Confira a data, o tipo da chamada e a classe. Verifique com atenção
                antes de excluir.
              </p>
            </article>

            <article>
              <strong>3. Clique em Excluir chamada</strong>
              <p>
                Use o botão <b>Excluir chamada</b> somente no registro que foi feito
                por engano.
              </p>
            </article>

            <article>
              <strong>4. Confirme a exclusão</strong>
              <p>
                O sistema pedirá confirmação. Após confirmar, apenas aquela chamada
                será removida e os relatórios serão atualizados.
              </p>
            </article>
          </div>

          <div className="manual-observacao">
            <strong>Atenção:</strong> a exclusão remove somente a chamada selecionada.
            Não exclui alunos, professores, classes nem dados da igreja.
          </div>
        </div>

        <div className="manual-secao-detalhada">
          <div className="manual-secao-cabecalho">
            <span className="selo-manual">Professor</span>
            <h3>Como o professor faz a chamada da classe</h3>
            <p>
              O professor consegue registrar chamada apenas das classes em que estiver
              vinculado pela secretaria ou administração da igreja.
            </p>
          </div>

          <div className="manual-lista-passos">
            <article>
              <strong>1. Entrar no sistema</strong>
              <p>
                O professor deve acessar o sistema usando o e-mail e a senha cadastrados
                pela igreja.
              </p>
            </article>

            <article>
              <strong>2. Abrir o menu Chamada</strong>
              <p>
                Depois do login, clique em <b>Chamada</b>. O sistema mostrará somente a
                classe ou as classes vinculadas ao professor.
              </p>
            </article>

            <article>
              <strong>3. Selecionar a classe e preencher a chamada</strong>
              <p>
                Escolha a classe, marque presença ou falta para cada aluno e preencha os
                campos adicionais, como visitantes, Bíblias, revistas, ofertas e observações.
              </p>
            </article>

            <article>
              <strong>4. Conferir e salvar</strong>
              <p>
                Antes de salvar, confira a data, a classe selecionada e os totais. Depois
                clique em <b>Salvar chamada</b>. A informação ficará disponível nos
                relatórios da igreja.
              </p>
            </article>
          </div>

          <div className="manual-observacao">
            <strong>Importante:</strong> se nenhuma classe aparecer para o professor, a
            secretaria precisa verificar se ele está vinculado à classe correta.
          </div>
        </div>

        <div className="manual-secao-detalhada manual-secao-secretaria">
          <div className="manual-secao-cabecalho">
            <span className="selo-manual">Secretaria</span>
            <h3>Como vincular o professor à classe</h3>
            <p>
              Para que o professor consiga fazer chamada, ele precisa estar cadastrado e
              ligado à classe correta dentro da igreja.
            </p>
          </div>

          <div className="manual-lista-passos">
            <article>
              <strong>1. Acessar a página Classes</strong>
              <p>
                No menu principal, clique em <b>Classes</b> e localize a classe onde o
                professor atua.
              </p>
            </article>

            <article>
              <strong>2. Clicar em Novo professor</strong>
              <p>
                Dentro do card da classe, clique em <b>Novo professor</b> para cadastrar
                ou vincular o professor naquela turma.
              </p>
            </article>

            <article>
              <strong>3. Informar os dados do professor</strong>
              <p>
                Preencha o nome do professor e, quando solicitado, o e-mail de acesso.
                Confirme se a classe exibida é realmente a classe correta.
              </p>
            </article>

            <article>
              <strong>4. Salvar e conferir o vínculo</strong>
              <p>
                Depois de salvar, o nome do professor deve aparecer dentro da classe.
                Esse vínculo é o que libera a chamada daquela turma para o professor.
              </p>
            </article>
          </div>

          <div className="manual-observacao">
            <strong>Quando o professor não enxergar a classe:</strong> confira se o usuário
            dele está cadastrado como <b>professor</b>, se o e-mail está correto, se a
            classe ainda existe e se o vínculo foi salvo na classe certa.
          </div>
        </div>

        <div className="manual-secao-detalhada">
          <div className="manual-secao-cabecalho">
            <span className="selo-manual">Aniversariantes</span>
            <h3>Como usar cartões de aniversário</h3>
            <p>
              O painel mostra aniversariantes da semana e permite gerar cartões
              individuais para compartilhar ou imprimir.
            </p>
          </div>

          <div className="manual-lista-passos">
            <article>
              <strong>1. Abrir aniversariantes</strong>
              <p>
                No painel, clique em <b>Ver aniversariantes</b> ou abra a lista de
                aniversariantes da semana.
              </p>
            </article>

            <article>
              <strong>2. Ver cartão</strong>
              <p>
                Em cada pessoa, clique em <b>Ver cartão</b> para abrir o cartão individual
                com mensagem e versículo bíblico.
              </p>
            </article>

            <article>
              <strong>3. Enviar no WhatsApp</strong>
              <p>
                Use <b>Enviar imagem no WhatsApp</b>. Em dispositivos compatíveis, o
                sistema compartilha imagem e mensagem juntas.
              </p>
            </article>

            <article>
              <strong>4. Baixar ou imprimir</strong>
              <p>
                Também é possível baixar o cartão em imagem, baixar em PDF ou imprimir
                para entregar pessoalmente.
              </p>
            </article>
          </div>
        </div>

        {usuarioEhAdminSistema() && (
          <div className="manual-secao-detalhada manual-secao-secretaria">
            <div className="manual-secao-cabecalho">
              <span className="selo-manual">Administração</span>
              <h3>Diagnóstico para suporte do administrador</h3>
              <p>
                O diagnóstico é uma ferramenta de suporte disponível apenas para o
                administrador geral da plataforma. Ele ajuda a verificar carregamento,
                perfil, igreja e dados retornados pelo Supabase.
              </p>
            </div>

            <div className="manual-lista-passos">
              <article>
                <strong>1. Acesse Administração</strong>
                <p>
                  Entre com o usuário administrador geral e abra a página
                  <b> Administração</b>.
                </p>
              </article>

              <article>
                <strong>2. Execute o diagnóstico</strong>
                <p>
                  Clique em <b>Executar diagnóstico</b> para conferir e-mail, perfil,
                  igreja ID e quantidade de dados retornados.
                </p>
              </article>

              <article>
                <strong>3. Copie o resultado</strong>
                <p>
                  Use <b>Copiar diagnóstico</b>. O sistema mostra uma confirmação quando
                  o conteúdo for copiado.
                </p>
              </article>

              <article>
                <strong>4. Use no atendimento</strong>
                <p>
                  O diagnóstico ajuda a descobrir se o problema está no perfil, na igreja,
                  nas permissões ou no carregamento dos dados.
                </p>
              </article>
            </div>
          </div>
        )}

        <div className="manual-final">
          <div>
            <h3>Dica para usar bem o EBD Fiel</h3>
            <p>
              Mantenha classes, alunos e professores atualizados. Faça as chamadas na data
              correta, acompanhe aniversariantes e use o histórico para corrigir chamadas
              de teste ou lançadas por engano.
            </p>
          </div>

          <button className="botao-secundario" type="button" onClick={() => navegarParaPagina('painel')}>
            Voltar ao painel
          </button>
        </div>
      </section>
    )
  }

  function renderizarPagina() {
    if (paginaAtual === 'administracao' && !usuarioEhAdminSistema()) {
      return renderizarPainel()
    }

    if (usuarioEhAdminSistema() && !perfilUsuario?.igreja_id && paginaAtual !== 'administracao') {
      return renderizarAdministracao()
    }

    if (!usuarioEhSecretaria() && ['classes', 'professores', 'usuarios', 'configuracoes'].includes(paginaAtual)) {
      return renderizarPainel()
    }

    if (paginaAtual === 'painel') return renderizarPainel()
    if (paginaAtual === 'dashboard') return renderizarDashboardAvancado()
    if (paginaAtual === 'classes') return renderizarClasses()
    if (paginaAtual === 'alunos') return renderizarAlunos()
    if (paginaAtual === 'professores') return renderizarProfessores()
    if (paginaAtual === 'usuarios') return renderizarUsuarios()
    if (paginaAtual === 'chamada') return renderizarChamada()
    if (paginaAtual === 'relatorios') return renderizarRelatorios()
    if (paginaAtual === 'historico') return renderizarHistoricoAluno()
    if (paginaAtual === 'financeiro') return renderizarFinanceiroEbd()
    if (paginaAtual === 'backup') return renderizarBackupAuditoria()
    if (paginaAtual === 'manual') return renderizarManualUsuario()
    if (paginaAtual === 'configuracoes') return renderizarConfiguracoes()
    if (paginaAtual === 'administracao') return renderizarAdministracao()

    return renderizarPainel()
  }

  return (
    <div className={`app ${menuInternoAberto ? 'menu-interno-ativo' : ''}`}>
      <header className="topo-mobile-interno">
        <div className="marca-mobile-interna">
          <div className="logo-simbolo logo-simbolo-sidebar">
            <img
              src="/logo-oficial-ebd-fiel.png"
              alt="Logo EBD Fiel"
              className="logo-imagem"
            />
          </div>
          <div>
            <strong>EBD Fiel</strong>
            <span>Escola Bíblica Dominical</span>
          </div>
        </div>

        <button
          type="button"
          className="botao-inicio-interno"
          onClick={() => navegarParaPagina('painel')}
          aria-label="Voltar à página inicial"
        >
          <Icone nome="inicio" className="icone-svg" />
          <span>Página inicial</span>
        </button>

        <button
          type="button"
          className={`botao-menu-interno ${menuInternoAberto ? 'ativo' : ''}`}
          aria-label={menuInternoAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuInternoAberto}
          onClick={() => setMenuInternoAberto((menuAberto) => !menuAberto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {menuInternoAberto && (
        <button
          type="button"
          className="overlay-menu-interno"
          aria-label="Fechar menu lateral"
          onClick={() => setMenuInternoAberto(false)}
        />
      )}

      <aside className={`menu-lateral ${menuInternoAberto ? 'menu-lateral-aberto' : ''}`}>
        <div className="marca-sidebar">
          <div className="logo-simbolo logo-simbolo-sidebar">
            <img
              src="/logo-oficial-ebd-fiel.png"
              alt="Logo EBD Fiel"
              className="logo-imagem"
            />
          </div>
          <div>
            <h1>EBD Fiel</h1>
            <p>Gestão da Escola Bíblica</p>
          </div>

          <button
            type="button"
            className="fechar-menu-interno"
            aria-label="Fechar menu"
            onClick={() => setMenuInternoAberto(false)}
          >
            ×
          </button>
        </div>

        <nav className="menu-navegacao">
          {menu.filter(menuPermitidoParaUsuario).map((item) => (
            <button
              type="button"
              key={item.id}
              className={paginaAtual === item.id ? 'ativo' : ''}
              onClick={() => navegarParaPagina(item.id)}
            >
              <span className="icone-menu">
                <Icone nome={item.icone} className="icone-svg" />
              </span>
              <span>{item.nome}</span>
            </button>
          ))}
        </nav>

        <div className="cartao-usuario-sidebar">
          <p className="titulo-usuario-sidebar">Logado como</p>
          <strong>{sessao?.user?.email}</strong>
          <span className="selo-perfil-sidebar">
            {modoSuporteAdminAtivo() ? 'Suporte admin' : usuarioEhAdminSistema() ? 'Administrador' : usuarioEhProfessor() ? 'Professor' : 'Secretaria'}
          </span>

          <button type="button" className="botao-secundario botao-sair-sidebar" onClick={sairDoSistema}>
            <Icone nome="sair" className="icone-svg" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="area-principal">
        {modoSuporteAdminAtivo() && (
          <div className="banner-modo-suporte">
            <div>
              <span>Modo suporte ativo</span>
              <strong>
                Você está visualizando a igreja{' '}
                {igrejaSuporteAdmin?.nome_igreja ||
                  igrejaAtualPiloto?.nome_igreja ||
                  buscarNomeIgrejaParaExibicao()}
              </strong>
              <p>Você continua logado como administrador do sistema.</p>
            </div>

            <button type="button" className="botao-sair-suporte" onClick={sairDoModoSuporteAdmin}>
              Sair do modo suporte
            </button>
          </div>
        )}

        {renderizarPagina()}
      </main>
    </div>
  )
}

export default App
