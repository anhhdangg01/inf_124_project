import React from 'react';
import '../../styles/post_preview.css';
import { useNavigate } from 'react-router-dom';

interface Thread {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

const DiscussionPreviews: React.FC<{ threads: Thread[] }> = ({ threads }) => {
  const navigate = useNavigate();

  return (
    <div className="discussion-preview_background" > 
      {threads.map((thread) => (
        <div className= "background_discussion"> 
        <div 
          key={thread.id} 
          className="discussion-preview"
          onClick={() => navigate(`/threads/${thread.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h3 className="preview-card">{thread.title}</h3>
          <p className="thread-description">{thread.description}</p>
          <div className="author-date">
            <span className="author">Posted by: {thread.author}</span>
            <span className="date"> Lasted updated: {thread.date}</span> 
          </div>
        </div>
        </div>
      ))}
      
    </div>
  );
};

export default DiscussionPreviews;