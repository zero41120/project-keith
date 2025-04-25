import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageQueue } from '../../messages/MessageQueue';
import { messageApi } from '../../../api/apiClient';
import { Message, MessageStatus } from '../../../types/message';

// Mock the API
jest.mock('../../../api/apiClient', () => ({
  messageApi: {
    getMessages: jest.fn(),
    getMessage: jest.fn(),
    updateMessageStatus: jest.fn(),
    regenerateResponse: jest.fn()
  }
}));

// Mock the child components
jest.mock('../../messages/MessageList', () => ({
  __esModule: true,
  default: ({ messages, status, loading, onSelectMessage }: any) => (
    <div data-testid="mock-message-list">
      <div>Status: {status}</div>
      <div>Loading: {loading.toString()}</div>
      <div>Message Count: {messages.length}</div>
      <button onClick={() => onSelectMessage('1')}>Select Message 1</button>
    </div>
  )
}));

jest.mock('../../messages/MessageDetail', () => ({
  __esModule: true,
  default: ({ message, loading, error, onUpdateStatus, onRegenerateResponse }: any) => (
    <div data-testid="mock-message-detail">
      <div>Message ID: {message?.id || 'none'}</div>
      <div>Loading: {loading.toString()}</div>
      <div>Error: {error || 'none'}</div>
      <button onClick={() => onUpdateStatus('1', 'APPROVED' as MessageStatus)}>Approve</button>
      <button onClick={() => onRegenerateResponse('1', 'Test guidance')}>Regenerate</button>
    </div>
  )
}));

describe('MessageQueue', () => {
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

  const mockAuditorId = 'auditor-1';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    (messageApi.getMessages as jest.Mock).mockResolvedValue(mockMessages);
    (messageApi.getMessage as jest.Mock).mockResolvedValue(mockMessages[0]);
    (messageApi.updateMessageStatus as jest.Mock).mockImplementation((id, status) => 
      Promise.resolve({ ...mockMessages[0], status })
    );
    (messageApi.regenerateResponse as jest.Mock).mockResolvedValue({
      ...mockMessages[0],
      response: 'Updated response',
      confidence: 0.95
    });
  });

  it('renders the component with message list and detail sections', async () => {
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: 'Pending' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Later' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Approved' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Rejected' })).toBeInTheDocument();
    
    // Check if message list and detail are rendered
    await waitFor(() => {
      expect(screen.getByTestId('mock-message-list')).toBeInTheDocument();
      expect(screen.getByTestId('mock-message-detail')).toBeInTheDocument();
    });
    
    // Check if API was called with correct parameters
    expect(messageApi.getMessages).toHaveBeenCalledWith(mockAuditorId, 'PENDING');
  });

  it('fetches messages when tab changes', async () => {
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Initial tab (Pending) should call API
    await waitFor(() => {
      expect(messageApi.getMessages).toHaveBeenCalledWith(mockAuditorId, 'PENDING');
    });
    
    // Click on the Later tab
    await userEvent.click(screen.getByRole('tab', { name: 'Later' }));
    
    // Later tab should call API with LATER status
    await waitFor(() => {
      expect(messageApi.getMessages).toHaveBeenCalledWith(mockAuditorId, 'LATER');
    });
    
    // Click on the Approved tab
    await userEvent.click(screen.getByRole('tab', { name: 'Approved' }));
    
    // Approved tab should call API with APPROVED status
    await waitFor(() => {
      expect(messageApi.getMessages).toHaveBeenCalledWith(mockAuditorId, 'APPROVED');
    });
    
    // Click on the Rejected tab
    await userEvent.click(screen.getByRole('tab', { name: 'Rejected' }));
    
    // Rejected tab should call API with REJECTED status
    await waitFor(() => {
      expect(messageApi.getMessages).toHaveBeenCalledWith(mockAuditorId, 'REJECTED');
    });
  });

  it('fetches message details when a message is selected', async () => {
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('mock-message-list')).toBeInTheDocument();
    });
    
    // Click on the "Select Message 1" button in the mock MessageList
    await userEvent.click(screen.getByText('Select Message 1'));
    
    // Check if getMessage API was called with the correct ID
    await waitFor(() => {
      expect(messageApi.getMessage).toHaveBeenCalledWith('1');
    });
    
    // Check if the message detail is updated
    await waitFor(() => {
      expect(screen.getByText('Message ID: 1')).toBeInTheDocument();
    });
  });

  it('updates message status when status is changed', async () => {
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('mock-message-detail')).toBeInTheDocument();
    });
    
    // Click on the "Approve" button in the mock MessageDetail
    await userEvent.click(screen.getByText('Approve'));
    
    // Check if updateMessageStatus API was called with the correct parameters
    await waitFor(() => {
      expect(messageApi.updateMessageStatus).toHaveBeenCalledWith('1', 'APPROVED');
    });
  });

  it('regenerates response when refinement is submitted', async () => {
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('mock-message-detail')).toBeInTheDocument();
    });
    
    // Click on the "Regenerate" button in the mock MessageDetail
    await userEvent.click(screen.getByText('Regenerate'));
    
    // Check if regenerateResponse API was called with the correct parameters
    await waitFor(() => {
      expect(messageApi.regenerateResponse).toHaveBeenCalledWith({
        messageId: '1',
        guidance: 'Test guidance'
      });
    });
  });

  it('shows error message when API call fails', async () => {
    // Mock API to reject
    (messageApi.getMessages as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load messages. Please try again.')).toBeInTheDocument();
    });
  });

  it('removes message from list when status changes to a different tab', async () => {
    // Mock initial messages
    (messageApi.getMessages as jest.Mock).mockResolvedValue([mockMessages[0]]);
    
    render(<MessageQueue auditorId={mockAuditorId} />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Message Count: 1')).toBeInTheDocument();
    });
    
    // Mock updateMessageStatus to change status to APPROVED
    (messageApi.updateMessageStatus as jest.Mock).mockResolvedValue({
      ...mockMessages[0],
      status: 'APPROVED' as MessageStatus
    });
    
    // Click on the "Approve" button in the mock MessageDetail
    await userEvent.click(screen.getByText('Approve'));
    
    // Check if the message is removed from the list (since it's now APPROVED)
    await waitFor(() => {
      expect(screen.getByText('Message Count: 0')).toBeInTheDocument();
    });
  });
});
