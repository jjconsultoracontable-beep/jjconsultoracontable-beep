const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "SIFEN ELITE v14.0 - Facturación Electrónica Paraguay",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carga la app compillada
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(distIndex).catch(() => {
    // Si está en desarrollo local
    win.loadURL('http://localhost:3000');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
