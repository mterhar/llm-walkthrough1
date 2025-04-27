import { GET, POST, DELETE, PATCH } from './route';
import { NextRequest, NextResponse } from 'next/server';

describe('Todos API', () => {
  
  // Create a mock NextRequest
  const createRequest = (method: string, body: any = null, searchParams: Record<string, string> = {}) => {
    const url = new URL('https://example.com/api/todos');
    
    // Add search params if provided
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const request = {
      method,
      url: url.toString(),
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest;
    
    return request;
  };

  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const request = createRequest('GET');
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });
    
    it('should filter todos by userId', async () => {
      // First, create a todo with a specific userId
      const postRequest = createRequest('POST', { 
        text: 'User-specific todo', 
        userId: 'user123' 
      });
      
      await POST(postRequest);
      
      // Then try to fetch todos with that userId
      const getRequest = createRequest('GET', null, { userId: 'user123' });
      const response = await GET(getRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.data.every((todo: any) => todo.userId === 'user123')).toBe(true);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const request = createRequest('POST', { 
        text: 'Test todo',
        priority: 'high',
        dueDate: '2023-12-31'
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.status).toBe(201);
      expect(data.data.text).toBe('Test todo');
      expect(data.data.priority).toBe('high');
      expect(data.data.dueDate).toBe('2023-12-31');
      expect(data.data.completed).toBe(false);
      expect(data.data.id).toBeDefined();
    });
    
    it('should return 400 if text is missing', async () => {
      const request = createRequest('POST', {});
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('PATCH /api/todos', () => {
    it('should update an existing todo', async () => {
      // First create a todo
      const postRequest = createRequest('POST', { text: 'Todo to update' });
      const postResponse = await POST(postRequest);
      const postData = await postResponse.json();
      const todoId = postData.data.id;
      
      // Then update it
      const patchRequest = createRequest('PATCH', { 
        id: todoId,
        text: 'Updated todo',
        completed: true,
        priority: 'low'
      });
      
      const patchResponse = await PATCH(patchRequest);
      const patchData = await patchResponse.json();
      
      expect(patchResponse.status).toBe(200);
      expect(patchData.data.id).toBe(todoId);
      expect(patchData.data.text).toBe('Updated todo');
      expect(patchData.data.completed).toBe(true);
      expect(patchData.data.priority).toBe('low');
    });
    
    it('should return 400 if id is missing', async () => {
      const request = createRequest('PATCH', { text: 'No ID provided' });
      
      const response = await PATCH(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.status).toBe(400);
    });
    
    it('should return 404 if todo is not found', async () => {
      const request = createRequest('PATCH', { id: 'non-existent-id' });
      
      const response = await PATCH(request);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.status).toBe(404);
    });
  });

  describe('DELETE /api/todos', () => {
    it('should delete a todo', async () => {
      // First create a todo
      const postRequest = createRequest('POST', { text: 'Todo to delete' });
      const postResponse = await POST(postRequest);
      const postData = await postResponse.json();
      const todoId = postData.data.id;
      
      // Then delete it
      const deleteRequest = createRequest('DELETE', null, { id: todoId });
      const deleteResponse = await DELETE(deleteRequest);
      
      expect(deleteResponse.status).toBe(204);
      
      // Verify it's gone
      const getRequest = createRequest('GET');
      const getResponse = await GET(getRequest);
      const getData = await getResponse.json();
      
      expect(getData.data.find((todo: any) => todo.id === todoId)).toBeUndefined();
    });
    
    it('should return 400 if id is missing', async () => {
      const request = createRequest('DELETE');
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.status).toBe(400);
    });
    
    it('should return 404 if todo is not found', async () => {
      const request = createRequest('DELETE', null, { id: 'non-existent-id' });
      
      const response = await DELETE(request);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.status).toBe(404);
    });
  });
}); 