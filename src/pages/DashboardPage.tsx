import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                    <Typography variant="h4">12</Typography>
                    <Typography variant="body2">Pending</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <Typography variant="h4">45</Typography>
                    <Typography variant="body2">Approved</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                    <Typography variant="h4">8</Typography>
                    <Typography variant="body2">Rejected</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4">15</Typography>
                    <Typography variant="body2">Later</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Approved response to "Tax deduction question" - 2 hours ago
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Rejected response to "Investment advice" - 3 hours ago
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Added "2025 Tax Guidelines.pdf" to knowledge base - 5 hours ago
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Marked "Retirement planning" for later - 1 day ago
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* Quick Access */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Quick Access
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Common Tasks:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light' }}>
                      Review Pending
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light' }}>
                      Upload Document
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light' }}>
                      Add Knowledge
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.light' }}>
                      View Reports
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
