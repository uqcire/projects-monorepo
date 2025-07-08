# Basketball Stats App

Welcome to the **Project Development Environment – Daisy UI** repository. This project is designed to provide a streamlined development environment utilizing Vue.js, Vite, and DaisyUI, among other tools and libraries.

## Project Overview

This environment is configured to support efficient development with a focus on modern frontend technologies. It integrates Vue.js for building user interfaces, Vite for rapid development and bundling, and DaisyUI for a utility-first CSS framework.

## Features

- **Vue.js 3.5.13**: Progressive JavaScript framework for building user interfaces.
- **Vite 6.0.11**: Next-generation frontend tooling for rapid development.
- **DaisyUI 5.0.0-beta.6**: Tailwind CSS components plugin for building responsive interfaces.
- **Pinia 2.3.1**: Intuitive state management for Vue.js.
- **Vue Router 4.5.0**: Official router for Vue.js for single-page application navigation.
- **Axios 1.7.9**: Promise-based HTTP client for the browser and Node.js.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher.
- **pnpm**: Version 9.15.4 or higher.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/project-development-environment--daisy-ui.git
   cd project-development-environment--daisy-ui
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

### Available Scripts

- **Start Development Server**:

  ```bash
  pnpm dev
  ```

  Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **Build for Production**:

  ```bash
  pnpm build
  ```

  Builds the app for production to the `dist` folder.

- **Preview Production Build**:

  ```bash
  pnpm preview
  ```

  Serves the production build locally for previewing.

- **Lint Code**:

  ```bash
  pnpm lint
  ```

  Lints the codebase using ESLint.

- **Fix Lint Issues**:

  ```bash
  pnpm lint:fix
  ```

  Automatically fixes linting issues.

- **Commit Changes**:

  ```bash
  pnpm cz
  ```

  Uses Commitizen for standardized commit messages.

## Dependencies

The project relies on the following main dependencies:

- **Vue.js**: `^3.5.13`
- **Vite**: `^6.0.11`
- **Pinia**: `^2.3.1`
- **Vue Router**: `^4.5.0`
- **Axios**: `^1.7.9`

For a complete list, refer to the `package.json` file.

## Development Tools

The development environment is equipped with the following tools:

- **ESLint**: For code linting and maintaining code quality.
- **Commitizen**: To standardize commit messages.
- **Husky**: For managing Git hooks.
- **Lint-Staged**: To run linters on staged Git files.
- **Tailwind CSS**: Utility-first CSS framework.
- **DaisyUI**: Tailwind CSS components plugin.
- **Unplugin Auto Import**: For automatic imports in Vue.js.
- **Unplugin Vue Components**: For on-demand component loading.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
