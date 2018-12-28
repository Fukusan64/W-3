const express = require('express');
const app = express();
const pinController = require('./pinController');

const PORT = 3000;

app.set("view engine", "ejs");
app.use('/static', express.static('./public'));

app.get('/', (req, res) => {
  res.render('./index.ejs');
});

app.get('/program/:name', (req, res) => {
  res.render("./program.ejs", req.params);
});

http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
pinController(app);
