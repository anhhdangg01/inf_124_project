import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';
import threadsData from '../../data/threads.json'; // Import the JSON file

function GeneralDiscussion() {
  const [thread, setThread] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ thread });
    setThread('');
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
              <label htmlFor="thread">Title / Description</label>
              <input
                type="text"
                name="thread"
                id="thread"
                required
                value={thread}
                onChange={(e) => setThread(e.target.value)}
                placeholder="Enter thread title or description"
              />
            </div>
            <button className="create-thread-btn">CREATE THREAD</button>
          </form>
        </main>
        <DiscussionPreviews threads={threadsData} />
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;