import asyncio
from beeai_framework.backend.chat import ChatModel
from beeai_framework.adapters.groq import GroqChatModel
from beeai_framework.tools.search.wikipedia import WikipediaTool
from beeai_framework.tools.weather.openmeteo import OpenMeteoTool
from beeai_framework.workflows.agent import AgentWorkflow, AgentWorkflowInput
import os

GROQ_API_KEY = "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"

os.environ["GROQ_API_KEY"] = "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"

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


SDG11_TARGETS_INDICATORS = """
Goal 11: Make cities and human settlements inclusive, safe, resilient and sustainable

Target 11.1: By 2030, ensure access for all to adequate, safe and affordable housing and basic services and upgrade slums.
    - Indicator 11.1.1: Proportion of urban population living in slums, informal settlements or inadequate housing.

Target 11.2: By 2030, provide access to safe, affordable, accessible and sustainable transport systems for all, improving road safety, notably by expanding public transport, with special attention to the needs of those in vulnerable situations, women, children, persons with disabilities and older persons.
    - Indicator 11.2.1: Proportion of population that has convenient access to public transport, by sex, age and persons with disabilities.

Target 11.3: By 2030, enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning and management in all countries.
    - Indicator 11.3.1: Ratio of land consumption rate to population growth rate.
    - Indicator 11.3.2: Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically.

Target 11.4: Strengthen efforts to protect and safeguard the world’s cultural and natural heritage.
    - Indicator 11.4.1: Total per capita expenditure on the preservation, protection and conservation of all cultural and natural heritage, by source of funding, type of heritage and level of government.

Target 11.5: By 2030, significantly reduce the number of deaths and the number of people affected and substantially decrease the direct economic losses relative to global GDP caused by disasters, including water-related disasters, with a focus on protecting the poor and people in vulnerable situations.
    - Indicator 11.5.1: Number of deaths, missing persons and directly affected persons attributed to disasters per 100,000 population.
    - Indicator 11.5.2: Direct economic loss in relation to global GDP, damage to critical infrastructure and number of disruptions to basic services, attributed to disasters.

Target 11.6: By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management.
    - Indicator 11.6.1: Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated, by cities.
    - Indicator 11.6.2: Annual mean levels of fine particulate matter (e.g., PM2.5 and PM10) in cities (population weighted).

Target 11.7: By 2030, provide universal access to safe, inclusive and accessible, green and public spaces, in particular for women and children, older persons and persons with disabilities.
    - Indicator 11.7.1: Average share of the built-up area of cities that is open space for public use for all, by sex, age and persons with disabilities.
    - Indicator 11.7.2: Proportion of persons victim of physical or sexual harassment, by sex, age, disability status and place of occurrence, in the previous 12 months.

Target 11.a: Support positive economic, social and environmental links between urban, peri-urban and rural areas by strengthening national and regional development planning.
    - Indicator 11.a.1: Number of countries that have national urban policies or regional development plans that respond to population dynamics, ensure balanced territorial development, and increase local fiscal space.

Target 11.b: By 2020, substantially increase the number of cities and human settlements adopting and implementing integrated policies and plans towards inclusion, resource efficiency, mitigation and adaptation to climate change, resilience to disasters, and develop and implement, in line with the Sendai Framework for Disaster Risk Reduction 2015–2030, holistic disaster risk management at all levels.
    - Indicator 11.b.1: Number of countries that adopt and implement national disaster risk reduction strategies in line with the Sendai Framework.
    - Indicator 11.b.2: Proportion of local governments that adopt and implement local disaster risk reduction strategies in line with national disaster risk reduction strategies.

Target 11.c: Support least developed countries, including through financial and technical assistance, in building sustainable and resilient buildings utilizing local materials.
    - Indicator 11.c.1: Proportion of financial support to the least developed countries that is allocated to the construction and retrofitting of sustainable, resilient and resource-efficient buildings utilizing local materials.
"""


async def run_recommendation_agent(city: str) -> str:
    llm = ChatModel.from_name("groq:qwen/qwen3-32b")
    workflow = AgentWorkflow(name="Recommendation assistant")

    workflow.add_agent(
        name="UrbanAdvisor",
        role="An expert in sustainable urban development.",
        instructions=(
            "You provide actionable recommendations to make the city more sustainable and resilient to climate change. "
            "Your advice should be concrete, adapted to the city's context, and cover topics like mobility, waste management, "
            "green spaces, energy, and citizen engagement. "
            "When formulating recommendations, make sure they are aligned with the following UN Sustainable Development Goal 11 "
            "targets and indicators:\n\n"
            f"{SDG11_TARGETS_INDICATORS}"
        ),
        llm=llm,  # corrected: use the local 'llm' object, not 'llama_model'
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"What are the best recommendations to make {city} more sustainable and resilient to climate change? "
                    "Give concrete, actionable advice for the city, covering mobility, waste, green spaces, energy, and citizen engagement."
                ),
                expected_output=(
                    f"A list of recommendations for {city} to become a more sustainable city in the face of climate change."
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