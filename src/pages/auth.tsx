import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import loginOptions from '../assets/login.png'
import visionBucket from '../assets/VisionBucket.png'
import Footer from '../components/footer/footer';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Redirect to home page on success
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="App">
      <div className="logo-container">
        <img src={visionBucket} alt="Vision Bucket" className="logo" />
      </div>
      <div className="auth-container">
        <div className="auth-form">
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          
          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>

          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="link-button" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="auth-image">
          <img src={loginOptions} alt="Login Options" style={{ width: '450px', height: 'auto' }}/>
        </div>
      </div>
      <Footer />
    </div>

  );
}

export default Auth;
