import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import threadsData from '../../data/threads_news.json';

function News() {
  const [thread, setThread] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ thread });
    setThread('');
  };

  return (
    <div className="discussion-page">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="discussion-container">
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">News</span>
        </nav>
        <h1> News</h1>
        <DiscussionPreviews threads={threadsData} />
      </div>
      <Footer />
    </div>
  );
}

export default News;