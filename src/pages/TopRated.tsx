import { type FilmeSalvo } from '../types/Filmes';

interface TopRatedProps {
  filmesGerais: FilmeSalvo[] | undefined;
  onVerDetalhes: (tmdbId: number) => void;
}

interface FilmeAgrupado {
  tmdbId: number;
  titulo: string;
  poster: string;
  media: number;
  votos: number;
}

export function TopRated({ filmesGerais, onVerDetalhes }: TopRatedProps) {
  if (!filmesGerais || filmesGerais.length === 0) {
    return (
      <div className="text-center p-5 text-muted" style={{ backgroundColor: '#1e1e20', borderRadius: '16px' }}>
        <p>A comunidade ainda não avaliou nenhum filme para gerar o ranking.</p>
      </div>
    );
  }

  // Agrupar avaliações por ID do TMDB e calcular médias reais
  const agrupados: { [key: number]: FilmeAgrupado } = {};

  filmesGerais.forEach((f) => {
    if (f.avaliacaoPessoal > 0) { // Ignora quem está apenas no "Quero Assistir"
      if (!agrupados[f.tmdbId]) {
        agrupados[f.tmdbId] = {
          tmdbId: f.tmdbId,
          titulo: f.titulo,
          poster: f.poster,
          media: 0,
          votos: 0
        };
      }
      agrupados[f.tmdbId].media += f.avaliacaoPessoal;
      agrupados[f.tmdbId].votos += 1;
    }
  });

  // Finalizar o cálculo e gerar lista ordenada
  const ranking: FilmeAgrupado[] = Object.values(agrupados)
    .map(f => ({
      ...f,
      media: Number((f.media / f.votos).toFixed(1))
    }))
    .sort((a, b) => b.media - a.media || b.votos - a.votos); // Ordena por nota e desempata por quantidade de votos

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h4 className="fw-medium text-white mb-1">Top da Comunidade</h4>
        <p className="small text-white">Os títulos com as melhores notas atribuídas pelos membros do comunidade.</p>
      </div>

      <div className="d-flex flex-column gap-3">
        {ranking.map((filme, index) => {
          const urlPoster = filme.poster ? `https://image.tmdb.org/t/p/w500${filme.poster}` : 'https://placehold.co/500x750?text=Sem+Capa';
          
          return (
            <div 
              key={filme.tmdbId} 
              className="card border-0 p-3 rounded-4 d-flex flex-row align-items-center gap-3 pull-card" 
              style={{ backgroundColor: '#1e1e20', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => onVerDetalhes(filme.tmdbId)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              {/* Posição no Ranking */}
              <div className="d-flex align-items-center justify-content-center fw-bold fs-3 px-2 text-center" style={{ minWidth: '45px', color: index < 3 ? '#a8c7fa' : '#c4c7c5' }}>
                #{index + 1}
              </div>

              {/* Capa */}
              <img 
                src={urlPoster} 
                alt={filme.titulo} 
                className="rounded-3" 
                style={{ width: '55px', height: '80px', objectFit: 'cover' }}
              />

              {/* Dados */}
              <div className="flex-grow-1 min-w-0">
                <h6 className="text-white text-truncate mb-1 fw-medium">{filme.titulo}</h6>
                <span className="small text-white">{filme.votos} {filme.votos === 1 ? 'avaliação' : 'avaliações no total'}</span>
              </div>

              {/* Nota Estilo Badge */}
              <div className="text-end px-3 py-2 rounded-3" style={{ backgroundColor: '#131314', minWidth: '85px' }}>
                <span className="d-block small text-white" style={{ fontSize: '10px' }}>MÉDIA</span>
                <span className="fw-bold fs-5" style={{ color: '#a8c7fa' }}>★ {filme.media.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}