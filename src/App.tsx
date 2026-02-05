import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Home />
        <Doctors />
        <Appointments />
      </main>
      <Footer />
    </div>
  );
}

export default App;
