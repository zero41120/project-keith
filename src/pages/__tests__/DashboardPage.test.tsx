import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../../pages/DashboardPage';
import { useNavigate } from 'react-router-dom';
import { StatsSummary } from '../../components/dashboard/StatsSummary';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { QuickAccess } from '../../components/dashboard/QuickAccess';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock the dashboard components
jest.mock('../../components/dashboard/StatsSummary', () => ({
  StatsSummary: jest.fn(() => <div data-testid="stats-summary">Stats Summary Component</div>)
}));

jest.mock('../../components/dashboard/RecentActivity', () => ({
  RecentActivity: jest.fn(() => <div data-testid="recent-activity">Recent Activity Component</div>)
}));

jest.mock('../../components/dashboard/QuickAccess', () => ({
  QuickAccess: jest.fn(() => <div data-testid="quick-access">Quick Access Component</div>)
}));

describe('DashboardPage', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders the dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the StatsSummary component with correct props', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('stats-summary')).toBeInTheDocument();
    const statsCall = (StatsSummary as jest.Mock).mock.calls[0][0];
    expect(statsCall).toHaveProperty('stats');
    expect(statsCall.stats).toHaveProperty('pending', expect.any(Number));
    expect(statsCall.stats).toHaveProperty('approved', expect.any(Number));
    expect(statsCall.stats).toHaveProperty('rejected', expect.any(Number));
    expect(statsCall.stats).toHaveProperty('later', expect.any(Number));
    expect(statsCall).toHaveProperty('onStatClick', expect.any(Function));
  });

  it('renders the RecentActivity component with correct props', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    const activitiesCall = (RecentActivity as jest.Mock).mock.calls[0][0];
    expect(activitiesCall).toHaveProperty('activities');
    expect(activitiesCall.activities).toBeInstanceOf(Array);
    expect(activitiesCall.activities.length).toBeGreaterThan(0);
    expect(activitiesCall.activities[0]).toHaveProperty('id', expect.any(String));
    expect(activitiesCall.activities[0]).toHaveProperty('action', expect.any(String));
    expect(activitiesCall.activities[0]).toHaveProperty('timestamp', expect.any(String));
    expect(activitiesCall.activities[0]).toHaveProperty('type', expect.any(String));
    expect(activitiesCall.activities[0]).toHaveProperty('targetId', expect.any(String));
    expect(activitiesCall).toHaveProperty('onActivityClick', expect.any(Function));
  });

  it('renders the QuickAccess component with correct props', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('quick-access')).toBeInTheDocument();
    const actionsCall = (QuickAccess as jest.Mock).mock.calls[0][0];
    expect(actionsCall).toHaveProperty('actions');
    expect(actionsCall.actions).toBeInstanceOf(Array);
    expect(actionsCall.actions.length).toBeGreaterThan(0);
    expect(actionsCall.actions[0]).toHaveProperty('id', expect.any(String));
    expect(actionsCall.actions[0]).toHaveProperty('label', expect.any(String));
    expect(actionsCall.actions[0]).toHaveProperty('onClick', expect.any(Function));
    expect(actionsCall.actions[0]).toHaveProperty('color', expect.any(String));
  });
  
  it('navigates to messages page when stat is clicked', () => {
    render(<DashboardPage />);
    const statsCall = (StatsSummary as jest.Mock).mock.calls[0][0];
    statsCall.onStatClick('PENDING');
    expect(mockNavigate).toHaveBeenCalledWith('/messages');
  });
  
  it('navigates to messages page when message activity is clicked', () => {
    render(<DashboardPage />);
    const activitiesCall = (RecentActivity as jest.Mock).mock.calls[0][0];
    activitiesCall.onActivityClick({
      id: '1',
      action: 'Test action',
      timestamp: new Date().toISOString(),
      type: 'message',
      targetId: '1'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/messages');
  });
  
  it('navigates to knowledge page when knowledge activity is clicked', () => {
    render(<DashboardPage />);
    const activitiesCall = (RecentActivity as jest.Mock).mock.calls[0][0];
    activitiesCall.onActivityClick({
      id: '1',
      action: 'Test action',
      timestamp: new Date().toISOString(),
      type: 'knowledge',
      targetId: '1'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/knowledge');
  });
  
  it('navigates to correct page when quick access action is clicked', () => {
    render(<DashboardPage />);
    const actionsCall = (QuickAccess as jest.Mock).mock.calls[0][0];
    
    // Test "Review Pending" action
    actionsCall.actions[0].onClick();
    expect(mockNavigate).toHaveBeenCalledWith('/messages');
    
    // Test "Upload Document" action
    actionsCall.actions[1].onClick();
    expect(mockNavigate).toHaveBeenCalledWith('/knowledge');
    
    // Test "Add Knowledge" action
    actionsCall.actions[2].onClick();
    expect(mockNavigate).toHaveBeenCalledWith('/knowledge');
  });
});
