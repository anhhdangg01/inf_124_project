import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';

function News() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        <h1>News</h1>
      </div>
      <Footer />
    </div>
  );
}

export default News;