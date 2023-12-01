import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css'; // Assuming this CSS file contains your styling

// Component for displaying individual player cards
const PlayerCard = ({ player }) => (
    <div className="player-card">
      <div className="player-card-image-container">
        <img src={player.IMAGE_URL} alt={player.NAME} className="player-image" />
      </div>
      <div className="player-card-info">
        <h3 className="player-card-name">{player.NAME}</h3>
        <p className="player-card-detail">Date of Birth: {player.DATE_OF_BIRTH.split('T')[0]}</p>
        <p className="player-card-detail">Country of Birth: {player.COUNTY_OF_BIRTH}</p>
        <p className="player-card-detail">Position: {player.POSITION}</p>
        <p className="player-card-detail">Height: {player.HEIGHT_IN_CM} cm</p>
        <p className="player-card-detail">Foot: {player.FOOT}</p> 
      </div>
    </div>
  );

function GeneralStatsPage() {
  

  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [playerDetails, setPlayerDetails] = useState([]);

  useEffect(() => {
    // Fetch clubs
    axios.get('/clubs').then(response => {
      setClubs(response.data);
    }).catch(error => {
      console.error('There was an error fetching the clubs!', error);
    });
  }, []);



  useEffect(() => {
    if (selectedClubs && selectedClubs.length > 0) {
        const clubIds = selectedClubs.map(c => c.value); // Extract the country names from the selected options
        axios.post('/player-multiclub', {
            clubs: clubIds
        }).then(response => {
            setPlayers(response.data);
            console.log(selectedClubs)
            console.log(response)
        }).catch(error => {
            console.error('There was an error fetching the players!', error);
        });
    }
}, [selectedClubs]);

  useEffect(() => {
    // Fetch player details when players are selected
    const fetchPlayerDetails = async () => {
      try {
        const responses = await Promise.all(
          selectedPlayers.map(playerId =>
            axios.get('/player-info', { params: { player_id: playerId } })
          )
        );
        setPlayerDetails(responses.map(response => response.data[0])); // Assuming each response contains an array with a single player object
      } catch (error) {
        console.error('There was an error fetching player details!', error);
      }
    };

    if (selectedPlayers.length > 0) {
      fetchPlayerDetails();
    }
  }, [selectedPlayers]);

  // Convert club data to options for the Select component
  const clubOptions = clubs.map(club => ({
    value: club.CLUB_ID,
    label: club.NAME
  }));

  // Convert player data to options for the Select component
  const playerOptions = players.map(player => ({
    value: player.PLAYER_ID,
    label: player.NAME
  }));

  const handleSelectClubs = selectedOptions => {
    setSelectedClubs(selectedOptions || []);
  };
  // Handle selection of multiple players
  const handleSelectPlayers = selectedOptions => {
    setSelectedPlayers(selectedOptions.map(option => option.value));
  };

  // Retrieve the full player objects for the selected players
  const selectedPlayerDetails = players.filter(player =>
    selectedPlayers.includes(player.PLAYER_ID)
  );

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
    <div className="general-stats-page">
      <h1>Player Statistics</h1>
      <p className="large-font">A curated display of player details, providing insights into individual soccer talents from around the world</p>
      <Select
        options={clubOptions}
        onChange={handleSelectClubs}
        placeholder="Select Clubs"
        isMulti
        closeMenuOnSelect={false}
        className="custom-select"
        styles={customStyles}
      />
      <Select
        options={playerOptions}
        isMulti
        onChange={handleSelectPlayers}
        placeholder="Select Players"
        className="custom-select"
        styles={customStyles}
      />
     <div className="player-cards-container">
        {playerDetails.map(player => (
          <PlayerCard key={player.player_id} player={player} />
        ))}
      </div>
    </div>
  );
}

export default GeneralStatsPage;


//image url
//name
// date of birth
//country of birth
//position
//foot
//height

