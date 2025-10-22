# Guide de Publication sur npm

## Prérequis

1. **Compte npm** : Vous devez avoir un compte sur [npmjs.com](https://www.npmjs.com)
2. **Accès en ligne de commande** : Se connecter à npm via le terminal

## Étapes de Publication

### 1. Connexion à npm

```bash
npm login
```

Vous devrez entrer :
- **Username** : `grazulex`
- **Password** : Votre mot de passe npm
- **Email** : Votre email
- **OTP** (si activé) : Code d'authentification à deux facteurs

### 2. Vérifier que tout est prêt

```bash
# Vérifier que le build fonctionne
npm run build

# Vérifier le linting et les types
npm run check

# Tester le contenu du package (dry-run)
npm pack --dry-run
```

### 3. Publier sur npm

```bash
# Publication standard
npm publish

# OU pour la première publication publique
npm publish --access public
```

### 4. Vérifier la publication

Après quelques minutes, votre package sera visible sur :
- https://www.npmjs.com/package/backmark
- https://www.npmjs.com/settings/grazulex/packages

## Installation du package publié

Une fois publié, n'importe qui pourra installer votre package avec :

```bash
# Installation globale (recommandée pour un CLI)
npm install -g backmark

# Utilisation
backmark init "Mon Projet"
backmark task create "Ma tâche"
```

## Mettre à jour le package

### 1. Modifier la version

```bash
# Version patch (0.1.0 → 0.1.1)
npm version patch

# Version mineure (0.1.0 → 0.2.0)
npm version minor

# Version majeure (0.1.0 → 1.0.0)
npm version major
```

Cette commande :
- Met à jour `package.json`
- Crée un commit git
- Crée un tag git

### 2. Pousser sur GitHub

```bash
git push origin main
git push origin --tags
```

### 3. Republier sur npm

```bash
npm publish
```

## Structure des fichiers publiés

Grâce au fichier `.npmignore` et au champ `files` dans `package.json`, seuls ces fichiers sont inclus :

```
backmark-0.1.0.tgz
├── dist/           # Code compilé
├── templates/      # Templates (si existants)
├── README.md       # Documentation
├── LICENSE         # Licence
└── package.json    # Configuration
```

**Ne sont PAS inclus :**
- `src/` (code source TypeScript)
- `tests/` (fichiers de test)
- `node_modules/`
- `backlog/` (vos backlogs locaux)
- Fichiers de configuration de développement

## Commandes utiles

```bash
# Voir qui est connecté
npm whoami

# Se déconnecter
npm logout

# Voir les informations du package
npm view backmark

# Voir toutes les versions publiées
npm view backmark versions

# Dépublier une version (ATTENTION : irréversible)
npm unpublish backmark@0.1.0

# Déprécier une version (recommandé au lieu de unpublish)
npm deprecate backmark@0.1.0 "Please upgrade to 0.1.1"
```

## Script automatique

Pour simplifier la publication, vous pouvez créer un script :

```bash
#!/bin/bash
# publish.sh

echo "🚀 Publishing Backmark to npm"
echo ""

# Vérifications
echo "1️⃣ Running checks..."
npm run check || { echo "❌ Checks failed"; exit 1; }

echo ""
echo "2️⃣ Building..."
npm run build || { echo "❌ Build failed"; exit 1; }

echo ""
echo "3️⃣ Testing package content..."
npm pack --dry-run

echo ""
read -p "📦 Ready to publish? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "4️⃣ Publishing..."
    npm publish --access public

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully published!"
        echo "📍 https://www.npmjs.com/package/backmark"
    else
        echo "❌ Publication failed"
        exit 1
    fi
else
    echo "❌ Publication cancelled"
    exit 1
fi
```

Utilisation :

```bash
chmod +x publish.sh
./publish.sh
```

## Workflow recommandé

### Développement quotidien

```bash
# 1. Développer
npm run dev

# 2. Tester
npm run test

# 3. Build local
npm run build

# 4. Tester globalement
npm run install:global
backmark task list
```

### Avant publication

```bash
# 1. Mettre à jour la version
npm version patch

# 2. Mettre à jour le CHANGELOG
# ... éditer CHANGELOG.md ...

# 3. Commit & push
git push origin main --tags

# 4. Publier sur npm
npm publish
```

## Badges pour le README

Ajoutez ces badges dans votre `README.md` :

```markdown
[![npm version](https://badge.fury.io/js/backmark.svg)](https://www.npmjs.com/package/backmark)
[![npm downloads](https://img.shields.io/npm/dm/backmark.svg)](https://www.npmjs.com/package/backmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Troubleshooting

### "You do not have permission to publish"

```bash
# Vérifier que vous êtes connecté
npm whoami

# Se reconnecter
npm logout
npm login
```

### "Package name already exists"

Le nom `backmark` est peut-être déjà pris. Options :
1. Choisir un autre nom (ex: `@grazulex/backmark`)
2. Vérifier sur npmjs.com si le package existe

Pour utiliser un scope :

```json
{
  "name": "@grazulex/backmark",
  ...
}
```

Puis publier avec :

```bash
npm publish --access public
```

### "This package has been marked as private"

Vérifier que `package.json` ne contient pas :

```json
{
  "private": true  // ← Supprimer cette ligne
}
```

## Sécurité

### Activer l'authentification à deux facteurs

```bash
npm profile enable-2fa auth-and-writes
```

Cela protégera votre compte contre les publications non autorisées.

## Résumé rapide

```bash
# 1. Se connecter
npm login

# 2. Build & vérifications
npm run build
npm run check

# 3. Tester le package
npm pack --dry-run

# 4. Publier
npm publish --access public

# 5. Vérifier
npm view backmark
```

---

**Bon à savoir :**
- Une fois publié, vous ne pouvez pas dépublier après 72h (politique npm)
- Les versions publiées sont immuables (vous ne pouvez pas republier la même version)
- Utilisez le versioning sémantique (SemVer) : MAJOR.MINOR.PATCH

**Documentation officielle :** https://docs.npmjs.com/cli/v10/commands/npm-publish
