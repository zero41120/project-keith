import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageList } from '../../messages/MessageList';
import { Message } from '../../../types/message';

describe('MessageList', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      customerId: 'customer-1',
      auditorId: 'auditor-1',
      question: 'What are the tax implications of selling my rental property?',
      response: 'When selling a rental property, you\'ll need to consider capital gains tax.',
      confidence: 0.92,
      status: 'PENDING',
      createdAt: '2025-04-24T09:30:00Z',
      updatedAt: '2025-04-24T09:30:00Z',
      history: []
    },
    {
      id: '2',
      customerId: 'customer-2',
      auditorId: 'auditor-1',
      question: 'Should I convert my traditional IRA to a Roth IRA this year?',
      response: 'Converting to a Roth IRA means paying taxes now for tax-free withdrawals later.',
      confidence: 0.78,
      status: 'APPROVED',
      createdAt: '2025-04-23T14:15:00Z',
      updatedAt: '2025-04-24T10:45:00Z',
      history: []
    }
  ];

  const mockOnSelectMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    render(
      <MessageList
        messages={[]}
        status="PENDING"
        loading={true}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state when no messages are available', () => {
    render(
      <MessageList
        messages={[]}
        status="PENDING"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    expect(screen.getByText('No pending messages found')).toBeInTheDocument();
  });

  it('renders message cards for each message', () => {
    render(
      <MessageList
        messages={mockMessages}
        status="ALL"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    // Check if both message questions are displayed
    expect(screen.getByText('What are the tax implications of selling my rental property?')).toBeInTheDocument();
    expect(screen.getByText('Should I convert my traditional IRA to a Roth IRA this year?')).toBeInTheDocument();
  });

  it('calls onSelectMessage when a message card is clicked', async () => {
    render(
      <MessageList
        messages={mockMessages}
        status="ALL"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    // Click the first message card
    await userEvent.click(screen.getByText('What are the tax implications of selling my rental property?'));
    
    // Check if onSelectMessage was called with the correct ID
    expect(mockOnSelectMessage).toHaveBeenCalledWith('1');
  });

  it('filters messages based on search query', async () => {
    render(
      <MessageList
        messages={mockMessages}
        status="ALL"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    // Type in the search box
    await userEvent.type(screen.getByPlaceholderText('Search messages...'), 'IRA');
    
    // Wait for the filtering to take effect
    await waitFor(() => {
      // The IRA message should be visible
      expect(screen.getByText('Should I convert my traditional IRA to a Roth IRA this year?')).toBeInTheDocument();
      
      // The rental property message should not be visible
      expect(screen.queryByText('What are the tax implications of selling my rental property?')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when search has no matches', async () => {
    render(
      <MessageList
        messages={mockMessages}
        status="ALL"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
      />
    );
    
    // Type in the search box with a query that won't match any messages
    await userEvent.type(screen.getByPlaceholderText('Search messages...'), 'xyz123');
    
    // Wait for the filtering to take effect
    await waitFor(() => {
      expect(screen.getByText('No messages match your search')).toBeInTheDocument();
    });
  });

  it('applies selected styling to the selected message', () => {
    render(
      <MessageList
        messages={mockMessages}
        status="ALL"
        loading={false}
        onSelectMessage={mockOnSelectMessage}
        selectedMessageId="1"
      />
    );
    
    // Find the message cards
    const cards = screen.getAllByRole('button');
    
    // The first card should have the selected styling
    expect(cards[0].closest('.MuiPaper-root')).toHaveStyle('background-color: var(--mui-palette-action-selected)');
    
    // The second card should not have the selected styling
    expect(cards[1].closest('.MuiPaper-root')).not.toHaveStyle('background-color: var(--mui-palette-action-selected)');
  });
});
