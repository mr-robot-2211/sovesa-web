# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

### NextAuth Configuration
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Teable API Configuration
```
TEABLE_API_KEY=your-teable-api-key
```

### Teable Table IDs
```
TEABLE_COURSE_TABLE_ID=your-course-table-id
TEABLE_TRIP_TABLE_ID=your-trip-table-id
TEABLE_TRIP_REG_TABLE_ID=your-trip-registration-table-id
TEABLE_COURSE_REG_TABLE_ID=your-course-registration-table-id
TEABLE_USERS_TABLE_ID=your-users-table-id
```

## Troubleshooting

### Common Issues

1. **Missing NEXTAUTH_SECRET**
   - Error: "Missing required environment variables: [ 'NEXTAUTH_SECRET' ]"
   - Solution: Add `NEXTAUTH_SECRET=your-secret-key` to your `.env.local` file
   - Generate a secret: `openssl rand -base64 32` or use any random string

2. **API Routes Returning 404**
   - Check that all environment variables are set correctly
   - Verify your Teable API key is valid
   - Ensure table IDs are correct

3. **User Data Not Loading**
   - Verify your users table has the correct field names
   - Check browser console for errors

## User Management Features

The application now includes comprehensive user management functionality:

### 1. Automatic User Storage
When a user signs in with Google, the following data is automatically stored:

- **name**: User's full name from Google
- **email**: User's email address from Google  
- **profile_photo**: User's profile picture URL from Google

### 2. Profile Editing
Users can edit their profile information in the dashboard:

- **name**: Full name (editable)
- **phone**: Phone number (editable)
- **student_id**: Student ID (editable)
- **email**: Email address (read-only, from Google)

### 3. Course Registration with Auto-fill
When users register for courses:

- **Auto-fills** student ID and phone from profile data
- **Allows editing** of pre-filled data
- **Stores registration** in course registration table
- **Updates user's courses field** with enrolled courses

### Teable Users Table Setup

Create a new table in Teable with the following fields:

1. **name** (Text) - User's full name
2. **email** (Text) - User's email address (unique)
3. **profile_photo** (Text) - URL to user's profile picture
4. **phone** (Text) - User's phone number (optional)
5. **student_id** (Text) - User's student ID (optional)
6. **courses** (Multi-select) - Array of enrolled course IDs

### Teable Course Registration Table Setup

Create a new table in Teable with the following fields:

1. **name** (Text) - User's full name
2. **email** (Text) - User's email address
3. **phone** (Text) - User's phone number
4. **student_id** (Text) - User's student ID
5. **courseId** (Text) - Course ID being registered for
6. **payment_file** (Text) - Payment screenshot file name

### How It Works

#### User Registration Flow:
1. User clicks "Login with Google" button
2. Google OAuth flow completes
3. NextAuth signIn callback is triggered
4. User data is automatically sent to `/api/users` endpoint
5. Data is stored in the Teable users table
6. User is redirected to the dashboard

#### Profile Editing Flow:
1. User visits dashboard and clicks "Edit Profile"
2. Form loads with current data from database
3. User makes changes and clicks "Save Changes"
4. Data is sent to `/api/users/update` endpoint
5. System finds user record by email and updates only changed fields
6. Updated data is reflected in the dashboard

#### Course Registration Flow:
1. User clicks "Join Now" on a course
2. Form auto-fills with student ID and phone from profile
3. User can edit the pre-filled data if needed
4. User uploads payment screenshot and submits
5. Data is sent to `/api/courses-registration` endpoint
6. Course registration is stored in course registration table
7. User's courses field is updated with new course ID
8. Success message is shown

### API Endpoints

- **POST `/api/users`** - Store new user data
- **GET `/api/users/[email]`** - Get user data by email
- **PUT `/api/users/update`** - Update user data
- **POST `/api/courses-registration`** - Register for course and update user courses

The user storage happens automatically and doesn't block the login process if it fails. Profile editing and course registration are fully functional with auto-fill capabilities. 