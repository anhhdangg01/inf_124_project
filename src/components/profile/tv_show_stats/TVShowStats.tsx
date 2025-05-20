import '../../../styles/profile.css';
import green_circle from '../../../assets/circles/green_circle.png';
import blue_circle from '../../../assets/circles/blue_circle.png';
import yellow_circle from '../../../assets/circles/yellow_circle.png';
import red_circle from '../../../assets/circles/red_circle.png';
import grey_circle from '../../../assets/circles/grey_circle.png';
import PieChart from './PieChart';

function TVShowStats() {
    return (
        <h2>TV Show Stats
            <div className="stats-card">
                <p>
                    <img src={green_circle} alt="Green Circle" className="circle-picture" />Watching
                    <br />
                    <img src={blue_circle} alt="Blue Circle" className="circle-picture" />Completed
                    <br />
                    <img src={yellow_circle} alt="Yellow Circle" className="circle-picture" />On-hold
                    <br />
                    <img src={red_circle} alt="Red Circle" className="circle-picture" />Dropped
                    <br />
                    <img src={grey_circle} alt="Grey Circle" className="circle-picture" />Plan to Watch
                    <br />
                    <br />
                    Total Entries
                    <br />
                    Rewatched
                    <br />
                    Total Episodes
                </p>
                <div className="pie-chart">
                    <PieChart />
                </div>
            </div>
        </h2>
    );
}

export default TVShowStats;