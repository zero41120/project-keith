import { KnowledgeItem } from '../types/knowledge';
import { Message, MessageStatus, RefinementInput } from '../types/message';

// Environment variable to toggle between real and mock API
// In a real app, this would be set in .env files for different environments
const USE_MOCK_API = true;

// Base API URL
const API_BASE_URL = 'https://api.example.com';

// Helper function to determine if we should use mock API
export const useMockApi = (): boolean => {
  return USE_MOCK_API;
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Knowledge Base API functions
export const knowledgeApi = {
  // Get all knowledge items for an auditor
  getKnowledgeItems: async (auditorId: string): Promise<KnowledgeItem[]> => {
    if (useMockApi()) {
      // Import mock dynamically to avoid loading in production
      const { getKnowledgeItems } = await import('./__mocks__/knowledgeApi');
      return getKnowledgeItems(auditorId);
    }
    
    return fetchApi<KnowledgeItem[]>(`/knowledge-items?auditorId=${auditorId}`);
  },

  // Add a new knowledge item
  addKnowledgeItem: async (item: Omit<KnowledgeItem, 'id'>): Promise<KnowledgeItem> => {
    if (useMockApi()) {
      const { addKnowledgeItem } = await import('./__mocks__/knowledgeApi');
      return addKnowledgeItem(item);
    }
    
    return fetchApi<KnowledgeItem>('/knowledge-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  // Delete a knowledge item
  deleteKnowledgeItem: async (id: string): Promise<void> => {
    if (useMockApi()) {
      const { deleteKnowledgeItem } = await import('./__mocks__/knowledgeApi');
      return deleteKnowledgeItem(id);
    }
    
    return fetchApi<void>(`/knowledge-items/${id}`, {
      method: 'DELETE',
    });
  },

  // Update a knowledge item
  updateKnowledgeItem: async (id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
    if (useMockApi()) {
      const { updateKnowledgeItem } = await import('./__mocks__/knowledgeApi');
      return updateKnowledgeItem(id, updates);
    }
    
    return fetchApi<KnowledgeItem>(`/knowledge-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

// Message API functions
export const messageApi = {
  // Get all messages for an auditor with optional status filter
  getMessages: async (auditorId: string, status?: MessageStatus): Promise<Message[]> => {
    if (useMockApi()) {
      const { getMessages } = await import('./__mocks__/messageApi');
      return getMessages(auditorId, status);
    }
    
    const endpoint = status 
      ? `/messages?auditorId=${auditorId}&status=${status}`
      : `/messages?auditorId=${auditorId}`;
    
    return fetchApi<Message[]>(endpoint);
  },

  // Get a single message by ID
  getMessage: async (id: string): Promise<Message> => {
    if (useMockApi()) {
      const { getMessage } = await import('./__mocks__/messageApi');
      return getMessage(id);
    }
    
    return fetchApi<Message>(`/messages/${id}`);
  },

  // Update message status
  updateMessageStatus: async (id: string, status: MessageStatus): Promise<Message> => {
    if (useMockApi()) {
      const { updateMessageStatus } = await import('./__mocks__/messageApi');
      return updateMessageStatus(id, status);
    }
    
    return fetchApi<Message>(`/messages/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Regenerate response with refinement
  regenerateResponse: async (refinement: RefinementInput): Promise<Message> => {
    if (useMockApi()) {
      const { regenerateResponse } = await import('./__mocks__/messageApi');
      return regenerateResponse(refinement);
    }
    
    return fetchApi<Message>(`/messages/${refinement.messageId}/regenerate`, {
      method: 'POST',
      body: JSON.stringify({ guidance: refinement.guidance }),
    });
  },
};

// Export a function to explicitly toggle mock mode (useful for development/testing)
export const setUseMockApi = (useMock: boolean): void => {
  // In a real app, this might set a localStorage value or update a context
  // For simplicity, we'll just set a window property
  (window as any).USE_MOCK_API = useMock;
  
  // Override the useMockApi function
  (window as any).useMockApiOverride = useMock;
};

// Export the entire API client
export default {
  knowledge: knowledgeApi,
  messages: messageApi,
};
