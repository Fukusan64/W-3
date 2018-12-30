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
  if (fm.getFileList().some(e => e == req.params.name)) {
    res.render("./program.ejs", {
      name: req.params.name,
      body: fm.readFile(req.params.name),
    });
  } else {
    res.render("./program.ejs", {
      name: req.params,
      body: '',
    });
  }
});

app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
	res.status(500).send('500 error! : ' + err);
});
http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
//pinController(http, fm);
