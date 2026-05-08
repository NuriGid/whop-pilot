# 🤖 Proje Handoff: Whop Pilot - Elite CEO Course Dashboard

## Proje Nedir?
Whop platformunda **kurs satan içerik üreticileri** için geliştirilmiş bir **CEO dashboard uygulaması**.
Whop'un admin panelinde iframe olarak çalışacak, kurs sahiplerine gelir, öğrenci ve churn analizleri sunacak.

---

## 📁 Proje Konumu
```
/Users/nuriydrm/Desktop/whop taze başlangıç/whop-pilot/
```

## 🚀 Çalıştırma
```bash
cd "/Users/nuriydrm/Desktop/whop taze başlangıç/whop-pilot"
npm run dev
# → http://localhost:3000/dashboard/demo
```

---

## 🛠 Teknoloji Yığını
- **Next.js 15.2.0** (App Router, Edge Runtime)
- **Tailwind CSS 4**
- **@whop/sdk** (v0.0.38) — Whop API istemcisi
- **Groq AI** (Llama 3.3) — AI CEO tavsiyeleri
- **Framer Motion** — animasyonlar
- **Recharts** — gelir grafikleri
- **Lucide React** — ikonlar
- **Hedef Deploy:** Cloudflare Pages (`@cloudflare/next-on-pages`)

---

## 🔑 API Anahtarları (.env.local — HAZIR)
```env
WHOP_API_KEY=apik_***  ← .env.local dosyasında mevcut, Cloudflare env'e ekle
GROQ_API_KEY=gsk_***   ← .env.local dosyasında mevcut, Cloudflare env'e ekle
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here   ← HENÜZ ALINMADI
WHOP_WEBHOOK_SECRET=your_webhook_secret_here  ← HENÜZ ALINMADI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Tamamlananlar

### Altyapı
- [x] Next.js 15 projesi kuruldu
- [x] Cloudflare uyumluluğu için `@cloudflare/next-on-pages` + `wrangler` kuruldu
- [x] Tüm API route'larına `export const runtime = 'edge'` eklendi
- [x] `next.config.ts` Cloudflare için yapılandırıldı (unoptimized images, iframe headers)
- [x] İlk Git commit'i alındı (39 dosya, ~15k satır)

### UI/UX
- [x] **Premium dark mode tasarım** (glassmorphism, neon vurgular, Space Grotesk + Inter font)
- [x] **Sidebar** — Kurs değiştirici, canlı sistem durumu
- [x] **Header** — Arama, yenile butonu, bildirim zili
- [x] **StatCard** — Animasyonlu KPI kartları (Revenue, Members, MRR, Churn, LTV)
- [x] **RetentionAlerts** — Risk skorlu churn alarm paneli
- [x] **ChurnGuard** — Üyelik iptal takip modülü
- [x] **RevenueRecovery** — Başarısız ödeme kurtarma paneli
- [x] **AIInsights** — Groq Llama 3 ile CEO tavsiyeleri (çalışıyor!)
- [x] **RevenueChart** — 30 günlük gelir/üye grafiği (Recharts)

### API Entegrasyonu
- [x] `src/app/api/ai-insights/route.ts` — Groq API → gerçek AI tavsiyeleri üretiyor
- [x] `src/app/api/metrics/route.ts` — **Whop Course API** entegrasyonu:
  - `whopClient.courses.retrieve(courseId)` → kurs adı, chapter/lesson sayısı
  - `whopClient.courseStudents.list({ course_id })` → toplam öğrenci, tamamlama oranı, risk altındaki öğrenciler
- [x] `src/app/api/webhooks/route.ts` — Whop webhook altyapısı (HMAC doğrulama)
- [x] `src/lib/auth.ts` — Whop iframe Bearer token doğrulama (dev modda fallback)
- [x] `src/lib/whop.ts` — Singleton Whop client
- [x] `src/lib/groq.ts` — Groq client (Llama 3.3 70B)
- [x] `src/lib/mock-data.ts` — Gerçekçi demo veriler (API yokken fallback)

### Dashboard Akışı (Şu anki durum)
Dashboard açıldığında:
1. `useEffect` → `/api/metrics?courseId=XXXX` çağırır
2. Gerçek Whop verisi gelirse: kurs adı, öğrenci sayısı, tamamlama %, risk % güncellenir
3. Hata/dev modda: mock-data.ts verisi gösterilir
4. AI CEO Insights: "Regenerate" butonuna basınca Groq'a POST gider, gerçek analiz döner

---

## ❌ Eksikler / Yapılacaklar (Öncelik Sırasıyla)

### 1. 🔴 GitHub Push (ÖNCE BU!)
```bash
git remote add origin https://github.com/KULLANICI/whop-pilot.git
git push -u origin main
```
Kullanıcının GitHub kullanıcı adını sor.

### 2. 🔴 Cloudflare Pages Deploy
- Cloudflare → Pages → GitHub reposunu bağla
- Build command: `npx @cloudflare/next-on-pages`
- Output: `.vercel/output/static`
- Environment variables'ı ekle (yukarıdaki env değerleri)

### 3. 🟡 `next.config.ts` Düzeltmesi
Şu an `output: 'export'` var ama bu SSR'ı kırıyor. `@cloudflare/next-on-pages` ile birlikte kullanmak için bu satırı KALDIR:
```ts
// output: 'export'  ← BU SATIRI SİL
```
Cloudflare adapter bunu zaten handle ediyor.

### 4. 🟡 Whop App ID Al
- Whop Developer Dashboard → Apps → App ID'yi al
- `.env.local` → `NEXT_PUBLIC_WHOP_APP_ID=app_XXXXX`

### 5. 🟡 Webhook Secret Al
- Whop Developer → Webhooks → Secret al
- `.env.local` → `WHOP_WEBHOOK_SECRET=whs_XXXXX`

### 6. 🟢 Gerçek Revenue Verisi
`/api/metrics/route.ts` içine şunu ekle:
```ts
// Gerçek MRR hesabı
const paymentsPage = await whopClient.payments.list({ 
  company_id: companyId,
  first: 100 
});
const payments = paymentsPage.data ?? [];
const mrr = payments
  .filter(p => p.status === 'paid')
  .reduce((sum, p) => sum + (p.total ?? 0), 0);
```

### 7. 🟢 RetentionAlerts Gerçek Veri
Şu an mock-data kullanıyor. Gerçek "at-risk" öğrencileri çekmek için:
```ts
const atRisk = students.filter(s => s.completed_lessons_count === 0);
// Bu listeyi RetentionAlerts component'ine props olarak ver
```

### 8. 🟢 URL Yapısını Güncelle
Şu an `/dashboard/[companyId]` var ama Course yapısına geçtik.
`/dashboard/[courseId]` olarak yeniden adlandır:
```bash
mv "src/app/dashboard/[companyId]" "src/app/dashboard/[courseId]"
```
Ve tüm `params.companyId` → `params.courseId` yap.

---

## 📂 Klasör Yapısı
```
src/
├── app/
│   ├── api/
│   │   ├── ai-insights/route.ts   ← Groq AI (edge, çalışıyor)
│   │   ├── metrics/route.ts       ← Whop Course API (edge, çalışıyor)
│   │   └── webhooks/route.ts      ← Whop Webhooks (edge)
│   ├── dashboard/
│   │   └── [companyId]/
│   │       ├── layout.tsx          ← Auth + Sidebar wrapper
│   │       └── page.tsx            ← Ana dashboard sayfası
│   ├── globals.css                 ← Premium dark theme
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   │   ├── AIInsights.tsx
│   │   ├── ChurnGuard.tsx
│   │   ├── Header.tsx
│   │   ├── RetentionAlerts.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── RevenueRecovery.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       └── StatCard.tsx
└── lib/
    ├── auth.ts        ← Whop token doğrulama
    ├── groq.ts        ← Groq AI client
    ├── mock-data.ts   ← Demo/fallback veriler
    ├── utils.ts       ← Yardımcı fonksiyonlar
    └── whop.ts        ← Whop SDK singleton
```

---

## 🎯 Özet: Bir Sonraki Session'da İlk 3 Adım
1. `next.config.ts` içindeki `output: 'export'` satırını sil
2. GitHub repo oluştur ve push et
3. Cloudflare Pages'e bağla ve deploy al → canlı URL elde et
