# Janmashtami Event Management System

A comprehensive event management platform built with Next.js 14 for organizing and managing the Janmashtami celebration. The system supports participant registration, volunteer management, QR code scanning, and real-time event tracking.

## 🚀 Features

### Core Functionality
- **User Authentication**: Google OAuth integration with NextAuth.js
- **Participant Registration**: Event registration with phone number validation
- **Volunteer Management**: Volunteer applications and duty assignments
- **QR Code Scanning**: Real-time attendance tracking and gift distribution
- **Course Registration**: DivyaVidya course enrollment system
- **Trip Registration**: Soul walks and spiritual journey registrations
- **Real-time Dashboard**: Live participant and volunteer statistics

### Technical Features
- **Modern Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Database**: Supabase for data storage and real-time features
- **Authentication**: NextAuth.js with Google OAuth
- **Animations**: Framer Motion for smooth UI interactions
- **QR Code**: QR code generation and scanning capabilities
- **Responsive Design**: Mobile-first responsive layout

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Google Cloud Console account (for OAuth)
- Supabase account (for database)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth Provider
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Teable Configuration (for external data)
   TEABLE_API_KEY=your-teable-api-key
   TEABLE_USERS_TABLE_ID=your-teable-users-table-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### Supabase Database Setup

1. Create a new Supabase project
2. Set up the following tables:

#### Participants Table
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  age TEXT,
  address TEXT,
  emergency_contact TEXT,
  dietary_restrictions TEXT,
  special_needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Volunteers Table
```sql
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Volunteer Applications Table
```sql
CREATE TABLE volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  duty_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── participants/         # Participant management
│   │   ├── volunteers/           # Volunteer management
│   │   ├── volunteer-applications/ # Volunteer applications
│   │   ├── scan/                # QR code scanning
│   │   └── ...                  # Other API endpoints
│   ├── volunteer/                # Volunteer-specific pages
│   │   ├── dashboard/           # Volunteer dashboard
│   │   ├── scanning/            # QR code scanning interface
│   │   └── qr-generator/        # QR code generation tool
│   ├── courses/                 # Course registration
│   ├── trips/                   # Trip registration
│   └── ...                      # Other pages
├── components/                   # Reusable React components
│   ├── layout/                  # Layout components
│   ├── Modal.tsx               # Modal component
│   └── QRScanner.tsx           # QR code scanner
├── lib/                         # Utility libraries
│   ├── api.ts                  # API service functions
│   └── supabase.ts             # Supabase client
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🔌 API Endpoints

### Participants
- `GET /api/participants` - Get all participants
- `POST /api/participants` - Create new participant

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `POST /api/volunteers` - Create new volunteer
- `GET /api/volunteers/me` - Check if current user is volunteer

### Volunteer Applications
- `POST /api/volunteer-applications` - Submit volunteer application

### Scanning
- `POST /api/scan` - Process QR code scan
- `GET /api/scan` - Get scanning statistics

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation with authentication status
- **Modal**: Reusable modal component with animations
- **QRScanner**: QR code scanning interface
- **QRCodeSVG**: QR code generation component

### Pages
- **Dashboard**: User profile and activity overview
- **Events**: Event registration page
- **Volunteer Dashboard**: Volunteer-specific interface
- **Scanning Page**: Real-time QR code scanning
- **Success Page**: Registration confirmation with QR codes

## 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Google OAuth flow completes
3. NextAuth.js creates session
4. User data is stored in database
5. User is redirected to appropriate page

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach using Tailwind CSS:
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for mobile scanning
- Adaptive navigation

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```bash
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-key
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration flow
- [ ] Google OAuth authentication
- [ ] Participant registration
- [ ] Volunteer application
- [ ] QR code scanning
- [ ] Mobile responsiveness
- [ ] Real-time updates

### API Testing
Test API endpoints using tools like Postman or curl:
```bash
# Test participants API
curl -X GET http://localhost:3000/api/participants

# Test volunteer creation
curl -X POST http://localhost:3000/api/volunteers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Google OAuth credentials
   - Verify redirect URIs
   - Ensure environment variables are set

2. **Database connection errors**
   - Verify Supabase credentials
   - Check table structure
   - Ensure service role key has proper permissions

3. **QR code scanning issues**
   - Check camera permissions
   - Verify QR code format
   - Test with different browsers

### Debug Mode
Enable debug logging by adding to `.env.local`:
```bash
DEBUG=next-auth:*
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added QR code scanning and volunteer management
- **v1.2.0** - Enhanced UI/UX and mobile responsiveness
- **v1.3.0** - Added real-time features and improved error handling

---

**Built with ❤️ for the Janmashtami celebration**
