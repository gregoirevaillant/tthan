import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import VendangePage from "./pages/VendangesPage/VendangesPage";
import DailyPage from "./pages/DailyPage/DailyPage";
import EventPage from "./pages/EventsPage/EventPage";
import DailyPageNew from "./pages/DailyPageNew/DailyPageNew";

import App from "./Home.jsx";
import VendangesPageNew from "./pages/VendangesPageNew/VendangesPageNew.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/vendanges" element={<VendangePage />} />
            <Route path="/vendanges-new" element={<VendangesPageNew />} />
            <Route path="/daily" element={<DailyPage />} />
            <Route path="/daily-new" element={<DailyPageNew />} />
            <Route exact path="/event" element={<EventPage />} />
        </Routes>
    </HashRouter>
);
