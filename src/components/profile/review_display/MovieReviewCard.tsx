import React, { useEffect, useState } from 'react';
import { getMovieDetails, Movie } from '../../../functions/api_service';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
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
  onDelete?: () => void;
  id?: string;
  onEdit?: () => void;
}

const MovieReviewCard: React.FC<MovieReviewCardProps> = ({
  movieId,
  review,
  rating,
  onDelete,
  id,
  onEdit,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editReview, setEditReview] = useState(review);
  const [editRating, setEditRating] = useState(rating);
  const [saving, setSaving] = useState(false);

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

  const handleEdit = () => {
    setEditReview(review);
    setEditRating(rating);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditReview(review);
    setEditRating(rating);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const db = getFirestore();
      const reviewRef = doc(db, "Reviews", id);
      await updateDoc(reviewRef, {
        content: editReview,
        rating: editRating,
      });
      setIsEditing(false);
      if (onEdit) onEdit();
    } catch (err) {
      alert('Failed to update review.');
      console.error(err);
    }
    setSaving(false);
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div
      className="movie-review-card"
      style={{
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        margin: '16px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 350,
        maxWidth: 350,
        boxSizing: 'border-box',
        position: 'relative',
        background: '#333333'
      }}
    >
      <div>
        {movie ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: '100px',
                height: '150px',
                objectFit: 'cover',
                marginBottom: '8px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
            <h3 style={{ textAlign: 'center' }}>{movie.title}</h3>
          </>
        ) : (
          <p>Loading movie details...</p>
        )}

        {isEditing ? (
          <div style={{ marginTop: 8 }}>
            <textarea
              value={editReview}
              onChange={(e) => setEditReview(e.target.value)}
              rows={3}
              style={{ width: '100%', marginBottom: 8, borderRadius: 4, padding: 4 }}
            />
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <label>
                Rating:&nbsp;
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  style={{ borderRadius: 4, padding: 4 }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <>
            <p style={{ textAlign: 'center' }}><strong>Review:</strong> {review}</p>
            <p style={{ textAlign: 'center' }}><strong>Rating:</strong> {rating}/5</p>
          </>
        )}
      </div>
      {/* Star image centered */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0' }}>
        <img
          src={getTempImage(isEditing ? editRating : rating)}
          alt={`Rating ${isEditing ? editRating : rating}`}
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
      </div>
      {/* Buttons at the bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 'auto' }}>
        {isEditing ? (
          <>
            <button
              className="delete-review-btn"
              style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="delete-review-btn"
              style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="delete-review-btn"
              style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
              onClick={handleEdit}
            >
              Edit
            </button>
            {onDelete && (
              <button
                className="delete-review-btn"
                style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieReviewCard;