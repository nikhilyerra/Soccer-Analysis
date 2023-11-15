import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
                        { label: "Player Performance", route: "/player-performance" },
                        { label: "Team Performance", route: "/team-performance" },
                        { label: "Player Market Value", route: "/player-market-value" },
                        { label: "Clubs Performance", route: "/clubs-performance" },
                        { label: "Home & Away Performance", route: "/home-away-performance" },
                        { label: "Impact of Demographics", route: "/impact-of-demographics" },
                    ].map((item, idx) => (
                        <div key={idx} className="col-md-4 mb-4">
                            <button
                                className="btn btn-info btn-lg btn-block"
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
