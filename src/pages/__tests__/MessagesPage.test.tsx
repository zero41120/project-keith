import React from 'react';
import { render, screen } from '@testing-library/react';
import MessagesPage from '../MessagesPage';

// Mock the MessageQueue component
jest.mock('../../components/messages/MessageQueue', () => ({
  __esModule: true,
  default: ({ auditorId }: { auditorId: string }) => (
    <div data-testid="mock-message-queue">
      Message Queue for Auditor: {auditorId}
    </div>
  )
}));

describe('MessagesPage', () => {
  it('renders the page title and description', () => {
    render(<MessagesPage />);
    
    // Check if the page title is rendered
    expect(screen.getByRole('heading', { name: 'Message Queue' })).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(screen.getByText(/Review and respond to customer inquiries/)).toBeInTheDocument();
  });

  it('renders the MessageQueue component with the correct auditor ID', () => {
    render(<MessagesPage />);
    
    // Check if the MessageQueue component is rendered with the correct auditor ID
    expect(screen.getByTestId('mock-message-queue')).toBeInTheDocument();
    expect(screen.getByText('Message Queue for Auditor: auditor-1')).toBeInTheDocument();
  });
});
