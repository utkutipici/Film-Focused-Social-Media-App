<template>
    <div class="border-t" :class="twitterBorderColor"> <div v-if="isEmptyArray" class="p-6 text-center"> <div class="flex flex-col items-center">
                <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.586 15H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1h-1.586l-2.707 2.707A.996.996 0 0115 17v-2H9v2c0 .399-.216.764-.553.924L5.586 15zM12 11a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                <p class="text-gray-500 dark:text-gray-400 text-base">
                    Henüz hiç tweet yok. 😢
                </p>
                </div>
        </div>
        <div v-else>
            <div class="pb-4 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300"
                :class="[twitterBorderColor, defaultTransition]" v-for="tweet in props.tweets" :key="tweet.id"
                @click="redirect(tweet)"> <TweetItem :tweet="tweet" compact />
            </div>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue' // computed import edildi
const { twitterBorderColor, defaultTransition } = useTailwindConfig()

const props = defineProps({
    tweets: {
        type: Array,
        required: true
    }
})

const isEmptyArray = computed(() => !props.tweets || props.tweets.length === 0) // Daha güvenli kontrol

function redirect(tweet) {
    navigateTo(`/status/${tweet.id}`)
}
</script>