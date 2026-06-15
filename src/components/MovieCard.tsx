import { type FilmeSalvo } from '../types/Filmes';

interface MovieCardProps {
  titulo: string;
  posterPath: string | null;
  mediaTexto?: string;
  jaAssistido?: FilmeSalvo;
  onVerDetalhes: () => void;
  onMarcarVi?: () => void;
  onMarcarQuero?: () => void;
  onEditar?: () => void;
  badge?: string;
}

export function MovieCard({
  titulo,
  posterPath,
  mediaTexto,
  jaAssistido,
  onVerDetalhes,
  onMarcarVi,
  onMarcarQuero,
  onEditar,
  badge
}: MovieCardProps) {
  const urlPoster = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'https://placehold.co/500x750?text=Sem+Capa';

  return (
    <div style={{ minWidth: '160px', maxWidth: '160px' }}>
      <div 
        className="card h-100 border-0 rounded-4 position-relative overflow-hidden transition-all" 
        style={{ 
          backgroundColor: '#1e1e20', 
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {badge && (
          <span className="position-absolute top-0 start-0 badge m-2 px-2 py-1" 
            style={{
  fontSize: '10px',
  background:
    'rgba(212,175,55,.15)',
  color: '#f5d76e',
  border:
    '1px solid rgba(212,175,55,.25)',
  backdropFilter: 'blur(10px)'
}}
>            {badge}
          </span>
        )}

        <div className="position-relative overflow-hidden" style={{ height: '225px' }}>
          <img 
            src={urlPoster} 
            className="w-100 h-100" 
            alt={titulo} 
            style={{ objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.5s' }} 
            onClick={onVerDetalhes} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        
        <div className="card-body p-2 d-flex flex-column justify-content-between">
          <div>
            <span className="small fw-bold text-truncate d-block text-white" style={{ cursor: 'pointer' }} onClick={onVerDetalhes}>
              {titulo}
            </span>
            {mediaTexto && <span className="d-block" style={{ fontSize: '11px', color: '#d4af37', fontWeight: '600' }}>{mediaTexto}</span>}
          </div>

          <div className="d-flex gap-2 mt-2">
            {jaAssistido ? (
              <button 
                className="btn btn-sm w-100 py-1 fw-bold rounded-pill" 
                style={{ fontSize: '11px', backgroundColor: '#d4af37', color: '#131314', border: 'none' }} 
                onClick={onEditar || onVerDetalhes}
              >
                Editar
              </button>
            ) : (
              <>
                {onMarcarVi && (
                  <button 
                    className="btn btn-sm w-50 py-1 text-white fw-bold rounded-pill" 
                    style={{ fontSize: '10px', backgroundColor: '#2f2f31', border: '1px solid #3f3f42' }} 
                    onClick={onMarcarVi}
                  >
                    Vi
                  </button>
                )}
                {onMarcarQuero && (
                  <button 
                    className="btn btn-sm w-50 py-1 text-white fw-bold rounded-pill" 
                    style={{ fontSize: '10px', backgroundColor: '#2f2f31', border: '1px solid #3f3f42' }} 
                    onClick={onMarcarQuero}
                  >
                    +
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}