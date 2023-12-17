require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Phone = require("./models/Phone");
const PORT = process.env.PORT || 3001;

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

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date().toString()}</p<`
  );
});

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((results) => {
    res.json(results);
  });
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

  const phone = new Phone({
    name: body.name,
    number: body.number,
  });

  phone.save().then((result) => {
    res.json(result);
  });
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
