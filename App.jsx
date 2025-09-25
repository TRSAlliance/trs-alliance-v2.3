import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Crew from './pages/Crew';
import Funders from './pages/Funders';
import GrokShift from './pages/GrokShift';
import Contact from './pages/Contact';
import Try from './pages/Try';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/funders" element={<Funders />} />
        <Route path="/grokshift" element={<GrokShift />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/try" element={<Try />} />
      </Routes>
    </Router>
  );
}

export default App;
