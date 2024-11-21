import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/WelcomeDashboard.css"; // Import custom styles

function WelcomeDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve username from localStorage or fallback to default
    const username = localStorage.getItem("username") || "User";

    // Store username in localStorage if it exists in location.state
    useEffect(() => {
        if (location.state?.email) {
            localStorage.setItem("username", location.state.email);
        }
    }, [location.state]);

    const handleLogout = () => {
        // Clear username from localStorage on logout
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="glass-container text-center p-4">
            <h4 className="mb-3 text-white">
                Welcome, {username.split("@")[0]} :)
            </h4>
            <button
                type="button"
                className="btn btn-light mt-3"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default WelcomeDashboard;
