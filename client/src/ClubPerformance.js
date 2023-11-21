import React, { useState, useEffect } from 'react';
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

function ClubPerformance() {
    const [clubs, setClubs] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [range, setRange] = useState('');
    const [queryResults, setQueryResults] = useState(null);

    useEffect(() => {
        axios.get('/clubs').then(response => {
            setClubs(response.data);
        }).catch(error => {
            console.error('There was an error fetching the clubs!', error);
        });

        axios.get('/competitions').then(response => {
            setCompetitions(response.data);
        }).catch(error => {
            console.error('There was an error fetching the competitions!', error);
        });
    }, []);

    const clubOptions = clubs.map(club => ({
      value: club.CLUB_ID,
      label: club.NAME
    }));

    const competitionOptions = competitions.map(competition => ({
      value: competition.COMPETITION_ID,
      label: competition.NAME
    }));

    const handleRunQuery = () => {
        axios.get('/query2', {
            params: {
                club_id: selectedClub,
                comp_id: selectedCompetition,
                range: range
            }
        }).then(response => {
            setQueryResults(response.data);
        }).catch(error => {
            console.error('There was an error running the query!', error);
        });
    };

    const chartData = {
        labels: queryResults?.map(result => result.MINUTE_GROUP),
        datasets: [
          {
            label: 'Goals',
            data: queryResults?.map(result => result.GOALS),
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
          },
          {
            label: 'Substitutions',
            data: queryResults?.map(result => result.SUBSTITUTIONS),
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
            text: "Performance of Clubs",
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Game Intervals',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Number of goals or substitutions',
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
    };
    return (
        <div>
            <h2>Club Performance</h2>
            
            <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
                <Select
                    className="custom-select"
                    options={clubOptions}
                    onChange={selectedOption => setSelectedClub(selectedOption ? selectedOption.value : null)}
                    placeholder="Select Club"
                    styles={customStyles}
                />
                <Select
                    className="custom-select"
                    options={competitionOptions}
                    onChange={selectedOption => setSelectedCompetition(selectedOption ? selectedOption.value : null)}
                    placeholder="Select Competition"
                    styles={customStyles}
                />
                <input
                    type="number"
                    value={range}
                    onChange={e => setRange(e.target.value)}
                    placeholder="Enter Range (1-90)"
                    className="custom-select"
                    min="1"
                    max="90"
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

export default ClubPerformance;
