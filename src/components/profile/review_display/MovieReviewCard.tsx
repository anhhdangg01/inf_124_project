import React, { useEffect, useState } from 'react';
import { getMovieDetails, Movie } from '../../../functions/api_service';
import onestar from '../../../assets/1star.png';
import twostar from '../../../assets/2star.png';
import threestar from '../../../assets/3star.png';
import fourstar from '../../../assets/4star.png';
import fivestar from '../../../assets/5star.png';
import zerostar from '../../../assets/0star.png';
interface MovieReviewCardProps {
  movieId: number;
  review: string;
  rating: number;
}

const MovieReviewCard: React.FC<MovieReviewCardProps> = ({ movieId, review, rating }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetails = await getMovieDetails(movieId);
        setMovie(movieDetails);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details');
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const getTempImage = (rating: number) => {
    switch (rating) {
      case 1:
        return onestar;
      case 2:
        return twostar;
      case 3:
        return threestar;
      case 4:
        return fourstar;
      case 5:
        return fivestar;
      default:
        return zerostar;
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="movie-review-card" style={{ border: '1px solid #ccc', padding: '16px', margin: '16px', borderRadius: '8px' }}>
        <div>
          {movie ? (
            <>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100px', height: '150px', objectFit: 'cover', marginBottom: '8px' }}
              />
              <h3>{movie.title}</h3>
            </>
          ) : (
            <p>Loading movie details...</p>
          )}
          <p><strong>Review:</strong> {review}</p>
          <p><strong>Rating:</strong> {rating}/5</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={getTempImage(rating)}
          alt={`Rating ${rating}`}
          style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '16px' }}
        />
      </div>
    </div>
  );
};

export default MovieReviewCard;