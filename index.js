const express = require("express");
const app = express();
app.use(express.json());
var morgan = require("morgan");
app.use(morgan("tiny"));
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

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};
// GETS
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  let phonebook = persons.length > 0 ? persons.length : "empty";
  response.send(
    "<h1>Phonebook</h1><p>Phonebook has info for " +
      phonebook +
      " people</p><p>" +
      new Date() +
      "</p>"
  );
});
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  response.json(person);
});

// POST

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else if (persons.find((person) => person.number === body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(person);
    response.json(person);
  }
});

//  DELETE
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id);
  response.status(204).end();
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
