import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2';
import GeneralStatsPage from './GeneralStatsPage';
import TrendQueriesPage from './TrendQueriesPage'; 
import SQLEditorPage from './SQLEditorPage'; 
import PlayerPerformance from './PlayerPerformance';
import ClubPerformance from './ClubPerformance';
import MarketValuation from './MarketValuation';
import PlayerDemographics from './PlayerDemographics';
import axios from 'axios';


function App() {
    return (
        <Router>
            <div className="container mt-5">
                <header className="text-center mb-5">
                    <h1>Foot Game</h1>
                </header>
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/general-stats" element={<GeneralStatsPage />} />
                    <Route path="/trend-queries" element={<TrendQueriesPage />} />
                    <Route path="/sql-editor" element={<SQLEditorPage />} />
                    <Route path="/player-performance" element={<PlayerPerformance />} />
                    <Route path="/clubs-performance" element={<ClubPerformance />} />
                    <Route path="/player-market-value" element={<MarketValuation />} />
                    <Route path="/impact-of-demographics" element={<PlayerDemographics />} />
                </Routes>
            </div>
        </Router>
    );
}

function HomePage() {
    const [tuples, setTuples] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state


    const fetchTuples = () => {
        axios.get('/tuples')
            .then(response => {
                // Assuming the response data format is correct
                setTuples(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tuples data!', error);
            });
    };

    const totalTuples = tuples.reduce((sum, tuple) => sum + tuple.ROW_COUNT, 0);

    
    return (
        <div>
            <section className="text-center">
                <h2>Get Football Statistics</h2>
            </section>

            <section className="d-flex justify-content-center mt-4">
                <div className="row">
                    {[
                        { path: "/general-stats", image: "home_tile1.png", alt: "General Stats Icon", text: "General Stats" },
                        { path: "/trend-queries", image: "home_tile2.png", alt: "Trend Queries Icon", text: "Trend Queries" },
                        { path: "/sql-editor", image: "home_tile3.png", alt: "SQL Editor Icon", text: "SQL Editor" }
                    ].map((item, idx) => (
                        <div key={idx} className="col-md-4 mb-4">
                            <Link to={item.path} className="btn btn-primary btn-lg btn-block d-flex flex-column align-items-center">
                                <img src={item.image} alt={item.alt} className="mb-2 image-size"/>
                                {item.text}
                            </Link>
                        </div>
                    ))}
                </div>
                
            </section>
            <button className="btn btn-info" onClick={fetchTuples} disabled={loading}>
        {loading ? 'Loading...' : 'Load Database Information'}
      </button>

      {tuples.length > 0 && (
        <div>
          <h2>Database Table Information:</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Row Count</th>
              </tr>
            </thead>
            <tbody>
              {tuples.map((tuple, index) => (
                <tr key={index}>
                  <td>{tuple.TABLE_NAME}</td>
                  <td>{tuple.ROW_COUNT}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
                            <tr>
                                <th>Total</th>
                                <th>{totalTuples}</th>
                            </tr>
                        </tfoot>
          </table>
        </div>
      )}

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


export default App;
