/* eslint-disable linebreak-style */
const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const People = require('./models/note');

app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' });
};

const phonebook = [];

app.get('/api/persons', (req, res) => {
  People.find({}).then((person) => {
    res.json(person);
  });
});

app.get('/info', (req, res) => {
  const listNumber = phonebook.length;
  const date = new Date();
  const text = `Phonebook has info for ${listNumber} people`;

  res.send(`${text} <br/><br/> ${date}`);
});

app.get('/api/persons/:id', (req, res, next) => {
  People.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Content missing',
    });
  }

  const person = new People({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  People.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  const person = {
    number: body.number,
  };

  People.findByIdAndUpdate(req.params.id, person, { number: body.number })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

const { PORT } = process.env;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

app.use(errorHandler);

// npm run dev
