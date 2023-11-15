import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="container mt-5">
                <header className="text-center mb-5">
                    <h1>FootGame</h1>
                </header>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/general-stats" element={<GeneralStatsPage />} />
                    <Route path="/trend-queries" element={<TrendQueriesPage />} />
                    <Route path="/sql-editor" element={<SQLEditorPage />} />
                </Routes>
            </div>
        </Router>
    );
}

function HomePage() {
    return (
        <div>
            <section className="text-center">
                <h2>Get Football Statistics</h2>
            </section>

            <section className="d-flex justify-content-center mt-4">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <Link to="/general-stats" className="btn btn-primary btn-lg btn-block">
                            <img src="home_tile1.png" alt="General Stats Icon" className="mb-2 image-size"/>
                            General Stats
                        </Link>
                    </div>
                    <div className="col-md-4 mb-4">
                        <Link to="/trend-queries" className="btn btn-primary btn-lg btn-block">
                            <img src="home_tile2.png" alt="Trend Queries Icon" className="mb-2 image-size"/>
                            Trend Queries
                        </Link>
                    </div>
                    <div className="col-md-4 mb-4">
                        <Link to="/sql-editor" className="btn btn-primary btn-lg btn-block">
                            <img src="home_tile3.png" alt="SQL Editor Icon" className="mb-2 image-size"/>
                            SQL Editor
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .image-size {
                    width: 180px;
                    height: 180px;
                    object-fit: contain;
                }
            `}</style>
        </div>
    );
}

function GeneralStatsPage() {
    return <div>General Stats Content Here</div>;
}

function TrendQueriesPage() {
    return (
        <div>
            <h2 className="text-center mb-5">Trending Football Queries</h2>
            <div className="row">
                {["Player Performance", "Team Performance", "Player Market Value", "Clubs Performance", "Home & Away Performance", "Impact of Demographics"].map((query, idx) => (
                    <div key={idx} className="col-md-4 mb-4">
                        <button className="btn btn-info btn-lg btn-block">{query}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}


function SQLEditorPage() {
    return <div>SQL Editor Content Here</div>;
}

export default App;
