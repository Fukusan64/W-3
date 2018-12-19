const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const parser = (text) => text.split('\n');

app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, () => console.log('listening on http://localhost:3000'));

io.on('connection', (socket) => {
  socket.on('exec', (data) => {
	const tasks = parser(data);
	console.log(tasks);
  });
  socket.on('funcButton', (index) => {
	  console.log(index);
  });
});
