# #RedHatCollabothonChallenge

# White Hat team
# Cerberus project

A modern frontend application for security awareness training and phishing simulation management.

## Features

- **Dashboard**: Risk overview and analytics
- **Employee Management**: Monitor and manage employee security risks
- **Campaigns**: Create and track phishing simulation campaigns
- **Incidents**: Track and manage security incidents
- **Authentication**: Secure JWT-based authentication

## Tech Stack

- **React** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Axios** for API calls

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is already configured to use the production backend:
```bash
VITE_API_URL=https://backend-white-hat-project.apps.cluster-xdhbp.xdhbp.sandbox1403.opentlc.com
```

For local development, you can change this to:
```bash
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── Layout.tsx    # Main layout with navigation
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── lib/              # Utilities and API client
│   ├── api.ts        # Axios instance with interceptors
│   └── utils.ts      # Helper functions
├── pages/            # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Employees.tsx
│   ├── EmployeeDetail.tsx
│   ├── Campaigns.tsx
│   └── Incidents.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app component with routing
└── main.tsx          # Entry point
```

## API Integration

The application integrates with a Django REST API. See the API schema (API.yaml) for endpoint details.

Key endpoints:
- `/api/auth/login/` - User authentication
- `/api/risks/overview/` - Risk overview statistics
- `/api/employees/` - Employee management
- `/api/campaigns/` - Campaign management
- `/api/incidents/` - Incident tracking

## Development

The application uses:
- Hot module replacement (HMR) for fast development
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for responsive design
- shadcn/ui for consistent, accessible components

## License

MIT
