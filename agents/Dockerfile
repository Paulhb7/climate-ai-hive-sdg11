FROM python:3.11-slim

WORKDIR /agents

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY .env .env

# Copy code
COPY . .

# Ensure entry point
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
