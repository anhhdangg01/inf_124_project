import React, { useEffect, useState } from 'react';
import '../../../styles/profile.css';
import green_circle from '../../../assets/circles/green_circle.png';
import blue_circle from '../../../assets/circles/blue_circle.png';
import yellow_circle from '../../../assets/circles/yellow_circle.png';
import red_circle from '../../../assets/circles/red_circle.png';
import grey_circle from '../../../assets/circles/grey_circle.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface MovieStatsData {
    Watching?: number[];
    Completed?: number[];
    On_hold?: number[];
    Dropped?: number[];
    Plan_to_watch?: number[];
    Rewatched?: number[];
    movie_list?: number[];
}

function MovieStats() {
    const [stats, setStats] = useState<MovieStatsData>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:5000/profile/data/${user.uid}`);
                    if (!response.ok) throw new Error('Failed to fetch user data');
                    const userData = await response.json();
                    setStats(userData);
                } catch (err) {
                    setStats({});
                } finally {
                    setLoading(false);
                }
            } else {
                setStats({});
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="stats-card">
            <h2>Movie Stats</h2>
            <p>
                <img src={green_circle} alt="Green Circle" className="circle-picture" />Watching: {stats.Watching?.length || 0}
                <br />
                <img src={blue_circle} alt="Blue Circle" className="circle-picture" />Completed: {stats.Completed?.length || 0}
                <br />
                <img src={yellow_circle} alt="Yellow Circle" className="circle-picture" />On-hold: {stats.On_hold?.length || 0}
                <br />
                <img src={red_circle} alt="Red Circle" className="circle-picture" />Dropped: {stats.Dropped?.length || 0}
                <br />
                <img src={grey_circle} alt="Grey Circle" className="circle-picture" />Plan to Watch: {stats.Plan_to_watch?.length || 0}
                <br />
                <br />
                Watched: {stats.movie_list?.length || 0}
                <br />
                Rewatched: {stats.Rewatched?.length || 0}
                <br />
                {/* Total Episodes: Not available in backend, add if you have this data */}
            </p>
            {/* insert the pie chart somewhere */}
        </div>
    );
}

export default MovieStats;