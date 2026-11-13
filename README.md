# Orbit Cloud — etkileşimli prototip

Orbit Cloud, GitHub Pages üzerinde barındırılan statik ve responsive bir dashboard prototipidir. Overview, Projects, Deployments, CI, Logs, Traces, Analytics, Speed Insights, Observability, Firewall, CDN, Environment Variables, Domains, Connect, Integrations, Storage, Flags, Agent, Vulnerabilities, AI Gateway, Sandboxes, Workflows, Images, Daemons, Usage, Support ve Settings için tıklanabilir görünümler içerir.

## Firebase Google Authentication

Google ile giriş gerçek Firebase Authentication kullanır. İlk Google girişinde Firebase hesabı otomatik oluşturulur; sonraki girişler mevcut hesabı kullanır. Oturum tarayıcıda kalıcıdır ve çıkış Firebase `signOut` ile yapılır. `firebase-config.js` herkese açık Firebase web istemci yapılandırmasını içerir; yönetici servis hesabı anahtarı değildir.

Firebase Console'da Google sağlayıcısı etkin ve dağıtım alan adı yetkili olmalıdır. Uygulama Firebase modüllerini dinamik yükler; bağlantı veya yapılandırma hatasında Google giriş düğmesi açıklayıcı hata gösterir. Sayfayı HTTP(S) üzerinden sunun; `file://` ile ES modülleri çalışmayabilir.

## Salt-okunur Vercel verisi

Doğrulanmış çalışma alanı sahibi giriş yaptığında Projects ve Deployments ekranları [ayrı sunucu köprüsünden](https://orbit-cloud-readonly-bridge.vercel.app/api) canlı Vercel verisi alır. Köprü Firebase ID token'ını sunucuda doğrular ve yalnızca sahibin kimliğine izin verir. Vercel erişim anahtarı yalnızca Vercel'deki hassas sunucu ortam değişkeninde saklanır; web sayfasına, tarayıcı depolamasına veya bu herkese açık depoya konmaz. Köprü yalnızca proje ve dağıtım listeleme GET çağrıları yapar ve yanıtları önbelleğe almaz.

Bu iki ekran salt-okunurdur: proje/dağıtım oluşturma, dağıtım başlatma, ayar değiştirme, silme veya faturalandırma işlemi yoktur. Köprü mevcut Vercel Hobby çalışma alanında çalışır; bu entegrasyon plan veya faturalandırma değişikliği yapmaz. Süreli Vercel erişim anahtarının süresi dolduğunda sunucu tarafındaki gizli değişkenin yenilenmesi ve köprünün yeniden dağıtılması gerekir.

## Demo sınırları

- Hesapsız demo panosu Firebase oturumu veya hesabı oluşturmaz; `?demo=1` parametresi doğrudan örnek görünümü açar.
- Overview ölçümleri, etkinlik akışı ve Projects/Deployments için oturum açılmamış demo verileri sentetiktir.
- CI, loglar, traces, analytics, alan adları, environment variables, entegrasyonlar, storage ve diğer bulut ekranları örnek veridir; gerçek kaynaklara bağlanmaz.
- Demo modundaki yeni proje, dağıtım, alan adı ve ayar etkileşimleri yalnızca geçici tarayıcı simülasyonudur; gerçek Git deposu, build, dağıtım, DNS kaydı veya bulut ayarı oluşturmaz. Örnek değişiklikler yenilemede sıfırlanır.
- E-posta/şifre formu yoktur; Google girişi dışında ek kişisel bilgi toplanmaz.
