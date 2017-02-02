'use strict';
{
  const { ipcRenderer, shell } = require('electron');
  const status = document.getElementById('message');
  const header = document.getElementById('header');
  const dialog = document.getElementById('dialog');
  const input = document.getElementById('input');

  function renderHistory(history) {
    let list = history ? history : [],
      listEl = document.querySelector('.url-history'),
      items = list.map(item => {
        return `<li><a href="${item}">${item}</a></li>`;
      }).join('');
    listEl.innerHTML = items;
  }

  function addToHistory(url) {
    let previousHistory = JSON.parse(localStorage.getItem('history')) || [],
      newHistory = previousHistory.filter(item => item !== url);
    if (newHistory.length >= 5) {
      newHistory.shift();
    }
    newHistory.push(url);
    localStorage.setItem('history', JSON.stringify(newHistory));
    renderHistory(newHistory);
  }

  function clearHistory() {
    let list = document.querySelectorAll('.url-history li');
    localStorage.removeItem('history');
    Array.prototype.forEach.call(list, (el, i) => {
      setTimeout(() => {
        el.classList.add('fadeOut');
        setTimeout(() => {
          el.parentNode.removeChild(el);
        }, i + 1 * 400);
      }, i * 200);
    });
  }

  function showDialog(show) {
    if (show) {
      renderHistory(JSON.parse(localStorage.getItem('history')));
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
        if (message[0].split(' ')[0].substr(0, 4) === 'http') {
          addToHistory(message[0].split(' ')[0]);
        }
      } else {
        document.body.classList.add('error');
      }
    }
  });

  ipcRenderer.on('enter-url', () => {
    showDialog(true);
  });

  ipcRenderer.on('clear-history', () => {
    clearHistory();
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

  document.querySelector('.url-history').addEventListener('click', e => {
    e.preventDefault();
    setUrl(e.target.innerText);
  });
}
