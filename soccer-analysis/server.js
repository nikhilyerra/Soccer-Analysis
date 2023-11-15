const express = require('express');
// const express = require('express');
const app = express();
const PORT = 3001;
const db = require('./db');

app.get('/data', async (req, res, next) => {
    console.log("here")
  try {
    let result = await db.execute('SELECT * FROM PLAYERS FETCH FIRST 10 ROWS ONLY');
    // console.log(result);
    if (result && result.rows) {
      res.json(result.rows);
    } else {
      res.status(500).json({ error: 'Unexpected database response.' });
    }
  } catch (err) {
    next(err);
  }
});

app.get('/tuples', async (req, res, next) => {
  console.log("here")
try {
  let query = `
              SELECT 'APPEARANCES' AS table_name, COUNT(*) AS row_count FROM APPEARANCES
              UNION ALL
              SELECT 'CLUB_GAMES', COUNT(*) FROM CLUB_GAMES
              UNION ALL
              SELECT 'CLUBS', COUNT(*) FROM CLUBS
              UNION ALL
              SELECT 'COMPETITIONS', COUNT(*) FROM COMPETITIONS
              UNION ALL
              SELECT 'GAME_EVENTS', COUNT(*) FROM GAME_EVENTS
              UNION ALL
              SELECT 'GAMES', COUNT(*) FROM GAMES
              UNION ALL
              SELECT 'PLAYER_VALUATIONS', COUNT(*) FROM PLAYER_VALUATIONS
              UNION ALL
              SELECT 'PLAYERS', COUNT(*) FROM PLAYERS
              `;
  let result = await db.execute(query);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});


app.get('/player-info', async (req, res, next) => {
  console.log("here")
try {
  const player_id = req.query.player_id;
  let result = await db.execute('SELECT * FROM PLAYERS WHERE player_id = :player_id',{player_id});
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/player-country', async (req, res, next) => {
  console.log("here")
try {
  let result = await db.execute('SELECT DISTINCT(COUNTY_OF_BIRTH) FROM PLAYERS WHERE COUNTY_OF_BIRTH IS NOT NULL');
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});


app.get('/competitions', async (req, res, next) => {
  console.log("here")
try {
  let result = await db.execute('SELECT COMPETITION_ID,NAME FROM COMPETITIONS');
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/clubs', async (req, res, next) => {
  console.log("here")
try {
  let result = await db.execute('SELECT CLUB_ID,NAME FROM CLUBS');
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/player-country-club', async (req, res, next) => {
  console.log("here")
try {
  const country = req.query.country;
  const club_id = req.query.club_id;
  let query = `SELECT player_id, name
                FROM players `;
  if(country){
    if(club_id){
      query = query + "WHERE county_of_birth = :country AND current_club_id = :club_id";
    }else{
      query = query + "WHERE county_of_birth = :country"
    }
  } else if(club_id){
    query = query + "WHERE current_club_id = :club_id";
  }
  let binds = {...(club_id && { club_id }),...(country && { country })}
  let result = await db.execute(query,binds);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});



app.get('/query1', async (req, res, next) => {
  console.log("here")
try {
  const countryA = req.query.countryA;
  const countryB = req.query.countryB;
  const comp_id = req.query.comp_id;
  const position = req.query.position
  let query = `
            SELECT 
              g.season,
              CASE 
                WHEN COUNT(DISTINCT CASE WHEN p.country_of_citizenship = :countryA THEN a.player_id END) = 0 
                THEN 0 
                ELSE SUM(CASE WHEN p.country_of_citizenship = :countryA THEN a.goals ELSE 0 END) / 
                    COUNT(DISTINCT CASE WHEN p.country_of_citizenship = :countryA THEN a.player_id END) 
              END AS countryA_avg_goals,
              CASE 
                WHEN COUNT(DISTINCT CASE WHEN p.country_of_citizenship = :countryB THEN a.player_id END) = 0 
                THEN 0 
                ELSE SUM(CASE WHEN p.country_of_citizenship = :countryB THEN a.goals ELSE 0 END) / 
                    COUNT(DISTINCT CASE WHEN p.country_of_citizenship = :countryB THEN a.player_id END) 
              END AS countryB_avg_goals
              FROM appearances a
              JOIN players p ON a.player_id = p.player_id
              JOIN games g ON a.game_id = g.game_id
              WHERE p.country_of_citizenship IN (:countryA, :countryB) `;
  if(comp_id){
    query = query + "AND a.competition_id = :comp_id ";
  }
  if(position){
    query = query + "AND p.position = :position "
  }

  query = query + "GROUP BY g.season ORDER BY g.season"
              
  let binds = {countryA, countryB, ...(comp_id && { comp_id }), ...(position && { position })};
  let result = await db.execute(query, binds);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/query2', async (req, res, next) => {
  console.log("here")
try {
  const club_id = req.query.club_id;
  const comp_id = req.query.comp_id;
  const range = req.query.range;
  let query = `
          WITH minute_ranges AS (
            SELECT
              (level - 1) * :range + 1 AS range_start,
              LEAST(level * :range, 120) AS range_end
            FROM
              dual
            CONNECT BY
              (level - 1) * :range < 120
          )
          SELECT
            mr.range_start || '-' || mr.range_end AS minute_group,
            COUNT(CASE WHEN ge.event_type = 'Goals' THEN ge.game_id END) AS goals,
            COUNT(CASE WHEN ge.event_type = 'Substitutions' THEN ge.game_id END) AS substitutions
          FROM
          minute_ranges mr
          JOIN game_events ge ON ge.game_minute BETWEEN mr.range_start AND mr.range_end
          JOIN games g ON ge.game_id = g.game_id `;
  if(comp_id){
    query = query + "AND g.competition_id = :comp_id "
  }
  query = query +   `WHERE
                      ge.club_id = :club_id 
                      AND ge.event_type IN ('Goals', 'Substitutions')
                    GROUP BY
                      mr.range_start, mr.range_end
                    ORDER BY
                      mr.range_start `;
              
  let binds = {club_id, range, ...(comp_id && { comp_id })};
  let result = await db.execute(query, binds);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/query3', async (req, res, next) => {
  console.log("here")
try {
  const player_id = req.query.player_id;
  let query = `
              WITH ValuationPeriods AS (
                SELECT 
                    pv.player_id,
                    pv.valuation_date AS current_valuation_date,
                    LAG(pv.valuation_date) OVER (PARTITION BY pv.player_id ORDER BY pv.valuation_date) AS previous_valuation_date,
                    pv.market_value_in_eur
                FROM 
                    player_valuations pv
                WHERE 
                    pv.player_id = :player_id 
            ),
            GoalStats AS (
                SELECT 
                    a.player_id,
                    a.game_id,
                    a.goals,
                    a.appearance_date
                FROM 
                    appearances a
                WHERE 
                    a.player_id = :player_id 
            )
            SELECT 
                vp.current_valuation_date,
                vp.market_value_in_eur,
                COALESCE(AVG(gs.goals), 0) AS avg_goals
            FROM 
                ValuationPeriods vp
                  JOIN GoalStats gs ON gs.player_id = vp.player_id 
                                      AND gs.appearance_date > vp.previous_valuation_date 
                                      AND gs.appearance_date <= vp.current_valuation_date
            GROUP BY 
                vp.player_id, 
                vp.current_valuation_date, 
                vp.market_value_in_eur
            ORDER BY 
                vp.current_valuation_date`;
              
  let binds = {player_id};
  let result = await db.execute(query, binds);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/query6', async (req, res, next) => {
  console.log("here")
try {
  const min_height = req.query.min_height;
  const max_height = req.query.max_height;
  const min_age= req.query.min_age;
  const max_age= req.query.max_age;
  const foot = req.query.foot;
  const position = req.query.position;
  const club_id = req.query.club_id;
  let query = `
              WITH FilteredPlayers AS (
                SELECT player_id
                FROM players
                WHERE height_in_cm BETWEEN :min_height AND :max_height
                  AND (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM date_of_birth)) BETWEEN :min_age AND :max_age
                  AND foot = :foot
                  AND position = :position
            ),
            FilteredAppearances AS (
                SELECT a.game_id
                FROM appearances a
                JOIN FilteredPlayers fp ON a.player_id = fp.player_id
            ),
            FilteredGames AS (
                SELECT g.season, cg.is_win
                FROM club_games cg
                JOIN FilteredAppearances fa ON cg.game_id = fa.game_id
                JOIN games g ON cg.game_id = g.game_id
                WHERE cg.club_id = :club_id
            ),
            SeasonWinStats AS (
                SELECT 
                    season, 
                    COUNT(*) AS total_games, 
                    SUM(CASE WHEN is_win = 1 THEN 1 ELSE 0 END) AS wins
                FROM FilteredGames
                GROUP BY season
            )
            SELECT 
                season, 
                ROUND((wins / total_games) * 100, 2) AS win_percentage
            FROM SeasonWinStats
            ORDER BY season
            `;
              
  let binds = {min_age,max_age,min_height,max_height,foot,position,club_id};
  let result = await db.execute(query, binds);
  console.log(result);
  if (result && result.rows) {
    res.json(result.rows);
  } else {
    res.status(500).json({ error: 'Unexpected database response.' });
  }
} catch (err) {
  next(err);
}
});

app.get('/sample', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
