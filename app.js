const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketMatchDetails");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server is Running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertPlayerObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};

const convertMatchObjectToResponseObject = (dbObject) => {
  return {
    matchId: dbObject.match_id,
    match: dbObject.match,
    year: dbObject.year,
  };
};

const convertPlayerMatchObjectToResponseObject = (dbObject) => {
  return {
    playerMatchId: dbObject.player_match_id,
    playerId: dbObject.player_id,
    matchId: dbObject.match_id,
    score: dbObject.score,
    fours: dbObject.fours,
    sixes: dbObject.sixes,
  };
};

//GET PLAYERS API
app.get("/players/", async (request, response) => {
  try {
    const getPlayersQuery = `SELECT * FROM Player_details;`;
    const playersArray = await db.all(getPlayersQuery);
    response.send(
      playersArray.map((eachPlayer) =>
        convertPlayerObjectToResponseObject(eachPlayer)
      )
    );
  } catch (e) {
    console.log(e.message);
  }
});
