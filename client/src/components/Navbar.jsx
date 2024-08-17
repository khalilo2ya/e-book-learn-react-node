import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assure-toi d'avoir le fichier CSS pour les styles

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">BookShop</Link>
        <nav className="navbar-menu">
          {/* <Link to="/" className="navbar-link">Home</Link> */}
          <Link to="/add" className="navbar-link">Add Book</Link>
          {/* Ajouter d'autres liens si nécessaire */}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
