# Auth Frontend

A modern React-based authentication frontend built with Vite, React Router, and Tailwind CSS. Fully integrated with the Auth Backend API.

## Features

- 🔐 User registration and login
- ✉️ Email verification with OTP
- 🔄 Automatic token refresh
- 🛡️ Protected routes with role-based access
- 🎨 Beautiful dark theme UI with Tailwind CSS
- ⚡ Lightning-fast development with Vite
- 🚀 Modern React with hooks and context API
- 📱 Fully responsive design

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Auth Backend running on `http://localhost:3000`

## Installation

```bash
# Clone the repository
cd auth-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## Configuration

Update `.env.local` with your backend API URL:

```env
VITE_API_URL=http://localhost:3000/api/auth
```

## Project Structure

```
auth-frontend/
├── src/
│   ├── api/
│   │   └── client.js          # Axios client with interceptors
│   ├── services/
│   │   └── authService.js     # Auth API methods
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VerifyEmailPage.jsx
│   │   └── DashboardPage.jsx
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Integration

### Authentication Flow

1. **Register** - Create new account
   - Validates username, email, password
   - Returns user object (unverified)

2. **Verify Email** - Verify email with OTP
   - Request OTP to be sent
   - Submit OTP to verify email

3. **Login** - Authenticate user
   - Returns access token and refresh token
   - Tokens stored in localStorage

4. **Protected Routes** - Access dashboard
   - Requires valid access token
   - Auto-redirect to login if unauthorized

5. **Logout** - Clear session
   - Current session or all sessions

### Token Management

- **Access Token**: Short-lived (15-30 minutes), stored in localStorage
- **Refresh Token**: Long-lived (7 days), used to get new access token
- **Auto-Refresh**: Interceptor automatically refreshes token on 401

## Key Components

### AuthContext
Global state management for authentication:
```javascript
const { user, login, register, logout, loading } = useAuth();
```

### ProtectedRoute
Guard routes that require authentication:
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### API Client
Axios instance with automatic token injection and refresh:
```javascript
import client from './api/client';
const response = await client.get('/protected-endpoint');
```

## Error Handling

- **Validation Errors**: Displayed with field details
- **Network Errors**: Toast notifications
- **Authentication Errors**: Auto-redirect to login
- **Token Expiry**: Automatic refresh or redirect to login

## Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark mode with gradient accents
- **Responsive**: Mobile-first design
- **Icons**: Lucide React

## Deployment

1. Update `VITE_API_URL` for production
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Configure CORS on backend for your domain

## Troubleshooting

### CORS Error
Ensure backend CORS is configured for `http://localhost:5173`

### Token Issues
Clear localStorage and try logging in again

### Backend Connection
Verify backend is running on port 3000

## License

MIT
