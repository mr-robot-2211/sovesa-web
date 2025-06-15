import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import datetime
import jwt
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import uuid

# Constants
TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s="
SIGNUP_TABLE_ID = "tblwC1uo3abLrm3p3UE"
LOGIN_TABLE_ID = "tblwC1uo3abLrm3p3UE"
SIGNUP_TEABLE_BASE_URL = f"https://app.teable.io/api/table/{SIGNUP_TABLE_ID}/record"
LOGIN_TEABLE_BASE_URL = f"https://app.teable.io/api/table/{LOGIN_TABLE_ID}/record"
TEABLE_BASE_URL = "https://app.teable.io/api"
BASE_ID = "bseXW5ueRO8ig9tOLyj"  # Add your base ID here
JWT_SECRET = "django-insecure-r1vp%^7e(o9$6kf_u)c152_8wjqztp4)k0-m3ddh&tnwixspe+"

# Helper Functions
def fetch_teable_data(table_url):
    """Fetch user data from Teable API with error handling"""
    headers = {
        "Authorization": f"Bearer {TEABLE_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    try:
        response = requests.get(table_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Check if response is JSON
        try:
            return response.json()
        except ValueError:
            return {"error": "Invalid response from server"}
            
    except requests.exceptions.RequestException as e:
        if hasattr(e.response, 'status_code'):
            if e.response.status_code == 401:
                return {"error": "Authentication failed"}
            elif e.response.status_code == 404:
                return {"error": "Resource not found"}
            elif e.response.status_code >= 500:
                return {"error": "Server error"}
        return {"error": "Failed to connect to server"}

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

def generate_jwt_token(email, is_sadhaka=False, table_id=None):
    """Generate a JWT token for authentication"""
    payload = {
        "email": email,
        "is_sadhaka": is_sadhaka,
        "table_id": table_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow(),
        "jti": str(uuid.uuid4()),  # Add unique JWT ID
        "token_type": "access",  # Add token type
        "user_id": email,  # Required by DRF JWT
        "username": email  # Required by DRF JWT
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def create_teable_table(email):
    """Create a new table in Teable for tracking sadhana"""
    headers = {
        "Authorization": f"Bearer {TEABLE_API_KEY}",
        "Content-Type": "application/json",
    }
    
    # Create table payload
    table_payload = {
        "name": f"{email}'s sadhana sheet",
        "fields": [
            {
                "name": "date",
                "type": "date",
                "required": True
            },
            {
                "name": "rounds",
                "type": "number",
                "required": True
            },
            {
                "name": "reading-time",
                "type": "number",
                "required": True
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{TEABLE_BASE_URL}/base/{BASE_ID}/table",
            json=table_payload,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException:
        return {"error": "Failed to create table"}

# Views
class SignupView(APIView):
    """Handle user registration"""
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        is_sadhaka = request.data.get("is_sadhaka", False)

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        data = fetch_teable_data(SIGNUP_TEABLE_BASE_URL)
        if "error" in data:
            return Response(
                {"error": "Service temporarily unavailable. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        users = data.get("records", [])
        if any(user["fields"].get("email") == email for user in users):
            return Response(
                {"error": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create sadhana tracking table for the user first
        table_result = create_teable_table(email)
        if "error" in table_result:
            return Response(
                {"error": "Unable to setup tracking. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Get the table ID from the response
        table_id = table_result.get("id")
        if not table_id:
            return Response(
                {"error": "Unable to setup tracking. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create new user with table ID
        payload = {
            "records": [{
                "fields": {
                    "email": email,
                    "password": password,
                    "is_sadhaka": is_sadhaka,
                    "tableid": table_id
                }
            }]
        }

        result = create_teable_record(SIGNUP_TEABLE_BASE_URL, payload)
        if "error" in result:
            return Response(
                {"error": "Unable to create account. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Generate JWT token
        token = generate_jwt_token(email, is_sadhaka, table_id)

        return Response({
            "message": "Signup successful",
            "access": token,
            "is_sadhaka": is_sadhaka,
            "redirect_to": "dashboard" if is_sadhaka else "home",
            "sadhana_table_id": table_id
        }, status=status.HTTP_201_CREATED)

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
            return Response(
                {"error": data["error"]},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Find user by email (case-insensitive)
        users = data.get("records", [])
        if not users:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = next(
            (u for u in users if u["fields"].get("email", "").lower() == email.lower()),
            None
        )

        if not user or password != user["fields"].get("password", ""):
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate JWT token
        is_sadhaka = user["fields"].get("is_sadhaka", False)
        table_id = user["fields"].get("tableid")
        token = generate_jwt_token(email, is_sadhaka, table_id)

        return Response({
            "message": "Login successful",
            "access": token,
            "is_sadhaka": is_sadhaka,
            "redirect_to": "dashboard" if is_sadhaka else "home"
        })

@method_decorator(csrf_exempt, name='dispatch')
class PostSadhanaView(APIView):
    """Handle sadhana form submissions and retrievals"""
    def get(self, request):
        # Get user's table ID from JWT token
        auth_header = request.headers.get('Authorization')
        print("GET request - Authorization header:", auth_header)
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            print("GET request - Full token payload:", payload)
            table_id = payload.get('table_id')
        except jwt.InvalidTokenError as e:
            print("GET request - Token decode error:", str(e))
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not table_id:
            return Response(
                {"error": "Table ID not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch data from user's table
        table_url = f"{TEABLE_BASE_URL}/table/{table_id}/record"
        data = fetch_teable_data(table_url)
        
        if "error" in data:
            return Response(
                {"error": "Failed to fetch stats"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Format the response
        stats = [{
            "date": stat["fields"].get("date", ""),
            "rounds": stat["fields"].get("rounds", 0),
            "reading_time": stat["fields"].get("reading-time", 0)
        } for stat in data.get("records", [])]

        return Response({"stats": stats})

    def post(self, request):
        # Get user's table ID from JWT token
        auth_header = request.headers.get('Authorization')
        print("POST request - Authorization header:", auth_header)
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            print("POST request - Full token payload:", payload)
            table_id = payload.get('table_id')
        except jwt.InvalidTokenError as e:
            print("POST request - Token decode error:", str(e))
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not table_id:
            return Response(
                {"error": "Table ID not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get form data
        date = request.data.get("date")
        rounds = request.data.get("rounds")
        reading_time = request.data.get("reading_time")

        if not all([date, rounds, reading_time]):
            return Response(
                {"error": "Date, rounds and reading time are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Convert to integers and validate
            rounds = int(rounds)
            reading_time = int(reading_time)
            
            if rounds < 0 or reading_time < 0:
                return Response(
                    {"error": "Values cannot be negative"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError as e:
            return Response(
                {"error": "Rounds and reading time must be numbers"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare data for Teable
        teable_payload = {
            "fieldKeyType": "name",
            "typecast": True,
            "records": [{
                "fields": {
                    "date": date,
                    "rounds": rounds,
                    "reading-time": reading_time
                }
            }]
        }

        # Send data to user's table
        table_url = f"{TEABLE_BASE_URL}/table/{table_id}/record"
        headers = {
            "Authorization": f"Bearer {TEABLE_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            teable_response = requests.post(
                table_url,
                headers=headers,
                json=teable_payload
            )

            # Check Teable's response
            if teable_response.status_code in [200, 201]:
                response_data = {
                    "message": "Stats recorded successfully",
                    "data": {
                        "date": date,
                        "rounds": rounds,
                        "reading_time": reading_time
                    }
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "error": "Failed to record stats",
                    "details": teable_response.json()
                }, status=teable_response.status_code)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Failed to record stats: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def options(self, request, *args, **kwargs):
        response = Response()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response