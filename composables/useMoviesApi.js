export default () => {
  const getAllMovies = async () => {
    const data = await useFetchApi('/api/movies/')
    return data.movies || []
  }

  const getMovieById = async (id) => {
    const data = await useFetchApi(`/api/movies/${id}`)
    return data.movie || null
  }

  const searchMovies = async (title) => {
    const data = await useFetchApi('/api/movies/search', {
      params: { title }
    })
    return data.movies || []
  }

  const filterMovies = async (genre) => {
    const data = await useFetchApi('/api/movies/filter', {
      params: { genre }
    })
    return data.movies || []
  }

  return {
    getAllMovies,
    getMovieById,
    searchMovies,
    filterMovies
  }
}
