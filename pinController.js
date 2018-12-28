module.exports = (app) => {
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const Executer = require('./CommandExecuter');
  const parser = require('./parser');
  const deltaTmsec = 100;
  const executer = new Executer(deltaTmsec);

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
};
