import { useState, useEffect } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  tituloFilme: string;
  notaInicial?: number;
  comentarioInicial?: string;
  onClose: () => void;
  onSubmit: (nota: number, comentario: string) => void;
}

export function RatingModal({ 
  isOpen, 
  tituloFilme, 
  notaInicial = 5, 
  comentarioInicial = '', 
  onClose, 
  onSubmit 
}: RatingModalProps) {
  const [nota, setNota] = useState(notaInicial);
  const [comentario, setComentario] = useState(comentarioInicial);
  const [hoveredNota, setHoveredNota] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setNota(notaInicial);
      setComentario(comentarioInicial);
    }
  }, [isOpen, notaInicial, comentarioInicial]);

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      
      <div className="card border-0 p-4 rounded-4 shadow-lg w-100" 
           style={{ maxWidth: '400px', backgroundColor: '#1e1e20', border: '1px solid #2f2f31' }}>
        
        <h5 className="text-white fw-bold mb-1">Avaliar Filme</h5>
        <p className="small mb-4" style={{ color: '#d4af37' }}>{tituloFilme}</p>

        {/* Sistema de Estrelas */}
        <div className="mb-4 text-center">
          <div className="d-flex justify-content-center gap-2">
            {[1, 2, 3, 4, 5].map((estrela) => (
              <span 
                key={estrela} 
                onClick={() => setNota(estrela)}
                onMouseEnter={() => setHoveredNota(estrela)}
                onMouseLeave={() => setHoveredNota(0)}
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '36px', 
                  color: estrela <= (hoveredNota || nota) ? '#d4af37' : '#2f2f31', 
                  transition: 'all 0.2s'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Campo de Comentário */}
        <div className="mb-4">
          <textarea 
            className="form-control border-0 text-white p-3 rounded-3 shadow-none fw-medium" 
            style={{ backgroundColor: '#131314', minHeight: '120px', resize: 'none' }}
            placeholder="O que você achou do filme?..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        {/* Botões de Ação */}
        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn px-4 rounded-pill text-white border-0" 
            style={{ backgroundColor: '#2f2f31' }} 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="btn px-4 rounded-pill fw-bold border-0" 
            style={{ backgroundColor: '#d4af37', color: '#131314' }} 
            onClick={() => onSubmit(nota, comentario)}
          >
            Salvar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}