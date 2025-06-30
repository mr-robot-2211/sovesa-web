import requests
import json

# Test the Teable API directly
TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s="
PRODUCTS_TABLE_ID = "tbl5oyaGNkUOaSSGuqT"
PRODUCTS_VIEW_ID = "viwKHk99DQe017wweIx"

url = f"https://app.teable.io/api/table/{PRODUCTS_TABLE_ID}/record"
params = {
    "viewId": PRODUCTS_VIEW_ID
}
headers = {
    "Authorization": f"Bearer {TEABLE_API_KEY}",
    "Accept": "application/json"
}

try:
    response = requests.get(url, params=params, headers=headers)
    print("Status Code:", response.status_code)
    print("Response Headers:", dict(response.headers))
    
    if response.status_code == 200:
        data = response.json()
        print("Teable Response Structure:")
        print(json.dumps(data, indent=2))
        
        # Check the structure
        if 'data' in data:
            print(f"\n✓ Found 'data' key")
            if 'records' in data['data']:
                print(f"✓ Found 'records' key with {len(data['data']['records'])} records")
                if len(data['data']['records']) > 0:
                    print("✓ First record structure:")
                    print(json.dumps(data['data']['records'][0], indent=2))
            else:
                print("✗ No 'records' key found in data")
        else:
            print("✗ No 'data' key found in response")
    else:
        print("Error Response:", response.text)
        
except Exception as e:
    print(f"Error: {e}") 