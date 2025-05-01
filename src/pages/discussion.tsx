import React from 'react';
import '../styles/discussion.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { Link } from 'react-router-dom';

function Discussion() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        <h1>Discussion Board</h1>
        <p>Welcome to the discussion board! Choose a section below:</p>
        <div className="discussion-sections">
          <Link to="/discussion/rules" className="discussion-card">
            <h2>Rules</h2>
            <p>Learn about the rules of the discussion board.</p>
          </Link>
          <Link to="/discussion/news" className="discussion-card">
            <h2>News</h2>
            <p>Stay updated with the latest news.</p>
          </Link>
          <Link to="/discussion/general" className="discussion-card">
            <h2>General Discussion</h2>
            <p>Join the conversation and share your thoughts.</p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Discussion;