export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface FilmeSalvo {
  id: number;
  tmdbId: number;
  usuarioId: number; // <-- Vincula o filme ao usuário dono dele
  titulo: string;
  poster: string;
  avaliacaoPessoal: number;
  comentario: string;
}

export interface FilmeTMDB {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}