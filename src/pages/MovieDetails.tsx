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
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

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
          const db = getFirestore();
          const userRef = doc(db, "Users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) return;
          const userData = userSnap.data();
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
          else setSelectedStatus('');
          setInMovieList((userData.movie_list || []).includes(Number(id)));
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
        const db = getFirestore();
        const reviewsCollection = collection(db, "Reviews");
        const q = query(reviewsCollection, where("movieId", "==", Number(id)));
        const querySnapshot = await getDocs(q);
        const reviewsArr: FirestoreReview[] = [];
        querySnapshot.forEach((docSnap) => {
          reviewsArr.push({ id: docSnap.id, ...docSnap.data() } as FirestoreReview);
        });
        setFirestoreReviews(reviewsArr);
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
      const db = getFirestore();
      // Fetch user data
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        alert('User data not found.');
        return;
      }
      const userData = userSnap.data();
      const userReviewIds: string[] = userData.reviews || [];

      // Check if user has already reviewed this movie
      let alreadyReviewed = false;
      for (const reviewId of userReviewIds) {
        const reviewRef = doc(db, "Reviews", reviewId);
        const reviewSnap = await getDoc(reviewRef);
        if (reviewSnap.exists()) {
          const reviewData = reviewSnap.data();
          if (reviewData.movieId === Number(id)) {
            alreadyReviewed = true;
            break;
          }
        }
      }
      if (alreadyReviewed) {
        alert('You have already reviewed this movie!');
        return;
      }

      // Add review to Reviews collection
      const newReview = {
        movieId: Number(id),
        date: new Date().toISOString(),
        Author: user.email ? user.email.split('@')[0] : 'Anonymous',
        content: reviewText,
        rating,
        uid: user.uid,
      };
      const docRef = await addDoc(collection(db, "Reviews"), newReview);
      // Add reviewId to user's profile
      await updateDoc(userRef, { reviews: arrayUnion(docRef.id) });
      setFirestoreReviews((prev) => [...prev, { ...newReview, id: docRef.id }]);
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
      const db = getFirestore();
      // Delete review from Reviews collection
      await deleteDoc(doc(db, "Reviews", reviewId));
      // Remove reviewId from user's profile
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { reviews: arrayRemove(reviewId) });
      setFirestoreReviews((prev) => prev.filter((r) => r.id !== reviewId));
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
      const db = getFirestore();
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { movie_list: arrayUnion(Number(id)) });
      setInMovieList(true);
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
      const db = getFirestore();
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { movie_list: arrayRemove(Number(id)) });
      setInMovieList(false);
    } catch (err) {
      alert('Failed to remove movie from your list.');
      console.error(err);
    }
  };

  const fetchUserStatusLists = async (uid: string) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();
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
      else setSelectedStatus('');
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
      const db = getFirestore();
      const userRef = doc(db, "Users", user.uid);
      // Remove from all other status lists
      for (const status of Object.keys(userStatusLists)) {
        if (status !== newStatus && userStatusLists[status]?.includes(Number(id))) {
          await updateDoc(userRef, { [status]: arrayRemove(Number(id)) });
        }
      }
      // Add to new status list
      await updateDoc(userRef, { [newStatus]: arrayUnion(Number(id)) });
      // Refetch status lists to update UI
      await fetchUserStatusLists(user.uid);
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