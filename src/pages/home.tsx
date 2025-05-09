import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { searchMovies, Movie } from '../functions/api_service';
import '../App.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
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

  useEffect(() => {
    const localThreads = JSON.parse(localStorage.getItem('threads') || '[]');
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const extractedUsername = user.email?.split('@')[0] || 'Unknown User';
            setUsername(extractedUsername);
        } else {
            setUsername(null);
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', JSON.stringify(username));
    }
    if (!localStorage.getItem('movies')) {
      localStorage.setItem('movies', JSON.stringify([950387, 5559, 284908,950387, 5559, 284908,950387, 5559, 284908,950387, 5559, 284908]));
    }
    if (!localStorage.getItem('shows')) {
      localStorage.setItem('shows', JSON.stringify([950387, 5559, 284908]));
    }
    if (!localStorage.getItem('reviews')) {
      localStorage.setItem(
        'reviews',
        JSON.stringify([
          { movieId: 950387, review: "review", rating: 1 },
          { movieId: 5559, review: "review2", rating: 5 }
        ])
      );
    }
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

    const handleCardClick = (id: number) => {
      navigate(`/show/${id}`); // Navigate to the movie details page
  };
  return (
    <div className="App">
      <Header />
      <main>
        <h1>Welcome to Vision Bucket</h1>

        <div className="movies-container">
          <h2>Minecraft Movies</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="movies-grid">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                
                className="movie-card"
                onClick={() => {
                  console.log('Movie Data:', movie);
                  handleCardClick(movie.id);
                }}
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
