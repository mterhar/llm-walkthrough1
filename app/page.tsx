import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="z-10 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-4">
          Personal Dashboard
        </h1>
        
        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
          A customizable dashboard with widgets for weather, tasks, news, and motivational quotes.
          Built with Next.js, React, TypeScript, and Tailwind CSS.
        </p>
        
        <Dashboard />
      </div>
    </main>
  );
}
