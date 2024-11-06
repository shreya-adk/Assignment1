/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Shreya Adhikari   Student ID: 155466220    Date: Sept 30, 2024
*  Github Link: https://github.com/shreyaadhikari123/your-repo-link
*
********************************************************************************/ 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const MoviesDB = require('./api/moviesDB.js');
const db = new MoviesDB();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const connectionString = process.env.MONGODB_URI;

db.initialize(connectionString).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
  });
}).catch((err) => {
  console.log("Failed to connect to the database:", err);
});

// Route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// POST /api/movies: Add a new movie
app.post('/api/movies', (req, res) => {
  db.addNewMovie(req.body).then((movie) => {
    res.status(201).json(movie); // 201: Created
  }).catch((err) => {
    res.status(500).json({ error: err.message }); // 500: Server error
  });
});

// GET /api/movies: Get movies with pagination
app.get('/api/movies', (req, res) => {
  const { page, perPage, title } = req.query;
  db.getAllMovies(page, perPage, title).then((movies) => {
    res.json(movies);
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// GET /api/movies/:id: Get a single movie by ID
app.get('/api/movies/:id', (req, res) => {
  db.getMovieById(req.params.id).then((movie) => {
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" }); // 404: Not found
    }
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// PUT /api/movies/:id: Update a movie by ID
app.put('/api/movies/:id', (req, res) => {
  db.updateMovieById(req.body, req.params.id).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(204).end(); // 204: No content, update successful
    } else {
      res.status(404).json({ error: "Movie not found or no changes made" });
    }
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// DELETE /api/movies/:id: Delete a movie by ID
app.delete('/api/movies/:id', (req, res) => {
  db.deleteMovieById(req.params.id).then((result) => {
    if (result.deletedCount > 0) {
      res.status(204).end(); // 204: No content, deletion successful
    } else {
      res.status(404).json({ error: "Movie not found" }); // 404: Not found
    }
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Exporting the Express app for Vercel
module.exports = app;