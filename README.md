# 🧩 DailyDash

**DailyDash** ist ein persönliches, modulares Dashboard-Projekt zur Erweiterung meiner JavaScript-Kenntnisse. Ziel ist es, eine visuell ansprechende Startseite für den Browser zu bauen, die Informationen wie To-Dos, Kalendertermine, Wetter und Trainingsdaten kombiniert.

---

## 🎯 Ziele

- Vertiefung in **Vanilla JavaScript**
- Erste Schritte mit **Vue.js**, **TypeScript**, **Tailwind CSS**
- Nutzung von **API-Schnittstellen** (Google Calendar, Garmin, Strava)
- Aufbau einer **modularen Oberfläche** mit Drag-&-Drop-fähigen Widgets
- Anwendung von Tools wie **Webpack**, **SCSS** und **Figma**

---

## 📦 Features (MVP)

- [ ] Ansprechendes Grundlayout (Darkmode-first)
- [ ] ToDo-Modul mit Firebase-Anbindung
- [ ] Responsive Design
- [ ] Lokale Entwicklung mit Webpack
- [ ] Eigene Tailwind-Design-Variablen

---

## 🧱 Tech Stack

- HTML5 / SCSS / Tailwind CSS
- JavaScript (Vanilla, später Vue.js)
- Webpack
- Firebase (für Auth und Datenbank)
- APIs: Google Calendar, Strava, Garmin (OAuth2)
- Figma für Design

---

## 📁 Projektstruktur (geplant)

```bash
dailyDash/
│
├── public/                 # Statische Dateien
├── src/
│   ├── assets/             # Bilder, Icons
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   ├── modules/            # Einzelne Module (ToDo, Kalender, Wetter etc.)
│   ├── styles/             # SCSS / Tailwind Config
│   └── main.js             # Einstiegspunkt
├── .gitignore
├── README.md
└── package.json

## 🎨 Design in Figma
Das aktuelle UI-Design ist in Figma gepflegt:
➡️ [dailyDash UI – Figma Design](https://www.figma.com/design/z3IYgrrTmMn8HqJRoQttGX/DailyDash?m=auto&t=blzF6xde9QlzhyNv-6)