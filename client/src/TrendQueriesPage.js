import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Make sure you import the CSS file


function TrendQueriesPage() {
    const navigate = useNavigate();

    // Function to handle button clicks and navigate to the respective route
    const handleButtonClick = (route) => {
        navigate(route);
    };

    return (
        <div>
            <h2 className="text-center mb-5">Trending Football Queries</h2>
            <div className="button-container">
    <div className="row">
        {[
            { label: "Clubs Performance", route: "/clubs-performance" },
            { label: "Player Performance", route: "/player-performance" },
            { label: "Player Market Value", route: "/player-market-value" },
            { label: "Impact of Demographics", route: "/impact-of-demographics" },
            { label: "Home & Away Performance", route: "/home-away-performance" }

        ].map((item, idx) => (
            <div key={idx} className="col-12 mb-4 d-flex justify-content-center"> {/* Add classes for flexbox centering */}
                <button
                    className="btn btn-info btn-lg"
                    onClick={() => handleButtonClick(item.route)}
                >
                    {item.label}
                </button>
            </div>
        ))}
    </div>
</div>


        </div>
    );
}

export default TrendQueriesPage;
