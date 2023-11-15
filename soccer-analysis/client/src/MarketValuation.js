import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MarketValuation() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
        // Fetch players from the server on component mount
        axios.get('/player-country-club')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the player data!', error);
            });
    }, []);

    const playerOptions = players.map(player => ({
        value: player.PLAYER_ID,
        label: player.NAME
    }));


    const handleRunQuery = () => {
        if (!selectedPlayer) {
            alert('Please select a player.');
            return;
        }
        // Perform the query to the `/query3` endpoint with the selected player ID
        axios.get('/query3', {
            params: {
                player_id: selectedPlayer
            }
        })
        .then(response => {
            setQueryResults(response.data); // Save the query results
        })
        .catch(error => {
            console.error('There was an error running the query!', error);
        });
    };

    const chartData = {
        labels: queryResults?.map(result => result.CURRENT_VALUATION_DATE),
        datasets: [
          {
            label: 'MARKET_VALUE_IN_EUR:',
            data: queryResults?.map(result => result.MARKET_VALUE_IN_EUR),
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
          },
          {
            label: 'Average Goals',
            data: queryResults?.map(result => result.AVG_GOALS),
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
          }
        ]
      };
    
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: "Market value (in Millions) and Average Goals",
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Valuation Date',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Average Goals',
            },
          },
        },
      };


    return (
        <div>
            <h2>Market Valuation</h2>
            
            <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
                <Select
                    className="custom-select"
                    options={playerOptions}
                    onChange={selectedOption => setSelectedPlayer(selectedOption.value  )}
                    placeholder="Select Player"
                />
            </div>

            <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
                Run
            </button>
            
            {queryResults && (
                <div>
                    <h2>Query Results:</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
}

export default MarketValuation;
