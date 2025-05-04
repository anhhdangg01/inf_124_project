import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import '../../styles/discussion.css';
import DiscussionPreviews from '../../components/discussion/post_preview';

function GeneralDiscussion() {
  const [thread, setThread] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ thread });
    setThread('');
  };

  const exampleThreads = [
    { id: '1', title: 'Which Character Had the Best Development Arc?', description: 'Some characters start off one way and end up completely....', date: '2023-10-01', author: 'User123' },
    { id: '2', title: 'What’s the Most Overrated or Underrated Episode?', description: 'Are there any you think don’t deserve the hype?', date: '2023-10-01', author: 'User123'  },
    { id: '3', title: 'Who’s the Most Hated (But Necessary) Character?"', description: 'Which one do you prefer and why?', date: '2023-10-01', author: 'User123'   },
    { id: '4', title: 'What’s a Show That’s So Bad It’s Good?', description: 'Sometimes terrible writing, acting, or plot twists....', date: '2023-10-01', author: 'User123'   },
    { id: '5', title: 'If Two Shows Had a Crossover, What Would It Be?', description: 'Imagine two totally different shows merging....', date: '2023-10-01', author: 'User123'   },
  ];

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
        <DiscussionPreviews threads={exampleThreads} />
      </div>
      <Footer />
    </div>
  );
}

export default GeneralDiscussion;