import mysql from 'mysql2/promise';
import { teamsSeed } from './teams.seed.js';
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

function transformTeamData(team) {
  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    crest: team.crest || null,
    address: team.address || null,
    website: team.website || null,
    founded: team.founded || null,
    venue: team.venue || null,
    coachName: team.coachName || null,
  };
}

async function upsertTeam(connection, teamData) {
  const sql = `
    INSERT INTO teams (
      id, name, shortName, crest, address, website, founded, venue, coachName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      shortName = VALUES(shortName),
      crest = VALUES(crest),
      address = VALUES(address),
      website = VALUES(website),
      founded = VALUES(founded),
      venue = VALUES(venue),
      coachName = VALUES(coachName)
  `;

  const values = [
    teamData.id,
    teamData.name,
    teamData.shortName,
    teamData.crest,
    teamData.address,
    teamData.website,
    teamData.founded,
    teamData.venue,
    teamData.coachName,
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

    console.log('Processing teams from seed data...');

    if (!teamsSeed || teamsSeed.length === 0) {
      console.log('No teams found in the seed data.');
      return;
    }

    console.log(`Found ${teamsSeed.length} teams. Processing records...`);

    let successCount = 0;
    let errorCount = 0;

    for (const teamData of teamsSeed) {
      try {
        const transformedTeam = transformTeamData(teamData);

        await upsertTeam(connection, transformedTeam);
        successCount++;
        console.log(`✓ Upserted team ID: ${teamData.id} - ${teamData.name}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Error upserting team ID ${teamData.id}:`, error.message);
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total teams processed: ${teamsSeed.length}`);
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
