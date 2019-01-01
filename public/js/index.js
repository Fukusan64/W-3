window.onload = () => {
	const newProgramName = document.getElementById('name');
  document.getElementById('newProgram').addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = `./program/${newProgramName.value}`;
  });
};
