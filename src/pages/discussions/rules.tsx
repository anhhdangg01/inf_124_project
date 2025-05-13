import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link } from 'react-router-dom';

function Rules() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">Rules</span>
        </nav>

        <h1>Rules</h1>
        <ul className="rules-list">
          <li>1. Be respectful to others. No hate speech or harassment.</li>
          <li>2. Stay on topic. Keep discussions relevant to the section.</li>
          <li>3. No spamming or self-promotion without permission.</li>
          <li>4. Avoid sharing personal information.</li>
          <li>5. Follow all applicable laws and community guidelines.</li>
          <li>6. Report inappropriate content to moderators.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default Rules;