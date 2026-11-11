import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
})

export const movieApi = {
  async getNowPlaying() {
    const res = await api.get('/movie/now_playing', {
      params: { language: 'en-US', page: 1 },
    })
    return res.data
  },
  async getTrandingMovies() {
    const res = await api.get('/trending/all/day', {
      params: { language: 'en-US' },
    })
    return res.data
  },
  async getTopRatedMovies() {
    const res = await api.get('/movie/top_rated', {
      params: { language: 'en-US', page: 1 },
    })
    return res.data
  },
}
