import React, { useState, ChangeEvent } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

interface TextEntryProps {
  onTextSubmit: (text: string) => void;
}

export const TextEntry: React.FC<TextEntryProps> = ({ onTextSubmit }) => {
  const [text, setText] = useState('');
  const [formats, setFormats] = useState<string[]>([]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFormatChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text);
      setText('');
      setFormats([]);
    }
  };

  // Apply formatting to text (in a real app, this would be more sophisticated)
  const applyFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        return { fontWeight: 'bold' };
      case 'italic':
        return { fontStyle: 'italic' };
      case 'underlined':
        return { textDecoration: 'underline' };
      default:
        return {};
    }
  };

  // Combine all active format styles
  const textStyles = formats.reduce((styles, format) => {
    return { ...styles, ...applyFormatting(format) };
  }, {});

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Knowledge Entry
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormatChange}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton value="bold" aria-label="Bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="Italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="Underline">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="bullet" aria-label="Bullet List">
            <FormatListBulletedIcon />
          </ToggleButton>
          <ToggleButton value="number" aria-label="Numbered List">
            <FormatListNumberedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <TextField
        data-testid="text-editor"
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        placeholder="Enter knowledge base text here..."
        value={text}
        onChange={handleTextChange}
        InputProps={{
          style: textStyles as React.CSSProperties,
        }}
        sx={{ mb: 2 }}
      />
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        disabled={!text.trim()}
      >
        Submit
      </Button>
    </Paper>
  );
};
