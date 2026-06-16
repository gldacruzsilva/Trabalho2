import axios from 'axios';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;;

export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 1. Obter filmes populares (Sugeridos na Home)
export const obterFilmesPopularesTMDB = async () => {
  const res = await tmdbApi.get('/movie/popular', { params: { language: 'pt-BR' } });
  return res.data.results;
};

export const buscarFilmesTMDB = async (query: string) => {
  const res = await tmdbApi.get('/search/movie', { params: { query, language: 'pt-BR' } });
  return res.data.results;
};

export const buscarPorCategoriaTMDB = async (genreId: number) => {
  const res = await tmdbApi.get('/discover/movie', {
    params: { 
      language: 'pt-BR', 
      with_genres: genreId,
      sort_by: 'popularity.desc' // Traz os mais famosos desse tema
    }
  });
  return res.data.results;
};