// composables/useImdb.ts
interface Movie {
  rank: number;
  title: string;
  description: string;
  image: string;
  big_image: string;
  genre: string[];
  thumbnail: string;
  rating: string;
  id: string;
  year: number;
  imdbid: string;
  imdb_link: string;
}

export const useImdb = () => {
  const config = useRuntimeConfig();

  const fetchTop100Movies = async () => {
    const apiKey = config.public.rapidApiKey as string;
    const apiHost = config.public.rapidApiHost as string;
    const baseUrl = config.public.rapidApiBaseUrl as string;

    // Değerlerin varlığını kontrol edelim
    if (!apiKey || !apiHost || !baseUrl) {
      console.error(
        "API Anahtarı, Host veya Temel URL runtimeConfig içinde eksik. Lütfen .env ve nuxt.config.ts dosyalarınızı kontrol edin."
      );
      return null;
    }

    console.log("API İsteği Yapılıyor:");
    console.log("Base URL:", baseUrl);
    console.log("API Key (ilk 5 hanesi):", apiKey ? apiKey.substring(0, 5) + "..." : "BULUNAMADI"); // Anahtarın tamamını loglamayın
    console.log("API Host:", apiHost);

    try {
      const response = await $fetch<Movie[]>(`/`, { // Node.js örneğinizdeki gibi path: /
        baseURL: baseUrl, // https://imdb-top-100-movies.p.rapidapi.com
        method: 'GET',    // Node.js örneğinizdeki gibi
        headers: {
          'x-rapidapi-key': apiKey,    // Node.js örneğinizdeki gibi (küçük harf)
          'x-rapidapi-host': apiHost, // Node.js örneğinizdeki gibi (küçük harf)
        },
      });
      console.log("Filmler başarıyla çekildi:", response);
      return response;
    } catch (error: any) { // 'any' tipini kullanmak yerine daha spesifik bir hata tipi daha iyi olabilir (örn: FetchError)
      console.error("IMDb filmleri çekilirken hata oluştu (composables/useImdb.ts):", error);
      
      // $fetch tarafından döndürülen hata objesinin detaylarını loglayalım
      if (error.response) {
        console.error("API Hata Yanıt Durumu:", error.response.status);
        console.error("API Hata Yanıt Verisi:", error.response._data);
        console.error("API Hata Yanıt Başlıkları:", error.response.headers);
      } else if (error.request) {
        console.error("API isteği yapıldı ancak yanıt alınamadı:", error.request);
      } else {
        console.error("API isteği ayarlanırken bir hata oluştu:", error.message);
      }
      return null;
    }
  };

  return {
    fetchTop100Movies,
  };
};