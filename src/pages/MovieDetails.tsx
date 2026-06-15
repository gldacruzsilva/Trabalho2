interface CategoriaGenero {
  id: number;
  name: string;
}

interface DetalhesFilme {
  id?: number;
  tmdbId?: number;
  title?: string;
  titulo?: string;
  poster_path?: string | null;
  poster?: string | null;
  release_date?: string;
  runtime?: number;
  overview?: string;
  genres?: CategoriaGenero[];
}

interface ComentarioComunidade {
  id: number;
  autor: string;
  nota: number;
  texto: string;
}

interface MovieDetailsProps {
  detalhes: DetalhesFilme | null | undefined;
  stringMedia: string;
  comentarios: ComentarioComunidade[];
  onVoltar: () => void;
  onAbrirModalAdicionar: (filme: DetalhesFilme, tipo: 'ASSISTIDO' | 'QUERO_ASSISTIR') => void;
}

export function MovieDetails({
  detalhes,
  stringMedia,
  comentarios,
  onVoltar,
  onAbrirModalAdicionar
}: MovieDetailsProps) {
  if (!detalhes) {
    return (
      <div className="text-center p-5 text-muted" style={{ backgroundColor: '#1e1e20', borderRadius: '16px' }}>
        <p>Carregando dados complementares do filme...</p>
        <button className="btn btn-sm btn-outline-light rounded-pill px-3" onClick={onVoltar}>
          Voltar ao início
        </button>
      </div>
    );
  }

  const tituloFilme = detalhes.title || detalhes.titulo || "Título Indisponível";
  const caminhoPoster = detalhes.poster_path || detalhes.poster;
  
  // CORREÇÃO DA CAPA: Se já for uma URL completa (da internet/banco), usa direto. Senão, concatena o TMDB.
  const urlPoster = caminhoPoster 
    ? (caminhoPoster.startsWith('http') ? caminhoPoster : `https://image.tmdb.org/t/p/w500${caminhoPoster}`)
    : 'https://placehold.co/500x750?text=Sem+Capa';

  return (
    <div className="animate-fade-in">
      <button className="btn btn-sm text-white mb-4 rounded-pill px-3 border-0" style={{ backgroundColor: '#2f2f31' }} onClick={onVoltar}>
        ← Voltar
      </button>

      <div className="card border-0 p-4 rounded-4 mb-4" style={{ backgroundColor: '#1e1e20' }}>
        <div className="row g-4">
          <div className="col-12 col-md-4 col-lg-3 text-center">
            <img 
              src={urlPoster} 
              alt={tituloFilme} 
              className="img-fluid rounded-4 shadow-lg"
              style={{ maxHeight: '350px', objectFit: 'cover', border: '1px solid #3a3222' }}
            />
          </div>

          <div className="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-between text-white">
            <div>
              <h2 className="fw-bold mb-2 text-white">{tituloFilme}</h2>
              
              <div className="d-flex flex-wrap gap-3 align-items-center mb-4 small" style={{ color: '#c4c7c5' }}>
                <span className="badge px-2 py-1 text-white" style={{ backgroundColor: '#2f2f31' }}>
                  {detalhes.release_date ? detalhes.release_date.substring(0, 4) : 'Cinema'}
                </span>
                {detalhes.runtime && (
                  <span>Duração: <strong className="text-white">{detalhes.runtime} min</strong></span>
                )}
                <span style={{ color: '#d4af37' }}>
                  Média Geral: ★ {stringMedia}
                </span>
              </div>

              <div className="mb-3">
                <span className="d-block small mb-1" style={{ color: '#c4c7c5' }}>Gêneros:</span>
                <div className="d-flex flex-wrap gap-1">
                  {detalhes.genres && detalhes.genres.length > 0 ? (
                    detalhes.genres.map((g) => (
                      <span key={g.id} className="badge text-white rounded-pill px-3 py-1" style={{ backgroundColor: '#2f2f31' }}>{g.name}</span>
                    ))
                  ) : (
                    <span className="badge text-white" style={{ backgroundColor: '#2f2f31' }}>Filme Geral</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className="d-block small mb-1" style={{ color: '#c4c7c5' }}>Sinopse:</span>
                <p className="fw-light" style={{ lineHeight: '1.6', fontSize: '14px', color: '#e3e3e3' }}>
                  {detalhes.overview || 'Sinopse indisponível em português para este título.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-3 d-flex flex-wrap gap-2 align-items-center justify-content-between" style={{ backgroundColor: '#131314' }}>
              <span className="small" style={{ color: '#c4c7c5' }}>Gerenciar na sua coleção pessoal:</span>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm px-4 border-0 rounded-pill fw-medium" 
                  style={{ backgroundColor: '#d4af37', color: '#131314' }} 
                  onClick={() => onAbrirModalAdicionar(detalhes, 'ASSISTIDO')}
                >
                  Já Assistido
                </button>
                <button className="btn btn-sm text-white px-3 border-0 rounded-pill" style={{ backgroundColor: '#2f2f31' }} onClick={() => onAbrirModalAdicionar(detalhes, 'QUERO_ASSISTIR')}>Quero Assistir</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 p-4 rounded-4" style={{ backgroundColor: '#1e1e20' }}>
        <h6 className="fw-medium mb-3" style={{ color: '#d4af37' }}>Críticas Coletivas</h6>
        <div className="d-flex flex-column gap-2">
          {comentarios.length === 0 ? (
            <p className="small m-0 py-3 text-center rounded-3 text-muted" style={{ backgroundColor: '#131314' }}>Nenhuma nota ou comentário de colega disponível para este filme.</p>
          ) : (
            comentarios.map((critica) => (
              <div key={critica.id} className="p-3 rounded-3" style={{ backgroundColor: '#131314' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-medium small" style={{ color: '#f3e5ab' }}>{critica.autor}</span>
                  <span className="badge text-white" style={{ backgroundColor: '#2f2f31', fontSize: '11px' }}>Nota: {critica.nota}.0</span>
                </div>
                <p className="m-0 small font-italic" style={{ color: '#e3e3e3' }}>"{critica.texto}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}