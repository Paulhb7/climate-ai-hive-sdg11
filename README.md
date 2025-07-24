# Aipislazuli
IBM Hackathon

## CONCEPT DU PROJET 
**Nom du projet : SentinelT : IA agentique pour des villes plus intelligentes et plus sûres**

### Ce que cela fait :
Un réseau d'agents alimentés par watsonx évalue en continu les risques urbains liés au climat. Lorsque des menaces comme des inondations ou des vagues de chaleur sont prévues, il :

- Recommande des plans d'action personnalisés ou à l'échelle municipale.
- Teste ces plans à l'aide d'un module de simulation de jumeau numérique d'un quartier de la ville.
- Évalue et explique l'impact de chaque plan d'action.

**Utilisateurs :** Responsables municipaux, services d'urgence, urbanistes.

## 🚀 PLAN D'EXÉCUTION
*Date limite : 18/08*

### ✅ Phase 1 : Définir & cadrer 
*Date limite : 25/07*
*Objectif : Verrouiller le concept, définir les agents, préparer les jeux de données & choisir un cas d'usage ciblé*
- Finaliser un risque cible (ex : inondation) et une ville cible (ou ville fictive).
- Définir les agents et leurs rôles :
    - **Agent de données** : récupère les données climatiques + géographiques + population.
    - **Agent d'évaluation des risques** : utilise watsonx.ai pour l'analyse.
    - **Agent de plan d'action** : génère des réponses (ex : rediriger la circulation, fermer les vannes).
    - **Agent de simulation** : teste l'impact dans une simulation Unity/WebGL/Three.js.
- Définir des métriques d'évaluation claires (réduction de la propagation des inondations, moins de citoyens affectés).
- Identifier les sources de données : Open-Meteo, USGS, Copernicus, etc.

### ✅ Phase 2 : Développement principal
*Date limite : 06/08*
*Objectif : Construire le MVP fonctionnel avec les flux d'agents watsonx + simulation simple*
- Mettre en place watsonx.ai avec le framework d'agents : 
    - Agent de détection des risques : prévisions + données de localisation.
    - Agent de plan d'action : suggère des mesures d'atténuation selon le risque prédit.
    - Agent de simulation : moteur de scénario fictif avec visualisation de l'impact.
- Connexion aux API temps réel (Open-Meteo, USGS, etc.).
- Construire la logique d'orchestration des agents (LangChain, ou pipeline watsonx personnalisé).
- Construire un environnement de jumeau numérique fictif (zone limitée avec variables clés : zones inondables, densité de population).

### ✅ Phase 3 : Frontend + UX + Explicabilité
*Date limite : 12/08*
*Objectif : Rendre l'outil attrayant, intuitif et démontrer sa valeur réelle*
- Agents fonctionnant en séquence (risque → plan → simulation).
- Interface utilisateur : carte + interface de chat.
- Ajouter l'explicabilité : montrer comment l'IA a pris sa décision.
- Ajouter un retour visuel d'impact en temps réel depuis la simulation ("Zone A protégée", "20% de personnes en moins affectées").
- Visualisation de l'impact simulé.

### ✅ Semaine 4 : Finition & Pitch
*Date limite : 17/08*
*Objectif : Finaliser la soumission, tester les cas limites, rendre la présentation inoubliable*
- Finition finale :
    - Ajouter des états de chargement, messages de secours, gestion des erreurs.
    - Derniers ajustements des prompts et de l'orchestration des agents.
- Construire le script de présentation/démonstration en mettant l'accent sur l'impact ODD 11 de l'ONU et l'IA agentique.
- Tester auprès des juges ou pairs pour l'UX + clarté.
