import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import MessageQueue from '../components/messages/MessageQueue';

// Hardcoded auditor ID for demo purposes
// In a real app, this would come from authentication context
const DEMO_AUDITOR_ID = 'auditor-1';

export const MessagesPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Message Queue
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Review and respond to customer inquiries. Approve, reject, or request regeneration of AI-generated responses.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <MessageQueue auditorId={DEMO_AUDITOR_ID} />
        </Box>
      </Box>
    </Container>
  );
};

export default MessagesPage;
