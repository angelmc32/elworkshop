import React, { useContext } from 'react';
import Router from './Router';
import { AppContext } from './AppContext';
import './App.css';
import Navbar from './components/common/Navbar'


function App() {

  const { user } = useContext(AppContext); // Destructure user state variable

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
