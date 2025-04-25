import React from 'react';
import { Card, CardContent, CardActionArea, Typography, Box, Chip, Stack } from '@mui/material';
import { Message } from '../../types/message';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

// Props interface
interface MessageCardProps {
  message: Message;
  onClick: (id: string) => void;
  selected?: boolean;
}

// Status color mapping
const statusColors: Record<string, string> = {
  PENDING: 'warning.main',
  APPROVED: 'success.main',
  REJECTED: 'error.main',
  LATER: 'info.main',
};

// Format confidence as percentage
const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

// Format date as relative time
const formatDate = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

export const MessageCard: React.FC<MessageCardProps> = ({ message, onClick, selected = false }) => {
  const { id, question, confidence, status, updatedAt } = message;
  
  // Truncate question if it's too long
  const truncatedQuestion = question.length > 100
    ? `${question.substring(0, 100)}...`
    : question;
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: 4, 
        borderColor: statusColors[status] || 'grey.500',
        bgcolor: selected ? 'action.selected' : 'background.paper'
      }}
      elevation={selected ? 3 : 1}
    >
      <CardActionArea onClick={() => onClick(id)}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            {truncatedQuestion}
          </Typography>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
            <Box>
              <Chip 
                label={status} 
                size="small" 
                sx={{ 
                  bgcolor: statusColors[status] || 'grey.500',
                  color: 'white',
                  mr: 1
                }} 
              />
              <Chip 
                label={formatConfidence(confidence)} 
                size="small" 
                color={confidence >= 0.9 ? 'success' : confidence >= 0.7 ? 'info' : 'warning'}
                variant="outlined"
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {formatDate(updatedAt)}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MessageCard;
