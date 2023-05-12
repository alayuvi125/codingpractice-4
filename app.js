const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeDB();

app.get("/players/", async (request, response) => {
  const getAllPlayerQuery = `
        SELECT * FROM cricket_team ;
    `;

  const playersArray = await db.all(getAllPlayerQuery);

  const responseList = playersArray.map((eachPlayer) => {
    return {
      playerId: eachPlayer.player_id,
      playerName: eachPlayer.player_name,
      jerseyNumber: eachPlayer.jersey_number,
      role: eachPlayer.role,
    };
  });

  response.send(responseList);
});

app.post("/players/", async (request, response) => {
  const addPlayerQuery = `
        INSERT INTO cricket_team (player_name,jersey_number,role)
            VALUES ("Vishal",17,"Bowler");
    `;

  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
        SELECT * FROM cricket_team WHERE player_id = ${playerId};
    `;

  const player = await db.get(getPlayerQuery);
  response.send({
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  });
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const updatePlayerQuery = `
        UPDATE cricket_team SET 
            player_name = "Maneesh",
            jersey_number = 54,
            role = "All-Rounder"
        WHERE player_Id = ${playerId} ;
    `;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerQuery = `
        DELETE FROM cricket_team WHERE player_id = ${playerId};
    `;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
