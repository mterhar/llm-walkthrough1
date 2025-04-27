import { NextRequest } from 'next/server';
import { GET, POST, DELETE, PATCH } from './route';

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation((url) => {
      return {
        url,
        json: jest.fn().mockResolvedValue({})
      };
    }),
    NextResponse: {
      json: jest.fn().mockImplementation((body, options) => {
        return { body, options };
      })
    }
  };
});

describe('Todos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET', () => {
    test('returns all todos when no userId is provided', async () => {
      // Create mock request
      const req = new NextRequest('http://localhost:3000/api/todos');
      
      // Call the API handler
      const response = await GET(req);
      
      // Check the response
      expect(response.body.data.length).toBe(3);
      expect(response.body.status).toBe(200);
    });
    
    test('filters todos by userId when provided', async () => {
      // Update some test data with a userId
      const req = new NextRequest('http://localhost:3000/api/todos?userId=user1');
      
      // Call the API handler
      const response = await GET(req);
      
      // Since our mock data doesn't have userId matching 'user1', should be empty
      expect(response.body.data.length).toBe(0);
    });
  });
  
  describe('POST', () => {
    test('creates a new todo with valid data', async () => {
      // Create mock request with JSON data
      const req = {
        url: 'http://localhost:3000/api/todos',
        json: jest.fn().mockResolvedValue({ text: 'New Todo Item' })
      };
      
      // Call the API handler
      const response = await POST(req as unknown as NextRequest);
      
      // Check the response
      expect(response.body.data.text).toBe('New Todo Item');
      expect(response.body.data.completed).toBe(false);
      expect(response.body.status).toBe(201);
    });
    
    test('returns error with invalid data', async () => {
      // Create mock request with invalid data
      const req = {
        url: 'http://localhost:3000/api/todos',
        json: jest.fn().mockResolvedValue({}) // Missing 'text' field
      };
      
      // Call the API handler
      const response = await POST(req as unknown as NextRequest);
      
      // Check the response
      expect(response.body.error).toBe('Text is required and must be a string');
      expect(response.body.status).toBe(400);
      expect(response.options.status).toBe(400);
    });
  });
  
  describe('DELETE', () => {
    test('deletes a todo with valid ID', async () => {
      // Create mock request with ID param
      const req = new NextRequest('http://localhost:3000/api/todos?id=1');
      
      // Call the API handler
      const response = await DELETE(req);
      
      // Check the response
      expect(response.body.status).toBe(204);
      expect(response.options.status).toBe(204);
    });
    
    test('returns error when no ID is provided', async () => {
      // Create mock request without ID
      const req = new NextRequest('http://localhost:3000/api/todos');
      
      // Call the API handler
      const response = await DELETE(req);
      
      // Check the response
      expect(response.body.error).toBe('Todo ID is required');
      expect(response.body.status).toBe(400);
    });
  });
  
  describe('PATCH', () => {
    test('updates a todo with valid data', async () => {
      // First create a mock request to update a todo with ID 2
      const req = {
        url: 'http://localhost:3000/api/todos',
        json: jest.fn().mockResolvedValue({ 
          id: '2', 
          text: 'Updated Todo Text',
          completed: true
        })
      };
      
      // Call the API handler
      const response = await PATCH(req as unknown as NextRequest);
      
      // Check the response
      expect(response.body.data.text).toBe('Updated Todo Text');
      expect(response.body.data.completed).toBe(true);
      expect(response.body.status).toBe(200);
    });
    
    test('returns error when ID is not found', async () => {
      // Create mock request with non-existent ID
      const req = {
        url: 'http://localhost:3000/api/todos',
        json: jest.fn().mockResolvedValue({ id: 'nonexistent' })
      };
      
      // Call the API handler
      const response = await PATCH(req as unknown as NextRequest);
      
      // Check the response
      expect(response.body.error).toBe('Todo not found');
      expect(response.body.status).toBe(404);
    });
  });
}); 