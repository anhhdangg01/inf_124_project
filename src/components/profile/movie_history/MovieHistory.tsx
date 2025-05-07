import React, { useEffect, useState } from 'react';
import '../../../styles/profile.css';
import { searchMovies, Movie } from '../../../functions/api_service';

function MovieHistory() {
    const [movies, setMovies] = useState<Movie[]>([]); // Store multiple movies
    const [error, setError] = useState<string | null>(null);


    const watchedMovies = ["A Minecraft Movie", "Bee Movie", "Scooby-Doo! Spooky Games"];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const fetchedMovies: Movie[] = [];
                for (const title of watchedMovies) {
                    const response = await searchMovies(title);
                    const specificMovie = response.results.find(
                        (m: Movie) => m.title === title
                    );
                    if (specificMovie) {
                        fetchedMovies.push(specificMovie);
                    } else {
                        console.warn(`Movie not found: ${title}`);
                    }
                }
                setMovies(fetchedMovies);
            } catch (err) {
                console.error('Failed to fetch movies:', err);
                setError('Failed to fetch movies');
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="movie-history">
            <h1>Watched Movies</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="movies-grid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
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
    );
}

export default MovieHistory;