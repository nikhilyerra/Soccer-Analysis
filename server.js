const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const PORT = 3001;
const db = require('./db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());

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


app.post('/player-multicountry', async (req, res, next) => {
  try {
    // Extract countries list from request body
    const countries = req.body.countries;

    // Check if countries array is provided and is not empty
    if (!countries || !countries.length) {
      return res.status(400).json({ error: 'No countries provided.' });
    }

    // Prepare a query string with placeholders for countries
    const placeholders = countries.map((_, index) => `:${index + 1}`).join(', ');

    // Execute the query with the countries array
    let result = await db.execute(
      `SELECT NAME, player_id FROM PLAYERS WHERE COUNTY_OF_BIRTH IN (${placeholders})`,
      countries
    );

    if (result && result.rows) {
      res.json(result.rows);
    } else {
      res.status(500).json({ error: 'Unexpected database response.' });
    }
  } catch (err) {
    next(err);
  }
});

app.post('/player-multiclub', async (req, res, next) => {
  try {
    // Extract countries list from request body
    const clubs = req.body.clubs;

    // Check if countries array is provided and is not empty
    if (!clubs || !clubs.length) {
      return res.status(400).json({ error: 'No clubs provided.' });
    }

    // Prepare a query string with placeholders for clubs
    const placeholders = clubs.map((_, index) => `:${index + 1}`).join(', ');

    // Execute the query with the clubs array
    let result = await db.execute(
      `SELECT player_id, name FROM players WHERE current_club_id  IN (${placeholders})`,
      clubs
    );

    

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
            WITH PlayerAppearances AS (
              SELECT 
                  g.season,
                  p.player_id,
                  p.country_of_citizenship,
                  a.goals,
                  a.assists,
                  a.yellow_cards,
                  a.red_cards,
                  a.competition_id,
                  p.position
              FROM 
                appearances a
              JOIN 
                players p ON a.player_id = p.player_id
              JOIN 
                games g ON a.game_id = g.game_id
              WHERE 
                p.country_of_citizenship IN (:countryA, :countryB)
          ),
          FilteredAppearances AS (
              SELECT 
                  season,
                  player_id,
                  country_of_citizenship,
                  goals,
                  assists,
                  yellow_cards,
                  red_cards
              FROM 
                PlayerAppearances
              WHERE 
                (:comp_id IS NULL OR competition_id = :comp_id)
                AND (:position IS NULL OR position = :position)
          ),
          CountryStats AS (
              SELECT 
                  season,
                  country_of_citizenship,
                  COUNT(DISTINCT player_id) AS distinct_players,
                  SUM(goals) AS total_goals,
                  SUM(assists) AS total_assists,
                  SUM(yellow_cards) AS total_yellow_cards,
                  SUM(red_cards) AS total_red_cards,
                  COUNT(player_id) AS total_appearances
              FROM 
                FilteredAppearances
              GROUP BY 
                season, country_of_citizenship
          )
          SELECT 
              fa.season,
              COALESCE(
                  (SELECT total_goals / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryA),
              0) AS countryA_avg_goals,
              COALESCE(
                  (SELECT total_assists / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryA),
              0) AS countryA_avg_assists,
              COALESCE(
                  (SELECT total_yellow_cards / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryA),
              0) AS countryA_avg_yellow_cards,
              COALESCE(
                  (SELECT total_red_cards / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryA),
              0) AS countryA_avg_red_cards,
              COALESCE(
                  (SELECT total_appearances
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryA),
              0) AS countryA_total_appearances,
              COALESCE(
                  (SELECT total_goals / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryB),
              0) AS countryB_avg_goals,
              COALESCE(
                  (SELECT total_assists / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryB),
              0) AS countryB_avg_assists,
              COALESCE(
                  (SELECT total_yellow_cards / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryB),
              0) AS countryB_avg_yellow_cards,
              COALESCE(
                  (SELECT total_red_cards / NULLIF(distinct_players, 0)
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryB),
              0) AS countryB_avg_red_cards,
              COALESCE(
                  (SELECT total_appearances
                  FROM CountryStats
                  WHERE season = fa.season AND country_of_citizenship = :countryB),
              0) AS countryB_total_appearances
          FROM 
            FilteredAppearances fa
          GROUP BY 
            fa.season
          ORDER BY 
            fa.season
          `;
 
              
  let binds = {countryA, countryB, comp_id, position};
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
  console.log(club_id)
  console.log(comp_id)
  console.log(range)
  let query = `
              WITH minute_ranges AS (
                SELECT
                  (level - 1) * :range + 1 AS range_start,
                  LEAST(level * :range, 120) AS range_end
                FROM
                  dual
                CONNECT BY
                  (level - 1) * :range < 120
              ),
              event_counts AS (
                SELECT
                  ge.game_minute,
                  ge.game_id,
                  ge.event_type
                FROM
                  game_events ge
                WHERE
                  ge.club_id = :club_id
                  AND ge.event_type IN ('Goals', 'Substitutions')
              ),
              joined_data AS (
                SELECT
                  mr.range_start,
                  mr.range_end,
                  ec.game_id,
                  ec.event_type
                FROM
                  minute_ranges mr
                JOIN
                  event_counts ec
                ON
                  ec.game_minute BETWEEN mr.range_start AND mr.range_end
                JOIN
                  games g
                ON
                  ec.game_id = g.game_id `;
  if(comp_id){
    query = query + "AND g.competition_id = :comp_id "
  }                
                  
  query = query+ `            ),
              event_type_counts AS (
                SELECT
                  jd.range_start,
                  jd.range_end,
                  jd.game_id,
                  SUM(CASE WHEN jd.event_type = 'Goals' THEN 1 ELSE 0 END) AS goal_count,
                  SUM(CASE WHEN jd.event_type = 'Substitutions' THEN 1 ELSE 0 END) AS substitution_count
                FROM
                  joined_data jd
                GROUP BY
                  jd.range_start, jd.range_end, jd.game_id
              )
              SELECT
                etc.range_start || '-' || etc.range_end AS minute_group,
                SUM(etc.goal_count) AS goals,
                SUM(etc.substitution_count) AS substitutions
              FROM
                event_type_counts etc
              GROUP BY
                etc.range_start, etc.range_end
              ORDER BY
                etc.range_start `;
  
              
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
  console.log(req.query.height)
  console.log(req.query.age)
try {
  const height = req.query.height;
  const age= req.query.age;
  const foot = req.query.foot;
  const position = req.query.position;
  const club_id = req.query.club_id;
  let query = `
            WITH 
            FilteredPlayersLessOrEqual AS (
                SELECT player_id
                FROM players
                WHERE height_in_cm <= :height
                  AND (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM date_of_birth)) <= :age
                  AND (:foot is NULL or foot = :foot)
                  AND (:position is NULL or position = :position)
            ),
            FilteredPlayersGreater AS (
                SELECT player_id
                FROM players
                WHERE height_in_cm > :height
                  AND (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM date_of_birth)) > :age
                  AND (:foot is NULL or foot = :foot)
                  AND (:position is NULL or position = :position)
            ),
            FilteredAppearancesLessOrEqual AS (
                SELECT a.game_id
                FROM appearances a
                JOIN FilteredPlayersLessOrEqual fp ON a.player_id = fp.player_id
            ),
            FilteredAppearancesGreater AS (
                SELECT a.game_id
                FROM appearances a
                JOIN FilteredPlayersGreater fp ON a.player_id = fp.player_id
            ),
            FilteredGamesLessOrEqual AS (
                SELECT g.season, cg.is_win
                FROM club_games cg
                JOIN FilteredAppearancesLessOrEqual fa ON cg.game_id = fa.game_id
                JOIN games g ON cg.game_id = g.game_id
                WHERE (:club_id is NULL or cg.club_id = :club_id)
            ),
            FilteredGamesGreater AS (
                SELECT g.season, cg.is_win
                FROM club_games cg
                JOIN FilteredAppearancesGreater fa ON cg.game_id = fa.game_id
                JOIN games g ON cg.game_id = g.game_id
                WHERE (:club_id is NULL OR cg.club_id = :club_id)
            ),
            SeasonWinStatsLessOrEqual AS (
                SELECT 
                    season, 
                    COUNT(*) AS total_games, 
                    SUM(CASE WHEN is_win = 1 THEN 1 ELSE 0 END) AS wins
                FROM FilteredGamesLessOrEqual
                GROUP BY season
            ),
            SeasonWinStatsGreater AS (
                SELECT 
                    season, 
                    COUNT(*) AS total_games, 
                    SUM(CASE WHEN is_win = 1 THEN 1 ELSE 0 END) AS wins
                FROM FilteredGamesGreater
                GROUP BY season
            )
            SELECT 
                s1.season, 
                ROUND((s1.wins / s1.total_games) * 100, 2) AS win_percentage_less_or_equal,
                ROUND((s2.wins / s2.total_games) * 100, 2) AS win_percentage_greater
            FROM SeasonWinStatsLessOrEqual s1
            JOIN SeasonWinStatsGreater s2 ON s1.season = s2.season
            ORDER BY s1.season
  
            `;
              
  let binds = {age,height,foot,position,club_id};
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

app.get('/query4', async (req, res, next) => {
  console.log("here")
try {
  const max_red_cards = req.query.max_red_cards;
  const max_yellow_cards = req.query.max_yellow_cards;
  const min_minutes_played= req.query.min_minutes_played;
  const player_id= req.query.player_id;
  let query = `
              WITH PlayerAppearances AS (
                SELECT 
                    a.player_id, 
                    a.game_id, 
                    a.player_club_id, 
                    a.minutes_played, 
                    a.red_cards, 
                    a.yellow_cards
                FROM 
                    appearances a
                WHERE 
                    a.player_id = :player_id AND 
                    a.minutes_played > :min_minutes_played AND 
                    a.red_cards <= :max_red_cards AND 
                    a.yellow_cards <= :max_yellow_cards
            ),
            GameDetails AS (
                SELECT 
                    g.season, 
                    g.game_id, 
                    g.home_club_id, 
                    g.away_club_id
                FROM 
                    games g
            ),
            ClubGameResults AS (
                SELECT 
                    cg.game_id, 
                    cg.is_win
                FROM 
                    club_games cg
            ),
            SeasonalPerformance AS (
                SELECT 
                    gd.season,
                    pa.game_id,
                    pa.player_club_id,
                    cgr.is_win,
                    CASE WHEN gd.home_club_id = pa.player_club_id THEN 'Home' ELSE 'Away' END AS game_location
                FROM 
                    PlayerAppearances pa
                INNER JOIN 
                    GameDetails gd ON pa.game_id = gd.game_id
                INNER JOIN 
                    ClubGameResults cgr ON gd.game_id = cgr.game_id
                WHERE 
                    pa.player_club_id = gd.home_club_id OR pa.player_club_id = gd.away_club_id
            )
            SELECT 
                sp.season,
                ROUND((COUNT(CASE WHEN sp.game_location = 'Home' AND sp.is_win = 1 THEN 1 END) / 
                      NULLIF(COUNT(CASE WHEN sp.game_location = 'Home' THEN 1 END), 0)) * 100, 2) AS home_win_percentage,
                ROUND((COUNT(CASE WHEN sp.game_location = 'Away' AND sp.is_win = 1 THEN 1 END) / 
                      NULLIF(COUNT(CASE WHEN sp.game_location = 'Away' THEN 1 END), 0)) * 100, 2) AS away_win_percentage
            FROM 
                SeasonalPerformance sp
            GROUP BY 
                sp.season
            ORDER BY 
                sp.season ASC
            `;
              
  let binds = {max_red_cards,max_yellow_cards,min_minutes_played,player_id};
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

app.post('/editor-query', async (req, res, next) => {
  console.log("here")
try {
  let text = req.body;
  const lastIndex = text.lastIndexOf(';');
  if (lastIndex !== -1) {
    text = text.substring(0, lastIndex) + ' ' + text.substring(lastIndex + 1);
  }
  let result = await db.execute(text);
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

app.get('/sample', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'renukasm141@gmail.com', 
    pass: 'Qwerty@98'
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'renukasm141@gmail.com', 
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.get('/query7', async (req, res, next) => {
  console.log("here")
try {
  const max_red_cards = req.query.max_red_cards;
  const max_yellow_cards = req.query.max_yellow_cards;
  const min_minutes_played= req.query.min_minutes_played;
  const player_id= req.query.player_id;
  let query = `
  WITH PlayerAppearances AS (
    SELECT 
        a.player_id, 
        a.game_id, 
        a.player_club_id, 
        a.minutes_played, 
        a.red_cards, 
        a.yellow_cards
    FROM 
        appearances a
    WHERE 
        a.player_id = :player_id AND 
        a.minutes_played > :min_minutes_played AND 
        a.red_cards <= :max_red_cards AND 
        a.yellow_cards <= :max_yellow_cards
),
GameDetails AS (
    SELECT 
        g.season, 
        g.game_id, 
        g.home_club_id, 
        g.away_club_id
    FROM 
        games g
),
ClubGameResults AS (
    SELECT 
        cg.game_id, 
        cg.is_win
    FROM 
        club_games cg
),
SeasonalPerformance AS (
    SELECT 
        gd.season,
        pa.game_id,
        pa.player_club_id,
        cgr.is_win,
        CASE WHEN gd.home_club_id = pa.player_club_id THEN 'Home' ELSE 'Away' END AS game_location
    FROM 
        PlayerAppearances pa
    INNER JOIN 
        GameDetails gd ON pa.game_id = gd.game_id
    INNER JOIN 
        ClubGameResults cgr ON gd.game_id = cgr.game_id
    WHERE 
        pa.player_club_id = gd.home_club_id OR pa.player_club_id = gd.away_club_id
)
SELECT 
    sp.season,
    ROUND((COUNT(CASE WHEN sp.game_location = 'Home' AND sp.is_win = 1 THEN 1 END) / 
           NULLIF(COUNT(CASE WHEN sp.game_location = 'Home' THEN 1 END), 0)) * 100, 2) AS home_win_percentage,
    ROUND((COUNT(CASE WHEN sp.game_location = 'Away' AND sp.is_win = 1 THEN 1 END) / 
           NULLIF(COUNT(CASE WHEN sp.game_location = 'Away' THEN 1 END), 0)) * 100, 2) AS away_win_percentage
FROM 
    SeasonalPerformance sp
GROUP BY 
    sp.season
ORDER BY 
    sp.season ASC

            `;
              
  let binds = {max_red_cards,max_yellow_cards,min_minutes_played,player_id};
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});