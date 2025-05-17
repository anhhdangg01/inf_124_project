import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import '../styles/auth.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import UserStats from '../components/profile/user_stats/UserStats';
import TVShowStats from '../components/profile/tv_show_stats/TVShowStats';
import MovieStats from '../components/profile/movie_stats/MovieStats';
import TVShowHistory from '../components/profile/tv_show_history/TVShowHistory';
import MovieHistory from '../components/profile/movie_history/MovieHistory';
import Reviews from '../components/profile/review_display/MovieReviewCard';

interface Review {
  movieId: number;
  review: string;
  rating: number;
}

function Profile() {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  // Function to remove a review by movieId
  const removeReview = (movieId: number) => {
    const updatedReviews = reviews.filter((review) => review.movieId !== movieId);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  return (
    <div className="App">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="stats-section">
        <UserStats />
        <div className="stats-panel">
          <TVShowStats />
          <MovieStats />
        </div>
      </div>

      <div className="history-panel">
        <TVShowHistory />
        <MovieHistory />
        <h2>Reviews</h2>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.movieId}>
              <Reviews
                movieId={review.movieId}
                review={review.review}
                rating={review.rating}
              />
              <button onClick={() => removeReview(review.movieId)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;