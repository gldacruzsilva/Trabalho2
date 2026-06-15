import { type FilmeSalvo } from '../types/Filmes';
import { MovieCard } from '../components/MovieCard';

interface WatchlistProps {
  filmesQueroAssistir: FilmeSalvo[];
  onVerDetalhes: (tmdbId: number) => void;
  onRemover: (id: number) => void;
}

export function Watchlist({
  filmesQueroAssistir,
  onVerDetalhes,
  onRemover
}: WatchlistProps) {
  return (
  <div className="animate-fade-in">
    <div
      className="p-4 rounded-4 mb-4"
      style={{
        background:
          'linear-gradient(145deg,#1f1f22,#18181a)',
        border:
          '1px solid rgba(255,255,255,.05)',
        boxShadow:
          '0 15px 40px rgba(0,0,0,.25)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3
            className="fw-bold text-white mb-1"
            style={{ letterSpacing: '.5px' }}
          >
            Quero Assistir
          </h3>

          <p
            className="mb-0"
            style={{ color: '#a1a1a5' }}
          >
            Filmes salvos para assistir futuramente.
          </p>
        </div>

        <div
          className="px-4 py-2 rounded-pill"
          style={{
            background:
              'rgba(212,175,55,.12)',
            border:
              '1px solid rgba(212,175,55,.25)',
            color: '#f5d76e',
            fontWeight: 600
          }}
        >
          {filmesQueroAssistir.length} Filme(s)
        </div>
      </div>
    </div>

    {filmesQueroAssistir.length === 0 ? (
      <div
        className="text-center p-5 rounded-4"
        style={{
          background:
            'linear-gradient(145deg,#1f1f22,#18181a)',
          border:
            '1px solid rgba(255,255,255,.05)',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: '70px',
            height: '70px',
            background:
              'rgba(212,175,55,.08)',
            border:
              '1px solid rgba(212,175,55,.15)'
          }}
        >
          <span
            style={{
              fontSize: '28px',
              color: '#d4af37'
            }}
          >
            +
          </span>
        </div>

        <h5 className="text-white mb-2">
          Sua lista está vazia
        </h5>

        <p
          className="mb-0"
          style={{
            color: '#a1a1a5'
          }}
        >
          Explore o catálogo e adicione filmes que deseja assistir depois.
        </p>
      </div>
    ) : (
      <>
        <div
          className="mb-4 p-3 rounded-4"
          style={{
            background:
              'linear-gradient(145deg,#1f1f22,#18181a)',
            border:
              '1px solid rgba(255,255,255,.05)'
          }}
        >
          <small
            style={{
              color: '#a1a1a5'
            }}
          >
            Você possui{' '}
            <span
              style={{
                color: '#d4af37',
                fontWeight: 600
              }}
            >
              {filmesQueroAssistir.length}
            </span>{' '}
            filme(s) aguardando para serem assistidos.
          </small>
        </div>

        <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-md-start">
  {filmesQueroAssistir.map((filme) => (
    <div
      key={filme.id}
      className="position-relative"
    >
      <MovieCard
        titulo={filme.titulo}
        posterPath={filme.poster}
        badge="Watchlist"
        onVerDetalhes={() =>
          onVerDetalhes(filme.tmdbId)
          
        }
      />
      <button
  className="btn position-absolute rounded-circle border-0"
  style={{
    top: '-8px',
    right: '-8px',
    width: '36px',
    height: '36px',
    background: '#dc3545',
    color: 'white',
    fontWeight: 'bold',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
  onClick={() => onRemover(filme.id)}
>
  ✕
</button>

    </div>
  ))}
</div>
      </>
    )}
  </div>
);
}