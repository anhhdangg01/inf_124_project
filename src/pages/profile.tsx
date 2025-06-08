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
  id: string;
  movieId: number;
  content: string;
  rating: number;
}

function Profile() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        // 1. Fetch review IDs
        const res = await fetch(`http://localhost:5000/profile/reviews/${user.uid}`);
        const reviewIds = await res.json();

        // 2. Fetch each review's data
        const reviewData: Review[] = await Promise.all(
          reviewIds.map(async (review: any) => {
            // If your /profile/reviews/:uid already returns full review objects, skip this fetch
            if (review.id && review.movieId) return review;
            const r = await fetch(`http://localhost:5000/reviews/review/${review}`);
            return await r.json();
          })
        );

        setReviews(reviewData);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // Remove review from backend and update state
  const removeReview = async (docId: string) => {
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      // 1. Delete review from Reviews collection
      const response = await fetch(`http://localhost:5000/reviews/${docId}/${user.uid}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review');

      // 2. Remove reviewId from user's profile
      await fetch(`http://localhost:5000/profile/update/${user.uid}/remove_review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: docId }),
      });

      // 3. Update UI
      setReviews(reviews.filter((review) => review.id !== docId));
      alert('Review deleted successfully!');
    } catch (err) {
      alert('Failed to delete review.');
      console.error(err);
    }
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id}>
                <Reviews
                  movieId={review.movieId}
                  review={review.content}
                  rating={review.rating}
                />
                <button onClick={() => removeReview(review.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;