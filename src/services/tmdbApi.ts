import axios from 'axios';

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGYzMWZiM2UwYTRjNTBhMGQzZWIxZDQ1MTg5Y2I1NiIsIm5iZiI6MTc4MTEwMTQ0Ni4wMjQsInN1YiI6IjZhMjk3Mzg2NjEzNDE3ZGY0NzY4MWY2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hPkFzoWTovldaT8Ir8imIO1YtaM7igml-awwqJfyW3E';

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