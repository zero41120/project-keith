import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Message, MessageStatus } from '../../types/message';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import { messageApi } from '../../api/apiClient';

// Props interface
interface MessageQueueProps {
  auditorId: string;
}

// Tab panel props interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Tab props
const a11yProps = (index: number) => {
  return {
    id: `message-tab-${index}`,
    'aria-controls': `message-tabpanel-${index}`,
  };
};

// Status mapping for tabs
const tabStatusMap: MessageStatus[] = ['PENDING', 'LATER', 'APPROVED', 'REJECTED'];

export const MessageQueue: React.FC<MessageQueueProps> = ({ auditorId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Fetch messages based on current tab
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = tabStatusMap[tabIndex];
        const fetchedMessages = await messageApi.getMessages(auditorId, status);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [auditorId, tabIndex]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSelectedMessage(null);
  };

  // Handle message selection
  const handleSelectMessage = async (id: string) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      const message = await messageApi.getMessage(id);
      setSelectedMessage(message);
    } catch (err) {
      console.error('Error fetching message details:', err);
      setDetailError('Failed to load message details. Please try again.');
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = async (id: string, status: MessageStatus) => {
    try {
      const updatedMessage = await messageApi.updateMessageStatus(id, status);
      
      // Update the selected message
      setSelectedMessage(updatedMessage);
      
      // If the status changed to something different than the current tab,
      // remove it from the current tab's message list
      if (status !== tabStatusMap[tabIndex]) {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
      } else {
        // Otherwise, update it in the list
        setMessages(prevMessages => 
          prevMessages.map(msg => msg.id === id ? updatedMessage : msg)
        );
      }
    } catch (err) {
      console.error('Error updating message status:', err);
      throw err; // Let the MessageDetail component handle the error
    }
  };

  // Handle regenerate response
  const handleRegenerateResponse = async (messageId: string, guidance: string) => {
    try {
      const updatedMessage = await messageApi.regenerateResponse({
        messageId,
        guidance
      });
      
      // Update the selected message
      setSelectedMessage(updatedMessage);
      
      // Update the message in the list
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === messageId ? updatedMessage : msg)
      );
    } catch (err) {
      console.error('Error regenerating response:', err);
      throw err; // Let the MessageDetail component handle the error
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      {/* Left side: Tabs and Message List */}
      <Box sx={{ width: { xs: '100%', md: '40%' } }}>
        <Paper elevation={1}>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth"
            aria-label="message queue tabs"
          >
            <Tab label="Pending" {...a11yProps(0)} />
            <Tab label="Later" {...a11yProps(1)} />
            <Tab label="Approved" {...a11yProps(2)} />
            <Tab label="Rejected" {...a11yProps(3)} />
          </Tabs>

          {error && (
            <Box p={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <Box p={2}>
            {tabStatusMap.map((status, index) => (
              <TabPanel key={status} value={tabIndex} index={index}>
                <MessageList
                  messages={messages}
                  status={status}
                  loading={loading}
                  onSelectMessage={handleSelectMessage}
                  selectedMessageId={selectedMessage?.id}
                />
              </TabPanel>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Right side: Message Detail */}
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        <MessageDetail
          message={selectedMessage}
          loading={detailLoading}
          error={detailError}
          onUpdateStatus={handleUpdateStatus}
          onRegenerateResponse={handleRegenerateResponse}
        />
      </Box>
    </Box>
  );
};

export default MessageQueue;
