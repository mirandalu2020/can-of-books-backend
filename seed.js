'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Book = require('./models/books.js');

async function seed() {

  await Book.create({
    title: 'Harry Potter',
    description: 'Fantasy',
    status: 'Not Available',
  });
  console.log('Harry Potter was added')

  await Book.create({
    title: 'Harold and the Purple Crayon',
    description: 'Childrens',
    status: 'Available',
  });
  console.log('Harold and the Purple Crayon was added')

  await Book.create({
    title: 'The Talented Mr. Ripley',
    description: 'Crime/Thriller',
    status: 'Available',
  });
  console.log('The Talented Mr. Ripley was added')

  mongoose.disconnect();
}

seed();

