import requests
import json

# Test the products API endpoint
url = "http://127.0.0.1:8000/api/products/"

try:
    response = requests.get(url)
    print("Status Code:", response.status_code)
    print("Response Headers:", dict(response.headers))
    
    if response.status_code == 200:
        data = response.json()
        print("Response Data:")
        print(json.dumps(data, indent=2))
        
        # Check if we have records
        if 'data' in data and 'records' in data['data']:
            print(f"\nFound {len(data['data']['records'])} products")
            for i, record in enumerate(data['data']['records'][:3]):  # Show first 3
                print(f"Product {i+1}: {record.get('fields', {}).get('name', 'Unknown')}")
        else:
            print("No records found in response")
    else:
        print("Error Response:", response.text)
        
except requests.exceptions.ConnectionError:
    print("Connection Error: Make sure the Django server is running on http://127.0.0.1:8000")
except Exception as e:
    print(f"Error: {e}") 