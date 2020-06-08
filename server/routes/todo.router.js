const pool = require('../modules/pool.js');
const express = require('express');
const router = express.Router();
// const moment = require('moment');

// GET
router.get("/", (req, res) => {
  // create our SQL -- just a string
  let queryText = "SELECT * from todo ORDER BY due ASC"; //mostpressing tasks first
  // send our query to the pool (to postgres)
  pool
    .query(queryText)
    .then((result) => {
      // result is the result of our query!
      res.send(result.rows).status(200);
    })
    .catch((error) => {
      console.log(`Error making query: ${queryText}`);
      res.sendStatus(500);
    });
});

// POST
router.post("/", (req, res) => {
  // HTTP REQUEST BODY
  const todo = req.body; // pull the object out out of the HTTP REQUEST
  const name = todo.name;
  const notes = todo.notes;
  const date = todo.date;
  const due = todo.due;

  if (name === undefined) {
    // stop, dont touch the database
    res.sendStatus(400); // 400 BAD REQUEST
    return;
  }

  const queryText = `
          INSERT INTO todo (name, notes, date, due) 
          VALUES ($1, $2, $3, $4);`;
  pool
    .query(queryText, [name, notes, date, due])
    .then(function (result) {
      res.sendStatus(200); // 200: OK it worked!
    })
    .catch(function (error) {
      console.log("Sorry, there was an error with your query: ", error);
      res.sendStatus(500); // HTTP SERVER ERROR
    });
});

// DELETE
router.delete('/:id', (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);

  const queryText = `
    DELETE FROM todo WHERE id=$1;`
  pool.query(queryText, [id])
    .then(function (result) {
      res.sendStatus(204); //something deleted
    }).catch(function (error) {
      console.log('Sorry, there was an error with your query: ', error);
      res.sendStatus(500);

    });
}); //end DELETE

// PUT
router.put("/:id", (req, res) => {
  // let id = req.params.id; // id of the thing to delete
  // let date = req.params.date;


  const task = req.body;
  const id = task.id;
  const date = task.date;

  let queryText = "UPDATE todo SET date = $1 WHERE (date = 'Not Completed' AND id = $2)";
  pool
    .query(queryText, [date, id])

    .then(function (result) {
      console.log("Update task for id of", id);
      // result.rows: 'INSERT 0 1';
      // it worked!
      res.send(result.rows);
    })
    .catch(function (error) {
      console.log("Sorry, there was an error with your query: ", error);
      res.sendStatus(500); // HTTP SERVER ERROR
    });
});

module.exports = router;