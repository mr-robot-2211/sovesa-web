# Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Authentication Setup

To enable Google OAuth authentication, you need to set up the following environment variables in your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Provider
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Setting up Google OAuth:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### Testing Authentication:

You can test if your authentication is properly configured by visiting:
- `/api/auth/test` - Check environment variable configuration
- Try logging in via the navbar login button

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Frontend Documentation

## Architecture Overview

The frontend is built using Next.js 14 with the App Router architecture. The application follows a component-based structure with a focus on reusability and maintainability.

## Key Components

### 1. Course Listing Page (`app/courses/page.tsx`)
The main course listing page that displays all available courses in a responsive grid layout.

#### Features:
- Responsive grid layout
- Animated course cards using Framer Motion
- Expandable course details
- Join Now functionality with payment integration

#### State Management:
```typescript
interface FormData {
    email: string;
    name: string;
    id: string;
    phone: string;
}

interface SubmissionStatus {
    loading: boolean;
    error: string | null;
    success: boolean;
}
```

### 2. Payment Modal Component
A two-step modal for course registration and payment.

#### Steps:
1. Personal Details Collection
   - Email
   - Name
   - ID
   - Phone Number

2. Payment Details
   - QR Code Display
   - Payment Screenshot Upload

#### Props:
```typescript
interface PaymentModalProps {
    formStep: number;
    formData: PaymentFormData;
    selectedCourse: any;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onFormDataChange: (field: keyof PaymentFormData, value: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

## API Integration

### Course Data Fetching
```typescript
useEffect(() => {
    fetch("http://localhost:8000/api/courses/")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            setCourses(data.records || []);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
}, []);
```

### Course Registration
```typescript
const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... form validation and submission logic
    const response = await fetch('http://127.0.0.1:8000/api/courses-registration/', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    // ... handle response
};
```

## Styling

The application uses Tailwind CSS for styling with custom configurations:

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Custom theme extensions
        },
    },
    plugins: [],
}
```

## Animation

Framer Motion is used for animations throughout the application:

### Loading Animation
```typescript
<motion.div
    animate={{ rotate: 360 }}
    transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
    }}
/>
```

### Page Transitions
```typescript
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
/>
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Implement proper error boundaries

2. **State Management**
   - Use React hooks for local state
   - Implement proper loading and error states
   - Handle form state efficiently

3. **Performance**
   - Implement proper image optimization
   - Use proper loading states
   - Implement lazy loading where appropriate

4. **Accessibility**
   - Use semantic HTML
   - Implement proper ARIA labels
   - Ensure keyboard navigation

## Development Workflow

1. **Setting Up Development Environment**
   ```bash
   npm install
   npm run dev
   ```

2. **Building for Production**
   ```bash
   npm run build
   npm start
   ```

3. **Code Quality**
   - Use ESLint for code linting
   - Follow TypeScript best practices
   - Write meaningful component documentation

## Testing

1. **Component Testing**
   - Use Jest and React Testing Library
   - Test user interactions
   - Test error states

2. **Integration Testing**
   - Test API integration
   - Test form submissions
   - Test navigation flows

## Deployment

1. **Build Process**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Production Considerations**
   - Enable proper caching
   - Implement error tracking
   - Set up proper monitoring
