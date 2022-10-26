const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const controllers = require('./controllers')
const env = require('./env')

app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    express.static(__dirname + '/public'),
);

app.get('/', (req, res) => res.send(`
    <h1> Express & Needle are friends <3 </h1>
    <a href="/stream_file">Stream one file</a> <br>
    <a href="/stream_files">Stream multiple file</a> <br>
`));

app.get('/stream_file', (req, res) => controllers.streamFile(req, res, env._url, env.stream_dir));
app.get('/stream_files', (req, res) => controllers.streamFiles(req, res, env._urls, env.stream_dir));

let PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Main Server: ${PORT}`));