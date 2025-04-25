import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageDetail } from '../../messages/MessageDetail';
import { Message, type MessageStatus } from '../../../types/message';

// Mock the RefinementInput component
jest.mock('../../messages/RefinementInput', () => ({
  __esModule: true,
  default: ({ messageId, onSubmit, onCancel }: any) => (
    <div data-testid="mock-refinement-input">
      <button onClick={() => onSubmit({ messageId, guidance: 'Test guidance' })}>
        Mock Submit
      </button>
      <button onClick={onCancel}>Mock Cancel</button>
    </div>
  )
}));

describe('MessageDetail', () => {
  const mockMessage: Message = {
    id: '1',
    customerId: 'customer-1',
    auditorId: 'auditor-1',
    question: 'What are the tax implications of selling my rental property?',
    response: 'When selling a rental property, you\'ll need to consider capital gains tax.',
    confidence: 0.92,
    status: 'PENDING',
    createdAt: '2025-04-24T09:30:00Z',
    updatedAt: '2025-04-24T09:30:00Z',
    history: [
      {
        id: '101',
        messageId: '1',
        response: 'Initial response before refinement.',
        confidence: 0.75,
        createdAt: '2025-04-24T09:00:00Z'
      }
    ]
  };

  const mockUpdateStatus = jest.fn().mockImplementation(() => Promise.resolve());
  const mockRegenerateResponse = jest.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when loading is true', () => {
    render(
      <MessageDetail
        message={null}
        loading={true}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    const errorMessage = 'Failed to load message';
    render(
      <MessageDetail
        message={null}
        loading={false}
        error={errorMessage}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state when no message is provided', () => {
    render(
      <MessageDetail
        message={null}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    expect(screen.getByText('Select a message to view details')).toBeInTheDocument();
  });

  it('renders message details when message is provided', () => {
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Check if question is displayed
    expect(screen.getByText('What are the tax implications of selling my rental property?')).toBeInTheDocument();
    
    // Check if response is displayed
    expect(screen.getByText('When selling a rental property, you\'ll need to consider capital gains tax.')).toBeInTheDocument();
    
    // Check if confidence is displayed
    expect(screen.getByText('Confidence: 92%')).toBeInTheDocument();
    
    // Check if customer info is displayed
    expect(screen.getByText(/From: Customer customer-1/)).toBeInTheDocument();
    
    // Check if action buttons are displayed
    expect(screen.getByRole('button', { name: 'Regenerate' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Later' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
  });

  it('renders message history when available', () => {
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Check if history section is displayed
    expect(screen.getByText('Response History')).toBeInTheDocument();
    
    // Check if history item is displayed
    expect(screen.getByText('Initial response before refinement.')).toBeInTheDocument();
    expect(screen.getByText(/Version 1 • 75% confidence/)).toBeInTheDocument();
  });

  it('calls onUpdateStatus when status buttons are clicked', async () => {
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Click the Approve button
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(mockUpdateStatus).toHaveBeenCalledWith('1', 'APPROVED');
    
    // Click the Reject button
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(mockUpdateStatus).toHaveBeenCalledWith('1', 'REJECTED');
    
    // Click the Later button
    await userEvent.click(screen.getByRole('button', { name: 'Later' }));
    expect(mockUpdateStatus).toHaveBeenCalledWith('1', 'LATER');
  });

  it('toggles refinement input when Regenerate button is clicked', async () => {
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Initially, refinement input should not be visible
    expect(screen.queryByTestId('mock-refinement-input')).not.toBeInTheDocument();
    
    // Click the Regenerate button
    await userEvent.click(screen.getByRole('button', { name: 'Regenerate' }));
    
    // Refinement input should now be visible
    expect(screen.getByTestId('mock-refinement-input')).toBeInTheDocument();
    
    // Click the Regenerate button again (which now says "Cancel Regeneration")
    await userEvent.click(screen.getByRole('button', { name: 'Cancel Regeneration' }));
    
    // Refinement input should be hidden again
    expect(screen.queryByTestId('mock-refinement-input')).not.toBeInTheDocument();
  });

  it('calls onRegenerateResponse when refinement is submitted', async () => {
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Click the Regenerate button to show refinement input
    await userEvent.click(screen.getByRole('button', { name: 'Regenerate' }));
    
    // Click the mock submit button in the refinement input
    await userEvent.click(screen.getByText('Mock Submit'));
    
    // Check if onRegenerateResponse was called with the correct parameters
    expect(mockRegenerateResponse).toHaveBeenCalledWith('1', 'Test guidance');
    
    // Refinement input should be hidden after submission
    expect(screen.queryByTestId('mock-refinement-input')).not.toBeInTheDocument();
  });

  it('disables action buttons when status is already set', () => {
    const approvedMessage = { ...mockMessage, status: 'APPROVED' as MessageStatus };
    
    render(
      <MessageDetail
        message={approvedMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockUpdateStatus}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Approve button should be disabled
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled();
    
    // Other buttons should be enabled
    expect(screen.getByRole('button', { name: 'Reject' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Later' })).not.toBeDisabled();
  });

  it('shows error message when status update fails', async () => {
    // Mock onUpdateStatus to reject
    const mockFailedUpdate = jest.fn().mockImplementation(() => Promise.reject(new Error('Update failed')));
    
    render(
      <MessageDetail
        message={mockMessage}
        loading={false}
        error={null}
        onUpdateStatus={mockFailedUpdate}
        onRegenerateResponse={mockRegenerateResponse}
      />
    );
    
    // Click the Approve button
    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to update status to APPROVED')).toBeInTheDocument();
    });
  });
});
