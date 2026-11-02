# Orbita

Orbita is a React + TypeScript + Vite application for creating and sharing a personal profile hub. Each user can publish a profile at a unique username, manage a collection of links, and share the hub through a URL or QR code.

The application is a front-end client and requires a compatible Orbita API for authentication, profile management, and link operations.

## Requirements

- Node.js with npm
- A running Orbita API instance
- An environment file containing the API base URL

## Environment variables

Create a `.env.development` file in the project root:

```bash
VITE_BASE_URL=http://localhost:3000/api/v1
```

`VITE_BASE_URL` is used as the prefix for every API request. The client expects the API to expose the `/user` and `/link` resources described in the [API integration](#api-integration) section.

> Vite exposes variables prefixed with `VITE_` to the browser. Do not put secrets in this file.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application is available at `http://localhost:5173` by default.

## Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Starts the Vite development server        |
| `npm run build`   | Type-checks the project and builds `dist` |
| `npm run lint`    | Runs ESLint validation                    |
| `npm run preview` | Serves the production build locally       |

## Architecture

```text
src/
├── api/
│   ├── Link.api.ts              Link CRUD requests
│   ├── User.api.ts              User and authentication requests
│   ├── messages.api.ts          API error and success message catalog
│   └── request.api.ts           Shared HTTP client and error normalization
├── assets/
│   └── styles/
│       └── tailwind.style.css   Tailwind theme and shared styling tokens
├── common/
│   ├── classes/
│   │   └── HttpError.ts         Typed error used for API failures
│   └── types/
│       └── api.types.ts         Shared API response types
├── components/
│   ├── LinkModal.tsx            Create and edit link form
│   ├── Overlay.tsx              Modal backdrop
│   ├── ShareModal.tsx           Share URL and QR code dialog
│   └── UserModal.tsx            Register, login, edit, and delete forms
├── hooks/
│   ├── useLink.ts               React Query link mutations and cache updates
│   └── useUser.ts               React Query user and authentication operations
├── layouts/
│   └── MainLayout.tsx           Header, responsive navigation, and footer
├── pages/
│   ├── Fallback.tsx             Error and unknown-route page
│   ├── Home.tsx                 Landing page
│   ├── Join.tsx                  Authentication page shell
│   └── UserView.tsx             Public and authenticated profile hub
├── schemas/
│   ├── Link.schema.ts           Link validation schemas and types
│   ├── User.schema.ts           User validation schemas and types
│   └── common.schema.ts         Shared username and timestamp schemas
└── main.tsx                     Application bootstrap and route configuration
```

The application is bootstrapped in `main.tsx` with React Query for server state, React Router for navigation, and React Toastify for feedback notifications. API requests are centralized in `request.api.ts`, which validates JSON responses and converts transport or HTTP failures into `HttpError` instances.

## Features

### Profile hubs

- Create a profile with a unique username.
- View a profile through `/u/:username`.
- Display the user's name, username, and available links.
- Share a hub using its public URL.
- Copy the profile URL to the clipboard.
- Generate a QR code for the profile URL.

### Authentication and account management

- Register a new account.
- Log in and log out using a server-managed session cookie.
- Load the authenticated profile.
- Update profile name, email, username, and password.
- Delete the account after password confirmation.
- Redirect authenticated users away from registration and login flows.

All authentication requests use `credentials: "include"` so the browser sends and receives the API session cookie.

### Link management

Authenticated users can:

- Create, edit, and delete links.
- Set each link's visibility to `PUBLIC` or `PRIVATE`.
- Add up to 10 links to a profile.
- Receive optimistic UI updates while mutations are in progress.

The API remains the source of truth. React Query updates the profile cache optimistically and refreshes it after create and delete operations to reconcile client state with the server.

### Validation and feedback

Forms use `react-hook-form`, `zod`, and `@hookform/resolvers` for client-side validation. Validation covers:

- Usernames from 3 to 30 characters using lowercase letters, numbers, `.`, `-`, and `_`.
- Names from 2 to 255 characters containing at least one letter.
- Valid email addresses up to 255 characters.
- Passwords from 12 to 72 characters with uppercase, lowercase, numeric, and special characters, without whitespace.
- Link titles and references from 1 to 255 characters.
- `PUBLIC` and `PRIVATE` link visibility values.

API validation details are mapped to user-facing messages and displayed inline when they identify a form field. General failures are displayed through toast notifications, while unexpected failures are logged to the browser console.

### Responsive interface

- Tailwind CSS provides layout, responsive breakpoints, colors, and component styles.
- A desktop navigation bar changes to a collapsible sidebar on small screens.
- Profile actions and forms are presented through responsive overlays and modal layouts.
- Lucide icons provide the application's interface icons.

## Routes

All routes are relative to the front-end application host.

| Route                  | Description                              |
| ---------------------- | ---------------------------------------- |
| `/`                    | Landing page                             |
| `/cadastro`            | Registration form                        |
| `/login`               | Login form                               |
| `/u/:username`         | Public or authenticated user profile hub |
| `/u/:username/editar`  | Authenticated profile edit modal         |
| `/u/:username/excluir` | Authenticated account deletion modal     |
| `*`                    | Fallback page for unsupported routes     |

The profile route uses the authenticated profile when the requested username matches the current session. Otherwise, it requests the profile by username. Editing, deletion, and logout actions are only rendered for the authenticated profile owner.

## API integration

The client prefixes the following paths with `VITE_BASE_URL`:

### User and authentication endpoints

| Method   | Path                 | Description                                    |
| -------- | -------------------- | ---------------------------------------------- |
| `POST`   | `/user/auth`         | Creates a user account                         |
| `POST`   | `/user/auth/login`   | Authenticates a user and establishes a session |
| `POST`   | `/user/auth/logout`  | Logs out the current session                   |
| `GET`    | `/user/auth/profile` | Returns the authenticated user's profile       |
| `GET`    | `/user/:username`    | Returns a user profile by username             |
| `PATCH`  | `/user/auth`         | Updates the authenticated user's profile       |
| `DELETE` | `/user/auth`         | Deletes the authenticated user's account       |

### Link endpoints

| Method   | Path        | Description                               |
| -------- | ----------- | ----------------------------------------- |
| `POST`   | `/link`     | Creates a link for the authenticated user |
| `GET`    | `/link`     | Returns links for the authenticated user  |
| `GET`    | `/link/:id` | Returns a link by numeric ID              |
| `PATCH`  | `/link/:id` | Updates a link by numeric ID              |
| `DELETE` | `/link/:id` | Deletes a link by numeric ID              |

Requests that modify or read authenticated resources include `credentials: "include"`. The shared request helper expects JSON responses with the following error-compatible shape:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": {
    "field": "FIELD_ERROR_CODE"
  }
}
```

## Data model

### User

| Field         | Type     | Description                              |
| ------------- | -------- | ---------------------------------------- |
| `id`          | `string` | Unique user identifier (UUID)            |
| `name`        | `string` | Display name                             |
| `email`       | `string` | User email address                       |
| `username`    | `string` | Public profile identifier                |
| `links`       | `Link[]` | Links associated with the profile        |
| `createdAt`   | `string` | ISO timestamp with an explicit offset    |
| `lastEdition` | `string` | ISO timestamp of the last profile update |

The password is accepted during authentication and account operations but is omitted from the client-side `User` type returned by the API.

### Link

| Field            | Type                    | Description                           |
| ---------------- | ----------------------- | ------------------------------------- |
| `id`             | `number`                | Positive numeric link identifier      |
| `authorUsername` | `string`                | Username of the link owner            |
| `title`          | `string`                | Label displayed for the link          |
| `ref`            | `string`                | URL or other link reference           |
| `visibility`     | `"PUBLIC" \| "PRIVATE"` | Link visibility setting               |
| `createdAt`      | `string`                | ISO timestamp with an explicit offset |
| `lastEdition`    | `string`                | ISO timestamp of the last update      |

## Notes

- The API must be running and reachable at `VITE_BASE_URL` before using authenticated or profile features.
- The API and front end must be configured for cookie credentials and an appropriate cross-origin policy when they run on different origins.
- If `VITE_BASE_URL` is missing, the application reports a `MISSING_SERVER_ADDRESS` error instead of issuing a request.
- Network failures, non-JSON responses, and API error responses are surfaced as typed errors and user-facing notifications.
- The project currently has no automated test script; use `npm run lint` and `npm run build` to validate changes locally.
