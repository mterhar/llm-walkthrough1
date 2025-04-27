'use client';

import { useState, useEffect } from 'react';
import { TodoItem, WidgetProps } from '@/lib/types';

export function TodoWidget({ id, onClose }: WidgetProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      if (data.status === 200 && data.data) {
        setTodos(data.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodo,
          priority,
          dueDate: dueDate || undefined,
        }),
      });
      
      const data = await response.json();
      if (data.status === 201 && data.data) {
        setTodos([...todos, data.data]);
        setNewTodo('');
        setPriority('medium');
        setDueDate('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          completed: !todo.completed,
        }),
      });
      
      const data = await response.json();
      if (data.status === 200) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
        />
        
        <div className="flex space-x-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={handleAddTodo}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow">
          {todos.length > 0 ? (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li 
                  key={todo.id}
                  className="flex items-start p-3 border border-gray-200 rounded shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="mt-1 h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-grow">
                    <div className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.text}
                    </div>
                    <div className="flex mt-1 text-xs space-x-2">
                      {todo.priority && (
                        <span className={`px-2 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      )}
                      {todo.dueDate && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
          )}
        </div>
      )}
    </div>
  );
} 