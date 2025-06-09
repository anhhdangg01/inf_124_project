import React from 'react';
import '../../styles/post_preview.css';
import { useNavigate } from 'react-router-dom';

interface Thread {
  id: string;
  uid: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

interface DiscussionPreviewsProps {
  threads: Thread[];
  onDeleteThread: (threadId: string, uid: string) => void;
  currentUid: string | null;
}

const DiscussionPreviews: React.FC<DiscussionPreviewsProps> = ({ threads, onDeleteThread, currentUid }) => {
  const navigate = useNavigate();

  return (
    <div className="discussion-preview_background">
      {threads.map((thread) => (
        <div className="background_discussion" key={thread.id}>
          <div
            className="discussion-preview"
            onClick={() => navigate(`/threads/${thread.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <h3 className="preview-card">{thread.title}</h3>
            <p className="thread-description">
              {(thread.description ?? '').split(' ').length > 10
                ? (thread.description ?? '').split(' ').slice(0, 10).join(' ') + '...'
                : (thread.description ?? '')}
            </p>
            <div className="author-date">
              <span className="author">Posted by: {thread.author}</span>
              <span className="date">Last updated: {thread.date}</span>
            </div>
          </div>
          {currentUid === thread.uid && (
            <button className='del_button'onClick={() => onDeleteThread(thread.id, thread.uid)}>Delete Thread</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiscussionPreviews;