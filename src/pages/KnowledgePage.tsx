import React, { useState } from 'react';
import { Container } from '@mui/material';
import { KnowledgeBase } from '../components/knowledge/KnowledgeBase';
import { KnowledgeItem } from '../types/knowledge';

const KnowledgePage: React.FC = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);

  const handleAddKnowledgeItem = (item: Omit<KnowledgeItem, 'id'>) => {
    console.log('Adding knowledge item:', item);
    // In a real app, this would be handled by the API client
    // For now, we're just logging it
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <KnowledgeBase 
        onAddKnowledgeItem={handleAddKnowledgeItem}
      />
    </Container>
  );
};

export default KnowledgePage;
