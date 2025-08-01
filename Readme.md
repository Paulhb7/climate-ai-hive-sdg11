# Hive.ai - Plateforme d'IA pour le Développement Durable

Hive.ai est une plateforme qui utilise l'intelligence artificielle pour analyser l'impact du changement climatique sur les villes et fournir des recommandations pour un développement urbain durable, aligné avec les Objectifs de Développement Durable (ODD) de l'ONU.

## 🚀 Fonctionnalités

- **Analyse d'impact climatique** : Évaluation des conséquences du réchauffement climatique sur les villes
- **Recommandations durables** : Conseils concrets pour rendre les villes plus résilientes
- **Projets ONU** : Découverte d'initiatives des Nations Unies pertinentes
- **Validation SDG11** : Analyse de l'alignement avec l'ODD 11 (Villes et communautés durables)
- **Multi-providers** : Support pour Groq et WatsonX

## 🛠️ Installation

### Prérequis

- Python 3.8+
- Node.js 18+ (pour le frontend)
- Compte Groq (optionnel)
- Compte WatsonX (optionnel)

### Backend

1. Naviguez vers le dossier backend :
```bash
cd backend
```

2. Installez les dépendances Python :
```bash
pip install -r requirements.txt
```

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet :
```bash
# Copiez le fichier d'exemple
cp env.example .env

# Puis éditez le fichier .env avec vos vraies valeurs
```

4. Lancez le serveur backend :
```bash
uvicorn api:app --reload
```

### Frontend

1. Naviguez vers le dossier frontend :
```bash
cd the-hive
```

2. Installez les dépendances Node.js :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

## 🤖 Utilisation des Providers d'IA

### Configuration des modèles

Vous pouvez configurer les modèles par défaut dans votre fichier `.env` :

```bash
# Provider par défaut
DEFAULT_PROVIDER=groq  # ou watsonx

# Modèles par défaut pour chaque provider
DEFAULT_GROQ_MODEL=qwen/qwen3-32b
DEFAULT_WATSONX_MODEL=llama-3-3-70b-instruct

# Modèle spécifique pour l'agent des projets UN (optionnel)
UN_PROJECTS_MODEL=llama-3.1-8b-instant
```

### Groq

Groq est le provider par défaut. Il offre des performances rapides et une bonne qualité de réponse.

**Configuration requise :**
- `GROQ_API_KEY` dans le fichier `.env`

**Utilisation :**
```python
from agents import run_climate_agents

# Utilisation par défaut (selon DEFAULT_PROVIDER)
result = await run_climate_agents("Paris")

# Spécification explicite
result = await run_climate_agents("Paris", provider="groq")
```

### WatsonX

WatsonX d'IBM offre des modèles spécialisés et des capacités avancées d'IA.

**Configuration requise :**
- `WATSONX_PROJECT_ID` dans le fichier `.env`
- `WATSONX_API_KEY` dans le fichier `.env`
- `WATSONX_API_URL` (optionnel) dans le fichier `.env`

**Utilisation :**
```python
from agents import run_climate_agents

# Utilisation avec WatsonX
result = await run_climate_agents("Paris", provider="watsonx")
```

### API REST

L'API utilise automatiquement le provider configuré dans le fichier `.env` :

```bash
curl -X POST "http://localhost:8000/climate-impact" \
  -H "Content-Type: application/json" \
  -d '{"city": "Paris"}'
```

## 📡 Endpoints API

### POST /climate-impact
Analyse l'impact du changement climatique sur une ville.

**Paramètres :**
- `city` (requis) : Nom de la ville

### POST /recommendations
Fournit des recommandations pour rendre une ville plus durable.

**Paramètres :**
- `city` (requis) : Nom de la ville
- `question` (optionnel) : Question spécifique pour validation SDG11

### POST /un-projects
Liste les projets ONU pertinents pour une ville.

**Paramètres :**
- `city` (requis) : Nom de la ville

### POST /sdg11-validation
Valide si une proposition est alignée avec l'ODD 11.

**Paramètres :**
- `city` (requis) : Nom de la ville
- `question` (requis) : Proposition à valider

## 🧪 Tests

Pour tester les agents, vous pouvez utiliser directement les fonctions Python ou les endpoints API.

## 🔧 Configuration Avancée

### Modèles disponibles

**Groq :**
- `qwen/qwen3-32b` (par défaut)
- `llama-3.1-8b-instant`
- Autres modèles Groq disponibles

**WatsonX :**
- `llama-3-3-70b-instruct` (par défaut)
- `ibm/granite-3-8b-instruct`
- `meta-llama/llama-3-2-11b-vision-instruct` (pour les images)
- Autres modèles WatsonX disponibles

### Personnalisation des modèles

Vous pouvez spécifier un modèle particulier :

```python
from agents import get_model

# Modèle Groq spécifique
model = get_model("groq", "llama-3.1-8b-instant")

# Modèle WatsonX spécifique
model = get_model("watsonx", "ibm/granite-3-3-8b-instruct")

# Utilisation du modèle par défaut (selon DEFAULT_PROVIDER)
model = get_model()
```

### Variables d'environnement disponibles

| Variable | Description | Défaut |
|----------|-------------|---------|
| `DEFAULT_PROVIDER` | Provider par défaut (groq/watsonx) | groq |
| `DEFAULT_GROQ_MODEL` | Modèle Groq par défaut | qwen/qwen3-32b |
| `DEFAULT_WATSONX_MODEL` | Modèle WatsonX par défaut | llama-3-3-70b-instruct |
| `UN_PROJECTS_MODEL` | Modèle spécifique pour les projets UN | (utilise le modèle par défaut) |

## 🌍 Objectifs de Développement Durable (ODD)

Le projet est aligné avec l'ODD 11 "Villes et communautés durables" et utilise les indicateurs officiels de l'ONU pour évaluer les propositions et recommandations.

## 📝 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
