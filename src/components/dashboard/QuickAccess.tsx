import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

interface ActionItem {
  id: string;
  label: string;
  onClick: () => void;
  color: string;
}

interface QuickAccessProps {
  actions: ActionItem[];
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ actions }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Quick Access
      </Typography>
      <Box sx={{ mt: 2 }}>
        {actions.length > 0 ? (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Common Tasks:
            </Typography>
            <Grid container spacing={2}>
              {actions.map((action) => (
                <Grid key={action.id} sx={{ gridColumn: 'span 6' }}>
                  <Paper 
                    sx={{ 
                      p: 1, 
                      textAlign: 'center', 
                      bgcolor: action.color,
                      cursor: 'pointer'
                    }}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant="body2">No quick actions available</Typography>
        )}
      </Box>
    </Paper>
  );
};
