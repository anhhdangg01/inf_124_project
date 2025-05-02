import React from 'react';
import VisionBucket from '../../assets/VisionBucket.png';
import Facebook from '../../assets/facebook.png';
import Instagram from '../../assets/instagram.png';
import Twitter from '../../assets/twitter.png';
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
          <a href="https://www.facebook.com/" target="_blank"><i className="social-icon"><img src={Facebook} alt="Facebook" /></i></a>
          <a href="https://x.com/home" target="_blank"><i className="social-icon"><img src={Twitter} alt="Twitter" /></i></a>
          <a href="https://www.instagram.com/" target="_blank"><i className="social-icon"><img src={Instagram} alt="Instagram" /></i></a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vision Bucket. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;