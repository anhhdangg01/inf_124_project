import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { getMovieDetails } from '../functions/api_service';

function ReviewsList() {
    return (
        <div className="App">
            <Header />
            <div style={{marginTop: '100px'}}></div>
            <Footer />
        </div>
    );
}

export default ReviewsList;