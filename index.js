const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow = null
const countFrames = false

// app.disableHardwareAcceleration()

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 500,
    height: 500,
    useContentSize: true
  })
  win.loadURL(`file://${__dirname}/display.html`)
  // win.webContents.openDevTools({ mode: 'detach' })

  let contentWin = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    fullscreen: false,
    fullscreenable: false,
    enableLargerThanScreen: true,
    useContentSize: true,
    thickFrame: false,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      offscreen: true,
      webSecurity: true,
      plugins: true
    }
  })
  contentWin.webContents.openDevTools({ mode: 'detach' })
  contentWin.webContents.startPainting()

  ipcMain.on('mousedown', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  ipcMain.on('mouseup', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  ipcMain.on('mousemove', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  ipcMain.on('keydown', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  ipcMain.on('keyup', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  ipcMain.on('char', (event, arg) => {
    if (!win.isDestroyed())
      contentWin.webContents.sendInputEvent(arg)
  })

  contentWin.loadURL(`file://${__dirname}/index.html`)

  if (countFrames) {
    let frames = []
  }
  contentWin.webContents.on('paint', (event, dirty, image) => {
    if (countFrames) {
      frames.push(Date.now())
    }
    win.webContents.executeJavaScript(`setImage('${image.toDataURL()}')`)
    win.webContents.executeJavaScript(`setDamage('${JSON.stringify(dirty)}')`)
  })
  if (countFrames) {
    setInterval(() => {
      console.log(frames.filter(x => x >= Date.now() - 1000).length)
    }, 100)
  }

  contentWin.webContents.on('dom-ready', () => {

    contentWin.focus()
    setTimeout(() => {
      contentWin.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Tab' })
      contentWin.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Tab' })

      contentWin.webContents.sendInputEvent({ type: 'keyDown', modifiers: ['alt'], keyCode: 'Down' })
      contentWin.webContents.sendInputEvent({ type: 'keyUp', modifiers: ['alt'], keyCode: 'Down' })

      setTimeout(() => {
        contentWin.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Down' })
        contentWin.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Down' })

        // contentWin.webContents.setScaleFactor(3.0)

        contentWin.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Down' })
        contentWin.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Down' })
        // contentWin.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Enter' })
        // contentWin.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Enter' })
      }, 500)
    }, 500)
  })
  win.on('closed', () => {
    app.exit()
  })
  // mainWindow.focus()
})
