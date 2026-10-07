# Simple Modal Front End

Simple Modal Front End is a React + TypeScript + Vite application that provides the user interface for the Simple Modal API. It allows users to register, log in, view their profile, and log out using cookie-based authentication managed by the backend API.

## Requirements

- Node.js with npm
- A running Simple Modal API instance
- A `.env` file with the API base URL

## Environment variables

Create a `.env` file in the project root with a value similar to the following:

```bash
VITE_API_URL=http://localhost:9876
```

> `VITE_API_URL` points to the backend API that exposes the `/users/auth/*` endpoints. The examples below assume the API is running at `http://localhost:9876`.

## Getting started

Install dependencies and start the application in development mode:

```bash
npm install
npm run dev
```

The front-end application will be available at `http://localhost:5173` by default.

## Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Starts the Vite development server                |
| `npm run build`   | Builds the production bundle in the `dist` folder |
| `npm run lint`    | Runs ESLint validation                            |
| `npm run preview` | Serves the production build locally               |

## Architecture

```text
src/
├── api/
│   ├── Users.api.ts                 API requests for register, login, logout and profile
│   └── Users.api.messages.ts        Human-readable messages for API responses
├── assets/
│   └── styles/
│       └── tailwind.style.css       Tailwind theme and shared styling tokens
├── components/
│   └── Modal.tsx                   Reusable login/register form component
├── hooks/
│   └── useUsers.hook.ts            React Query hooks for auth and user profile requests
├── pages/
│   ├── Fallback.tsx                Generic fallback page for non-existent routes
│   ├── Layout.tsx                  Root layout with header and outlet
│   └── Profile.tsx                 Authenticated profile page and logout action
├── types/
│   └── User.types.ts               Zod validation schemas and inferred form types
├── utils/
│   ├── HttpError.utils.ts          Custom HTTP error handling for API failures
│   └── IsoDateFormatter.utils.ts   Utility to format ISO dates for display
├── main.tsx                        Application bootstrap and route configuration
├── ...
└── vite-env.d.ts                   Vite environment typings
```

The application registers routes in this order: `/` (login), `/register`, `/profile`, and a fallback route for unknown URLs.

## Features

### Authentication flow

The app integrates with the backend API and supports:

- User registration
- User login
- Protected profile page access
- Logout using the backend session cookie
- Redirects for authenticated or unauthenticated flows

### Form validation

The login and registration forms are validated with `zod` and `react-hook-form`.

Validation includes:

- Required name for registration
- Valid email format
- Password length and complexity rules
- Password confirmation matching

### User experience

- React Router handles navigation between pages
- React Query manages async data fetching and cache updates
- Toast notifications display API feedback and error states
- Tailwind CSS provides the layout and visual style

## Routes

All routes are relative to the front-end application host.

| Route       | Description                          |
| ----------- | ------------------------------------ |
| `/`         | Login page                           |
| `/register` | Registration page                    |
| `/profile`  | Authenticated user profile page      |
| `*`         | Fallback page for unsupported routes |

## API integration

The front-end communicates with the backend through the following endpoints:

| Method | Path                   | Description                                           |
| ------ | ---------------------- | ----------------------------------------------------- |
| `POST` | `/users/auth/register` | Creates a new user account                            |
| `POST` | `/users/auth/login`    | Authenticates the user and stores the JWT in a cookie |
| `POST` | `/users/auth/logout`   | Clears the authentication cookie                      |
| `GET`  | `/users/auth/profile`  | Returns the currently authenticated user              |

Requests to protected routes include `credentials: "include"` so the browser sends the HTTP-only cookie automatically.

## Data model

The front-end expects the same user structure returned by the API:

| Field       | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| `id`        | `string` | Unique user ID                        |
| `name`      | `string` | User display name                     |
| `email`     | `string` | User email address                    |
| `createdAt` | `string` | ISO date string for registration time |

The password is intentionally never exposed on the client side.

## Notes

- The backend API must be running before using the application.
- `VITE_API_URL` should match the backend address and port.
- The project uses cookie-based authentication, so the browser must accept third-party cookies from the API origin.
- If the backend is unavailable, all requests fail with a friendly error message and the application surfaces the issue through toast notifications.
