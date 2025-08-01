# API Backend - Hive.ai

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :

```env
# API Keys (obligatoire)
GROQ_API_KEY=your_groq_api_key_here

# WatsonX (optionnel, si vous voulez utiliser WatsonX au lieu de Groq)
WATSONX_PROJECT_ID=your_watsonx_project_id_here
WATSONX_API_KEY=your_watsonx_api_key_here
WATSONX_API_URL=your_watsonx_api_url_here

# Modèles par défaut
DEFAULT_GROQ_MODEL=qwen/qwen3-32b
DEFAULT_WATSONX_MODEL=llama-3-3-70b-instruct
DEFAULT_PROVIDER=groq

# Modèle pour les projets UN (optionnel)
UN_PROJECTS_MODEL=
```

### 2. Installation des dépendances

```bash
cd backend
pip install -r requirements.txt
```

## Démarrage de l'API

### Méthode 1 : Script automatique (recommandé)

```bash
cd backend
python start_api.py
```

### Méthode 2 : Commande directe

```bash
cd backend
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints disponibles

Une fois l'API démarrée, elle sera accessible sur `http://localhost:8000`

### Documentation interactive
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

### Endpoints

1. **POST /climate-impact**
   - Analyse l'impact du changement climatique sur une ville
   - Body: `{"city": "Paris"}`

2. **POST /recommendations**
   - Génère des recommandations pour rendre une ville plus durable
   - Body: `{"city": "Paris"}` ou `{"city": "Paris", "question": "votre question"}`

3. **POST /un-projects**
   - Liste les projets UN liés au développement durable
   - Body: `{"city": "Paris"}`

4. **POST /sdg11-validation**
   - Valide si une proposition respecte les critères SDG11
   - Body: `{"city": "Paris", "question": "votre proposition"}`

## Exemple d'utilisation

```bash
# Test de l'API
curl -X POST "http://localhost:8000/climate-impact" \
     -H "Content-Type: application/json" \
     -d '{"city": "Paris"}'
```

## Dépannage

### Problème : "GROQ_API_KEY not found"
- Vérifiez que le fichier `.env` existe dans le dossier `backend`
- Vérifiez que `GROQ_API_KEY` est correctement configurée

### Problème : "Module not found"
- Vérifiez que toutes les dépendances sont installées : `pip install -r requirements.txt`

### Problème : Port déjà utilisé
- Changez le port dans la commande : `uvicorn api:app --port 8001`
- Ou arrêtez le processus qui utilise le port 8000 