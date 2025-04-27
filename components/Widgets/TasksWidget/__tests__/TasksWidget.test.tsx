import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TasksWidget } from '..';
import { TaskItem } from '@/lib/types';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to mock fetch responses
const mockFetchResponse = (data: TaskItem[] | TaskItem, status = 200) => {
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
    
    // Initially, modal should not be visible
    expect(screen.queryByText('Add New Task', { selector: 'h3' })).not.toBeInTheDocument();
    
    // Click the add button
    fireEvent.click(screen.getByRole('button', { name: 'Add New Task' }));
    
    // Modal should be visible
    expect(screen.getByText('Add New Task', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Task Description')).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([])
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: 'Add New Task' }));
    
    // Modal should be visible
    expect(screen.getByText('Add New Task', { selector: 'h3' })).toBeInTheDocument();
    
    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText('Add New Task', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  it('should add task from modal', async () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Add New Task' }));
    
    // Type in new task in the modal
    const input = screen.getByLabelText('Task Description');
    fireEvent.change(input, { target: { value: 'New task' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Task'));
    
    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringMatching(/New task/),
    });
    
    // Wait for new task to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New task')).toBeInTheDocument();
      // Modal should be closed
      expect(screen.queryByText('Add New Task', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  it('should toggle task completion status', async () => {
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
    expect(global.fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1',
        completed: true,
      }),
    });
  });

  it('should delete a task', async () => {
    // Mock the GET request for tasks
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse([
        { id: '1', text: 'Test task 1', completed: false, priority: 'high' }
      ])
    );
    
    // Mock the DELETE request
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({ status: 204 })
    );
    
    render(<TasksWidget id="tasks-1" />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test task 1')).toBeInTheDocument();
    });
    
    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete task' });
    fireEvent.click(deleteButton);
    
    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/tasks?id=1', {
      method: 'DELETE',
    });
  });

  it('should show empty state when no tasks exist', async () => {
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