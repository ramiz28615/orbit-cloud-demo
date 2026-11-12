# Orbit Cloud — etkileşimli prototip

Bu depo statik, GitHub Pages üzerinde barındırılabilir Orbit Cloud arayüz prototipidir. Dashboard’daki projeler, dağıtımlar, alan adları ve analitik örnek veridir; bunlar gerçek backend işlemi yapmaz.

## Firebase Google Authentication

Firebase Web App istemci yapılandırması `firebase-config.js` dosyasında bulunur. Dosyadaki değerler Firebase Console’daki proje yapılandırmasıyla eşleşmelidir; statik web istemcisi yapılandırması gizli yönetici anahtarı değildir. Bu dosyayı repoda yayımlamadan önce içeriğinin hedef Firebase projesine ait olduğunu doğrulayın.

Firebase Console’da Authentication > Sign-in method bölümünden Google sağlayıcısını etkinleştirin ve Authentication > Settings > Authorized domains bölümüne dağıtım alan adınızı (yerel test için `localhost`) ekleyin. Sayfayı HTTP(S) üzerinden sunun; `file://` modunda ES modülleri çalışmayabilir.

Uygulama Firebase modüllerini ve `firebase-config.js` dosyasını dinamik olarak yükler. Firebase CDN’i, yapılandırma dosyası veya başlatma erişilemezse Google düğmesi anlaşılır hata verir; Firebase’den bağımsız demo arayüzü ve pano işlemleri çalışmaya devam eder. Google popup ile oturum açma, kalıcı tarayıcı oturumu, auth state’e göre kimlik adı/e-posta gösterimi ve Firebase `signOut` çıkışı kullanılır. Popup kapatma/engelleme, ağ, yetkili alan adı ve sağlayıcı hataları kullanıcıya bildirilir.

## Demo sınırları

- “Demo panosunu aç (hesapsız)” örnek panoyu açar; Firebase oturumu veya kullanıcı hesabı oluşturmaz.
- E-posta/şifre girişi sunulmaz; kullanıcıdan demo amacıyla gerçek parola istenmez.
- Dashboard içeriği, proje/dağıtım/domain/analitik ve ayar işlemleri örnek/demodur; gerçek Git, deploy, API veya DNS backend’i yoktur.
