import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KnowledgeBase } from '../../knowledge/KnowledgeBase';
import { knowledgeApi } from '../../../api/apiClient';

// Mock the API
jest.mock('../../../api/apiClient', () => ({
  knowledgeApi: {
    getKnowledgeItems: jest.fn().mockResolvedValue([]),
    addKnowledgeItem: jest.fn(item => Promise.resolve({ ...item, id: 'mock-id' })),
    updateKnowledgeItem: jest.fn((id, updates) => Promise.resolve({ id, ...updates }))
  }
}));

// Mock the file upload functionality
jest.mock('../../knowledge/FileUploader', () => ({
  FileUploader: ({ onFileUpload }: { onFileUpload: (file: File) => void }) => (
    <div data-testid="file-uploader">
      <button 
        onClick={() => {
          const mockFile = new File(['test content'], 'test-file.pdf', { type: 'application/pdf' });
          onFileUpload(mockFile);
        }}
      >
        Upload File
      </button>
    </div>
  )
}));

// Mock the text entry functionality
jest.mock('../../knowledge/TextEntry', () => ({
  TextEntry: ({ onTextSubmit }: { onTextSubmit: (text: string) => void }) => (
    <div data-testid="text-entry">
      <input data-testid="text-input" />
      <button 
        data-testid="submit-text"
        onClick={() => onTextSubmit('Test knowledge entry')}
      >
        Submit Text
      </button>
    </div>
  )
}));

// Mock the dialog component
jest.mock('../../knowledge/KnowledgeItemDialog', () => ({
  KnowledgeItemDialog: ({ open, item, onClose, onSave }: any) => (
    open ? (
      <div data-testid="knowledge-dialog">
        <div>Dialog for: {item?.filename || 'Text Entry'}</div>
        <div>Content: {typeof item?.content === 'string' ? item.content : 'File content'}</div>
        <button onClick={() => onClose()}>Cancel</button>
        <button 
          onClick={() => {
            if (item) {
              onSave({
                ...item,
                content: 'Updated content',
                updatedAt: new Date().toISOString()
              });
            }
            onClose();
          }}
        >
          Save
        </button>
      </div>
    ) : null
  )
}));

describe('KnowledgeBase', () => {
  const mockAddKnowledgeItem = jest.fn();
  
  beforeEach(() => {
    mockAddKnowledgeItem.mockClear();
    (knowledgeApi.getKnowledgeItems as jest.Mock).mockClear();
    (knowledgeApi.addKnowledgeItem as jest.Mock).mockClear();
    (knowledgeApi.updateKnowledgeItem as jest.Mock).mockClear();
  });
  
  it('renders the knowledge base component with file uploader and text entry', () => {
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} />);
    
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
    expect(screen.getByTestId('text-entry')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-list')).toBeInTheDocument();
  });
  
  it('handles file upload and adds to knowledge list', async () => {
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} />);
    
    const uploadButton = screen.getByText('Upload File');
    await userEvent.click(uploadButton);
    
    expect(mockAddKnowledgeItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'file',
        filename: 'test-file.pdf',
        content: expect.any(File)
      })
    );
    
    // Wait for the knowledge item to be added to the list
    await waitFor(() => {
      expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    });
  });
  
  it('handles text submission and adds to knowledge list', async () => {
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} />);
    
    const submitButton = screen.getByTestId('submit-text');
    await userEvent.click(submitButton);
    
    expect(mockAddKnowledgeItem).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text',
        content: 'Test knowledge entry'
      })
    );
    
    // Wait for the knowledge item to be added to the list
    await waitFor(() => {
      expect(screen.getByText('Test knowledge entry')).toBeInTheDocument();
    });
  });
  
  it('allows filtering of knowledge items', async () => {
    // Mock initial knowledge items
    const initialItems = [
      { id: '1', type: 'file' as const, filename: 'document1.pdf', content: new File([''], 'document1.pdf'), auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' },
      { id: '2', type: 'text' as const, content: 'Important information', auditorId: 'auditor-1', createdAt: '2025-04-22T14:15:00Z', updatedAt: '2025-04-22T14:15:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Check that both items are initially displayed
    expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    expect(screen.getByText(/Important information/)).toBeInTheDocument();
    
    // Filter by file type
    const filterSelect = screen.getByLabelText('Filter by type:');
    
    // Use fireEvent instead of userEvent.selectOptions for MUI Select
    fireEvent.mouseDown(filterSelect);
    const fileOption = screen.getByText('Files');
    fireEvent.click(fileOption);
    
    // Check that only file items are displayed
    expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    expect(screen.queryByText(/Important information/)).not.toBeInTheDocument();
    
    // Filter by text type
    fireEvent.mouseDown(filterSelect);
    const textOption = screen.getByText('Text');
    fireEvent.click(textOption);
    
    // Check that only text items are displayed
    expect(screen.queryByText('document1.pdf')).not.toBeInTheDocument();
    expect(screen.getByText(/Important information/)).toBeInTheDocument();
    
    // Reset filter
    fireEvent.mouseDown(filterSelect);
    const allOption = screen.getByText('All');
    fireEvent.click(allOption);
    
    // Check that all items are displayed again
    expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    expect(screen.getByText(/Important information/)).toBeInTheDocument();
  });
  
  it('allows searching of knowledge items', async () => {
    // Mock initial knowledge items
    const initialItems = [
      { id: '1', type: 'file' as const, filename: 'tax-document.pdf', content: new File([''], 'tax-document.pdf'), auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' },
      { id: '2', type: 'text' as const, content: 'Financial advice', auditorId: 'auditor-1', createdAt: '2025-04-22T14:15:00Z', updatedAt: '2025-04-22T14:15:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Check that both items are initially displayed
    expect(screen.getByText('tax-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('Financial advice')).toBeInTheDocument();
    
    // Search for "tax"
    const searchInput = screen.getByPlaceholderText('Search knowledge base...');
    await userEvent.type(searchInput, 'tax');
    
    // Check that only matching items are displayed
    expect(screen.getByText('tax-document.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Financial advice')).not.toBeInTheDocument();
    
    // Clear search and search for "financial"
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'financial');
    
    // Check that only matching items are displayed
    expect(screen.queryByText('tax-document.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('Financial advice')).toBeInTheDocument();
    
    // Clear search
    await userEvent.clear(searchInput);
    
    // Check that all items are displayed again
    expect(screen.getByText('tax-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('Financial advice')).toBeInTheDocument();
  });

  it('opens dialog when clicking on a text item', async () => {
    const initialItems = [
      { id: '1', type: 'text' as const, content: 'Text content to edit', auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Click on the text item
    const listItem = screen.getByText('Text content to edit').closest('button');
    if (listItem) {
      await userEvent.click(listItem);
    }
    
    // Check that dialog is opened
    expect(screen.getByTestId('knowledge-dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog for: Text Entry')).toBeInTheDocument();
    expect(screen.getByText('Content: Text content to edit')).toBeInTheDocument();
  });

  it('opens dialog when clicking on a txt file', async () => {
    const initialItems = [
      { id: '1', type: 'file' as const, filename: 'document.txt', content: 'Text file content', auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Click on the text file
    const listItem = screen.getByText('document.txt').closest('button');
    if (listItem) {
      await userEvent.click(listItem);
    }
    
    // Check that dialog is opened
    expect(screen.getByTestId('knowledge-dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog for: document.txt')).toBeInTheDocument();
    expect(screen.getByText('Content: Text file content')).toBeInTheDocument();
  });

  it('does not open dialog when clicking on a non-txt file', async () => {
    const initialItems = [
      { id: '1', type: 'file' as const, filename: 'document.pdf', content: new File([''], 'document.pdf'), auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Click on the PDF file
    const listItem = screen.getByText('document.pdf').closest('button');
    if (listItem) {
      await userEvent.click(listItem);
    }
    
    // Check that dialog is not opened
    expect(screen.queryByTestId('knowledge-dialog')).not.toBeInTheDocument();
  });

  it('updates item when saving changes in dialog', async () => {
    const initialItems = [
      { id: '1', type: 'text' as const, content: 'Original content', auditorId: 'auditor-1', createdAt: '2025-04-20T10:30:00Z', updatedAt: '2025-04-20T10:30:00Z' }
    ];
    
    render(<KnowledgeBase onAddKnowledgeItem={mockAddKnowledgeItem} initialItems={initialItems} />);
    
    // Click on the text item
    const listItem = screen.getByText('Original content').closest('button');
    if (listItem) {
      await userEvent.click(listItem);
    }
    
    // Check that dialog is opened
    expect(screen.getByTestId('knowledge-dialog')).toBeInTheDocument();
    
    // Click save button
    await userEvent.click(screen.getByText('Save'));
    
    // Check that dialog is closed and content is updated
    expect(screen.queryByTestId('knowledge-dialog')).not.toBeInTheDocument();
    
    // Wait for the updated content to appear
    await waitFor(() => {
      expect(screen.getByText('Updated content')).toBeInTheDocument();
    });
  });
});
