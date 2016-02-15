'use strict';
let app = require('app'),
  BrowserWindow = require('browser-window'),
  ipc = require('electron').ipcMain,
  Menu = require('menu'),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ 'port': 1234 }),
  EddystoneBeacon = require('eddystone-beacon'),
  mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

function setUrl(url, ws) {
  try {
    EddystoneBeacon.advertiseUrl(url);
    mainWindow.webContents.send('status', [url, 'Advertising', true]);
    console.log('advertising: ' + url);
    if (ws) {
      ws.send('advertising: ' + url);
    }
    console.log();
  } catch (e) {
    console.log('error: ' + e);
    mainWindow.webContents.send('status', [e.message, 'Error', false]);
    if (ws) {
      ws.send('error: ' + e);
    }
    console.log();
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
    }
  ];

  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({'width': 600, 'height': 400, 'resizable': false});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('status', ['Use bookmarklet or <span class="key" aria-label="command">&#8984;</span> + <span class="key">A</span> to enter', 'Waiting', true]);
  });

  wss.on('connection', ws => {
    ws.on('message', url => {
      console.log('received: ' + url);
      ws.send('received: ' + url);
      setUrl(url, ws);
    });
  });

  ipc.on('set-url', (event, arg) => {
    setUrl(arg);
  });
});
