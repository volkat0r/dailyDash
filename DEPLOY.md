# Deployment Guide

## Architektur

```
Browser (Hostinger) → Railway Proxy → Todoist API
                                    → Intervals.icu API
```

Google Calendar OAuth läuft direkt im Browser (kein Proxy nötig).

---

## 1. Railway Proxy deployen

### Account & Projekt anlegen
1. [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Wähle `volkat0r/dailyDash` → Root Directory: **`server`**

### Umgebungsvariablen in Railway setzen
Im Railway Dashboard → dein Service → **Variables**:

| Variable | Wert |
|---|---|
| `INTERVALS_API_KEY` | dein Intervals.icu API Key |
| `TODOIST_TOKEN` | dein Todoist API Token |
| `FRONTEND_URL` | z.B. `https://dailydash.deinedomain.de` |

### Railway-URL notieren
Nach dem Deploy → **Settings** → **Domains** → URL kopieren
z.B. `https://dailydash-proxy-production.up.railway.app`

---

## 2. Vue-App für Production bauen

In deiner lokalen `.env` Datei eintragen:
```
VITE_API_BASE_URL=https://dailydash-proxy-production.up.railway.app
```

Dann bauen:
```bash
npm run build
```

Der `dist/` Ordner ist jetzt production-ready.

---

## 3. Auf Hostinger hochladen

1. Hostinger → **File Manager** (oder FTP mit FileZilla)
2. Navigiere zu `public_html/` (oder deinem Subdomain-Ordner)
3. Alle Dateien aus `dist/` hochladen

### .htaccess für Vue Router
Da Vue einen Single-Page-Router nutzt, braucht Hostinger diese Datei:

Erstelle `public_html/.htaccess`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

---

## 4. Demo-Version für Portfolio

Eigene `.env.demo` Datei anlegen:
```
VITE_DEMO_MODE=true
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_API_KEY=
VITE_TODOIST_TOKEN=
VITE_INTERVALS_API_KEY=
VITE_INTERVALS_ATHLETE_ID=
```

Build mit Demo-Modus:
```bash
cp .env.demo .env.local
npm run build
```

Diese Version kannst du öffentlich hosten — keine echten Daten, kein API-Key nötig.
