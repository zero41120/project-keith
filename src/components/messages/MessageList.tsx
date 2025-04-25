import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Message, MessageStatus } from '../../types/message';
import MessageCard from './MessageCard';

// Props interface
interface MessageListProps {
  messages: Message[];
  status: MessageStatus | 'ALL';
  loading: boolean;
  onSelectMessage: (id: string) => void;
  selectedMessageId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  status,
  loading,
  onSelectMessage,
  selectedMessageId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages);

  // Filter messages when search query or messages change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = messages.filter(message => 
        message.question.toLowerCase().includes(query) || 
        message.response.toLowerCase().includes(query)
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Render empty state
  if (filteredMessages.length === 0) {
    return (
      <Box>
        <TextField
          fullWidth
          placeholder="Search messages..."
          variant="outlined"
          margin="normal"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="body1" color="text.secondary">
            {searchQuery ? 'No messages match your search' : `No ${status.toLowerCase()} messages found`}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Render message list
  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search messages..."
        variant="outlined"
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Box mt={2}>
        {filteredMessages.map(message => (
          <MessageCard
            key={message.id}
            message={message}
            onClick={onSelectMessage}
            selected={selectedMessageId === message.id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MessageList;
