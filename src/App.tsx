import React from 'react';
import './App.css';

function App() {
  return (
    <div data-testid="app-layout" className="app-layout">
      <div data-testid="sidebar" className="sidebar">
        <h1>Keith's Auditor Dashboard</h1>
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#knowledge-base">Knowledge Base</a></li>
            <li><a href="#messages">Messages</a></li>
          </ul>
        </nav>
      </div>
      <div data-testid="main-content" className="main-content">
        <h2>Welcome to your Auditor Dashboard</h2>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
}

export default App;
