# Personal Dashboard

Web application with widgets for weather, tasks, news, and motivational quotes.

## Personal Dashboard Functionality Checklist

Core Functionality

[x] Customizable widget layout (drag and drop)
[x] User preference saving
[x] Responsive design for all devices
[x] Quick loading time

Weather Widget

[x] Current conditions with visual icons
[x] Daily forecast (5-7 days)
[x] Location detection or manual entry
[x] Weather alerts

Task Widget

[x] Add/edit/delete tasks
[x] Priority levels
[x] Due dates and reminders
[x] Progress tracking

News Widget

[x] Personalized feed based on interests
[x] Headlines with previews
[x] Source filtering
[x] Save articles for later

Motivational Quotes

[x] Daily rotation
[x] Save favorites
[x] Categories (success, creativity, etc.)
[x] Share functionality

Enhancement Features

[x] Dark/light mode toggle
[x] Widget size adjustment
[x] Data persisted by user
[x] Simple onboarding tutorial

## Approach
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
