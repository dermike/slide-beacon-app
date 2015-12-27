(function slidebeacon() {
  var ipc = require('electron').ipcRenderer,
    status = document.getElementById('message'),
    header = document.getElementById('header'),
    dialog = document.getElementById('dialog'),
    input = document.getElementById('input');

  ipc.on('status', function ipcstatus(event, message) {
    if (message.length === 3) {
      status.innerHTML = message[0];
      header.innerHTML = message[1];
      if (message[2]) {
        document.body.classList.remove('error');
      } else {
        document.body.classList.add('error');
      }
    }
  });

  ipc.on('enter-url', function enterurl() {
    dialog.classList.remove('hide');
    input.focus();
  });

  function setUrl(url) {
    input.value = '';
    dialog.classList.add('hide');
    if (url) {
      ipc.send('set-url', url);
    }
  }

  dialog.addEventListener('click', function click(e) {
    if (e.target.id === 'submit') {
      setUrl(input.value);
    } else if (e.target.id === 'input') {
      e.preventDefault();
    } else {
      e.target.classList.add('hide');
    }
  });

  document.addEventListener('keydown', function keydown(e) {
    if (e.target.id === 'input' && e.keyCode === 13) {
      setUrl(input.value);
    } else if (e.keyCode === 27) {
      dialog.classList.add('hide');
      input.value = '';
    }
  });
})();
