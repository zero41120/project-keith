import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import pages
import DashboardPage from './pages/DashboardPage';
import KnowledgePage from './pages/KnowledgePage';
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <Router>
      <div data-testid="app-layout" className="app-layout">
        <div data-testid="sidebar" className="sidebar">
          <h1>Keith's Auditor Dashboard</h1>
          <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/knowledge">Knowledge Base</Link></li>
              <li><Link to="/messages">Messages</Link></li>
            </ul>
          </nav>
        </div>
        <div data-testid="main-content" className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
