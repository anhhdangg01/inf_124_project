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
import otherReviews from '../data/other_reviews.json'; // Import the JSON file

interface Review {
  movieId: number;
  review: string;
  rating: number;
  author: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>(); // Get the movie ID from the URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieDetails = await getMovieDetails(Number(id)); // Fetch movie details by ID
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
      // Retrieve reviews for the movie from localStorage
      const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const movieLocalReviews = localReviews.filter(
        (review: Review) => review.movieId === Number(id)
      );

      // Retrieve reviews for the movie from the JSON file
      const movieJsonReviews = otherReviews.find(
        (entry) => entry.movie === Number(id)
      )?.reviews || [];

      // Combine reviews from both sources
      setReviews([...movieJsonReviews, ...movieLocalReviews]);
    }
  }, [id]);

  const handleReviewSubmit = (reviewText: string, rating: number) => {
    if (id) {
      // Retrieve the existing reviews from localStorage
      const existingReviews = localStorage.getItem('reviews');
      let reviewsList = existingReviews ? JSON.parse(existingReviews) : [];

      // Add the new review
      const newReview = {
        movieId: Number(id),
        review: reviewText,
        rating: rating,
        author: localStorage.getItem('username') || 'Anonymous',
      };
      reviewsList.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviewsList));

      // Update the reviews state
      setReviews((prevReviews) => [...prevReviews, newReview]);

      alert('Review submitted successfully!');
    }
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
      <div className="movie-details">
        <MoviePoster
          posterPath={movie.poster_path}
          title={movie.title}
          releaseDate={movie.release_date}
          voteAverage={movie.vote_average}
        />
        <MovieOverview overview={movie.overview} />
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