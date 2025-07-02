# 🚀 Déploiement Render - Equipment App

## Déploiement en 3 étapes

### 1. Préparer le repository
```bash
# Commiter tous les changements
git add .
git commit -m "🚀 Prepare for Render deployment"
git push origin main
```

### 2. Déployer sur Render

1. **Allez sur [Render.com](https://render.com)**
2. **Connectez-vous avec GitHub**
3. **Cliquez "New +" → "Blueprint"**
4. **Sélectionnez votre repository**
5. **Render détectera automatiquement `render.yaml`**
6. **Cliquez "Apply" pour déployer**

### 3. Configuration automatique

Le fichier `render.yaml` configure automatiquement :
- ✅ Backend NestJS avec GraphQL
- ✅ Frontend React avec Vite
- ✅ Base de données PostgreSQL
- ✅ Variables d'environnement
- ✅ Build et déploiement

## 🌐 URLs

- **Application** : `https://equipment-app.onrender.com`
- **API GraphQL** : `https://equipment-app.onrender.com/graphql`
- **Base de données** : Gérée automatiquement par Render

## 📋 Variables d'environnement

Configurées automatiquement :
- `NODE_ENV` = production
- `DATABASE_URL` = URL PostgreSQL automatique
- `PORT` = 10000

## 🔧 Dépannage

Si le déploiement échoue :
1. Vérifiez les logs dans le dashboard Render
2. Assurez-vous que tous les fichiers sont commités
3. Vérifiez que `render.yaml` est à la racine du projet

## ✨ Avantages Render

- **Gratuit** pour les projets personnels
- **Fullstack** : frontend + backend + base de données
- **Automatique** : déploiement à chaque push
- **SSL** : certificats HTTPS automatiques
- **Monitoring** : logs et métriques inclus 