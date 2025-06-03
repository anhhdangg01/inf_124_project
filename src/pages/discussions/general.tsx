import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface Thread {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

function GeneralDiscussion() {
  const [username, setUsername] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]); // Initialize as an empty array
  const navigate = useNavigate();

  // Fetch threads from the backend API
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        console.log('Fetching threads from backend...');
        const response = await fetch('http://localhost:5000/discussions/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }
        const data = await response.json();

        // Map backend fields to match the Thread interface
        const mappedThreads = data.map((thread: any) => ({
          id: thread.id,
          author: thread.Author,
          date: thread.Date,
          title: thread.Title,
          description: thread.Description
          
        }));

        setThreads(mappedThreads);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    fetchThreads();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/discussions/posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Author: username || 'Anonymous',
          Date: new Date().toISOString().split('T')[0],
          Comments: [], // Add the Comments array here
          Title: title,
          Description: description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.status}`);
      }

      // Optionally, handle the response from the backend (e.g., show a success message)
      const responseData = await response.json();
      console.log('Thread created successfully:', responseData);

      // Fetch threads again to update the list
      const fetchThreads = async () => {
        try {
          console.log('Fetching threads from backend...');
          const response = await fetch('http://localhost:5000/discussions/posts');
          if (!response.ok) {
            throw new Error('Failed to fetch threads');
          }
          const data = await response.json();

          // Map backend fields to match the Thread interface
          const mappedThreads = data.map((thread: any) => ({
            id: thread.id,
            author: thread.Author,
            date: thread.Date,
            title: thread.Title,
            description: thread.Description
            
          }));

          setThreads(mappedThreads);
        } catch (error) {
          console.error('Error fetching threads:', error);
        }
      };

      fetchThreads();

      // Clear the form fields
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating thread:', error);
      // Optionally, show an error message to the user
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
        <DiscussionPreviews threads={threads} /> {/* Pass fetched threads */}
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;