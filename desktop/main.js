'use strict';

const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

const PRODUCT_NAME = '작은 한 끼';
const CONFIG_PATH = path.join(__dirname, 'app-config.json');
let mainWindow;
let updaterConfigured = false;
let updateDownloaded = false;

function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch { return {}; }
}

function preferencePath() {
  return path.join(app.getPath('userData'), 'planner-preferences.json');
}

function readPreferences() {
  try { return JSON.parse(fs.readFileSync(preferencePath(), 'utf8')); } catch { return null; }
}

function writePreferences(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('저장할 설정을 확인해 주세요.');
  const file = preferencePath();
  const temp = `${file}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(temp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(temp, file);
  return { ok: true };
}

function sendUpdateStatus(status) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('app:update-status', status);
}

function configureUpdater() {
  const repository = String(readConfig().updateRepository || '').trim();
  const match = repository.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (!match || !app.isPackaged) return;
  updaterConfigured = true;
  autoUpdater.setFeedURL({ provider: 'github', owner: match[1], repo: match[2] });
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdateStatus({ state: 'checking', message: '업데이트를 확인하고 있어요.' }));
  autoUpdater.on('update-available', (info) => sendUpdateStatus({ state: 'available', message: `${info.version} 업데이트를 다운로드하고 있어요.`, version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdateStatus({ state: 'current', message: '현재 최신 버전이에요.' }));
  autoUpdater.on('download-progress', (progress) => sendUpdateStatus({ state: 'downloading', message: `업데이트 다운로드 ${Math.floor(progress.percent)}%`, percent: progress.percent }));
  autoUpdater.on('update-downloaded', (info) => {
    updateDownloaded = true;
    sendUpdateStatus({ state: 'downloaded', message: `${info.version} 업데이트가 준비됐어요. 다시 시작하면 적용됩니다.`, version: info.version });
    dialog.showMessageBox(mainWindow, { type: 'info', title: `${PRODUCT_NAME} 업데이트`, message: `${info.version} 업데이트를 받았어요. 지금 다시 시작해 적용할까요?`, buttons: ['지금 다시 시작', '나중에'], defaultId: 0, cancelId: 1 }).then(({ response }) => { if (response === 0) autoUpdater.quitAndInstall(); });
  });
  autoUpdater.on('error', (error) => sendUpdateStatus({ state: 'error', message: `업데이트 확인을 완료하지 못했어요: ${error.message}` }));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 920,
    minWidth: 920,
    minHeight: 680,
    show: false,
    backgroundColor: '#f7f4ed',
    title: PRODUCT_NAME,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => { if (!url.startsWith('file://')) event.preventDefault(); });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  configureUpdater();
  createWindow();
  if (updaterConfigured) setTimeout(() => autoUpdater.checkForUpdates().catch(() => {}), 2500);
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('planner:load-preferences', () => readPreferences());
ipcMain.handle('planner:save-preferences', (_event, value) => writePreferences(value));
ipcMain.handle('app:check-updates', async () => {
  if (!updaterConfigured) return { ok: false, configured: false, message: '자동 업데이트 주소가 아직 연결되지 않았어요. 앱 배포 저장소를 등록하면 새 버전을 확인할 수 있어요.' };
  try { const result = await autoUpdater.checkForUpdates(); return { ok: true, version: result?.updateInfo?.version || '' }; }
  catch (error) { return { ok: false, configured: true, message: error.message }; }
});
ipcMain.handle('app:download-update', async () => {
  if (!updaterConfigured) return { ok: false, message: '자동 업데이트 주소가 아직 연결되지 않았어요.' };
  try { return await autoUpdater.downloadUpdate(); } catch (error) { return { ok: false, message: error.message }; }
});
ipcMain.handle('app:install-update', () => { if (!updateDownloaded) return { ok: false }; autoUpdater.quitAndInstall(); return { ok: true }; });
