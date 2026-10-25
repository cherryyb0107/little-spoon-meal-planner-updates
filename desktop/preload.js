'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('babyPlannerDesktop', {
  loadPreferences: () => ipcRenderer.invoke('planner:load-preferences'),
  savePreferences: (preferences) => ipcRenderer.invoke('planner:save-preferences', preferences),
  checkForUpdates: () => ipcRenderer.invoke('app:check-updates'),
  downloadUpdate: () => ipcRenderer.invoke('app:download-update'),
  installUpdate: () => ipcRenderer.invoke('app:install-update'),
  onUpdateStatus: (callback) => ipcRenderer.on('app:update-status', (_event, status) => callback(status)),
});
