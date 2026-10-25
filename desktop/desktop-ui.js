'use strict';

(() => {
  const api = window.babyPlannerDesktop;
  const status = document.getElementById('desktop-update-status');
  const check = document.getElementById('desktop-update-check');
  const download = document.getElementById('desktop-update-download');
  const install = document.getElementById('desktop-update-install');
  if (!api || !status) return;
  api.onUpdateStatus((state) => {
    status.textContent = state.message || '';
    if (download) download.hidden = state.state !== 'available' && state.state !== 'error';
    if (install) install.hidden = state.state !== 'downloaded';
  });
  check?.addEventListener('click', async () => {
    status.textContent = '업데이트를 확인하고 있어요.';
    const result = await api.checkForUpdates();
    if (!result.ok) status.textContent = result.message || '업데이트 확인을 완료하지 못했어요.';
  });
  download?.addEventListener('click', async () => {
    const result = await api.downloadUpdate();
    if (!result.ok) status.textContent = result.message || '업데이트를 다운로드하지 못했어요.';
  });
  install?.addEventListener('click', () => api.installUpdate());
})();
