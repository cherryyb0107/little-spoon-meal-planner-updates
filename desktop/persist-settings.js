'use strict';

(async () => {
  const bridge = window.babyPlannerDesktop;
  const form = document.getElementById('bm-form');
  if (!bridge || !form) return;
  const status = document.getElementById('desktop-save-status');
  let restoring = true;
  let saveTimer;
  const fieldNames = ['birth','start','meals','portion','snacks','fruit','interval','recipeMonth','adultServings'];
  const flagNames = ['seasonal','introduce','autoPortion','history','early','adultPlan'];
  const portionFields = [...form.querySelectorAll('input[name^="portion"]')];
  const save = async () => {
    if (restoring) return;
    const fields = Object.fromEntries(fieldNames.map(name => [name, form.elements[name]?.value ?? '']));
    const flags = Object.fromEntries(flagNames.map(name => [name, Boolean(form.elements[name]?.checked)]));
    const portions = Object.fromEntries(portionFields.map(input => [input.name, input.value]));
    const lists = Object.fromEntries(['known','exclude','adultVeg','adultProtein','adultCarb'].map(name => [name,[...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value)]));
    try { await bridge.savePreferences({ version: 1, fields, flags, portions, lists, savedAt: new Date().toISOString() }); if (status) status.textContent = '설정 저장됨'; }
    catch { if (status) status.textContent = '설정 저장에 실패했어요'; }
  };
  const scheduleSave = () => { if (!restoring) { clearTimeout(saveTimer); saveTimer = setTimeout(save, 350); } };
  try {
    const saved = await bridge.loadPreferences();
    if (saved) {
      for (const [name, value] of Object.entries(saved.fields || {})) if (form.elements[name]) form.elements[name].value = value;
      for (const [name, value] of Object.entries(saved.flags || {})) if (form.elements[name]) form.elements[name].checked = Boolean(value);
      for (const [name, value] of Object.entries(saved.portions || {})) if (form.elements[name]) form.elements[name].value = value;
      form.elements.recipeMonth?.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
      for (const name of ['known','exclude','adultVeg','adultProtein','adultCarb']) {
        const selected = new Set(saved.lists?.[name] || []);
        form.querySelectorAll(`input[name="${name}"]`).forEach(input => { input.checked = selected.has(input.value); });
      }
      if (status) status.textContent = '이 PC에 저장된 설정을 불러왔어요';
    } else if (status) status.textContent = '설정은 이 PC에 자동 저장됩니다';
  } catch { if (status) status.textContent = '저장된 설정을 불러오지 못했어요'; }
  restoring = false;
  form.addEventListener('input', scheduleSave);
  form.addEventListener('change', scheduleSave);
  form.addEventListener('submit', () => setTimeout(save, 50));
  ['bm-known-all','bm-known-none','bm-exclude-none'].forEach(id => document.getElementById(id)?.addEventListener('click', () => setTimeout(save, 50)));
})();
