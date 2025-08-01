from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import os
from agents import run_climate_agents, run_un_projects_agent, run_recommendation_agent, run_sdg11_validation_agent

app = FastAPI()

# Autoriser le front Next.js à accéder à l'API (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/climate-impact")
async def climate_impact(request: Request):
    data = await request.json()
    city = data.get("city")
    provider = data.get("provider")  # None par défaut, utilise la valeur du .env
    
    if not city:
        return {"error": "city is required"}
    
    # Appel de la fonction asynchrone run_agents avec le provider spécifié
    result = await run_climate_agents(city, provider)
    return {"result": result}

@app.post("/recommendations")
async def recommendations(request: Request):
    data = await request.json()
    city = data.get("city")
    question = data.get("question")
    provider = data.get("provider")  # None par défaut, utilise la valeur du .env
    
    if not city:
        return {"error": "city is required"}
    
    # Si une question est fournie, utiliser l'agent de validation SDG11
    if question:
        result = await run_sdg11_validation_agent(city, question, provider)
    else:
        # Sinon, utiliser l'agent de recommandations standard
        result = await run_recommendation_agent(city, provider)
    
    return {"result": result}

@app.post("/un-projects")
async def un_projects(request: Request):
    data = await request.json()
    city = data.get("city")
    provider = data.get("provider")  # None par défaut, utilise la valeur du .env
    
    if not city:
        return {"error": "city is required"}
    
    result = await run_un_projects_agent(city, provider)
    return {"result": result}

@app.post("/sdg11-validation")
async def sdg11_validation(request: Request):
    data = await request.json()
    city = data.get("city")
    question = data.get("question")
    provider = data.get("provider")  # None par défaut, utilise la valeur du .env
    
    if not city:
        return {"error": "city is required"}
    if not question:
        return {"error": "question is required"}
    
    result = await run_sdg11_validation_agent(city, question, provider)
    return {"result": result} 