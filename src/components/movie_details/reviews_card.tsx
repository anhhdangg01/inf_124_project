import React from 'react';
import '../../styles/post_preview.css';

interface ReviewCardProps {
  review: string;
  author: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, author, rating }) => {
  return (
    <div className="discussion-preview">
      <h3 className="preview-card">Rating: {rating}/5</h3>
      <p className="thread-description">{review}</p>
      <div className="author-date">
        <span className="author">Reviewed by: {author}</span>
      </div>
    </div>
  );
};

export default ReviewCard;

export {}