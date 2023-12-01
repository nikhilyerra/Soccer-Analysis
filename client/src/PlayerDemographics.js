import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import './App.css'; // Make sure you import the CSS file


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PlayerDemographics() {
    const [clubs, setClubs] = useState([]);
    const [selectedFoot, setSelectedFoot] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [seasonLabels, setSeasonLabels] = useState('');

    // const [selectedClub, setSelectedClub] = useState('');
    const [selectedClubs, setSelectedClubs] = useState([]);

    const [minHeight, setMinHeight] = useState('');
    const [maxHeight, setMaxHeight] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
        // Fetch clubs from the server on component mount
        axios.get('/clubs')
            .then(response => {
                // Transform the response to match react-select's format
                const clubOptions = response.data.map(club => ({
                    value: club.CLUB_ID,
                    label: club.NAME
                }));
                setClubs(clubOptions);
            })
            .catch(error => {
                console.error('There was an error fetching the clubs!', error);
            });
    }, []);

    const footOptions = [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'both', label: 'Both' }
    ];
    const positionOptions = [
        { value: 'Attack', label: 'Attack' },
        { value: 'Midfield', label: 'Midfield' },
        { value: 'Defender', label: 'Defender' },
        { value: 'Goalkeeper', label: 'Goalkeeper' }
    ];
    const generateColor = (index, total) => {
      const hue = (360 * index) / total; // Distribute hues around the color wheel
      return `hsl(${hue}, 70%, 60%)`; // Adjust saturation and lightness as needed
    };
    
    const handleRunQuery = async () => {
      try {
      const selectedClubIds = selectedClubs.map(club => club.value); // Extract club IDs from selected clubs
      const promises = selectedClubs.map(club => 


        axios.get('/query6', {
            params: {
                min_height: minHeight,
                max_height: maxHeight,
                min_age: minAge,
                max_age: maxAge,
                foot: selectedFoot,
                position: selectedPosition,
                // club_id: selectedClub
                // club_ids: selectedClubIds
                club_id: club.value
              }
          })
      );

      const results = await Promise.all(promises);

      let seasonLabels = []; // To store unique season years
      const totalClubs = selectedClubs.length;

    const aggregatedResults = results.map((response, index) => {
      const color = generateColor(index, totalClubs); 
        if (index === 0) { // Only for the first set of results
            seasonLabels = response.data.map(data => data.SEASON); // Extract the seasons
        }

        return {
            label: `Team ${selectedClubs[index].label}`,
            data: response.data.map(data => data.WIN_PERCENTAGE),
            borderColor: color,
            backgroundColor: color,
            tension: 0.2
        };
    });

    setQueryResults(aggregatedResults);
    setSeasonLabels(seasonLabels); // Store the season labels in state
  } catch (error) {
    console.error('There was an error running the query!', error);
  }
};

const chartData = {
  labels: seasonLabels, // Use the season years as labels
  datasets: queryResults || []
};
    
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: "Team Performance",
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
              text: 'Win Percentages',
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
          marginTop: '10px',
          marginBottom: '10px', // Add 10px bottom margin to each Select component
        }),
    };

    return (
        <div>
            <h2>Player Demographics</h2>
            <p className="large-font">Analyze team performance trends based on average player demographics</p>

            
            {/* Input fields for height and age */}
            <div>
                <input
                    type="number"
                    placeholder="Min Height (cm)"
                    value={minHeight}
                    onChange={(e) => setMinHeight(e.target.value)}
                    style={{ color: 'black' }}
                    className="input-field"

                    
                />
                <input
                    type="number"
                    placeholder="Max Height (cm)"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
                    style={{ color: 'black' }}
                    className="input-field"

                 
                />
                <input
                    type="number"
                    placeholder="Min Age"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    style={{ color: 'black' }}
                    className="input-field"

                  
                />
                <input
                    type="number"
                    placeholder="Max Age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    style={{ color: 'black' }}
                 
                />
            </div>
            
            {/* Dropdowns for foot, position, and club */}
            <Select
                className="custom-select"
                options={footOptions}
                onChange={selectedOption => setSelectedFoot(selectedOption ? selectedOption.value : '')}
                placeholder="Select Foot Preference"
                isClearable
                styles={customStyles}
            />
            <Select
                className="custom-select"
                options={positionOptions}
                onChange={selectedOption => setSelectedPosition(selectedOption ? selectedOption.value : '')}
                placeholder="Select Position"
                isClearable
                styles={customStyles}
            />
            <Select
                className="custom-select"
                options={clubs}
                onChange={selectedOptions => setSelectedClubs(selectedOptions || [])}
                placeholder="Select Clubs"
                isMulti // Enable multiple selection
                closeMenuOnSelect={false} // Keep the menu open after selection
                styles={customStyles}
            />

            <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
                Run
            </button>
            
            {/* Results section */}
            {queryResults && queryResults.length > 0 && (
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

export default PlayerDemographics;