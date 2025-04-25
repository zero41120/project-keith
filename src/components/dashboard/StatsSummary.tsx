import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { MessageStatus } from '../../types/message';

interface StatsProps {
  pending: number;
  approved: number;
  rejected: number;
  later: number;
}

interface StatsSummaryProps {
  stats: StatsProps;
  onStatClick?: (status: MessageStatus) => void;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats, onStatClick }) => {
  const handleClick = (status: MessageStatus) => {
    if (onStatClick) {
      onStatClick(status);
    }
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Summary Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid sx={{ gridColumn: 'span 3' }}>
          <Paper 
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: 'info.light',
              cursor: onStatClick ? 'pointer' : 'default',
              '&:hover': onStatClick ? { opacity: 0.9, boxShadow: 3 } : {}
            }}
            onClick={() => handleClick('PENDING')}
          >
            <Typography variant="h4">{stats.pending}</Typography>
            <Typography variant="body2">Pending</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 3' }}>
          <Paper 
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: 'success.light',
              cursor: onStatClick ? 'pointer' : 'default',
              '&:hover': onStatClick ? { opacity: 0.9, boxShadow: 3 } : {}
            }}
            onClick={() => handleClick('APPROVED')}
          >
            <Typography variant="h4">{stats.approved}</Typography>
            <Typography variant="body2">Approved</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 3' }}>
          <Paper 
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: 'error.light',
              cursor: onStatClick ? 'pointer' : 'default',
              '&:hover': onStatClick ? { opacity: 0.9, boxShadow: 3 } : {}
            }}
            onClick={() => handleClick('REJECTED')}
          >
            <Typography variant="h4">{stats.rejected}</Typography>
            <Typography variant="body2">Rejected</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 3' }}>
          <Paper 
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              bgcolor: 'warning.light',
              cursor: onStatClick ? 'pointer' : 'default',
              '&:hover': onStatClick ? { opacity: 0.9, boxShadow: 3 } : {}
            }}
            onClick={() => handleClick('LATER')}
          >
            <Typography variant="h4">{stats.later}</Typography>
            <Typography variant="body2">Later</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};
