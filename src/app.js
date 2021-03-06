const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.
        findIndex( reposiory => reposiory.id === id );
  
  if( ( !isUuid(id) ) || repositoryIndex < 0 ) {
    return response.status(400).json({ 'error': 'Repository not found.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const reposiory = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(reposiory);
  return response.json(reposiory);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.
        findIndex( repository => repository.id === id );

  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };
  repositories[repositoryIndex] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.
        findIndex( repository => repository.id === id );

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.
        findIndex( reposiory => reposiory.id === id );

  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
