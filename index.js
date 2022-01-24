const Joi = require("joi");
const express = require('express');
const app = express();

app.use(express.json());


//data
const movies = [
  {movie_id: 1, movie_name: 'Toy Story', movie_year: 1995, movie_director: 'John Lasseter'}
];


// Endpoints
app.get("/movies", (req, res) => {
  return res.send(movies);
});

app.post("/movies", (req, res) => {
  const schema = Joi.object({
    movie_name: Joi.string().required(),
    movie_year: Joi.number().min(1900).required(),
    movie_director: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  const movie = {
    movie_id: movies.length + 1,
    movie_name: req.body.movie_name,
    movie_year: req.body.movie_year,
    movie_director: req.body.movie_director
  };

  movies.push(movie);

  return res.status(201).send(movie);
});

app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.movie_id === id);

  if(!movie) return res.status(404).send("The movie with the given ID was not found");

  return res.send(movie);
});

app.patch("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.movie_id === id);

  if(!movie) return res.status(404).send("The movie with the given ID was not found");

  const schema = Joi.object({
    movie_name: Joi.string(),
    movie_year: Joi.number().min(1900),
    movie_director: Joi.string()
  });

  const { error } = schema.validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  if(req.body.movie_name) movie.movie_name = req.body.movie_name;
  if(req.body.movie_year) movie.movie_year = req.body.movie_year;
  if(req.body.movie_director) movie.movie_director = req.body.movie_director;

  return res.status(200).send('');
});

app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.movie_id === id);

  if(!movie) return res.status(404).send("The movie with the given ID was not found");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  return res.status(200).send('');
});



// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})
