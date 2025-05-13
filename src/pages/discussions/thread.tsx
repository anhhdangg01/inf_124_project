import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link, useParams } from 'react-router-dom';
import threadsData from '../../data/threads.json'; // Import the JSON file
import NewsaData from '../../data/threads_news.json'; // Import the JSON file
import CommentForm from '../../components/discussion/Commentform';

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
  const [comments, setComments] = useState<Comment[]>([]);

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
      setComments(foundThread.comments || []);
    } else {
      setThread(null);
      setComments([]);
    }
  }, [id]);

  const handleAddComment = (commentText: string) => {
    if (!thread) return;

    // Get author from localStorage, fallback to "Anonymous"
    const author = localStorage.getItem('username') || "Anonymous";

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: author,
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    // Optionally, update localStorage if you want to persist comments
    const localThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    const threadIndex = localThreads.findIndex((t: Thread) => t.id === thread.id);
    if (threadIndex !== -1) {
      localThreads[threadIndex].comments = updatedComments;
      localStorage.setItem('threads', JSON.stringify(localThreads));
    }
  };

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

        <div className="thread-details-card">
          <h1 className="thread-title">{thread.title}</h1>
          <div className="thread-meta">
            <span className="thread-author">By {thread.author}</span>
            <span className="thread-date">{thread.createdAt}</span>
          </div>
          <p className="thread-description">{thread.description}</p>
        </div>

        {/* Render Comments */}
        <div className="comments-section">
          <h2 className="comments-title">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <p className="discussion-comment"><strong>{comment.author}:</strong> {comment.text}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet.</p>
          )}
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ThreadDetails;