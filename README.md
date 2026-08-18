# dynamicComponentGPT — AiCommandCard

Yerinde genişleyen (single persistent DOM surface, in-place morphing) AI komuta
kartı bileşeni + Storybook + GitHub Pages cihaz önizleme demosu.

- Bileşen dokümantasyonu: [src/components/AiCommandCard/README.md](src/components/AiCommandCard/README.md)

## Komutlar

```bash
npm install        # bağımlılıklar
npm test           # Vitest interaction testleri
npm run storybook  # Storybook (geliştirici görünümü) http://localhost:6006
npm run dev        # Cihaz önizleme demosu (end-user görünümü)
npm run build      # dist/ — GitHub Pages'e deploy edilen statik demo
```

## GitHub Pages cihaz önizlemesi

`index.html`, bileşen sayfasını (`frame.html`) gerçek cihaz boyutlarında bir
iframe içinde açan bir **device switcher** kabuğudur:

- **Telefon** 390×844 · **Tablet** 834×1112 · **PC** 1366×768 · **Akışkan** (pencere boyutu)
- Dikey/yatay yön değiştirme; çerçeve pencereye otomatik ölçeklenir
- iframe gerçek viewport olduğu için media/container query'ler her cihazda
  gerçekte olduğu gibi çalışır; Safari/Chrome/Opera ve macOS/Windows/Linux/
  iOS/Android'de düz statik HTML+JS olarak açılır

Deploy: `main`'e push → `.github/workflows/deploy.yml` test + build alıp
`dist/`i GitHub Pages'e yayınlar (repo ayarlarında Pages source olarak
"GitHub Actions" seçili olmalı).

Demo sayfasındaki 12 komut kartı admin ana menüsü gibi davranır: karta
tıklamak o sayfayı modal olarak açar (6 child bölüm kartı + grafikler + veri
tablosu). Bu modal demo host sayfasına aittir; bileşenin tek-yüzey invariant'ı
kartın kendi genişlemesi için geçerlidir ve korunur.
