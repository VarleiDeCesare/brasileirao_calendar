import mysql from 'mysql2/promise';
import { get } from 'https';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function fetchMatchesForRange(dateFrom, dateTo) {
  //competitionId = 2013 is the Brasileirao
  return new Promise((resolve, reject) => {
    const url = `${process.env.BASE_URL_FOOTBALL_API}/matches/?competitions=2013&dateFrom=${dateFrom}&dateTo=${dateTo}`;

    const options = {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_TOKEN
      }
    };

    get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function fetchMatches() {
  const today = new Date();
  const allMatches = [];

  for (let i = 0; i < 30; i += 10) {
    const startDate = addDays(today, i);
    const endDate = addDays(today, Math.min(i + 9, 29))

    const dateFrom = formatDate(startDate);
    const dateTo = formatDate(endDate);

    console.log(`Fetching matches from ${dateFrom} to ${dateTo}...`);

    try {
      const response = await fetchMatchesForRange(dateFrom, dateTo);
      if (response.matches && response.matches.length > 0) {
        allMatches.push(...response.matches);
        console.log(`Found ${response.matches.length} matches for this period.`);
      }
    } catch (error) {
      console.error(`Error fetching matches for ${dateFrom} to ${dateTo}:`, error.message);
    }
  }

  return { matches: allMatches };
}

function transformMatchData(match) {
  return {
    id: match.id,
    utcDate: new Date(match.utcDate),
    status: match.status,
    matchday: match.matchday,
    stage: match.stage,
    group: match.group || null,
    lastUpdated: new Date(match.lastUpdated),
    areaId: match.area.id,
    areaName: match.area.name,
    areaCode: match.area.code,
    areaFlag: match.area.flag || null,
    competitionId: match.competition.id,
    competitionName: match.competition.name,
    competitionCode: match.competition.code,
    competitionType: match.competition.type,
    competitionEmblem: match.competition.emblem || null,
    seasonId: match.season.id,
    seasonStartDate: new Date(match.season.startDate),
    seasonEndDate: new Date(match.season.endDate),
    seasonCurrentMatchday: match.season.currentMatchday || null,
    seasonWinner: match.season.winner || null,
    homeTeamId: match.homeTeam.id,
    homeTeamName: match.homeTeam.name,
    homeTeamShortName: match.homeTeam.shortName,
    homeTeamTla: match.homeTeam.tla,
    homeTeamCrest: match.homeTeam.crest || null,
    awayTeamId: match.awayTeam.id,
    awayTeamName: match.awayTeam.name,
    awayTeamShortName: match.awayTeam.shortName,
    awayTeamTla: match.awayTeam.tla,
    awayTeamCrest: match.awayTeam.crest || null,
    scoreWinner: match.score.winner || null,
    scoreDuration: match.score.duration,
    scoreFullTimeHome: match.score.fullTime?.home || null,
    scoreFullTimeAway: match.score.fullTime?.away || null,
    scoreHalfTimeHome: match.score.halfTime?.home || null,
    scoreHalfTimeAway: match.score.halfTime?.away || null,
    oddsMsg: match.odds ? JSON.stringify(match.odds) : null,
  };
}

async function upsertMatch(connection, matchData) {
  const sql = `
    INSERT INTO matches (
      id, utcDate, status, matchday, stage, \`group\`, lastUpdated,
      areaId, areaName, areaCode, areaFlag,
      competitionId, competitionName, competitionCode, competitionType, competitionEmblem,
      seasonId, seasonStartDate, seasonEndDate, seasonCurrentMatchday, seasonWinner,
      homeTeamId, homeTeamName, homeTeamShortName, homeTeamTla, homeTeamCrest,
      awayTeamId, awayTeamName, awayTeamShortName, awayTeamTla, awayTeamCrest,
      scoreWinner, scoreDuration, scoreFullTimeHome, scoreFullTimeAway,
      scoreHalfTimeHome, scoreHalfTimeAway, oddsMsg
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      utcDate = VALUES(utcDate),
      status = VALUES(status),
      matchday = VALUES(matchday),
      stage = VALUES(stage),
      \`group\` = VALUES(\`group\`),
      lastUpdated = VALUES(lastUpdated),
      areaId = VALUES(areaId),
      areaName = VALUES(areaName),
      areaCode = VALUES(areaCode),
      areaFlag = VALUES(areaFlag),
      competitionId = VALUES(competitionId),
      competitionName = VALUES(competitionName),
      competitionCode = VALUES(competitionCode),
      competitionType = VALUES(competitionType),
      competitionEmblem = VALUES(competitionEmblem),
      seasonId = VALUES(seasonId),
      seasonStartDate = VALUES(seasonStartDate),
      seasonEndDate = VALUES(seasonEndDate),
      seasonCurrentMatchday = VALUES(seasonCurrentMatchday),
      seasonWinner = VALUES(seasonWinner),
      homeTeamId = VALUES(homeTeamId),
      homeTeamName = VALUES(homeTeamName),
      homeTeamShortName = VALUES(homeTeamShortName),
      homeTeamTla = VALUES(homeTeamTla),
      homeTeamCrest = VALUES(homeTeamCrest),
      awayTeamId = VALUES(awayTeamId),
      awayTeamName = VALUES(awayTeamName),
      awayTeamShortName = VALUES(awayTeamShortName),
      awayTeamTla = VALUES(awayTeamTla),
      awayTeamCrest = VALUES(awayTeamCrest),
      scoreWinner = VALUES(scoreWinner),
      scoreDuration = VALUES(scoreDuration),
      scoreFullTimeHome = VALUES(scoreFullTimeHome),
      scoreFullTimeAway = VALUES(scoreFullTimeAway),
      scoreHalfTimeHome = VALUES(scoreHalfTimeHome),
      scoreHalfTimeAway = VALUES(scoreHalfTimeAway),
      oddsMsg = VALUES(oddsMsg)
  `;

  const values = [
    matchData.id,
    matchData.utcDate,
    matchData.status,
    matchData.matchday,
    matchData.stage,
    matchData.group,
    matchData.lastUpdated,
    matchData.areaId,
    matchData.areaName,
    matchData.areaCode,
    matchData.areaFlag,
    matchData.competitionId,
    matchData.competitionName,
    matchData.competitionCode,
    matchData.competitionType,
    matchData.competitionEmblem,
    matchData.seasonId,
    matchData.seasonStartDate,
    matchData.seasonEndDate,
    matchData.seasonCurrentMatchday,
    matchData.seasonWinner,
    matchData.homeTeamId,
    matchData.homeTeamName,
    matchData.homeTeamShortName,
    matchData.homeTeamTla,
    matchData.homeTeamCrest,
    matchData.awayTeamId,
    matchData.awayTeamName,
    matchData.awayTeamShortName,
    matchData.awayTeamTla,
    matchData.awayTeamCrest,
    matchData.scoreWinner,
    matchData.scoreDuration,
    matchData.scoreFullTimeHome,
    matchData.scoreFullTimeAway,
    matchData.scoreHalfTimeHome,
    matchData.scoreHalfTimeAway,
    matchData.oddsMsg,
  ];

  const [result] = await connection.execute(sql, values);
  return result;
}

async function main() {
  let connection;

  try {
    console.log('Initializing database connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established.');

    console.log('Fetching matches from API...');
    const response = await fetchMatches();

    if (!response.matches || response.matches.length === 0) {
      console.log('No matches found in the response.');
      return;
    }

    console.log(`Found ${response.matches.length} matches. Processing records...`);

    let successCount = 0;
    let errorCount = 0;

    for (const matchData of response.matches) {
      try {
        const transformedMatch = transformMatchData(matchData);

        await upsertMatch(connection, transformedMatch);
        successCount++;
        console.log(`✓ Upserted match ID: ${matchData.id} - ${matchData.homeTeam.name} vs ${matchData.awayTeam.name}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Error upserting match ID ${matchData.id}:`, error.message);
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total matches processed: ${response.matches.length}`);
    console.log(`Successfully created/updated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

main();
