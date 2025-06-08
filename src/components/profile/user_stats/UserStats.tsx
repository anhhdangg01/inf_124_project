import React, { useEffect, useState } from 'react';
import '../../../styles/profile.css';
import user_icon from '../../../assets/user_high.png';
import mail_icon from '../../../assets/mail_high.png';
import friend_request_icon from '../../../assets/friend_high.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface UserData {
    username: string;
    Last_online: string;
    Joined: string;
    reviews: string[];
}

function UserStats() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch user data from your backend
                    const response = await fetch(`http://localhost:5000/profile/data/${user.uid}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    setUserData(data);

                    // Update last online
                    await fetch(`http://localhost:5000/profile/update/${user.uid}/last_online`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ last_online: new Date() }),
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="user-info-card">
            <img src={user_icon} alt="User Icon" className="profile-picture" />
            <br />
            <h2>{userData?.username || 'Guest'}</h2>
            <img src={mail_icon} alt="Mail Icon" className="profile-image" />
            <img src={friend_request_icon} alt="Friend Request Icon" className="profile-image" />
            <br />
            <p>
                Last Online: {userData?.Last_online ? formatDate(userData.Last_online) : 'N/A'}
                <br />
                Joined: {userData?.Joined ? formatDate(userData.Joined) : 'N/A'}
                <br />
                <br />
                Reviews: {userData?.reviews?.length || 0}
                <br />
                Favorites: temp
                <br />
                Recommendations: temp
            </p>
        </div>
    );
}

export default UserStats;