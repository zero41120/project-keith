import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder which is required by React Router
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}
