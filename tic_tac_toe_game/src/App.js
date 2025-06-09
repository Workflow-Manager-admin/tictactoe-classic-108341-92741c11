import React from 'react';
import './App.css';
import TicTacToeClassic from './TicTacToeClassic';

// Replace the template hero/main section with TicTacToeClassic component
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn" tabIndex={-1}>Template Button</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <TicTacToeClassic />
        </div>
      </main>
    </div>
  );
}

export default App;