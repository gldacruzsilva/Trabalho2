import { type FilmeSalvo, type Usuario } from '../types/Filmes';

interface ProfileProps {
  usuario: Usuario;
  meusAssistidos: FilmeSalvo[];
}

export function Profile({ usuario, meusAssistidos }: ProfileProps) {
  const totalAssistidos = meusAssistidos.length;
  
  const somaNotas = meusAssistidos.reduce((acc, f) => acc + f.avaliacaoPessoal, 0);
  const mediaUsuario = totalAssistidos > 0 ? (somaNotas / totalAssistidos).toFixed(1) : '0.0';

  // Lógica de "Gamificação" (Medalhas baseadas na quantidade)
  let tituloCinefilo = "Espectador Casual";
  let corBadge = "#c4c7c5";
  
  if (totalAssistidos >= 5) { tituloCinefilo = "Crítico Iniciante"; corBadge = "#e6ca65"; }
  if (totalAssistidos >= 15) { tituloCinefilo = "Cinéfilo Dourado"; corBadge = "#d4af37"; }
  if (totalAssistidos >= 30) { tituloCinefilo = "Mestre do Cinema"; corBadge = "#b8860b"; }

  return (
  <div className="animate-fade-in">
    <div
      className="card border-0 rounded-4 overflow-hidden mb-4"
      style={{
        background:
          'linear-gradient(145deg,#1f1f22,#18181a)',
        boxShadow:
          '0 20px 50px rgba(0,0,0,.35)',
        border:
          '1px solid rgba(255,255,255,.05)'
      }}
    >
      <div
        style={{
          height: '120px',
          background:
            'linear-gradient(135deg,#d4af37,#f0d26b)'
        }}
      />

      <div className="p-4 text-center position-relative">
        <div
          className="mx-auto d-flex align-items-center justify-content-center fw-bold rounded-circle shadow-lg"
          style={{
            width: '90px',
            height: '90px',
            marginTop: '-70px',
            fontSize: '2rem',
            background: '#131314',
            color: '#d4af37',
            border: '4px solid #1e1e20'
          }}
        >
          {usuario.nome.charAt(0).toUpperCase()}
        </div>

        <h3 className="fw-bold text-white mt-3 mb-1">
          {usuario.nome}
        </h3>

        <span
          className="badge px-4 py-2 rounded-pill"
          style={{
            backgroundColor: corBadge,
            color: '#131314',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          {tituloCinefilo}
        </span>
      </div>
    </div>

    <h5
      className="fw-bold text-white mb-4"
      style={{
        letterSpacing: '.5px'
      }}
    >
      Estatísticas
    </h5>

    <div className="row g-4">
      <div className="col-12 col-md-6">
        <div
          className="p-4 rounded-4 h-100"
          style={{
            background:
              'linear-gradient(145deg,#1f1f22,#18181a)',
            border:
              '1px solid rgba(255,255,255,.05)',
            boxShadow:
              '0 10px 30px rgba(0,0,0,.2)'
          }}
        >
          <small
            className="text-uppercase"
            style={{
              color: '#a1a1a5',
              letterSpacing: '1px'
            }}
          >
            Filmes Avaliados
          </small>

          <div
            className="fw-bold mt-2"
            style={{
              fontSize: '3rem',
              color: '#d4af37'
            }}
          >
            {totalAssistidos}
          </div>

          <div
            style={{
              color: '#c4c7c5'
            }}
          >
            títulos registrados
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6">
        <div
          className="p-4 rounded-4 h-100"
          style={{
            background:
              'linear-gradient(145deg,#1f1f22,#18181a)',
            border:
              '1px solid rgba(255,255,255,.05)',
            boxShadow:
              '0 10px 30px rgba(0,0,0,.2)'
          }}
        >
          <small
            className="text-uppercase"
            style={{
              color: '#a1a1a5',
              letterSpacing: '1px'
            }}
          >
            Minha nota média
          </small>

          <div
            className="fw-bold mt-2"
            style={{
              fontSize: '3rem',
              color: '#d4af37'
            }}
          >
            {mediaUsuario}
          </div>

          <div
            style={{
              color: '#c4c7c5'
            }}
          >
            minha nota média
          </div>
        </div>
      </div>
    </div>

    <div
      className="mt-4 p-4 rounded-4"
      style={{
        background:
          'linear-gradient(145deg,#1f1f22,#18181a)',
        border:
          '1px solid rgba(255,255,255,.05)'
      }}
    >
      <h6
        className="fw-bold mb-3"
        style={{
          color: '#d4af37'
        }}
      >
        Progresso Cinéfilo
      </h6>

      <div
        className="progress"
        style={{
          height: '10px',
          background: '#131314'
        }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${Math.min(
              (totalAssistidos / 30) * 100,
              100
            )}%`,
            background:
              'linear-gradient(90deg,#d4af37,#f0d26b)'
          }}
        />
      </div>

      <small
        className="mt-2 d-block"
        style={{
          color: '#a1a1a5'
        }}
      >
        {totalAssistidos}/30 filmes para alcançar o nível máximo
      </small>
    </div>
  </div>
);
}