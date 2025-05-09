import React, { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (reviewText: string, rating: number) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit(reviewText, rating);
    setReviewText('');
    setRating(0);
  };

  return (
    <div className="review-form">
      <textarea
        placeholder="Write your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ReviewForm;