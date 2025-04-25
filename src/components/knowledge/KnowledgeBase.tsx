import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  SelectChangeEvent,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { FileUploader } from './FileUploader';
import { TextEntry } from './TextEntry';
import { KnowledgeItemDialog } from './KnowledgeItemDialog';
import { KnowledgeItem, KnowledgeFilterOptions } from '../../types/knowledge';
import { knowledgeApi } from '../../api/apiClient';

interface KnowledgeBaseProps {
  onAddKnowledgeItem: (item: Omit<KnowledgeItem, 'id'>) => void;
  initialItems?: KnowledgeItem[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ 
  onAddKnowledgeItem,
  initialItems = []
}) => {
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<KnowledgeFilterOptions>({
    type: 'all',
    searchQuery: ''
  });
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch knowledge items on component mount if no initial items provided
  useEffect(() => {
    if (initialItems.length === 0) {
      fetchKnowledgeItems();
    }
  }, []); // Empty dependency array to run only once on mount

  const fetchKnowledgeItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using a fixed auditor ID for demo purposes
      const auditorId = 'auditor-1';
      const fetchedItems = await knowledgeApi.getKnowledgeItems(auditorId);
      setItems(fetchedItems);
    } catch (err) {
      setError('Failed to load knowledge items. Please try again.');
      console.error('Error fetching knowledge items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const newItem: Omit<KnowledgeItem, 'id'> = {
        auditorId: 'auditor-1', // Fixed auditor ID for demo
        type: 'file',
        content: file,
        filename: file.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Call the parent component's handler
      onAddKnowledgeItem(newItem);
      
      // Add to local state (in a real app, we'd wait for API response)
      const addedItem = await knowledgeApi.addKnowledgeItem(newItem);
      setItems(prevItems => [...prevItems, addedItem]);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', err);
    }
  };

  const handleTextSubmit = async (text: string) => {
    try {
      const newItem: Omit<KnowledgeItem, 'id'> = {
        auditorId: 'auditor-1', // Fixed auditor ID for demo
        type: 'text',
        content: text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Call the parent component's handler
      onAddKnowledgeItem(newItem);
      
      // Add to local state (in a real app, we'd wait for API response)
      const addedItem = await knowledgeApi.addKnowledgeItem(newItem);
      setItems(prevItems => [...prevItems, addedItem]);
    } catch (err) {
      setError('Failed to add text entry. Please try again.');
      console.error('Error adding text entry:', err);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(prev => ({
      ...prev,
      type: event.target.value as KnowledgeFilterOptions['type']
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      searchQuery: event.target.value
    }));
  };

  const handleItemClick = (item: KnowledgeItem) => {
    // Only allow opening text items or txt files
    const isTextFile = item.type === 'file' && item.filename?.toLowerCase().endsWith('.txt');
    if (item.type === 'text' || isTextFile) {
      setSelectedItem(item);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleItemUpdate = (updatedItem: KnowledgeItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  // Memoize filtered items to prevent unnecessary re-renders
  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      // Filter by type
      if (filter.type !== 'all' && item.type !== filter.type) {
        return false;
      }
      
      // Filter by search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const contentMatch = typeof item.content === 'string' && 
          item.content.toLowerCase().includes(query);
        const filenameMatch = item.filename && 
          item.filename.toLowerCase().includes(query);
        
        return contentMatch || filenameMatch;
      }
      
      return true;
    });
  }, [items, filter.type, filter.searchQuery]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Knowledge Base
      </Typography>
      
      {/* File Upload Section */}
      <FileUploader onFileUpload={handleFileUpload} />
      
      {/* Text Entry Section */}
      <TextEntry onTextSubmit={handleTextSubmit} />
      
      {/* Knowledge List Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Knowledge Items</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Search Input */}
            <TextField
              placeholder="Search knowledge base..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={filter.searchQuery}
              onChange={handleSearchChange}
            />
            
            {/* Filter Dropdown */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="filter-type-label">Filter by type:</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filter.type}
                label="Filter by type:"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="file">Files</MenuItem>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Knowledge Items List */}
        <Box data-testid="knowledge-list" sx={{ minHeight: '300px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredItems.length === 0 ? (
            <Typography color="text.secondary">
              No knowledge items found. Upload a file or add text to get started.
            </Typography>
          ) : (
            <List>
              {filteredItems.map((item) => {
                const isTextFile = item.type === 'file' && item.filename?.toLowerCase().endsWith('.txt');
                const isClickable = item.type === 'text' || isTextFile;
                
                return (
                  <ListItem 
                    key={item.id} 
                    divider
                    disablePadding
                  >
                    <ListItemButton 
                      onClick={() => handleItemClick(item)}
                      disabled={!isClickable}
                      sx={{ 
                        cursor: isClickable ? 'pointer' : 'default',
                        '&.Mui-disabled': {
                          opacity: 1,
                        }
                      }}
                    >
                      <ListItemIcon>
                        {item.type === 'file' ? <DescriptionIcon /> : <TextSnippetIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.filename || 'Text Entry'}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {item.type === 'file' 
                                ? `File uploaded on ${new Date(item.createdAt).toLocaleDateString()}${!isTextFile ? ' (Not editable)' : ''}`
                                : typeof item.content === 'string' 
                                  ? item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '')
                                  : 'Content not available'
                              }
                            </Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>
      
      {/* Dialog for viewing/editing knowledge item content */}
      <KnowledgeItemDialog
        open={dialogOpen}
        item={selectedItem}
        onClose={handleDialogClose}
        onSave={handleItemUpdate}
      />
    </Box>
  );
};
