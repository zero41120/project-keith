// Message status types
export type MessageStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'LATER';

// Message history item interface
export interface MessageHistoryItem {
  id: string;
  messageId: string;
  response: string;
  confidence: number;
  createdAt: string;
}

// Message interface
export interface Message {
  id: string;
  customerId: string;
  auditorId: string;
  question: string;
  response: string;
  confidence: number;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  history: MessageHistoryItem[];
}

// Message filter options
export interface MessageFilterOptions {
  status?: MessageStatus | 'ALL';
  dateRange?: {
    start: string;
    end: string;
  };
  confidenceRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

// Refinement input for message regeneration
export interface RefinementInput {
  messageId: string;
  guidance: string;
}
