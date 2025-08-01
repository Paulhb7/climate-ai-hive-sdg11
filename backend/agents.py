import os
import asyncio
from dotenv import load_dotenv
from beeai_framework.backend.chat import ChatModel
from beeai_framework.adapters.groq import GroqChatModel
from beeai_framework.tools.search.wikipedia import WikipediaTool
from beeai_framework.tools.weather.openmeteo import OpenMeteoTool
from beeai_framework.workflows.agent import AgentWorkflow, AgentWorkflowInput
from tools.onu_tools import UNSDGTool, UNSDGToolInput
from utils.constants import COUNTRY_CODES, LOCATION_CODES, SDG11_TARGETS_INDICATORS

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Récupérer la clé API depuis les variables d'environnement
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables. Please check your .env file.")

llama_model = ChatModel.from_name("groq:qwen/qwen3-32b")
granite = ChatModel.from_name("groq:qwen/qwen3-32b")

async def run_climate_agents(city: str) -> str:

    workflow = AgentWorkflow(name="Smart assistant")

    workflow.add_agent(
        name="Researcher",
        role="A diligent researcher.",
        instructions="You look up and provide information about the impact of climate change on a specific city.",
        tools=[WikipediaTool()],
        llm=llama_model,
    )

    workflow.add_agent(
        name="WeatherForecaster",
        role="A weather reporter.",
        instructions="You provide detailed weather reports and highlight any climate change trends or anomalies for the city.",
        tools=[OpenMeteoTool()],
        llm=llama_model,
    )

    workflow.add_agent(
        name="DataSynthesizer",
        role="A meticulous and creative data synthesizer",
        instructions="You combine research and weather data to summarize the impact of climate change on the selected city.",
        llm=llama_model,
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=f"Quelles sont les conséquences du réchauffement climatique à {city} ? Donne des faits et exemples concrets.",
            ),
            AgentWorkflowInput(
                prompt=f"Décris les tendances météorologiques récentes à {city} qui pourraient être liées au changement climatique. Mentionne les températures, précipitations, événements extrêmes, etc.",
                expected_output="Détails météorologiques pertinents et tout lien possible avec le changement climatique.",
            ),
            AgentWorkflowInput(
                prompt=f"Rédige une synthèse claire et concise de l'impact du réchauffement climatique à {city}, en t'appuyant sur les informations précédentes.",
                expected_output=f"Un paragraphe expliquant l'impact du réchauffement climatique à {city}, avec des exemples précis et des données météorologiques récentes.",
            ),
        ]
    )
    return response.result.final_answer

async def run_recommendation_agent(city: str) -> str:
    llm = ChatModel.from_name("groq:qwen/qwen3-32b")
    workflow = AgentWorkflow(name="Recommendation assistant")

    workflow.add_agent(
        name="UrbanAdvisor",
        role="An expert in sustainable urban development.",
        instructions=(f"""
            "You provide actionable recommendations to make the city more sustainable and resilient to climate change. "
            "Your advice should be concrete, adapted to the city's context, and cover topics like mobility, waste management, "
            "green spaces, energy, and citizen engagement. "
            "When formulating recommendations, make sure they are aligned with the following UN Sustainable Development Goal 11 "
            "targets and indicators:\n\n"
            f"{SDG11_TARGETS_INDICATORS}
            To get the value of the UNO indicator for this city, use your tool and fetch the values for the associated country, here is the list of country codes to use for the API:
            {COUNTRY_CODES}.
            You'll get multiple values for a single indicator, here is the list of code to better undertand where each value comes from : 
            {LOCATION_CODES}
            """),
            tools=[UNSDGTool()],
        llm=llama_model,  # corrected: use the local 'llm' object, not 'llama_model'
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"What are the best recommendations to make {city} more sustainable and resilient to climate change? "
                    "Give concrete, actionable advice for the city, covering mobility, waste, green spaces, energy, and citizen engagement."
                ),
                expected_output=(
                    f"""An extensive list of recommendations for {city} to become a more sustainable city according to it's state (refer to UNO SG11 state for the City) 
                    in the face of climate change. All recommendations must be extensive, full of details, as city-specific as possible, and grounded in realistic elements"""
                )
            ),
        ]
    )
    return response.result.final_answer

async def run_un_projects_agent(city: str) -> str:
    llm = ChatModel.from_name("groq:llama-3.1-8b-instant")
    workflow = AgentWorkflow(name="UN Projects recommender")

    workflow.add_agent(
        name="UNProjectExpert",
        role="An expert in United Nations sustainable development projects.",
        instructions="You highlight and describe real United Nations projects already developed on climate change and sustainable cities, that are relevant or similar to the user's city or context. Give concrete examples, project names, and a short description for each.",
        tools=[WikipediaTool()],
        llm=llm,
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"List and describe up to 3-5 real United Nations projects or initiatives related to climate change and sustainable cities that could inspire or benefit {city}. "
                    f"If you don't find a project for this city, list global or regional UN projects relevant to sustainable cities and climate change. "
                    f"For each project, give the name, a short description, and why it is relevant. "
                    f"Examples include: UN-Habitat's Urban Resilience Programme, C40 Cities, Making Cities Resilient Campaign, etc."
                ),
                expected_output=(
                    f"A list (max 5) of real UN projects with names, descriptions, and relevance for {city} or similar cities."
                )
            ),
        ]
    )
    return response.result.final_answer

async def run_sdg11_validation_agent(city: str, user_question: str) -> str:
    """
    Agent qui analyse si une proposition ou question utilisateur rentre dans les critères SDG11
    """
    llm = ChatModel.from_name("groq:qwen/qwen3-32b")
    workflow = AgentWorkflow(name="SDG11 Validation Expert")

    workflow.add_agent(
        name="SDG11Validator",
        role="An expert in UN Sustainable Development Goal 11 validation and analysis.",
        instructions=(
            "You are an expert in analyzing whether proposals, projects, or initiatives align with UN Sustainable Development Goal 11 "
            "targets and indicators. You provide detailed analysis and recommendations based on the SDG11 framework. "
            "Always reference specific targets and indicators when making your assessment.\n\n"
            f"SDG11 Targets and Indicators:\n{SDG11_TARGETS_INDICATORS}\n\n"
            "Your analysis should include:\n"
            "1. Which specific SDG11 targets the proposal aligns with\n"
            "2. Which indicators would be relevant to measure progress\n"
            "3. How well the proposal fits the SDG11 criteria\n"
            "4. Suggestions for improvement or additional considerations\n"
            "5. A clear YES/NO assessment with explanation"
        ),
        llm=llm,
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"Analyze whether the following proposal/question for {city} aligns with UN Sustainable Development Goal 11 targets and indicators:\n\n"
                    f"USER QUESTION/PROPOSAL: {user_question}\n\n"
                    f"Please provide a comprehensive analysis including:\n"
                    f"- Which SDG11 targets this proposal aligns with (if any)\n"
                    f"- Which specific indicators would be relevant\n"
                    f"- How well it fits the SDG11 criteria (scale 1-10)\n"
                    f"- Specific recommendations for improvement\n"
                    f"- Clear YES/NO assessment with detailed explanation\n"
                    f"- Additional considerations for {city}'s context"
                ),
                expected_output=(
                    f"A detailed SDG11 validation analysis for the user's proposal/question regarding {city}, "
                    f"including target alignment, indicator relevance, and specific recommendations."
                )
            ),
        ]
    )
    return response.result.final_answer

async def main():
    result = await run_recommendation_agent("Paris")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())