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
import ContactPage from './ContactPage';
import HomeAwayPerformance from './HomeAwayPerformance';
import axios from 'axios';
import './App.css'; 
import logo from './images/logo.png'; 



function App() {
    return (
        <Router>
            <div className="container mt-5">
                <header className="text-center mb-5">
                <div className="header-content d-flex align-items-center justify-content-center"> 
                        <img src={logo} alt="Logo" className="logo mr-3" /> 
                        <h1>Goal Track Pro</h1>
                    </div>
                    <nav className="nav justify-content-center">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </nav>
                    
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
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/home-away-performance" element={<HomeAwayPerformance />} />
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
                setTuples(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the tuples data!', error);
            });
    };

    const totalTuples = tuples.reduce((sum, tuple) => sum + tuple.ROW_COUNT, 0);

    
    return (
        <div className="home-page">
            <section className="hero-section text-center">
                <h2>Get Football Statistics</h2>
            </section>
            <section className="d-flex justify-content-center mt-4">
                <div className="row">
                    {[
                        { path: "/general-stats", image: "home_tile1_.png", alt: "General Stats Icon", text: "Player Profiles" },
                        { path: "/trend-queries", image: "home_tile2.png", alt: "Trend Queries Icon", text: "Trend Queries" },
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '1em' }}>
    <button className="btn btn-primary" onClick={fetchTuples} disabled={loading}>
      {loading ? 'Loading...' : 'Load Database Information'}
    </button>
  </div>


      {tuples.length > 0 && (
        <div>
          <h2>Database Table Information:</h2>
          <div >
          <table className="table rounded-table">
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


function AboutPage() {
    return (
        <div className="about-section-background">
            <h2>About Our Soccer Data Analysis Project</h2>
            <p>Welcome to our soccer data analysis platform, a cutting-edge digital destination for soccer enthusiasts, analysts, and professionals. Our project stands at the forefront of soccer data analytics, offering an unparalleled depth of information and insights into the beautiful game.</p>

            <h4>Unrivaled Data Repository</h4>
            <p>Our expansive database is a treasure trove of soccer statistics, encompassing over 60,000 matches across various seasons and prestigious competitions. We meticulously curate data from more than 400 soccer clubs worldwide, featuring detailed profiles of over 30,000 players. This rich dataset forms the backbone of our analysis, providing a comprehensive view of the soccer landscape.</p>

            <h4>Our Mission</h4>
            <p>Our primary goal is to unlock the stories hidden within these numbers. By analyzing this wealth of data, we aim to uncover valuable insights into player performances, team strategies, market dynamics, and historical match outcomes. We believe that our analytical approach can offer a fresh perspective on soccer, revealing patterns and trends that can transform our understanding of the game.</p>

            <h4>Innovative Analysis Tools</h4>
            <p>Our website is designed to be a hub for soccer trend analysis. We offer a range of analytical tools and features, including:</p>
            <ul>
                <li><strong>Player Profiles:</strong> A curated display of player details, providing insights into individual soccer talents from around the world.</li>
                <li><strong>Trend Analysis:</strong> Visual representations and in-depth analysis of soccer games, enabling users to discern emerging trends and patterns.</li>
            </ul>
            
            <p>Whether you are a soccer analyst looking to delve into player performance metrics, a club official exploring strategic insights, or a fan keen on understanding the nuances of your favorite team, our platform caters to all.</p>
            <p>Join us on this journey as we explore the world of soccer through the lens of data. Discover, analyze, and appreciate the beautiful game in ways you never thought possible.</p>
            <h4>Developed by</h4>
            <p>This project was brought to life by a dedicated team of enthusiasts of soccer data analysis:</p>
            <ul>
                <li>Ujwala Guttikonda</li>
                <li>Nikhil Yerra</li>
                <li>Arun Teja Unnagiri</li>
                <li>Praveen Kumar Dande</li>
            </ul>
            <p>Guided by: Prof. Markus Schneider</p>
        </div>
    );
}





export default App;
