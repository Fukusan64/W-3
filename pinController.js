module.exports = (http) => {
  const io = require('socket.io')(http);
  const Executer = require('./CommandExecuter');
  const parser = require('./parser');
  const deltaTmsec = 100;
  const executer = new Executer(deltaTmsec);

  io.on('connection', (socket) => {
    if (socket.client.conn.server.clientsCount > 1) {
      console.log(`disconnect client[${socket.id}]`);
      socket.emit(
        'warn',
        '先に接続したユーザがいます、5秒後に切断します。時間をおいて接続してください',
      );
      setTimeout(() => {
        socket.emit(
          'warn',
          '先に接続したユーザがいます、3秒後に切断します。時間をおいて接続してください',
        );
      }, 2000);
      setTimeout(() => socket.disconnect(true), 5000);
    } else {
      socket.on('exec', (data) => {
        try {
          const [pinMap, tasks] = parser(data);
          console.log(pinMap);
          executer.setPins([[23, 24], [25, 26], ...pinMap]);
          console.log(tasks);
          executer.setCmds(tasks);
          socket.emit('info', '実行準備完了！');
        } catch (e) {
          console.error(e);
          socket.emit('error', e);
        }
      });
      socket.on('funcButton', (index) => {
        console.log(`exec :${index}`, executer.finish);
        if (executer.finish) {
          executer.exec(index);
        } else {
          socket.emit('warn', 'コマンド実行中はボタンを押せません');
        }
      });
      socket.on('edit', () => {
        executer.stop();
      });
    }
  });
};
