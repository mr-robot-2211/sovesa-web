import requests
import json

# Teable API configuration
TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s="
TABLE_ID = "tblrShp1GIiBKktgYSh"
BASE_URL = "https://app.teable.io/api"
TABLE_URL = f"{BASE_URL}/table/{TABLE_ID}"

# Headers
headers = {
    "Authorization": f"Bearer {TEABLE_API_KEY}",
    "Content-Type": "application/json"
}

# First, get the table schema
try:
    response = requests.get(TABLE_URL, headers=headers)
    print("Table Schema Status Code:", response.status_code)
    print("Table Schema:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error getting table schema:", str(e))

# Now try to create a record
data = {
    "fieldKeyType": "name",
    "typecast": True,
    "records": [{
        "fields": {
            "date": "2024-03-20",
            "rounds": 16,
            "reading-time": 30
        }
    }]
}

try:
    response = requests.post(f"{TABLE_URL}/record", headers=headers, json=data)
    print("\nCreate Record Status Code:", response.status_code)
    print("Create Record Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error creating record:", str(e)) 