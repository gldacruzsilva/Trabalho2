import { useRef } from 'react';

interface MovieCarouselProps {
  children: React.ReactNode;
}

export function MovieCarousel({ children }: MovieCarouselProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);

  const mover = (direcao: 'esquerda' | 'direita') => {
    if (carrosselRef.current) {
      const valorScroll = direcao === 'esquerda' ? -500 : 500;
      carrosselRef.current.scrollBy({ left: valorScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="position-relative w-100">
      {/* Botão Esquerda */}
      <button 
        className="btn btn-dark rounded-circle position-absolute top-50 start-0 translate-middle-y z-3 shadow-lg d-flex align-items-center justify-content-center" 
        style={{ width: '40px', height: '40px', padding: 0, marginLeft: '10px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none' }} 
        onClick={() => mover('esquerda')}
      >
        <div style={{ border: 'solid #fff', borderWidth: '0 3px 3px 0', padding: '5px', transform: 'rotate(135deg)', marginLeft: '5px' }}></div>
      </button>

      {/* Botão Direita */}
      <button 
        className="btn btn-dark rounded-circle position-absolute top-50 end-0 translate-middle-y z-3 shadow-lg d-flex align-items-center justify-content-center" 
        style={{ width: '40px', height: '40px', padding: 0, marginRight: '10px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none' }} 
        onClick={() => mover('direita')}
      >
        <div style={{ border: 'solid #fff', borderWidth: '0 3px 3px 0', padding: '5px', transform: 'rotate(-45deg)', marginRight: '5px' }}></div>
      </button>

      <div 
        ref={carrosselRef} 
        className="gap-3 pb-2 px-3"
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>
    </div>
  );
}