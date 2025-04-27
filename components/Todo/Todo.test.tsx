import { render, screen, fireEvent } from '@testing-library/react';
import { Todo } from './index';

describe('Todo Component', () => {
  test('renders the todo list heading', () => {
    render(<Todo />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  test('adds a new todo when Add button is clicked', () => {
    render(<Todo />);
    
    // Get the input and button
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add');
    
    // Type in the input and click the add button
    fireEvent.change(input, { target: { value: 'Test Todo Item' } });
    fireEvent.click(addButton);
    
    // Check if the todo was added
    expect(screen.getByText('Test Todo Item')).toBeInTheDocument();
  });

  test('marks a todo as completed when checkbox is clicked', () => {
    render(<Todo />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add');
    fireEvent.change(input, { target: { value: 'Complete Me' } });
    fireEvent.click(addButton);
    
    // Find the checkbox and click it
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Verify the todo has a line-through style (completed)
    const todoText = screen.getByText('Complete Me');
    expect(todoText.className).toContain('line-through');
  });

  test('deletes a todo when Delete button is clicked', () => {
    render(<Todo />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add');
    fireEvent.change(input, { target: { value: 'Delete Me' } });
    fireEvent.click(addButton);
    
    // Verify todo exists
    expect(screen.getByText('Delete Me')).toBeInTheDocument();
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Verify todo no longer exists
    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
  });
}); 