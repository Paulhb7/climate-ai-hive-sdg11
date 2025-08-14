# Hive.ai – AI Platform for Sustainable Urban Development  

Hive.ai is an **AI-powered urban climate resilience platform built on IBM WatsonX and IBM Cloud**, combining **UN Sustainable Development Goal (SDG) data**, **IPCC climate science**, and **specialized BeeAI agents**.  
In just minutes, it turns climate change and UN data into **city-specific action plans** with projections, recommendations, and SDG 11 compliance metrics — empowering cities to adapt faster and smarter.  

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

---

## 🛠️ Installation  

### Prerequisites  

- Python 3.8+  
- Node.js 18+ (for frontend)  
- IBM WatsonX account (optional, but recommended)  
- Groq account (optional)  

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
WATSONX_API_URL=https://us-south.ml.cloud.ibm.com
WATSONX_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
WATSONX_PROJECT_ID=your_project_id_here
```

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

- **Paul** – AI Agent Architect at Wavestone, co-founder of Inclusive Brains, working with IBM France on Quantum Machine Learning for neuroscience data, 
- **Tristan** – Agent Engineer & Data Scientist at Wavestone, designing and building Hive.ai’s specialized agent tools.  
- **Louise** – AI Engineer & Data Scientist at Wavestone, leading data processing and analysis while crafting intuitive, actionable user experiences.  
- **Mentor: Olivier Oullier** – Neuroscientist & co-founder of Inclusive Brains, guiding UX/UI design and strategy, leveraging experience at WEF and ITU AI for Good.  

---

## 📝 License  

MIT License. 
