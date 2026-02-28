This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Configuration

### Environment Variables

The application requires the following environment variables to be configured:

#### `.env.local` (Development)

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Environment Variables:**

- `NEXT_PUBLIC_API_URL`: Base URL for the backend API
  - **Development**: `http://localhost:3000`
  - **Production**: Update with your production API URL (e.g., `https://api.primeacc.com`)
  - **Note**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser

#### `.env.production` (Production)

For production deployments, create a `.env.production` file or configure environment variables in your hosting platform:

```env
NEXT_PUBLIC_API_URL=https://api.primeacc.com
```

### Security Notes

- Never commit `.env.local` or `.env.production` files to version control
- These files are already included in `.gitignore`
- Use your hosting platform's environment variable management for production deployments
- The API client automatically uses the configured `NEXT_PUBLIC_API_URL` for all requests

## Authentication System

The application includes a comprehensive authentication system with the following features:

### Features

- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure login with JWT token-based authentication
- **Session Persistence**: Stay logged in across page refreshes
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Role-Based Access Control**: Support for MEMBER, AGENT, and ADMIN roles
- **Password Strength Meter**: Real-time password strength feedback
- **Form Validation**: Client-side validation with debouncing
- **Rate Limiting**: Client-side rate limiting (5 attempts per minute)
- **XSS Prevention**: Input sanitization and token sanitization
- **Responsive Design**: Mobile-first design with Navy theme and glassmorphism

### Authentication Flow

1. **Registration** (`/register`):
   - Enter username (3-20 alphanumeric characters)
   - Enter valid email address
   - Create strong password (8+ chars, uppercase, lowercase, number, special char)
   - Confirm password
   - Submit to create account

2. **Login** (`/login`):
   - Enter username and password
   - JWT token stored in localStorage
   - Automatic redirect to dashboard
   - Session persists across page refreshes

3. **Protected Routes** (`/dashboard/*`):
   - Requires authentication
   - Automatic redirect to login if not authenticated
   - Original destination preserved for post-login redirect

4. **Logout**:
   - Click logout button in sidebar
   - Clears JWT token and user data
   - Redirects to login page

### Security Features

- **JWT Token Management**: Secure token storage with automatic injection in API requests
- **XSS Prevention**: Input sanitization and token sanitization
- **Rate Limiting**: Client-side rate limiting to prevent brute force attacks
- **Token Expiration**: Automatic token validation and cleanup
- **HTTPS**: All authentication requests use HTTPS in production
- **Password Security**: Passwords never logged or displayed in plain text

### Role-Based Access Control

The system supports three user roles:

- **MEMBER**: Standard user with basic access
- **AGENT**: Premium user with commission tracking and referral features
- **ADMIN**: Full system access with user management and system configuration

Role-specific features are conditionally rendered based on the user's role.

### API Integration

The authentication system integrates with the NestJS backend:

- **POST /auth/register**: Create new user account
- **POST /auth/login**: Authenticate user and receive JWT token
- **GET /auth/profile**: Get current user profile (requires authentication)

All API requests automatically include the JWT token in the Authorization header.

### Accessibility

The authentication system follows WCAG AA accessibility guidelines:

- Proper ARIA labels for all form inputs
- Keyboard navigation support
- Screen reader announcements for errors
- Semantic HTML elements
- Visible focus indicators
- Support for prefers-reduced-motion

### Theme Integration

Authentication pages integrate with the existing theme system:

- Support for light and dark modes
- Navy, Rose, Emerald, Violet, and Amber color themes
- Glassmorphism effects consistent with dashboard
- Responsive design for mobile, tablet, and desktop

## Getting Started

### Chạy cả Frontend và Backend

Từ thư mục gốc của project, chạy lệnh sau để khởi động cả frontend và backend cùng lúc:

```bash
# Terminal 1 - Backend (NestJS)
cd backend && npm run start:dev

# Terminal 2 - Frontend (Next.js)
cd frontend && npm run dev
```

Hoặc chạy trong một terminal duy nhất (Windows):

```bash
cd backend ; npm run start:dev & cd ../frontend ; npm run dev
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:3003](http://localhost:3003)

### Chỉ chạy Frontend

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
