const pg = require("pg"); // bring in postgres driver/module/library

/* SET UP OUR Database Connection */
const Pool = pg.Pool;
const pool = new Pool({
  database: "weekend-to-do-app", // the name of our database on our server
  host: "localhost", // server name (same as postico)
  port: 5432, // local postgres server port, 5432 is the default
  max: 10, // how many connections to the database? 10 is a good number
  idleTimeoutMillis: 30000, // how long to keep the pool active?
});

pool.on("connect", () => {
  console.log("Postgresql Connected Successfully");
});

pool.on("error", (error) => {
  console.log("There was an error in Postgres", error);
});

module.exports = pool;