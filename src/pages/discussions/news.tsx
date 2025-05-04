import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link } from 'react-router-dom';

function News() {
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussions" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">News</span>
        </nav>

        <h1>News</h1>
      </div>
      <Footer />
    </div>
  );
}

export default News;