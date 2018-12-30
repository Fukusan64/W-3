const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const pinController = require('./pinController');
const Fm = require('./FileManager');
const fm = new Fm(path.join(__dirname, 'userProgram'));

const PORT = 3000;

app.set("view engine", "ejs");
app.use('/static', express.static('./public'));

app.get('/', (req, res) => {
  res.render('./index.ejs', { fileList: fm.getFileList() });
});

app.get('/program/:name', (req, res) => {
  res.render("./program.ejs", req.params);
});

http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
//pinController(http);
