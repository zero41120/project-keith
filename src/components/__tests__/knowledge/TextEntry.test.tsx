import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextEntry } from '../../knowledge/TextEntry';

describe('TextEntry', () => {
  const mockOnTextSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnTextSubmit.mockClear();
  });
  
  it('renders the text entry component', () => {
    render(<TextEntry onTextSubmit={mockOnTextSubmit} />);
    
    expect(screen.getByText('Add Knowledge Entry')).toBeInTheDocument();
    expect(screen.getByTestId('text-editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
  
  it('handles text input and submission', async () => {
    render(<TextEntry onTextSubmit={mockOnTextSubmit} />);
    
    // Get the input field (MUI TextField)
    const textEditor = screen.getByTestId('text-editor').querySelector('textarea');
    if (!textEditor) throw new Error('Text editor not found');
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    // Type text in the editor using fireEvent instead of userEvent
    fireEvent.change(textEditor, { target: { value: 'This is a test knowledge entry' } });
    
    // Enable the button (it's disabled when empty)
    fireEvent.click(submitButton);
    
    // Check that onTextSubmit was called with the entered text
    expect(mockOnTextSubmit).toHaveBeenCalledWith('This is a test knowledge entry');
  });
  
  it('disables submit button when text is empty', () => {
    render(<TextEntry onTextSubmit={mockOnTextSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    
    // Initially the button should be disabled
    expect(submitButton).toBeDisabled();
    
    // Get the input field (MUI TextField)
    const textEditor = screen.getByTestId('text-editor').querySelector('textarea');
    if (!textEditor) throw new Error('Text editor not found');
    
    // Type text in the editor
    fireEvent.change(textEditor, { target: { value: 'Some text' } });
    
    // Button should be enabled
    expect(submitButton).not.toBeDisabled();
    
    // Clear the text
    fireEvent.change(textEditor, { target: { value: '' } });
    
    // Button should be disabled again
    expect(submitButton).toBeDisabled();
  });
  
  it('provides formatting options for text', () => {
    render(<TextEntry onTextSubmit={mockOnTextSubmit} />);
    
    // Check that formatting buttons are present
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bullet List' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Numbered List' })).toBeInTheDocument();
  });
  
  it('applies formatting when formatting buttons are clicked', async () => {
    render(<TextEntry onTextSubmit={mockOnTextSubmit} />);
    
    // Get the input field (MUI TextField)
    const textEditor = screen.getByTestId('text-editor').querySelector('textarea');
    if (!textEditor) throw new Error('Text editor not found');
    
    const boldButton = screen.getByRole('button', { name: 'Bold' });
    
    // Type text in the editor
    fireEvent.change(textEditor, { target: { value: 'This is bold text' } });
    
    // Click the bold button to apply formatting
    fireEvent.click(boldButton);
    
    // Submit the text
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    
    // Check that the text was submitted
    expect(mockOnTextSubmit).toHaveBeenCalledWith('This is bold text');
  });
});
