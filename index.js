const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Executer = require('./CommandExecuter');

const PORT = 3000;
const deltaTmsec = 100;

const executer = new Executer(deltaTmsec);

const integerTest = str => /^-?[0-9]+$/.test(str);
const positiveNumberTest = str => /^([1-9]\d*|0)(\.\d+)?$/.test(str);
const pinTest = str => /^pin[1-9]$/.test(str);
const naturalNumberTest = str => /^[0-9]+$/.test(str);

const parser = (text) => {
  let [pinText, codeText] = text.split(/(?<=#[^\n]+)\n/);
  console.log([pinText, codeText]);
  pinText = pinText || '';
  codeText = codeText || '';
  const cmdArr = [];
  const pinMap = [];
  pinText
    .replace('#', '')
    .split(',')
    .map(e => e.split('='))
    .forEach((e) => {
      const [pin, num] = e.map(e => e.trim());
      if (!pinTest(pin)) throw `pinTest error (set pin): ${pin}`;
      const pinNum = Number(pin.replace('pin', '')) - 3;
      if (pinNum < 0) throw `pinNum error :smaller than 3`;

      if (!naturalNumberTest(num)) throw `naturalNumberTest error (set pin): ${num}`;
      pinMap[pinNum] = Number(num);
    });
  codeText
    .replace(/\n+/g,'\n')
    .split(/@/)
    .filter(e => e !== '')
    .forEach(e => {
      const bid = e.match(/button([0-9])/);
      cmdArr[Number(bid[1])] = e;
    })
  ;
  const tasks = cmdArr
    .map(e => typeof e === 'string' ? e : '')
    .map(e => {
      return e.replace(/button[0-9]/, '').trim().split('\n').map(e => {
        const [pinData, sec] = e.split(':');
        if (!positiveNumberTest(sec.trim())) {
          throw `positiveNumberTest error (sec): ${sec}`;
        }
        const data = {sec: Number(sec)};
        pinData.split(',').map(e => e.split('=')).forEach(e => {
          const pin = e[0].trim();
          if (!pinTest(pin)) {
            throw `pinNameTest error (pinName): ${pin}`;
          }
          if (!integerTest(e[1].trim())) {
            throw `integerTest error (targetVal): ${e[1].trim()}`;
          }
          data[e[0].trim()] = Number(e[1]);
        });
        return data;
      });
    })
  ;
  return [pinMap, tasks];
};

app.use(express.static(path.join(__dirname, 'public')));

http.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));

io.on('connection', (socket) => {
  socket.on('exec', (data) => {
    try {
      const [pinMap, tasks] = parser(data);
      console.log(pinMap);
      executer.setPins([[23, 24], [25, 26], ...pinMap]);
      console.log(tasks);
      executer.setCmds(tasks);
      io.to(socket.id).emit('info', '実行準備完了！');
    } catch (e) {
      console.error(e);
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
  socket.on('edit', () => {
    executer.stop();
  });
});
