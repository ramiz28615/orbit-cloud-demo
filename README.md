# Orbit Cloud

Orbit Cloud, GitHub Pages üzerinde barındırılan statik bir dashboard prototipidir. Google girişi Firebase Authentication kullanır. Doğrulanmış ve köprüde sahip olduğu teyit edilmiş oturumla Projects, Deployments, Domains ve desteklenen ölçüde Web Analytics verileri salt-okunur biçimde gösterilir. Diğer paneller açıkça veri yok/demo olarak işaretlenir; sentetik canlı metrik üretilmez.

## Google ile giriş

İlk Google girişinde Firebase hesabı otomatik oluşturulur; sonraki girişler mevcut hesabı kullanır. Oturum tarayıcıda kalıcıdır ve çıkış Firebase `signOut` ile yapılır. `firebase-config.js`, tarayıcıda kullanılmak üzere tasarlanmış herkese açık Firebase web istemci yapılandırmasını içerir; yönetici servis hesabı anahtarı değildir. Firebase Console'da Google sağlayıcısı etkin ve GitHub Pages alan adı yetkili olmalıdır.

## Canlı Vercel verisi

Özel [salt-okunur Vercel köprüsü](https://orbit-cloud-readonly-bridge.vercel.app/api) Firebase ID token'ını sunucuda doğrular ve yalnızca yapılandırılmış, Google sağlayıcısından doğrulanmış sahibin kimliğine erişim verir. Köprüdeki Vercel erişim anahtarı yalnızca sunucu tarafında tutulur; bu depoya, sayfaya veya tarayıcıya eklenmez. İstemci ve köprü yalnızca GET istekleri yapar; yanıtlar önbelleğe alınmaz.

Projects ve Deployments, API'nin en fazla 100 kayıtlık yanıtını gösterir; bu sayılar hesaptaki toplamı belirtmez. Domains hesabın en fazla 100 alan adını listeler; ek sayfa varsa görünüm kısmi olduğunu bildirir. Web Analytics yalnızca etkin olduğu anlaşılan en fazla beş projeyi sorgular, günlük sayfa görüntüleme toplamlarını gösterir ve kısmi kapsamı belirtir. Ziyaretçi kimliği ve ham istek boyutları alınmaz. API erişimi, ürün izni veya plan kapsamı yeterli değilse Analytics “veri yok/kullanılamıyor” olarak kalır.

Bu uygulama veya köprü hiçbir proje, dağıtım, alan adı, ayar ya da entegrasyon oluşturmaz/değiştirmez; build/deploy başlatmaz; silme, DNS düzenleme, environment variable/secret veya log okuma yapmaz; billing bilgisi okumaz ya da değiştirmez. Hobby ve Firebase Spark planları korunur; ücretli kullanım veya ek yetki gerekirse ayar değişikliği yapmadan durulur.

## Demo ve sınırlamalar

Hesapsız demo modu (`?demo=1` dahil) gerçek kaynağa bağlanmaz ve canlıymış gibi örnek proje, deployment, alan adı, grafik veya ölçüm göstermez. Tanıtım görselindeki örnek kart statiktir ve canlı kayıt değildir. CI, Logs, Traces, Speed Insights, Observability, Firewall, CDN, Environment Variables, Integrations, Storage, Flags, Agent, Vulnerabilities, AI Gateway, Sandboxes, Workflows, Images, Daemons, Usage, Support ve Settings için güvenli ve doğrulanmış salt-okunur kaynak yoktur; ekranlarda açık bir veri yok/demo açıklaması yer alır.

## Yerel önizleme

Sayfayı HTTP(S) üzerinden sunun; `file://` ile ES modülleri çalışmayabilir. Örneğin `python3 -m http.server 8000` komutunu depo kökünde çalıştırabilirsiniz. Gerçek Google girişi için ayrıca Firebase proje yapılandırması ve yetkili alan adı gerekir.
