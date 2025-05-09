import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/profile.css';
import { getMovieDetails, Movie } from '../../../functions/api_service';

function MovieHistory() {
    const [movies, setMovies] = useState<Movie[]>([]); // Store multiple movies
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook for navigation

    // Example watched movie IDs. Replace these with actual IDs from your database or API.
    const watchedMovieIds = JSON.parse(localStorage.getItem('shows') || '[]');// Replace with actual movie IDs

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const fetchedMovies: Movie[] = [];
                for (const id of watchedMovieIds) {
                    const movie = await getMovieDetails(id); // Fetch movie details by ID
                    fetchedMovies.push(movie); // Add the movie to the list
                }
                setMovies(fetchedMovies); // Set all fetched movies to state
            } catch (err) {
                console.error('Failed to fetch movies:', err);
                setError('Failed to fetch movies');
            }
        };

        fetchMovies();
    }, []);

    const handleCardClick = (id: number) => {
        navigate(`/show/${id}`); // Navigate to the movie details page
    };

    return (
        <div className="movie-history">
            <h1>TV Show History</h1> 
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='history-container'>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="movie-card"
                        onClick={() => handleCardClick(movie.id)} // Handle click event
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                        />
                        <h3>{movie.title}</h3>
                        <p>{movie.release_date}</p>
                        <p>Rating: {movie.vote_average}/10</p>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}

export default MovieHistory;