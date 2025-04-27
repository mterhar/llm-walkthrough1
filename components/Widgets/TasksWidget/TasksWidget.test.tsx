import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TasksWidget } from '.';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock fetch responses
const mockFetchResponse = (data: any, status = 200) => {
  return Promise.resolve({
    json: () => Promise.resolve({ data, status }),
    status,
  });
};

describe('TasksWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches tasks', async () => {
    // Mock the initial fetch call to get tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([
        { id: '1', text: 'Test task 1', completed: false, priority: 'high' },
        { id: '2', text: 'Test task 2', completed: true, priority: 'medium' }
      ])
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Check if loading state shows up
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test task 1')).toBeInTheDocument();
    });
  });

  it('should open modal when add button is clicked', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([])
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click the add button
    fireEvent.click(screen.getByText('Add New Task'));
    
    // Modal should be visible
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Description')).toBeInTheDocument();
  });

  it('should handle add task from modal', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([])
    );
    
    // Mock the POST request for adding a task
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse(
        { id: '3', text: 'New task', completed: false, priority: 'medium' },
        201
      )
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Open the modal
    fireEvent.click(screen.getByText('Add New Task'));
    
    // Type in new task in the modal
    const input = screen.getByLabelText('Task Description');
    fireEvent.change(input, { target: { value: 'New task' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Task'));
    
    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringMatching(/New task/),
    });
    
    // Wait for new task to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New task')).toBeInTheDocument();
    });
  });

  it('should handle toggle complete', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([
        { id: '1', text: 'Test task 1', completed: false, priority: 'high' }
      ])
    );
    
    // Mock the PATCH request for updating a task
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse(
        { id: '1', text: 'Test task 1', completed: true, priority: 'high' }
      )
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test task 1')).toBeInTheDocument();
    });
    
    // Find and click the checkbox for the first task
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1',
        completed: true,
      }),
    });
    
    // Check if the task is now marked as completed
    await waitFor(() => {
      const taskText = screen.getByText('Test task 1');
      expect(taskText.classList.contains('line-through')).toBe(true);
    });
  });

  it('should handle delete task', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([
        { id: '1', text: 'Test task 1', completed: false, priority: 'high' },
        { id: '2', text: 'Test task 2', completed: true, priority: 'medium' }
      ])
    );
    
    // Mock the DELETE request
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({ status: 204 }));
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test task 1')).toBeInTheDocument();
    });
    
    // Find and click delete button for the first task
    const deleteButtons = screen.getAllByRole('button', { name: '' });
    // Find the delete button (the one with SVG)
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg') && !button.classList.contains('hover:text-gray-700')
    );
    
    fireEvent.click(deleteButton!);
    
    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/todos?id=1', {
      method: 'DELETE',
    });
    
    // After deletion, we should only have one task left
    await waitFor(() => {
      expect(screen.queryByText('Test task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test task 2')).toBeInTheDocument();
    });
  });

  it('renders empty state when no tasks exist', async () => {
    // Mock the GET request to return empty array
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([])
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/)).toBeInTheDocument();
    });
  });

  it('should call onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn();
    
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([])
    );
    
    render(<TasksWidget id="tasks-1" onClose={onCloseMock} />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Find and click the close button
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    // Check if onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });
}); 