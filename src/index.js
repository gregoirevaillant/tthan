import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./Home.jsx";
import VendangePage from "./pages/VendangesPage/VendangesPage";
import DailyPage from "./pages/DailyPage/DailyPage";
import EventsPage from "./pages/EventsPage/EventsPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/vendanges" element={<VendangePage />} />
                <Route path="/daily" element={<DailyPage />} />
                <Route path="/events" element={<EventsPage />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>
);

reportWebVitals();
