import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/profile.css';
import { getMovieDetails, Movie } from '../../../functions/api_service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function MovieHistory() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const db = getFirestore();
                    const userRef = doc(db, "Users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        throw new Error('User not found');
                    }
                    const userData = userSnap.data();
                    const movieIds: number[] = userData.movie_list || [];

                    // Fetch details for each movie
                    const fetchedMovies: Movie[] = [];
                    for (const id of movieIds) {
                        const movie = await getMovieDetails(id);
                        fetchedMovies.push(movie);
                    }
                    setMovies(fetchedMovies);
                } catch (err) {
                    console.error('Failed to fetch movies:', err);
                    setError('Failed to fetch movies');
                } finally {
                    setLoading(false);
                }
            } else {
                setMovies([]);
                setError('User not logged in');
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleCardClick = (id: number) => {
        navigate(`/show/${id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="movie-history">
            <h1>Movie History</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='history-container'>
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => handleCardClick(movie.id)}
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