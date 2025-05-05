import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link, useParams } from 'react-router-dom';

function ThreadDetails() {
  const { id } = useParams();

  interface Thread {
    title: string;
    description: string;
    author: string;
    createdAt: string;
  }

  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const response = await fetch(`/api/threads/${id}`);
        const data = await response.json();
        setThread(data);
      } catch (err) {
        console.error('Failed to fetch thread details:', err);
      }
    };

    fetchThreadDetails();
  }, [id]);

  if (!thread) {
    return <div>Loading...</div>;
  }
 {/* implementation kinda */}
  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussions" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">{thread.title}</span>
        </nav>

        <h1>{thread.title}</h1>
        <p>{thread.description}</p>
        <p>Created by: {thread.author}</p>
        <p>Created at: {thread.createdAt}</p>
      </div>
      <Footer />
    </div>
  );
}

export default ThreadDetails;