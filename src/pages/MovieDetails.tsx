import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, Movie } from '../functions/api_service';
import '../styles/MovieDetails.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

function MovieDetails() {
    const { id } = useParams<{ id: string }>(); // Get the movie ID from the URL
    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleAddToLocalStorage = () => {
        if (id) {
            // Retrieve the existing list from localStorage
            const existingMovies = localStorage.getItem('movies');
            let moviesList = existingMovies ? JSON.parse(existingMovies) : [];
            // Check if the ID is already in the list
            if (!moviesList.includes(id)) {
                moviesList.push(id);
                localStorage.setItem('movies', JSON.stringify(moviesList));
                alert(`Movie ID ${id} added to the list in localStorage!`);
            } else {
                alert(`Movie ID ${id} is already in the list!`);
            }
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
                <div className="movie-top-section">
                    <div className="movie-poster">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>
                    <div className="movie-details-info">
                        <h1>{movie.title}</h1>
                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                        <p><strong>Average Rating:</strong> {movie.vote_average}/10</p>
                        {/* Add more movie details as needed */}
                        <button onClick={handleAddToLocalStorage}>
                            Add To Watched List  (Currently only Movie History)
                        </button>
                    </div>
                </div>
                <div className="movie-overview">
                    <h2>Overview</h2>
                    <p>{movie.overview}</p>
                </div>
                <div className="other-reviews">
                    <h2>Other Reviews</h2>
                    <p>Review comp goes here</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MovieDetails;