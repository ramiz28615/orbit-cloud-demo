# Orbit Cloud — etkileşimli prototip

Orbit Cloud, GitHub Pages üzerinde barındırılan statik ve responsive bir dashboard prototipidir. Overview dışında Projects, Deployments, CI, Logs, Traces, Analytics, Speed Insights, Observability, Firewall, CDN, Environment Variables, Domains, Connect, Integrations, Storage, Flags, Agent, Vulnerabilities, AI Gateway, Sandboxes, Workflows, Images, Daemons, Usage, Support ve Settings için tıklanabilir demo görünümleri içerir.

## Firebase Google Authentication

Google ile giriş gerçek Firebase Authentication kullanır. Kullanıcının ilk Google girişinde Firebase hesabı otomatik oluşturulur; sonraki girişler mevcut hesabı kullanır. Oturum tarayıcıda kalıcıdır ve çıkış Firebase `signOut` ile yapılır. `firebase-config.js` Firebase web istemci yapılandırmasını içerir; yönetici servis hesabı anahtarı değildir.

Firebase Console'da Google sağlayıcısı etkin ve dağıtım alan adı yetkili olmalıdır. Uygulama Firebase modüllerini dinamik yükler; bağlantı veya yapılandırma hatasında Google giriş düğmesi açıklayıcı hata gösterir. Sayfayı HTTP(S) üzerinden sunun; `file://` ile ES modülleri çalışmayabilir.

## Demo sınırları

- Hesapsız demo panosu Firebase oturumu veya hesabı oluşturmaz. `?demo=1` parametresi doğrudan demo panosunu açar.
- Dashboard verilerinin tamamı sentetik örnektir. Vercel veya Google Cloud hesapları, kaynakları, ölçümleri ya da API'leri okunmaz ve bu servislerde işlem yapılmaz.
- Yeni proje, dağıtım, alan adı ve ayar etkileşimleri yalnızca geçici, tarayıcı içi simülasyonlardır; gerçek Git deposu, build, dağıtım, DNS kaydı veya bulut ayarı oluşturmaz. Örnek değişiklikler yenilemede sıfırlanır.
- E-posta/şifre formu yoktur; Google girişi dışında ek kişisel bilgi toplanmaz.
- Firebase Spark ücretsiz planı korunur. Bu prototip ücretli özellikleri veya faturalandırmayı etkinleştirmez.
