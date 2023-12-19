require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Phone = require("./models/Phone");
const PORT = process.env.PORT || 3001;

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (req, res) => {
  Phone.find({}).then((result) => {
    res.send(
      `<p>Phonebook has info for ${
        result.length
      } people</p><p>${new Date().toString()}</p<`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((results) => {
    res.json(results);
  });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const phone = new Phone({
    name: body.name,
    number: body.number,
  });

  phone
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const newPhone = { name, number };

  Phone.findByIdAndUpdate(req.params.id, newPhone, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPhone) => res.json(updatedPhone))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Phone.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
