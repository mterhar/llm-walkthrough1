# Next.js Todo App

## Project Description
A simple, modern Todo application built with Next.js, React, TypeScript, and Tailwind CSS. This application demonstrates best practices for building web applications using the latest technologies.

## Features
- Create, read, update, and delete todo items
- Mark todos as complete
- Responsive design for all screen sizes
- Server API endpoints for todo management
- TypeScript for type safety
- Modern UI with Tailwind CSS

## Tech Stack
- Next.js with App Router
- React 19
- TypeScript
- Tailwind CSS
- Jest for testing
- Deployed on Vercel

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Routes

The application provides the following API routes:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `DELETE /api/todos?id=123` - Delete a todo by ID
- `PATCH /api/todos` - Update a todo

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions, hooks, and types
- `/public` - Static assets

## Testing

To run the tests:

```bash
npm test
```

## Deployment

This application is optimized for deployment on Vercel. Simply connect your GitHub repository to Vercel for continuous deployment.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
