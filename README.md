# Course Registration Platform

A full-stack web application for course registration and management, built with Next.js (frontend) and Django (backend).

## Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory (pages and layouts)
│   ├── components/          # Reusable React components
│   ├── public/             # Static assets
│   └── styles/             # Global styles and Tailwind CSS
│
└── backend/                # Django backend application
    ├── api/               # Django REST API endpoints
    ├── custom_auth/      # Custom authentication system
    └── backend/          # Django project settings
```

## Frontend Documentation

### Technology Stack
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)

### Key Features
1. **Course Listing Page**
   - Responsive grid layout
   - Animated course cards
   - Expandable course details
   - Join Now functionality

2. **Payment Modal**
   - Two-step form process
   - Personal details collection
   - Payment screenshot upload
   - QR code payment integration

3. **UI Components**
   - Loading states
   - Error handling
   - Success notifications
   - Responsive design

### Getting Started (Frontend)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Backend Documentation

### Technology Stack
- Django 4.x
- Django REST Framework
- SQLite (Development) / PostgreSQL (Production)

### API Endpoints

1. **Courses API**
   - `GET /api/courses/` - List all courses
   - `GET /api/courses/{id}/` - Get course details

2. **Course Registration API**
   - `POST /api/courses-registration/` - Register for a course
   - Required fields:
     - email
     - name
     - student_id
     - phone
     - courseId

### Database Models

1. **Course Model**
   ```python
   class Course(models.Model):
       course_title = models.CharField(max_length=200)
       course_subtitle = models.CharField(max_length=200)
       course_description = models.TextField()
       duration = models.CharField(max_length=50)
       price = models.DecimalField(max_digits=10, decimal_places=2)
       image_url = models.URLField()
       enrolled_count = models.IntegerField(default=0)
   ```

2. **Course Registration Model**
   ```python
   class CourseRegistration(models.Model):
       email = models.EmailField()
       name = models.CharField(max_length=200)
       student_id = models.CharField(max_length=50)
       phone = models.CharField(max_length=20)
       course = models.ForeignKey(Course, on_delete=models.CASCADE)
       registration_date = models.DateTimeField(auto_now_add=True)
   ```

### Getting Started (Backend)

1. Create and activate virtual environment:
```bash
cd backend
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

4. Start development server:
```bash
python manage.py runserver
```

## Development Guidelines

### Frontend
1. Use TypeScript for type safety
2. Follow component-based architecture
3. Implement responsive design using Tailwind CSS
4. Use Framer Motion for animations
5. Follow Next.js 14 app directory structure

### Backend
1. Follow Django REST Framework best practices
2. Implement proper error handling
3. Use serializers for data validation
4. Follow Django's security guidelines
5. Write unit tests for API endpoints

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.