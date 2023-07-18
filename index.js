const express = require('express')
const app = express()

app.use(express.json())

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req, res) => {
  const listNumber = phonebook.length
  const date = new Date()
  const text = `Phonebook has info for ${listNumber} people`
   
  res.send(`${text} <br/><br/> ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(x => x.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

const randomId = (max) => {
  return Math.floor(Math.random() * max)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number ) {
    return res.status(400).json({
      error: 'Content missing'
    })
  }

  const names = phonebook.map(x => x.name.toLowerCase())

  if (names.includes(body.name.toLowerCase())) {
    return res.status(400).json({
      error: 'Name must be Unique'
    })
  }

  const person = {
    id: randomId(1000000),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)

  res.json(phonebook)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  person = phonebook.filter(x => x.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);

//npm run dev
//3.7 ka na brods