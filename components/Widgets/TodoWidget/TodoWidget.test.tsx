import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoWidget } from '.';

// Mock the fetch API
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

// Helper function to set up mockFetch response
function mockFetchResponse(status: number, data: Record<string, unknown>) {
  mockFetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(data),
    status
  } as unknown as Response);
}

describe('TodoWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the initial fetch call to get todos
    mockFetchResponse(200, {
      status: 200,
      data: [
        { id: '1', text: 'Test todo 1', completed: false, priority: 'high' },
        { id: '2', text: 'Test todo 2', completed: true, priority: 'medium' }
      ]
    });
  });

  it('renders the widget with title', async () => {
    await act(async () => {
      render(<TodoWidget id="todo-1" />);
    });
    
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    });
  });

  it('should handle add todo', async () => {
    // Mock the POST request for adding a todo
    mockFetchResponse(201, {
      status: 201,
      data: { id: '3', text: 'New todo', completed: false, priority: 'medium' }
    });

    await act(async () => {
      render(<TodoWidget id="todo-1" />);
    });
    
    // Wait for initial todos to load
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    });
    
    // Type in new todo
    await act(async () => {
      const input = screen.getByPlaceholderText('Add a new task...');
      fireEvent.change(input, { target: { value: 'New todo' } });
    });
    
    // Click add button
    await act(async () => {
      const addButton = screen.getByText('Add Task');
      fireEvent.click(addButton);
    });
    
    // Verify fetch was called with correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringMatching(/New todo/),
      });
    });
    
    // Wait for new todo to appear in the list
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBe(3);
    });
  });

  it('should handle toggle complete', async () => {
    // Mock the PATCH request for updating a todo
    mockFetchResponse(200, {
      status: 200,
      data: { id: '1', text: 'Test todo 1', completed: true, priority: 'high' }
    });

    await act(async () => {
      render(<TodoWidget id="todo-1" />);
    });
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    });
    
    // Find and click the checkbox for the first todo
    await act(async () => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
    });
    
    // Verify fetch was called correctly
    await waitFor(() => {
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
    });
  });

  it('should handle delete todo', async () => {
    // Mock the DELETE request
    mockFetchResponse(204, {});

    await act(async () => {
      render(<TodoWidget id="todo-1" />);
    });
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    });
    
    // Find and click delete button for the first todo
    await act(async () => {
      const deleteButtons = screen.getAllByText('', { selector: 'button svg' });
      fireEvent.click(deleteButtons[0]);
    });
    
    // Verify fetch was called correctly
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/todos?id=1', {
        method: 'DELETE',
      });
    });
    
    // After deletion, we should only have one todo left
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBe(1);
    });
  });

  it('renders empty state when no todos exist', async () => {
    // Mock empty response
    mockFetch.mockReset();
    mockFetchResponse(200, {
      status: 200,
      data: []
    });

    await act(async () => {
      render(<TodoWidget id="todo-1" />);
    });
    
    // Should show the empty state
    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onCloseMock = jest.fn();
    
    await act(async () => {
      render(<TodoWidget id="todo-1" onClose={onCloseMock} />);
    });
    
    await act(async () => {
      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);
    });
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
}); 