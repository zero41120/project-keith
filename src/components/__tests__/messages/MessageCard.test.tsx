import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageCard } from '../../messages/MessageCard';
import { Message } from '../../../types/message';

describe('MessageCard', () => {
  const mockMessage: Message = {
    id: '1',
    customerId: 'customer-1',
    auditorId: 'auditor-1',
    question: 'What are the tax implications of selling my rental property?',
    response: 'When selling a rental property, you\'ll need to consider capital gains tax, depreciation recapture, and potential 1031 exchange options.',
    confidence: 0.92,
    status: 'PENDING',
    createdAt: '2025-04-24T09:30:00Z',
    updatedAt: '2025-04-24T09:30:00Z',
    history: []
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message card with correct content', () => {
    render(<MessageCard message={mockMessage} onClick={mockOnClick} />);
    
    // Check if question is displayed
    expect(screen.getByText('What are the tax implications of selling my rental property?')).toBeInTheDocument();
    
    // Check if confidence is displayed
    expect(screen.getByText('92%')).toBeInTheDocument();
    
    // Check if status is displayed
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('truncates long questions', () => {
    const longQuestion = 'A'.repeat(150);
    const longMessage = { ...mockMessage, question: longQuestion };
    
    render(<MessageCard message={longMessage} onClick={mockOnClick} />);
    
    // Should truncate to 100 characters + '...'
    const expectedTruncated = 'A'.repeat(100) + '...';
    expect(screen.getByText(expectedTruncated)).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    render(<MessageCard message={mockMessage} onClick={mockOnClick} />);
    
    // Click the card
    await userEvent.click(screen.getByRole('button'));
    
    // Check if onClick was called with the correct ID
    expect(mockOnClick).toHaveBeenCalledWith('1');
  });

  it('applies selected styling when selected prop is true', () => {
    const { rerender } = render(
      <MessageCard message={mockMessage} onClick={mockOnClick} selected={false} />
    );
    
    // Get the card element
    const card = screen.getByRole('button').closest('.MuiPaper-root');
    expect(card).toHaveStyle('background-color: var(--mui-palette-background-paper)');
    
    // Re-render with selected=true
    rerender(
      <MessageCard message={mockMessage} onClick={mockOnClick} selected={true} />
    );
    
    // Check if the selected styling is applied
    expect(card).toHaveStyle('background-color: var(--mui-palette-action-selected)');
  });
});
