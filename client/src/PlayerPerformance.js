import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import './App.css'; // Make sure you import the CSS file


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

function PlayerPerformance() {
    const [countries, setCountries] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [selectedCountryA, setSelectedCountryA] = useState('');
    const [selectedCountryB, setSelectedCountryB] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
        // Fetch countries from the server on component mount
        axios.get('/player-country')
            .then(response => {
                // Assuming the server response is an array of country names
                setCountries(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the countries!', error);
            });
        axios.get('/competitions')
            .then(response => {
                setCompetitions(response.data); // Save the competitions data
            })
            .catch(error => {
                console.error('There was an error fetching the competitions!', error);
            });

    }, []);
    const positions = ['Attack', 'Midfield', 'Defender', 'Goalkeeper'];

    
    const countryOptions = countries.map(country => ({
      value: country.COUNTY_OF_BIRTH,
      label: country.COUNTY_OF_BIRTH
    }));
  
    const competitionOptions = competitions.map(competition => ({
      value: competition.COMPETITION_ID,
      label: competition.NAME
    }));
  
    const positionOptions = positions.map(position => ({
      value: position,
      label: position
    }));

    

    


    const handleRunQuery = () => {
        // Perform the query to the `/query1` endpoint with the selected options
        axios.get('/query1', {
            params: {
                countryA: selectedCountryA,
                countryB: selectedCountryB,
                comp_id: selectedCompetition,
                position: selectedPosition
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
        labels: queryResults?.map(result => result.SEASON),
        datasets: [
          {
            label: selectedCountryA,
            data: queryResults?.map(result => result.COUNTRYA_AVG_GOALS),
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
          },
          {
            label: selectedCountryB,
            data: queryResults?.map(result => result.COUNTRYB_AVG_GOALS),
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
            text: "Performance of Player's from different Countries",
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Season',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Average Goals per Player',
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
            {/* Insert the content of your page here */}
            <h2>Player Performance</h2>
            {/* ... other components */}
            
            {/* Dropdowns at the bottom */}
            <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
            <Select
          className="custom-select"
          options={countryOptions}
          onChange={selectedOption => setSelectedCountryA(selectedOption.value)}
          placeholder="Select Country A"
          styles={customStyles}
        />
        <Select
          className="custom-select"
          options={countryOptions}
          onChange={selectedOption => setSelectedCountryB(selectedOption.value)}
          placeholder="Select Country B"
          styles={customStyles}
        />
        <Select
          className="custom-select"
          options={competitionOptions}
          onChange={selectedOption => setSelectedCompetition(selectedOption.value)}
          placeholder="Select Competition"
          styles={customStyles}
        />
        <Select
          className="custom-select"
          options={positionOptions}
          onChange={selectedOption => setSelectedPosition(selectedOption.value)}
          placeholder="Select Position"
          styles={customStyles}
        />
            </div>

            {/* Button to run the query */}
            <button className="btn btn-success" onClick={handleRunQuery}style={{ marginBottom: '10px' }}>Run</button>
            {/* Results section */}
            {queryResults && (
                <div>
                    <h2>Query Results:</h2>
                    <div style={{ backgroundColor: 'white', padding: '1rem' }}>
                    <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
            {/* Link back to TrendQueriesPage
            <Link to="/trend-queries" className="btn btn-primary">Back to Trends</Link> */}
        
        </div>
    );
}

export default PlayerPerformance;
