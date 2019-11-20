import { readFileSync } from 'fs';

import express from 'express';
import https from 'https';
import proxy from 'http-proxy-middleware';
import low from 'lowdb';

import vueConf from '../vue.config';

const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(express.json());


const adapter = new FileSync('../db.json');
const db = low(adapter);

db.defaults({
  knopjes: {},
}).write();

app.post('/api/drukjes', (req, res) => {
  console.log(req.body);
  res.send('ok');
});


app.get('/mrhm', (req, res) => {
  console.log('got');
  res.send('Hello HTTPS!');
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../dist'));
}
else {
  const devPort = vueConf.devServer.port || 8080;
  console.log(`Redirecting non-api calls to local port ${devPort}`);
  app.use('*', proxy({ target: `https://localhost:${devPort}/`, secure: false }));
}

const port = process.env.KNOP_PORT || 9889;
const server = https.createServer({
  key: readFileSync('certs/selfsign.key'),
  cert: readFileSync('certs/selfsign.cert'),
}, app);

server.listen(port, () => {
  console.log(`Knopserver listening on port ${port} [https]`);
});
