# CYOA Game - React + TypeScript + Axios + Zustand

A simple React application demonstrating the use of TypeScript, Axios for API calls, and Zustand for state management.

## Features

- **React 18** with TypeScript
- **Axios** for HTTP requests to JSONPlaceholder API
- **Zustand** for lightweight state management
- **Vite** for fast development and building
- **ESLint** for code linting

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## How It Works

1. **UserList Component**: Fetches users from JSONPlaceholder API using Axios and displays them in a list
2. **PostList Component**: Shows posts for the selected user, with the ability to add new posts
3. **Zustand Store**: Manages global state including users, posts, loading states, and errors
4. **TypeScript**: Provides type safety throughout the application

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Zustand** - State management
- **Vite** - Build tool and dev server
- **ESLint** - Code linting