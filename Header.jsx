import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
  <nav className="p-4 bg-white dark:bg-gray-800 shadow flex justify-center space-x-6 text-lg font-medium">
    <NavLink to="/" className="hover:underline">Home</NavLink>
    <NavLink to="/about" className="hover:underline">About</NavLink>
    <NavLink to="/crew" className="hover:underline">Crew</NavLink>
    <NavLink to="/funders" className="hover:underline">Funders</NavLink>
    <NavLink to="/grokshift" className="hover:underline">GrokShift</NavLink>
    <NavLink to="/contact" className="hover:underline">Contact</NavLink>
    <NavLink to="/try" className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">Try TRS</NavLink>
  </nav>
);

export default Header;
