import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // Import Line instead of Bar
import Select from 'react-select';
import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, // Import LineElement for line chart
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, // Register LineElement for line chart
  Title,
  Tooltip,
  Legend
);

function MarketValuation() {
    const [countries, setCountries] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
      // Fetch countries
      axios.get('/player-country').then(response => {
        console.log('country data:', response.data); // Add this line
        setCountries(response.data);
      }).catch(error => {
        console.error('There was an error fetching the countries!', error);
      });
      
      // Fetch players based on the selected country
      if (selectedCountry) {
        axios.get('/player-country-club', {
          params: {
            country: selectedCountry
          }
        }).then(response => {
          console.log('country data player:', selectedCountry); // Add this line
          console.log('Player data:', response.data); // Add this line
          setPlayers(response.data);
        }).catch(error => {
          console.error('There was an error fetching the players!', error);
        });
      }
    }, [selectedCountry]);


    const countryOptions = countries.map(country => ({
      value: country.COUNTY_OF_BIRTH,
      label: country.COUNTY_OF_BIRTH
    }));
    
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
          label: 'Market Value in EUR',
          data: queryResults?.map(result => result.MARKET_VALUE_IN_EUR),
          backgroundColor: 'rgba(0, 0, 255, 0.5)', 
          borderColor: 'rgba(0, 0, 255, 1)', // Add borderColor for line chart
          fill: false, // Set fill to false for line chart
        },
        {
          label: 'Average Goals',
          data: queryResults?.map(result => result.AVG_GOALS),
          backgroundColor: 'rgba(255, 0, 0, 0.5)', 
          borderColor: 'rgba(255, 0, 0, 1)', // Add borderColor for line chart
          fill: false, // Set fill to false for line chart
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
            text: 'Value', // Update the y-axis title
          },
        },
      },
    };
    const customStyles = {
      option: (provided, state) => ({
          ...provided,
          color:'black',
          // backgroundColor: state.isSelected ? '#4d94ff' : '#004d40', // Adjust the background color as needed
      }),
      container: (provided) => ({
        ...provided,
        marginBottom: '10px', // Add 10px bottom margin to each Select component
      }),
  };

    return (
      <div>
          <h2>Market Valuation</h2>
          
          <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
          <Select
            className="custom-select"
            options={countryOptions}
            onChange={selectedOption => setSelectedCountry(selectedOption ? selectedOption.value : null)}
            placeholder="Select Country"
            styles={customStyles}
          /><Select
                  className="custom-select"
                  options={playerOptions}
                  onChange={selectedOption => setSelectedPlayer(selectedOption.value  )}
                  placeholder="Select Player"
                  styles={customStyles}
              />
          </div>

          <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
              Run
          </button>
          
          {queryResults && (
              <div>
                  <h2>Query Results:</h2>
                  <div style={{ backgroundColor: 'white', padding: '1rem' }}>
                  <Line data={chartData} options={chartOptions} /> {/* Use Line component */}
                  </div>
              </div>
          )}
      </div>
  );
}


export default MarketValuation;