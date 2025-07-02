# 🚀 Déploiement Render - Equipment App

## Déploiement en 3 étapes

### 1. Préparer le repository
```bash
# Commiter tous les changements
git add .
git commit -m "🚀 Prepare for Render deployment"
git push origin feature/deployment
```

### 2. Déployer sur Render

1. **Allez sur [Render.com](https://render.com)**
2. **Connectez-vous avec GitHub**
3. **Cliquez "New +" → "Blueprint"**
4. **Sélectionnez votre repository et la branche `feature/deployment`**
5. **Render détectera automatiquement `render.yaml`**
6. **Cliquez "Apply" pour déployer**

### 3. Configuration automatique

Le fichier `render.yaml` configure automatiquement :
- ✅ **Backend NestJS** avec GraphQL (`equipment-backend`)
- ✅ **Frontend React** avec Vite (`equipment-frontend`)
- ✅ **Base de données PostgreSQL** (`equipment-db`)
- ✅ **Variables d'environnement** configurées automatiquement
- ✅ **Build et déploiement** automatiques

## 🌐 URLs

- **Frontend** : `https://equipment-frontend.onrender.com`
- **Backend API** : `https://equipment-backend.onrender.com`
- **GraphQL** : `https://equipment-backend.onrender.com/graphql`
- **Base de données** : Gérée automatiquement par Render

## 📋 Variables d'environnement

Configurées automatiquement :
- `NODE_ENV` = production
- `DATABASE_URL` = URL PostgreSQL automatique
- `PORT` = 10000
- `VITE_API_URL` = https://equipment-backend.onrender.com

## 🔧 Dépannage

Si le déploiement échoue :
1. Vérifiez les logs dans le dashboard Render
2. Assurez-vous que tous les fichiers sont commités
3. Vérifiez que `render.yaml` est à la racine du projet
4. Vérifiez que les deux services (backend + frontend) sont déployés

## ✨ Avantages Render

- **Gratuit** pour les projets personnels
- **Fullstack** : frontend + backend + base de données
- **Automatique** : déploiement à chaque push
- **SSL** : certificats HTTPS automatiques
- **Monitoring** : logs et métriques inclus
- **Services séparés** : plus de flexibilité et de scalabilité 