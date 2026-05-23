 import { useEffect, useState } from 'react'
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

  const [classes, setClasses] = useState([])
  const [alunos, setAlunos] = useState([])
  const [chamadasSalvas, setChamadasSalvas] = useState([])

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
  ]

  useEffect(() => {
    carregarDadosOnline()
  }, [])

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
        <p>Bem-vindo ao painel do EBD Fiel.</p>

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
          <h3>Banco online conectado</h3>
          <p>Os dados são carregados e salvos automaticamente no Supabase.</p>
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
                Ofertas
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={dadosExtrasChamada.ofertas}
                  onChange={(event) =>
                    alterarDadosExtras('ofertas', event.target.value)
                  }
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

          <button className="botao-principal" onClick={() => window.print()}>
            Imprimir relatório
          </button>
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
            <h3>Relatório do Domingo</h3>
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

  function renderizarPagina() {
    if (paginaAtual === 'painel') return renderizarPainel()
    if (paginaAtual === 'classes') return renderizarClasses()
    if (paginaAtual === 'alunos') return renderizarAlunos()
    if (paginaAtual === 'chamada') return renderizarChamada()
    if (paginaAtual === 'relatorios') return renderizarRelatorios()

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
      </aside>

      <main className="area-principal">{renderizarPagina()}</main>
    </div>
  )
}

export default App