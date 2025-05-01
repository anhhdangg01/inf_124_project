import React from 'react';
import '../styles/discussion.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

function Discussion() {
  return (
    <div className="App">
      <Header />
      <h1>Discussion Page</h1>
      <p>Welcome to the discussion page!</p>
      <Footer />
    </div>
  );
}

export default Discussion;