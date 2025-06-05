# Backend Documentation

## Overview

The backend is built using Django and Django REST Framework, providing a robust API for the course registration platform.

## Technology Stack

- Python 3.x
- Django 4.x
- Django REST Framework
- SQLite (Development)
- PostgreSQL (Production)

## Project Structure

```
backend/
├── api/                    # Main API application
│   ├── models.py          # Database models
│   ├── serializers.py     # Data serializers
│   ├── views.py           # API views
│   └── urls.py            # URL routing
├── custom_auth/           # Custom authentication
├── backend/               # Project settings
└── manage.py             # Django management script
```

## API Endpoints

### 1. Courses API

#### List All Courses
```http
GET /api/courses/
```

Response:
```json
{
    "records": [
        {
            "id": "1",
            "fields": {
                "course-title": "Python Programming",
                "course-subtitle": "Learn Python from scratch",
                "course-description": "Comprehensive Python course...",
                "duration": "8 weeks",
                "price": "99.99",
                "image-url": "https://example.com/image.jpg",
                "enrolled-count": 150
            }
        }
    ]
}
```

#### Get Course Details
```http
GET /api/courses/{id}/
```

### 2. Course Registration API

#### Register for a Course
```http
POST /api/courses-registration/
```

Request Body:
```json
{
    "email": "student@example.com",
    "name": "John Doe",
    "student_id": "STU123",
    "phone": "+1234567890",
    "courseId": "Python Programming"
}
```

Response:
```json
{
    "success": true,
    "message": "Registration successful"
}
```

## Database Models

### Course Model
```python
class Course(models.Model):
    course_title = models.CharField(max_length=200)
    course_subtitle = models.CharField(max_length=200)
    course_description = models.TextField()
    duration = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField()
    enrolled_count = models.IntegerField(default=0)

    def __str__(self):
        return self.course_title
```

### Course Registration Model
```python
class CourseRegistration(models.Model):
    email = models.EmailField()
    name = models.CharField(max_length=200)
    student_id = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.course.course_title}"
```

## Serializers

### Course Serializer
```python
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
```

### Course Registration Serializer
```python
class CourseRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRegistration
        fields = ['email', 'name', 'student_id', 'phone', 'course']
```

## Views

### Course View
```python
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
```

### Course Registration View
```python
class CourseRegistrationView(APIView):
    def post(self, request):
        serializer = CourseRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=201)
        return Response(serializer.errors, status=400)
```

## URL Configuration

```python
urlpatterns = [
    path('courses/', CourseViewSet.as_view({'get': 'list'})),
    path('courses/<int:pk>/', CourseViewSet.as_view({'get': 'retrieve'})),
    path('courses-registration/', CourseRegistrationView.as_view()),
]
```

## Authentication

The API uses Django's built-in authentication system with custom middleware for token-based authentication.

### Authentication Middleware
```python
class CustomAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Authentication logic here
        return self.get_response(request)
```

## Error Handling

The API implements proper error handling with custom exception handlers:

```python
def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        response.data = {
            'error': response.data,
            'status_code': response.status_code
        }
    
    return response
```

## Development Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run development server:
```bash
python manage.py runserver
```

## Testing

1. Run tests:
```bash
python manage.py test
```

2. Test specific app:
```bash
python manage.py test api
```

## Production Deployment

1. Update settings:
   - Set `DEBUG = False`
   - Configure `ALLOWED_HOSTS`
   - Set up proper database
   - Configure static files

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Run migrations:
```bash
python manage.py migrate
```

## Security Considerations

1. **CORS Configuration**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com"
]
```

2. **Security Middleware**
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

## Environment Variables

Create a `.env` file:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Contributing

1. Follow PEP 8 style guide
2. Write unit tests for new features
3. Update documentation
4. Create pull requests with clear descriptions 