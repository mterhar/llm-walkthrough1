import { NextRequest, NextResponse } from 'next/server';
import { TaskItem } from '@/lib/types';

// Mock data - in a real app this would be in a database
let tasks: TaskItem[] = [
  { id: '1', text: 'Learn Next.js', completed: false, priority: 'high' },
  { id: '2', text: 'Build a Tasks App', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: '3', text: 'Deploy to Vercel', completed: false, priority: 'low', dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0] },
];

export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  let filteredTasks = tasks;
  
  // If userId is provided, filter tasks for that user
  if (userId) {
    filteredTasks = tasks.filter(task => task.userId === userId);
  }
  
  return NextResponse.json({
    data: filteredTasks,
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
    
    // Create new task
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: body.text,
      completed: false,
      userId: body.userId,
      // Add support for priority and due date
      ...(body.priority && { priority: body.priority }),
      ...(body.dueDate && { dueDate: body.dueDate }),
    };
    
    // Add to "database"
    tasks.push(newTask);
    
    return NextResponse.json({
      data: newTask,
      status: 201
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating task:', error);
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
      error: 'Task ID is required',
      status: 400
    }, { status: 400 });
  }
  
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  
  if (tasks.length === initialLength) {
    return NextResponse.json({
      error: 'Task not found',
      status: 404
    }, { status: 404 });
  }
  
  return NextResponse.json({
    data: null,
    status: 200
  }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.id) {
      return NextResponse.json({
        error: 'Task ID is required',
        status: 400
      }, { status: 400 });
    }
    
    const taskIndex = tasks.findIndex(task => task.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({
        error: 'Task not found',
        status: 404
      }, { status: 404 });
    }
    
    // Update task with all possible fields
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...(body.text !== undefined && { text: body.text }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
    };
    
    return NextResponse.json({
      data: tasks[taskIndex],
      status: 200
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({
      error: 'Failed to process request',
      status: 500
    }, { status: 500 });
  }
} 