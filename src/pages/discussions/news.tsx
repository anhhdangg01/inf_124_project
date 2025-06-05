import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import PostPreviewNews from '../../components/discussion/PostPreviewNews';

interface Thread {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

function News() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log('Fetching news threads from backend...');
        const response = await fetch('http://localhost:5000/news/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch news threads');
        }
        const data = await response.json();

        const mappedThreads = data.map((thread: any) => ({
          id: thread.id,
          author: thread.Author,
          date: thread.Date,
          title: thread.Title,
          description: thread.Description
        }));

        setThreads(mappedThreads);
      } catch (error) {
        console.error('Error fetching news threads:', error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <div className="discussion-page">
      <Header />
      <div style={{ marginTop: '100px' }}></div>
      <div className="discussion-container">
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">News</span>
        </nav>
        <h1>News</h1>
        <PostPreviewNews threads={threads} />
      </div>
      <Footer />
    </div>
  );
}

export default News;