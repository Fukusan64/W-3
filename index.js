const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 3000;

const parser = (text) => {
  const [,...cmdArr] = text.split(/@/).sort((a, b) => a[0] < b[0]);
  return cmdArr
    .map(e => {
      return e.replace(/button[0-9]/, '').trim().split('\n').map(e => {
        const [pinData, sec] = e.split(':');
        const data = {sec: Number(sec)};
        pinData.split(',').map(e => e.split('=')).forEach(e => {
          data[e[0].trim()] = Number(e[1]);
        });
        return data;
      });
    })
};

app.use(express.static(path.join(__dirname, 'public')));

http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));

io.on('connection', (socket) => {
  socket.on('exec', (data) => {
    const tasks = parser(data);
    console.log(tasks);
  });
  socket.on('funcButton', (index) => {
	  console.log(index);
  });
});
