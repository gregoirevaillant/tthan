import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
    const navigate = useNavigate();
    return (
        <div className="home-wrapper">
            <h1 className="home-title">Choisissez votre caisse </h1>
            <div className="navigations-wrapper">
                <button
                    className="navigation"
                    onClick={() => {
                        navigate("/daily");
                    }}
                >
                    Caisse Tthàn cang-tin
                </button>
                <button
                    className="navigation"
                    onClick={() => {
                        navigate("/vendanges");
                    }}
                >
                    Caisse des Vendanges
                </button>
                <button
                    className="navigation"
                    onClick={() => {
                        navigate("/events");
                    }}
                >
                    Caisse des évènements
                </button>
            </div>
        </div>
    );
}

export default Home;
