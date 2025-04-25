import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { KnowledgeItem } from '../../types/knowledge';
import { knowledgeApi } from '../../api/apiClient';

interface KnowledgeItemDialogProps {
  open: boolean;
  item: KnowledgeItem | null;
  onClose: () => void;
  onSave: (updatedItem: KnowledgeItem) => void;
}

export const KnowledgeItemDialog: React.FC<KnowledgeItemDialogProps> = ({
  open,
  item,
  onClose,
  onSave
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update content when item changes
  useEffect(() => {
    if (item && typeof item.content === 'string') {
      setContent(item.content);
    }
  }, [item]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    if (!item) return;

    setLoading(true);
    setError(null);
    
    try {
      const updatedItem = await knowledgeApi.updateKnowledgeItem(item.id, {
        content,
        updatedAt: new Date().toISOString()
      });
      
      onSave(updatedItem);
      onClose();
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error('Error saving knowledge item:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const isTextFile = item.type === 'file' && item.filename?.toLowerCase().endsWith('.txt');
  const canEdit = item.type === 'text' || isTextFile;
  const title = item.filename || 'Text Entry';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="knowledge-item-dialog-title"
    >
      <DialogTitle id="knowledge-item-dialog-title">
        {title}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={12}
            variant="outlined"
            value={content}
            onChange={handleContentChange}
            disabled={!canEdit}
            sx={{ mt: 1 }}
            inputProps={{
              'data-testid': 'knowledge-item-content'
            }}
          />
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          disabled={loading || !canEdit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
