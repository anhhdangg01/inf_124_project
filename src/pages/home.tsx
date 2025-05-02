import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../App.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out, redirect to auth page
        navigate('/auth');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="App" style={{ marginTop: '100px', fontSize: '35px' }}>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <h1>Vision bucket home</h1>
      <p>Your personal vision board application</p>
      <Link to="/discussion" style={{ textDecoration: 'none', color: '#3498db', fontSize: '20px' }}>
      Go to Discussion
    </Link>
      <Footer />
    </div>
  );

}

export default Home;
