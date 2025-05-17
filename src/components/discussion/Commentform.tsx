import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (commentText: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    onSubmit(commentText);
    setCommentText('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <textarea
        style={{
          width: '100%',
          height: '70px',
          marginBottom: '10px',
          resize: 'none',
          backgroundColor: '#222222',
          borderRadius: '5px',
          color: '#fff',
          border: '1px solid #444'
        }}
        placeholder="Write your comment here..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={3}
      />
      <button
        type="submit"
        style={{
          width: '100%',
          height: '36px',
          backgroundColor: '#2D2D2D',
          color: '#fff',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold'
        }}
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;