import React from 'react';
import VisionBucket from '../../assets/VisionBucket.png';
import '../../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={VisionBucket} alt="Vision Bucket" />
          <p>Idk cool motto goes here</p>
        </div>
        
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>
        
        <div className="footer-social">
          <a href="https://www.facebook.com/" target="_blank"><i className="social-icon">FB</i></a>
          <a href="https://x.com/home" target="_blank"><i className="social-icon">TW</i></a>
          <a href="https://www.instagram.com/" target="_blank"><i className="social-icon">IG</i></a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vision Bucket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;