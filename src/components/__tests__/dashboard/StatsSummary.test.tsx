import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsSummary } from '../../../components/dashboard/StatsSummary';

describe('StatsSummary', () => {
  const mockStats = {
    pending: 12,
    approved: 45,
    rejected: 8,
    later: 15
  };

  it('renders the component with title', () => {
    render(<StatsSummary stats={mockStats} />);
    expect(screen.getByText('Summary Statistics')).toBeInTheDocument();
  });

  it('displays the correct number of pending messages', () => {
    render(<StatsSummary stats={mockStats} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays the correct number of approved messages', () => {
    render(<StatsSummary stats={mockStats} />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('displays the correct number of rejected messages', () => {
    render(<StatsSummary stats={mockStats} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('displays the correct number of later messages', () => {
    render(<StatsSummary stats={mockStats} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
  });

  it('renders with zero values when no stats are provided', () => {
    render(<StatsSummary stats={{
      pending: 0,
      approved: 0,
      rejected: 0,
      later: 0
    }} />);
    
    // Check that all stats are displayed as 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(4);
  });
});
