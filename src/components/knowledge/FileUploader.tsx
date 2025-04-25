import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  acceptedTypes = ['.txt'] 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(fileExtension)) {
      const acceptedTypesString = acceptedTypes.join(' or ').replace(/\./g, '').toUpperCase();
      setError(`Unsupported file type. Please upload a ${acceptedTypesString} file.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        data-testid="drop-zone"
        elevation={3}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragOver ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
        className={isDragOver ? 'dragover' : ''}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          data-testid="file-input"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInput}
          accept={acceptedTypes.join(',')}
        />
        <Typography variant="h6" component="div" gutterBottom>
          Drag & Drop Files Here
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          or
        </Typography>
        <Button variant="contained" color="primary">
          Browse Files
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Supported formats: {acceptedTypes.join(', ')}
        </Typography>
      </Paper>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
