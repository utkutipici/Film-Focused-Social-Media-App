<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 py-6 sm:py-12">
    <div class="container mx-auto px-4">
      <NuxtLink to="/movies" class="inline-flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 mb-6 group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Movies
      </NuxtLink>

      <div v-if="pending" class="text-center py-10">
        <p class="text-xl">Loading movie details...</p>
        </div>
      
      <div v-else-if="asyncError || !movieData" class="text-center py-10 px-4">
        <h2 class="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Failed to Load Movie Details</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          We couldn't fetch the details for the movie with ID: <strong>{{ movieId }}</strong>.
        </p>
        <p class="text-gray-600 dark:text-gray-400">
          Please try again later or check if the movie exists in the Top 100 list.
        </p>
        <pre v-if="asyncError" class="mt-4 text-xs text-left bg-red-100 dark:bg-red-800 dark:bg-opacity-30 text-red-700 dark:text-red-300 p-3 rounded overflow-x-auto">{{ asyncError }}</pre>
      </div>

      <div v-else-if="movieData" class="md:flex md:space-x-8 lg:space-x-12">
        <div class="md:w-1/3 lg:w-2/5 mb-8 md:mb-0">
          <img 
            v-if="movieData.big_image || movieData.image" 
            :src="movieData.big_image || movieData.image" 
            :alt="`Poster for ${movieData.title}`" 
            class="w-full h-auto rounded-lg shadow-2xl object-cover mx-auto"
            style="aspect-ratio: 2/3; max-width: 400px;"
          >
          <div v-else class="w-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400 mx-auto" style="aspect-ratio: 2/3; max-width: 400px; min-height:450px;">
            <span>Image Not Available</span>
          </div>
        </div>

        <div class="md:w-2/3 lg:w-3/5">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {{ movieData.title }}
          </h1>
          
          <div class="flex items-center space-x-4 mb-6 text-gray-600 dark:text-gray-400">
            <span v-if="movieData.year" class="text-lg">{{ movieData.year }}</span>
            <span v-if="movieData.year && movieData.rating" class="text-gray-400 dark:text-gray-600">&bull;</span>
            <span v-if="movieData.rating" class="flex items-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {{ movieData.rating }}
            </span>
            <span v-if="movieData.rank && (movieData.year || movieData.rating)" class="text-gray-400 dark:text-gray-600">&bull;</span>
            <span v-if="movieData.rank" class="text-lg">Rank: #{{ movieData.rank }}</span>
          </div>

          <div v-if="movieData.genre && movieData.genre.length" class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Genres</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="genreItem in movieData.genre" 
                :key="genreItem" 
                class="bg-sky-100 dark:bg-sky-700 dark:bg-opacity-50 text-sky-800 dark:text-sky-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ genreItem }}
              </span>
            </div>
          </div>
          
          <div v-if="movieData.description" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Overview</h2>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none">
              {{ movieData.description }}
            </p>
          </div>

          <div v-if="movieData.imdb_link" class="mt-auto">
             <a 
              :href="movieData.imdb_link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-yellow-500 dark:bg-yellow-400 hover:bg-yellow-600 dark:hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-yellow-500 transition-colors"
            >
              View on IMDb
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// YUKARIDAKİ DEBUG LOGLAMALI SCRIPT SETUP KISMINI BURAYA KOYUN
import { useImdb } from '~/composables/useImdb';

const route = useRoute();
const movieId = computed(() => route.params.id as string);

const { fetchTop100Movies } = useImdb();

const { data: movieData, pending, error: asyncError } = await useAsyncData(
  `movie-${movieId.value}`,
  async () => {
    console.log(`[MovieDetail] Fetching data for movieId: ${movieId.value}`);
    const allMovies = await fetchTop100Movies();

    if (allMovies && allMovies.length > 0) {
      console.log(`[MovieDetail] Fetched ${allMovies.length} movies from Top 100 list.`);
      const foundMovie = allMovies.find(movie => movie.imdbid === movieId.value);
      if (foundMovie) {
        console.log(`[MovieDetail] Movie found: ${foundMovie.title}`);
        return foundMovie;
      } else {
        console.error(`[MovieDetail] Movie with imdbid "${movieId.value}" NOT FOUND in the fetched list.`);
        return null;
      }
    } else {
      console.error(`[MovieDetail] fetchTop100Movies returned null or an empty list.`);
      return null;
    }
  },
  {
    watch: [movieId]
  }
);

console.log('[MovieDetail] Pending state:', pending.value);
console.log('[MovieDetail] Async error state:', asyncError.value);
console.log('[MovieDetail] MovieData:', movieData.value);

useHead(() => ({
  title: movieData.value ? movieData.value.title : 'Movie Details'
}));
</script>

<style scoped>
/* Gerekirse ek özel stiller buraya. 
   Örneğin, prose sınıfı Tailwind typography eklentisi gerektirebilir.
   Eğer bu eklenti yoksa, p etiketindeki prose sınıflarını kaldırıp manuel stil verebilirsiniz.
*/
/* .prose { @apply text-gray-700 dark:text-gray-300; } */ /* Örnek eğer typography plugin yoksa */
</style>