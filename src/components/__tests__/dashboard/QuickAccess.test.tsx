import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickAccess } from '../../../components/dashboard/QuickAccess';

describe('QuickAccess', () => {
  const mockActions = [
    {
      id: '1',
      label: 'Review Pending',
      onClick: jest.fn(),
      color: 'primary.light'
    },
    {
      id: '2',
      label: 'Upload Document',
      onClick: jest.fn(),
      color: 'primary.light'
    },
    {
      id: '3',
      label: 'Add Knowledge',
      onClick: jest.fn(),
      color: 'primary.light'
    },
    {
      id: '4',
      label: 'View Reports',
      onClick: jest.fn(),
      color: 'primary.light'
    }
  ];

  it('renders the component with title', () => {
    render(<QuickAccess actions={mockActions} />);
    expect(screen.getByText('Quick Access')).toBeInTheDocument();
  });

  it('displays all action buttons', () => {
    render(<QuickAccess actions={mockActions} />);
    
    expect(screen.getByText('Review Pending')).toBeInTheDocument();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText('Add Knowledge')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
  });

  it('calls the correct onClick handler when a button is clicked', () => {
    render(<QuickAccess actions={mockActions} />);
    
    fireEvent.click(screen.getByText('Review Pending'));
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Upload Document'));
    expect(mockActions[1].onClick).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when no actions are provided', () => {
    render(<QuickAccess actions={[]} />);
    expect(screen.getByText('No quick actions available')).toBeInTheDocument();
  });
});
