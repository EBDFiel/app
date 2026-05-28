import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './App.css'
import { supabase } from './lib/supabase'

const classesIniciais = [
  { id: 1, nome: 'Jovens', professor: 'Ev. Lucas' },
  { id: 2, nome: 'Adultos', professor: 'Pr. Carlos' },
  { id: 3, nome: 'CrianÃ§as', professor: 'IrmÃ£ Ana' },
]

const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'AmapÃ¡' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'CearÃ¡' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'EspÃ­rito Santo' },
  { sigla: 'GO', nome: 'GoiÃ¡s' },
  { sigla: 'MA', nome: 'MaranhÃ£o' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'ParÃ¡' },
  { sigla: 'PB', nome: 'ParaÃ­ba' },
  { sigla: 'PR', nome: 'ParanÃ¡' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'PiauÃ­' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'RondÃ´nia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'SÃ£o Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
]


const alunosIniciais = [
  { id: 1, nome: 'Pedro Silva', classeId: 1, telefone: '(11) 99999-0000', dataNascimento: '', tipoPessoa: 'aluno' },
  { id: 2, nome: 'Maria Souza', classeId: 2, telefone: '', dataNascimento: '', tipoPessoa: 'aluno' },
  { id: 3, nome: 'JoÃ£o Santos', classeId: 3, telefone: '(11) 98888-1111', dataNascimento: '', tipoPessoa: 'aluno' },
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

function App() {
  const [paginaAtual, setPaginaAtual] = useState('painel')
  const [carregando, setCarregando] = useState(true)
  const [erroSistema, setErroSistema] = useState('')

  const [sessao, setSessao] = useState(null)
  const [verificandoSessao, setVerificandoSessao] = useState(true)
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

  const [classes, setClasses] = useState([])
  const [alunos, setAlunos] = useState([])
  const [chamadasSalvas, setChamadasSalvas] = useState([])
  const [chamadasProfessores, setChamadasProfessores] = useState([])
  const [igrejaAtualPiloto, setIgrejaAtualPiloto] = useState(null)
  const [feedbackPiloto, setFeedbackPiloto] = useState({
    tipo: 'sugestao',
    mensagem: '',
  })
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
  const [igrejaSuporteAdmin, setIgrejaSuporteAdmin] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    try {
      return JSON.parse(window.localStorage.getItem('ebdfiel_igreja_suporte_admin') || 'null')
    } catch {
      return null
    }
  })
  const [igrejasAdmin, setIgrejasAdmin] = useState([])
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

  const [mostrarFormularioAluno, setMostrarFormularioAluno] = useState(false)
  const [alunoEditandoId, setAlunoEditandoId] = useState(null)
  const [novoAluno, setNovoAluno] = useState({
    nome: '',
    classeId: '',
    telefone: '',
    dataNascimento: '',
    tipoPessoa: 'aluno',
  })

  const [buscaAluno, setBuscaAluno] = useState('')
  const [filtroClasseAluno, setFiltroClasseAluno] = useState('')

  const [tipoChamada, setTipoChamada] = useState('alunos')
  const [classeChamadaId, setClasseChamadaId] = useState('')
  const [dataAulaChamada, setDataAulaChamada] = useState(() => new Date().toISOString().slice(0, 10))
  const [presencas, setPresencas] = useState({})
  const [presencasProfessores, setPresencasProfessores] = useState({})
  const [observacoesChamadaProfessores, setObservacoesChamadaProfessores] = useState('')
  const [dadosExtrasChamada, setDadosExtrasChamada] = useState({
    visitantes: '',
    biblias: '',
    revistas: '',
    ofertas: '',
  })

  const menu = [
    { id: 'painel', nome: 'Painel', icone: 'painel' },
    { id: 'classes', nome: 'Classes', icone: 'classes', apenasSecretaria: true },
    { id: 'alunos', nome: 'Alunos', icone: 'alunos' },
    { id: 'professores', nome: 'Professores', icone: 'usuarios', apenasSecretaria: true },
    { id: 'usuarios', nome: 'UsuÃ¡rios', icone: 'usuarios', apenasSecretaria: true },
    { id: 'chamada', nome: 'Chamada', icone: 'chamada' },
    { id: 'relatorios', nome: 'RelatÃ³rios', icone: 'relatorios' },
    { id: 'manual', nome: 'Manual do usuÃ¡rio', icone: 'relatorios' },
    {
      id: 'configuracoes',
      nome: 'ConfiguraÃ§Ãµes',
      icone: 'configuracoes',
      apenasSecretaria: true,
    },
    {
      id: 'administracao',
      nome: 'AdministraÃ§Ã£o',
      icone: 'configuracoes',
      apenasAdminSistema: true,
    },
  ]

  useEffect(() => {
    iniciarCorrecaoGlobalDeAcentos()

    iniciarAutenticacao()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSessao(session)

      if (event === 'PASSWORD_RECOVERY') {
        setTelaPublica('novaSenha')
        setCarregando(false)
        setVerificandoSessao(false)
        return
      }

      if (!session) {
        limparDadosDoSistema()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function iniciarAutenticacao() {
    setVerificandoSessao(true)
    setCarregando(true)

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setSessao(data.session)

      if (data.session) {
        await carregarDadosOnline(data.session)
      } else {
        limparDadosDoSistema()
      }
    } catch (error) {
      console.error('Erro ao verificar sessÃ£o:', error)
      setErroSistema('Erro ao verificar login.')
    } finally {
      setVerificandoSessao(false)
      setCarregando(false)
    }
  }

  function limparDadosDoSistema() {
    setClasses([])
    setAlunos([])
    setChamadasSalvas([])
    setChamadasProfessores([])
    setPerfilUsuario(null)
    setPerfisIgreja([])
    setVinculosProfessores([])
    setIgrejaId(null)
    setIgrejaSuporteAdmin(null)

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
      setErroCadastroPiloto('CÃ³digo do piloto invÃ¡lido. Confira o cÃ³digo informado no grupo.')
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
      setErroCadastroPiloto('Informe o DDD com 2 nÃºmeros.')
      return
    }

    if (telefoneNumero.length < 8) {
      setErroCadastroPiloto('Informe o nÃºmero de telefone/WhatsApp.')
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
      setErroCadastroPiloto('A confirmaÃ§Ã£o de senha nÃ£o confere.')
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
      setErroCadastroPiloto('Informe a sede Ã  qual a congregaÃ§Ã£o Ã© filiada.')
      return
    }

    setCarregandoCadastroPiloto(true)

    try {
      const { data: vagasDisponiveis, error: erroVagasDisponiveis } = await supabase.rpc(
        'vagas_piloto_disponiveis'
      )

      if (!erroVagasDisponiveis && Number(vagasDisponiveis) <= 0) {
        setErroCadastroPiloto(
          'O limite inicial de 10 igrejas para o teste piloto jÃ¡ foi atingido. Aguarde a liberaÃ§Ã£o de novas vagas.'
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
            'Seu usuÃ¡rio foi criado. Confira seu e-mail para confirmar o cadastro e depois faÃ§a login.'
          )
          return
        }

        sessaoCadastro = loginCadastro.session
        usuarioCadastro = loginCadastro.user
      }

      if (!usuarioCadastro?.id || !sessaoCadastro) {
        setSucessoCadastroPiloto(
          'Seu usuÃ¡rio foi criado. Confira seu e-mail para confirmar o cadastro e depois faÃ§a login.'
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

      setSucessoCadastroPiloto(
        'Cadastro enviado com sucesso! Sua igreja estÃ¡ aguardando aprovaÃ§Ã£o do administrador.'
      )
      setUltimoCadastroPilotoEnviado({
        nomeIgreja: cadastroPiloto.nomeIgreja.trim(),
        responsavel: cadastroPiloto.nomeResponsavel.trim(),
        email: emailCadastro,
      })
      setEmailLogin(emailCadastro)
      setSenhaLogin('')
      setTelaPublica('cadastroEnviado')
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)

      if (
        String(error?.message || '').includes('limite_piloto_atingido') ||
        String(error?.details || '').includes('limite_piloto_atingido')
      ) {
        setErroCadastroPiloto(
          'O limite inicial de 10 igrejas para o teste piloto jÃ¡ foi atingido. Aguarde a liberaÃ§Ã£o de novas vagas.'
        )
      } else if (
        String(error?.message || '').includes('usuario_ja_possui_perfil') ||
        String(error?.details || '').includes('usuario_ja_possui_perfil')
      ) {
        setErroCadastroPiloto(
          'Este e-mail jÃ¡ iniciou um cadastro anteriormente. Use â€œEsqueci minha senhaâ€ para recuperar o acesso ou fale com o administrador para concluir o vÃ­nculo.'
        )
      } else {
        setErroCadastroPiloto(
          traduzirErroSistema(error, 'NÃ£o foi possÃ­vel criar o acesso do piloto.')
        )
      }
    } finally {
      setCarregandoCadastroPiloto(false)
    }
  }

  async function enviarLinkRecuperacaoSenha(event) {
    event.preventDefault()

    const email = emailRecuperacao.trim().toLowerCase()

    setErroRecuperacao('')
    setMensagemRecuperacao('')

    if (!email) {
      setErroRecuperacao('Informe seu e-mail para receber o link de recuperaÃ§Ã£o.')
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
        'Link de recuperaÃ§Ã£o enviado. Confira sua caixa de entrada e tambÃ©m a pasta de spam.'
      )
    } catch (error) {
      console.error(error)
      setErroRecuperacao(
        traduzirErroSistema(error, 'NÃ£o foi possÃ­vel enviar o link de recuperaÃ§Ã£o.')
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
      setErroNovaSenha('A confirmaÃ§Ã£o da nova senha nÃ£o confere.')
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
      setSessao(null)
      setTelaPublica('login')
    } catch (error) {
      console.error(error)
      setErroNovaSenha(
        traduzirErroSistema(error, 'NÃ£o foi possÃ­vel atualizar a senha.')
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

      setSessao(data.session)
      setEmailLogin('')
      setSenhaLogin('')

      await carregarDadosOnline(data.session)
    } catch (error) {
      console.error('Erro ao entrar:', error)
      setErroLogin('E-mail ou senha invÃ¡lidos.')
    } finally {
      setCarregandoLogin(false)
    }
  }

  async function sairDoSistema() {
    const confirmar = window.confirm('Deseja sair do sistema?')

    if (!confirmar) {
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erro ao sair:', error)
      alert('Erro ao sair do sistema.')
      return
    }

    setSessao(null)
    limparDadosDoSistema()
  }

  async function carregarDadosOnline(sessaoAtual = sessao) {
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
          setSessao(sessaoParaUsar)
        }
      }

      await buscarTodosOsDados(sessaoParaUsar)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setErroSistema(
        error?.message ||
          'NÃ£o foi possÃ­vel carregar os dados do Supabase.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function inserirDadosIniciais(igrejaAtualId, sessaoAtual = sessao) {
    if (!igrejaAtualId) {
      throw new Error('Igreja nÃ£o identificada para criar os dados iniciais.')
    }

    const classesParaSalvar = classesIniciais.map((classe) => ({
      id: classe.id,
      igreja_id: igrejaAtualId,
      user_id: sessaoAtual?.user?.id,
      nome: classe.nome,
      professor: classe.professor,
    }))

    const alunosParaSalvar = alunosIniciais.map((aluno) => ({
      id: aluno.id,
      igreja_id: igrejaAtualId,
      user_id: sessaoAtual?.user?.id,
      nome: aluno.nome,
      classe_id: aluno.classeId,
      telefone: aluno.telefone,
      data_nascimento: aluno.dataNascimento || null,
      tipo_pessoa: aluno.tipoPessoa || 'aluno',
    }))

    const { error: erroClasses } = await supabase
      .from('classes')
      .upsert(classesParaSalvar)

    if (erroClasses) {
      throw erroClasses
    }

    const { error: erroAlunos } = await supabase
      .from('alunos')
      .upsert(alunosParaSalvar)

    if (erroAlunos) {
      throw erroAlunos
    }
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
    return perfilUsuario?.perfil === 'professor'
  }

  function buscarIgrejaIdAtual() {
    return perfilUsuario?.igreja_id || igrejaId || null
  }

  function navegarParaPagina(paginaId) {
    setPaginaAtual(paginaId)

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

  const emailsAdminSistema = [
    'gallianoalves@gmail.com',
    'galliano.alves@gmail.com',
    'ebdbetel7@gmail.com',
    'ebdfiel7@gmail.com',
  ]

  function usuarioEhAdminSistema() {
    return emailsAdminSistema.includes(String(sessao?.user?.email || '').toLowerCase())
  }

  function buscarIgrejaSuporteAdminSalva() {
    if (igrejaSuporteAdmin?.id) {
      return igrejaSuporteAdmin
    }

    if (typeof window === 'undefined') {
      return null
    }

    try {
      return JSON.parse(window.localStorage.getItem('ebdfiel_igreja_suporte_admin') || 'null')
    } catch {
      return null
    }
  }

  async function acessarIgrejaComoSuporte(igreja) {
    if (!usuarioEhAdminSistema()) {
      alert('Apenas administradores do sistema podem acessar igrejas em modo suporte.')
      return
    }

    const igrejaSelecionada = {
      id: Number(igreja.id),
      nome_igreja: igreja.nome_igreja || igreja.nome || 'Igreja',
      congregacao: igreja.congregacao || '',
      status_piloto: igreja.status_piloto || '',
    }

    setIgrejaSuporteAdmin(igrejaSelecionada)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'ebdfiel_igreja_suporte_admin',
        JSON.stringify(igrejaSelecionada)
      )
    }

    setPaginaAtual('painel')
    await buscarTodosOsDados(sessao, igrejaSelecionada)
  }

  async function sairDoModoSuporteAdmin() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ebdfiel_igreja_suporte_admin')
    }

    setIgrejaSuporteAdmin(null)
    setClasses([])
    setAlunos([])
    setChamadasSalvas([])
    setChamadasProfessores([])
    setVinculosProfessores([])
    setIgrejaId(null)
    setIgrejaAtualPiloto(null)

    const emailSessaoAtual = String(sessao?.user?.email || '').toLowerCase()

    setPerfilUsuario({
      id: null,
      user_id: sessao?.user?.id,
      nome: 'Administrador do sistema',
      email: emailSessaoAtual,
      perfil: 'admin',
      igreja_id: null,
      classe_id: null,
    })

    setPaginaAtual('administracao')
    await carregarIgrejasAdmin()
  }

  function modoSuporteAdminAtivo() {
    return usuarioEhAdminSistema() && Boolean(perfilUsuario?.modo_suporte_admin || igrejaSuporteAdmin?.id)
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
        traduzirErroSistema(error, 'NÃ£o foi possÃ­vel carregar os cadastros incompletos.')
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
      alert('Informe o nome do usuÃ¡rio.')
      return
    }

    if (!novoAcessoAdmin.email.trim()) {
      alert('Informe o e-mail do usuÃ¡rio.')
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
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel salvar o acesso.')
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
      `Deseja remover o acesso de ${acesso.nome || acesso.email}? O usuÃ¡rio continuarÃ¡ existindo no Authentication, mas ficarÃ¡ sem vÃ­nculo no sistema.`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase
      .from('perfis_usuarios')
      .delete()
      .eq('user_id', acesso.user_id)

    if (error) {
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel remover o acesso.')
      return
    }

    await carregarAcessosAdmin()
  }

  async function enviarRecuperacaoSenhaAdmin(email) {
    if (!email) {
      alert('Este usuÃ¡rio nÃ£o possui e-mail cadastrado.')
      return
    }

    const confirmar = window.confirm(
      `Enviar link de recuperaÃ§Ã£o de senha para ${email}?`
    )

    if (!confirmar) {
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    if (error) {
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel enviar o link de recuperaÃ§Ã£o de senha.')
      return
    }

    alert('Link de recuperaÃ§Ã£o enviado. PeÃ§a para o usuÃ¡rio conferir o e-mail.')
  }

  async function carregarIgrejasAdmin() {
    if (!usuarioEhAdminSistema()) {
      return
    }

    const { data, error } = await supabase
      .from('igrejas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      mostrarErroSistema(error, 'Erro ao carregar igrejas do piloto.')
      return
    }

    setIgrejasAdmin(data || [])
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
      `Deseja realmente excluir a igreja ${igreja.nome_igreja}? Esta aÃ§Ã£o pode apagar os dados vinculados.`
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
        ? 'aprovar esta igreja para o teste piloto'
        : novoStatus === 'cancelada'
          ? 'nÃ£o aprovar esta igreja'
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
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel alterar o status da igreja.')
      return
    }

    await carregarIgrejasAdmin()

    if (novoStatus === 'teste') {
      const avisarAgora = window.confirm(
        'Igreja aprovada para o teste piloto. Deseja abrir o WhatsApp com uma mensagem pronta para avisar o responsÃ¡vel?'
      )

      if (avisarAgora) {
        abrirWhatsAppAprovacao({ ...igreja, status_piloto: 'teste' })
      }
    }

    if (novoStatus === 'cancelada') {
      alert('Igreja marcada como nÃ£o aprovada.')
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

O cadastro da ${nomeIgreja} no teste piloto do EBD Fiel foi aprovado.

Acesse o sistema pelo link:

https://app.ebdfiel.com.br

Entre com o e-mail e a senha cadastrados no momento da inscriÃ§Ã£o.

Manual rÃ¡pido para comeÃ§ar:

1. Confira os dados da igreja no painel.
2. VÃ¡ em Classes e cadastre as turmas da EBD.
3. VÃ¡ em Alunos ou entre em uma classe para cadastrar os alunos.
4. VÃ¡ em Professores para cadastrar os professores da EBD.
5. Vincule os professores Ã s classes correspondentes.
6. VÃ¡ em Chamada para registrar a presenÃ§a dos alunos.
7. Use Chamada dos professores para registrar a presenÃ§a dos professores.
8. Em RelatÃ³rios, gere o relatÃ³rio da EBD em PDF.
9. Durante o teste piloto, use a Ã¡rea de Feedback para enviar sugestÃµes, dÃºvidas ou dificuldades.

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
      alert('Esta igreja nÃ£o possui WhatsApp cadastrado. Use o botÃ£o â€œCopiar mensagemâ€.')
      return
    }

    const numeroComPais = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`
    window.open(`https://wa.me/${numeroComPais}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  async function copiarMensagemAprovacao(igreja) {
    const mensagem = gerarMensagemAprovacaoIgreja(igreja)

    try {
      await navigator.clipboard.writeText(mensagem)
      alert('Mensagem de aprovaÃ§Ã£o copiada.')
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
      `Nome: ${acesso.nome || contato.responsavel || 'NÃ£o informado'}`,
      `E-mail de acesso: ${acesso.email || 'NÃ£o informado'}`,
      `Igreja: ${buscarNomeIgrejaAdmin(acesso.igreja_id)}`,
      `ResponsÃ¡vel: ${contato.responsavel || 'NÃ£o informado'}`,
      `WhatsApp: ${contato.whatsapp || 'NÃ£o informado'}`,
      `Telefone: ${contato.telefone || 'NÃ£o informado'}`,
      `E-mail da igreja/responsÃ¡vel: ${contato.email || 'NÃ£o informado'}`,
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
      alert('NÃ£o hÃ¡ WhatsApp/telefone cadastrado para este acesso.')
      return
    }

    const numeroComPais = numero.startsWith('55') ? numero : `55${numero}`
    const mensagem = encodeURIComponent(
      `Paz do Senhor! Aqui Ã© o suporte do EBD Fiel. Estou entrando em contato sobre o acesso da igreja ${buscarNomeIgrejaAdmin(acesso.igreja_id)}.`
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

  function traduzirErroSistema(erro, mensagemPadrao = 'NÃ£o foi possÃ­vel concluir a operaÃ§Ã£o.') {
    const mensagemOriginal =
      typeof erro === 'string'
        ? erro
        : erro?.message || erro?.error_description || mensagemPadrao

    const mensagem = String(mensagemOriginal || '').toLowerCase()

    if (mensagem.includes('could not find') && mensagem.includes('column')) {
      const colunaEncontrada = String(mensagemOriginal).match(/'([^']+)' column/)
      const tabelaEncontrada = String(mensagemOriginal).match(/of '([^']+)'/)

      const coluna = colunaEncontrada?.[1] || 'necessÃ¡ria'
      const tabela = tabelaEncontrada?.[1] || 'do banco de dados'

      return `O campo "${coluna}" ainda nÃ£o existe na tabela "${tabela}" do Supabase. Rode o SQL de atualizaÃ§Ã£o do banco, aguarde alguns segundos e tente novamente.`
    }

    if (mensagem.includes('schema cache')) {
      return 'O Supabase ainda estÃ¡ atualizando o cache do banco de dados. Aguarde alguns segundos, aperte Ctrl + F5 e tente novamente.'
    }

    if (mensagem.includes('duplicate key') || mensagem.includes('already exists')) {
      return 'Esse cadastro jÃ¡ existe. Verifique os dados informados e tente novamente.'
    }

    if (mensagem.includes('violates foreign key constraint')) {
      return 'NÃ£o foi possÃ­vel salvar porque hÃ¡ uma ligaÃ§Ã£o obrigatÃ³ria faltando no banco de dados. Verifique se a igreja, classe ou usuÃ¡rio vinculado existe.'
    }

    if (mensagem.includes('violates row-level security') || mensagem.includes('row-level security')) {
      return 'VocÃª nÃ£o tem permissÃ£o para realizar esta aÃ§Ã£o. Verifique se estÃ¡ logado com o perfil correto.'
    }

    if (mensagem.includes('invalid input syntax')) {
      return 'Algum campo foi preenchido com um formato invÃ¡lido. Confira nÃºmeros, datas e campos obrigatÃ³rios.'
    }

    if (mensagem.includes('failed to fetch') || mensagem.includes('networkerror')) {
      return 'NÃ£o foi possÃ­vel conectar ao servidor. Verifique sua internet e tente novamente.'
    }

    if (mensagem.includes('jwt') || mensagem.includes('token')) {
      return 'Sua sessÃ£o expirou. Saia do sistema e entre novamente.'
    }

    if (mensagem.includes('auth')) {
      return 'NÃ£o foi possÃ­vel confirmar seu login. Saia do sistema e entre novamente.'
    }

    return mensagemPadrao
  }

  function mostrarErroSistema(erro, mensagemPadrao = 'NÃ£o foi possÃ­vel concluir a operaÃ§Ã£o.') {
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
      alert('A Ã¡rea de feedback estÃ¡ disponÃ­vel para igrejas em teste piloto.')
      return
    }

    if (!feedbackPiloto.mensagem.trim()) {
      alert('Escreva seu feedback antes de enviar.')
      return
    }

    setCarregandoFeedback(true)

    const { error } = await supabase.from('feedbacks_piloto').insert({
      igreja_id: buscarIgrejaIdAtual(),
      user_id: sessao?.user?.id || null,
      nome_usuario: perfilUsuario?.nome || sessao?.user?.email || 'UsuÃ¡rio',
      email_usuario: perfilUsuario?.email || sessao?.user?.email || '',
      perfil_usuario: perfilUsuario?.perfil || '',
      tipo: feedbackPiloto.tipo,
      mensagem: feedbackPiloto.mensagem.trim(),
      lido: false,
    })

    setCarregandoFeedback(false)

    if (error) {
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel enviar o feedback.')
      return
    }

    setFeedbackPiloto({ tipo: 'sugestao', mensagem: '' })
    await carregarFeedbacksDaIgreja()
    alert('Feedback enviado com sucesso. Obrigado por ajudar no teste piloto!')
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
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel marcar o feedback como lido.')
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
    const nome = feedback.nome_usuario || 'irmÃ£o(Ã£)'
    const resposta = feedback.resposta_admin || respostaFeedbackAdmin

    return `Paz do Senhor, ${nome}!

Obrigado pelo feedback enviado sobre o EBD Fiel.

Resposta da equipe:
${resposta}

Seguimos Ã  disposiÃ§Ã£o para ajudar no teste piloto.

EBD Fiel â€” Fiel Ã  Palavra, organizado para servir melhor.`
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
      mostrarErroSistema(error, 'NÃ£o foi possÃ­vel salvar a resposta do feedback.')
      return
    }

    setFeedbackRespondendoId(null)
    setRespostaFeedbackAdmin('')
    await carregarFeedbacksAdmin()
    alert('Resposta salva. A igreja verÃ¡ a resposta na Ã¡rea de feedback.')
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
      alert('Este feedback nÃ£o possui e-mail vinculado.')
      return
    }

    const assunto = encodeURIComponent('Resposta ao seu feedback no EBD Fiel')
    const corpo = encodeURIComponent(montarMensagemRespostaFeedback(feedback))

    await registrarNotificacaoFeedback(feedback.id)
    await carregarFeedbacksAdmin()

    window.location.href = `mailto:${emailDestino}?subject=${assunto}&body=${corpo}`
  }

  async function enviarRespostaWhatsAppFeedback(feedback) {
    const telefone = buscarWhatsAppFeedback(feedback)
    const apenasNumeros = String(telefone || '').replace(/\D/g, '')

    if (!apenasNumeros) {
      alert('NÃ£o encontrei WhatsApp/telefone vinculado a este feedback. Use o botÃ£o copiar mensagem ou enviar e-mail.')
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
    if (usuarioEhAdminSistema() && !perfilUsuario?.igreja_id) {
      return false
    }

    return perfilUsuario?.perfil !== 'professor'
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

  async function buscarTodosOsDados(sessaoAtual = sessao, igrejaSuporteForcada = null) {
    if (!sessaoAtual?.user?.id) {
      throw new Error('NÃ£o foi possÃ­vel confirmar sua sessÃ£o. Saia e entre novamente no sistema.')
    }

    const { data: perfilBanco, error: erroPerfil } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .eq('user_id', sessaoAtual.user.id)
      .maybeSingle()

    if (erroPerfil) {
      throw erroPerfil
    }

    let perfilAtual = perfilBanco
    const emailSessaoAtual = String(sessaoAtual?.user?.email || '').toLowerCase()
    const ehAdminSessaoAtual = emailsAdminSistema.includes(emailSessaoAtual)
    const igrejaSuporteSelecionada = igrejaSuporteForcada || buscarIgrejaSuporteAdminSalva()

    if (!perfilBanco?.igreja_id) {
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

        setIgrejaSuporteAdmin(igrejaSuporteSelecionada)
      } else if (ehAdminSessaoAtual) {
        const perfilAdminSistema = {
          id: null,
          user_id: sessaoAtual.user.id,
          nome: 'Administrador do sistema',
          email: emailSessaoAtual,
          perfil: 'admin',
          igreja_id: null,
          classe_id: null,
        }

        setPerfilUsuario(perfilAdminSistema)
        setIgrejaId(null)
        setClasses([])
        setAlunos([])
        setChamadasSalvas([])
        setChamadasProfessores([])
        setVinculosProfessores([])
        setPaginaAtual('administracao')

        const { data: igrejasAdminBanco, error: erroIgrejasAdmin } = await supabase
          .from('igrejas')
          .select('*')
          .order('created_at', { ascending: false })

        if (erroIgrejasAdmin) {
          throw erroIgrejasAdmin
        }

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
        throw new Error(
          'Perfil do usuÃ¡rio sem igreja vinculada. Verifique a tabela perfis_usuarios no Supabase.'
        )
      }
    }

    const igrejaAtualId = Number(perfilAtual.igreja_id)

    setPerfilUsuario(perfilAtual)
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

  function abrirRelatorioParaImpressao() {
    const relatorio = document.querySelector('.relatorio-folha')

    if (!relatorio) {
      alert('RelatÃ³rio nÃ£o encontrado para impressÃ£o.')
      return
    }

    const janela = window.open('', '_blank')

    if (!janela) {
      alert(
        'O navegador bloqueou a abertura da impressÃ£o. No celular, use o botÃ£o Baixar PDF.'
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
          <title>RelatÃ³rio EBD Fiel</title>

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
              width: Online;
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
              width: Online;
              overflow-x: visible;
            }

            table {
              width: Online;
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

  async function baixarRelatorioPDF() {
    const relatorioOriginal = document.querySelector('.relatorio-folha')

    if (!relatorioOriginal) {
      alert('RelatÃ³rio nÃ£o encontrado para gerar PDF.')
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
        tabelaContainer.style.width = 'Online'
      }

      const tabela = relatorioClone.querySelector('table')
      if (tabela) {
        tabela.style.width = 'Online'
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
      alert('NÃ£o foi possÃ­vel gerar o PDF. Tente novamente.')
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
        alert('Erro ao salvar alteraÃ§Ãµes da classe.')
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
      alert('NÃ£o Ã© possÃ­vel excluir essa classe porque existem alunos nela.')
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

  async function salvarAluno(event) {
    event.preventDefault()

    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode cadastrar ou editar alunos.')
      return
    }

    if (!novoAluno.nome.trim() || !novoAluno.classeId) {
      alert('Preencha o nome do aluno e selecione uma classe.')
      return
    }

    const alunoBanco = {
      nome: novoAluno.nome,
      classe_id: Number(novoAluno.classeId),
      telefone: novoAluno.telefone,
      data_nascimento: novoAluno.dataNascimento || null,
      tipo_pessoa: novoAluno.tipoPessoa || 'aluno',
    }

    if (alunoEditandoId) {
      const { error } = await supabase
        .from('alunos')
        .update(alunoBanco)
        .eq('id', alunoEditandoId)

      if (error) {
        console.error(error)
        alert('Erro ao salvar alteraÃ§Ãµes do aluno.')
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
  }

  async function excluirAluno(alunoId) {
    if (!podeGerenciarCadastros()) {
      alert('Apenas a secretaria pode excluir alunos.')
      return
    }

    const confirmar = window.confirm('Tem certeza que deseja excluir este aluno?')

    if (!confirmar) {
      return
    }

    const { error } = await supabase.from('alunos').delete().eq('id', alunoId)

    if (error) {
      console.error(error)
      alert('Erro ao excluir aluno.')
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
    return 'Sem marcaÃ§Ã£o'
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
    if (!classeChamadaId) {
      alert('Selecione uma classe para fazer a chamada.')
      return
    }

    const alunosDaClasse = alunos.filter(
      (aluno) => Number(aluno.classeId) === Number(classeChamadaId)
    )

    if (alunosDaClasse.length === 0) {
      alert('Essa classe ainda nÃ£o possui alunos cadastrados.')
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

  async function salvarChamada() {
    if (usuarioEhProfessor() && !professorPodeAcessarClasse(classeChamadaId)) {
      alert('Professor pode fazer chamada apenas das classes vinculadas pela secretaria.')
      return
    }

    if (!classeChamadaId) {
      alert('Selecione uma classe para fazer a chamada.')
      return
    }

    const alunosDaClasse = alunos.filter(
      (aluno) => Number(aluno.classeId) === Number(classeChamadaId)
    )

    if (alunosDaClasse.length === 0) {
      alert('Essa classe ainda nÃ£o possui alunos cadastrados.')
      return
    }

    const presencasAtuais = { ...presencas }

    const alunosSemMarcacao = alunosDaClasse.filter(
      (aluno) => !presencasAtuais[String(aluno.id)]
    )

    if (alunosSemMarcacao.length > 0) {
      alert(
        `Ainda falta marcar ${alunosSemMarcacao.length} aluno(s): ${alunosSemMarcacao
          .map((aluno) => aluno.nome)
          .join(', ')}`
      )
      return
    }

    const totalPresentes = alunosDaClasse.filter(
      (aluno) => presencasAtuais[String(aluno.id)] === 'presente'
    ).length

    const totalFaltas = alunosDaClasse.filter(
      (aluno) => presencasAtuais[String(aluno.id)] === 'faltou'
    ).length

    const visitantes = converterNumero(dadosExtrasChamada.visitantes)
    const biblias = converterNumero(dadosExtrasChamada.biblias)
    const revistas = converterNumero(dadosExtrasChamada.revistas)
    const ofertas = converterNumero(dadosExtrasChamada.ofertas)

    const chamadaBanco = {
      id: Date.now(),
      data: dataAulaChamada || buscarDataAtual(),
      igreja_id: buscarIgrejaIdAtual(),
      classe_id: Number(classeChamadaId),
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
      alert('Erro ao salvar chamada.')
      return
    }

    await buscarTodosOsDados()

    setPresencas({})
    setClasseChamadaId('')
    setDataAulaChamada(new Date().toISOString().slice(0, 10))
    setDadosExtrasChamada({
      visitantes: '',
      biblias: '',
      revistas: '',
      ofertas: '',
    })

    alert('Chamada salva com sucesso!')
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
      alert('Apenas a secretaria pode alterar as configuraÃ§Ãµes da igreja.')
      return
    }

    if (!sessao?.user?.id) {
      alert('NÃ£o foi possÃ­vel confirmar sua sessÃ£o. Saia e entre novamente no sistema.')
      return
    }

    if (!buscarIgrejaIdAtual()) {
      alert('Igreja nÃ£o identificada. Saia e entre novamente no sistema.')
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
      alert('ConfiguraÃ§Ãµes da igreja salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configuraÃ§Ãµes da igreja:', error)
      alert(error?.message || 'Erro ao salvar configuraÃ§Ãµes da igreja.')
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

  if (verificandoSessao) {
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
              <p>GestÃ£o inteligente para Escola BÃ­blica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Sistema comercial pronto para igrejas</span>
            <h2>Organize classes, alunos, chamadas e relatÃ³rios em um sÃ³ lugar.</h2>
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
          <p>Aguarde um momento enquanto conferimos sua sessÃ£o.</p>
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
              <p>RedefiniÃ§Ã£o segura de senha.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Nova senha</span>
            <h2>Crie uma nova senha de acesso.</h2>
            <p>
              Digite uma nova senha para continuar usando o sistema com seguranÃ§a.
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
              <p>RecuperaÃ§Ã£o de acesso.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Esqueci minha senha</span>
            <h2>Receba um link para redefinir sua senha.</h2>
            <p>
              Informe o e-mail usado no cadastro. O sistema enviarÃ¡ um link seguro para
              vocÃª criar uma nova senha.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-recuperacao-senha">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('login')}
          >
            â† Voltar para login
          </button>

          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="usuarios" className="icone-status" />
            </div>
            <div>
              <h2>Recuperar senha</h2>
              <p>Digite seu e-mail para receber o link de recuperaÃ§Ã£o.</p>
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
              {carregandoRecuperacao ? 'Enviando...' : 'Enviar link de recuperaÃ§Ã£o'}
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
            <span className="selo-apresentacao">Aguardando aprovaÃ§Ã£o</span>
            <h2>Sua solicitaÃ§Ã£o foi enviada.</h2>
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
              <span>ResponsÃ¡vel: {ultimoCadastroPilotoEnviado.responsavel}</span>
            )}
            {ultimoCadastroPilotoEnviado.email && (
              <span>E-mail: {ultimoCadastroPilotoEnviado.email}</span>
            )}
            <span>Status: aguardando aprovaÃ§Ã£o</span>
          </div>

          <div className="aviso-aprovacao-cadastro">
            <strong>O que acontece agora?</strong>
            <p>
              Aguarde a aprovaÃ§Ã£o do administrador. ApÃ³s a liberaÃ§Ã£o, vocÃª poderÃ¡
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
            <h2>Crie o acesso da sua igreja para avaliaÃ§Ã£o.</h2>
            <p>
              O cadastro serÃ¡ enviado para aprovaÃ§Ã£o. ApÃ³s a liberaÃ§Ã£o, a igreja poderÃ¡
              testar classes, alunos, professores, chamadas, relatÃ³rios e feedbacks.
            </p>
          </div>

          <div className="beneficios-login">
            <div className="beneficio-item">
              <Icone nome="check" className="icone-beneficio" />
              <span>CÃ³digo do piloto obrigatÃ³rio</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="igreja" className="icone-beneficio" />
              <span>Sede ou congregaÃ§Ã£o</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="usuarios" className="icone-beneficio" />
              <span>Secretaria ou superintendÃªncia</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="relatorios" className="icone-beneficio" />
              <span>AprovaÃ§Ã£o pelo administrador</span>
            </div>
          </div>
        </section>

        <section className="cartao-login cartao-cadastro-piloto">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('login')}
          >
            â† Voltar para login
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
              <h3>ResponsÃ¡vel</h3>

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
                  <option value="secretario">SecretÃ¡rio(a)</option>
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
                  placeholder="MÃ­nimo 6 caracteres"
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
                CÃ³digo do piloto
                <input
                  type="text"
                  value={cadastroPiloto.codigoPiloto}
                  onChange={(event) =>
                    setCadastroPiloto({
                      ...cadastroPiloto,
                      codigoPiloto: event.target.value,
                    })
                  }
                  placeholder="CÃ³digo informado no grupo"
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
                  <option value="congregacao">CongregaÃ§Ã£o</option>
                </select>
              </label>

              <label>
                CongregaÃ§Ã£o
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
                  placeholder="Ex: Pr. JoÃ£o Silva"
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
                EndereÃ§o
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
                NÃºmero
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
                  placeholder="Opcional: sala, fundos, referÃªncia..."
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
                    EndereÃ§o da sede
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
                    NÃºmero da sede
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
              {carregandoCadastroPiloto ? 'Enviando cadastro...' : 'Enviar cadastro para aprovaÃ§Ã£o'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (!sessao && telaPublica === 'login') {
    return (
      <div className="tela-login">
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
              <p>GestÃ£o inteligente para Escola BÃ­blica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Ãrea segura do cliente</span>
            <h2>Acesse o painel da sua igreja.</h2>
            <p>
              Entre com suas credenciais para gerenciar classes, alunos, chamadas,
              configuraÃ§Ãµes e relatÃ³rios da Escola BÃ­blica Dominical.
            </p>
          </div>

          <div className="beneficios-login">
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
              <span>RelatÃ³rios modernos</span>
            </div>
          </div>
        </section>

        <section className="cartao-login">
          <button
            className="botao-voltar-publico"
            type="button"
            onClick={() => setTelaPublica('landing')}
          >
            â† Voltar para apresentaÃ§Ã£o
          </button>

          <div className="topo-cartao-login">
            <div className="topo-cartao-icone">
              <Icone nome="usuarios" className="icone-status" />
            </div>
            <div>
              <h2>JÃ¡ foi aprovado?</h2>
              <p>Entre com seu e-mail e senha para acessar o sistema.</p>
            </div>
          </div>

          <div className="aviso-login-aprovado">
            Use o login abaixo somente se sua igreja jÃ¡ foi aprovada.
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

          <div className="bloco-criar-piloto bloco-cadastro-destaque">
            <span className="selo-primeiro-acesso">Primeiro acesso?</span>
            <h3>Cadastrar minha igreja</h3>
            <p>
              Se vocÃª recebeu o cÃ³digo do piloto, cadastre sua igreja para anÃ¡lise
              e aprovaÃ§Ã£o do administrador.
            </p>

            <button
              className="botao-cadastrar-igreja botao-largura-total"
              type="button"
              onClick={() => setTelaPublica('cadastroPiloto')}
            >
              Cadastrar minha igreja
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
              <a href="#faq">{'FAQ'}</a>
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
            {'FAQ'}
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
                  <span>{'Escola B\u00edblica Dominical'}</span>
                  {' sem planilhas e sem retrabalho'}
                </h1>

                <p>
                  {'Cadastre classes, alunos e professores, registre chamadas e gere relat\u00f3rios em PDF em uma plataforma simples para igrejas.'}
                </p>

                <button className="btn-primary" type="button" onClick={() => setTelaPublica('login')}>
                  <span>{'â†’'}</span> {'Entrar no sistema'}
                </button>

                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-number">{'10'}</div>
                    <div className="stat-label">{'Igrejas no piloto'}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{'\uD83D\uDCC4'}</div>
                    <div className="stat-label">{'Relat\u00f3rios'}</div>
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
                  <div className="mockup-check">{'\u2713'}</div>
                  <h3>{'Chamada digital'}</h3>
                  <p>{'Presen\u00e7a registrada em tempo real'}</p>

                  <hr />

                  <div className="mockup-row">
                    <span>{'24 presentes'}</span>
                    <span>{'92% frequ\u00eancia'}</span>
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
              <h2 className="section-title">{'Teste piloto'}</h2>

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
                  <div className="plan-badge">{'Popular'}</div>
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
              <a href="#faq">{'FAQ'}</a>
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

  if (carregando) {
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
              <p>GestÃ£o inteligente para Escola BÃ­blica Dominical.</p>
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
              <p>GestÃ£o da Escola BÃ­blica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Cadastro recebido</span>
            <h2>Seu acesso estÃ¡ aguardando aprovaÃ§Ã£o.</h2>
            <p>
              A equipe administradora vai conferir os dados da igreja e liberar o uso
              do sistema para o teste piloto.
            </p>
          </div>
        </section>

        <section className="cartao-login cartao-mensagem">
          <div className="mensagem-status-icone">
            <Icone nome="check" className="icone-status" />
          </div>
          <h2>Aguardando aprovaÃ§Ã£o</h2>
          <p>
            Assim que sua igreja for aprovada, vocÃª poderÃ¡ entrar normalmente e comeÃ§ar
            os testes.
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
              <p>GestÃ£o inteligente para Escola BÃ­blica Dominical.</p>
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
      return 'AmanhÃ£'
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
      alert('Apenas a secretaria pode cadastrar usuÃ¡rios.')
      return
    }

    if (!novoPerfil.userId.trim()) {
      alert('Informe o User UID do usuÃ¡rio criado no Supabase Auth.')
      return
    }

    if (!novoPerfil.nome.trim() || !novoPerfil.email.trim()) {
      alert('Informe o nome e o e-mail do usuÃ¡rio.')
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
      mostrarErroSistema(error, 'Erro ao salvar usuÃ¡rio.')
      return
    }

    const { error: erroRemoverVinculos } = await supabase
      .from('classes_professores')
      .delete()
      .eq('perfil_usuario_id', perfilSalvo.id)

    if (erroRemoverVinculos) {
      mostrarErroSistema(erroRemoverVinculos, 'Erro ao atualizar vÃ­nculos do professor.')
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
        mostrarErroSistema(erroInserirVinculos, 'Erro ao vincular professor Ã s classes.')
        return
      }
    }

    await buscarTodosOsDados()
    cancelarFormularioPerfil()
    alert('UsuÃ¡rio salvo com sucesso!')
  }

  async function excluirPerfilUsuario(perfil) {
    if (!usuarioEhSecretaria()) {
      alert('Apenas a secretaria pode excluir usuÃ¡rios.')
      return
    }

    if (perfil.user_id === sessao?.user?.id) {
      alert('VocÃª nÃ£o pode excluir o seu prÃ³prio perfil de secretaria.')
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

  function renderizarFeedbackPiloto() {
    if (!igrejaEstaEmTestePiloto()) {
      return null
    }

    return (
      <div className="feedback-piloto-card">
        <div className="feedback-piloto-topo">
          <div>
            <span className="hero-tag">Teste piloto</span>
            <h3>Enviar feedback para a equipe EBD Fiel</h3>
            <p>
              Conte o que funcionou, o que ficou confuso ou o que precisa melhorar.
              O administrador do sistema receberÃ¡ um alerta na Ã¡rea AdministraÃ§Ã£o.
            </p>
          </div>
        </div>

        <form className="feedback-piloto-form feedback-piloto-form-moderno" onSubmit={enviarFeedbackPiloto}>
          <div className="feedback-form-grid">
            <label className="feedback-campo feedback-campo-tipo">
              <span>Tipo de feedback</span>
              <select
                value={feedbackPiloto.tipo}
                onChange={(event) =>
                  setFeedbackPiloto({ ...feedbackPiloto, tipo: event.target.value })
                }
              >
                <option value="sugestao">SugestÃ£o</option>
                <option value="erro">Erro encontrado</option>
                <option value="duvida">DÃºvida</option>
                <option value="elogio">Elogio</option>
              </select>
            </label>

            <div className="feedback-dica">
              <strong>Ajude a melhorar o piloto</strong>
              <span>Descreva com detalhes o que aconteceu, onde aconteceu e o que vocÃª esperava.</span>
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
              rows="7"
            />
          </label>

          <div className="feedback-acoes">
            <button className="botao-feedback-enviar" type="submit" disabled={carregandoFeedback}>
              <span>{carregandoFeedback ? 'Enviando...' : 'Enviar feedback'}</span>
              <strong>â†’</strong>
            </button>

            <p>
              Seu feedback fica registrado para os administradores acompanharem e responderem pela prÃ³pria plataforma.
            </p>
          </div>
        </form>

        {feedbacksIgreja.length > 0 && (
          <div className="feedbacks-recentes-igreja">
            <h4>Ãšltimos feedbacks enviados</h4>

            {feedbacksIgreja.slice(0, 4).map((feedback) => (
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

  function renderizarPainel() {
    const aniversariantesDaSemana = buscarAniversariantesDaSemana()

    return (
      <section className="conteudo">
        <div className="hero-painel">
          <div className="hero-painel-conteudo">
            <div className="linha-tags-painel">
              <span className="hero-tag">Painel administrativo</span>
              <span className="hero-tag hero-tag-clara">
                {usuarioEhProfessor() ? 'Perfil: Professor' : 'Perfil: Secretaria'}
              </span>
            </div>
            <h2>{buscarNomeIgrejaParaExibicao()}</h2>
            <p>
              Controle classes, alunos, chamadas e relatÃ³rios da Escola BÃ­blica Dominical
              com uma estrutura pronta para uso e comercializaÃ§Ã£o.
            </p>

            <div className="hero-acoes">
              {usuarioEhSecretaria() && (
                <button className="botao-principal" onClick={() => navegarParaPagina('configuracoes')}>
                  Ajustar dados da igreja
                </button>
              )}
              <button className="botao-secundario" onClick={() => navegarParaPagina('relatorios')}>
                Ver relatÃ³rios
              </button>

              <button className="botao-secundario botao-manual-painel" onClick={() => navegarParaPagina('manual')}>
                Abrir manual do usuÃ¡rio
              </button>
            </div>
          </div>

          <div className="hero-painel-destaque">
            <div className="hero-icone-area">
              <Icone nome="biblia" className="icone-hero" />
            </div>
            <h3>Resumo rÃ¡pido</h3>
            <p>Dados sincronizados automaticamente no Supabase.</p>
            <ul>
              <li>{classes.length} classes ativas</li>
              <li>{alunosSomente().length} alunos cadastrados</li>
              <li>{professoresSomente().length} professores cadastrados</li>
              <li>{chamadasSalvas.length} chamadas registradas</li>
              <li>{calcularFrequenciaGeral()}% de frequÃªncia geral</li>
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
            descricao="Registros salvos de presenÃ§a."
          />
          <CardResumo
            icone="check"
            titulo="FrequÃªncia geral"
            valor={`${calcularFrequenciaGeral()}%`}
            descricao="MÃ©dia de presenÃ§a nas chamadas lanÃ§adas."
            destaque
          />
        </div>

        {usuarioEhSecretaria() && (
          <div className="alerta-aniversariantes">
            <div className="topo-alerta-aniversariantes">
              <div>
                <span className="hero-tag">Aniversariantes da semana</span>
                <h3>Alunos, professores e secretarias</h3>
              </div>
              <strong>{aniversariantesDaSemana.length}</strong>
            </div>

            {aniversariantesDaSemana.length > 0 ? (
              <div className="lista-aniversariantes">
                {aniversariantesDaSemana.map((pessoa) => (
                  <div className="item-aniversariante" key={pessoa.id}>
                    <div>
                      <strong>{pessoa.nome}</strong>
                      <p>
                        {pessoa.tipo} - {pessoa.detalhe}
                      </p>
                    </div>
                    <span>
                      {formatarDataNascimento(pessoa.dataNascimento)} - {descreverAniversario(pessoa.dias)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="texto-sem-aniversariantes">
                Nenhum aniversÃ¡rio cadastrado para os prÃ³ximos 7 dias.
              </p>
            )}
          </div>
        )}

        {renderizarFeedbackPiloto()}

        <div className="grade-resumos-comerciais">
          <div className="resumo resumo-comercial resumo-alerta-claro">
            <h3>PersonalizaÃ§Ã£o da igreja</h3>
            <p>
              {configuracaoIgreja.nome_igreja
                ? 'Os dados da igreja jÃ¡ estÃ£o configurados e serÃ£o usados nos relatÃ³rios e PDFs.'
                : 'Preencha os dados da igreja em ConfiguraÃ§Ãµes para exibir nome, endereÃ§o e contatos nos relatÃ³rios.'}
            </p>
          </div>
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
                ? 'Este cadastro tambÃ©m aparece no menu Professores e na Chamada dos professores.'
                : 'Este aluno serÃ¡ cadastrado diretamente na classe selecionada e aparecerÃ¡ na chamada dos alunos.'}
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
            Classe de referÃªncia
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
          <button className="botao-principal" type="submit">
            {alunoEditandoId
              ? 'Salvar alteraÃ§Ãµes'
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
          <p>O cadastro de classes Ã© gerenciado pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Classes</h2>
            <p>Organize as classes da EBD, veja matrÃ­culas em destaque e cadastre alunos ou professores diretamente pela turma.</p>
          </div>

          {!mostrarFormularioClasse && (
            <button className="botao-principal" onClick={abrirNovaClasse}>
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
                  ? 'Atualize o nome da classe. Os alunos e professores vinculados continuarÃ£o nesta mesma turma.'
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
                placeholder="Ex: Jovens, Adultos, CrianÃ§as..."
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
            Clique em uma classe para cadastrar alunos, vincular professores e acompanhar a matrÃ­cula de cada turma.
          </p>
        </div>

        <div className="lista lista-classes-modernas">
          {classes.map((classe, indiceClasse) => {
            const professoresDaClasse = buscarProfessoresDaClasse(classe.id)

            return (
            <div className={`item-lista item-com-acoes classe-card-moderno classe-cor-${(indiceClasse % 4) + 1}`} key={classe.id}>
              <div className="classe-card-conteudo">
                <div className="classe-card-cabecalho">
                  <div>
                    <span className="classe-card-selo">Classe</span>
                    <h3>{classe.nome}</h3>
                  </div>

                  <strong className="classe-card-matricula">
                    {calcularMatriculaDaClasse(classe.id)}
                    <span>alunos</span>
                  </strong>
                </div>

                <div className="classe-card-info">
                  <p>
                    <strong>Professores</strong>
                    <span>{buscarTextoProfessoresDaClasse(classe.id)}</span>
                  </p>

                  <p>
                    <strong>MatrÃ­cula</strong>
                    <span>{calcularMatriculaDaClasse(classe.id)} alunos</span>
                  </p>
                </div>

                <div className="professores-na-classe">
                  {professoresDaClasse.length > 0 ? (
                    professoresDaClasse.map((professor) => (
                      <div className="professor-classe-linha" key={professor.id}>
                        <span>{professor.nome}</span>

                        <div>
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
              </div>

              <div className="acoes-item acoes-classe-card">
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
                  className="botao-editar"
                  onClick={() => editarClasse(classe)}
                >
                  Alterar nome da classe
                </button>

                <button
                  className="botao-excluir"
                  onClick={() => excluirClasse(classe.id)}
                >
                  Excluir classe
                </button>
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
      ? 'Cadastre, edite e organize os professores. A classe de referÃªncia tambÃ©m atualiza a lista de professores em Classes.'
      : usuarioEhProfessor()
        ? 'Veja os alunos vinculados Ã s suas classes.'
        : 'Cadastre, edite, busque e organize os alunos por classe.'

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>{tituloPagina}</h2>
            <p>{descricaoPagina}</p>
          </div>

          {podeGerenciarCadastros() && !mostrarFormularioAluno && (
            <button
              className="botao-principal"
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
              Classe de referÃªncia
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
              <button className="botao-principal" type="submit">
                {alunoEditandoId ? 'Salvar alteraÃ§Ãµes' : 'Salvar cadastro'}
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

          <button className="botao-secundario" onClick={limparFiltrosAlunos}>
            Limpar filtros
          </button>
        </div>

        <p className="contador-resultados">
          Mostrando {cadastrosFiltrados.length} de{' '}
          {ehPaginaProfessor ? professoresSomente().length : alunosSomente().length}{' '}
          {ehPaginaProfessor ? 'professores' : 'alunos'}
        </p>

        <div className="lista">
          {cadastrosFiltrados.map((aluno) => (
            <div className="item-lista item-com-acoes" key={aluno.id}>
              <div>
                <h3>{aluno.nome}</h3>
                <p>
                  Tipo: {(aluno.tipoPessoa || 'aluno') === 'professor' ? 'Professor' : 'Aluno'}
                </p>
                <p>Classe de referÃªncia: {buscarNomeClasse(aluno.classeId)}</p>
                {aluno.telefone && <p>Telefone: {aluno.telefone}</p>}
                {aluno.dataNascimento && (
                  <p>Nascimento: {formatarDataNascimento(aluno.dataNascimento)}</p>
                )}
              </div>

              {podeGerenciarCadastros() && (
                <div className="acoes-item">
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
          <p>O cadastro de usuÃ¡rios Ã© gerenciado pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>UsuÃ¡rios</h2>
            <p>
              Cadastre secretarias e professores da igreja. O login precisa existir
              primeiro em Authentication no Supabase.
            </p>
          </div>

          {!mostrarFormularioPerfil && (
            <button className="botao-principal" onClick={abrirNovoPerfil}>
              Novo usuÃ¡rio
            </button>
          )}
        </div>

        <div className="aviso aviso-usuarios">
          <p>
            <strong>Importante:</strong> primeiro crie o usuÃ¡rio em
            Supabase â†’ Authentication â†’ Users. Depois copie o User UID e cadastre
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
                {perfilEditandoId ? 'Salvar alteraÃ§Ãµes' : 'Salvar usuÃ¡rio'}
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
    if (!usuarioEhSecretaria()) {
      alert('Apenas a secretaria pode salvar a chamada dos professores.')
      return
    }

    const professores = buscarProfessoresDaIgreja()

    if (professores.length === 0) {
      alert('Ainda nÃ£o hÃ¡ professores cadastrados em UsuÃ¡rios.')
      return
    }

    const professoresSemMarcacao = professores.filter(
      (professor) => !presencasProfessores[professor.id]
    )

    if (professoresSemMarcacao.length > 0) {
      alert('Marque Presente, Faltou ou Justificou para todos os professores.')
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
      mostrarErroSistema(error, 'Erro ao salvar chamada dos professores.')
      return
    }

    await buscarTodosOsDados()

    setPresencasProfessores({})
    setObservacoesChamadaProfessores('')

    alert('Chamada dos professores salva com sucesso!')
  }

  function renderizarChamada() {
    const alunosDaClasse = alunos.filter(
      (aluno) =>
        aluno.classeId === Number(classeChamadaId) &&
        (aluno.tipoPessoa || 'aluno') === 'aluno'
    )
    const professoresDaIgreja = buscarProfessoresDaIgreja()

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Chamada</h2>
            <p>
              {usuarioEhProfessor()
                ? 'FaÃ§a a chamada das classes vinculadas pela secretaria.'
                : 'Registre a chamada dos alunos e a chamada separada dos professores.'}
            </p>
          </div>
        </div>

        {usuarioEhSecretaria() && (
          <div className="abas-chamada">
            <button
              className={tipoChamada === 'alunos' ? 'ativo' : ''}
              type="button"
              onClick={() => setTipoChamada('alunos')}
            >
              Chamada dos alunos
            </button>

            <button
              className={tipoChamada === 'professores' ? 'ativo' : ''}
              type="button"
              onClick={() => setTipoChamada('professores')}
            >
              Chamada dos professores
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
                    VocÃª sÃ³ verÃ¡ as classes vinculadas pela secretaria.
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
                  O sistema preenche com a data de hoje, mas vocÃª pode alterar.
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
                    BÃ­blias
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

            {classeChamadaId && alunosDaClasse.length === 0 && (
              <div className="aviso">
                <p>Essa classe ainda nÃ£o possui alunos cadastrados.</p>
              </div>
            )}

            {alunosDaClasse.length > 0 && (
              <>
                <div className="resumo-chamada">
                  <p>
                    <strong>MatrÃ­cula:</strong> {alunosDaClasse.length}
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

                <button className="botao-principal" onClick={salvarChamada}>
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
                  Use a data do domingo/aula referente Ã  chamada.
                </small>
              </label>
            </div>

            <div className="resumo-chamada resumo-professores">
              <p>
                <strong>Professores cadastrados:</strong> {professoresDaIgreja.length}
              </p>
              <p>
                <strong>Ãšltima chamada:</strong> {buscarDataUltimaChamadaProfessores()}
              </p>
              <p>
                <strong>Chamadas salvas:</strong> {chamadasProfessores.length}
              </p>
            </div>

            {professoresDaIgreja.length === 0 && (
              <div className="aviso">
                <p>
                  Nenhum professor cadastrado. VÃ¡ em Alunos e Professores,
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
                        <p>Classe de referÃªncia: {buscarNomeClasse(professor.classeId)}</p>
                      </div>

                      <div className="acoes-chamada acoes-chamada-professores">
                        <button
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
                    ObservaÃ§Ãµes da chamada dos professores
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

  function renderizarRelatorios() {
    const linhasRelatorio = montarRelatorioPorClasse()
    const totaisRelatorio = calcularTotaisRelatorio()
    const dataRelatorio = buscarDataUltimaChamada()
    const dataRelatorioFormatada = formatarDataRelatorio(dataRelatorio)
    const resumoProfessores = calcularResumoUltimaChamadaProfessores()
    const percentualProfessores = calcularPercentualPresencaProfessores()

    return (
      <section className="conteudo">
        <div className="topo-pagina no-print">
          <div>
            <h2>RelatÃ³rios</h2>
            <p>
              {usuarioEhProfessor()
                ? 'RelatÃ³rio da sua classe no modelo da Escola BÃ­blica Dominical.'
                : 'RelatÃ³rio geral no modelo da Escola BÃ­blica Dominical.'}
            </p>
          </div>

          <div className="grupo-botoes">
            <button
              className="botao-principal"
              onClick={abrirRelatorioParaImpressao}
            >
              Imprimir / Salvar PDF
            </button>

            <button className="botao-secundario" onClick={baixarRelatorioPDF}>
              Baixar PDF
            </button>
          </div>
        </div>

        <div className="relatorios-dashboard no-print">
          <div className="relatorios-hero">
            <div>
              <span className="selo-publico">RelatÃ³rios da EBD</span>
              <h3>Resumo geral da Escola BÃ­blica Dominical</h3>
              <p>
                Acompanhe alunos, classes, frequÃªncia e presenÃ§a dos professores
                com uma visualizaÃ§Ã£o mais clara e moderna.
              </p>
            </div>

            <div className="relatorios-percentual">
              <strong>{calcularFrequenciaGeral()}%</strong>
              <span>frequÃªncia geral</span>
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
              <span>FrequÃªncia</span>
              <strong>{calcularFrequenciaGeral()}%</strong>
              <p>mÃ©dia geral de presenÃ§a</p>
            </div>
          </div>

          {usuarioEhSecretaria() && (
            <div className="relatorio-professores-moderno">
              <div className="cabecalho-relatorio-professores">
                <div>
                  <span className="selo-publico">Professores</span>
                  <h3>Resumo da Ãºltima chamada dos professores</h3>
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
          <div className="cabecalho-relatorio">
            <img
              src="/logo-oficial-ebd-fiel.png"
              alt="Logo EBD Fiel"
              className="logo-relatorio"
            />
            <h3>{configuracaoIgreja.nome_igreja || 'RelatÃ³rio do Domingo'}</h3>
            {configuracaoIgreja.congregacao && <p>{configuracaoIgreja.congregacao}</p>}
            {configuracaoIgreja.pastor_dirigente && (
              <p>Dirigente: {configuracaoIgreja.pastor_dirigente}</p>
            )}
            {configuracaoIgreja.superintendente_ebd && (
              <p>Superintendente da EBD: {configuracaoIgreja.superintendente_ebd}</p>
            )}
            {montarEnderecoIgreja() && <p>{montarEnderecoIgreja()}</p>}
            {(configuracaoIgreja.telefone || configuracaoIgreja.email) && (
              <p>
                {[configuracaoIgreja.telefone, configuracaoIgreja.email]
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            )}
            <p>{dataRelatorioFormatada}</p>
          </div>

          <div className="tabela-container">
            <table className="tabela tabela-ebd">
              <thead>
                <tr>
                  <th>NÂº</th>
                  <th>Classes</th>
                  <th>MatrÃ­cula</th>
                  <th>AusÃªncia</th>
                  <th>PresenÃ§a</th>
                  <th>Visitante</th>
                  <th>Total</th>
                  <th>BÃ­blia</th>
                  <th>Revista</th>
                  <th>Ofertas</th>
                  <th>%</th>
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
                  <td colSpan="11">DOMINGO anterior</td>
                </tr>

                {usuarioEhSecretaria() && (
                  <>
                    <tr className="linha-professores-titulo">
                      <td colSpan="11">
                        CHAMADA DOS PROFESSORES - Total: {resumoProfessores.totalProfessores} â€¢
                        Presentes: {resumoProfessores.presentes} - Faltaram:{' '}
                        {resumoProfessores.faltaram} - Justificaram:{' '}
                        {resumoProfessores.justificaram} - FrequÃªncia:{' '}
                        {percentualProfessores}%
                      </td>
                    </tr>

                    <tr className="linha-professores-cabecalho">
                      <td>NÂº</td>
                      <td>Professor</td>
                      <td colSpan="3">Classe de referÃªncia</td>
                      <td colSpan="3">Status</td>
                      <td colSpan="3">Data</td>
                    </tr>

                    {resumoProfessores.registros.length > 0 ? (
                      resumoProfessores.registros.map((registro, indice) => (
                        <tr
                          className="linha-professor-relatorio"
                          key={`${registro.nome}-${indice}`}
                        >
                          <td>{indice + 1}</td>
                          <td>{registro.nome}</td>
                          <td colSpan="3">
                            {registro.classeReferencia || registro.classes || '-'}
                          </td>
                          <td colSpan="3">{traduzirStatusProfessor(registro.status)}</td>
                          <td colSpan="3">{formatarDataRelatorio(resumoProfessores.data)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="linha-professor-relatorio">
                        <td colSpan="11">Nenhuma chamada de professor lanÃ§ada neste perÃ­odo.</td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    )
  }

  function renderizarConfiguracoes() {
    if (!podeGerenciarCadastros()) {
      return (
        <section className="conteudo">
          <h2>Acesso restrito</h2>
          <p>As configuraÃ§Ãµes da igreja sÃ£o gerenciadas pela secretaria.</p>
        </section>
      )
    }

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>ConfiguraÃ§Ãµes da Igreja</h2>
            <p>Preencha os dados que aparecerÃ£o nos relatÃ³rios e PDFs.</p>
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
                placeholder="Ex: Assembleia de Deus MinistÃ©rio..."
              />
            </label>

            <label>
              CongregaÃ§Ã£o / departamento
              <input
                type="text"
                value={configuracaoIgreja.congregacao}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('congregacao', event.target.value)
                }
                placeholder="Ex: Escola BÃ­blica Dominical"
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
                placeholder="Ex: Pr. JoÃ£o Silva"
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
                placeholder="Ex: IrmÃ£ Maria Helena"
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
              EndereÃ§o
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
                placeholder="Ex: SÃ£o Paulo"
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
              {salvandoConfiguracaoIgreja ? 'Salvando...' : 'Salvar configuraÃ§Ãµes'}
            </button>
          </div>
        </form>

        <div className="resumo">
          <h3>PrÃ©via do cabeÃ§alho</h3>
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
            <span className="selo-admin">Alertas do piloto</span>
            <h3>Feedbacks recebidos</h3>
            <p>
              Toda mensagem enviada pelas igrejas em teste aparece aqui para acompanhamento.
            </p>
          </div>

          <strong>{feedbacksNaoLidos.length}</strong>
        </div>

        {feedbacksAdmin.length === 0 ? (
          <p className="texto-sem-feedback">Nenhum feedback recebido ainda.</p>
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
                    {feedback.tipo} - {feedback.nome_usuario || feedback.email_usuario || 'UsuÃ¡rio'} â€¢{' '}
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
                        Resposta ao feedback
                        <textarea
                          value={respostaFeedbackAdmin}
                          onChange={(event) => setRespostaFeedbackAdmin(event.target.value)}
                          placeholder="Escreva a resposta que a igreja verÃ¡ na Ã¡rea de feedback..."
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
            <strong>UsuÃ¡rios vinculados a esta igreja</strong>
            <span>{acessosDaIgreja.length} usuÃ¡rio(s)</span>
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
            <p>Nenhum usuÃ¡rio vinculado a esta igreja.</p>
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
                Enviar recuperaÃ§Ã£o
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
      `Criado em: ${formatarDataHoraFeedback(cadastro.criado_em) || 'Data nÃ£o informada'}`,
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
              UsuÃ¡rios que existem no Supabase Authentication, mas ainda nÃ£o possuem perfil
              em perfis_usuarios. No piloto, a soluÃ§Ã£o mais limpa costuma ser excluir o
              usuÃ¡rio no Authentication e pedir novo cadastro.
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
                    <h4>{cadastro.email || 'UsuÃ¡rio sem e-mail'}</h4>
                    <span>Sem perfil</span>
                  </div>

                  <p>Criado em: {formatarDataHoraFeedback(cadastro.criado_em) || 'Data nÃ£o informada'}</p>
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
                    Preparar vÃ­nculo
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
            <h3>Controle comercial de usuÃ¡rios</h3>
            <p>
              Vincule secretarias e professores Ã s igrejas cadastradas. Para criar o login,
              primeiro crie o usuÃ¡rio em Supabase â†’ Authentication â†’ Users e cole o User UID aqui.
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
                  Este vÃ­nculo define qual igreja o usuÃ¡rio acessa e qual perfil ele terÃ¡ no sistema.
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
                  placeholder="Opcional, normalmente sÃ³ para professor"
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
                        <p>ResponsÃ¡vel: {contato.responsavel}</p>
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
                  Enviar recuperaÃ§Ã£o
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
          <p>Esta Ã¡rea Ã© exclusiva para administradores do sistema.</p>
        </section>
      )
    }

    const igrejasFiltradas = filtrarIgrejasAdmin()
    const igrejasPendentes = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'pendente').length
    const igrejasTeste = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'teste').length
    const igrejasAtivas = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'ativa').length
    const igrejasPausadas = igrejasAdmin.filter((igreja) => igreja.status_piloto === 'pausada').length

    return (
      <section className="conteudo">
        <div className="topo-pagina topo-admin-sistema">
          <div>
            <span className="selo-admin">AdministraÃ§Ã£o do sistema</span>
            <h2>AdministraÃ§Ã£o comercial</h2>
            <p>
              Gerencie igrejas, sedes, congregaÃ§Ãµes, acessos, status do piloto, recuperaÃ§Ã£o de senha e feedbacks em um Ãºnico painel.
            </p>
          </div>

          {!mostrarFormularioIgrejaAdmin && (
            <button className="botao-principal" onClick={abrirNovaIgrejaAdmin}>
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
            <p>aguardando aprovaÃ§Ã£o</p>
          </div>

          <div className="card card-admin">
            <span>Em teste</span>
            <strong>{igrejasTeste}</strong>
            <p>participando do piloto</p>
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

        {renderizarAlertasFeedbackAdmin()}

        {renderizarCadastrosIncompletosAdmin()}

        {/* UsuÃ¡rios vinculados agora aparecem dentro de cada igreja. */}

        {mostrarFormularioIgrejaAdmin && (
          <form className="formulario formulario-admin-igreja" onSubmit={salvarIgrejaAdmin}>
            <div className="topo-formulario-inline">
              <div>
                <h3>{igrejaAdminEditandoId ? 'Editar igreja' : 'Nova igreja do piloto'}</h3>
                <p>
                  Cadastre a igreja com endereÃ§o completo, tipo de igreja e vÃ­nculo com a sede.
                  Depois crie o usuÃ¡rio em Supabase â†’ Authentication â†’ Users e vincule o acesso.
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
                CongregaÃ§Ã£o
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
                  placeholder="Ex: Pr. JoÃ£o Silva"
                />
              </label>

              <label>
                Status do piloto
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
                  <option value="teste">Teste</option>
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
                EndereÃ§o da igreja
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
                NÃºmero
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
                  <option value="congregacao">CongregaÃ§Ã£o</option>
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
                    EndereÃ§o da sede
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
                    NÃºmero da sede
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
                ResponsÃ¡vel
                <input
                  type="text"
                  value={novaIgrejaAdmin.responsavel_nome}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      responsavel_nome: event.target.value,
                    })
                  }
                  placeholder="Nome da secretaria responsÃ¡vel"
                />
              </label>

              <label>
                E-mail do responsÃ¡vel
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
                WhatsApp do responsÃ¡vel
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
                Limite de usuÃ¡rios
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
                InÃ­cio do piloto
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
                Fim do piloto
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
                ObservaÃ§Ãµes do piloto
                <input
                  type="text"
                  value={novaIgrejaAdmin.observacoes_piloto}
                  onChange={(event) =>
                    setNovaIgrejaAdmin({
                      ...novaIgrejaAdmin,
                      observacoes_piloto: event.target.value,
                    })
                  }
                  placeholder="Ex: igreja convidada para teste de 30 dias"
                />
              </label>
            </div>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {igrejaAdminEditandoId ? 'Salvar alteraÃ§Ãµes' : 'Salvar igreja'}
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
              placeholder="Buscar por igreja, congregaÃ§Ã£o, responsÃ¡vel ou e-mail"
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
                    {igreja.status_piloto || 'teste'}
                  </span>
                  {igreja.status_piloto === 'pendente' && (
                    <span className="selo-aguardando-aprovacao">
                      aguardando decisÃ£o
                    </span>
                  )}
                </div>

                {igreja.congregacao && <p>CongregaÃ§Ã£o: {igreja.congregacao}</p>}
                {igreja.pastor_dirigente && <p>Dirigente: {igreja.pastor_dirigente}</p>}
                <div className="dados-igreja-admin">
                  <p>
                    Tipo:{' '}
                    <strong>
                      {igreja.tipo_igreja === 'sede' ? 'Sede' : 'CongregaÃ§Ã£o'}
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
                      EndereÃ§o: {igreja.endereco}
                      {igreja.numero_endereco ? `, nÂº ${igreja.numero_endereco}` : ''}
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
                      EndereÃ§o da sede: {igreja.sede_filiada_endereco}
                      {igreja.sede_filiada_numero ? `, nÂº ${igreja.sede_filiada_numero}` : ''}
                      {igreja.sede_filiada_complemento ? `, ${igreja.sede_filiada_complemento}` : ''}
                      {igreja.sede_filiada_cep ? ` - CEP ${igreja.sede_filiada_cep}` : ''}
                    </p>
                  )}
                </div>

                {igreja.responsavel_nome && <p>ResponsÃ¡vel: {igreja.responsavel_nome}</p>}
                {igreja.responsavel_email && <p>E-mail: {igreja.responsavel_email}</p>}
                {igreja.responsavel_whatsapp && <p>WhatsApp: {igreja.responsavel_whatsapp}</p>}
                <p>UsuÃ¡rios vinculados: {contarAcessosDaIgreja(igreja.id)}</p>
                {(igreja.data_inicio_piloto || igreja.data_fim_piloto) && (
                  <p>
                    Piloto: {igreja.data_inicio_piloto || 'sem inÃ­cio'} atÃ©{' '}
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
                      NÃ£o aprovar
                    </button>
                  </div>
                )}

                {igreja.status_piloto !== 'pendente' && igreja.status_piloto !== 'teste' && (
                  <button
                    className="botao-aprovar-igreja"
                    onClick={() => aprovarIgrejaPiloto(igreja)}
                  >
                    Aprovar para teste
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

                <button className="botao-acessar-igreja" onClick={() => acessarIgrejaComoSuporte(igreja)}>
                  Acessar igreja
                </button>

                <button className="botao-principal" onClick={() => abrirNovoAcessoAdmin(igreja)}>
                  Vincular acesso
                </button>

                <button
                  className="botao-secundario botao-usuarios-vinculados"
                  type="button"
                  onClick={() => alternarUsuariosDaIgreja(igreja.id)}
                >
                  {Number(igrejaUsuariosAbertaId) === Number(igreja.id)
                    ? 'Ocultar usuÃ¡rios'
                    : `UsuÃ¡rios vinculados (${contarAcessosDaIgreja(igreja.id)})`}
                </button>

                <button className="botao-editar" onClick={() => editarIgrejaAdmin(igreja)}>
                  Editar dados
                </button>

                <button className="botao-excluir" onClick={() => excluirIgrejaAdmin(igreja)}>
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
      </section>
    )
  }

  function renderizarManualUsuario() {
    const passosManual = [
      {
        numero: '01',
        titulo: 'Confira os dados da igreja',
        texto:
          'Ao entrar no sistema, confira se o nome da igreja, congregaÃ§Ã£o, dirigente, cidade e demais dados estÃ£o corretos.',
        local: 'Painel ou ConfiguraÃ§Ãµes',
      },
      {
        numero: '02',
        titulo: 'Cadastre as classes da EBD',
        texto:
          'Crie as turmas da Escola BÃ­blica Dominical. Exemplo: CrianÃ§as, Adolescentes, Jovens, Adultos, Novos Convertidos.',
        local: 'Menu Classes',
      },
      {
        numero: '03',
        titulo: 'Cadastre os alunos',
        texto:
          'Inclua os alunos em suas respectivas classes. O cadastro pode ser feito pelo menu Alunos ou diretamente dentro da classe.',
        local: 'Menu Alunos ou Classes',
      },
      {
        numero: '04',
        titulo: 'Cadastre os professores',
        texto:
          'Cadastre os professores da EBD e vincule cada professor Ã  classe em que ele atua. Uma classe pode ter mais de um professor.',
        local: 'Menu Professores ou Classes',
      },
      {
        numero: '05',
        titulo: 'FaÃ§a a chamada dos alunos',
        texto:
          'Na data da EBD, registre presenÃ§a, falta, visitantes, BÃ­blias, revistas, ofertas e demais informaÃ§Ãµes da chamada.',
        local: 'Menu Chamada',
      },
      {
        numero: '06',
        titulo: 'FaÃ§a a chamada dos professores',
        texto:
          'Registre tambÃ©m a presenÃ§a dos professores em uma chamada separada, facilitando o acompanhamento da equipe docente.',
        local: 'Menu Chamada',
      },
      {
        numero: '07',
        titulo: 'Acompanhe aniversariantes',
        texto:
          'Use o painel para acompanhar aniversariantes cadastrados e facilitar os avisos da secretaria da EBD.',
        local: 'Painel',
      },
      {
        numero: '08',
        titulo: 'Gere relatÃ³rios',
        texto:
          'Depois de registrar as chamadas, gere o relatÃ³rio em PDF com os dados da EBD, incluindo alunos e professores.',
        local: 'Menu RelatÃ³rios',
      },
      {
        numero: '09',
        titulo: 'Envie feedback do piloto',
        texto:
          'Durante o teste piloto, envie sugestÃµes, dÃºvidas, dificuldades ou elogios para ajudar a melhorar o sistema.',
        local: 'Painel',
      },
    ]

    return (
      <section className="conteudo manual-usuario-pagina">
        <div className="manual-hero">
          <div>
            <span className="selo-manual">Primeiros passos</span>
            <h2>Manual do usuÃ¡rio EBD Fiel</h2>
            <p>
              Siga este roteiro para configurar sua igreja e comeÃ§ar a usar o sistema
              na rotina da Escola BÃ­blica Dominical.
            </p>
          </div>

          <button className="botao-principal" onClick={() => navegarParaPagina('classes')}>
            ComeÃ§ar pelas classes
          </button>
        </div>

        <div className="manual-alerta">
          <strong>Ordem recomendada:</strong>
          <span>
            primeiro confira os dados da igreja, depois cadastre classes, alunos,
            professores, faÃ§a a chamada e gere os relatÃ³rios.
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

        <div className="manual-final">
          <div>
            <h3>Dica para o teste piloto</h3>
            <p>
              Use o sistema em uma rotina real da EBD e envie feedback sempre que
              encontrar algo confuso, difÃ­cil ou que possa melhorar.
            </p>
          </div>

          <button className="botao-secundario" onClick={() => navegarParaPagina('painel')}>
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
    if (paginaAtual === 'classes') return renderizarClasses()
    if (paginaAtual === 'alunos') return renderizarAlunos()
    if (paginaAtual === 'professores') return renderizarProfessores()
    if (paginaAtual === 'usuarios') return renderizarUsuarios()
    if (paginaAtual === 'chamada') return renderizarChamada()
    if (paginaAtual === 'relatorios') return renderizarRelatorios()
    if (paginaAtual === 'manual') return renderizarManualUsuario()
    if (paginaAtual === 'configuracoes') return renderizarConfiguracoes()
    if (paginaAtual === 'administracao') return renderizarAdministracao()

    return renderizarPainel()
  }

  return (
    <div className="app">
      <aside className="menu-lateral">
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
            <p>GestÃ£o da Escola BÃ­blica</p>
          </div>
        </div>

        <nav className="menu-navegacao">
          {menu.filter(menuPermitidoParaUsuario).map((item) => (
            <button
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

          <button className="botao-secundario botao-sair-sidebar" onClick={sairDoSistema}>
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
                VocÃª estÃ¡ visualizando a igreja{' '}
                {igrejaSuporteAdmin?.nome_igreja ||
                  igrejaAtualPiloto?.nome_igreja ||
                  buscarNomeIgrejaParaExibicao()}
              </strong>
              <p>VocÃª continua logado como administrador do sistema.</p>
            </div>

            <button className="botao-sair-suporte" onClick={sairDoModoSuporteAdmin}>
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
