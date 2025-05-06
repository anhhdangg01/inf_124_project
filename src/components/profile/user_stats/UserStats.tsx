import '../../../styles/profile.css';
import user_icon from '../../../assets/userIcon.png';
import mail_icon from '../../../assets/mail_icon.png';
import friend_request_icon from '../../../assets/friend_request_icon.png';


function UserStats() {
    return (
        <div className="user-info-card">
            <img src={user_icon} alt="User Icon" className="profile-picture" />
            <br />
            <h2>Testuser123</h2>
            <img src={mail_icon} alt="Mail Icon" className="profile-image" />
            <img src={friend_request_icon} alt="Friend Request Icon" className="profile-image" />
            <br />
            <p>
                Last Online:
                <br />
                Joined: 
                <br />
                <br />
                Reviews
                <br />
                Favorites
                <br />
                Recommendations
            </p>
        </div>
    );
}

export default UserStats;