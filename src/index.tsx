import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/home';
import Auth from './pages/auth';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Discussion from './pages/discussion';
import GeneralDiscussion from './pages/discussions/general';
import News from './pages/discussions/news';
import Rules from './pages/discussions/rules';

// Firebase configuration
// Note: In a production environment, these values should be stored in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDb0vGZ7bvxqfXoKxmJzf7htUYrfKF31kA",
  authDomain: "inf-124-10961.firebaseapp.com",
  projectId: "inf-124-10961",
  storageBucket: "inf-124-10961.firebasestorage.app",
  messagingSenderId: "1038932690190",
  appId: "1:1038932690190:web:00f9afc8f98149e5fe435f",
  measurementId: "G-ME18D21GQY"
};

// Initialize Firebase before rendering the app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/discussion/general" element={<GeneralDiscussion />} />
        <Route path="/discussion/news" element={<News />} />
        <Route path="/discussion/rules" element={<Rules />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
