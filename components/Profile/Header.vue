<template>
  <div>
    <div 
      class="h-48 md:h-60 bg-slate-300 dark:bg-slate-700 bg-cover bg-center group relative"
      :style="{ backgroundImage: user && user.coverUrl ? `url(${user.coverUrl})` : 'url(https://picsum.photos/1920/1080)' }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>

    <div class="px-4 sm:px-6"> 
      <div class="relative -mt-12 md:-mt-16 pb-6 border-b" :class="twitterBorderColor">
        <div class="flex flex-col sm:flex-row items-center sm:items-end sm:space-x-5">
          
          <div class="relative shrink-0">
            <img 
              :src="user.profile_picture_url || 'https://picsum.photos/200/200'" 
              alt="Avatar" 
              class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-4 shadow-lg"
              :class="user.profile_picture_url ? 'border-white dark:border-slate-800' : 'border-gray-300 dark:border-slate-600 p-1'" 
            />
            </div>

          <div class="flex-grow mt-3 sm:mt-0 text-center sm:text-left">
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ user.full_name || user.name || 'Username' }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
          </div>
          
          <div class="mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
            <button 
              v-if="isOwnProfile" 
              @click="openEditModal"
              class="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm shadow-md"
            >
              Edit Profile
            </button>
            <button 
              v-else 
              class="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm shadow-md"
            >
              Follow
            </button>
          </div>
        </div>

        <div class="mt-4 text-center sm:text-left">
          <p v-if="user.bio" class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {{ user.bio }}
          </p>
          <p v-else class="text-gray-500 dark:text-gray-400 italic text-sm">
            This user has not set a bio yet.
          </p>
        </div>

        <div class="mt-4 pt-4">
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div class="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ stats.followingCount }}</span>
              <span>Following</span>
            </div>
            <div class="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ stats.followersCount }}</span>
              <span>Followers</span>
            </div>
            <div v-if="user.created_at" class="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Joined {{ formattedJoinDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> 
    
    <ProfileEditModal
      v-if="isEditModalOpen && user"
      :user="user" 
      @close="closeEditModal"
      @save-avatar="handleAvatarUpdate"         @save-cover="handleCoverUpdate" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProfileEditModal from './EditModal.vue' 
const { twitterBorderColor } = useTailwindConfig()

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    isOwnProfile: {
        type: Boolean,
        default: false
    }
})

const isEditModalOpen = ref(false)

function openEditModal() {
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
}

async function handleAvatarUpdate(avatarData) {
  console.log('Avatar update data received:', avatarData.newAvatarFile);
  if (avatarData.newAvatarFile) {
    const formData = new FormData();
    formData.append('avatar', avatarData.newAvatarFile);
    // TODO: Backend'e FormData'yı gönderip avatarı yükleyin.
    // Başarılı olursa props.user.profile_picture_url'i güncelleyin.
    alert('Avatar change ready to be uploaded (simulated)!');
  }
}

async function handleCoverUpdate(coverData) {
  console.log('Cover photo update data received:', coverData.newCoverFile);
  if (coverData.newCoverFile) {
    const formData = new FormData();
    formData.append('coverPhoto', coverData.newCoverFile);
    // TODO: Backend'e FormData'yı gönderip kapak fotoğrafını yükleyin.
    // Başarılı olursa props.user.coverUrl'i güncelleyin (eğer user objenizde bu alan varsa).
    alert('Cover photo change ready to be uploaded (simulated)!');
  }
}


// handleTextInfoUpdates fonksiyonu bir önceki mesajdaki gibi kalabilir.
async function handleTextInfoUpdates(textData) {
  console.log('Text info update data received in Header:', textData);
  // TODO: Backend'e API çağrısı vs.
  if (props.user) {
      props.user.full_name = textData.full_name;
      props.user.username = textData.username;
      props.user.bio = textData.bio;
  }
  alert('Text info changes saved (simulated)!');
}


const stats = ref({ // Bu veriler backend'den gelmeli veya user prop'u içinde olmalı
    followingCount: props.user?.stats?.followingCount || Math.floor(Math.random() * 500),
    followersCount: props.user?.stats?.followersCount || Math.floor(Math.random() * 2000),
})

const formattedJoinDate = computed(() => {
    if (!props.user || !props.user.created_at) {
        return ''
    }
    const date = new Date(props.user.created_at)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// openChangeAvatarModal fonksiyonu kaldırıldı ,-->

</script>