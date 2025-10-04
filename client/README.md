# Hospital Management System - Frontend

Frontend application for the Hospital Management System built with Next.js and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── (user)/            # Protected user pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── AlertMessage.tsx  # Alert notifications
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── Navigation.tsx    # Navigation bar
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   └── ToastContext.tsx  # Toast notifications context
├── hooks/                # Custom React hooks
│   ├── useLoginSubmit.ts # Login form handler
│   ├── useRegisterSubmit.ts # Registration form handler
│   └── useForgotPassword.ts # Password reset handler
├── services/             # API service layer
│   ├── auth.service.ts   # Authentication services
│   └── token.service.ts  # Token management
├── schemas/              # Zod validation schemas
│   └── auth.ts          # Authentication schemas
├── types/                # TypeScript type definitions
│   └── index.ts         # Global types
└── lib/                  # Utility functions
    ├── utils.ts         # General utilities
    └── toast.ts         # Toast helper functions
```

## 🔐 Authentication Features

- User login/registration
- JWT token management
- Password reset with OTP
- Protected routes
- Role-based access control

## 🎨 UI Components

- Form components with validation
- Loading states
- Toast notifications
- Responsive design
- Accessible components using Radix UI

## 🌐 API Integration

The frontend communicates with the backend API at `https://localhost:5001/api`

Key endpoints:
- `/login` - User authentication
- `/patient/register` - Patient registration
- `/logout` - User logout
- `/request-reset` - Password reset request
- `/verify-otp` - OTP verification

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://localhost:5001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Development Guidelines

- Use TypeScript for all components
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations
- Use React Hook Form for form handling
- Validate forms with Zod schemas

## 🐛 Common Issues

1. **API Connection**: Ensure backend is running on port 5001
2. **CORS Issues**: Check CORS configuration in backend
3. **Token Expiry**: Refresh token implementation handles this automatically

For more details, see the main project README.
