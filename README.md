# React Projects

Welcome to my repository dedicated to building and storing **React** applications! This repository serves as a practical, hands-on laboratory for exploring modern frontend development, mastering component architecture, and applying best practices as I progress through the React ecosystem under a "build-to-learn" approach.

## 🚀 Repository Overview

Each directory inside this repository represents an independent React application initialized using **Vite** as the build tool. Every project is isolated and contains its own dependencies, scripts, and dedicated `README.md` explaining its specific domain and implementation details.

### 📁 Project Structure

The project follows a modular, directory-based structure. Here is a visual mapping of the current repository layout:

```text
react/
├── .gitignore               # Root git ignore definitions
├── LICENSE                  # Repository open-source license
└── devlinks-dashboard/     # React application built with Vite
    ├── src/                 # Application source code (components, hooks, pages)
    ├── public/              # Static assets
    ├── README.md            # Specific project details and context
    ├── index.html           # Vite entry HTML
    ├── package.json         # Project scripts and dependencies
    ├── tsconfig.json        # TypeScript configuration
    └── vite.config.ts       # Vite bundler configuration

```

---

## 🔑 Core Files per Project Directory

When exploring any project subdirectory (such as `devlinks-dashboard/`), the key files to note are:

1. 📝 **`README.md`**: Contains the specific project description, architectural decisions, feature breakdown, and instructions unique to that app.
2. ⚡ **`vite.config.ts`**: The bundler configuration file optimizing the dev server, plugins, and build outputs.
3. 📦 **`package.json`**: Defines local dependencies, package scripts (`dev`, `build`, `preview`), and version requirements.

---

## 🛠️ Getting Started & How to Run

To explore and run any React application locally, ensure you have **Node.js** and **npm** (or **Yarn** / **pnpm**) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/joao-gustavo-silva-lima/react.git
cd react

```

### 2. Navigate to a Project Directory

Select a project folder from the root repository:

```bash
cd devlinks-dashboard

```

### 3. Install Dependencies

Install all required packages for the specific project:

```bash
npm install

```

### 4. Run the Local Development Server

Launch Vite's fast development server:

```bash
npm run dev

```

Open the URL displayed in your terminal (typically `http://localhost:5173`) to interact with the application.

### 5. Build for Production

To create an optimized production build:

```bash
npm run build

```

---

## 📈 Goals

- **Modern Component Architecture**: Mastering functional components, custom hooks, state management, and lifecycle patterns.
- **Fast Development Experience**: Leveraging **Vite** for rapid HMR (Hot Module Replacement) and optimized bundling.
- **Progressive Learning**: Building real-world interfaces and full-featured applications to incrementally master React concepts.
- **Clean Code & Tooling**: Enforcing strict type safety, modular structures, and scalable code organization across all projects.

Enjoy Coding! 🚀
