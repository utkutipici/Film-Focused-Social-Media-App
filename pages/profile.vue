<template>
   <div>
        <MainSection title="Profile" :loading="loading">
            <Head>
                <Title>{{ pageTitle }}</Title>
            </Head>

            <ProfileHeader 
                v-if="user" :user="user" 
                :is-own-profile="isCurrentUserProfile" 
            />

            <TweetListFeed 
                v-if="user && tweets.length > 0" :tweets="tweets" 
            />
            
            <div v-else-if="user && !loading && tweets.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                Bu kullanıcının henüz hiç tweeti yok.
            </div>
            
            <div v-else-if="!loading && !user" class="p-4 text-center text-gray-500 dark:text-gray-400">
                Kullanıcı bulunamadı veya yüklenirken bir sorun oluştu.
            </div>

        </MainSection>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
const { getUserTweets } = useTweets() 
const { useAuthUser } = useAuth()

const loading = ref(true)
const tweets = ref([])
// Değişken adını 'user' olarak kullanıyoruz, sizin orijinal yapınızdaki gibi.
const user = useAuthUser() 

// Bu prop ProfileHeader'a gönderilecek.
// Bu sayfa her zaman giriş yapmış kullanıcının kendi profili ise bu değer true olur.
const isCurrentUserProfile = true; 

const pageTitle = computed(() => {
    if (user.value) { // .value ile erişim doğru
        return `${user.value.full_name || user.value.name || user.value.username} (@${user.value.username}) / CineTogether`
    }
    return 'Profile / CineTogether'
})

onBeforeMount(async () => {
    loading.value = true
    tweets.value = [] 
    console.log("[profile.vue] onBeforeMount: Profil verileri yükleniyor...");
    try {
        // user.value'nun dolu olduğundan emin olalım
        // useAuthUser() zaten reaktif bir ref döndürdüğü için, değeri gelene kadar bekleyebiliriz
        // veya onBeforeMount içinde değeri geldikten sonra işlem yapabiliriz.
        // Şimdilik, user.value'nun onBeforeMount başladığında bir değere sahip olacağını varsayıyoruz.
        // Eğer useAuthUser asenkron olarak kullanıcıyı yüklüyorsa, bu kısım watch veya benzeri bir yapıyla güncellenmeli.
        // Ancak basitlik adına, user.value'nun burada erişilebilir olduğunu varsayalım.
        
        console.log("[profile.vue] Mevcut kullanıcı (useAuthUser):", JSON.parse(JSON.stringify(user.value)));

        if (user.value && user.value.id) { 
            console.log("[profile.vue] Görüntülenecek profil kullanıcısı:", user.value.username, "ID:", user.value.id);
            console.log(`[profile.vue] Tweetler çekiliyor (getUserTweets ile) kullanıcı ID: ${user.value.id} için...`);
            
            const result = await getUserTweets(); // Argümansız çağrı (giriş yapmış kullanıcı için)
            console.log("[profile.vue] getUserTweets'ten dönen ham sonuç:", result);

            if (result && result.tweets && Array.isArray(result.tweets)) {
                tweets.value = result.tweets;
            } else if (Array.isArray(result)) {
                tweets.value = result;
            } else {
                console.warn("[profile.vue] Tweet verisi beklenen formatta değil.");
                tweets.value = [];
            }
            console.log("[profile.vue] Tweetler işlendi, adet:", tweets.value.length);

        } else {
            console.warn("[profile.vue] Kullanıcı bilgisi veya ID'si bulunamadı, tweetler çekilemiyor.");
            if (!user.value) console.log("[profile.vue] user.value (useAuthUser) null veya undefined.");
            else if (user.value && !user.value.id) console.log("[profile.vue] user.value.id (useAuthUser) null veya undefined.");
            tweets.value = [];
        }
    } catch (error) {
        console.error("[profile.vue] onBeforeMount içinde profil verileri/tweetler çekilirken hata:", error);
    } finally {
        loading.value = false
        console.log("[profile.vue] onBeforeMount tamamlandı. Yükleme durumu false olarak ayarlandı.");
    }
})
</script>