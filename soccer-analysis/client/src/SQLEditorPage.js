import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-monokai';
import './App.css'; // Make sure you import the CSS file


// Define your database structure
const databaseStructure = {
  'Soccer': [
    'dbo.Players',
    'dbo.Clubs',
    'dbo.Games',
    'dbo.Competitions',
    'dbo.Club_Games',
    'dbo.Game_Events',
    'dbo.Appearances',
    'dbo.Player_Valuations'
  ],
  // ... more databases and tables as needed
};

// TreeView component that takes the database structure and renders it
const TreeView = ({ structure }) => {
  return (
    <div className="tree-view-container">
      {Object.keys(structure).map((database) => (
        <div key={database}>
          <div className="database-name">{database}</div>
          <ul>
            {structure[database].map((table) => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

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
      const response = await fetch('http://localhost:3001/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
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
      <button onClick={runQuery} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run'}
      </button>
      <div className="results-container">
        {error && <div className="error-message">{error}</div>}
        {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
      </div>
    </div>
  );
};

// SQLEditorPage component with TreeView and SqlEditor
const SQLEditorPage = () => {
  return (
    <div className="editor-page-container">
      <TreeView structure={databaseStructure} />
      <SqlEditor />
      <style jsx>{`
        .editor-page-container {
          display: flex;
          gap: 20px;
        }
        .tree-view-container {
          width: 20%;
          background-color: #f7f7f7;
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
      `}</style>
    </div>
  );
};

export default SQLEditorPage;