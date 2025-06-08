import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, Movie } from '../functions/api_service';
import '../styles/MovieDetails.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ReviewCard from '../components/movie_details/reviews_card';
import MoviePoster from '../components/movie_details/MoviePoster';
import MovieOverview from '../components/movie_details/MovieOverview';
import ReviewForm from '../components/movie_details/ReviewForm';
import otherReviews from '../data/other_reviews.json';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import green_circle from '../assets/circles/green_circle.png';
import blue_circle from '../assets/circles/blue_circle.png';
import yellow_circle from '../assets/circles/yellow_circle.png';
import red_circle from '../assets/circles/red_circle.png';
import grey_circle from '../assets/circles/grey_circle.png';
import { arrayUnion, arrayRemove } from 'firebase/firestore'; // Only if you use them directly elsewhere

interface Review {
  movieId: number;
  review: string;
  rating: number;
  author: string;
}

const STATUS_OPTIONS = [
  { value: 'Watching', label: 'Watching', icon: green_circle },
  { value: 'Completed', label: 'Completed', icon: blue_circle },
  { value: 'On_hold', label: 'On-hold', icon: yellow_circle },
  { value: 'Dropped', label: 'Dropped', icon: red_circle },
  { value: 'Plan_to_watch', label: 'Plan to Watch', icon: grey_circle },
];

interface FirestoreReview {
  id: string;
  movieId: number;
  Author: string;
  content: string;
  rating: number;
  uid: string;
  date: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [inMovieList, setInMovieList] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // was 'Watching'
  const [statusLoading, setStatusLoading] = useState(false);
  const [firestoreReviews, setFirestoreReviews] = useState<FirestoreReview[]>([]);
  const [userStatusLists, setUserStatusLists] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieDetails = await getMovieDetails(Number(id));
        setMovie(movieDetails);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to fetch movie details');
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (id) {
      const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const movieLocalReviews = localReviews.filter(
        (review: Review) => review.movieId === Number(id)
      );
      const movieJsonReviews = otherReviews.find(
        (entry) => entry.movie === Number(id)
      )?.reviews || [];
      setReviews([...movieJsonReviews, ...movieLocalReviews]);
    }
  }, [id]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const response = await fetch(`http://localhost:5000/profile/data/${firebaseUser.uid}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const userData = await response.json();
          // Save all status lists
          setUserStatusLists({
            Watching: userData.Watching || [],
            Completed: userData.Completed || [],
            On_hold: userData.On_hold || [],
            Dropped: userData.Dropped || [],
            Plan_to_watch: userData.Plan_to_watch || [],
          });
          // Set initial selected status if movie is in any list
          const foundStatus = Object.entries(userData)
            .find(([status, arr]) => Array.isArray(arr) && arr.includes(Number(id)));
          if (foundStatus) setSelectedStatus(foundStatus[0]);
        } catch (err) {
          console.error('Failed to fetch user movie lists:', err);
        }
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Fetch reviews for this movie from backend
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/reviews/${id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setFirestoreReviews(data); // <-- data is now an array
      } catch (err) {
        setFirestoreReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  // Post a review
  const handleReviewSubmit = async (reviewText: string, rating: number) => {
    if (!user) {
      alert('You must be logged in to post a review!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/reviews/posting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: Number(id),
          Author: user.displayName || user.email || 'Anonymous',
          content: reviewText,
          rating,
          uid: user.uid,
        }),
      });
      if (!response.ok) throw new Error('Failed to post review');
      const data = await response.json();
      // Add reviewId to user's profile
      await fetch(`http://localhost:5000/profile/update/${user.uid}/add_review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: data.id }),
      });
      setFirestoreReviews((prev) => [...prev, { ...data.review, id: data.id }]);
      alert('Review submitted successfully!');
    } catch (err) {
      alert('Failed to submit review.');
      console.error(err);
    }
  };

  // Remove a review
  const handleDeleteReview = async (reviewId: string, reviewUid: string) => {
    if (!user || user.uid !== reviewUid) {
      alert('You can only delete your own reviews.');
      return;
    }
    try {
      // Delete review from Reviews collection
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}/${user.uid}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review');
      // Remove reviewId from user's profile
      await fetch(`http://localhost:5000/profile/update/${user.uid}/remove_review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
      setFirestoreReviews((prev) => prev.filter((r) => r.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (err) {
      alert('Failed to delete review.');
      console.error(err);
    }
  };

  // Add to movie_list in backend
  const handleAddToMovies = async () => {
    if (!user) {
      alert('You must be logged in to add movies.');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/profile/update/${user.uid}/add_movie_list`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId: Number(id) }),
        }
      );
      if (!response.ok) throw new Error('Failed to add movie');
      setInMovieList(true);
      alert('Movie added to your list!');
    } catch (err) {
      alert('Failed to add movie to your list.');
      console.error(err);
    }
  };

  // Remove from movie_list in backend
  const handleRemoveFromMovies = async () => {
    if (!user) {
      alert('You must be logged in to remove movies.');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/profile/update/${user.uid}/remove_movie_list`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId: Number(id) }),
        }
      );
      if (!response.ok) throw new Error('Failed to remove movie');
      setInMovieList(false);
      alert('Movie removed from your list!');
    } catch (err) {
      alert('Failed to remove movie from your list.');
      console.error(err);
    }
  };

  const fetchUserStatusLists = async (uid: string) => {
    try {
      const response = await fetch(`http://localhost:5000/profile/data/${uid}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      setUserStatusLists({
        Watching: userData.Watching || [],
        Completed: userData.Completed || [],
        On_hold: userData.On_hold || [],
        Dropped: userData.Dropped || [],
        Plan_to_watch: userData.Plan_to_watch || [],
      });
      // Update selectedStatus if movie is in any list
      const foundStatus = Object.entries(userData)
        .find(([status, arr]) => Array.isArray(arr) && arr.includes(Number(id)));
      if (foundStatus) setSelectedStatus(foundStatus[0]);
      else setSelectedStatus(''); // If not in any list
    } catch (err) {
      console.error('Failed to fetch user movie lists:', err);
    }
  };

  // Set status for this movie
  const handleSetStatus = async (newStatus: string) => {
    if (!user) {
      alert('You must be logged in to update movie status.');
      return;
    }
    setStatusLoading(true);
    try {
      // Remove from all other status lists
      for (const status of Object.keys(userStatusLists)) {
        if (status !== newStatus && userStatusLists[status]?.includes(Number(id))) {
          await fetch(
            `http://localhost:5000/profile/update/${user.uid}/${status}/remove_movie`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ movieId: Number(id) }),
            }
          );
        }
      }
      // Add to new status list
      await fetch(
        `http://localhost:5000/profile/update/${user.uid}/${newStatus}/add_movie`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId: Number(id) }),
        }
      );
      // Refetch status lists to update UI
      await fetchUserStatusLists(user.uid);
      alert(`Movie set to "${newStatus.replace(/_/g, ' ')}"!`);
    } catch (err) {
      alert('Failed to update movie status.');
      console.error(err);
    }
    setStatusLoading(false);
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className="movie-details-container">
      <Header />
      <div style={{marginTop: '100px'}}></div>
      <div className="movie-details">
        <MoviePoster
          posterPath={movie.poster_path}
          title={movie.title}
          releaseDate={movie.release_date}
          voteAverage={movie.vote_average}
        />
        <MovieOverview overview={movie.overview} />
        <div className="movie-actions">
          <b>Set Movie Status:</b>
          <div style={{ display: 'flex', gap: 16, margin: '10px 0' }}>
            {STATUS_OPTIONS.map(option => (
              <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="radio"
                  name="movie-status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={() => handleSetStatus(option.value)}
                />
                <img src={option.icon} alt={option.label} style={{ width: 20, height: 20 }} />
                {option.label}
              </label>
            ))}
          </div>
          {/* Movie List Button */}
          <div style={{ marginTop: 16 }}>
            {inMovieList ? (
              <button onClick={handleRemoveFromMovies} style={{ background: '#eee', color: '#c00', padding: '8px 16px', borderRadius: 4 }}>
                Remove from Movie List
              </button>
            ) : (
              <button onClick={handleAddToMovies} style={{ background: '#007bff', color: '#fff', padding: '8px 16px', borderRadius: 4 }}>
                Add to Movie List
              </button>
            )}
          </div>
        </div>
        <div className="other-reviews">
          <h2>Write a review!</h2>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </div>
        <div className="movie-reviews">
          <h2>Reviews</h2>
          {firestoreReviews.length > 0 ? (
            firestoreReviews.map((review) => (
              <div key={review.id} style={{ marginBottom: 16 }}>
                <ReviewCard
                  review={review.content}
                  author={review.Author}
                  rating={review.rating}
                />
                {user && user.uid === review.uid && (
                  <button
                    onClick={() => handleDeleteReview(review.id, review.uid)}
                    style={{ marginTop: 4, color: 'red' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default MovieDetails;