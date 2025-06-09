import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

interface Thread {
  id: string;
  uid: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

function GeneralDiscussion() {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const navigate = useNavigate();

  // Fetch threads from Firestore
  const fetchThreads = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Disc_Posts"));
      const mappedThreads = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          uid: data.uid,
          author: data.Author,
          date: data.Date,
          title: data.Title,
          description: data.Description
        };
      });
      setThreads(mappedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  useEffect(() => {
    fetchThreads();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const extractedUsername = user.email?.split('@')[0] || 'Unknown User';
        setUsername(extractedUsername);
        setUserId(user.uid);
      } else {
        setUsername(null);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('You must be logged in to post.');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, "Disc_Posts"), {
        Author: username || 'Anonymous',
        uid: userId,
        Date: new Date().toISOString().split('T')[0],
        Comments: [],
        Title: title,
        Description: description,
      });

      await fetchThreads();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleDeleteThread = async (threadId: string, uid: string) => {
    try {
      if (!userId || userId !== uid) {
        alert('You can only delete your own threads.');
        return;
      }
      const db = getFirestore();
      const threadRef = doc(db, "Disc_Posts", threadId);
      const threadSnap = await getDoc(threadRef);
      if (!threadSnap.exists()) {
        alert('Thread not found.');
        return;
      }
      if (threadSnap.data().uid !== userId) {
        alert('Unauthorized: You are not allowed to delete this post.');
        return;
      }
      await deleteDoc(threadRef);
      await fetchThreads();
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  return (
    <div className="discussion-page">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="discussion-container">
        <nav className="breadcrumb">
          <Link to="/discussion" className="breadcrumb-link">Discussion</Link>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">General</span>
        </nav>
        <main className="thread-creation">
          <h2 className="thread-title">Create a Thread</h2>
          <form className="thread-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter thread title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter thread description"
                rows={4}
              />
            </div>
            <button className="create-thread-btn">CREATE THREAD</button>
          </form>
        </main>
        <DiscussionPreviews threads={threads} onDeleteThread={handleDeleteThread} currentUid={userId} />
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;