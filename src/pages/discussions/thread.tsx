import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link, useParams } from 'react-router-dom';
import threadsData from '../../data/threads.json'; // Import the JSON file
import NewsaData from '../../data/threads_news.json'; // Import the JSON file

function ThreadDetails() {
  const { id } = useParams<{ id: string }>();

  interface Comment {
    id: string;
    text: string;
    author: string;
  }

  interface Thread {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
    comments: Comment[];
  }

  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    // Load threads from localStorage
    const localThreads = JSON.parse(localStorage.getItem('threads') || '[]');

    // Combine threads from JSON files and localStorage
    const allThreads = [...threadsData, ...NewsaData, ...localThreads];

    // Find the thread by ID
    const foundThread = allThreads.find((thread) => thread.id === id);
    if (foundThread) {
      setThread({
        ...foundThread,
        createdAt: foundThread.date || new Date().toISOString().split('T')[0],
      });
    } else {
      setThread(null);
    }
  }, [id]);

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="discussion-page">
      <Header />
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/discussion/general" className="breadcrumb-link">General</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">{thread.title}</span>
        </nav>

        <h1>{thread.title}</h1>
        <p>Created by: {thread.author}</p>
        <p>{thread.description}</p>
        <p>Created at: {thread.createdAt}</p>

        {/* Render Comments */}
        <div className="comments-section">
          <h2>Comments</h2>
          {thread.comments.length > 0 ? (
            thread.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p><strong>{comment.author}:</strong> {comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ThreadDetails;