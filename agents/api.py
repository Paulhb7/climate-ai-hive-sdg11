from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from agents import run_climate_agents, run_recommendation_agent, run_sdg11_validation_agent
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app.add_middleware(NoCacheMiddleware)

@app.post("/climate-impact")
async def climate_impact(request: Request, response: Response):
    data = await request.json()
    city = data.get("city")
    if not city:
        return {"error": "city is required"}
    
    result = await run_climate_agents(city)
    # add_no_cache_headers(response)
    return {"result": result}

@app.post("/recommendations")
async def recommendations(request: Request, response: Response):
    data = await request.json()
    city = data.get("city")
    question = data.get("question")
    
    if not city:
        return {"error": "city is required"}
    
    if question:
        result = await run_sdg11_validation_agent(city, question)
    else:
        result = await run_recommendation_agent(city)
    
    # add_no_cache_headers(response)
    return {"result": result}

@app.post("/sdg11-validation")
async def sdg11_validation(request: Request, response: Response):
    data = await request.json()
    city = data.get("city")
    question = data.get("question")
    
    if not city:
        return {"error": "city is required"}
    if not question:
        return {"error": "question is required"}
    
    result = await run_sdg11_validation_agent(city, question)
    # add_no_cache_headers(response)
    return {"result": result}
