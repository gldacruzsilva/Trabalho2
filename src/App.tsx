import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './services/api'; 
import { type FilmeSalvo, type FilmeTMDB, type Usuario } from './types/Filmes';
import { 
  obterFilmesPopularesTMDB, 
  buscarFilmesTMDB, 
  buscarPorCategoriaTMDB 
} from './services/tmdbApi'; 
import { tmdbApi } from './services/tmdbApi';
import { MovieCard } from './components/MovieCard';
import { MovieCarousel } from './components/MovieCarousel';
import { MovieDetails } from './pages/MovieDetails';
import { TopRated } from './pages/TopRated'; 
import { Watchlist } from './pages/WatchList';
import { Profile } from './pages/Profile';
import { RatingModal } from './components/RatingModal';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';



// 1. INTERFACES DE TIPAGEM
interface FilmeEstruturado {
  id?: number;
  tmdbId?: number;
  title?: string;
  titulo?: string;
  poster_path?: string | null;
  poster?: string | null;
  avaliacaoPessoal?: number;
  comentario?: string;
}

interface AbaLinkProps {
  nome: string;
  target: 'home' | 'top-rated' | 'watchlist' | 'perfil';
  telaAtiva: string;
  setTelaAtiva: (tela: 'home' | 'top-rated' | 'watchlist' | 'perfil') => void;
}

// 2. COMPONENTE DE NAVEGAÇÃO
function AbaLink({ nome, target, telaAtiva, setTelaAtiva }: AbaLinkProps) {
  return (
    <button 
      className="btn btn-sm rounded-pill border-0 px-3 fw-medium d-none d-md-inline"
      style={{ 
        backgroundColor: telaAtiva === target ? '#2f2f31' : 'transparent', 
        color: telaAtiva === target ? '#d4af37' : '#e3e3e3' 
      }}
      onClick={() => setTelaAtiva(target)}
    >
      {nome}
    </button>
  );
}

const CATEGORIAS = [
  { id: 0, nome: 'Todos em Alta' },
  { id: 28, nome: 'Ação' },
  { id: 35, nome: 'Comédia' },
  { id: 18, nome: 'Drama' },
  { id: 878, nome: 'Ficção Científica' },
  { id: 27, nome: 'Terror' },
  { id: 10749, nome: 'Romance' }
];

// 3. COMPONENTE PRINCIPAL
function App() {
  const queryClient = useQueryClient();

  // ESTADOS DE AUTENTICAÇÃO
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [modoAuth, setModoAuth] = useState<'login' | 'cadastro'>('login');
  const [nomeForm, setNomeForm] = useState('');
  const [emailForm, setEmailForm] = useState('');
  const [senhaForm, setSenhaForm] = useState('');
  
  // ESTADOS DE NAVEGAÇÃO E FILTROS
  const [telaAtiva, setTelaAtiva] = useState<'home' | 'detalhes' | 'top-rated' | 'watchlist' | 'perfil'>('home');
  const [idFilmeDetalhado, setIdFilmeDetalhado] = useState<number | null>(null);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0); 
  const [ordenacao, setOrdenacao] = useState<'populares' | 'az'>('populares');

  // ESTADOS DO MODAL DE AVALIAÇÃO
  const [modalAberto, setModalAberto] = useState(false);
  const [filmeParaAvaliar, setFilmeParaAvaliar] = useState<FilmeEstruturado | null>(null);

  // QUERIES DO BANCO LOCAL (JSON-SERVER)
  const { data: todosOsFilmesGerais, isLoading: carregandoBanco } = useQuery<FilmeSalvo[]>({
    queryKey: ['todos-filmes-gerais'],
    queryFn: async () => {
      const res = await api.get('/filmes');
      return res.data;
    }
  });

  // QUERIES DA API DO TMDB
  const { data: filmesCatalogo, isLoading: carregandoCatalogo } = useQuery<FilmeTMDB[]>({
    queryKey: ['filmes-tmdb-catalogo', categoriaSelecionada],
    queryFn: () => categoriaSelecionada === 0 
      ? obterFilmesPopularesTMDB() 
      : buscarPorCategoriaTMDB(categoriaSelecionada)
  });

  const { data: resultadosPesquisa } = useQuery<FilmeTMDB[]>({
    queryKey: ['pesquisa-filmes', pesquisa],
    queryFn: () => buscarFilmesTMDB(pesquisa),
    enabled: pesquisa.length > 2
  });

  const { data: detalheFilmeObjeto } = useQuery({
  queryKey: ['detalhe-filme-tmdb', idFilmeDetalhado],
  queryFn: async () => {
    if (!idFilmeDetalhado) return null;

    try {
      const response = await tmdbApi.get(
        `/movie/${idFilmeDetalhado}`,
        {
          params: {
            language: 'pt-BR'
          }
        }
      );

      return response.data;
    } catch (erro) {
      console.error('Erro ao buscar detalhes:', erro);

      const local =
        filmesCatalogo?.find(f => f.id === idFilmeDetalhado);

      return (
        local || {
          id: idFilmeDetalhado,
          title: 'Filme não encontrado'
        }
      );
    }
  },
  enabled: !!idFilmeDetalhado
});

  // MÉTODOS AUXILIARES
  const obterMediaFilme = (tmdbId: number) => {
    if (!todosOsFilmesGerais) return { media: 0, string: '0.0' };
    const notasValidas = todosOsFilmesGerais.filter((f: FilmeSalvo) => f.tmdbId === tmdbId && f.avaliacaoPessoal > 0);
    if (notasValidas.length === 0) return { media: 0, string: 'Sem Notas' };
    const media = notasValidas.reduce((acc, f) => acc + f.avaliacaoPessoal, 0) / notasValidas.length;
    return { media, string: media.toFixed(1) };
  };

  const meusFilmes = todosOsFilmesGerais?.filter((f: FilmeSalvo) => f.usuarioId === usuarioLogado?.id) || [];
  const meusAssistidos = meusFilmes.filter((f: FilmeSalvo) => f.avaliacaoPessoal > 0);
  const meusQueroAssistir = meusFilmes.filter((f: FilmeSalvo) => f.avaliacaoPessoal === 0);

  const filmesExibidosHome = filmesCatalogo ? [...filmesCatalogo] : [];
  if (ordenacao === 'az') {
    filmesExibidosHome.sort((a, b) => a.title.localeCompare(b.title));
  }

  // EVENTO DE LOGIN E CADASTRO (TEXTO LIMPO PARA TESTES)
  const lidarComAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoAuth === 'login') {
        const response = await api.get<Usuario[]>(`/usuarios?email=${emailForm}`);
        if (response.data.length > 0) {
          const user = response.data[0];
          if (user.senha === senhaForm) {
            setUsuarioLogado(user);
          } else {
            toast.error('Senha incorreta!');
          }
        } else {
          toast.error('E-mail não cadastrado!');
        }
      } else {
        const checarEmail = await api.get<Usuario[]>(`/usuarios?email=${emailForm}`);
        if (checarEmail.data.length > 0) {
          toast.error('Este e-mail já está em uso!');
          return;
        }

        const novoUsuario = { nome: nomeForm, email: emailForm, senha: senhaForm };
        const resCadastro = await api.post<Usuario>('/usuarios', novoUsuario);
        setUsuarioLogado(resCadastro.data);
        toast.success('Conta criada com sucesso!');
      }
    } catch { 
      toast.error('Erro de conexão com o banco de dados.'); 
    }
  };

  // ADICIONAR OU EDITAR CRÍTICA
  const salvarAvaliacaoNoBanco = async (
  nota: number,
  comentario: string
) => {
  if (!filmeParaAvaliar || !usuarioLogado) return;

  const tmdbId =
    filmeParaAvaliar.tmdbId ?? filmeParaAvaliar.id;

  const payload = {
    tmdbId,
    usuarioId: usuarioLogado.id,
    titulo:
      filmeParaAvaliar.titulo ||
      filmeParaAvaliar.title,
    poster:
      filmeParaAvaliar.poster ||
      filmeParaAvaliar.poster_path,
    avaliacaoPessoal: nota,
    comentario
  };

  try {
    const filmeExistente = todosOsFilmesGerais?.find(
      (filme) =>
        filme.tmdbId === tmdbId &&
        filme.usuarioId === usuarioLogado.id
    );

    if (filmeExistente) {
      await api.put(
        `/filmes/${filmeExistente.id}`,
        payload
      );

      toast.success('Avaliação atualizada!');
    } else {
      await api.post('/filmes', payload);

      toast.success('Filme avaliado com sucesso!');
    }

    await queryClient.invalidateQueries({
      queryKey: ['todos-filmes-gerais']
    });

    setModalAberto(false);
  } catch (erro) {
    console.error('Erro ao salvar avaliação:', erro);

    toast.error(
      'Não foi possível salvar a avaliação.'
    );
  }
};

  // ADICIONAR À LISTA DE DESEJOS (WATCHLIST)
  const adicionarAWatchlist = async (filme: FilmeEstruturado) => {
  if (!usuarioLogado) return;

  const idParaVerificar = filme.id || filme.tmdbId;

  // Verifica se o filme já existe para este usuário
  const jaExiste = todosOsFilmesGerais?.find(
    f => f.tmdbId === idParaVerificar && f.usuarioId === usuarioLogado.id
  );

  if (jaExiste) {
    toast.warn('Este filme já está na sua lista ou já foi avaliado!');
    return;
  }

  const payload = {
    tmdbId: idParaVerificar,
    usuarioId: usuarioLogado.id,
    titulo: filme.title || filme.titulo,
    poster: filme.poster_path || filme.poster,
    avaliacaoPessoal: 0,
    comentario: 'Na Lista'
  };

  try {
    await api.post('/filmes', payload);
    queryClient.invalidateQueries({ queryKey: ['todos-filmes-gerais'] });
    toast.success('Filme adicionado à sua lista!');
  } catch {
    toast.error('Erro ao adicionar filme.');
  }
};

  // EXCLUIR REGISTRO DO DIÁRIO
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [filmeParaExcluir, setFilmeParaExcluir] = useState<number | null>(null);
  const excluirFilmeDoBanco = (idBanco: number) => {
  setFilmeParaExcluir(idBanco);
  setShowDeleteModal(true);
};
const confirmarExclusao = async () => {
  if (filmeParaExcluir === null) return;

  try {
    await api.delete(`/filmes/${filmeParaExcluir}`);

    queryClient.invalidateQueries({
      queryKey: ['todos-filmes-gerais']
    });

    toast.success('Filme removido com sucesso!');
  } catch {
    toast.error('Erro ao deletar filme.');
  } finally {
    setShowDeleteModal(false);
    setFilmeParaExcluir(null);
  }
};

  if (carregandoBanco || carregandoCatalogo) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#131314', color: '#e3e3e3', minHeight: '100vh' }}>
        <div className="spinner-border mb-3" style={{ color: '#d4af37' }}></div>
      </div>
    );
  }

  // TELA DE AUTH (LOGIN / CADASTRO)
  if (!usuarioLogado) {
    return (
      <div style={{ backgroundColor: '#131314', minHeight: '100vh', color: '#e3e3e3' }} className="d-flex align-items-center justify-content-center p-3">
        <div className="card p-5 border-0 rounded-4 shadow-lg w-100" style={{ backgroundColor: '#1e1e20', maxWidth: '420px' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-2 text-white" style={{ background: 'linear-gradient(90deg, #b8860b, #e6ca65, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Filmes
            </h3>
            <p className="small text-white-50">{modoAuth === 'login' ? 'Entre na sua conta' : 'Crie sua conta grátis'}</p>
          </div>
          <form onSubmit={lidarComAuth}>
            {modoAuth === 'cadastro' && (
              <input type="text" className="form-control text-white border-0 py-2.5 px-3 mb-3 fw-medium" style={{ backgroundColor: '#131314' }} placeholder="Seu Nome completo" value={nomeForm} onChange={e => setNomeForm(e.target.value)} required />
            )}
            <input type="email" className="form-control text-white border-0 py-2.5 px-3 mb-3 fw-medium" style={{ backgroundColor: '#131314' }} placeholder="E-mail" value={emailForm} onChange={e => setEmailForm(e.target.value)} required />
            <input type="password" className="form-control text-white border-0 py-2.5 px-3 mb-4 fw-medium" style={{ backgroundColor: '#131314' }} placeholder="Senha" value={senhaForm} onChange={e => setSenhaForm(e.target.value)} required />
            
            <button className="btn w-100 fw-bold py-2 text-dark border-0 mb-3" style={{ background: 'linear-gradient(90deg, #e6ca65, #d4af37)', borderRadius: '100px' }}>
              {modoAuth === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
            <div className="text-center">
              <span className="small text-white-50" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setModoAuth(modoAuth === 'login' ? 'cadastro' : 'login')}>
                {modoAuth === 'login' ? 'Não tem conta? Cadastre-se' : 'Já possui uma conta? Faça Login'}
              </span>
            </div>
          </form>
          <style>{`input::placeholder, textarea::placeholder { color: #a1a1a5 !important; }`}</style>
        </div>
      </div>
    );
  }

  // CONTEÚDO PRINCIPAL DO APP LOGADO
  return (
    <div style={{ backgroundColor: '#131314', color: '#e3e3e3', minHeight: '100vh' }} className="pb-5">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark" 
      />

      <RatingModal 
        isOpen={modalAberto} 
        tituloFilme={filmeParaAvaliar?.titulo || filmeParaAvaliar?.title || ''}
        notaInicial={filmeParaAvaliar?.avaliacaoPessoal}
        comentarioInicial={filmeParaAvaliar?.comentario}
        onClose={() => setModalAberto(false)}
        onSubmit={salvarAvaliacaoNoBanco}
      />

      <header className="sticky-top mb-4" style={{ background: 'rgba(30,30,32,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-4">
            <span className="fs-5 fw-bold text-white" style={{ cursor: 'pointer' }} onClick={() => setTelaAtiva('home')}>
              Fil<span style={{ color: '#d4af37' }}>mes</span>
            </span>
            <nav className="d-flex gap-1">
              <AbaLink nome="Início" target="home" telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
              <AbaLink nome="Top Avaliados" target="top-rated" telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
              <AbaLink nome="Quero Assistir" target="watchlist" telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
              <AbaLink nome="Meu Perfil" target="perfil" telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
            </nav>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm text-white px-3 border-0 rounded-pill" style={{ backgroundColor: '#2f2f31' }} onClick={() => setUsuarioLogado(null)}>Sair</button>
          </div>
        </div>
      </header>

      <div className="container">
        {telaAtiva === 'home' && (
          <>
            {/* BARRA DE PESQUISA */}
            <div className="mb-4 p-4 rounded-4" style={{ backgroundColor: '#1e1e20' }}>
              <input type="text" className="form-control border-0 rounded-3 text-white py-2 fw-medium" style={{ backgroundColor: '#131314' }} placeholder="Pesquisar..." value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
              {pesquisa.length > 2 && resultadosPesquisa && (
                <div className="mt-4">
                  <h6 className="mb-3" style={{ color: '#c4c7c5' }}>Resultados</h6>
                  <MovieCarousel>
                    {resultadosPesquisa.map((filme: FilmeTMDB) => (
                      <MovieCard 
                        key={filme.id} 
                        titulo={filme.title} 
                        posterPath={filme.poster_path} 
                        jaAssistido={meusAssistidos.find(f => f.tmdbId === filme.id)} 
                        onVerDetalhes={() => { setIdFilmeDetalhado(filme.id); setTelaAtiva('detalhes'); }} 
                      />
                    ))}
                  </MovieCarousel>
                </div>
              )}
            </div>

            {/* SEÇÃO PRINCIPAL - FILMES EM ALTA / CATEGORIAS */}
            <section className="mb-4 p-4 rounded-4" style={{ backgroundColor: '#1e1e20' }}>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
                <div className="d-flex flex-wrap gap-1">
                  {CATEGORIAS.map(cat => (
                    <button key={cat.id} className="btn btn-sm rounded-pill px-3 border-0" style={{ backgroundColor: categoriaSelecionada === cat.id ? '#3a321d' : '#2f2f31', color: categoriaSelecionada === cat.id ? '#f3e5ab' : '#e3e3e3' }} onClick={() => { setPesquisa(''); setCategoriaSelecionada(cat.id); }}>{cat.nome}</button>
                  ))}
                </div>
                <select className="form-select form-select-sm w-auto border-0 text-white font-medium" style={{ backgroundColor: '#2f2f31', cursor: 'pointer' }} value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as 'populares' | 'az')}>
                  <option value="populares">Em Alta (Padrão)</option>
                  <option value="az">Ordem Alfabética (A-Z)</option>
                </select>
              </div>

              <MovieCarousel>
                {filmesExibidosHome.map((filme: FilmeTMDB) => (
                  <MovieCard key={filme.id} titulo={filme.title} posterPath={filme.poster_path} mediaTexto={`★ ${obterMediaFilme(filme.id).string}`} jaAssistido={meusAssistidos.find(f => f.tmdbId === filme.id)} onVerDetalhes={() => { setIdFilmeDetalhado(filme.id); setTelaAtiva('detalhes'); }} />
                ))}
              </MovieCarousel>
            </section>

            {/* MEUS REGISTROS (COM EDIÇÃO E DELEÇÃO RÁPIDA) */}
            <section className="p-4 rounded-4" style={{ backgroundColor: '#1e1e20' }}>
              <h5 className="mb-4 text-white fw-medium">Meus Registros ({meusAssistidos.length})</h5>
              <div className="row g-3">
                {meusAssistidos.length === 0 ? (
                  <p className="small m-0 text-white-50 px-2">Nenhum histórico de exibição adicionado.</p>
                ) : (
                  meusAssistidos.map((filme: FilmeSalvo) => (
                    <div className="col-6 col-sm-4 col-md-2 text-center position-relative mb-2" key={filme.id}>
                      <div className="position-relative overflow-hidden rounded-3 border" style={{ borderColor: '#2f2f31' }}>
                        <img 
src={
  filme.poster
    ? (
        filme.poster.startsWith('http')
          ? filme.poster
          : `https://image.tmdb.org/t/p/w500${filme.poster}`
      )
    : '/sem-poster.png'
}                          className="img-fluid w-100" 
                          alt={filme.titulo} 
                          style={{ height: '180px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => { setIdFilmeDetalhado(filme.tmdbId); setTelaAtiva('detalhes'); }}
                        />
                        <div
  className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center gap-2 p-2"
  style={{
    background:
      'linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.3), transparent)'
  }}
>
  <button
    className="btn btn-sm px-3 rounded-pill border-0"
    style={{
      background: 'rgba(212,175,55,.15)',
      color: '#f5d76e',
      backdropFilter: 'blur(8px)',
      fontWeight: 600
    }}
    onClick={() => {
      setFilmeParaAvaliar(filme);
      setModalAberto(true);
    }}
  >
    Editar
  </button>

  <button
    className="btn btn-sm px-3 rounded-pill border-0"
    style={{
      background: 'rgba(220,53,69,.15)',
      color: '#ff6b81',
      backdropFilter: 'blur(8px)',
      fontWeight: 600
    }}
    onClick={() => excluirFilmeDoBanco(filme.id)}
  >
    Remover
  </button>
</div>
                      </div>
                      <span className="d-block small text-truncate mt-2 fw-medium text-white px-1">{filme.titulo}</span>
                      <span className="d-block text-truncate small fw-bold" style={{ color: '#d4af37', fontSize: '12px' }}>★ {filme.avaliacaoPessoal}.0</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* COMPONENTES DE ABAS SECUNDÁRIAS */}
        {telaAtiva === 'top-rated' && <TopRated filmesGerais={todosOsFilmesGerais} onVerDetalhes={(id) => { setIdFilmeDetalhado(id); setTelaAtiva('detalhes'); }} />}
        {telaAtiva === 'watchlist' && (
  <Watchlist
    filmesQueroAssistir={meusQueroAssistir}
    onVerDetalhes={(id) => {
      setIdFilmeDetalhado(id);
      setTelaAtiva('detalhes');
    }}
    onRemover={excluirFilmeDoBanco}
  />
)}{telaAtiva === 'perfil' && <Profile usuario={usuarioLogado} meusAssistidos={meusAssistidos} />}

        {/* TELA DE DETALHES COMPLETA */}
        {telaAtiva === 'detalhes' && (
          <MovieDetails 
            detalhes={detalheFilmeObjeto}
            stringMedia={obterMediaFilme(idFilmeDetalhado!).string}
            comentarios={[]}
            onVoltar={() => setTelaAtiva('home')}
            onAbrirModalAdicionar={(filme: FilmeEstruturado, tipo: 'ASSISTIDO' | 'QUERO_ASSISTIR') => {
              if (tipo === 'ASSISTIDO') {
                setFilmeParaAvaliar(filme);
                setModalAberto(true);
              } else {
                adicionarAWatchlist(filme);
              }
            }}
          />
        )}
      </div>

      {/* REGRA GLOBAL DOS CHEVRONS GEOMÉTRICOS PARA O COMPONENTE MOVIECAROUSEL */}
      <style>{`
        input::placeholder, textarea::placeholder { 
          color: #a1a1a5 !important; 
        }
        /* Alvos customizados para os botões dentro do MovieCarousel */
        .carousel-control-prev-icon, .carousel-control-next-icon {
          background-image: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #e3e3e3 !important;
          font-family: serif !important;
          font-size: 28px !important;
          font-weight: 300 !important;
          transition: color 0.2s ease, transform 0.2s ease !important;
        }
        .carousel-control-prev-icon::after {
          content: '⟨' !important;
        }
        .carousel-control-next-icon::after {
          content: '⟩' !important;
        }
        .carousel-control-prev:hover .carousel-control-prev-icon,
        .carousel-control-next:hover .carousel-control-next-icon {
          color: #d4af37 !important;
          transform: scale(1.15);
        }
      `}</style>
      {showDeleteModal && (
  <div
    className="modal fade show d-block"
    tabIndex={-1}
    style={{
      backgroundColor: 'rgba(0,0,0,.65)',
      backdropFilter: 'blur(4px)'
    }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div
        className="modal-content border-0"
        style={{
          backgroundColor: '#1e1e20',
          color: '#fff',
          borderRadius: '20px'
        }}
      >
        <div className="modal-header border-secondary">
          <h5 className="modal-title">
            Remover filme
          </h5>
        </div>

        <div className="modal-body">
          Tem certeza que deseja remover este filme do seu diário?
        </div>

        <div className="modal-footer border-secondary">
          <button
            className="btn btn-secondary rounded-pill px-4"
            onClick={() => {
              setShowDeleteModal(false);
              setFilmeParaExcluir(null);
            }}
          >
            Cancelar
          </button>

          <button
            className="btn btn-danger rounded-pill px-4"
            onClick={confirmarExclusao}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;