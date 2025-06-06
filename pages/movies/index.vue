<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Top 100 IMDb Movies</h1>
    
    <div v-if="pending" class="text-center text-gray-700 dark:text-gray-300">
      <p>Loading movies...</p>
      </div>
    
    <div v-else-if="error" class="text-center">
      <p class="text-red-600 dark:text-red-400">Could not load movies. Please try again later.</p>
      <pre v-if="error" class="text-xs text-left bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-300 p-2 mt-2 rounded">{{ error }}</pre>
    </div>
    
    <div v-else-if="movies && movies.length">
      <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"> 
        <MovieCard v-for="movie in movies" :key="movie.imdbid" :movie="movie" />
      </div>
    </div>
    
    <div v-else class="text-center text-gray-700 dark:text-gray-300">
      <p>No movies found.</p>
    </div>
  </div>

</template>

<script setup lang="ts">
// Update the path below if your MovieCard.vue is in a different folder or has different casing
import MovieCard from '../../components/MovieCard.vue';
import useMoviesApi from '~/composables/useMoviesApi'

const { getAllMovies } = useMoviesApi();

const { data: movies, pending, error } = await useAsyncData(
  'top100Movies',
  async () => {
    const fetchedMovies = await getAllMovies();
    return fetchedMovies;
  }
);

console.log("Movies data on page:", movies.value); // EKLENDİ
console.log("Pending state:", pending.value); // EKLENDİ
console.log("Error state:", error.value); // EKLENDİ
</script>

<style scoped>
/* Sayfaya özel stiller buraya eklenebilir */
</style>