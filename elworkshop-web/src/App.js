import React from 'react';
import Router from './Router';
import './App.css';
import Navbar from './components/common/Navbar'


function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Router />
      </main>
      
      
    </div>
  );
}

export default App;
