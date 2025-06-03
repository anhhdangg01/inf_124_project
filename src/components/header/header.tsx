import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css';
import '../../styles/header.css';
import userIcon from '../../assets/userIcon.png';
import searchIcon from '../../assets/searchIcon.png';
import VisionBucket from '../../assets/VisionBucket.png';

function Header() {
  const [email, setEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Extract username from email (remove @gmail.com)
        const username = user.email?.split('@')[0] || '';
        setEmail(username);
      } else {
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleProfile = async () => {
    navigate('/profile');
  };

  const handeldiscussion = async () => {
    navigate('/discussion');
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-result/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header" >
      <div className="header-content responsive" style={{ marginBottom: isSmallScreen ? '100px' : '0px' }}>
        <div className="logo-container">
          <Link to="/">
            <img src={VisionBucket} alt="Vision Bucket" className="logo-image" />
          </Link>
        </div>
        
        <div className="bottom-row">
          <form className="search-container" onSubmit={handleSearch}>
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="hamburger-menu" onClick={toggleUserMenu}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
          
          {showUserMenu && (
            <div className="user-menu">
              <button onClick={handleProfile} className="option-button">
                Profile
              </button>
              <button onClick={handeldiscussion} className="option-button">
                Discussion
              </button>
              <button onClick={handleSignOut} className="sign-out-button">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;