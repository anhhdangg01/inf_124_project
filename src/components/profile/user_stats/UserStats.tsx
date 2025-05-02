import '../../../styles/profile.css';
import user_icon from '../../../assets/userIcon.png';
import mail_icon from '../../../assets/mail_icon.png';
import friend_request_icon from '../../../assets/friend_request_icon.png';


function UserStats() {
    return (
        <div className="stats-card">
            <img src={user_icon} alt="User Icon" className="profile-picture" />
            <br />
            <img src={mail_icon} alt="Mail Icon" className="profile-image" />
            <img src={friend_request_icon} alt="Friend Request Icon" className="profile-image" />
            <br />
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
        </div>
    );
}

export default UserStats;