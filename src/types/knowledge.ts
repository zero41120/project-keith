// Knowledge item types
export type KnowledgeItemType = 'file' | 'text';

// Knowledge item interface
export interface KnowledgeItem {
  id: string;
  auditorId: string;
  type: KnowledgeItemType;
  content: string | File;
  filename?: string;
  createdAt: string;
  updatedAt: string;
}

// Knowledge filter options
export interface KnowledgeFilterOptions {
  type?: KnowledgeItemType | 'all';
  searchQuery?: string;
}
