import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import '../styles/auth.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import UserStats from '../components/profile/user_stats/UserStats';
import TVShowStats from '../components/profile/tv_show_stats/TVShowStats';
import MovieStats from '../components/profile/movie_stats/MovieStats';
import TVShowHistory from '../components/profile/tv_show_history/TVShowHistory';
import MovieHistory from '../components/profile/movie_history/MovieHistory';

function Profile() {
    const [isLogin, setIsLogin] = useState(false);
    const auth = getAuth();

    return(
        <div className="App">
            <Header />
            <div className="stats-section">
                <UserStats />
                <div className="stats-panel">
                    <TVShowStats />
                    <MovieStats />
                </div>
            </div>

            <div className="history-panel">
                <TVShowHistory />
                <MovieHistory />
            </div>
            <Footer />
        </div>
    );
}

export default Profile;