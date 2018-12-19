const editMode = () => {
  document.getElementById('exec').style.display = 'none';
  document.getElementById('editor').style.display = 'block';
  document.getElementById('modeButton').innerText = '実行';
};

const execMode = () => {
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
  })
}

window.onload = () => {
  init();
};
