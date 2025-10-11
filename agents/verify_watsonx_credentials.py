"""
Script to verify WatsonX credentials and find your correct project ID
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("WATSONX_API_KEY")
url = os.getenv("WATSONX_API_URL")

def get_iam_token(api_key: str) -> str:
    """Get IAM token from IBM Cloud"""
    token_url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": api_key
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]

def list_projects(token: str) -> list:
    """List all WatsonX projects accessible with this token"""
    projects_url = "https://api.dataplatform.cloud.ibm.com/v2/projects"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(projects_url, headers=headers)
    response.raise_for_status()
    return response.json().get("resources", [])

def main():
    print("=" * 60)
    print("WatsonX Credentials Verification")
    print("=" * 60)
    
    # Check environment variables
    print("\n1. Checking environment variables...")
    print(f"   WATSONX_API_KEY: {'✓ Set' if api_key else '✗ Missing'}")
    print(f"   WATSONX_API_URL: {url}")
    
    if not api_key:
        print("\n✗ ERROR: WATSONX_API_KEY is not set!")
        return
    
    # Get IAM token
    print("\n2. Getting IAM token...")
    try:
        token = get_iam_token(api_key)
        print("   ✓ Successfully authenticated with IBM Cloud")
    except Exception as e:
        print(f"   ✗ Authentication failed: {e}")
        return
    
    # List projects
    print("\n3. Fetching available WatsonX projects...")
    try:
        projects = list_projects(token)
        
        if not projects:
            print("   ✗ No projects found. You need to create a WatsonX project first!")
            print("\n   Go to: https://dataplatform.cloud.ibm.com/projects")
            print("   Click 'New project' and create a WatsonX project")
            return
        
        print(f"   ✓ Found {len(projects)} project(s):\n")
        
        for i, project in enumerate(projects, 1):
            project_id = project.get("metadata", {}).get("guid", "N/A")
            project_name = project.get("entity", {}).get("name", "Unnamed")
            print(f"   [{i}] Name: {project_name}")
            print(f"       ID:   {project_id}")
            print()
        
        print("\n" + "=" * 60)
        print("✓ SUCCESS: Use one of the project IDs above")
        print("=" * 60)
        print("\nUpdate your .env file with:")
        print(f"WATSONX_PROJECT_ID={projects[0]['metadata']['guid']}")
        
    except Exception as e:
        print(f"   ✗ Failed to fetch projects: {e}")
        print("\n   Make sure your API key has the correct permissions.")

if __name__ == "__main__":
    main()