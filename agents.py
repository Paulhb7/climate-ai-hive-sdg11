import asyncio
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import re
from datetime import datetime, timedelta
from beeai_framework.backend.chat import ChatModel
from beeai_framework.tools.search.wikipedia import WikipediaTool
from beeai_framework.tools.weather.openmeteo import OpenMeteoTool
from beeai_framework.workflows.agent import AgentWorkflow, AgentWorkflowInput

def extract_climate_data(text):
    """Extract numerical climate data from the final answer text"""
    # Extract temperature changes
    temp_pattern = r'(\+?\-?\d+(?:\.\d+)?)\s*°?C'
    temps = re.findall(temp_pattern, text)
    
    # Extract precipitation data
    precip_pattern = r'(\d+)\s*mm'
    precips = re.findall(precip_pattern, text)
    
    # Extract years
    year_pattern = r'(\d{4})'
    years = re.findall(year_pattern, text)
    
    return temps, precips, years

def create_climate_visualization(city, final_answer):
    """Create visual charts based on the climate data"""
    temps, precips, years = extract_climate_data(final_answer)
    
    # Set up the figure with subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    fig.suptitle(f'Impact du réchauffement climatique à {city.title()}', 
                 fontsize=16, fontweight='bold')
    
    # Temperature visualization
    if temps and years:
        try:
            temp_values = [float(t.replace('+', '')) for t in temps if t.replace('+', '').replace('-', '').replace('.', '').isdigit()]
            year_values = [int(y) for y in years if len(y) == 4]
            
            if len(temp_values) >= 2 and len(year_values) >= 2:
                # Create temperature trend
                ax1.plot(year_values[:len(temp_values)], temp_values, 
                        marker='o', linewidth=2, markersize=8, color='red')
                ax1.set_title('Évolution des températures', fontweight='bold')
                ax1.set_xlabel('Année')
                ax1.set_ylabel('Changement de température (°C)')
                ax1.grid(True, alpha=0.3)
                ax1.set_facecolor('#f8f9fa')
        except (ValueError, IndexError):
            # If data parsing fails, create a generic temperature chart
            years_generic = list(range(1980, 2025, 5))
            temps_generic = [0, 0.2, 0.5, 0.8, 1.0, 1.3, 1.5, 1.8, 2.1]
            ax1.plot(years_generic, temps_generic, 
                    marker='o', linewidth=2, markersize=8, color='red')
            ax1.set_title('Évolution des températures (tendance générale)', fontweight='bold')
            ax1.set_xlabel('Année')
            ax1.set_ylabel('Augmentation de température (°C)')
            ax1.grid(True, alpha=0.3)
            ax1.set_facecolor('#f8f9fa')
    
    # Precipitation visualization
    if precips and years:
        try:
            precip_values = [int(p) for p in precips if p.isdigit()]
            year_values = [int(y) for y in years if len(y) == 4]
            
            if len(precip_values) >= 2 and len(year_values) >= 2:
                ax2.bar(year_values[:len(precip_values)], precip_values, 
                       color='blue', alpha=0.7, width=2)
                ax2.set_title('Évolution des précipitations', fontweight='bold')
                ax2.set_xlabel('Année')
                ax2.set_ylabel('Précipitations (mm)')
                ax2.grid(True, alpha=0.3, axis='y')
                ax2.set_facecolor('#f8f9fa')
        except (ValueError, IndexError):
            # Generic precipitation chart
            years_generic = [1980, 2000, 2020]
            precips_generic = [700, 850, 900]
            ax2.bar(years_generic, precips_generic, 
                   color='blue', alpha=0.7, width=8)
            ax2.set_title('Évolution des précipitations (tendance générale)', fontweight='bold')
            ax2.set_xlabel('Année')
            ax2.set_ylabel('Précipitations (mm)')
            ax2.grid(True, alpha=0.3, axis='y')
            ax2.set_facecolor('#f8f9fa')
    
    # Add text summary
    plt.figtext(0.1, 0.02, f"Synthèse: {final_answer[:200]}...", 
                wrap=True, fontsize=10, style='italic')
    
    plt.tight_layout()
    plt.subplots_adjust(top=0.93, bottom=0.15)
    
    # Save the plot
    filename = f"climate_impact_{city.lower().replace(' ', '_')}.png"
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"\n📊 Graphique sauvegardé: {filename}")
    
    # Show the plot
    plt.show()
    
    return filename

async def main() -> None:
    #llm = ChatModel.from_name("openai:gpt-3.5-turbo")
    
    llm = ChatModel.from_name("ollama:llama3.2:1b")
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
    
    # Create visual representation
    print("\n🎨 Création de la visualisation...")
    create_climate_visualization(city, response.result.final_answer)


if __name__ == "__main__":
    asyncio.run(main())
