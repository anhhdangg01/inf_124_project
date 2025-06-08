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

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [inMovieList, setInMovieList] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('Watching');
  const [statusLoading, setStatusLoading] = useState(false);

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
      if (firebaseUser && id) {
        try {
          const response = await fetch(`http://localhost:5000/profile/data/${firebaseUser.uid}`);
          if (!response.ok) throw new Error('Failed to fetch user data');
          const userData = await response.json();
          const movieIds: number[] = userData.movie_list || [];
          setInMovieList(movieIds.includes(Number(id)));
        } catch (err) {
          console.error('Failed to fetch user movie list:', err);
        }
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleReviewSubmit = (reviewText: string, rating: number) => {
    if (id) {
      const existingReviews = localStorage.getItem('reviews');
      let reviewsList = existingReviews ? JSON.parse(existingReviews) : [];
      const alreadyReviewed = reviewsList.some((review: any) => Number(review.movieId) === Number(id));
      if (alreadyReviewed) {
        alert('You have already submitted a review for this movie!');
        return;
      }
      const newReview = {
        movieId: Number(id),
        review: reviewText,
        rating: rating,
        author: localStorage.getItem('username') || 'Anonymous',
      };
      reviewsList.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviewsList));
      setReviews((prevReviews) => [...prevReviews, newReview]);
      alert('Review submitted successfully!');
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

  // Set status for this movie
  const handleSetStatus = async () => {
    if (!user) {
      alert('You must be logged in to update movie status.');
      return;
    }
    setStatusLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/profile/update/${user.uid}/${selectedStatus}/add_movie`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId: Number(id) }),
        }
      );
      if (!response.ok) throw new Error('Failed to update movie status');
      alert(`Movie set to "${selectedStatus.replace(/_/g, ' ')}"!`);
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
          <label htmlFor="status-dropdown"><b>Set Movie Status:</b></label>
          <select
            id="status-dropdown"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span style={{ marginLeft: 10 }}>
            <img
              src={STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.icon}
              alt={selectedStatus}
              style={{ width: 20, height: 20, verticalAlign: 'middle' }}
            />
          </span>
          <button
            onClick={handleSetStatus}
            disabled={statusLoading}
            style={{ marginLeft: 10 }}
          >
            Save
          </button>
          {!inMovieList ? (
            <button onClick={handleAddToMovies}>Add to My Movies</button>
          ) : (
            <button onClick={handleRemoveFromMovies}>Remove from My Movies</button>
          )}
        </div>
        <div className="other-reviews">
          <h2>Write a review!</h2>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </div>
        <div className="movie-reviews">
          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <ReviewCard
                key={index}
                review={review.review}
                author={review.author}
                rating={review.rating}
              />
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