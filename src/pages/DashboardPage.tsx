import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MessageStatus } from '../types/message';
import { StatsSummary } from '../components/dashboard/StatsSummary';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickAccess } from '../components/dashboard/QuickAccess';
import { v4 as uuidv4 } from 'uuid';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data for stats
  const stats = {
    pending: 12,
    approved: 45,
    rejected: 8,
    later: 15
  };

  // Mock data for recent activities with type and targetId for navigation
  const activities = [
    {
      id: uuidv4(),
      action: 'Approved response to "Tax deduction question"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      type: 'message',
      targetId: '4' // ID of the message in the mock data
    },
    {
      id: uuidv4(),
      action: 'Rejected response to "Investment advice"',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      type: 'message',
      targetId: '2' // ID of the message in the mock data
    },
    {
      id: uuidv4(),
      action: 'Added "2025 Tax Guidelines.pdf" to knowledge base',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      type: 'knowledge',
      targetId: '1' // ID of the knowledge item in the mock data
    },
    {
      id: uuidv4(),
      action: 'Marked "Retirement planning" for later',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      type: 'message',
      targetId: '3' // ID of the message in the mock data
    }
  ];
  
  // Handle activity click
  const handleActivityClick = (activity: {
    id: string;
    action: string;
    timestamp: string;
    type?: string;
    targetId?: string;
  }) => {
    if (activity.type === 'message') {
      navigate('/messages');
    } else if (activity.type === 'knowledge') {
      navigate('/knowledge');
    }
  };
  
  // Handle stat click
  const handleStatClick = (status: MessageStatus) => {
    navigate('/messages');
  };

  // Quick access actions with working navigation
  const actions = [
    {
      id: uuidv4(),
      label: 'Review Pending',
      onClick: () => navigate('/messages'),
      color: 'primary.light'
    },
    {
      id: uuidv4(),
      label: 'Upload Document',
      onClick: () => navigate('/knowledge'),
      color: 'primary.light'
    },
    {
      id: uuidv4(),
      label: 'Add Knowledge',
      onClick: () => navigate('/knowledge'),
      color: 'primary.light'
    },
    {
      id: uuidv4(),
      label: 'View Reports',
      onClick: () => console.log('Reports feature coming soon'),
      color: 'primary.light'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid sx={{ gridColumn: 'span 12' }}>
            <StatsSummary stats={stats} onStatClick={handleStatClick} />
          </Grid>
          
          {/* Recent Activity */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <RecentActivity 
              activities={activities} 
              onActivityClick={handleActivityClick}
            />
          </Grid>
          
          {/* Quick Access */}
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <QuickAccess actions={actions} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
