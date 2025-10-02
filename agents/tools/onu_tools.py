"""
UN SDG (Sustainable Development Goals) Data Tool for BeeAI Framework
Fetches SDG Goal 11 (Sustainable Cities and Communities) indicators from UN Statistics API
"""

import asyncio
import sys
from typing import Any, Dict
import requests
from pydantic import BaseModel, Field
import json
from beeai_framework.context import RunContext
from beeai_framework.emitter import Emitter
from beeai_framework.errors import FrameworkError
from beeai_framework.tools import StringToolOutput, Tool, ToolRunOptions,JSONToolOutput


class UNSDGToolInput(BaseModel):
    """Input model for UN SDG data tool"""
    
    country_code: str = Field(
        description="UN country code (e.g., '250' for France, '840' for USA, '1' for World)",
        example="250"
    )


class UNSDGTool(Tool[UNSDGToolInput, ToolRunOptions, JSONToolOutput]):
    """
    Tool for fetching UN Sustainable Development Goals data from the UN Statistics API.
    
    Fetches all SDG Goal 11 (Sustainable Cities and Communities) indicators for a given country.
    """
    
    name = "UN_SDG_Data"
    description = "Fetch all UN SDG Goal 11 indicators data for a specific country"
    input_schema = UNSDGToolInput
    
    # Base URL for UN Statistics API
    BASE_URL = "https://unstats.un.org/SDGAPI/v1/sdg"
    
    # All SDG Goal 11 indicators
    INDICATORS = [
        "11.1.1", "11.2.1", "11.3.1", "11.3.2", "11.4.1", 
        "11.5.1", "11.5.2", "11.6.1", "11.6.2", "11.7.1", "11.7.2"
    ]

    def __init__(self, options: dict[str, Any] | None = None) -> None:
        super().__init__(options)

    def _create_emitter(self) -> Emitter:
        return Emitter.root().child(
            namespace=["tool", "un", "sdg"],
            creator=self,
        )

    def _fetch_indicator_data(self, indicator: str, country_code: str) -> Dict[str, Any]:
        """Fetch data for a specific indicator"""
        url= f"https://unstats.un.org/SDGAPI/v1/sdg/Indicator/Data?indicator={indicator}&areaCode={country_code}&timePeriodStart=2020&timePeriodEnd=2025&pageSize=1000"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    async def _run(
        self, input: UNSDGToolInput, options: ToolRunOptions | None, context: RunContext
    ) -> JSONToolOutput:
        """
        Execute the UN SDG data fetching tool
        
        Fetches all Goal 11 indicators for the specified country.
        
        Args:
            input: UNSDGToolInput containing country code
            options: Tool run options
            context: Run context
            
        Returns:
            StringToolOutput with formatted indicator data
        """
        fetched_data = {}
        errors = []
        
        for indicator in self.INDICATORS:
            try:
                response_data = self._fetch_indicator_data(indicator, input.country_code)
                fetched_data[indicator] = response_data.get("data", [])
            except Exception as e:
                errors.append(f"Error fetching {indicator}: {str(e)}")
     
        return JSONToolOutput(json.dumps(fetched_data))


async def main() -> None:
    """Example usage of the UN SDG tool"""
    tool = UNSDGTool()
    
    # Example: Fetch data for France (country code 250)
    tool_input = UNSDGToolInput(country_code="250")
    result = await tool.run(tool_input)
    print(result)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except FrameworkError as e:
        sys.exit(e.explain())