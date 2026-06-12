const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 500,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F9FAFB',
    skipTaskbar: false
  });

  // 加载应用
  mainWindow.loadFile('public/index.html');

  // 开发模式下打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();

  // 点击关闭按钮时隐藏窗口而不是退出
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// 创建系统托盘
function createTray() {
  try {
    // macOS 上托盘图标需要特殊处理
    const iconPath = path.join(__dirname, '../public/icon.png');
    tray = new Tray(iconPath);

    // macOS 需要设置托盘图标为模板模式
    if (process.platform === 'darwin') {
      tray.setImage(iconPath);
      tray.setPressedImage(iconPath);
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            createWindow();
          }
        }
      },
      {
        label: '刷新数据',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.webContents.send('refresh-data');
          }
        }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setToolTip('智谱余额查看');

    // 点击托盘图标显示/隐藏窗口
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });

    console.log('✅ 托盘图标已创建');
  } catch (error) {
    console.error('❌ 创建托盘图标失败:', error);
  }
}

// 查询智谱用量
ipcMain.handle('query-zhipu-usage', async (event, { apiKey, region }) => {
  try {
    const endpoints = {
      cn: 'https://open.bigmodel.cn/api/monitor/usage/quota/limit',
      global: 'https://api.z.ai/api/monitor/usage/quota/limit'
    };

    const endpoint = endpoints[region] || endpoints.cn;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data?.msg || '查询失败' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 应用启动时创建窗口
app.whenReady().then(() => {
  createWindow();
  createTray();

  // macOS 特有：点击 Dock 图标时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 退出应用
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 明确退出，否则应用应保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
