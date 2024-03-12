import express from 'express';

const app = express();

const hostName = 'localhost';
const port = 8000;

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.listen(port, hostName, () => {
  console.log(`Server listening on http://${hostName}:${port}`);
});
