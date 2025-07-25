import requests
import pandas as pd
import json

def get_sdg_goal11_france():
    """
    Récupère les données du Goal 11 (Villes et communautés durables) 
    pour la France depuis l'API UN SDG
    """
    
    # URL de base de l'API
    base_url = "https://unstats.un.org/SDGAPI/v1/sdg/Goal/Data"
    
    # Paramètres pour filtrer Goal 11 et France
    params = {
        'goalCode': '11',
        'areaCode': '250',  # Code pour la France
        'pageSize': 1000    # Augmenter la taille de page
    }
    
    print("🌍 Récupération des données SDG Goal 11 pour la France...")
    
    try:
        # Appel GET à l'API
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        print(f"📊 Total d'éléments trouvés: {data.get('totalElements', 0)}")
        print(f"📄 Pages disponibles: {data.get('totalPages', 0)}")
        print(f"📝 Taille de la page actuelle: {data.get('size', 0)}")
        
        # Récupérer toutes les pages si nécessaire
        all_data = []
        total_pages = data.get('totalPages', 1)
        
        for page in range(1, total_pages + 1):
            print(f"📥 Récupération page {page}/{total_pages}...")
            
            params['page'] = page
            page_response = requests.get(base_url, params=params)
            page_response.raise_for_status()
            page_data = page_response.json()
            
            # Extraire les observations de cette page
            if 'data' in page_data:
                all_data.extend(page_data['data'])
        
        print(f"✅ {len(all_data)} observations récupérées")
        
        # Convertir en DataFrame pour manipulation plus facile
        if all_data:
            df = pd.DataFrame(all_data)
            
            # Filtrer explicitement sur la France si pas déjà fait
            if 'geoAreaCode' in df.columns:
                df_france = df[df['geoAreaCode'] == 250]
            else:
                df_france = df
            
            print(f"🇫🇷 {len(df_france)} observations pour la France")
            
            # Sauvegarder en CSV
            filename = "sdg_goal11_france.csv"
            df_france.to_csv(filename, index=False)
            print(f"💾 Données sauvegardées dans: {filename}")
            
            # Afficher un aperçu
            print("\n📋 Aperçu des données:")
            print(df_france.head())
            
            return df_france
        else:
            print("❌ Aucune donnée trouvée")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur lors de la requête: {e}")
        return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def get_sdg_goal11_france_csv():
    """
    Alternative: Utilise l'endpoint CSV pour récupérer directement un fichier CSV
    """
    
    url = "https://unstats.un.org/SDGAPI/v1/sdg/Goal/DataCSV"
    
    payload = {
        "goalCode": "11",
        "areaCode": "250"
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    print("🌍 Récupération CSV des données SDG Goal 11 pour la France...")
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        # Sauvegarder le CSV
        filename = "sdg_goal11_france_direct.csv"
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"💾 Fichier CSV sauvegardé: {filename}")
        
        # Lire et afficher un aperçu
        df = pd.read_csv(filename)
        print(f"🇫🇷 {len(df)} lignes dans le fichier")
        print("\n📋 Aperçu des données:")
        print(df.head())
        
        return df
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur lors de la requête: {e}")
        return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def analyze_france_data(df):
    """
    Analyse basique des données françaises
    """
    if df is None or len(df) == 0:
        print("❌ Pas de données à analyser")
        return
    
    print("\n🔍 ANALYSE DES DONNÉES FRANÇAISES - GOAL 11")
    print("=" * 50)
    
    # Informations générales
    print(f"📊 Nombre total d'observations: {len(df)}")
    
    # Colonnes disponibles
    print(f"\n📋 Colonnes disponibles: {list(df.columns)}")
    
    # Séries disponibles
    if 'seriesCode' in df.columns:
        series = df['seriesCode'].unique()
        print(f"\n📈 Séries disponibles ({len(series)}):")
        for s in series:
            print(f"  - {s}")
    
    # Années disponibles
    if 'timePeriodStart' in df.columns:
        years = sorted(df['timePeriodStart'].unique())
        print(f"\n📅 Années disponibles: {years[0]} - {years[-1]}")
    
    # Valeurs récentes
    if 'value' in df.columns and 'timePeriodStart' in df.columns:
        recent_data = df.nlargest(10, 'timePeriodStart')
        print(f"\n🕐 Données les plus récentes:")
        print(recent_data[['seriesCode', 'timePeriodStart', 'value']].to_string())

if __name__ == "__main__":
    print("🚀 Démarrage du script de récupération des données SDG Goal 11 - France")
    print("=" * 60)
    
    # Méthode 1: Endpoint JSON avec pagination
    print("\n1️⃣ Tentative avec l'endpoint JSON...")
    df_json = get_sdg_goal11_france()
    
    # Méthode 2: Endpoint CSV direct
    print("\n2️⃣ Tentative avec l'endpoint CSV...")
    df_csv = get_sdg_goal11_france_csv()
    
    # Analyser les données récupérées
    if df_csv is not None:
        analyze_france_data(df_csv)
    elif df_json is not None:
        analyze_france_data(df_json)
    else:
        print("❌ Aucune méthode n'a fonctionné")