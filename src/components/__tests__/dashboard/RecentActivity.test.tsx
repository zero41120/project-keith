import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecentActivity } from '../../../components/dashboard/RecentActivity';

describe('RecentActivity', () => {
  const mockActivities = [
    {
      id: '1',
      action: 'Approved response to "Tax deduction question"',
      timestamp: '2025-04-25T10:00:00Z'
    },
    {
      id: '2',
      action: 'Rejected response to "Investment advice"',
      timestamp: '2025-04-25T09:00:00Z'
    },
    {
      id: '3',
      action: 'Added "2025 Tax Guidelines.pdf" to knowledge base',
      timestamp: '2025-04-25T07:00:00Z'
    },
    {
      id: '4',
      action: 'Marked "Retirement planning" for later',
      timestamp: '2025-04-24T12:00:00Z'
    }
  ];

  it('renders the component with title', () => {
    render(<RecentActivity activities={mockActivities} />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('displays all activities with their descriptions', () => {
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText(/Approved response to "Tax deduction question"/)).toBeInTheDocument();
    expect(screen.getByText(/Rejected response to "Investment advice"/)).toBeInTheDocument();
    expect(screen.getByText(/Added "2025 Tax Guidelines.pdf" to knowledge base/)).toBeInTheDocument();
    expect(screen.getByText(/Marked "Retirement planning" for later/)).toBeInTheDocument();
  });

  it('displays relative time for each activity', () => {
    // Mock the current time to be fixed
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-04-25T12:00:00Z'));
    
    render(<RecentActivity activities={mockActivities} />);
    
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
    expect(screen.getByText(/3 hours ago/)).toBeInTheDocument();
    expect(screen.getByText(/5 hours ago/)).toBeInTheDocument();
    expect(screen.getByText(/a day ago/)).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('renders empty state when no activities are provided', () => {
    render(<RecentActivity activities={[]} />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });
});
