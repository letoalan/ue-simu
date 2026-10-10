# Guide de Déploiement — GitHub Pages

Ce guide détaille la procédure de construction et de publication statique de `projet2/` sur GitHub Pages.

---

## 1. Prérequis & Commandes de Développement

Toutes les commandes s'exécutent depuis le dossier `projet2/` :

```bash
# Se placer dans le dossier
cd projet2

# Installation des dépendances
npm install

# Lancement du serveur de développement local (avec rechargement à chaud)
npm run dev

# Vérification stricte des types TypeScript
npm run typecheck

# Exécution des tests unitaires automatisés
npm test

# Compilation du livrable de production
npm run build

# Prévisualisation locale du livrable compilé
npm run preview
```

---

## 2. Compatibilité GitHub Pages

Le fichier `vite.config.ts` configure explicitement le chemin de base relatif :
```typescript
export default defineConfig({
  base: './', // Assure que les ressources HTML, JS et CSS fonctionnent quel que soit le sous-dossier
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  }
});
```

Le livrable résultant dans `projet2/dist/` est entièrement autonome et composé de ressources purement statiques (HTML, CSS, JS, SVG, JSON).

---

## 3. Publication sur GitHub Pages

### Option A : Déploiement direct via GitHub Actions (Recommandé)
Un workflow standard GitHub Actions `.github/workflows/deploy.yml` peut automatiser la publication :
1. Checkout du dépôt.
2. Installation et exécution de `npm run build` dans `projet2/`.
3. Déploiement du dossier `projet2/dist/` sur l'environnement GitHub Pages.

### Option B : Déploiement manuel via branche `gh-pages`
Le contenu du dossier `projet2/dist/` peut être poussé sur la branche `gh-pages` du dépôt GitHub.
