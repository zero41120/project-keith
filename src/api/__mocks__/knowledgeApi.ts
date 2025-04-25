import { KnowledgeItem } from '../../types/knowledge';
import { v4 as uuidv4 } from 'uuid';

// Mock data store
let mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    auditorId: 'auditor-1',
    type: 'file',
    content: 'Mock PDF content',
    filename: 'tax-guidelines-2025.pdf',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-20T10:30:00Z'
  },
  {
    id: '2',
    auditorId: 'auditor-1',
    type: 'text',
    content: 'Important financial advice regarding retirement accounts and tax implications.',
    createdAt: '2025-04-22T14:15:00Z',
    updatedAt: '2025-04-22T14:15:00Z'
  },
  {
    id: '3',
    auditorId: 'auditor-1',
    type: 'file',
    content: 'Mock DOCX content',
    filename: 'investment-strategies.docx',
    createdAt: '2025-04-23T09:45:00Z',
    updatedAt: '2025-04-23T09:45:00Z'
  },
  {
    id: '4',
    auditorId: 'auditor-2',
    type: 'text',
    content: 'Guidelines for handling client inquiries about cryptocurrency investments.',
    createdAt: '2025-04-24T11:20:00Z',
    updatedAt: '2025-04-24T11:20:00Z'
  }
];

// Get all knowledge items for an auditor
export const getKnowledgeItems = async (auditorId: string): Promise<KnowledgeItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockKnowledgeItems.filter(item => item.auditorId === auditorId);
};

// Add a new knowledge item
export const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id'>): Promise<KnowledgeItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date().toISOString();
  const newItem: KnowledgeItem = {
    ...item,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  mockKnowledgeItems.push(newItem);
  return newItem;
};

// Delete a knowledge item
export const deleteKnowledgeItem = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockKnowledgeItems = mockKnowledgeItems.filter(item => item.id !== id);
};

// Update a knowledge item
export const updateKnowledgeItem = async (id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const itemIndex = mockKnowledgeItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    throw new Error(`Knowledge item with id ${id} not found`);
  }
  
  const updatedItem = {
    ...mockKnowledgeItems[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  mockKnowledgeItems[itemIndex] = updatedItem;
  return updatedItem;
};

// Reset mock data (useful for testing)
export const resetMockData = (): void => {
  mockKnowledgeItems = [
    {
      id: '1',
      auditorId: 'auditor-1',
      type: 'file',
      content: 'Mock PDF content',
      filename: 'tax-guidelines-2025.pdf',
      createdAt: '2025-04-20T10:30:00Z',
      updatedAt: '2025-04-20T10:30:00Z'
    },
    {
      id: '2',
      auditorId: 'auditor-1',
      type: 'text',
      content: 'Important financial advice regarding retirement accounts and tax implications.',
      createdAt: '2025-04-22T14:15:00Z',
      updatedAt: '2025-04-22T14:15:00Z'
    },
    {
      id: '3',
      auditorId: 'auditor-1',
      type: 'file',
      content: 'Mock DOCX content',
      filename: 'investment-strategies.docx',
      createdAt: '2025-04-23T09:45:00Z',
      updatedAt: '2025-04-23T09:45:00Z'
    },
    {
      id: '4',
      auditorId: 'auditor-2',
      type: 'text',
      content: 'Guidelines for handling client inquiries about cryptocurrency investments.',
      createdAt: '2025-04-24T11:20:00Z',
      updatedAt: '2025-04-24T11:20:00Z'
    }
  ];
};
