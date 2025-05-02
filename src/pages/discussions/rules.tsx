import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';

function Rules() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        <h1>Rules</h1>
      </div>
      <Footer />
    </div>
  );
}

export default Rules;