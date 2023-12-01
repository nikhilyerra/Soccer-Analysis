import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import Select from 'react-select';
import './App.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, 
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, 
  Title,
  Tooltip,
  Legend
);

function HomeAwayPerformance() {
  const [countries, setCountries] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [maxRedCards, setMaxRedCards] = useState('');
  const [maxYellowCards, setMaxYellowCards] = useState('');
  const [minMinutesPlayed, setMinMinutesPlayed] = useState('');
  const [queryResults, setQueryResults] = useState(null);

  useEffect(() => {
    // Fetch countries
    axios.get('/player-country').then(response => {
      console.log('country data:', response.data); 
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
        console.log('country data player:', selectedCountry); 
        console.log('Player data:', response.data); 
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
    axios.get('/query4', {
      params: {
        max_red_cards: maxRedCards,
        max_yellow_cards: maxYellowCards,
        min_minutes_played: minMinutesPlayed,
        player_id: selectedPlayer
      }
    }).then(response => {
      setQueryResults(response.data);
    }).catch(error => {
      console.error('There was an error running the query!', error);
    });
  };

  const chartData = {
    labels: queryResults?.map(result => result.SEASON),
    datasets: [
      {
        label: 'Home Win Percentage',
        data: queryResults?.map(result => result.HOME_WIN_PERCENTAGE),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
      {
        label: 'Away Win Percentage',
        data: queryResults?.map(result => result.AWAY_WIN_PERCENTAGE),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
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
        text: "Home and Away Performance",
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Seasons',
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Win Percentage',
        },
      },
    },
  };

  const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color:'black',
    }),
    container: (provided) => ({
      ...provided,
      marginTop: '10px',
      marginBottom: '10px', 
      paddingRight: '10px',
    }),
};

  return (
    <div>
      <h2>Home and Away Performance</h2>
      <p className="large-font">Evaluate player performance at home and away matches</p>


      <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
        <Select
          className="custom-select"
          options={countryOptions}
          onChange={selectedOption => setSelectedCountry(selectedOption ? selectedOption.value : null)}
          placeholder="Select Country"
          styles={customStyles}
        />
        <Select
          className="custom-select"
          options={playerOptions}
          onChange={selectedOption => setSelectedPlayer(selectedOption.value  )}
          placeholder="Select Player"
          styles={customStyles}
        />
        <input
          type="number"
          value={maxRedCards}
          onChange={e => setMaxRedCards(e.target.value)}
          placeholder="Max Red Cards"
          className="input-field"
          min="0"
          style={{ color: 'black' }}
        />
        <input
          type="number"
          value={maxYellowCards}
          onChange={e => setMaxYellowCards(e.target.value)}
          placeholder="Max Yellow Cards"
          className="input-field"
          min="0"
          style={{ color: 'black' }}
        />
        <input
          type="number"
          value={minMinutesPlayed}
          onChange={e => setMinMinutesPlayed(e.target.value)}
          placeholder="Min Minutes Played"
          className="input-field"
          min="0"
          style={{ color: 'black' }}
        />
      </div>

      <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
        Run
      </button>

      {queryResults && (
        <div>
          <h2>Query Results:</h2>
          <div style={{ backgroundColor: 'white', padding: '1rem' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
          
        </div>
      )}
    </div>
  );
}

export default HomeAwayPerformance;
