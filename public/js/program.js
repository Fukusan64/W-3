const socket = io();
let deleteFlag = false;

const message = (message, type = 0, sec = 0) => {
  const bar = document.getElementById('messageBar');
  const timeoutID = bar.dataset.timeoutID;
  if (timeoutID) clearTimeout(timeoutID);
  bar.dataset.timeoutID = false;
  document.getElementById('message').innerText = message;
  [bar.style.backgroundColor,bar.style.color ] = [
    ['#2096F3', 'white'],
    ['yellow', 'black'],
    ['red', 'white']
  ][type];
  bar.style.visibility = 'visible';
  if (sec != 0){
    bar.dataset.timeoutID = setTimeout(
      () => bar.style.visibility = 'hidden',
       sec * 1000
    );
  }
}

const editMode = () => {
  socket.emit('edit', 'changeEditMode');
  document.getElementById('exec').style.display = 'none';
  document.getElementById('editor').style.display = 'block';
  document.getElementById('modeButton').innerText = '実行';
};

const execMode = () => {
  socket.emit('exec', document.getElementById('editor').children[0].value);
  document.getElementById('editor').style.display = 'none';
  document.getElementById('exec').style.display = 'flex';
  document.getElementById('modeButton').innerText = '編集';
};

const init = () => {
  editMode();
  const modeButton = document.getElementById('modeButton')
  modeButton.addEventListener('click', () => {
    if (modeButton.innerText == '編集') editMode();
    else execMode();
  });
  [...document.getElementsByClassName('functionButton')].map(e => {
    const { index } = e.dataset;
    e.addEventListener('click', () => socket.emit('funcButton', index));
  });
  const messageBar = document.getElementById('messageBar');
  document.getElementById('closeMessage').addEventListener('click', () => {
    messageBar.style.visibility = 'hidden';
  });
  document.getElementById('saveButton').addEventListener('click', () => {
    socket.emit('save', {name: NAME, body: document.getElementById('editor').children[0].value});
  });
  if (!IS_NEW_PROGRAM) {
    document.getElementById('deleteButton').addEventListener('click', () => {
      socket.emit('delete', NAME);
    });
  }
  socket.on('load', (code) => {
    const textarea = document.getElementById('editor').children[0];
    textarea.value = code;
    textarea.readOnly = false;
  });
  socket.on('delete res', (e) => {
    if(e) {
      message('削除に失敗しました', 2);
      console.error(e);
    } else {
      deleteFlag = true;
      socket.disconnect();
      message('プログラムを削除しました,3秒後にトップページに戻ります', 0);
      setTimeout(()=> window.location.href='/', 3000);
    }
  });
  socket.on('connect', () => message('W*3本体へ接続成功！', 0, 1));
  socket.on('disconnect', () => {
    if (!deleteFlag) {
      message('W*3本体との通信が切断されました', 2);
    }
  });

  socket.on('info', (data) => message(data, 0, 1));
  socket.on('warn', (data) => message(data, 1));
  socket.on('error', (data) => message(data, 2));

  if (IS_NEW_PROGRAM) {
    document.getElementById('editor').children[0].readOnly = false;
  } else {
    socket.emit('load req', NAME);
  }
}

window.onload = () => {
  init();
};
