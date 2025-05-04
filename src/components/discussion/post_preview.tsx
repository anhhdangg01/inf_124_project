import React from 'react';
import '../../styles/post_preview.css';
import { useNavigate, Link } from 'react-router-dom';

const DiscussionPreviews = () => {
  const navigate = useNavigate();

  const handlePreviewClick = () => {
    navigate('/'); // Navigate to the post page
  };
  return (
    <div className="discussion-preview_background" onClick={handlePreviewClick}>
    <div className="discussion-preview">
      <h2><strong>Post name</strong></h2>
      <div className="preview-card">
        <p>Preview of the discussion content goes here...</p>
        <p style={{ fontSize: '12px' }}>last updated: 5/4/2025</p>
      </div>
    </div>
    </div>
  );
};

export default DiscussionPreviews;