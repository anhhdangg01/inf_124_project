import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { searchMovies, Movie } from '../functions/api_service';
import '../App.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await searchMovies('minecraft');
        setMovies(response.results);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <main>
        <h1>Welcome to Vision Bucket</h1>
        <Link 
          to="/discussion" 
          style={{ 
            textDecoration: 'none', 
            color: '#3498db', 
            fontSize: '20px',
            display: 'block',
            margin: '20px 0'
          }}
        >
          Go to Discussion
        </Link>

        <div className="movies-container">
          <h2>Minecraft Movies</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="movies-grid">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => console.log('Movie Data:', movie)}
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
      </main>
      <Footer />
    </div>
  );
}

export default Home;
