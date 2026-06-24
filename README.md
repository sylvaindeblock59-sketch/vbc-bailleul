# VBC Bailleul — Application PWA 2026/27
## Préparation physique estivale — Sylvain Deblock

---

## Structure des fichiers

```
vbc-pwa/
├── index.html        ← Application principale
├── manifest.json     ← Déclaration PWA (nom, icônes, couleurs)
├── sw.js             ← Service Worker (cache offline + notifications)
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png  ← iOS (Apple Touch Icon)
    ├── icon-192.png  ← Android principal
    ├── icon-384.png
    └── icon-512.png  ← Splash screen Android
```

---

## Comment déployer (3 options)

### Option 1 — Netlify Drop (recommandé, gratuit, 2 minutes)
1. Aller sur https://app.netlify.com/drop
2. Glisser-déposer le dossier `vbc-pwa/` entier
3. L'URL générée (ex: `https://vbc-bailleul.netlify.app`) est immédiatement
   accessible et compatible PWA avec HTTPS automatique.

### Option 2 — GitHub Pages (gratuit)
1. Créer un dépôt GitHub (ex: `vbc-bailleul-prep`)
2. Uploader les fichiers du dossier `vbc-pwa/`
3. Activer GitHub Pages dans Settings → Pages → Branch: main
4. URL : `https://[username].github.io/vbc-bailleul-prep/`

### Option 3 — Vercel (si tu as déjà un compte)
1. `npm i -g vercel` puis `vercel` dans le dossier
2. Ou drag & drop sur https://vercel.com/new

---

## Installation sur smartphone

### iPhone (Safari uniquement)
1. Ouvrir l'URL dans **Safari** (pas Chrome sur iOS)
2. Appuyer sur **⎙ Partager** (bouton du bas)
3. Sélectionner **« Sur l'écran d'accueil »**
4. Confirmer → l'app apparaît comme une vraie appli

### Android (Chrome)
1. Ouvrir l'URL dans **Chrome**
2. La bannière d'installation apparaît automatiquement
3. Ou : menu ⋮ → **« Ajouter à l'écran d'accueil »**

---

## Fonctionnalités PWA incluses

- ✅ **Offline** : fonctionne sans connexion après premier chargement
- ✅ **Installable** : icône sur l'écran d'accueil iPhone & Android
- ✅ **Plein écran** : s'ouvre sans la barre du navigateur
- ✅ **Splash screen** : écran de chargement aux couleurs VBC
- ✅ **Indicateur hors ligne** : badge rouge si pas de connexion
- ✅ **Sauvegarde locale** : profil, 1RM et séances via localStorage
- ✅ **Minuteur de repos** : intégré dans la séance avec vibration
- ✅ **Notifications** : confirmation de séance validée
- ✅ **Cache intelligent** : Service Worker v1 avec stratégie Cache-First

---

## Note importante — HTTPS requis
Les PWA nécessitent HTTPS pour fonctionner. Netlify, GitHub Pages
et Vercel fournissent tous HTTPS automatiquement et gratuitement.
En local (file://), le Service Worker ne s'enregistre pas mais
l'application fonctionne normalement.

---

Préparation physique VBC Bailleul · Sylvain Deblock · Saison 2026/27
