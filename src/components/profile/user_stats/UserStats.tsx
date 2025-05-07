import React, { useEffect, useState } from 'react';
import '../../../styles/profile.css';
import user_icon from '../../../assets/user_high.png';
import mail_icon from '../../../assets/mail_high.png';
import friend_request_icon from '../../../assets/friend_high.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function UserStats() {
    const [username, setUsername] = useState<string | null>(null);
    const [lastOnline, setLastOnline] = useState<string | null>(null);
    const [joinedDate, setJoinedDate] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const extractedUsername = user.email?.split('@')[0] || 'Unknown User'; // Extract username from email
                setUsername(extractedUsername);
                const lastSignIn = user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                      })
                    : 'Unknown';
                setLastOnline(lastSignIn);
                const creationTime = user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                      })
                    : 'Unknown';
                setJoinedDate(creationTime);
            } else {
                setUsername(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="user-info-card">
            <img src={user_icon} alt="User Icon" className="profile-picture" />
            <br />
            <h2>{username || 'Guest'}</h2>
            <img src={mail_icon} alt="Mail Icon" className="profile-image" />
            <img src={friend_request_icon} alt="Friend Request Icon" className="profile-image" />
            <br />
            <p>
                Last Online: {lastOnline || 'N/A'}
                <br />
                Joined: {joinedDate || 'N/A'}
                <br />
                <br />
                Reviews: temp
                <br />
                Favorites: temp
                <br />
                Recommendations: temp
            </p>
        </div>
    );
}

export default UserStats;