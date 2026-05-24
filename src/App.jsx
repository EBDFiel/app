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
  { id: 1, nome: 'Pedro Silva', classeId: 1, telefone: '(11) 99999-0000' },
  { id: 2, nome: 'Maria Souza', classeId: 2, telefone: '' },
  { id: 3, nome: 'João Santos', classeId: 3, telefone: '(11) 98888-1111' },
]

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

  const [classes, setClasses] = useState([])
  const [alunos, setAlunos] = useState([])
  const [chamadasSalvas, setChamadasSalvas] = useState([])
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
  })

  const [buscaAluno, setBuscaAluno] = useState('')
  const [filtroClasseAluno, setFiltroClasseAluno] = useState('')

  const [classeChamadaId, setClasseChamadaId] = useState('')
  const [presencas, setPresencas] = useState({})
  const [dadosExtrasChamada, setDadosExtrasChamada] = useState({
    visitantes: '',
    biblias: '',
    revistas: '',
    ofertas: '',
  })

  const menu = [
    { id: 'painel', nome: 'Painel' },
    { id: 'classes', nome: 'Classes' },
    { id: 'alunos', nome: 'Alunos' },
    { id: 'chamada', nome: 'Chamada' },
    { id: 'relatorios', nome: 'Relatórios' },
    { id: 'configuracoes', nome: 'Configurações' },
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
        await carregarDadosOnline()
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
    setMostrarFormularioClasse(false)
    setMostrarFormularioAluno(false)
    setClasseEditandoId(null)
    setAlunoEditandoId(null)
    setNovaClasse({ nome: '', professor: '' })
    setNovoAluno({ nome: '', classeId: '', telefone: '' })
    setBuscaAluno('')
    setFiltroClasseAluno('')
    setClasseChamadaId('')
    setPresencas({})
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

      await carregarDadosOnline()
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

  async function carregarDadosOnline() {
    setCarregando(true)
    setErroSistema('')

    try {
      const { data: classesBanco, error: erroClasses } = await supabase
        .from('classes')
        .select('*')
        .order('id', { ascending: true })

      if (erroClasses) {
        throw erroClasses
      }

      if (!classesBanco || classesBanco.length === 0) {
        await inserirDadosIniciais()
      }

      await buscarTodosOsDados()
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

  async function inserirDadosIniciais() {
    const classesParaSalvar = classesIniciais.map((classe) => ({
      id: classe.id,
      nome: classe.nome,
      professor: classe.professor,
    }))

    const alunosParaSalvar = alunosIniciais.map((aluno) => ({
      id: aluno.id,
      nome: aluno.nome,
      classe_id: aluno.classeId,
      telefone: aluno.telefone,
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

  async function buscarTodosOsDados() {
    const { data: classesBanco, error: erroClasses } = await supabase
      .from('classes')
      .select('*')
      .order('id', { ascending: true })

    if (erroClasses) {
      throw erroClasses
    }

    const { data: alunosBanco, error: erroAlunos } = await supabase
      .from('alunos')
      .select('*')
      .order('id', { ascending: true })

    if (erroAlunos) {
      throw erroAlunos
    }

    const { data: chamadasBanco, error: erroChamadas } = await supabase
      .from('chamadas')
      .select('*')
      .order('id', { ascending: true })

    if (erroChamadas) {
      throw erroChamadas
    }

    const { data: configuracoesBanco, error: erroConfiguracoes } = await supabase
      .from('configuracoes_igreja')
      .select('*')
      .eq('user_id', sessao?.user?.id)
      .order('created_at', { ascending: true })

    if (erroConfiguracoes) {
      throw erroConfiguracoes
    }

    setClasses(
      classesBanco.map((classe) => ({
        id: Number(classe.id),
        nome: classe.nome,
        professor: classe.professor,
      }))
    )

    setAlunos(
      alunosBanco.map((aluno) => ({
        id: Number(aluno.id),
        nome: aluno.nome,
        classeId: Number(aluno.classe_id),
        telefone: aluno.telefone || '',
      }))
    )

    setChamadasSalvas(
      chamadasBanco.map((chamada) => ({
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

  function calcularMatriculaDaClasse(classeId) {
    return alunos.filter((aluno) => aluno.classeId === Number(classeId)).length
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

    if (!novaClasse.nome.trim() || !novaClasse.professor.trim()) {
      alert('Preencha o nome da classe e o professor.')
      return
    }

    if (classeEditandoId) {
      const { error } = await supabase
        .from('classes')
        .update({
          nome: novaClasse.nome,
          professor: novaClasse.professor,
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

  function abrirNovoAluno() {
    setNovoAluno({ nome: '', classeId: '', telefone: '' })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(true)
  }

  function editarAluno(aluno) {
    setNovoAluno({
      nome: aluno.nome,
      classeId: String(aluno.classeId),
      telefone: aluno.telefone,
    })
    setAlunoEditandoId(aluno.id)
    setMostrarFormularioAluno(true)
  }

  function cancelarFormularioAluno() {
    setNovoAluno({ nome: '', classeId: '', telefone: '' })
    setAlunoEditandoId(null)
    setMostrarFormularioAluno(false)
  }

  async function salvarAluno(event) {
    event.preventDefault()

    if (!novoAluno.nome.trim() || !novoAluno.classeId) {
      alert('Preencha o nome do aluno e selecione uma classe.')
      return
    }

    const alunoBanco = {
      nome: novoAluno.nome,
      classe_id: Number(novoAluno.classeId),
      telefone: novoAluno.telefone,
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

  function filtrarAlunos() {
    return alunos.filter((aluno) => {
      const nomeCombina = aluno.nome
        .toLowerCase()
        .includes(buscaAluno.toLowerCase())

      const classeCombina =
        !filtroClasseAluno || aluno.classeId === Number(filtroClasseAluno)

      return nomeCombina && classeCombina
    })
  }

  function limparFiltrosAlunos() {
    setBuscaAluno('')
    setFiltroClasseAluno('')
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

    if (!sessao?.user?.id) {
      alert('Usuário não identificado. Faça login novamente.')
      return
    }

    setSalvandoConfiguracaoIgreja(true)

    const dadosConfiguracao = {
      user_id: sessao.user.id,
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

      await buscarTodosOsDados()
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
      <div className="app">
        <aside className="menu-lateral">
          <h1>EBD Fiel</h1>
        </aside>

        <main className="area-principal">
          <section className="conteudo">
            <h2>Verificando acesso...</h2>
            <p>Aguarde um momento.</p>
          </section>
        </main>
      </div>
    )
  }

  if (!sessao) {
    return (
      <div className="app">
        <aside className="menu-lateral">
          <h1>EBD Fiel</h1>
        </aside>

        <main className="area-principal">
          <section className="conteudo">
            <h2>Acesso restrito</h2>
            <p>Entre com seu e-mail e senha para acessar o sistema.</p>

            <form className="formulario" onSubmit={entrarComEmailSenha}>
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
                className="botao-principal"
                type="submit"
                disabled={carregandoLogin}
              >
                {carregandoLogin ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  if (carregando) {
    return (
      <div className="app">
        <aside className="menu-lateral">
          <h1>EBD Fiel</h1>
        </aside>

        <main className="area-principal">
          <section className="conteudo">
            <h2>Carregando...</h2>
            <p>Buscando dados no Supabase.</p>
          </section>
        </main>
      </div>
    )
  }

  if (erroSistema) {
    return (
      <div className="app">
        <aside className="menu-lateral">
          <h1>EBD Fiel</h1>
        </aside>

        <main className="area-principal">
          <section className="conteudo">
            <h2>Erro ao carregar</h2>
            <p>{erroSistema}</p>

            <button className="botao-principal" onClick={carregarDadosOnline}>
              Tentar novamente
            </button>
          </section>
        </main>
      </div>
    )
  }

  function renderizarPainel() {
    return (
      <section className="conteudo">
        <h2>Painel</h2>
        <p>Bem-vindo ao painel do {buscarNomeIgrejaParaExibicao()}.</p>

        <div className="cards">
          <div className="card">
            <h3>Classes</h3>
            <p>{classes.length} classes cadastradas.</p>
          </div>

          <div className="card">
            <h3>Alunos</h3>
            <p>{alunos.length} alunos cadastrados.</p>
          </div>

          <div className="card">
            <h3>Chamadas</h3>
            <p>{chamadasSalvas.length} chamadas salvas.</p>
          </div>
        </div>

        <div className="resumo">
          <h3>{buscarNomeIgrejaParaExibicao()}</h3>
          <p>Os dados são carregados e salvos automaticamente no Supabase.</p>
          {!configuracaoIgreja.nome_igreja && (
            <p>Preencha os dados da igreja em Configurações para personalizar os relatórios.</p>
          )}
        </div>
      </section>
    )
  }

  function renderizarClasses() {
    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Classes</h2>
            <p>Gerencie as classes da Escola Bíblica Dominical.</p>
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

            <label>
              Professor
              <input
                type="text"
                value={novaClasse.professor}
                onChange={(event) =>
                  setNovaClasse({
                    ...novaClasse,
                    professor: event.target.value,
                  })
                }
                placeholder="Ex: Irmão João"
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

        <div className="lista">
          {classes.map((classe) => (
            <div className="item-lista item-com-acoes" key={classe.id}>
              <div>
                <h3>{classe.nome}</h3>
                <p>Professor: {classe.professor}</p>
                <p>Matrícula: {calcularMatriculaDaClasse(classe.id)} alunos</p>
              </div>

              <div className="acoes-item">
                <button
                  className="botao-editar"
                  onClick={() => editarClasse(classe)}
                >
                  Editar
                </button>

                <button
                  className="botao-excluir"
                  onClick={() => excluirClasse(classe.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderizarAlunos() {
    const alunosFiltrados = filtrarAlunos()

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Alunos</h2>
            <p>Cadastre, edite, busque e organize os alunos por classe.</p>
          </div>

          {!mostrarFormularioAluno && (
            <button className="botao-principal" onClick={abrirNovoAluno}>
              Novo aluno
            </button>
          )}
        </div>

        {mostrarFormularioAluno && (
          <form className="formulario" onSubmit={salvarAluno}>
            <label>
              Nome do aluno
              <input
                type="text"
                value={novoAluno.nome}
                onChange={(event) =>
                  setNovoAluno({ ...novoAluno, nome: event.target.value })
                }
                placeholder="Ex: Ana Clara"
              />
            </label>

            <label>
              Classe
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

            <div className="grupo-botoes">
              <button className="botao-principal" type="submit">
                {alunoEditandoId ? 'Salvar alterações' : 'Salvar aluno'}
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
            Buscar aluno
            <input
              type="text"
              value={buscaAluno}
              onChange={(event) => setBuscaAluno(event.target.value)}
              placeholder="Digite o nome do aluno"
            />
          </label>

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

          <button className="botao-secundario" onClick={limparFiltrosAlunos}>
            Limpar filtros
          </button>
        </div>

        <p className="contador-resultados">
          Mostrando {alunosFiltrados.length} de {alunos.length} alunos
        </p>

        <div className="lista">
          {alunosFiltrados.map((aluno) => (
            <div className="item-lista item-com-acoes" key={aluno.id}>
              <div>
                <h3>{aluno.nome}</h3>
                <p>Classe: {buscarNomeClasse(aluno.classeId)}</p>
                {aluno.telefone && <p>Telefone: {aluno.telefone}</p>}
              </div>

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
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderizarChamada() {
    const alunosDaClasse = alunos.filter(
      (aluno) => aluno.classeId === Number(classeChamadaId)
    )

    return (
      <section className="conteudo">
        <div className="topo-pagina">
          <div>
            <h2>Chamada</h2>
            <p>Marque a presença dos alunos e informe os dados extras.</p>
          </div>
        </div>

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
              Salvar chamada
            </button>
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
            <p>Relatório geral no modelo da Escola Bíblica Dominical.</p>
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
            <p>{alunos.length} cadastrados</p>
          </div>

          <div className="card">
            <h3>Chamadas</h3>
            <p>{chamadasSalvas.length} salvas</p>
          </div>

          <div className="card destaque">
            <h3>Frequência geral</h3>
            <p>{calcularFrequenciaGeral()}%</p>
          </div>
        </div>

        <div className="relatorio-folha">
          <div className="cabecalho-relatorio">
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
    if (paginaAtual === 'painel') return renderizarPainel()
    if (paginaAtual === 'classes') return renderizarClasses()
    if (paginaAtual === 'alunos') return renderizarAlunos()
    if (paginaAtual === 'chamada') return renderizarChamada()
    if (paginaAtual === 'relatorios') return renderizarRelatorios()
    if (paginaAtual === 'configuracoes') return renderizarConfiguracoes()

    return renderizarPainel()
  }

  return (
    <div className="app">
      <aside className="menu-lateral">
        <h1>EBD Fiel</h1>

        <nav>
          {menu.map((item) => (
            <button
              key={item.id}
              className={paginaAtual === item.id ? 'ativo' : ''}
              onClick={() => setPaginaAtual(item.id)}
            >
              {item.nome}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: '24px', padding: '0 12px' }}>
          <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
            Logado como:
            <br />
            {sessao?.user?.email}
          </p>

          <button className="botao-secundario" onClick={sairDoSistema}>
            Sair
          </button>
        </div>
      </aside>

      <main className="area-principal">{renderizarPagina()}</main>
    </div>
  )
}

export default App
