const express = require('express');
const path = ('path');
const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Express is now up and running on http://localhost:${PORT}!`)
  });