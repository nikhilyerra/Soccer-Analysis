import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import './App.css';
import 'chartjs-adapter-date-fns';




import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale, // register TimeScale
  Title,
  Tooltip,
  Legend
);

// Helper function to convert date to fractional year
const dateToFractionalYear = (dateString) => {
  const date = new Date(dateString);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return date.getFullYear() + dayOfYear / 365;
};

function MarketValuation() {
    const [countries, setCountries] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
      axios.get('/player-country').then(response => {
          setCountries(response.data);
      }).catch(error => {
          console.error('There was an error fetching the countries!', error);
      });
  }, []);

  // This will now handle the update when selectedCountry changes
  useEffect(() => {
      if (selectedCountry && selectedCountry.length > 0) {
          const countryNames = selectedCountry.map(c => c.value); // Extract the country names from the selected options
          axios.post('/player-multicountry', {
              countries: countryNames
          }).then(response => {
              setPlayers(response.data);
              console.log(selectedCountry)
              console.log(response)
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

    const handleCountryChange = selectedOptions => {
      setSelectedCountry(selectedOptions || []);
      console.log(selectedCountry)
  };

    const handleRunQuery = async () => {
        if (!selectedPlayers || selectedPlayers.length === 0) {
            alert('Please select at least one player.');
            return;
        }

        const promises = selectedPlayers.map(player =>
            axios.get('/query3', {
                params: { player_id: player.value }
            })
        );

        
        try {
          const results = await Promise.all(promises);
          const marketValueDataSets = [];
          const averageGoalsDataSets = [];
            // Aggregating data from all players
            results.forEach((response, index) => {
              const playerData = response.data;
              const playerLabel = selectedPlayers[index].label;

              // Market Value Dataset
              marketValueDataSets.push({
                label: playerLabel,
                data: playerData.map(item => ({ x: item.CURRENT_VALUATION_DATE, y: item.MARKET_VALUE_IN_EUR })),
                borderColor: getRandomColor(), // Function to generate a random color
                fill: false,
                tension: 0.5
            });

            // Average Goals Dataset
            averageGoalsDataSets.push({
                label: playerLabel,
                data: playerData.map(item => ({ x: item.CURRENT_VALUATION_DATE, y: item.AVG_GOALS })),
                borderColor: getRandomColor(), // Use the same color or a different one
                fill: false,
                tension: 0.5
            });
          });
          console.log(marketValueDataSets)

          setQueryResults({ marketValueDataSets, averageGoalsDataSets });
        } catch (error) {
            console.error('There was an error running the query!', error);
        }
    };

    const getRandomColor = () => {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  };

  //Prepare chart data using the datasets
  const marketValueChartData = {
      datasets: queryResults?.marketValueDataSets || []
  };

  const averageGoalsChartData = {
      datasets: queryResults?.averageGoalsDataSets || []
  };


  const marketchartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Player Valuation (in Millions)",
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd', // Specify the format of your input date
          tooltipFormat: 'yyyy',
          unit: 'year',
        },
        title: {
          display: true,
          text: 'Valuation Year',
        },
        ticks: {
          major: {
            enabled: true // this will add a strong line on top of the first tick
          }
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Player Market Value',
        },
      },
    },
  };


  const goalschartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: "Average Goals Scored",
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd', // Specify the format of your input date
          tooltipFormat: 'yyyy',
          unit: 'year',
        },
        title: {
          display: true,
          text: 'Valuation Year',
        },
        ticks: {
          major: {
            enabled: true // this will add a strong line on top of the first tick
          }
        }
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
          <p className="large-font">Track the market value and performance trend of players</p>

          
          <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
          <Select
                className="custom-select"
                options={countryOptions}
                onChange={handleCountryChange}
                placeholder="Select Country"
                isMulti // This allows multiple options to be selected
                closeMenuOnSelect={false}
                styles={customStyles}
            />
<Select
          className="custom-select"
          options={playerOptions}
          onChange={selectedOptions => setSelectedPlayers(selectedOptions || [])}
          placeholder="Select Player(s)"
          isMulti
          closeMenuOnSelect={false}
          styles={customStyles}
        />
          </div>

          <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
              Run
          </button>
          
          {queryResults && (
                <div>
                    <h2>Market Value Over Time:</h2>
                    <div style={{ backgroundColor: 'white', padding: '1rem' }}>
                        <Line data={marketValueChartData} options={marketchartOptions} />
                    </div>
                    <h2>Average Goals Over Time:</h2>
                    <div style={{ backgroundColor: 'white', padding: '1rem' }}>
                        <Line data={averageGoalsChartData} options={goalschartOptions} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketValuation;