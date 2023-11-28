import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';
import './App.css';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem'; // Make sure you import the CSS file

function ResultsTable({ results }) {
  if (!results || results.length === 0) {
    return <div>No results to display.</div>;
  }

  // Assuming all rows have the same structure, use the keys of the first object for column headers
  const headers = Object.keys(results[0]);

  return (
    <div className="scrollable-table-container">
    <table className="striped-table">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((row, index) => (
          <tr key={index}>
            {headers.map(header => (
              <td key={`${index}-${header}`}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
 function FileSystemNavigator() {
  return (
  <div>
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId = "1" label = "APPEARANCES">
<TreeItem nodeId = "2" label = "APPEARANCE_ID" />
	<TreeItem nodeId = "3" label = "ASSISTS" />
<TreeItem nodeId = "4" label = "COMPETITION_ID" />
	<TreeItem nodeId = "5" label = "PLAYER_NAME" />
<TreeItem nodeId = "6" label = "APPEARANCE_DATE" />
	<TreeItem nodeId = "7" label = "PLAYER_ID" />	
<TreeItem nodeId = "8" label = "MINUTES_PLAYED" />
	<TreeItem nodeId = "9" label = "PLAYER_CLUB_ID" />
<TreeItem nodeId = "10" label = "GAME_ID" />
	<TreeItem nodeId = "11" label = "GOALS" />
<TreeItem nodeId = "12" label = "RED_CARDS" />
	<TreeItem nodeId = "13" label = "YELLOW_CARDS" />
</TreeItem>
<TreeItem nodeId = "14" label = "CLUB_GAMES">
	<TreeItem nodeId = "15" label = "GAME_ID" />
	<TreeItem nodeId = "16" label = "OPPONENT_POSITION" /> 	
<TreeItem nodeId = "17" label = "OPPONENT_GOALS" />
	<TreeItem nodeId = "18" label = "OPPONENT_ID" /> 	
<TreeItem nodeId = "19" label = "OWN_POSITION" />
	<TreeItem nodeId = "20" label = "OWN_GOALS" /> 
	<TreeItem nodeId = "21" label = "CLUB_ID" />
	<TreeItem nodeId = "22" label = "IS_WIN" /> 	
<TreeItem nodeId = "23" label = "HOSTING" />
</TreeItem>
 

<TreeItem nodeId = "24" label = "CLUBS">
	<TreeItem nodeId = "25" label = "CLUB_ID" /> 	
<TreeItem nodeId = "26" label = "CLUB_CODE" />
	<TreeItem nodeId = "27" label = "NET_TRANSFER_RECORD" /> 
	<TreeItem nodeId = "28" label = "COACH_NAME" />
	<TreeItem nodeId = "29" label = "NAME" /> 	
<TreeItem nodeId = "30" label = "LAST_SEASON" />
	<TreeItem nodeId = "31" label = "SQUAD_SIZE" /> 
	<TreeItem nodeId = "32" label = "DOMESTIC_COMPETITION_ID" />
	<TreeItem nodeId = "33" label = "AVERAGE_AGE" />
	<TreeItem nodeId = "34" label = "FOREIGNERS_NUMBER" />
	<TreeItem nodeId = "35" label = "NATIONAL_TEAM_PLAYERS" /> 
</TreeItem>




<TreeItem nodeId = "36" label = "COMPETITIONS">
	<TreeItem nodeId = "37" label = "COMPETITION_ID" /> 	
<TreeItem nodeId = "38" label = "TYPE" />
	<TreeItem nodeId = "39" label = "NAME" /> 	
<TreeItem nodeId = "40" label = "SUB_TYPE" />
	<TreeItem nodeId = "41" label = "CONFEDERATION" /> 	
<TreeItem nodeId = "42" label = "DOMESTIC_LEAGUE_CODE" />
	<TreeItem nodeId = "43" label = "COUNTRY_NAME" />
	<TreeItem nodeId = "44" label = "COUNTRY_ID" /> 
</TreeItem>



<TreeItem nodeId = "45" label = "GAME_EVENTS">
	<TreeItem nodeId = "46" label = "GAME_EVENT_ID" />
	<TreeItem nodeId = "47" label = "GAME_ID" /> 	
<TreeItem nodeId = "48" label = "DESCRIPTION" />
	<TreeItem nodeId = "49" label = "PLAYER_ID" /> 	
<TreeItem nodeId = "50" label = "CLUB_ID" />
	<TreeItem nodeId = "51" label = "EVENT_TYPE" /> 
	<TreeItem nodeId = "52" label = "GAME_MINUTE" />
	<TreeItem nodeId = "53" label = "PLAYER_ASSIST_ID" />
	<TreeItem nodeId = "54" label = "PLAYER_IN_ID" /> 
</TreeItem>



<TreeItem nodeId = "55" label = "GAMES"> 
	<TreeItem nodeId = "56" label = "GAME_ID" />
	<TreeItem nodeId = "57" label = "COMPETITION_TYPE" /> 	
<TreeItem nodeId = "58" label = "HOME_CLUB_ID" />
	<TreeItem nodeId = "59" label = "GAME_DATE" /> 	
<TreeItem nodeId = "60" label = "AWAY_CLUB_ID" />
	<TreeItem nodeId = "61" label = "ATTENDANCE" /> 	
<TreeItem nodeId = "62" label = "STADIUM" />
	<TreeItem nodeId = "63" label = "AWAY_CLUB_POSITION" />
	<TreeItem nodeId = "64" label = "SEASON" />
	<TreeItem nodeId = "65" label = "HOME_CLUB_POSITION" />
	<TreeItem nodeId = "66" label = "COMPETITION_ID" /> 	
<TreeItem nodeId = "67" label = "AWAY_CLUB_GOALS" />
	<TreeItem nodeId = "68" label = "HOME_CLUB_GOALS" /> 
</TreeItem>
<TreeItem nodeId = "69" label = "PLAYER_VALUATIONS">
	<TreeItem nodeId = "70" label = "PLAYER_ID" />
	<TreeItem nodeId = "71" label = "VALUATION_DATE" /> 	
<TreeItem nodeId = "72" label = "MARKET_VALUE_IN_EUR" />
	<TreeItem nodeId = "73" label = "CURRENT_CLUB_ID" />
	<TreeItem nodeId = "74" label = "LAST_SEASON" />
	<TreeItem nodeId = "75" label = "PLAYER_CLUB_DOMESTIC_COMPETITION_ID" /> 
</TreeItem>



<TreeItem nodeId = "76" label = "PLAYERS"> 	
<TreeItem nodeId = "77" label = "PLAYER_ID" />
	<TreeItem nodeId = "78" label = "DATE_OF_BIRTH" />
	<TreeItem nodeId = "79" label = "CITY_OF_BIRTH" / >
	<TreeItem nodeId = "80" label = "SUB_POSITION" />
	<TreeItem nodeId = "81" label = "POSITION" /> 	
<TreeItem nodeId = "82" label = "FOOT" />
	<TreeItem nodeId = "83" label = "HEIGHT_IN_CM" />
	<TreeItem nodeId = "84" label = "NAME" />
	<TreeItem nodeId = "85" label = "MARKET_VALUE_IN_EUR" />
	<TreeItem nodeId = "86" label = "CURRENT_CLUB_ID" /> 	
<TreeItem nodeId = "87" label = "COUNTRY_OF_BIRTH" />
	<TreeItem nodeId = "88" label = "CURRENT_CLUB_DOMESTIC_COMPETITION_ID" />
	<TreeItem nodeId = "89" label = "IMAGE_URL" />
	<TreeItem nodeId = "90" label = "COUNTRY_OF_CITIZENSHIP" /> 
</TreeItem>


      </TreeView>
    </Box>
    </div>
  );
}






// SqlEditor component
const SqlEditor = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  const runQuery = async () => {
    setIsRunning(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('http://localhost:3001/editor-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (e) {
      setError(`There was a problem running your query: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="sql-editor-container">
      <AceEditor
        mode="sql"
        theme="monokai"
        onChange={handleQueryChange}
        name="SQL_EDITOR"
        editorProps={{ $blockScrolling: true }}
        value={query}
        height="200px"
        width="100%"
      />
     <button className="btn btn-success" style={{ marginTop: '10px' }}
      onClick={runQuery} 
      disabled={isRunning}
    >
      {isRunning ? 'Running...' : 'Run'}
    </button>
      <div className="results-container">
      {error && <div className="error-message">{error}</div>}
      {results && <ResultsTable results={results} />}
      </div>
    </div>
  );
};

// SQLEditorPage component with TreeView and SqlEditor
const SQLEditorPage = () => {
  return (
    <div className="editor-page-container">
      {/* <TreeView structure={databaseStructure} /> */}
      <div className="scrollable-div">
      <FileSystemNavigator />
    </div>
      <SqlEditor />
      <style jsx>{`
        .editor-page-container {
          display: flex;
          gap: 20px;
        }
        .tree-view-container {
          width: 20%;
          background-color: #e60e0e;
          padding: 10px;
          border-right: 1px solid #ccc;
        }
        .database-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .sql-editor-container {
          flex-grow: 1;
        }
        .results-container {
          margin-top: 10px;
        }
        .error-message {
          color: red;
        }
        .scrollable-div {
          height: 400px; /* Adjust height as needed */
          overflow-y: auto; /* Enables vertical scrolling */
          background-color: grey; /* Grey background */
        }
        .scrollable-table-container {
          overflow: auto; /* Enables scrolling */
          max-height: 400px;
          max-width: 1000px; /* Set maximum width for the table */
       /* Adjust maximum height as needed */
        }
        
        .striped-table {
          width: 100%;
          border-collapse: collapse;
          /* Add a minimum width if necessary to ensure horizontal scrolling */
        }
        
        .striped-table th, .striped-table td {
          border: 1px solid #ddd;
          padding: 8px;
          color: black; /* Set text color to black */
        }
        
        .striped-table tr:nth-child(odd) {
          background-color: #f9f9f9;
        }
        
        .striped-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        
        .striped-table th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #4CAF50;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SQLEditorPage;