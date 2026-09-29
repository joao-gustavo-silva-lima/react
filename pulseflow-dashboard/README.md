# PulseFlow Dashboard

PulseFlow Dashboard is a Single-Page Application (SPA) for managing routines, habits, and sub-tasks:

```text
Routine
└── Habit
    └── Sub-task
```

It is built with React 19, TypeScript, and Vite, styled using Tailwind CSS v4, and powered by TanStack Query for server-state caching and synchronization. Form management and validation are handled through React Hook Form and Zod schemas that mirror the API specifications. It connects to the PulseFlow REST API to deliver real-time habit tracking, nested task completion, streak calculations, URL-driven modal workflows, search filters, and activity analytics.

## Requirements

- Node.js with npm
- Access to the PulseFlow API (configured by default to `https://pulse-flow-api.onrender.com`)

## Getting started

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

The application is available at `http://localhost:5173`. Set the `--port` flag to use a different port:

```bash
npm run dev -- --port 3001
```

The development server uses Vite Fast Refresh (HMR), automatically updating changed React components and styles in real time.

## Scripts

| Command           | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `npm run dev`     | Starts the Vite development server with Hot Module Replacement     |
| `npm run build`   | Runs TypeScript type checking (`tsc -b`) and builds for production |
| `npm run preview` | Serves the production build output locally for verification        |
| `npm run lint`    | Runs ESLint to check for code quality and style issues             |

## Architecture

```text
src/
├── main.tsx                           Application bootstrap, router definitions, and QueryClient provider
├── api/
│   ├── api.ts                         Fetch HTTP client, endpoint mutations, and response unwrapping
│   └── messages.api.ts                Map of API status codes and validation keys to localized Portuguese messages
├── assets/
│   └── styles/
│       └── tailwindcss.style.css      Tailwind CSS v4 theme, color tokens, typography, and utility classes
├── components/
│   ├── ActionButton.tsx               Polymorphic button / link component with hover and focus states
│   ├── HabitFormField.tsx             Reusable habit inputs and dynamic sub-task field array controls
│   ├── HabitModal.tsx                 Modal dialog for creating and updating habits
│   ├── Layout.tsx                     Root application shell, top bar, and sliding mobile sidebar
│   ├── RoutineModal.tsx               Modal dialog for creating and updating routines and initial habits
│   ├── SearchBar.tsx                  Search input and category/status filter buttons
│   └── SubTaskModal.tsx               Modal dialog for creating and updating sub-tasks
├── hooks/
│   ├── useBodyScrollLock.tsx          Locks background body scroll when modals or sidebars are active
│   └── useRoutines.ts                 TanStack Query query and mutation hooks with cache invalidation
├── pages/
│   ├── Analytics.tsx                  Reports dashboard with annual habit heatmap and category metrics
│   ├── Fallback.tsx                   Error, 404, and network disconnection feedback page
│   └── Index.tsx                      Main dashboard showing routines, habits, streaks, and nested modal outlets
├── types/
│   └── routines.types.ts              Zod schemas, inferred TypeScript types, and category constants
└── utils/
    ├── calculate-analytics.utils.ts   Generates 365-day contribution matrix and category distributions
    ├── date-conversion.utils.ts       Date formatters for localized Portuguese and ISO date strings
    ├── field-path-handler.utils.ts    Typed nested field path helper for dynamic form controls
    ├── filter-routines.utils.ts       Filters routines by title and category or completion status
    ├── handle-completion-dates.utils.ts Evaluates daily completion status and computes active streaks
    ├── handle-error.utils.ts          Maps API validation errors into React Hook Form field errors and toasts
    └── stateful-error.utils.ts        Custom error class carrying HTTP status, error code, and appendix
```

The application root configures `QueryClientProvider`, `BrowserRouter`, and a global `ToastContainer`. Nested routing allows modal dialogs to render on top of the main dashboard using React Router `<Outlet />`, keeping form states synchronized with URL path parameters.

## Data model

The client validates resources using Zod schemas matching the backend API contracts. Every resource has an `id`, a title, and a `completionDates` array containing `YYYY-MM-DD` ISO strings.

### Routine

| Field             | Type       | Rules                                                     |
| ----------------- | ---------- | --------------------------------------------------------- |
| `id`              | `string`   | Optional on creation; generated by the API                |
| `title`           | `string`   | Required, trimmed, 3-40 characters                        |
| `habits`          | `Habit[]`  | Required; 1-15 items with unique titles within the routine |
| `completionDates` | `string[]` | Optional; unique ISO calendar dates (`YYYY-MM-DD`)        |

### Habit

| Field             | Type        | Rules                                                                     |
| ----------------- | ----------- | ------------------------------------------------------------------------- |
| `id`              | `string`    | Optional on creation; generated by the API                                |
| `title`           | `string`    | Required, trimmed, 3-50 characters                                        |
| `category`        | `string`    | One of `Health`, `Studies`, `Work`, `Finance`, `Personal`, `Productivity` |
| `subTasks`        | `SubTask[]` | Optional; defaults to empty array; allows up to 10 unique titles          |
| `completionDates` | `string[]`  | Optional; unique ISO calendar dates (`YYYY-MM-DD`)                        |

### Sub-task

| Field             | Type       | Rules                                              |
| ----------------- | ---------- | -------------------------------------------------- |
| `id`              | `string`   | Optional on creation; generated by the API         |
| `title`           | `string`   | Required, trimmed, 2-60 characters                 |
| `completionDates` | `string[]` | Optional; unique ISO calendar dates (`YYYY-MM-DD`) |

### Categories

The application supports six predefined categories mapped to localized labels:

| Category Code  | Localized Label     |
| -------------- | ------------------- |
| `Health`       | 🩺 Saúde            |
| `Studies`      | 📚 Estudos          |
| `Work`         | 💼 Trabalho         |
| `Finance`      | 💰 Finanças         |
| `Personal`     | 👤 Pessoal          |
| `Productivity` | ⚡ Produtividade    |

## Routing and views

The application utilizes React Router nested routes with modal overlays rendered inside `Index`:

| Route Path                               | Component / View           | Description                                        |
| ---------------------------------------- | -------------------------- | -------------------------------------------------- |
| `/`                                      | `Index`                    | Main dashboard view with routine and habit lists   |
| `/new-routine`                           | `RoutineModal` (`create`)  | Modal dialog to create a new routine and habits    |
| `/:routineId/edit`                       | `RoutineModal` (`patch`)   | Modal dialog to rename an existing routine         |
| `/:routineId/new-habit`                  | `HabitModal` (`create`)    | Modal dialog to add a new habit to a routine       |
| `/:routineId/:habitId/edit`              | `HabitModal` (`patch`)     | Modal dialog to edit habit title and category      |
| `/:routineId/:habitId/new-sub-task`      | `SubTaskModal` (`create`)  | Modal dialog to add a sub-task to a habit          |
| `/:routineId/:habitId/:subTaskId/edit`   | `SubTaskModal` (`patch`)   | Modal dialog to edit a sub-task title              |
| `/analytics`                             | `Analytics`                | Reporting page with activity heatmap and metrics   |
| `*`                                      | `Fallback`                 | Fallback screen for unmatched routes or errors     |

Opening any modal URL updates the browser address bar, locks document body scrolling (`useBodyScrollLock`), and restores background navigation when dismissed.

## Features

### Daily completion and propagation

- Resources can be toggled for completion for the current day (`YYYY-MM-DD`).
- For standalone habits and sub-tasks, clicking the status button toggles completion via `POST /.../toggle-date`.
- For composite resources (habits with sub-tasks, or routines with habits), completion status is derived:
  - A habit is considered complete for today only when all its child sub-tasks are complete.
  - A routine is complete for today only when all its child habits are complete.
- The UI differentiates between user-actionable checkboxes and composite status indicators (`AncestralConclusionStatus`).

### Streak tracking

- The client computes consecutive day streaks (`checkStreak`) for every routine, habit, and sub-task.
- Streaks count backwards from the current calendar date (`todayISO`). If today is not completed, the streak is `0`.
- Active streaks (> 0) display a flame badge with the consecutive day count.

### Search and category filtering

- The dashboard provides instant search across habits and sub-tasks.
- Search queries perform case-insensitive substring matching against titles.
- Category filters enable quick slicing by:
  - `All`: displays all routines and habits;
  - `Complete`: habits completed today;
  - `Pending`: habits pending completion today;
  - Category filters: `Health`, `Studies`, `Work`, `Finance`, `Personal`, or `Productivity`.
- Routines without matching habits are automatically hidden from the filtered view.

### Activity analytics and heat map

The `/analytics` view computes client-side reports across all routines:

- **Habit Frequency Heatmap**: Visualizes contributions over the preceding 365 days aligned by day of the week (`S`, `T`, `Q`, `Q`, `S`, `S`, `D`). Daily completions are weighted relative to the peak single-day contribution into five intensity levels (0 to 4).
- **Category Distribution**: Calculates the proportional percentage breakdown of all registered habits across the predefined categories.

## Backend integration

Requests are managed via `fetch` inside `src/api/api.ts` targeting `https://pulse-flow-api.onrender.com`:

| Operation           | Method   | Target Path                                        | Payload                                              |
| ------------------- | -------- | -------------------------------------------------- | ---------------------------------------------------- |
| Fetch all routines  | `GET`    | `/`                                                | None                                                 |
| Fetch routine by ID | `GET`    | `/:routineId`                                      | None                                                 |
| Fetch habit by ID   | `GET`    | `/:routineId/habits/:habitId`                      | None                                                 |
| Fetch sub-task by ID| `GET`    | `/:routineId/habits/:habitId/sub-tasks/:subTaskId` | None                                                 |
| Create routine      | `POST`   | `/`                                                | `{ ...routineDTO, date: "YYYY-MM-DD" }`              |
| Create habit        | `POST`   | `/:routineId/habits`                               | `{ ...habitDTO, date: "YYYY-MM-DD" }`                |
| Create sub-task     | `POST`   | `/:routineId/habits/:habitId/sub-tasks`            | `{ ...subTaskDTO, date: "YYYY-MM-DD" }`              |
| Patch routine       | `PATCH`  | `/:routineId`                                      | `{ title: string }`                                  |
| Patch habit         | `PATCH`  | `/:routineId/habits/:habitId`                      | `{ title?: string, category?: Category }`            |
| Patch sub-task      | `PATCH`  | `/:routineId/habits/:habitId/sub-tasks/:subTaskId` | `{ title: string }`                                  |
| Delete routine      | `DELETE` | `/:routineId`                                      | `{ date: "YYYY-MM-DD" }`                             |
| Delete habit        | `DELETE` | `/:routineId/habits/:habitId`                      | `{ date: "YYYY-MM-DD" }`                             |
| Delete sub-task     | `DELETE` | `/:routineId/habits/:habitId/sub-tasks/:subTaskId` | `{ date: "YYYY-MM-DD" }`                             |
| Toggle daily status | `POST`   | `.../toggle-date`                                  | `{ date: "YYYY-MM-DD" }`                             |

Mutating requests automatically trigger cache invalidation on `["routines"]` queries via TanStack Query, prompting immediate re-render with fresh data.

## Error handling and feedback

- Responses outside the 200-299 status range are converted into instances of `StatefulError`, preserving `code`, HTTP `status`, `message`, and the optional validation `appendix`.
- `handleFormError` correlates backend validation errors (`appendix.zodErrors`) directly to React Hook Form inputs using `setError`, highlighting individual invalid fields.
- API error codes (e.g. `ROUTINE_NOT_FOUND`, `DUPLICATE_HABIT_TITLE`, `DATABASE_CONNECTION_FAILED`) are mapped to localized user-friendly messages through `API_MESSAGES`.
- Toast notifications (`react-toastify`) provide visual confirmation of completed actions and feedback on network failures.
- Unhandled routing errors, missing resources, and query failures display the `Fallback` component with a reload or return action.

## Design system and theming

The application uses Tailwind CSS v4 configured in `src/assets/styles/tailwindcss.style.css` via the `@theme` directive:

- **Theme Palette**: Dark-mode focused theme featuring `#0f1115` (background), `#181a20` (surface), `#2a2e39` (border), `#4ade80` (primary green), `#f97316` (streak orange), `#eab308` (pending yellow), and `#ef4444` (danger red).
- **Typography**: Inter font with structured weight and modular scale definitions.
- **Custom Breakpoints**:
  - `bp-min`: `320px` (ultra-compact mobile screens)
  - `bp-sm`: `450px` (modal card conversion threshold)
  - `bp-lg`: `950px` (desktop layout)

## Build and preview

Compile the TypeScript project and generate the production assets:

```bash
npm run build
```

The optimized bundle is written to the `dist/` directory. Preview the production build locally:

```bash
npm run preview
```
