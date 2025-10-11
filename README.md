# Climate AI Hive – Goal 11 AI Agent Platform for Sustainable Urban Development

**Climate AI Hive** is an **AI-powered urban climate resilience platform** built on **IBM WatsonX** and **IBM Cloud**, using **IBM’s 🐝 Bee AI agentic framework**.  
It combines **UN Sustainable Development Goal 11 (Sustainable Cities & Communities)** data, **IPCC climate science**, and specialized BeeAI agents, powered by **IBM Granite 3.3**.

In just minutes, it turns climate change and UN data into **city-specific action plans** with projections, recommendations, and SDG 11 compliance metrics — empowering cities to adapt faster and smarter.

A project made for IBM TechXchange 2025 Pre-conference watsonx Hackathon

---

## 🌍 Problem Statement  

Cities face an urgent need to **adapt to climate change** with limited resources.  
Today:  
- Climate data is fragmented and hard to use.  
- Assessments (e.g., flood risk) take months to complete.  
- Projections (e.g., heatwaves) are disconnected from urban planning.  
- Thousands of proven climate solutions exist but remain invisible to most cities.  
- International funding opportunities are missed due to lack of proper SDG alignment documentation.  

**The result**: cities react to disasters instead of preventing them. Resources are misallocated, proven solutions stay undiscovered, and funding is lost.  

---

## 💡 Solution  

**Hive.ai – UN & IPCC Expertise in Your Pocket with BeeAI Agents on IBM WatsonX** 🐝  

Three specialized AI agents collaborate to produce an integrated climate resilience report:  
- **BeeAI ClimateAnalyst** – Analyzes historical and projected climate data (temperature, precipitation, air quality, flood risk), factoring in model uncertainties and biases.  
- **BeeAI UrbanAdvisor** – Retrieves official UN SDG data via the SDG API, maps infrastructure vulnerabilities and demographics, and generates locally tailored recommendations in mobility, green spaces, energy, waste, and citizen engagement.  
- **BeeAI SDG11Validator** – Evaluates proposals against UN SDG 11 targets, assigns alignment scores, and suggests improvements to maximize compliance and funding eligibility.  

**Hive.ai delivers**:  
- Hyperlocal climate impact projections  
- Prioritized action lists with budgets and timelines  
- Global case studies adapted to local contexts  
- SDG 11 compliance metrics and funding guidance  

---

## 🚀 Key Features  

- **Climate Impact Analysis** – Projections, trends, and vulnerability maps  
- **Sustainable Recommendations** – Context-specific, actionable strategies  
- **UN Project Discovery** – Relevant initiatives and funding sources  
- **SDG 11 Validation** – Measured and improvable alignment scores  
- **Multi-provider AI** – IBM WatsonX and Groq support  

## 🎥 Climate AI Hive Demo

Watch a quick demonstration showing how Hive.ai generates local climate action plans in minutes — including projections, tailored recommendations, and SDG 11 alignment metrics:

[![Watch the Hive.ai demo](https://img.youtube.com/vi/rgS0BWS4bNc/0.jpg)](https://www.youtube.com/watch?v=rgS0BWS4bNc)

---

## 🛠️ Installation  

### Prerequisites  

- Python 3.8+  
- Node.js 18+ (for frontend)  
- IBM WatsonX account (optional, but recommended)  

### Backend  

```bash
cd backend
pip install -r requirements.txt
cp env.example .env  # Copy and edit with your values
uvicorn api:app --reload
```

### Frontend  

```bash
cd the-hive
npm install
npm run dev
```

---

## 🤖 AI Provider Usage  

You can configure the default provider and models in your `.env` file:  

```bash
# === Watsonx (IBM) ===
WATSONX_API_URL=https://eu-de.ml.cloud.ibm.com
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id

# === OpenAI (optional) ===
OPENAI_API_KEY=your_openai_api_key

# === Default Model ===
MODEL_NAME=watsonx:ibm/granite-4-h-small
```
💡 You can change MODEL_NAME to another model supported by BeeAI, such as: watsonx:ibm/granite-3-3-8b-instruct or openai:gpt-4.1-mini, depending on your needs.
---

## 📡 API Endpoints  

### POST `/climate-impact`  
Analyze climate change impact on a city.  

### POST `/recommendations`  
Get sustainability recommendations for a city.  

### POST `/un-projects`  
List relevant UN projects for a city.  

### POST `/sdg11-validation`  
Validate a proposal’s alignment with SDG 11. 

---

## 🌟 Specific Use Case  

A resilience officer in Phoenix enters their city into Hive.ai. Within 5 minutes, they receive:  
- Heat island vulnerability maps with demographic overlays  
- Prioritized interventions (urban forests, cooling centers, reflective surfaces)  
- Medellín green corridor success case study  
- Budget estimates and financing options  
- SDG 11 alignment scores  
- Implementation timeline with measurable indicators  

---

## 🧠 Team  

We are a multidisciplinary team combining expertise in **AI agent architecture**, **data science**, and **UX design**:  

- **Paul** – co-founder of Inclusive Brains and AI Agent Architect at Wavestone, working with IBM France on Quantum Machine Learning for neuroscience data, 
- **Tristan** – Agent Engineer & Data Scientist at Wavestone, designing and building Hive.ai’s specialized agent tools.  
- **Louise** – AI Engineer & Data Scientist at Wavestone, leading data processing and analysis while crafting intuitive, actionable user experiences.  
- **Mentor: Olivier Oullier** – Neuroscientist & co-founder of Inclusive Brains, guiding UX/UI design and AI strategy.  

---

## 📝 License  

MIT License. 
