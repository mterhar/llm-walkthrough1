import { NextRequest, NextResponse } from 'next/server';
// import { User } from '@/lib/types';

// Mock data - in a real app this would be in a database
let todos: Array<{
  id: string;
  text: string;
  completed: boolean;
  userId?: string;
}> = [
  { id: '1', text: 'Learn Next.js', completed: false },
  { id: '2', text: 'Build a Todo App', completed: false },
  { id: '3', text: 'Deploy to Vercel', completed: false },
];

export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  let filteredTodos = todos;
  
  // If userId is provided, filter todos for that user
  if (userId) {
    filteredTodos = todos.filter(todo => todo.userId === userId);
  }
  
  return NextResponse.json({
    data: filteredTodos,
    status: 200
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json({
        error: 'Text is required and must be a string',
        status: 400
      }, { status: 400 });
    }
    
    // Create new todo
    const newTodo = {
      id: Date.now().toString(),
      text: body.text,
      completed: false,
      userId: body.userId
    };
    
    // Add to "database"
    todos.push(newTodo);
    
    return NextResponse.json({
      data: newTodo,
      status: 201
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({
      error: 'Failed to process request',
      status: 500
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({
      error: 'Todo ID is required',
      status: 400
    }, { status: 400 });
  }
  
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  
  if (todos.length === initialLength) {
    return NextResponse.json({
      error: 'Todo not found',
      status: 404
    }, { status: 404 });
  }
  
  return NextResponse.json({
    data: null,
    status: 204
  }, { status: 204 });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.id) {
      return NextResponse.json({
        error: 'Todo ID is required',
        status: 400
      }, { status: 400 });
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === body.id);
    
    if (todoIndex === -1) {
      return NextResponse.json({
        error: 'Todo not found',
        status: 404
      }, { status: 404 });
    }
    
    // Update todo
    todos[todoIndex] = {
      ...todos[todoIndex],
      ...(body.text !== undefined && { text: body.text }),
      ...(body.completed !== undefined && { completed: body.completed }),
    };
    
    return NextResponse.json({
      data: todos[todoIndex],
      status: 200
    });
    
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({
      error: 'Failed to process request',
      status: 500
    }, { status: 500 });
  }
} 