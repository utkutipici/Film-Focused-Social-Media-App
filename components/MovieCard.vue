<template>
 <NuxtLink :to="`/movies/${movie.id}`" class="block group h-full"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl dark:border dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full">
      
      <img
        v-if="movie.image"
        :src="movie.image"
        :alt="`Poster for ${movie.title}`"
        class="w-full object-cover group-hover:opacity-80 transition-opacity duration-300"
        style="aspect-ratio: 2 / 3;" 
        @error="onImageError"
      />
      <div v-else class="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400" style="aspect-ratio: 2 / 3;">
        <span class="text-xs p-1 text-center">No Image</span>
      </div>
      
      <div class="p-2 flex flex-col flex-grow">
        <h3 
          class="text-sm font-semibold truncate text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-0.5" 
          :title="movie.title"
        >
          {{ movie.rank }}. {{ movie.title }}
        </h3>
        
        <div class="mt-auto">
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ movie.year }}</p>
          <p v-if="movie.rating" class="text-xs text-yellow-500 dark:text-yellow-400 font-bold">Rating: {{ movie.rating }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
// Film tipini import etmek iyi bir pratiktir
// import type { Movie } from '~/composables/useImdb'; // veya '~/types/movie';

interface Movie {
  id: number;
  imdbid: string;
  image?: string;
  thumbnail?: string;
  title: string;
  year: number;
  rank: number;
  rating?: string;
}

const props = defineProps<{
  movie: Movie;
}>();

// Kart oluştuğunda film ID'sini konsola yazdıralım
console.log('[MovieCard] Props received - Title:', props.movie.title, 'ID:', props.movie.id);

const onImageError = (event: Event) => {
   console.warn(`Image failed to load: ${props.movie.image}`);
  // Resim yüklenemezse, placeholder'ı göstermek için daha gelişmiş bir mantık eklenebilir.
  // Şimdilik, sadece hatayı logluyoruz ve img etiketi bozuk bir resim gösterebilir veya boş kalabilir.
  // Üstteki v-else bloğu bu durumu zaten ele alıyor.
  const imgElement = event.target as HTMLImageElement;
  imgElement.style.display = 'none'; // Hatalı resmi gizle
  // Kardeş placeholder elementini görünür yap (DOM yapısına göre ayarlanmalı)
  const placeholder = imgElement.nextElementSibling;
  if (placeholder && placeholder.classList.contains('img-placeholder-dimensions')) { // Veya placeholder'a özel bir class verin
     // Bu kısım, v-else ile daha iyi yönetiliyor.
  }
};
</script>

<style scoped>
/* Kartlara özel Tailwind dışı stiller buraya eklenebilir */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>