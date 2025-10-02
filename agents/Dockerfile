FROM python:3.11-slim

WORKDIR /agents

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# IMPORTANT: Do NOT copy .env file - always use runtime environment variables
# Remove any .env file that might have been copied
RUN rm -f .env

# Set default environment variables (can be overridden at runtime)
ENV WATSONX_API_URL=https://eu-de.ml.cloud.ibm.com
ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO


# Default command
CMD ["python", "agents.py"]