'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/books.js')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/book', getBooks);


async function getBooks(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
}


app.get('/', (request, response) => {
  response.status(200).send('Book Found!')
});


app.get('*', (request, response) => {

  response.status(404).send('Book NOT Found!')
});


app.use((error, request, response, next) => {

  response.status(500).send('Error');
});


app.get('/test', (request, response) => {

  response.send('test request received')

});



app.listen(PORT, () => console.log(`listening on ${PORT}`));