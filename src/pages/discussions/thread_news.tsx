import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import { Link, useParams } from 'react-router-dom';
import CommentForm from '../../components/discussion/Commentform';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function ThreadNewsDetails() {
  const { id } = useParams<{ id: string }>();

  interface Comment {
    commentId: string;
    content: string;
    author: string;
    date: string;
    uid: string;
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
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const db = getFirestore();
        const threadRef = doc(db, "News_Posts", id!);
        const threadSnap = await getDoc(threadRef);
        if (!threadSnap.exists()) throw new Error('Thread not found');
        const data = threadSnap.data();
        const mappedThread = {
          id: threadSnap.id,
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
    if (!thread || !userUid) return;

    const author = localStorage.getItem('username') || "Anonymous";
    const date = new Date().toISOString().split('T')[0];
    const newComment: Comment = {
      commentId: Date.now().toString(),
      content: commentText,
      author,
      date,
      uid: userUid,
    };

    try {
      const db = getFirestore();
      const threadRef = doc(db, "News_Posts", id!);
      await updateDoc(threadRef, {
        Comments: arrayUnion(newComment),
      });
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!thread || !userUid) return;

    try {
      const db = getFirestore();
      const threadRef = doc(db, "News_Posts", id!);
      const threadSnap = await getDoc(threadRef);
      if (!threadSnap.exists()) return;
      const data = threadSnap.data();
      const updatedComments = (data.Comments || []).filter((comment: Comment) => comment.commentId !== commentId || comment.uid !== userUid);
      await updateDoc(threadRef, { Comments: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="discussion-page">
      <Header />
      <div style={{ marginTop: '100px' }}></div>
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
                <br/>
                {userUid === comment.uid && (
                  <button className="dele_button" onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
                )}
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