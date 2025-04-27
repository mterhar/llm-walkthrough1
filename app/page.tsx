import { Todo } from '@/components/Todo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Next.js Todo App
        </h1>
        
        <p className="text-center mb-10 max-w-2xl text-gray-600">
          A simple todo application built with Next.js, React, TypeScript, and Tailwind CSS.
          This app demonstrates best practices for building modern web applications.
        </p>
        
        <div className="w-full max-w-md">
          <Todo />
        </div>
      </div>
    </main>
  );
}
