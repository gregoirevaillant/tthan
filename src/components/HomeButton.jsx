import { Link } from "react-router-dom";

function HomeButton({ destination, children, className }) {
    return (
        <Link to={destination} className={className}>
            {children}
        </Link>
    );
}

export default HomeButton;