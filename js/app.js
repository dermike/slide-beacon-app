'use strict';
{
  const { ipcRenderer, shell } = require('electron');
  const status = document.getElementById('message');
  const header = document.getElementById('header');
  const dialog = document.getElementById('dialog');
  const input = document.getElementById('input');

  function showDialog(show) {
    if (show) {
      header.setAttribute('tabindex', '-1');
      dialog.classList.remove('hide');
      dialog.setAttribute('aria-hidden', 'false');
      input.focus();
    } else {
      header.setAttribute('tabindex', '1');
      dialog.classList.add('hide');
      dialog.setAttribute('aria-hidden', 'true');
    }
  }

  ipcRenderer.on('status', (event, message) => {
    if (message.length === 3) {
      [status.innerHTML, header.innerHTML] = message;
      if (message[2]) {
        document.body.classList.remove('error');
      } else {
        document.body.classList.add('error');
      }
    }
  });

  ipcRenderer.on('enter-url', () => {
    showDialog(true);
  });

  ipcRenderer.on('mode', (event, message) => {
    let el = document.getElementById(message[0]);
    if (message[1]) {
      el.classList.remove('off');
      el.classList.add('on');
      el.setAttribute('aria-pressed', 'true');
    } else {
      el.classList.remove('on');
      el.classList.add('off');
      el.setAttribute('aria-pressed', 'false');
    }
  });

  function setUrl(url) {
    input.value = '';
    showDialog(false);
    if (url) {
      ipcRenderer.send('set-url', url);
    }
  }

  function toggleMode(mode) {
    if (mode.id) {
      ipcRenderer.send('set-mode', mode.id);
    }
  }

  dialog.addEventListener('click', e => {
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
      showDialog(false);
      break;
    default:
      break;
    }
  });

  header.addEventListener('click', () => {
    showDialog(true);
  });

  status.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      shell.openExternal(e.target.href);
    }
  });

  header.addEventListener('keydown', e => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      showDialog(true);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.target.id === 'input' && e.keyCode === 13) {
      setUrl(input.value);
    } else if (e.keyCode === 27) {
      showDialog(false);
      input.value = '';
    }
  });
}
