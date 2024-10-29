const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/api');
const config = require('./config');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});