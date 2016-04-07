'use strict';
let app = require('app'),
  BrowserWindow = require('browser-window'),
  ipc = require('electron').ipcMain,
  Menu = require('menu'),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ 'port': 1234 }),
  EddystoneBeacon = require('eddystone-beacon'),
  mainWindow = null,
  mdns = require('mdns'),
  mdnsAd = null,
  modeBLE = null,
  modeMDNS = null,
  activeModes = '';

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

function setBleUrl(url, ws) {
  return new Promise((resolve, reject) => {
    try {
      EddystoneBeacon.advertiseUrl(url);
      activeModes += '<span class="modes">Bluetooth</span>';
      mainWindow.webContents.send('status', [`${url} ${activeModes}`, 'Advertising', true]);
      console.log(`ble advertising: ${url}`);
      if (ws) {
        ws.send(`ble advertising: ${url}`);
      }
      resolve();
    } catch (e) {
      console.log(`error: ${e}`);
      mainWindow.webContents.send('status', [e.message, 'Error', false]);
      if (ws) {
        ws.send(`error: ${e}`);
      }
      reject();
    }
  });
}

function setMdnsUrl(url, ws) {
  return new Promise((resolve, reject) => {
    try {
      let urlParts = url.split('/'),
        protocol = urlParts[0].replace(':', ''),
        port = protocol === 'https' ? 443 : 80,
        host = urlParts[2],
        path = urlParts.filter((part, i) => {
          return i > 2 ? part : false;
        }).join('/');
      mdnsAd = new mdns.Advertisement(mdns.tcp(protocol), port, {
        'name': url,
        'txtRecord': {
          'path': path
        },
        'host': host,
        'domain': 'local',
        'ip': host
      });
      mdnsAd.start();
      activeModes += '<span class="modes">mDNS</span>';
      mainWindow.webContents.send('status', [`${url} ${activeModes}`, 'Advertising', true]);
      console.log(`mdns advertising: ${url}`);
      if (ws) {
        ws.send(`mdns advertising: ${url}`);
      }
      resolve();
    } catch (e) {
      console.log(`error: ${e}`);
      mainWindow.webContents.send('status', [e.message, 'Error', false]);
      if (ws) {
        ws.send(`error: ${e}`);
      }
      reject();
    }
  });
}

function stopMdns() {
  if (mdnsAd) {
    mdnsAd.stop();
  }
}

function setUrl(url, ws) {
  activeModes = '';
  stopMdns();
  if (modeBLE.checked || modeMDNS.checked) {
    if (modeBLE.checked) {
      setBleUrl(url, ws).then(() => {
        if (modeMDNS.checked) {
          setMdnsUrl(url, ws);
        }
      });
    }
    if (!modeBLE.checked && modeMDNS.checked) {
      setMdnsUrl(url, ws);
    }
  } else {
    mainWindow.webContents.send('status', ['Choose at least one advertising mode', 'Error', false]);
  }
}

function toggleMode(item) {
  if (item.checked) {
    mainWindow.webContents.send('mode', [item.id, true]);
  } else {
    mainWindow.webContents.send('mode', [item.id, false]);
  }
}

app.on('ready', () => {
  const menuTemplate = [
    {
      'label': 'Eddystone',
      'submenu': [
        {
          'label': 'Advertise URL',
          'accelerator': 'Command+A',
          'click': () => {
            mainWindow.webContents.send('enter-url', 'go');
          }
        },
        {
          'label': 'Stop advertising',
          'accelerator': 'Command+S',
          'click': () => {
            EddystoneBeacon.stop();
            stopMdns();
            mainWindow.webContents.send('status', ['Use bookmarklet or <span class="key" aria-label="command">&#8984;</span> + <span class="key">A</span> to enter', 'Waiting', true]);
          }
        },
        {
          'label': 'Quit',
          'accelerator': 'Command+Q',
          'click': () => { app.quit(); }
        }
      ]
    },
    {
      'label': 'Edit',
      'submenu': [
        { 'label': 'Paste', 'accelerator': 'CmdOrCtrl+V', 'selector': 'paste:' }
      ]
    },
    {
      'label': 'Advertising modes',
      'submenu': [
        {
          'label': 'Bluetooth',
          'type': 'checkbox',
          'id': 'mode-ble',
          'checked': true,
          'click': item => {
            toggleMode(item);
          }
        },
        {
          'label': 'mDNS',
          'type': 'checkbox',
          'id': 'mode-mdns',
          'checked': false,
          'click': item => {
            toggleMode(item);
          }
        }
      ]
    }
  ];

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  modeBLE = menu.items[2].submenu.items[0];
  modeMDNS = menu.items[2].submenu.items[1];

  mainWindow = new BrowserWindow({'width': 600, 'height': 400, 'resizable': false});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('status', ['Use bookmarklet or <span class="key" aria-label="command">&#8984;</span> + <span class="key">A</span> to enter', 'Waiting', true]);
  });

  wss.on('connection', ws => {
    ws.on('message', url => {
      console.log(`received: ${url}`);
      ws.send(`received: ${url}`);
      setUrl(url, ws);
    });
  });

  ipc.on('set-url', (event, arg) => {
    setUrl(arg);
  });

  ipc.on('set-mode', (event, arg) => {
    switch (arg) {
    case 'mode-ble':
      modeBLE.checked ? modeBLE.checked = false : modeBLE.checked = true;
      toggleMode(modeBLE);
      break;
    case 'mode-mdns':
      modeMDNS.checked ? modeMDNS.checked = false : modeMDNS.checked = true;
      toggleMode(modeMDNS);
      break;
    default:
      break;
    }
  });
});
