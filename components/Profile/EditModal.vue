<template>
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
    @click.self="closeModal"
  >
    <div 
      class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden transform transition-all duration-300 ease-in-out scale-100"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">Edit Your Profile</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        
        <div>
          <label for="coverFile" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Photo</label>
          <div class="flex items-center space-x-3">
            <input type="file" id="coverFile" @change="onCoverFileSelected" accept="image/*"
                   class="flex-grow block w-full text-sm text-slate-500 dark:text-slate-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200
                          hover:file:bg-sky-100 dark:hover:file:bg-sky-600
                          cursor-pointer">
            <button 
              v-if="selectedCoverFile" 
              type="button" 
              @click="submitCoverChange"
              class="shrink-0 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
            >
              Save Cover
            </button>
          </div>
          <div v-if="coverPreview" class="mt-2 border border-gray-200 dark:border-slate-700 rounded">
            <img :src="coverPreview" alt="Cover photo preview" class="w-full h-32 object-cover rounded">
          </div>
          <p v-else-if="editableUser.coverUrl && !selectedCoverFile" class="mt-2 text-xs text-gray-500 dark:text-gray-400">Current cover: <a :href="editableUser.coverUrl" target="_blank" class="underline hover:text-sky-500 dark:hover:text-sky-400">{{ editableUser.coverUrl.substring(0,50) }}...</a></p>
        </div>

        <div>
          <label for="avatarFile" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar</label>
          <div class="flex items-center space-x-3">
            <input type="file" id="avatarFile" @change="onAvatarFileSelected" accept="image/*"
                   class="flex-grow block w-full text-sm text-slate-500 dark:text-slate-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200
                          hover:file:bg-sky-100 dark:hover:file:bg-sky-600
                          cursor-pointer">
            <button 
              v-if="selectedAvatarFile" 
              type="button" 
              @click="submitAvatarChange"
              class="shrink-0 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
            >
              Save Avatar
            </button>
          </div>
          <div class="mt-2 flex items-center space-x-3">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="w-16 h-16 object-cover rounded-full border border-gray-200 dark:border-slate-700">
              <img v-else-if="editableUser.profile_picture_url && !selectedAvatarFile" :src="editableUser.profile_picture_url" alt="Current avatar" class="w-16 h-16 object-cover rounded-full border border-gray-200 dark:border-slate-700">
              <div v-else class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">No Avatar</div>
          </div>
        </div>
        
        <hr class="dark:border-slate-700 my-6"> <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input type="text" id="fullName" v-model="editableUser.full_name"
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500">
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input type="text" id="username" v-model="editableUser.username"
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500">
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Changing username might have other implications.</p>
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea id="bio" v-model="editableUser.bio" rows="4"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"></textarea>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button type="button" @click="closeModal"
                class="w-full sm:w-auto order-last sm:order-first px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-md hover:bg-gray-50 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors">
          Cancel
        </button>
        <button type="button" @click="submitTextChanges"
                class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors">
          Save Details </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onUnmounted } from 'vue'

interface EditableUserFromProp {
  full_name?: string | null;
  username?: string;
  bio?: string | null;
  profile_picture_url?: string | null;
  coverUrl?: string | null;
  [key: string]: any;
}

interface EditableUserForForm {
  full_name: string;
  username: string;
  bio: string;
  profile_picture_url: string; // Mevcut URL'i tutar
  coverUrl: string; // Mevcut URL'i tutar
}

const props = defineProps<{
  user: EditableUserFromProp;
}>()

// Emit eventleri güncellendi ,-->
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveAvatar', avatarData: { newAvatarFile: File }): void; // Sadece dosyayı gönderir
  (e: 'saveCover', coverData: { newCoverFile: File }): void;   // Sadece dosyayı gönderir
  (e: 'saveTextInfo', textData: { full_name: string; username: string; bio: string }): void;
}>()

const editableUser = ref<EditableUserForForm>({
  full_name: '',
  username: '',
  bio: '',
  profile_picture_url: '',
  coverUrl: ''
})

const selectedCoverFile = ref<File | null>(null)
const selectedAvatarFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const avatarPreview = ref<string | null>(null)

watch(() => props.user, (currentUser) => {
  if (currentUser) {
    editableUser.value = {
      full_name: currentUser.full_name || '',
      username: currentUser.username || '',
      bio: currentUser.bio || '',
      profile_picture_url: currentUser.profile_picture_url || '',
      coverUrl: currentUser.coverUrl || ''
    };
    // Yeni bir dosya seçilmemişse mevcut önizlemeleri göster
    if (!selectedCoverFile.value) {
        coverPreview.value = currentUser.coverUrl || null;
    }
    if (!selectedAvatarFile.value) {
        avatarPreview.value = currentUser.profile_picture_url || null;
    }
  }
}, { immediate: true, deep: true })

function onCoverFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedCoverFile.value = target.files[0];
    if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview.value);
    }
    coverPreview.value = URL.createObjectURL(selectedCoverFile.value);
  } else {
    // Kullanıcı dosya seçimini iptal ederse, seçimi ve önizlemeyi sıfırla (veya eskiye döndür)
    selectedCoverFile.value = null;
    coverPreview.value = props.user.coverUrl || null; 
  }
   // Dosya seçiciyi sıfırla ki aynı dosya tekrar seçilebilsin
  target.value = '';
}

function onAvatarFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedAvatarFile.value = target.files[0];
    if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview.value);
    }
    avatarPreview.value = URL.createObjectURL(selectedAvatarFile.value);
  } else {
    selectedAvatarFile.value = null;
    avatarPreview.value = props.user.profile_picture_url || null;
  }
  // Dosya seçiciyi sıfırla
  target.value = '';
}

function closeModal() {
  emit('close')
}

// Avatar değişikliğini kaydetmek için fonksiyon ,-->
function submitAvatarChange() {
  if (selectedAvatarFile.value) {
    emit('saveAvatar', { newAvatarFile: selectedAvatarFile.value });
    // İsteğe bağlı: Başarılı bir kayıttan sonra seçimi ve önizlemeyi sıfırla
    // selectedAvatarFile.value = null;
    // avatarPreview.value = props.user.profile_picture_url; // Veya güncellenmiş URL backend'den gelmeli
    // Modal açık kalabilir veya kapatılabilir.
  }
}

// Kapak fotoğrafı değişikliğini kaydetmek için fonksiyon ,-->
function submitCoverChange() {
  if (selectedCoverFile.value) {
    emit('saveCover', { newCoverFile: selectedCoverFile.value });
    // selectedCoverFile.value = null;
    // coverPreview.value = props.user.coverUrl;
  }
}

// Metin bilgilerini kaydetmek için fonksiyon ,-->
function submitTextChanges() {
  emit('saveTextInfo', {
    full_name: editableUser.value.full_name,
    username: editableUser.value.username,
    bio: editableUser.value.bio,
  });
}

onUnmounted(() => {
  if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value);
  }
  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value);
  }
})

</script>

<style scoped>
.fixed {
  z-index: 50; 
}
</style>