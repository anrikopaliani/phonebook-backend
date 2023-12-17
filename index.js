const express = require("express");
const app = express();
const PORT = 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date().toString()}</p<`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const generateId = () => {
  const number = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return number + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const match = persons.find((person) => person.name === body.name);

  if (match) {
    return res
      .status(400)
      .json({ error: "account with this name already exists" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredPersons = persons.filter((p) => p.id !== id);
  persons = filteredPersons;
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
