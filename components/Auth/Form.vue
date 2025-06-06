<template>
    <div class="w-full">
        <div class="flex justify-center">
            <div class="w-10 h-10">
                </div>
        </div>

        <div class="pt-5 space-y-6">
            <UIInput v-model="data.username" label="Username" placeholder="@username" />
            <UIInput label="Password" placeholder="********" type="password" v-model="data.password" />

            <p v-if="data.error" class="text-red-500 text-sm">{{ data.error }}</p>

            <UIButton @click="handleLogin" liquid :disabled="isButtonDisabled">
                <span v-if="loading">Giriş Yapılıyor...</span>
                <span v-else>Giriş Yap</span>
            </UIButton>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
// 'useAuth' composable'ından 'login' ile birlikte 'loading' durumunu da alıyoruz
const { login, loading } = useAuth();

// Yerel 'loading' durumunu reactive nesnesinden kaldırıyoruz
const data = reactive({
    username: '',
    password: '',
    error: null
});

async function handleLogin() {
    data.error = null;
    try {
        await login({
            username: data.username,
            password: data.password
        });
    } catch (error) {
        // Backend'den gelen hata mesajını veya genel bir mesajı göster
        data.error = error.data?.message || 'Kullanıcı adı veya şifre geçersiz.';
    }
}

// Butonun disabled durumunu merkezi 'loading' state'ine göre hesapla
const isButtonDisabled = computed(() => {
    return (!data.username || !data.password) || loading.value;
});
</script>