export default () => {

    const usePostTweetModal = () => useState('post_tweet_modal', () => false)
    const useReplyTweet = () => useState('reply_tweet', () => null)

    const closePostTweetModal = () => {
        const postTweetModal = usePostTweetModal()
        postTweetModal.value = false
    }

    const setReplyTo = (tweet) => {
        const replyTweet = useReplyTweet()
        replyTweet.value = tweet
    }

    const openPostTweetModal = (tweet = null) => {
        const postTweetModal = usePostTweetModal()
        postTweetModal.value = true

        setReplyTo(tweet)
    }

    const postTweet = (formData) => {
        const form = new FormData()

        form.append('content', formData.text)

        formData.mediaFiles.forEach((mediaFile, index) => {
            form.append('media_file_' + index, mediaFile)
        })

        return useFetchApi('/api/posts/create', {
            method: 'POST',
            body: form
        })
    }

    const transformPost = (post) => {
        return {
            id: post.id,
            text: post.content,
            mediaFiles: post.image_url ? [{ id: 1, url: post.image_url }] : [],
            createdAt: post.created_at,
            userId: post.user_id,
            is_official: post.is_official
        }
    }

    const getTweets = (params = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi('/api/posts/', {
                    method: 'GET',
                    params
                })

                if (response && response.posts) {
                    resolve({ tweets: response.posts.map(transformPost) })
                } else {
                    resolve([])
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const getTweetById = (tweetId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await useFetchApi(`/api/posts/${tweetId}`)

                if (response && response.post) {
                    resolve({ tweet: transformPost(response.post) })
                } else {
                    resolve(null)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const getUserTweets = (params = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const username = params.username || useAuth().useAuthUser().value?.username
                if (!username) throw new Error('Username not provided')

                const response = await useFetchApi(`/api/posts/${username}`, {
                    method: 'GET'
                })

                if (response && response.posts) {
                    resolve({ tweets: response.posts.map(transformPost) })
                } else {
                    resolve([])
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    return {
        postTweet,
        getTweets,
        getTweetById,
        getUserTweets,
        closePostTweetModal,
        usePostTweetModal,
        openPostTweetModal,
        useReplyTweet
    }
}