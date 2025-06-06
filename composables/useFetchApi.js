export default (url, options = {}) => {
    const { useAuthToken } = useAuth()
    const config = useRuntimeConfig()

    return $fetch(config.public.apiBase + url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${useAuthToken().value}`
        }
    })
}