import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';

function GeneralDiscussion() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        <p> those who discuss</p>
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;