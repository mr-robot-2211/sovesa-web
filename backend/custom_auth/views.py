import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import datetime
import jwt
from django.contrib.auth.hashers import check_password

# Constants
TEABLE_API_KEY = "teable_accl7T3xEqX2VUpybdH_N12Y1sZeItmTO4jjiMR4krowb67ifHSRLPnjAlMdReQ=="
SIGNUP_TABLE_ID = "tblwC1uo3abLrm3p3UE"
LOGIN_TABLE_ID = "tblwC1uo3abLrm3p3UE"
SIGNUP_TEABLE_BASE_URL = f"https://app.teable.io/api/table/{SIGNUP_TABLE_ID}/record"
LOGIN_TEABLE_BASE_URL = f"https://app.teable.io/api/table/{LOGIN_TABLE_ID}/record"
JWT_SECRET = "django-insecure-r1vp%^7e(o9$6kf_u)c152_8wjqztp4)k0-m3ddh&tnwixspe+"

# Helper Functions
def fetch_teable_data(table_url):
    """Fetch user data from Teable API with error handling"""
    headers = {
        "Authorization": f"Bearer {TEABLE_API_KEY}",
        "Accept": "application/json",
    }
    try:
        response = requests.get(table_url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

def create_teable_record(url, data):
    """Create a new record in Teable"""
    headers = {
        "Authorization": f"Bearer {TEABLE_API_KEY}",
        "Content-Type": "application/json",
    }
    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to create record: {str(e)}"}

def generate_jwt_token(email, is_sadhaka=False):
    """Generate a JWT token for authentication"""
    payload = {
        "email": email,
        "is_sadhaka": is_sadhaka,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# Views
class SignupView(APIView):
    """Handle user registration"""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        data = fetch_teable_data(SIGNUP_TEABLE_BASE_URL)
        if "error" in data:
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        users = data.get("records", [])
        if any(user["fields"].get("email") == email for user in users):
            return Response(
                {"error": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create new user
        payload = {
            "records": [{
                "fields": {
                    "email": email,
                    "password": password
                }
            }]
        }

        result = create_teable_record(SIGNUP_TEABLE_BASE_URL, payload)
        if "error" in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"message": "Signup successful"},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    """Handle user authentication"""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch users from Teable
        data = fetch_teable_data(LOGIN_TEABLE_BASE_URL)
        if "error" in data:
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Find user by email (case-insensitive)
        users = data.get("records", [])
        user = next(
            (u for u in users if u["fields"].get("email", "").lower() == email.lower()),
            None
        )

        if not user or password != user["fields"].get("password", ""):
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate JWT token
        is_sadhaka = user["fields"].get("is_sadhaka", False)
        token = generate_jwt_token(email, is_sadhaka)

        return Response({
            "message": "Login successful",
            "access": token,
            "is_sadhaka": is_sadhaka
        })

class MeditationStatsView(APIView):
    """Handle meditation statistics"""
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch data from Teable
        data = fetch_teable_data(LOGIN_TEABLE_BASE_URL)
        if "error" in data:
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Filter stats for the specific user
        user_stats = [
            record for record in data.get("records", [])
            if record["fields"].get("email") == email
        ]

        # Format the response
        stats = [{
            "date": stat["fields"].get("date", ""),
            "rounds": stat["fields"].get("rounds", 0),
            "reading_time": stat["fields"].get("reading_time", 0)
        } for stat in user_stats]

        return Response({"stats": stats})

    def post(self, request):
        email = request.data.get("email")
        rounds = request.data.get("rounds")
        reading_time = request.data.get("reading_time")

        if not all([email, rounds, reading_time]):
            return Response(
                {"error": "Email, rounds, and reading_time are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare data for Teable
        teable_data = {
            "fields": {
                "email": email,
                "rounds": int(rounds),
                "reading_time": int(reading_time),
                "date": datetime.datetime.now().strftime("%Y-%m-%d")
            }
        }

        # Send data to Teable
        result = create_teable_record(LOGIN_TEABLE_BASE_URL, teable_data)
        if "error" in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Stats recorded successfully"})