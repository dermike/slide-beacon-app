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

  ipc.on('mode', function updateMode(event, message) {
    var el = document.getElementById(message[0]);
    if (message[1]) {
      el.classList.remove('off');
      el.classList.add('on');
    } else {
      el.classList.remove('on');
      el.classList.add('off');
    }
  });

  function setUrl(url) {
    input.value = '';
    dialog.classList.add('hide');
    if (url) {
      ipc.send('set-url', url);
    }
  }

  function toggleMode(mode) {
    if (mode.id) {
      ipc.send('set-mode', mode.id);
    }
  }

  dialog.addEventListener('click', function click(e) {
    switch (e.target.id) {
    case 'submit':
      setUrl(input.value);
      break;
    case 'input':
      e.preventDefault();
      break;
    case 'mode-ble':
      toggleMode(e.target);
      break;
    case 'mode-mdns':
      toggleMode(e.target);
      break;
    case 'dialog':
      e.target.classList.add('hide');
      break;
    default:
      break;  
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
