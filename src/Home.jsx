import "./Home.css";

import HomeButton from "./components/HomeButton";

function Home() {
    return (
        <div className="home-page">
            <h1 className="home-title">Choisissez votre caisse </h1>
            <div className="home-buttons">
                <HomeButton
                    destination="daily"
                    children="Caisse Tthàn cang-tin"
                />
                <HomeButton
                    destination="vendanges"
                    children="Caisse des Vendanges"
                />
                <HomeButton
                    destination="event"
                    children="Caisse des évènements"
                />
                <HomeButton
                    destination="vendanges-new"
                    children="Caisse des Vendanges New"
                />
            </div>
        </div>
    );
}

export default Home;
