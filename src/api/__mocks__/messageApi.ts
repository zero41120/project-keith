import { Message, MessageStatus, RefinementInput } from '../../types/message';
import { v4 as uuidv4 } from 'uuid';

// Mock data store
let mockMessages: Message[] = [
  {
    id: '1',
    customerId: 'customer-1',
    auditorId: 'auditor-1',
    question: 'What are the tax implications of selling my rental property?',
    response: 'When selling a rental property, you\'ll need to consider capital gains tax, depreciation recapture, and potential 1031 exchange options. The specific tax implications depend on how long you\'ve owned the property and your overall tax situation.',
    confidence: 0.92,
    status: 'PENDING',
    createdAt: '2025-04-24T09:30:00Z',
    updatedAt: '2025-04-24T09:30:00Z',
    history: []
  },
  {
    id: '2',
    customerId: 'customer-2',
    auditorId: 'auditor-1',
    question: 'Should I convert my traditional IRA to a Roth IRA this year?',
    response: 'Converting to a Roth IRA means paying taxes now for tax-free withdrawals later. This could be beneficial if you expect to be in a higher tax bracket during retirement or if tax rates increase. Consider your current income, expected retirement income, and available funds to pay the conversion tax.',
    confidence: 0.78,
    status: 'APPROVED',
    createdAt: '2025-04-23T14:15:00Z',
    updatedAt: '2025-04-24T10:45:00Z',
    history: [
      {
        id: '101',
        messageId: '2',
        response: 'Converting from a traditional IRA to a Roth IRA could be beneficial depending on your tax situation.',
        confidence: 0.65,
        createdAt: '2025-04-23T14:15:00Z'
      }
    ]
  },
  {
    id: '3',
    customerId: 'customer-3',
    auditorId: 'auditor-1',
    question: 'How should I allocate my 401(k) investments?',
    response: 'Your 401(k) allocation should be based on your age, risk tolerance, and retirement timeline. A common guideline is to subtract your age from 110 to determine your stock percentage, with the remainder in bonds. Consider diversifying across different asset classes and regularly rebalancing your portfolio.',
    confidence: 0.88,
    status: 'LATER',
    createdAt: '2025-04-22T11:20:00Z',
    updatedAt: '2025-04-22T16:30:00Z',
    history: []
  },
  {
    id: '4',
    customerId: 'customer-1',
    auditorId: 'auditor-1',
    question: 'What tax deductions can I claim for my home office?',
    response: 'For a home office, you can claim deductions using either the simplified method ($5 per square foot, up to 300 sq ft) or the regular method (based on actual expenses). The space must be used regularly and exclusively for business. You can deduct a portion of rent/mortgage, utilities, insurance, and repairs proportional to your office space.',
    confidence: 0.95,
    status: 'REJECTED',
    createdAt: '2025-04-21T08:45:00Z',
    updatedAt: '2025-04-21T13:10:00Z',
    history: []
  },
  {
    id: '5',
    customerId: 'customer-4',
    auditorId: 'auditor-1',
    question: 'How do I report cryptocurrency gains on my taxes?',
    response: 'Cryptocurrency is treated as property by the IRS. You must report capital gains or losses when you sell, trade, or use crypto to purchase goods/services. Use Form 8949 and Schedule D. Keep detailed records of acquisition dates, cost basis, and sale proceeds. Mining and staking rewards are typically reported as ordinary income.',
    confidence: 0.82,
    status: 'PENDING',
    createdAt: '2025-04-20T15:30:00Z',
    updatedAt: '2025-04-20T15:30:00Z',
    history: []
  }
];

// Get all messages for an auditor with optional status filter
export const getMessages = async (auditorId: string, status?: MessageStatus): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredMessages = mockMessages.filter(message => message.auditorId === auditorId);
  
  if (status) {
    filteredMessages = filteredMessages.filter(message => message.status === status);
  }
  
  return filteredMessages;
};

// Get a single message by ID
export const getMessage = async (id: string): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const message = mockMessages.find(message => message.id === id);
  
  if (!message) {
    throw new Error(`Message with id ${id} not found`);
  }
  
  return message;
};

// Update message status
export const updateMessageStatus = async (id: string, status: MessageStatus): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const messageIndex = mockMessages.findIndex(message => message.id === id);
  
  if (messageIndex === -1) {
    throw new Error(`Message with id ${id} not found`);
  }
  
  const updatedMessage = {
    ...mockMessages[messageIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  mockMessages[messageIndex] = updatedMessage;
  return updatedMessage;
};

// Regenerate response with refinement
export const regenerateResponse = async (refinement: RefinementInput): Promise<Message> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const messageIndex = mockMessages.findIndex(message => message.id === refinement.messageId);
  
  if (messageIndex === -1) {
    throw new Error(`Message with id ${refinement.messageId} not found`);
  }
  
  const message = mockMessages[messageIndex];
  
  // Add current response to history
  const historyItem = {
    id: uuidv4(),
    messageId: message.id,
    response: message.response,
    confidence: message.confidence,
    createdAt: message.updatedAt
  };
  
  // Generate a "new" response based on the refinement
  // In a real app, this would call an AI service
  const newConfidence = Math.min(0.99, message.confidence + 0.05);
  const newResponse = `${message.response} [Refined based on: ${refinement.guidance}]`;
  
  const updatedMessage = {
    ...message,
    response: newResponse,
    confidence: newConfidence,
    updatedAt: new Date().toISOString(),
    history: [...message.history, historyItem]
  };
  
  mockMessages[messageIndex] = updatedMessage;
  return updatedMessage;
};

// Reset mock data (useful for testing)
export const resetMockData = (): void => {
  mockMessages = [
    {
      id: '1',
      customerId: 'customer-1',
      auditorId: 'auditor-1',
      question: 'What are the tax implications of selling my rental property?',
      response: 'When selling a rental property, you\'ll need to consider capital gains tax, depreciation recapture, and potential 1031 exchange options. The specific tax implications depend on how long you\'ve owned the property and your overall tax situation.',
      confidence: 0.92,
      status: 'PENDING',
      createdAt: '2025-04-24T09:30:00Z',
      updatedAt: '2025-04-24T09:30:00Z',
      history: []
    },
    {
      id: '2',
      customerId: 'customer-2',
      auditorId: 'auditor-1',
      question: 'Should I convert my traditional IRA to a Roth IRA this year?',
      response: 'Converting to a Roth IRA means paying taxes now for tax-free withdrawals later. This could be beneficial if you expect to be in a higher tax bracket during retirement or if tax rates increase. Consider your current income, expected retirement income, and available funds to pay the conversion tax.',
      confidence: 0.78,
      status: 'APPROVED',
      createdAt: '2025-04-23T14:15:00Z',
      updatedAt: '2025-04-24T10:45:00Z',
      history: [
        {
          id: '101',
          messageId: '2',
          response: 'Converting from a traditional IRA to a Roth IRA could be beneficial depending on your tax situation.',
          confidence: 0.65,
          createdAt: '2025-04-23T14:15:00Z'
        }
      ]
    },
    {
      id: '3',
      customerId: 'customer-3',
      auditorId: 'auditor-1',
      question: 'How should I allocate my 401(k) investments?',
      response: 'Your 401(k) allocation should be based on your age, risk tolerance, and retirement timeline. A common guideline is to subtract your age from 110 to determine your stock percentage, with the remainder in bonds. Consider diversifying across different asset classes and regularly rebalancing your portfolio.',
      confidence: 0.88,
      status: 'LATER',
      createdAt: '2025-04-22T11:20:00Z',
      updatedAt: '2025-04-22T16:30:00Z',
      history: []
    },
    {
      id: '4',
      customerId: 'customer-1',
      auditorId: 'auditor-1',
      question: 'What tax deductions can I claim for my home office?',
      response: 'For a home office, you can claim deductions using either the simplified method ($5 per square foot, up to 300 sq ft) or the regular method (based on actual expenses). The space must be used regularly and exclusively for business. You can deduct a portion of rent/mortgage, utilities, insurance, and repairs proportional to your office space.',
      confidence: 0.95,
      status: 'REJECTED',
      createdAt: '2025-04-21T08:45:00Z',
      updatedAt: '2025-04-21T13:10:00Z',
      history: []
    },
    {
      id: '5',
      customerId: 'customer-4',
      auditorId: 'auditor-1',
      question: 'How do I report cryptocurrency gains on my taxes?',
      response: 'Cryptocurrency is treated as property by the IRS. You must report capital gains or losses when you sell, trade, or use crypto to purchase goods/services. Use Form 8949 and Schedule D. Keep detailed records of acquisition dates, cost basis, and sale proceeds. Mining and staking rewards are typically reported as ordinary income.',
      confidence: 0.82,
      status: 'PENDING',
      createdAt: '2025-04-20T15:30:00Z',
      updatedAt: '2025-04-20T15:30:00Z',
      history: []
    }
  ];
};
