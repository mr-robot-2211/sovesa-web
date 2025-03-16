import requests
from django.http import JsonResponse
from rest_framework.views import APIView

# Replace with your actual Teable API Key and Table ID
TEABLE_API_KEY = "teable_accl7T3xEqX2VUpybdH_N12Y1sZeItmTO4jjiMR4krowb67ifHSRLPnjAlMdReQ=="
TABLE_ID1 = "tbl6EvbcrFQuq4Ho6U4"
TABLE_ID2= "tblcFrcDKX6gWUW5rYD"
# BASE_URL = f"https://app.teable.io/api/table/{TABLE_ID}/record"

def fetch_teable_data(table_id):
    """Fetch data from Teable API with increased timeout"""
    url = f"https://app.teable.io/api/table/{table_id}/record"
    headers = {
        "Authorization": f"Bearer {TEABLE_API_KEY}",
        "Accept": "application/json",
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)  # ⏳ Increase timeout
        response.raise_for_status()  # Raise error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

class CourseListView(APIView):
    """Fetch course data from Teable API"""
    def get(self, request):
        data = fetch_teable_data(TABLE_ID2)
        return JsonResponse(data)

class TripListView(APIView):
    """Fetch trip data from Teable API"""
    def get(self, request):
        data = fetch_teable_data(TABLE_ID1)
        return JsonResponse(data)
