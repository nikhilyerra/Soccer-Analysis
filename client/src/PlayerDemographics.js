import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
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

function PlayerDemographics() {
    const [clubs, setClubs] = useState([]);
    const [selectedFoot, setSelectedFoot] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [seasonLabels, setSeasonLabels] = useState([]);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [queryResults, setQueryResults] = useState([]);

    useEffect(() => {
        axios.get('/clubs')
            .then(response => {
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
      const hue = (360 * index) / total;
      return `hsl(${hue}, 70%, 60%)`;
    };
    
    const handleRunQuery = async () => {
      try {
        const promises = selectedClubs.map(club => 
          axios.get('/query6', {
            params: {
                height: height,
                age: age,
                foot: selectedFoot,
                position: selectedPosition,
                club_id: club.value
              }
          })
        );

        const results = await Promise.all(promises);

        let seasonLabels = [];
        const totalClubs = selectedClubs.length;

        const aggregatedResults = results.flatMap((response, index) => {
          const color = generateColor(index, totalClubs);
          if (index === 0) {
            seasonLabels = response.data.map(data => data.SEASON);
          }

          return [
            {
              label: `${clubs.find(club => club.value === selectedClubs[index].value).label} - Lesser`,
              data: response.data.map(data => data.WIN_PERCENTAGE_LESS_OR_EQUAL),
              borderColor: color,
              backgroundColor: color,
              tension: 0.2,
              pointRadius: 6,
              pointHoverRadius: 6,
              pointStyle: 'triangle'
            },
            {
              label: `${clubs.find(club => club.value === selectedClubs[index].value).label} - Greater`,
              data: response.data.map(data => data.WIN_PERCENTAGE_GREATER),
              borderColor: color,
              backgroundColor: color,
              tension: 0.2,
              pointStyle: 'circle'
            }
          ];
        });

        setQueryResults(aggregatedResults);
        setSeasonLabels(seasonLabels);
      } catch (error) {
        console.error('There was an error running the query!', error);
      }
    };

    const chartData = {
      labels: seasonLabels,
      datasets: queryResults
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: "Player Demographics Analysis",
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
        color: 'black',
      }),
      container: (provided) => ({
        ...provided,
        marginTop: '10px',
        marginBottom: '10px',
      }),
    };

    return (
        <div>
            <h2>Player Demographics</h2>
            <p className="large-font">Analyze team performance trends based on average player demographics</p>

            <div>
                <input
                    type="number"
                    placeholder="Height (cm)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="input-field"
                    style={{ color: 'black' }}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input-field"
                    style={{ color: 'black' }}
                />
            </div>

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
                isMulti
                closeMenuOnSelect={false}
                styles={customStyles}
            />

            <button className="btn btn-success" onClick={handleRunQuery} style={{ marginBottom: '10px' }}>
                Run
            </button>
            
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
