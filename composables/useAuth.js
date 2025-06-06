import { ref,  } from 'vue';

export default function useAuth() {
    //
    // --- STATE (Durum Yönetimi) ---
    //
    // Kullanıcı bilgisini tutan global state. Başlangıçta null.
    const user = useState('auth_user', () => null);
    // Kimlik doğrulama işleminin yüklenme durumunu tutan global state.
    // Sayfa ilk yüklendiğinde kontrol başlayacağı için başlangıçta 'true' olmalı.
    const loading = useState('auth_loading', () => true);

    //
    // --- FUNCTIONS (Fonksiyonlar) ---
    //

    // UYGULAMA BAŞLANGICINDA KULLANICI KONTROLÜ
    // Bu fonksiyon, tarayıcıda kayıtlı token'ı kontrol edip kullanıcıyı getirmeye çalışır.
    const initAuth = async () => {
        loading.value = true;
        try {
            // Tarayıcıdaki token'ı al
            const tokenValue = localStorage.getItem('auth_token');
            if (!tokenValue) {
                return; // Token yoksa işlemi bitir.
            }

            // Token ile '/api/users/me' endpoint'ine istek at
            const data = await $fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenValue}`
                }
            });

            if (data.success) {
                user.value = data.data; // Kullanıcı bilgisini state'e ata
            }

        } catch (error) {
            // Token geçersizse veya bir hata olursa kullanıcıyı ve token'ı temizle
            user.value = null;
            localStorage.removeItem('auth_token');
            console.error("initAuth error:", error);
        } finally {
            loading.value = false;
        }
    };

    // KULLANICI GİRİŞİ
    const login = async ({ username, password }) => {
        loading.value = true;
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await $fetch('/api/users/login', {
                method: 'POST',
                body: formData
            });

            if (response.success) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem('auth_token', response.access_token);
                // Kullanıcı verisini almak için initAuth'u yeniden çalıştır
                await initAuth();
                return response;
            } else {
                throw new Error(response.message || 'Giriş başarısız oldu');
            }
        } catch (error) {
            console.error('Giriş sırasında hata:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    // KULLANICI ÇIKIŞI
    const logout = () => {
        user.value = null;
        localStorage.removeItem('auth_token');
        // Giriş sayfasına yönlendir
        navigateTo('/auth'); 
    };

    // Dışarıya açılacak tüm state ve fonksiyonlar
    return {
        user,
        loading,
        login,
        initAuth,
        logout
    };
}