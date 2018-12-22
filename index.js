const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Executer = require('./CommandExecuter');

const PORT = 3000;
const deltaTmsec = 100;

const executer = new Executer([1,2,3,4], deltaTmsec);

const parser = (text) => {
  const cmdArr = []
  text
    .replace(/\n+/g,'\n')
    .split(/@/)
    .filter(e => e !== '')
    .forEach(e => {
      const bid = e.match(/button([0-9])/);
      cmdArr[Number(bid[1])] = e;
    })
  ;
  return cmdArr
    .map(e => typeof e === 'string' ? e : '')
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
    executer.setCmds(tasks);
  });
  socket.on('funcButton', (index) => {
    console.log(`exec :${index}`);
    if (executer.finish)executer.exec(index);
    else console.log('wait');
  });
});
