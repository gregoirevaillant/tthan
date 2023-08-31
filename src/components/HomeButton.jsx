import React from "react";

import { useNavigate } from "react-router-dom";

function HomeButton(props) {
    const navigate = useNavigate();
    return (
        <button
            className="home-button"
            onClick={() => {
                navigate(`/${props.destination}`);
            }}
        >
            {props.children}
        </button>
    );
}

export default HomeButton;
