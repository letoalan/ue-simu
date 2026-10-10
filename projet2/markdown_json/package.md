# package

Source : `package.json`

## Contenu

- **name** : projet2
- **private** : `true`
- **version** : 0.0.0
- **type** : module
- **scripts** :
  - **dev** : vite
  - **build** : tsc && vite build
  - **preview** : vite preview
  - **typecheck** : tsc --noEmit
  - **test** : vitest run
- **devDependencies** :
  - **@types/node** : ^26.6.4
  - **typescript** : ~6.0.2
  - **vite** : ^8.3.0
  - **vitest** : ^5.0.3
- **dependencies** :
  - **chart.js** : ^4.5.1
