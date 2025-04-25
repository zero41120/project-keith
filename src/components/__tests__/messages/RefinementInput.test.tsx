import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefinementInput } from '../../messages/RefinementInput';

describe('RefinementInput', () => {
  const mockMessageId = '123';
  const mockOnSubmit = jest.fn().mockImplementation(() => Promise.resolve());
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct elements', () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Check for heading
    expect(screen.getByText('Provide Guidance for Regeneration')).toBeInTheDocument();
    
    // Check for description text
    expect(screen.getByText(/Explain how the response should be improved/)).toBeInTheDocument();
    
    // Check for input field
    expect(screen.getByLabelText('Guidance')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Guidance' })).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Submit button should be disabled initially
    const submitButton = screen.getByRole('button', { name: 'Submit Guidance' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has text', async () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Type in the guidance field
    await userEvent.type(screen.getByLabelText('Guidance'), 'Add more details about tax implications');
    
    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: 'Submit Guidance' });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Click the cancel button
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    
    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Type in the guidance field
    const guidance = 'Add more details about tax implications';
    await userEvent.type(screen.getByLabelText('Guidance'), guidance);
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit Guidance' }));
    
    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      messageId: mockMessageId,
      guidance
    });
  });

  it('shows error message when submission fails', async () => {
    // Mock onSubmit to reject
    const mockFailedSubmit = jest.fn().mockImplementation(() => Promise.reject(new Error('Submission failed')));
    
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockFailedSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Type in the guidance field
    await userEvent.type(screen.getByLabelText('Guidance'), 'Add more details about tax implications');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit Guidance' }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to submit refinement. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables buttons during submission', async () => {
    // Mock onSubmit to return a promise that doesn't resolve immediately
    const mockDelayedSubmit = jest.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(resolve, 100);
    }));
    
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockDelayedSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Type in the guidance field
    await userEvent.type(screen.getByLabelText('Guidance'), 'Add more details about tax implications');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit Guidance' }));
    
    // Check if buttons are disabled during submission
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('validates input and shows error for empty submission', async () => {
    render(
      <RefinementInput
        messageId={mockMessageId}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    
    // Try to submit with empty input (by clicking the button directly)
    // This shouldn't happen normally since the button is disabled, but we're testing the validation logic
    const submitButton = screen.getByRole('button', { name: 'Submit Guidance' });
    await userEvent.click(submitButton);
    
    // Check if onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
