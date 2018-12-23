const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Executer = require('./CommandExecuter');

const PORT = 3000;
const deltaTmsec = 100;

const executer = new Executer([1, 2, [30, 31], [40, 41]], deltaTmsec);

const naturalNumberTest = str => /^[0-9]+$/.test(str);
const numberTest = str => /^-?[0-9]+$/.test(str);
const pinTest = str => /^pin[1-9]$/.test(str);

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
        if (!naturalNumberTest(sec)) {
          throw `naturalNumberTest error (sec): ${sec}`;
        }
        const data = {sec: Number(sec)};
        pinData.split(',').map(e => e.split('=')).forEach(e => {
          const pin = e[0].trim();
          if (!pinTest(pin)) {
            throw `pinNameTest error (pinName): ${pin}`;
          }
          if (!numberTest(e[1].trim())) {
            throw `numberTest error (targetVal): ${e[1].trim()}`;
          }
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
    try {
      const tasks = parser(data);
      console.log(tasks);
      executer.setCmds(tasks);
      io.to(socket.id).emit('info', '実行準備完了！');
    } catch (e) {
      io.to(socket.id).emit('error', e);
    }
  });
  socket.on('funcButton', (index) => {
    console.log(`exec :${index}`, executer.finish);
    if (executer.finish)executer.exec(index);
    else {
      io.to(socket.id).emit('warn', 'コマンド実行中はボタンを押せません');
    }
  });
});
