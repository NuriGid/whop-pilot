# Whop Pilot - Cloudflare Pages Deploy Rehberi

## 📦 Deployment Adımları

### 1. GitHub'a Pushla

```bash
cd "whop-pilot"
git init
git add .
git commit -m "feat: Elite CEO Dashboard - Course Analytics + Groq AI"
git remote add origin https://github.com/SENIN_KULLANICIN/whop-pilot.git
git push -u origin main
```

### 2. Cloudflare Pages Ayarları

Cloudflare Dashboard → Pages → "Create a project" → GitHub reposunu seç.

| Ayar | Değer |
|------|-------|
| **Framework** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output dir** | `.vercel/output/static` |
| **Node.js version** | `18` |

### 3. Environment Variables (Cloudflare)

Pages → Settings → Environment Variables:

```
WHOP_API_KEY       = apik_y2ht21VCPQFCa_...
GROQ_API_KEY       = gsk_wsmeTh5wpoF9Wr...
WHOP_WEBHOOK_SECRET = (Whop panelinden alacaksın)
NEXT_PUBLIC_WHOP_APP_ID = (Whop App ID'n)
NEXT_PUBLIC_APP_URL = https://SENIN_SITEN.pages.dev
```

### 4. Whop Developer Dashboard

Whop Developer → App → Iframe URL:
```
https://SENIN_SITEN.pages.dev/dashboard/[courseId]
```

> **Önemli:** courseId URL parametresi olarak Whop'taki kursunun ID'si girilmeli.
> Whop, bu URL'i kendi admin panelinde iframe olarak açacak ve `Authorization: Bearer <token>` header'ını otomatik ekleyecek.

### 5. URL Yapısı

```
/dashboard/[courseId]   → Belirli bir kursa ait CEO dashboard
```

Kurs ID'nizi Whop panelinden bulabilirsiniz (genellikle `crse_...` formatında).

---

## 🔄 Sonraki Geliştirmeler

- [ ] `whopClient.memberships.list()` → Gelir verilerini gerçek MRR hesabı
- [ ] `whopClient.payments.list()` → Revenue Recovery otomasyonu
- [ ] Gerçek `RetentionAlerts` → Son 7 günde giriş yapmayan öğrenciler
- [ ] Webhook → Anlık üyelik aktivasyon/deaktivasyon bildirimleri
