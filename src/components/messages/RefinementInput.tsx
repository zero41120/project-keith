import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import { RefinementInput as RefinementInputType } from '../../types/message';

// Props interface
interface RefinementInputProps {
  messageId: string;
  onSubmit: (refinement: RefinementInputType) => Promise<void>;
  onCancel: () => void;
}

export const RefinementInput: React.FC<RefinementInputProps> = ({
  messageId,
  onSubmit,
  onCancel
}) => {
  const [guidance, setGuidance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuidance(event.target.value);
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate input
    if (guidance.trim() === '') {
      setError('Please provide guidance for regeneration');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        messageId,
        guidance: guidance.trim()
      });
      // Reset form after successful submission
      setGuidance('');
    } catch (err) {
      setError('Failed to submit refinement. Please try again.');
      console.error('Refinement submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Provide Guidance for Regeneration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Explain how the response should be improved or what specific information should be included.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Guidance"
          placeholder="E.g., Include more information about tax implications, focus on recent regulatory changes, etc."
          value={guidance}
          onChange={handleInputChange}
          error={!!error}
          helperText={error}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
        
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || guidance.trim() === ''}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Guidance'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RefinementInput;
