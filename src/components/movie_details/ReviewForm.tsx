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
        style={{ width: '100%', height: '100px', marginBottom: '10px', resize: 'none', backgroundColor: '#222222', borderRadius: '5px' }}
        placeholder="Write your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
      />
      <select 
      style={{ width: '30%', height: '40px', marginBottom: '10px', backgroundColor: '#222222', borderRadius: '5px', color: '#fff' }}
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
      <button style={{ width: '100%', height: '40px', backgroundColor: '#2D2D2D', color: '#ffff', borderRadius: '10%' }}
      
      onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ReviewForm;