'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/books.js')
//verifies what auth0 says is the valid token on the front end
const verifyUser = require('./auth.js')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

mongoose.connect(process.env.DB_URL);


const app = express();
app.use(cors());
//must have to receive JSON data
app.use(express.json())

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.status(200).send('Book Found!')
});


//this is the function that verifies the client!
/*
function verifyUser(req, async(err, user) => {
  if(err) {
    console.error(err);
    res.send('invalid token');
  }
  else {
    //try-catch
  }
}
)
*/

app.get('/book', getBooks);
app.post('/book', postBooks);
// ONLY delete books by ID, :/id is the path parameter
// note the diff btn req.params(path parameter) vs. req.query (asking for val)
app.delete('/book/:id', deleteBooks);
app.put('/book/:id', putBooks);


async function getBooks(req, res) {

  verifyUser(req, async (err, user) => {
    //if the user does not have a valid token, don't even send a request
    if (err) {
      console.error(err);
      res.send('invalid token');
    }
    //if the user does have a valid token, send results
    else {
      try {
        let results = await Book.find({});
        if (results.length > 0) {
          res.status(200).send(results);
        }
        else {
          res.status(404).send('error');
        }      
      } catch (err) {
          res.status(500).send('server error');
      }
    }
  })
}

  async function postBooks(req, res, next) {
    console.log(req.body)
    try {
      //we want to add books to our database
      let createBook = await Book.create(req.body)
      res.status(200).send(createBook)
    }
    catch (err) {
      next(err);
    }
  }

  async function deleteBooks(req, res, next) {
    try {
      // use req.params from parameters, anything after the initial name
      let id = req.params.id;
      //do NOT expect anything to be returned by findByIdAndDelete
      await Book.findByIdAndDelete(id);
      res.status(200).send('Book Deleted');
    }
    catch (err) {
      next(err)
    }
  }

  async function putBooks(req, res, next) {
    try {
      let id = req.params.id;
      let updatedBookFromDb = req.body;
      //findByIdAndUpdate takes in 3 arguments
      // id of what's to be updated; updated data object; options object
      let updateBook = await Book.findByIdAndUpdate(id, updatedBookFromDb, { new: true, overwrite: true })
      console.log(updateBook)
      res.status(200).send(updateBook);
    }
    catch (err) {
      next(err)
    }
  }

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