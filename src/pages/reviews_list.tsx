import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { getMovieDetails } from '../functions/api_service';

function ReviewsList() {
    return (
        <div className="App">
            <Header />
            
            <Footer />
        </div>
    );
}

export default ReviewsList;