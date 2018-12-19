const socket = io();

const editMode = () => {
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
  console.log([...document.getElementsByClassName('functionButton')].map(e => {
    const { index } = e.dataset;
    e.addEventListener('click', () => socket.emit('funcButton', index));
  }));
}

window.onload = () => {
  init();
};
