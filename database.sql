-- Created a new database through Postico using the name 'Weekend-to-do-app'

CREATE TABLE todo (
	"id" serial PRIMARY KEY,
    "name" varchar(200) NOT NULL,
    "notes" varchar(400),
    "date" varchar(200),
    "due" date);
    
INSERT INTO todo (name, notes, date, due)
VALUES ('Vacuum','Make sure vaccum battery is charging 30 minutes prior','Not Completed', '6/10/2020'),
('Hannah Bday','Figure out plans for bday (surprise party?)','Not Completed', '6/12/2020'),
('Test','This task is completed in database','Sun Jun 07 2020',NULL),
('Grade To-Do List', 'Thanks for grading my HWK!', 'Not Completed',NULL);


-- The test row is to show what it would look like if a task is completed while in the database vs
-- creating the task (which will of course always default to "not complete").
-- Varchar count can be changed as needed