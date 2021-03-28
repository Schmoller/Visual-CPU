import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'

function createWindow() {
    const window = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    if (isDev) {
        window.loadURL('http://localhost:3000')
        window.webContents.openDevTools({ mode: 'detach' })
    } else {
        window.loadFile('../build/index.html')
    }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
