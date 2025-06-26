import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from .models import Blog, Course, Trip
from django.shortcuts import render
from .serializers import CourseSerializer, TripSerializer, BlogSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view

# Replace with your actual Teable API Key and Table ID
TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s="
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

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'excerpt', 'author', 'published_date', 'slug', 'image_url']

class BlogListView(APIView):
    """Fetch blog posts from Django database"""
    def get(self, request):
        try:
            blogs = Blog.objects.all()
            serializer = BlogSerializer(blogs, many=True)
            return Response({
                "records": serializer.data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class TripRegistrationView(APIView):
    """Post registration details into teable"""
    def post(self, request):
        # Step 1: Extract the incoming JSON data
        data = request.data

        # Optional: Validate required fields
        required_fields = ['name', 'email', 'phone', 'tripId']
        for field in required_fields:
            if field not in data:
                return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Prepare payload for Teable
        teable_payload = {
            "fieldKeyType": "name",
            "typecast": True,
            "records": [
                {
                    "fields": {
                        "name": data["name"],
                        "email": data["email"],
                        "phone": data["phone"],
                        "student_id":data["student_id"],
                        "tripId": data["tripId"]
                    }
                }
            ]
        }

        TEABLE_API_URL = "https://app.teable.io/api/table/tblZZSFK86JP45ATf48/record"

        headers = {
            "Authorization": f"Bearer {TEABLE_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            teable_response = requests.post(
                TEABLE_API_URL,
                headers=headers,
                json=teable_payload
            )

            # Step 4: Check Teable's response
            if teable_response.status_code in [200, 201]:
                return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "error": "Teable error",
                    "details": teable_response.json()
                }, status=teable_response.status_code)

        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
