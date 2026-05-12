# Whop Pilot — Cloudflare Pages Deploy Rehberi

> **Son g\u00fcncelleme:** 2026-05-12 — Larry \U0001f99e taraf\u0131ndan
> **Durum:** Build ge\u00e7iyor \u2705 | Cloudflare adapter ba\u015far\u0131l\u0131 \u2705 | Deploy senin elinde \u23f3

---

## \U0001f6a8 \u00d6NCE BUNLARI YAP (G\u00fcvenlik)

Geli\u015ftirme s\u0131ras\u0131nda canl\u0131 API key'ler chat transkriptine d\u00fc\u015ft\u00fc. Deploy etmeden \u00d6NCE:

1. **Whop API key revoke + yeniden \u00fcret**
   - Whop Developer Dashboard \u2192 API Keys \u2192 mevcut key'i revoke et
   - Yeni key olu\u015ftur, ad\u0131n\u0131 yaz (chat'e yap\u0131\u015ft\u0131rma!)
2. **Groq API key revoke + yeniden \u00fcret**
   - https://console.groq.com/keys \u2192 mevcut key'i revoke et
   - Yeni key olu\u015ftur

> Yeni key'leri Cloudflare panelinde *Environment Variables* k\u0131sm\u0131na direkt yap\u0131\u015ft\u0131r, chat'te yazma.

---

## \U0001f4e6 1. GitHub Push

Lokal commit'ler haz\u0131r ama remote authentication senin elinde. Terminal'de:

```bash
cd "/Users/nuriydrm/Desktop/whop taze ba\u015flang\u0131\u00e7/whop-pilot"
git push origin main
```

E\u011fer GitHub auth sormazsa zaten cached. Sorarsa Personal Access Token kullan.

---

## \u26a1 2. Cloudflare Pages Setup

### 2a. Yeni proje olu\u015ftur

Cloudflare Dashboard \u2192 **Workers & Pages** \u2192 **Create application** \u2192 **Pages** \u2192 **Connect to Git**

GitHub authorize et, `NuriGid/whop-pilot` reposunu se\u00e7.

### 2b. Build settings (\u00f6nemli!)

| Ayar | De\u011fer |
|------|-------|
| **Framework preset** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | (bo\u015f b\u0131rak) |
| **Node.js version** | `18` veya `20` (env var: `NODE_VERSION=18`) |

### 2c. Environment Variables (Settings \u2192 Environment Variables)

| Variable | De\u011fer | Notlar |
|----------|-------|--------|
| `WHOP_API_KEY` | (yeni revoke edilmi\u015f key) | Production + Preview |
| `GROQ_API_KEY` | (yeni revoke edilmi\u015f key) | Production + Preview |
| `WHOP_WEBHOOK_SECRET` | Whop Developer \u2192 Webhooks panelinden al | Production |
| `NEXT_PUBLIC_WHOP_APP_ID` | Whop Developer \u2192 App ID | Production |
| `NEXT_PUBLIC_APP_URL` | `https://whop-pilot.pages.dev` (deploy sonras\u0131 g\u00fcncelle) | Production |
| `NODE_VERSION` | `18` | Build runtime |

### 2d. Compatibility flag (zorunlu!)

Settings \u2192 **Functions** \u2192 **Compatibility flags** \u2192 ekle:

```
nodejs_compat
```

Bu olmazsa edge runtime'da bir\u00e7ok Node API'si k\u0131r\u0131l\u0131r.

### 2e. Deploy

**Save and Deploy** butonu. \u0130lk build ~3-5 dakika.

Build log'da \u015fu sat\u0131rlar\u0131 g\u00f6rmelisin:
```
Edge Function Routes (4)
  /api/ai-insights
  /api/metrics
  /api/webhooks
  /dashboard/[courseId]
```

Lokal'de testlendi, sorun \u00e7\u0131kmamas\u0131 laz\u0131m.

---

## \U0001f50c 3. Whop Developer Dashboard

Deploy URL'i hand al\u0131nca:

1. Whop Developer \u2192 Apps \u2192 **Iframe URL**:
   ```
   https://whop-pilot.pages.dev/dashboard/[courseId]
   ```
   > `[courseId]` parametresi Whop taraf\u0131ndan ger\u00e7ek course ID ile dolduruluyor (\u00f6r: `crse_abc123`).

2. **Webhook URL**:
   ```
   https://whop-pilot.pages.dev/api/webhooks
   ```
   Webhook secret'\u0131 al, Cloudflare env'e ekle (yukar\u0131da).

---

## \U0001f9ea 4. Smoke Test

Deploy bitince:

1. `https://whop-pilot.pages.dev/dashboard/demo` \u2192 mock veri ile dashboard a\u00e7\u0131lmal\u0131
2. `https://whop-pilot.pages.dev/api/metrics?courseId=demo` \u2192 JSON d\u00f6nmeli (Whop API hatas\u0131 normal, course `demo` yok)
3. Browser DevTools \u2192 Network \u2192 `/api/ai-insights` POST'u dene (Refresh AI butonu)

---

## \U0001f9f9 Larry'nin Bu Gece Yapt\u0131klar\u0131 (12 May 2026)

- \u2705 `next.config.ts` \u2192 `output: 'export'` kald\u0131r\u0131ld\u0131
- \u2705 `[companyId]` \u2192 `[courseId]` rename + t\u00fcm referans g\u00fcncellemesi
- \u2705 Next 15 breaking change: `params` Promise pattern (async layout + `use()` client component)
- \u2705 Whop SDK import fix: `WhopServerSdk` (yok) \u2192 `Whop` (do\u011fru)
- \u2705 SDK constructor fix: `{ token }` \u2192 `{ apiKey }`
- \u2705 `Header.tsx` duplicate `border` property bug fix (TS1117)
- \u2705 `webhooks/route.ts`: Node `crypto` \u2192 Web Crypto API (Edge-compatible)
- \u2705 `metrics/route.ts`: `CourseListResponse.chapters` (yok) \u2192 kald\u0131r\u0131ld\u0131
- \u2705 `RevenueChart.tsx`: `any` types \u2192 `TooltipPayloadItem` interface
- \u2705 `ChurnGuard.tsx`: unescaped `"` \u2192 `&quot;`
- \u2705 Edge runtime: `/dashboard/[courseId]/layout.tsx`'e `export const runtime = 'edge'`
- \u2705 `.gitignore`: `.wrangler` eklendi
- \u2705 `npm run build` ge\u00e7iyor
- \u2705 `npx @cloudflare/next-on-pages` ba\u015far\u0131yla `.vercel/output/static/_worker.js` \u00fcretti

## \u23f3 Boss'un Sabah Yapaca\u011f\u0131 (5 dakika)

1. \u0130ki API key'i revoke et + yeniden \u00fcret (g\u00fcvenlik)
2. `git push origin main`
3. Cloudflare Pages \u2192 yeni proje + ayarlar (yukar\u0131daki tablo)
4. Env variables + `nodejs_compat` flag
5. Save and Deploy
6. Whop iframe URL'i deploy URL'ine g\u00fcncelle

---

## \U0001f504 Sonraki Geli\u015ftirmeler (TODO)

- [ ] `whopClient.payments.list()` ile ger\u00e7ek MRR
- [ ] `RetentionAlerts` \u2192 ger\u00e7ek at-risk \u00f6\u011frenci listesi (mock'tan \u00e7\u0131k)
- [ ] Webhook event handler'lar (TODO comment'leri kodda mevcut)
- [ ] ESLint warning'leri temizle (8 adet kullan\u0131lmayan import)
