import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link, useParams } from 'react-router-dom';
import CommentForm from '../../components/discussion/Commentform';

function ThreadNewsDetails() {
  const { id } = useParams<{ id: string }>();

  interface Comment {
    commentId: string;
    content: string;
    author: string;
    date: string;
  }

  interface Thread {
    id: string;
    title: string;
    description: string;
    author: string;
    date: string;
    comments: Comment[];
  }

  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`http://localhost:5000/news/post/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch thread');
        }
        const data = await response.json();
        console.log('Fetched thread:', data);

        // Map backend fields to match the Thread interface
        const mappedThread = {
          id: data.id,
          author: data.Author,
          date: data.Date,
          title: data.Title,
          description: data.Description,
          comments: data.Comments || [],
        };

        setThread(mappedThread);
        setComments(mappedThread.comments);
      } catch (error) {
        console.error('Error fetching thread:', error);
        setThread(null);
        setComments([]);
      }
    };

    fetchThread();
  }, [id]);

  const handleAddComment = async (commentText: string) => {
    if (!thread) return;

    const author = localStorage.getItem('username') || "Anonymous";
    const date = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(`http://localhost:5000/news/post/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author,
          content: commentText,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }

      const data = await response.json();
      const newComment = data.comment;
      
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally show error message to user
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="discussion-page">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="discussion-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <Link to="/discussion/news" className="breadcrumb-link">News</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">{thread.title}</span>
        </nav>

        <div className="thread-details-card">
          <h1 className="thread-title">{thread.title}</h1>
          <div className="thread-meta">
            <span className="thread-author">By {thread.author}</span>
            <span className="thread-date">{thread.date}</span>
          </div>
          <p className="thread-description">{thread.description}</p>
        </div>

        {/* Render Comments */}
        <div className="comments-section">
          <h2 className="comments-title">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.commentId} className="comment-card">
                <p className="discussion-comment">
                  <strong>{comment.author}:</strong> {comment.content}
                </p>
                <span className="comment-date">{comment.date}</span>
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

export default ThreadNewsDetails;