<template>
    <div>
        <MainSection title="Home" :loading="loading">

            <Head>
                <Title>Home / Twitter</Title>
            </Head>

            <div class="border-b" :class="twitterBorderColor">
                <TweetForm :user="user" @on-success="handleFormSuccess" />
            </div>

            <TweetListFeed :tweets="homeTweets" />

        </MainSection>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue';

const { twitterBorderColor } = useTailwindConfig();
const { getTweets } = useTweets();
// Sadece user bilgisine ihtiyacımız var, onu da useAuth'tan alıyoruz
const { user } = useAuth();

const loading = ref(false);
const homeTweets = ref([]);

onBeforeMount(async () => {
    loading.value = true;
    try {
        const { tweets } = await getTweets();
        homeTweets.value = tweets;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});

function handleFormSuccess(tweet) {
    navigateTo({
        path: `/status/${tweet.id}`
    });
}
</script>