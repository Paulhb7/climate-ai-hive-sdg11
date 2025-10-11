🐝 API Backend – Hive.ai
1. Environment Variables

Before running the API, create a .env file (based on .env.example) in the backend folder containing your keys:

```bash
# === Watsonx (IBM) ===
WATSONX_API_URL=https://eu-de.ml.cloud.ibm.com
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id

# === OpenAI (optional) ===
OPENAI_API_KEY=your_openai_api_key

# === Default Model ===
MODEL_NAME=watsonx:ibm/granite-4-h-small
```

💡 You can change MODEL_NAME to another model supported by BeeAI, such as:
watsonx:ibm/granite-3-3-8b-instruct or openai:gpt-4.1-mini, depending on your needs.

2. Install Dependencies
   
```bash
cd backend
pip install -r requirements.txt
```

Starting the API
Method 1: Automatic Script (recommended)

```bash
cd backend
python api.py
```

Method 2: Direct Command

```bash
cd backend
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```
