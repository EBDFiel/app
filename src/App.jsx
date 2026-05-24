import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './App.css'
import { supabase } from './lib/supabase'

const classesIniciais = [
  { id: 1, nome: 'Jovens', professor: 'Ev. Lucas' },
  { id: 2, nome: 'Adultos', professor: 'Pr. Carlos' },
  { id: 3, nome: 'Crianças', professor: 'Irmã Ana' },
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

function App() {
  const [paginaAtual, setPaginaAtual] = useState('painel')
  const [carregando, setCarregando] = useState(true)
  const [erroSistema, setErroSistema] = useState('')

  const [sessao, setSessao] = useState(null)
  const [verificandoSessao, setVerificandoSessao] = useState(true)
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const [carregandoLogin, setCarregandoLogin] = useState(false)
  const [erroLogin, setErroLogin] = useState('')
  const [telaPublica, setTelaPublica] = useState('landing')

  const [classes, setClasses] = useState([])
  const [alunos, setAlunos] = useState([])
  const [chamadasSalvas, setChamadasSalvas] = useState([])
  const [chamadasProfessores, setChamadasProfessores] = useState([])
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [perfisIgreja, setPerfisIgreja] = useState([])
  const [vinculosProfessores, setVinculosProfessores] = useState([])
  const [igrejaId, setIgrejaId] = useState(null)
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
    { id: 'usuarios', nome: 'Usuários', icone: 'usuarios', apenasSecretaria: true },
    { id: 'chamada', nome: 'Chamada', icone: 'chamada' },
    { id: 'relatorios', nome: 'Relatórios', icone: 'relatorios' },
    {
      id: 'configuracoes',
      nome: 'Configurações',
      icone: 'configuracoes',
      apenasSecretaria: true,
    },
  ]

  useEffect(() => {
    iniciarAutenticacao()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session)

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
      console.error('Erro ao verificar sessão:', error)
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
    setConfiguracaoIgreja({
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
    setPaginaAtual('painel')
    setTelaPublica('landing')
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
    setDadosExtrasChamada({
      visitantes: '',
      biblias: '',
      revistas: '',
      ofertas: '',
    })
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
          'Não foi possível carregar os dados do Supabase.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function inserirDadosIniciais(igrejaAtualId, sessaoAtual = sessao) {
    if (!igrejaAtualId) {
      throw new Error('Igreja não identificada para criar os dados iniciais.')
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

  function usuarioEhProfessor() {
    return perfilUsuario?.perfil === 'professor'
  }

  function buscarIgrejaIdAtual() {
    return perfilUsuario?.igreja_id || igrejaId || null
  }

  function usuarioEhSecretaria() {
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
    return !item.apenasSecretaria || usuarioEhSecretaria()
  }

  async function buscarTodosOsDados(sessaoAtual = sessao) {
    if (!sessaoAtual?.user?.id) {
      throw new Error('Não foi possível confirmar sua sessão. Saia e entre novamente no sistema.')
    }

    const { data: perfilBanco, error: erroPerfil } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .eq('user_id', sessaoAtual.user.id)
      .maybeSingle()

    if (erroPerfil) {
      throw erroPerfil
    }

    if (!perfilBanco?.igreja_id) {
      throw new Error(
        'Perfil do usuário sem igreja vinculada. Verifique a tabela perfis_usuarios no Supabase.'
      )
    }

    const perfilAtual = perfilBanco
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

    const { data: alunosBanco, error: erroAlunos } = await consultaAlunos

    if (erroAlunos) {
      throw erroAlunos
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
      nome_igreja: configuracaoAtual?.nome_igreja || '',
      congregacao: configuracaoAtual?.congregacao || '',
      pastor_dirigente: configuracaoAtual?.pastor_dirigente || '',
      cidade: configuracaoAtual?.cidade || '',
      estado: configuracaoAtual?.estado || '',
      bairro: configuracaoAtual?.bairro || '',
      endereco: configuracaoAtual?.endereco || '',
      telefone: configuracaoAtual?.telefone || '',
      email: configuracaoAtual?.email || '',
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

  function alterarPresenca(alunoId, status) {
    setPresencas({
      ...presencas,
      [alunoId]: status,
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
      (aluno) => aluno.classeId === Number(classeChamadaId)
    )

    if (alunosDaClasse.length === 0) {
      alert('Essa classe ainda não possui alunos cadastrados.')
      return
    }

    const alunosSemMarcacao = alunosDaClasse.filter(
      (aluno) => !presencas[aluno.id]
    )

    if (alunosSemMarcacao.length > 0) {
      alert('Marque Presente ou Faltou para todos os alunos.')
      return
    }

    const totalPresentes = alunosDaClasse.filter(
      (aluno) => presencas[aluno.id] === 'presente'
    ).length

    const totalFaltas = alunosDaClasse.filter(
      (aluno) => presencas[aluno.id] === 'faltou'
    ).length

    const visitantes = converterNumero(dadosExtrasChamada.visitantes)
    const biblias = converterNumero(dadosExtrasChamada.biblias)
    const revistas = converterNumero(dadosExtrasChamada.revistas)
    const ofertas = converterNumero(dadosExtrasChamada.ofertas)

    const chamadaBanco = {
      id: Date.now(),
      data: buscarDataAtual(),
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
        status: presencas[aluno.id],
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
              <p>Gestão inteligente para Escola Bíblica Dominical.</p>
            </div>
          </div>

          <div className="apresentacao-texto">
            <span className="selo-apresentacao">Área segura do cliente</span>
            <h2>Acesse o painel da sua igreja.</h2>
            <p>
              Entre com suas credenciais para gerenciar classes, alunos, chamadas,
              configurações e relatórios da Escola Bíblica Dominical.
            </p>
          </div>

          <div className="beneficios-login">
            <div className="beneficio-item">
              <Icone nome="classes" className="icone-beneficio" />
              <span>Cadastro de classes</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="alunos" className="icone-beneficio" />
              <span>Gestão de alunos</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="chamada" className="icone-beneficio" />
              <span>Chamada digital</span>
            </div>
            <div className="beneficio-item">
              <Icone nome="relatorios" className="icone-beneficio" />
              <span>Relatórios e PDF</span>
            </div>
          </div>
        </section>

        <section className="cartao-login">
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
              <h2>Acesso restrito</h2>
              <p>Entre com seu e-mail e senha para acessar o sistema.</p>
            </div>
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
              {carregandoLogin ? 'Entrando...' : 'Entrar no sistema'}
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (!sessao) {
    return (
      <div className="pagina-publica">
        <header className="topo-publico">
          <div className="marca-publica">
            <div className="logo-simbolo logo-publica">
              <img
                src="/logo-oficial-ebd-fiel.png"
                alt="Logo EBD Fiel"
                className="logo-imagem"
              />
            </div>
            <div>
              <strong>EBD Fiel</strong>
              <span>Gestão para Escola Bíblica Dominical</span>
            </div>
          </div>

          <nav className="menu-publico">
            <a href="#recursos">Recursos</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#planos">Planos</a>
            <button type="button" onClick={() => setTelaPublica('login')}>
              Entrar
            </button>
          </nav>
        </header>

        <main>
          <section className="hero-publico">
            <div className="hero-publico-texto">
              <span className="selo-publico">Sistema online para igrejas</span>
              <h1>Organize sua Escola Bíblica Dominical com simplicidade e excelência.</h1>
              <p>
                O EBD Fiel ajuda igrejas a controlar classes, alunos, chamadas,
                frequência, relatórios e PDFs em uma plataforma moderna, acessível
                e pronta para uso.
              </p>

              <div className="acoes-publicas">
                <button
                  className="botao-principal"
                  type="button"
                  onClick={() => setTelaPublica('login')}
                >
                  Entrar no sistema
                </button>

                <a
                  className="botao-secundario link-botao-publico"
                  href="https://wa.me/5527928345844?text=Ol%C3%A1%21%20Quero%20solicitar%20acesso%20ao%20EBD%20Fiel."
                  target="_blank"
                  rel="noreferrer"
                >
                  Solicitar acesso
                </a>
              </div>

              <div className="metricas-publicas">
                <div>
                  <strong>100%</strong>
                  <span>online</span>
                </div>
                <div>
                  <strong>PDF</strong>
                  <span>relatórios</span>
                </div>
                <div>
                  <strong>EBD</strong>
                  <span>foco total</span>
                </div>
              </div>
            </div>

            <div className="hero-publico-card">
              <div className="mini-dashboard">
                <div className="mini-dashboard-topo">
                  <div>
                    <span>Painel da igreja</span>
                    <strong>EBD Fiel</strong>
                  </div>
                  <Icone nome="painel" className="icone-svg" />
                </div>

                <div className="mini-grid">
                  <div>
                    <Icone nome="classes" className="icone-svg" />
                    <strong>Classes</strong>
                    <span>Organizadas</span>
                  </div>
                  <div>
                    <Icone nome="alunos" className="icone-svg" />
                    <strong>Alunos</strong>
                    <span>Cadastrados</span>
                  </div>
                  <div>
                    <Icone nome="chamada" className="icone-svg" />
                    <strong>Chamada</strong>
                    <span>Digital</span>
                  </div>
                  <div>
                    <Icone nome="relatorios" className="icone-svg" />
                    <strong>Relatórios</strong>
                    <span>PDF</span>
                  </div>
                </div>

                <div className="linha-progresso-publica">
                  <span>Frequência mensal</span>
                  <strong>87%</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="secao-publica" id="recursos">
            <div className="cabecalho-secao-publica">
              <span className="selo-publico">Recursos principais</span>
              <h2>Tudo que a secretaria da EBD precisa em um só lugar.</h2>
            </div>

            <div className="grade-recursos-publicos">
              <article>
                <Icone nome="classes" className="icone-recurso-publico" />
                <h3>Classes e professores</h3>
                <p>Cadastre turmas, professores e acompanhe a matrícula de cada classe.</p>
              </article>
              <article>
                <Icone nome="alunos" className="icone-recurso-publico" />
                <h3>Alunos organizados</h3>
                <p>Tenha uma lista clara de alunos com busca, filtros e vínculo por classe.</p>
              </article>
              <article>
                <Icone nome="chamada" className="icone-recurso-publico" />
                <h3>Chamada digital</h3>
                <p>Registre presença, faltas, visitantes, Bíblias, revistas e ofertas.</p>
              </article>
              <article>
                <Icone nome="relatorios" className="icone-recurso-publico" />
                <h3>Relatórios em PDF</h3>
                <p>Gere relatórios prontos para imprimir, salvar e apresentar à liderança.</p>
              </article>
            </div>
          </section>

          <section className="secao-publica secao-beneficios-publica" id="beneficios">
            <div>
              <span className="selo-publico">Por que usar</span>
              <h2>Mais organização, menos papel e dados sempre disponíveis.</h2>
              <p>
                O sistema foi pensado para igrejas que querem profissionalizar a gestão
                da Escola Bíblica Dominical sem complicar a rotina dos professores.
              </p>
            </div>

            <ul className="lista-beneficios-publicos">
              <li>Interface simples para uso no computador ou celular.</li>
              <li>Dados salvos online automaticamente.</li>
              <li>Relatórios com dados da igreja e cabeçalho personalizado.</li>
              <li>Visual profissional para apresentar o projeto aos clientes.</li>
            </ul>
          </section>

          <section className="secao-publica" id="planos">
            <div className="cartao-plano-publico">
              <span className="selo-publico">Comercialização</span>
              <h2>Pronto para oferecer para outras igrejas.</h2>
              <p>
                Comece com acesso controlado e personalize os dados de cada igreja.
                O próximo passo pode ser adicionar planos, permissões e cadastro
                separado por igreja.
              </p>
              <div className="acoes-publicas">
                <a
                  className="botao-principal link-botao-publico"
                  href="https://wa.me/5527928345844?text=Ol%C3%A1%21%20Quero%20conhecer%20o%20EBD%20Fiel%20e%20solicitar%20mais%20informa%C3%A7%C3%B5es."
                  target="_blank"
                  rel="noreferrer"
                >
                  Quero conhecer
                </a>
                <button
                  className="botao-secundario"
                  type="button"
                  onClick={() => setTelaPublica('login')}
                >
                  Já sou cliente
                </button>
              </div>
            </div>
          </section>
        </main>
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
      console.error(error)
      alert(error?.message || 'Erro ao salvar usuário.')
      return
    }

    const { error: erroRemoverVinculos } = await supabase
      .from('classes_professores')
      .delete()
      .eq('perfil_usuario_id', perfilSalvo.id)

    if (erroRemoverVinculos) {
      console.error(erroRemoverVinculos)
      alert(erroRemoverVinculos?.message || 'Erro ao atualizar vínculos do professor.')
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
        console.error(erroInserirVinculos)
        alert(erroInserirVinculos?.message || 'Erro ao vincular professor às classes.')
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
      console.error(error)
      alert(error?.message || 'Erro ao remover perfil.')
      return
    }

    await buscarTodosOsDados()
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
              Controle classes, alunos, chamadas e relatórios da Escola Bíblica Dominical
              com uma estrutura pronta para uso e comercialização.
            </p>

            <div className="hero-acoes">
              {usuarioEhSecretaria() && (
                <button className="botao-principal" onClick={() => setPaginaAtual('configuracoes')}>
                  Ajustar dados da igreja
                </button>
              )}
              <button className="botao-secundario" onClick={() => setPaginaAtual('relatorios')}>
                Ver relatórios
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
                        {pessoa.tipo} • {pessoa.detalhe}
                      </p>
                    </div>
                    <span>
                      {formatarDataNascimento(pessoa.dataNascimento)} • {descreverAniversario(pessoa.dias)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="texto-sem-aniversariantes">
                Nenhum aniversário cadastrado para os próximos 7 dias.
              </p>
            )}
          </div>
        )}

        <div className="grade-resumos-comerciais">
          <div className="resumo resumo-comercial">
            <h3>Visual pronto para comercialização</h3>
            <p>
              O sistema agora possui aparência mais profissional, menu com ícones e área
              de configurações para personalizar os dados de cada igreja.
            </p>
          </div>

          <div className="resumo resumo-comercial resumo-alerta-claro">
            <h3>Personalização da igreja</h3>
            <p>
              {configuracaoIgreja.nome_igreja
                ? 'Os dados da igreja já estão configurados e serão usados nos relatórios e PDFs.'
                : 'Preencha os dados da igreja em Configurações para exibir nome, endereço e contatos nos relatórios.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  function renderizarFormularioProfessorClasse() {
    if (!mostrarFormularioAluno || novoAluno.tipoPessoa !== 'professor') {
      return null
    }

    return (
      <form className="formulario formulario-professor-classe" onSubmit={salvarAluno}>
        <div className="topo-formulario-inline">
          <div>
            <h3>{alunoEditandoId ? 'Editar professor' : 'Novo professor'}</h3>
            <p>
              Este cadastro também aparece no menu Professores e na Chamada dos professores.
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
              placeholder="Ex: Leandro Silva"
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
          <button className="botao-principal" type="submit">
            {alunoEditandoId ? 'Salvar alterações' : 'Salvar professor'}
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
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Classes</h2>
            <p>Gerencie as classes e também cadastre, edite ou exclua professores vinculados a cada classe.</p>
          </div>

          {!mostrarFormularioClasse && (
            <button className="botao-principal" onClick={abrirNovaClasse}>
              Nova classe
            </button>
          )}
        </div>

        {mostrarFormularioClasse && (
          <form className="formulario" onSubmit={salvarClasse}>
            <label>
              Nome da classe
              <input
                type="text"
                value={novaClasse.nome}
                onChange={(event) =>
                  setNovaClasse({ ...novaClasse, nome: event.target.value })
                }
                placeholder="Ex: Adolescentes"
              />
            </label>

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {classeEditandoId ? 'Salvar alterações' : 'Salvar classe'}
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

        <div className="aviso aviso-classes-professores">
          <p>
            Você pode gerenciar professores por aqui ou pelo menu <strong>Professores</strong>.
            Os dois lugares usam o mesmo cadastro e ficam sempre sincronizados.
          </p>
        </div>

        <div className="lista">
          {classes.map((classe) => {
            const professoresDaClasse = buscarProfessoresDaClasse(classe.id)

            return (
            <div className="item-lista item-com-acoes" key={classe.id}>
              <div>
                <h3>{classe.nome}</h3>
                <p>Professores: {buscarTextoProfessoresDaClasse(classe.id)}</p>
                <p>Matrícula: {calcularMatriculaDaClasse(classe.id)} alunos</p>

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

              <div className="acoes-item">
                <button
                  className="botao-principal botao-sem-margem"
                  onClick={() => abrirNovoProfessorDaClasse(classe.id)}
                >
                  Novo professor
                </button>

                <button
                  className="botao-editar"
                  onClick={() => editarClasse(classe)}
                >
                  Editar classe
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
      ? 'Cadastre, edite e organize os professores. A classe de referência também atualiza a lista de professores em Classes.'
      : usuarioEhProfessor()
        ? 'Veja os alunos vinculados às suas classes.'
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
              <button className="botao-principal" type="submit">
                {alunoEditandoId ? 'Salvar alterações' : 'Salvar cadastro'}
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
                <p>Classe de referência: {buscarNomeClasse(aluno.classeId)}</p>
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
    if (!usuarioEhSecretaria()) {
      alert('Apenas a secretaria pode salvar a chamada dos professores.')
      return
    }

    const professores = buscarProfessoresDaIgreja()

    if (professores.length === 0) {
      alert('Ainda não há professores cadastrados em Usuários.')
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
      data: buscarDataAtual(),
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
      alert(error?.message || 'Erro ao salvar chamada dos professores.')
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
                    Você só verá as classes vinculadas pela secretaria.
                  </small>
                )}
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

            {classeChamadaId && alunosDaClasse.length === 0 && (
              <div className="aviso">
                <p>Essa classe ainda não possui alunos cadastrados.</p>
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
                            presencas[aluno.id] === 'presente'
                              ? 'botao-presenca ativo-presente'
                              : 'botao-presenca'
                          }
                          onClick={() => alterarPresenca(aluno.id, 'presente')}
                        >
                          Presente
                        </button>

                        <button
                          className={
                            presencas[aluno.id] === 'faltou'
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

    return (
      <section className="conteudo">
        <div className="topo-pagina no-print">
          <div>
            <h2>Relatórios</h2>
            <p>
              {usuarioEhProfessor()
                ? 'Relatório da sua classe no modelo da Escola Bíblica Dominical.'
                : 'Relatório geral no modelo da Escola Bíblica Dominical.'}
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

        <div className="cards no-print">
          <div className="card">
            <h3>Classes</h3>
            <p>{classes.length} cadastradas</p>
          </div>

          <div className="card">
            <h3>Alunos</h3>
            <p>{alunosSomente().length} cadastrados</p>
          </div>

          <div className="card">
            <h3>Chamadas</h3>
            <p>{chamadasSalvas.length} salvas</p>
          </div>

          <div className="card destaque">
            <h3>Frequência geral</h3>
            <p>{calcularFrequenciaGeral()}%</p>
          </div>

          {usuarioEhSecretaria() && (
            <div className="card">
              <h3>Professores</h3>
              <p>{professoresSomente().length} cadastrados</p>
              <p>
                {calcularTotalProfessoresPresentes()} presenças •{' '}
                {calcularTotalProfessoresFaltas()} faltas •{' '}
                {calcularTotalProfessoresJustificadas()} justificadas
              </p>
            </div>
          )}
        </div>

        <div className="relatorio-folha">
          <div className="cabecalho-relatorio">
            <img
              src="/logo-ebd-fiel.png"
              alt="Logo EBD Fiel"
              className="logo-relatorio"
            />
            <h3>{configuracaoIgreja.nome_igreja || 'Relatório do Domingo'}</h3>
            {configuracaoIgreja.congregacao && <p>{configuracaoIgreja.congregacao}</p>}
            {configuracaoIgreja.pastor_dirigente && (
              <p>Dirigente: {configuracaoIgreja.pastor_dirigente}</p>
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
              <input
                type="text"
                value={configuracaoIgreja.estado}
                onChange={(event) =>
                  alterarConfiguracaoIgreja('estado', event.target.value)
                }
                placeholder="Ex: SP"
                maxLength="2"
              />
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
          {montarEnderecoIgreja() && <p>{montarEnderecoIgreja()}</p>}
        </div>
      </section>
    )
  }

  function renderizarPagina() {
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
    if (paginaAtual === 'configuracoes') return renderizarConfiguracoes()

    return renderizarPainel()
  }

  return (
    <div className="app">
      <aside className="menu-lateral">
        <div className="marca-sidebar">
          <div className="logo-simbolo logo-simbolo-sidebar">
            <img
              src="/logo-ebd-fiel.png"
              alt="Logo EBD Fiel"
              className="logo-imagem"
            />
          </div>
          <div>
            <h1>EBD Fiel</h1>
            <p>Gestão da Escola Bíblica</p>
          </div>
        </div>

        <nav className="menu-navegacao">
          {menu.filter(menuPermitidoParaUsuario).map((item) => (
            <button
              key={item.id}
              className={paginaAtual === item.id ? 'ativo' : ''}
              onClick={() => setPaginaAtual(item.id)}
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
            {usuarioEhProfessor() ? 'Professor' : 'Secretaria'}
          </span>

          <button className="botao-secundario botao-sair-sidebar" onClick={sairDoSistema}>
            <Icone nome="sair" className="icone-svg" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="area-principal">{renderizarPagina()}</main>
    </div>
  )
}

export default App
