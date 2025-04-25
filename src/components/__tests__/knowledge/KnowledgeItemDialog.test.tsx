import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KnowledgeItemDialog } from '../../knowledge/KnowledgeItemDialog';
import { knowledgeApi } from '../../../api/apiClient';

// Mock the API
jest.mock('../../../api/apiClient', () => ({
  knowledgeApi: {
    updateKnowledgeItem: jest.fn()
  }
}));

describe('KnowledgeItemDialog', () => {
  const mockTextItem = {
    id: 'test-id-1',
    auditorId: 'auditor-1',
    type: 'text' as const,
    content: 'Test content',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-20T10:30:00Z'
  };

  const mockTextFile = {
    id: 'test-id-2',
    auditorId: 'auditor-1',
    type: 'file' as const,
    content: 'Test file content',
    filename: 'test.txt',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-20T10:30:00Z'
  };

  const mockPdfFile = {
    id: 'test-id-3',
    auditorId: 'auditor-1',
    type: 'file' as const,
    content: 'Mock PDF content',
    filename: 'test.pdf',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-20T10:30:00Z'
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (knowledgeApi.updateKnowledgeItem as jest.Mock).mockResolvedValue({
      ...mockTextItem,
      content: 'Updated content',
      updatedAt: '2025-04-21T10:30:00Z'
    });
  });

  it('renders text item content correctly', () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextItem}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Text Entry')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-item-content')).toHaveValue('Test content');
  });

  it('renders text file content correctly', () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextFile}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-item-content')).toHaveValue('Test file content');
  });

  it('allows editing for text items and text files', () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextItem}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const textField = screen.getByTestId('knowledge-item-content');
    expect(textField).not.toBeDisabled();
    
    fireEvent.change(textField, { target: { value: 'Updated content' } });
    expect(textField).toHaveValue('Updated content');
  });

  it('disables editing for non-text files', () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockPdfFile}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByTestId('knowledge-item-content')).toBeDisabled();
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextItem}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('saves changes when save button is clicked', async () => {
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextItem}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const textField = screen.getByTestId('knowledge-item-content');
    fireEvent.change(textField, { target: { value: 'Updated content' } });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(knowledgeApi.updateKnowledgeItem).toHaveBeenCalledWith(
        'test-id-1',
        expect.objectContaining({
          content: 'Updated content'
        })
      );
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    (knowledgeApi.updateKnowledgeItem as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(
      <KnowledgeItemDialog
        open={true}
        item={mockTextItem}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    fireEvent.change(screen.getByTestId('knowledge-item-content'), { 
      target: { value: 'Updated content' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to save changes/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
