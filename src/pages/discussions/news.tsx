import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import PostPreviewNews from '../../components/discussion/PostPreviewNews';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "News_Posts"));
        const mappedThreads = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            author: data.Author,
            date: data.Date,
            title: data.Title,
            description: data.Description
          };
        });
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