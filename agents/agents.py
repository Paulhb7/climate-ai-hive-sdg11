import os
import asyncio
from dotenv import load_dotenv
from beeai_framework.backend.chat import ChatModel
from beeai_framework.adapters.groq import GroqChatModel
from beeai_framework.tools.search.wikipedia import WikipediaTool
from beeai_framework.tools.weather.openmeteo import OpenMeteoTool
from beeai_framework.workflows.agent import AgentWorkflow, AgentWorkflowInput
from tools.onu_tools import UNSDGTool, UNSDGToolInput
from tools.climate_tool import ClimateChangeTool
from utils.constants import COUNTRY_CODES, LOCATION_CODES, SDG11_TARGETS_INDICATORS, CLIMATE_MODELS

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

url = os.getenv("WATSONX_API_URL")
api_key = os.getenv("WATSONX_API_KEY")
project_id = ("WATSONX_PROJECT_ID")

os.environ["WATSONX_PROJECT_ID"] =project_id
os.environ["WATSONX_API_KEY"] = api_key
os.environ["WATSONX_API_URL"] = url

llama_model = ChatModel.from_name("watsonx:meta-llama/llama-3-3-70b-instruct")
granite = ChatModel.from_name("watsonx:ibm/granite-3-8b-instruct")

async def run_climate_agents(city: str, provider: str = None) -> str:

    workflow = AgentWorkflow(name="Climate change analysis")

    workflow.add_agent(
        name="ClimateAnalyst",
        role="An expert in climate change impact analysis.",
            instructions=f"""
            You are ClimateImpactAnalyst, an AI climatologist 
            charged with distilling multi-model projections into clear, location-specific insights. 
            Leverage the ClimateChangeTool to aggregate metrics from 1950, 2025, 2050, 
            weigh each model’s strengths and weaknesses, and return a concise comparative table for decision-makers.

            Retrieve data
            Call ClimateChangeTool to get the indicators for each year for {city}

            Model–metric evaluation

            For EACH AND ALL metric–year pair (7 metrics per year):
            ─ Match model strengths / weaknesses to (a) the metric’s physical basis,
            (b) the geographic features of LOCATION (coast, elevation, latitude, etc.).
            ─ Score suitability on accuracy, temporal resolution, regional bias, and peer-review pedigree.
            ─ If several models tie, either
            • choose the single most appropriate by qualitative edge or
            • create a weighted ensemble (explain the weights in ≤ 15 words).
            Output one value per metric-year pair

            Model Datas : {CLIMATE_MODELS}

            Uncertainty & bias handling
            ─ Apply bias-correction only if explicitly justified by documented weaknesses.
            ─ Propagate uncertainty; report min–max range when available.

            Output – return a comprehensive analysis of the climate change impact on the location in a
            well-formatted markdown format.

            Formatting rules:
            • Numeric values → 2-decimal precision.
            • Maintain original metric units.
            • Keep “Rationale” succinct yet specific (name the decisive strength/weakness).
            • If an ensemble is used, write “Ensemble(n)” where n = number of contributing models.
            

            Terminate with the table—no summary, no concluding sentence.""",
            tools=[ClimateChangeTool()],
        llm=llama_model
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"What is the climate change impact on {city} ? "
                    
                ),
                expected_output=(
                    f"""return a comprehensive analysis of the climate change impact on the location in a
                        well-formatted markdown format.
                    """
                )
            ),
        ]
    )
    return response.result.final_answer

async def run_recommendation_agent(city: str) -> str:
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
        llm=llama_model,  
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
                    in the face of climate change. All recommendations must be extensive, full of details, as city-specific as possible, and grounded in realistic elements. 
                    in a well-formatted markdown format."""
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
        llm=granite_model,
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
                    f"including target alignment, indicator relevance, and specific recommendations. "
                    f"in a well-formatted markdown format."
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
