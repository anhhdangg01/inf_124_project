import axios from 'axios';

const TMDB_API_KEY = 'db7add6512fc0cd37884c65dd92de5d8';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjdhZGQ2NTEyZmMwY2QzNzg4NGM2NWRkOTJkZTVkOCIsIm5iZiI6MTc0NjIyNTk2OC42MDksInN1YiI6IjY4MTU0YjMwNmVhMjE2YTVlOTg0YzdkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CKDXdGO14rzcFBFN-oJ8N4ShXh2PG7uBIMUvaYg5UgY';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const axiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await axiosInstance.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await axiosInstance.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

export const getPopularMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await axiosInstance.get('/movie/popular', {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting popular movies:', error);
    throw error;
  }
};

export const getGenres = async (): Promise<GenreListResponse> => {
  try {
    const response = await axiosInstance.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('Error getting movie genres:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await axiosInstance.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        include_adult: false,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movies by genre:', error);
    throw error;
  }
};
