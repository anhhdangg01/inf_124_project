import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link } from 'react-router-dom';

function Rules() {
  return (
    <div className="discussion-page">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">Community Guidelines</span>
        </nav>

        <div className="rules-header">
          <h1>📜 Community Guidelines</h1>
          <p className="rules-intro">
            Welcome to our community! These guidelines help maintain a positive environment for everyone.
            Please read them carefully before participating in discussions.
          </p>
        </div>

        <div className="rules-content">
          <div className="rules-section">
            <h2>🫂 Respect & Inclusion</h2>
            <ul className="rules-list">
              <li>• Treat all members with kindness and respect</li>
              <li>• No hate speech, discrimination, or harassment of any kind</li>
              <li>• Be mindful of cultural differences and diverse perspectives</li>
            </ul>
          </div>

          <div className="rules-section">
            <h2>🗣️ Discussion Etiquette</h2>
            <ul className="rules-list">
              <li>• Stay on topic and keep discussions productive</li>
              <li>• Use clear, constructive language when disagreeing</li>
              <li>• Avoid excessive caps, emojis, or text formatting</li>
            </ul>
          </div>

          <div className="rules-section">
            <h2>🛡️ Safety & Privacy</h2>
            <ul className="rules-list">
              <li>• Never share personal information (yours or others')</li>
              <li>• Report suspicious activity to moderators immediately</li>
              <li>• Content must comply with all applicable laws</li>
            </ul>
          </div>

          <div className="rules-section">
            <h2>🚫 Prohibited Content</h2>
            <ul className="rules-list">
              <li>• No spam, advertisements, or unauthorized promotions</li>
              <li>• No NSFW, violent, or illegal content</li>
              <li>• No misinformation or deliberately misleading posts</li>
            </ul>
          </div>

          <div className="rules-footer">
            <p>
              ⚠️ Violations may result in content removal, warnings, or account suspension.
              Moderators have final discretion in applying these guidelines.
            </p>
            <p className="rules-questions">
              Questions? Contact our <Link to="/contact" className="rules-contact-link">moderation team</Link>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Rules;