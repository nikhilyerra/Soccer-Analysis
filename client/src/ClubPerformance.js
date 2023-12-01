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
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [range, setRange] = useState('');
    const [queryResults, setQueryResults] = useState([]);

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
      Promise.all(selectedClubs.map(club =>
          axios.get('/query2', {
              params: {
                  club_id: club,
                  comp_id: selectedCompetition,
                  range: range
              }
          })
      )).then(responses => {
          setQueryResults(responses.map((response, index) => ({ 
              data: response.data, 
              clubId: selectedClubs[index] 
          })));
      }).catch(error => {
          console.error('There was an error running the query!', error);
      });
  };
  
  const chartData = {
    labels: queryResults.length > 0 ? queryResults[0].data.map(result => result.MINUTE_GROUP) : [],
    datasets: queryResults.flatMap((resultObj, index) => {
        const club = clubs.find(club => club.CLUB_ID === resultObj.clubId);
        if (!club) return []; // Skip if the club is not found

        const { data: results } = resultObj;
        return [
          {
            label: `Goals - ${clubs.find(club => club.CLUB_ID === selectedClubs[index]).NAME}`,
            data: results.map(result => result.GOALS),
            borderColor: `hsl(${index * 137}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 137}, 70%, 50%, 0.5)`,
            tension: 0.5,
            pointRadius: 6,
              pointHoverRadius: 6,
            
            pointStyle: 'triangle'
          },
          {
            label: `Substitutions - ${clubs.find(club => club.CLUB_ID === selectedClubs[index]).NAME}`,
            data: results.map(result => result.SUBSTITUTIONS),
            borderColor: `hsl(${index * 137 + 20}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 137 + 20}, 70%, 50%, 0.5)`,
            tension: 0.5,
            pointStyle: 'circle'
          }
        ];
    })
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
        }),
        container: (provided) => ({
          ...provided,
          marginTop: '10px',
          marginBottom: '10px',
        }),
    };
    return (
        <div>
            <h2>Club Performance</h2>
            <p className="large-font">Trend of goals scored and substitutions made by soccer clubs over specified game intervals</p>

            <div className="dropdowns-container" style={{ marginBottom: '10px' }}>
                <Select
                    className="custom-select"
                    options={clubOptions}
                    onChange={selectedOptions => setSelectedClubs(selectedOptions ? selectedOptions.map(option => option.value) : [])}
                    placeholder="Select Club"
                    styles={customStyles}
                    isMulti
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
            
            {queryResults.length > 0 && (
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
