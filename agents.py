import asyncio
from beeai_framework.backend.chat import ChatModel
from beeai_framework.tools.search.wikipedia import WikipediaTool
from beeai_framework.tools.weather.openmeteo import OpenMeteoTool
from beeai_framework.workflows.agent import AgentWorkflow, AgentWorkflowInput

async def main() -> None:
    llm = ChatModel.from_name("ollama:granite3.2:latest")
    workflow = AgentWorkflow(name="Smart assistant")

    workflow.add_agent(
        name="Researcher",
        role="A diligent researcher.",
        instructions="You look up and provide information about the impact of climate change on a specific city.",
        tools=[WikipediaTool()],
        llm=llm,
    )

    workflow.add_agent(
        name="WeatherForecaster",
        role="A weather reporter.",
        instructions="You provide detailed weather reports and highlight any climate change trends or anomalies for the city.",
        tools=[OpenMeteoTool()],
        llm=llm,
    )

    workflow.add_agent(
        name="DataSynthesizer",
        role="A meticulous and creative data synthesizer",
        instructions="You combine research and weather data to summarize the impact of climate change on the selected city.",
        llm=llm,
    )

    city = input("Pour quelle ville souhaitez-vous connaître l'impact du réchauffement climatique ? ")

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
    ).on(
        "success",
        lambda data, event: print(
            f"\n-> Step '{data.step}' has been completed with the following outcome.\n\n{data.state.final_answer}"
        ),
    )
    
    print("==== Réponse finale ====")
    print(response.result.final_answer)


if __name__ == "__main__":
    asyncio.run(main())
