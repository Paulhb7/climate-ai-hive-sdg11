import os
from datetime import UTC, date, datetime
from typing import Any, Literal, Sequence
from urllib.parse import urlencode
import asyncio
import httpx
from pydantic import BaseModel, Field, field_validator
from types import SimpleNamespace
from beeai_framework.context import RunContext
from beeai_framework.emitter.emitter import Emitter
from beeai_framework.logger import Logger
from beeai_framework.tools import JSONToolOutput
from beeai_framework.tools.errors import ToolInputValidationError
from beeai_framework.tools.tool import Tool
from beeai_framework.tools.types import ToolRunOptions

logger = Logger(__name__)

# Climate indicator functions
def days_above_threshold(temps, threshold=30):
    return sum(1 for t in temps if t and t > threshold)

def frost_days(temps, threshold=0):
    return sum(1 for t in temps if t and t < threshold)

def heat_wave_duration(temps, threshold=30, min_days=3):
    max_duration = current_duration = 0
    for temp in temps:
        if temp and temp > threshold:
            current_duration += 1
            max_duration = max(max_duration, current_duration)
        else:
            current_duration = 0
    return max_duration if max_duration >= min_days else 0

def consecutive_dry_days(precip, threshold=1.0):
    max_dry = current_dry = 0
    for p in precip:
        if p is not None and p < threshold:
            current_dry += 1
            max_dry = max(max_dry, current_dry)
        else:
            current_dry = 0
    return max_dry

def flood_days(precip, threshold=20):
    return sum(1 for p in precip if p and p >= threshold)

def growing_season_length(temps, threshold=5):
    max_season = current_season = 0
    for temp in temps:
        if temp and temp > threshold:
            current_season += 1
            max_season = max(max_season, current_season)
        else:
            current_season = 0
    return max_season

# ────────────────────────────────────────────────────────────────────────────────
# Input schema
# ────────────────────────────────────────────────────────────────────────────────
class ClimateMeteoToolInput(BaseModel):
    """Parameters accepted by the Open-Meteo Climate API."""

    # === Location selection ====================================================
    location_name: str = Field(
        description="The name of the location (city, village, landmark…) you would like climate data for."
    )
    country: str | None = Field(description="Country name (optional).", default=None)

    # === Temporal extent =======================================================
    start_date: date | None = Field(
        description="Start of the period in UTC (YYYY-MM-DD)",
        default=date(2020, 1, 1),
    )
    end_date: date | None = Field(
        description="End of the period in UTC (YYYY-MM-DD). 2050-01-01 recommended.",
        default=date(2050, 1, 1),
    )

    # === Units =================================================================
    temperature_unit: Literal["celsius", "fahrenheit"] = Field(
        description="Temperature unit", default="celsius"
    )
    wind_speed_unit: Literal["kmh", "ms", "mph", "kn"] = Field(
        description="Wind-speed unit", default="kmh"
    )
    precipitation_unit: Literal["mm", "inch"] = Field(
        description="Precipitation unit", default="mm"
    )

    # === Climate-specific settings ============================================
    models: Sequence[
        Literal[
            "CMCC_CM2_VHR4",
            "FGOALS_f3_H",
            "HiRAM_SIT_HR",
            "MRI_AGCM3_2_S",
            "EC_Earth3P_HR",
            "MPI_ESM1_2_XR",
            "NICAM16_8S",
        ]
    ] | None = Field(
        description="One or more CMIP6 high-resolution models (comma-separated). Omit for all 7.",
        default=None,
    )

    daily: Sequence[str] | None = Field(
        description=(
            "Daily variables to retrieve (e.g. temperature_2m_mean, precipitation_sum…). "
            "If omitted, a concise default set is used."
        ),
        default=None,
    )

    # Normalise case for string enums ------------------------------------------
    @classmethod
    @field_validator("temperature_unit", "wind_speed_unit", "precipitation_unit", mode="before")
    def _to_lower(cls, value: Any) -> Any:  # noqa: N805
        return value.lower() if isinstance(value, str) else value


# ────────────────────────────────────────────────────────────────────────────────
# Tool implementation
# ────────────────────────────────────────────────────────────────────────────────
class ClimateChangeTool(
    Tool[ClimateMeteoToolInput, ToolRunOptions, JSONToolOutput[dict[str, Any]]]
):
    """Retrieve down-scaled CMIP6 climate data for a given location."""

    name = "ClimateChangeTool"
    description = "Get 1950,2025 and 2050 daily climate indicator from CMIP6 high-resolution models."
    input_schema = ClimateMeteoToolInput

    def __init__(self, options: dict[str, Any] | None = None) -> None:  # noqa: D401
        super().__init__(options)

    # ----------------------------------------------------------------------- #
    # Logging / tracing
    # ----------------------------------------------------------------------- #
    def _create_emitter(self) -> Emitter:  # noqa: D401
        return (
            Emitter.root()
            .child(namespace=["tool", "climate", "openmeteo"], creator=self)
        )

    # ----------------------------------------------------------------------- #
    # Internal helpers
    # ----------------------------------------------------------------------- #
    async def _geocode(self, input_: ClimateMeteoToolInput) -> dict[str, float]:
        """Resolve a city name to latitude & longitude via the Open-Meteo geocoder."""
        params: dict[str, Any] = {"format": "json", "count": 1, "name": input_.location_name}
        if input_.country:
            params["country"] = input_.country

        async with httpx.AsyncClient(
            proxy=os.getenv("BEEAI_OPEN_METEO_TOOL_PROXY")
        ) as client:
            response = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params=params,
                headers={"Accept": "application/json"},
            )
            response.raise_for_status()
            results = response.json().get("results", [])
            if not results:
                raise ToolInputValidationError(
                    f"Location '{input_.location_name}' was not found."
                )
            geocode: dict[str, float] = results[0]
            return geocode

    async def _build_query(self, input_: ClimateMeteoToolInput) -> str:
        """Turn validated input into a URL-encoded query string for /v1/climate."""
        geocode = await self._geocode(input_)

        params = {
            # required
            "latitude": geocode["latitude"],
            "longitude": geocode["longitude"],
            "start_date": str(input_.start_date),
            "end_date": str(input_.end_date),
            # CMS: either user-selected or all models
            "models": ",".join(input_.models) if input_.models else "CMCC_CM2_VHR4,FGOALS_f3_H,"
            "HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S",
            # Daily variables
            "daily": ",".join(
                input_.daily
                or [
                    "temperature_2m_mean",
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "precipitation_sum",
                    "rain_sum",
                    "snowfall_sum",
                    'soil_moisture_0_to_10cm_mean',
                    'windspeed_10m_mean',
                    'windspeed_10m_max',
                    'shortwave_radiation_sum'
                ]
            ),
            # Units
            "temperature_unit": input_.temperature_unit,
            "wind_speed_unit": input_.wind_speed_unit,
            "precipitation_unit": input_.precipitation_unit,
            # Output in ISO 8601 for easy downstream processing
            "timeformat": "iso8601",
            # Bias correction yields more realistic numbers by default
            # (let the caller disable if they wish)
            # 'disable_bias_correction': 'true',
        }

        return urlencode(params, doseq=True)

    # ----------------------------------------------------------------------- #
    # Tool entry-point
    # ----------------------------------------------------------------------- #
    async def _run(  # noqa: D401
        self,
        input_: ClimateMeteoToolInput,
        options: ToolRunOptions | None,
        context: RunContext,
    ) -> JSONToolOutput[dict[str, Any]]:
        
        """
        Execute the CMIP6 climate indicator tool
        
        Computes location-specific climate-impact indicators for the years
        1950, 2025 and 2050 using high-resolution CMIP6 models.
        
        Args:
            input: ClimateMeteoToolInput with location, model and variable settings
            options: Tool run options
            context: Run context
            
        Returns:
            JSONToolOutput mapping {year → {model → indicator → value}}
        """
        
        all_years_indicators = {}
        target_years = [1950, 2025, 2050]
        
        for year in target_years:
            # Modify input for single year
            year_input = ClimateMeteoToolInput(
                location_name=input_.location_name,
                country=input_.country,
                start_date=date(year, 1, 1),
                end_date=date(year, 12, 31),
                temperature_unit=input_.temperature_unit,
                wind_speed_unit=input_.wind_speed_unit,
                precipitation_unit=input_.precipitation_unit,
                models=input_.models,
                daily=input_.daily
            )
            
            query = await self._build_query(year_input)
            url = f"https://climate-api.open-meteo.com/v1/climate?{query}"
            logger.debug("Open-Meteo Climate URL: %s", url)

            async with httpx.AsyncClient(
                proxy=os.getenv("BEEAI_OPEN_METEO_TOOL_PROXY")
            ) as client:
                response = await client.get(
                    url, headers={"Accept": "application/json"}
                )
                response.raise_for_status()
                raw_data = response.json()
                
                # Calculate indicators for this year
                value_list = raw_data["daily"]
                year_indicators = {}
                
                for key in value_list:
                    if 'temperature_2m_mean' in key:
                        values = value_list[key]
                        model = key.replace('temperature_2m_mean_', '')
                        if model not in year_indicators:
                            year_indicators[model] = {}
                        year_indicators[model]['growing_season'] = growing_season_length(values)
                        
                    elif 'temperature_2m_max' in key:
                        values = value_list[key]
                        model = key.replace('temperature_2m_max_', '')
                        if model not in year_indicators:
                            year_indicators[model] = {}
                        year_indicators[model]['hot_days_30'] = days_above_threshold(values, 30)
                        year_indicators[model]['hot_days_35'] = days_above_threshold(values, 35)
                        year_indicators[model]['heat_wave_duration'] = heat_wave_duration(values)
                        
                    elif 'temperature_2m_min' in key:
                        values = value_list[key]
                        model = key.replace('temperature_2m_min_', '')
                        if model not in year_indicators:
                            year_indicators[model] = {}
                        year_indicators[model]['frost_days'] = frost_days(values)
                        
                    elif 'precipitation_sum' in key:
                        values = value_list[key]
                        model = key.replace('precipitation_sum_', '')
                        if model not in year_indicators:
                            year_indicators[model] = {}
                        year_indicators[model]['consecutive_dry_days'] = consecutive_dry_days(values)
                        year_indicators[model]['flood_days_20'] = flood_days(values, 20)
                        year_indicators[model]['flood_days_50'] = flood_days(values, 50)
                
                all_years_indicators[year] = year_indicators
            
        return JSONToolOutput(all_years_indicators)
        
# async def main() -> None:
#     tool = ClimateChangeTool()

#     # Request 1950-2050 climate data for Paris with default settings
#     input_payload = ClimateMeteoToolInput(location_name="Paris", country="France",start_date=date(2020, 1, 1))

#     # The framework usually calls .run(); here we invoke the internal coroutine directly
#     result = await tool.run(input_payload   
#     )
    
#     indicators = result.to_json_safe()
#     for year, year_data in indicators.items():
#         print(f"\n=== YEAR {year} ===")
#         for model, metrics in year_data.items():
#             print(f"\n{model}:")
#             for metric, value in metrics.items():
#                 print(f"  {metric}: {value}")
#     print(indicators)

# asyncio.run(main())