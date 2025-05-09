import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import threadsData from '../../data/threads.json'; // Import the JSON file
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function GeneralDiscussion() {
  const [username, setUsername] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threads, setThreads] = useState(threadsData); // Initialize with JSON data
  const navigate = useNavigate();

  // Load threads from localStorage on component mount
  useEffect(() => {
    const localThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    setThreads([...threadsData, ...localThreads]); // Combine JSON and localStorage threads
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const extractedUsername = user.email?.split('@')[0] || 'Unknown User';
            setUsername(extractedUsername);
        } else {
            setUsername(null);
        }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new thread object
    const newThread = {
        id: Date.now().toString(), // Generate a unique ID
        title,
        description,
        date: new Date().toISOString().split('T')[0],
        author: username || 'Anonymous',
        comments: []
    };
    // Save the new thread to localStorage
    const localThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    const updatedThreads = [...localThreads, newThread];
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
 
    // Update the state to include the new thread
    setThreads((prevThreads) => [...(prevThreads || []), newThread]);

    // Clear the form fields
    setTitle('');
    setDescription('');
  };

  return (
    <div className="discussion-page">
      <Header />
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
        <DiscussionPreviews threads={threads} /> {/* Pass combined threads */}
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;