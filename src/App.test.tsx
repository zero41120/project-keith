import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the main layout with sidebar and content area', () => {
    render(<App />);
    
    // Check for main layout elements
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('should display the app title', () => {
    render(<App />);
    
    // Check for app title
    expect(screen.getByText('Keith\'s Auditor Dashboard')).toBeInTheDocument();
  });

  it('should have navigation links in the sidebar', () => {
    render(<App />);
    
    // Check for navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });
});
