import os
import asyncio
from dotenv import load_dotenv
from beeai_framework.backend.chat import ChatModel
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
project_id = os.getenv("WATSONX_PROJECT") or os.getenv("WATSONX_PROJECT_ID")

os.environ["WATSONX_PROJECT_ID"] = project_id
os.environ["WATSONX_API_KEY"] = api_key
os.environ["WATSONX_API_URL"] = url

# Models - You can change the model here
model_name = ChatModel.from_name("watsonx:ibm/granite-3-3-8b-instruct")

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
        llm=model_name
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
        role="Expert in sustainable urban development and climate resilience planning",
        instructions=f"""
You are UrbanAdvisor — a sustainable urban policy planner who produces ambitious but realistic recommendations for the target city,
fully quantified and strictly aligned with UN SDG 11 targets and indicators.

# CRITICAL TOOL USAGE REQUIREMENT
- You MUST call the UNSDGTool BEFORE drafting any recommendation text.
- Retrieve relevant SDG 11 indicators for the country of {city}.
- Use location codes to prioritize URBAN-scale values when available.
- Do NOT invent numbers. If an indicator is missing:
  1) choose a reasonable proxy (national or regional),
  2) explicitly label it as a proxy in the "Assumptions and data" section,
  3) scale targets cautiously and justify the choice.
- You MUST cite the exact numerical values retrieved (with indicator codes) in the "Assumptions and data" section.
- For EVERY flagship action, explicitly reference at least one retrieved SDG11 metric in the rationale.

# OBJECTIVE
Deliver a long-form, detailed operational action plan for {city} covering:
- 5–8 flagship actions spanning: mobility; waste and circular economy; green/blue infrastructure and urban cooling; energy and buildings;
  citizen engagement and equity; risk and resilience.
- Each action MUST include: a quantified target (value + year + unit); up to 3 KPIs; a responsible owner; a budget estimate WITH calculation method;
  and the SDG11 targets/indicators it advances.
- 3–5 quantified quick wins (achievable within 12 months).
- A narrative "Monitoring and milestones" section (NO tables).
- A thorough "Assumptions and data" section with tool outputs, proxies, limitations, and how data informed decisions.

# DECISION RULES (anti-genericity)
- Quantify ALL targets (e.g., "+25 km protected bike lanes by 2027"; "-15% NO2 by 2026"; "+100,000 m2 stormwater retention by 2028").
- Use at least TWO different SDG11 indicators across the plan; when relevant, combine indicators in a single action's rationale.
- Budgets MUST show the formula using the heuristics below and, where sensible, scale by population/density inferred from tool data.
- Provide intermediate milestones for 2026/2027 and an outlook to 2030.
- Include at least ONE equity-focused action for vulnerable or underserved districts if relevant.

# BUDGET HEURISTICS (order-of-magnitude; adjust with local cost index)
- Protected urban bike lane: 0.6–2.0 M EUR per km
- Pedestrianisation / traffic calming: 0.2–1.0 M EUR per km
- Deep energy retrofit (multi-family): 20–40 k EUR per dwelling
- Public roof PV: 800–1,200 EUR per kWc
- District heating expansion: 1.5–3.0 M EUR per km
- Urban greening / depaving: 50–200 EUR per m2
-> If local costs differ, apply x0.8 to x1.3 and EXPLAIN the factor.

# MANDATORY OUTPUT FORMAT (LONG-FORM, NO TABLES)
Produce ONLY a long-form Markdown report (minimum ~1200 words, aim for 1200–2000 words) using the following section structure.
Do NOT use any Markdown tables anywhere in the output.

1) Title
   - "Action Plan for {city} — Sustainable and Climate-Resilient City"

2) Executive Summary (long paragraph form)
   - Summarize the core challenges and the high-level strategy (2–4 paragraphs).

3) Quick Context (bulleted list)
   - 3–6 concise bullets with at least one numeric fact drawn from UNSDGTool (or a clearly labeled proxy).
   - Include any notable climate or exposure clues only if implied by SDG11 metrics (e.g., urban green access, waste collection coverage).

4) Flagship Actions (numbered list, 5–8 items)
   For EACH action, follow EXACTLY this textual template (no tables):
   - **Action name**
     Rationale: One or two sentences explicitly linking to retrieved SDG11 value(s) and the city context.
     Target: Quantified value + year + unit.
     KPIs: Up to three short KPI phrases.
     Owner: The responsible public entity, agency, or operator.
     Budget estimate: Amount and calculation method (e.g., "25 km x 1.2 M EUR per km = 30 M EUR"; adjust with local cost index if used).
     SDG11 linkage: List relevant targets/indicators (e.g., 11.2.1, 11.6.1) and briefly state the causal pathway.

5) Quick Wins (12-Month Horizon) (bulleted list)
   - 3–5 items. EACH item MUST include a numeric target, one KPI, and a year.

6) Monitoring and Milestones (narrative paragraphs; NO tables)
   - Describe the governance cadence (e.g., quarterly reviews), data refresh cycles, owners of metrics,
     and mid-term checkpoints for 2026/2027 and end-line 2030.
   - Specify how KPIs will be measured, thresholds for course-correction, and publication/communication cadence.

7) Assumptions and Data (bulleted list)
   - List exact UNSDGTool outputs used (indicator code + numeric value + scale/level).
   - List all proxies used and how they were applied or scaled.
   - Note any data limitations or conflicts and how you resolved them (prefer urban > regional > national).

# OUTPUT ENCODING RULES (ASCII-safe)
- Use only ASCII-safe characters for units and currency:
  - m2 (not m²), km2 (not km²), EUR (not €).
- Use normal spaces only (no non-breaking spaces or hidden control characters).
- Use dot as decimal separator.
- If a metric includes a unit, include it explicitly within the text, e.g., "500,000 m2 of green roofs".

# QUALITY CONTROL
- EVERY flagship action MUST reference at least one retrieved SDG11 numerical value in its rationale.
- ALL quick wins MUST be quantified with target, KPI, and year.
- Numbers MUST include units where applicable.
- The report MUST be long-form (approx. 1200–2000 words) and MUST NOT include any table.
- Only output the final Markdown (no extra commentary).
        """,
        tools=[UNSDGTool()],
        llm=model_name,
    )

    response = await workflow.run(
        inputs=[
            AgentWorkflowInput(
                prompt=(
                    f"Produce a long-form, detailed, operational action plan for {city}. "
                    f"You MUST call UNSDGTool first, cite its numerical outputs in the 'Assumptions and Data' section, "
                    f"and explicitly link at least one retrieved SDG11 metric to EACH flagship action. "
                    f"Do NOT use tables anywhere in the output."
                ),
                expected_output=(
                    f"A Markdown-formatted, ASCII-safe, long-form report for {city} (approx. 1200–2000 words), "
                    f"with: (1) 5–8 flagship actions (each with quantified targets, KPIs, owner, budget with formula, and SDG11 mapping); "
                    f"(2) 3–5 quantified quick wins with targets, KPI, and year; "
                    f"(3) a narrative 'Monitoring and Milestones' section (no tables); "
                    f"(4) an 'Assumptions and Data' section listing UNSDGTool outputs (codes, values, scale), proxies, and limitations; "
                    f"(5) explicit evidence that UNSDGTool was called BEFORE drafting; "
                    f"(6) NO tables and NO non-ASCII symbols (use m2, km2, EUR; no hidden characters)."
                ),
            ),
        ]
    )
    return response.result.final_answer


async def run_sdg11_validation_agent(city: str, user_question: str) -> str:
    """
    Agent qui analyse si une proposition ou question utilisateur rentre dans les critères SDG11
    """

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
        llm=model_name,
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
