import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Chip, 
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { Message, MessageStatus } from '../../types/message';
import RefinementInput from './RefinementInput';
import dayjs from 'dayjs';

// Props interface
interface MessageDetailProps {
  message: Message | null;
  loading: boolean;
  error: string | null;
  onUpdateStatus: (id: string, status: MessageStatus) => Promise<void>;
  onRegenerateResponse: (messageId: string, guidance: string) => Promise<void>;
}

// Format confidence as percentage
const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  loading,
  error,
  onUpdateStatus,
  onRegenerateResponse
}) => {
  const [showRefinementInput, setShowRefinementInput] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Handle status update
  const handleStatusUpdate = async (status: MessageStatus) => {
    if (!message) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await onUpdateStatus(message.id, status);
    } catch (err) {
      setUpdateError(`Failed to update status to ${status}`);
      console.error('Status update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle regenerate request
  const handleRegenerateSubmit = async (refinementData: { messageId: string; guidance: string }) => {
    try {
      await onRegenerateResponse(refinementData.messageId, refinementData.guidance);
      setShowRefinementInput(false);
    } catch (err) {
      console.error('Regeneration error:', err);
      // Error is handled by the parent component
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Render empty state
  if (!message) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        bgcolor="background.paper"
        borderRadius={1}
      >
        <Typography variant="body1" color="text.secondary">
          Select a message to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateError}
        </Alert>
      )}
      
      {/* Question Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Question
        </Typography>
        <Typography variant="body1">
          {message.question}
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            From: Customer {message.customerId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </Typography>
        </Box>
      </Paper>
      
      {/* Refinement Input (conditionally rendered) */}
      {showRefinementInput && (
        <RefinementInput 
          messageId={message.id}
          onSubmit={handleRegenerateSubmit}
          onCancel={() => setShowRefinementInput(false)}
        />
      )}
      
      {/* Response Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            AI Response
          </Typography>
          <Chip 
            label={`Confidence: ${formatConfidence(message.confidence)}`}
            color={message.confidence >= 0.9 ? 'success' : message.confidence >= 0.7 ? 'info' : 'warning'}
          />
        </Box>
        
        <Typography variant="body1" paragraph>
          {message.response}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setShowRefinementInput(!showRefinementInput)}
            disabled={isUpdating}
          >
            {showRefinementInput ? 'Cancel Regeneration' : 'Regenerate'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="info"
            onClick={() => handleStatusUpdate('LATER')}
            disabled={isUpdating || message.status === 'LATER'}
          >
            Later
          </Button>
          
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => handleStatusUpdate('REJECTED')}
            disabled={isUpdating || message.status === 'REJECTED'}
          >
            Reject
          </Button>
          
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleStatusUpdate('APPROVED')}
            disabled={isUpdating || message.status === 'APPROVED'}
          >
            Approve
          </Button>
        </Stack>
      </Paper>
      
      {/* Message History Section (if available) */}
      {message.history.length > 0 && (
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Response History
          </Typography>
          
          {message.history.map((historyItem, index) => (
            <Box key={historyItem.id} mb={index < message.history.length - 1 ? 3 : 0}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Version {index + 1} • {formatConfidence(historyItem.confidence)} confidence • 
                {dayjs(historyItem.createdAt).format(' MMM D, YYYY h:mm A')}
              </Typography>
              
              <Typography variant="body1">
                {historyItem.response}
              </Typography>
              
              {index < message.history.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default MessageDetail;
