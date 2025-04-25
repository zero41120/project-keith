import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploader } from '../../knowledge/FileUploader';

describe('FileUploader', () => {
  const mockOnFileUpload = jest.fn();
  
  beforeEach(() => {
    mockOnFileUpload.mockClear();
  });
  
  it('renders the file upload component', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} />);
    
    expect(screen.getByText('Drag & Drop Files Here')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
  });
  
  it('handles file selection via input', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} />);
    
    const file = new File(['test content'], 'test-file.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    
    fireEvent.change(input);
    
    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
  });
  
  it('handles drag and drop file upload', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} />);
    
    const file = new File(['test content'], 'test-file.pdf', { type: 'application/pdf' });
    const dropZone = screen.getByTestId('drop-zone');
    
    // Use standard fireEvent methods instead of custom events
    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);
    
    // Create a mock dataTransfer object
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: file.type,
          getAsFile: () => file
        }
      ],
      types: ['Files']
    };
    
    // Use fireEvent.drop with the dataTransfer object
    fireEvent.drop(dropZone, { dataTransfer });
    
    expect(mockOnFileUpload).toHaveBeenCalledWith(file);
  });
  
  it('shows drag over state when files are dragged over', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} />);
    
    const dropZone = screen.getByTestId('drop-zone');
    
    // Use standard fireEvent methods
    fireEvent.dragEnter(dropZone);
    
    // Check that the drop zone has the dragover class
    expect(dropZone).toHaveClass('dragover');
    
    // Use standard fireEvent methods
    fireEvent.dragLeave(dropZone);
    
    // Check that the drop zone no longer has the dragover class
    expect(dropZone).not.toHaveClass('dragover');
  });
  
  it('displays error message for unsupported file types', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} acceptedTypes={['.pdf', '.docx']} />);
    
    const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    
    fireEvent.change(input);
    
    expect(mockOnFileUpload).not.toHaveBeenCalled();
    expect(screen.getByText(/Unsupported file type/)).toBeInTheDocument();
  });
});
