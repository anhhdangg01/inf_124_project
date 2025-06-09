import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import '../styles/auth.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import UserStats from '../components/profile/user_stats/UserStats';
import TVShowStats from '../components/profile/tv_show_stats/TVShowStats';
import MovieStats from '../components/profile/movie_stats/MovieStats';
import TVShowHistory from '../components/profile/tv_show_history/TVShowHistory';
import MovieHistory from '../components/profile/movie_history/MovieHistory';
import MovieReviewCard from '../components/profile/review_display/MovieReviewCard';

interface Review {
  id: string;
  movieId: number;
  content: string;
  rating: number;
}

function Profile() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to fetch reviews for the current user
  const fetchReviews = async (user: any) => {
    setLoading(true);
    try {
      const db = getFirestore();
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setReviews([]);
        setLoading(false);
        return;
      }
      const userData = userSnap.data();
      const reviewIds: string[] = userData.reviews || [];

      // Fetch each review document
      const fetchedReviews: Review[] = [];
      for (const reviewId of reviewIds) {
        const reviewRef = doc(db, "Reviews", reviewId);
        const reviewSnap = await getDoc(reviewRef);
        if (reviewSnap.exists()) {
          const data = reviewSnap.data();
          fetchedReviews.push({
            id: reviewSnap.id,
            movieId: data.movieId,
            content: data.content,
            rating: data.rating,
          });
        }
      }
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        setReviews([]);
        setLoading(false);
        return;
      }
      await fetchReviews(user);
    });
    return () => unsubscribe();
  }, []);

  // Remove review from Firestore and update state
  const removeReview = async (docId: string) => {
    const user = getAuth().currentUser;
    if (!user) return;

    try {
      const db = getFirestore();
      // 1. Delete review from Reviews collection
      await deleteDoc(doc(db, "Reviews", docId));
      // 2. Remove reviewId from user's profile
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { reviews: arrayRemove(docId) });
      // 3. Refetch reviews
      await fetchReviews(user);
    } catch (err) {
      alert('Failed to delete review.');
      console.error(err);
    }
  };

  // Handler to refetch reviews after editing
  const handleReviewEdited = async () => {
    const user = getAuth().currentUser;
    if (user) {
      await fetchReviews(user);
    }
  };

  return (
    <div className="App">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="stats-section">
        <UserStats />
        <div className="stats-panel">
          <MovieStats />
        </div>
      </div>

      <div className="history-panel">
        <MovieHistory />
        <TVShowHistory />
        <h2>Reviews</h2>
        <div className="reviews-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            reviews.map((review) => (
              <MovieReviewCard
                key={review.id}
                id={review.id}
                movieId={review.movieId}
                review={review.content}
                rating={review.rating}
                onDelete={() => removeReview(review.id)}
                onEdit={handleReviewEdited} // Pass this prop!
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;