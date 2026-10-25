'use strict';

const fs = require('fs');
const path = require('path');
const desktop = __dirname;
const planner = path.resolve(desktop, '..');
const renderer = path.join(desktop, 'renderer');
fs.mkdirSync(renderer, { recursive: true });
const css = fs.readFileSync(path.join(desktop, 'manual-planner.css'), 'utf8');
const js = fs.readFileSync(path.join(desktop, 'manual-planner.js'), 'utf8');
const body = fs.readFileSync(path.join(desktop, 'manual-planner.html'), 'utf8');
const sourceData = JSON.parse(fs.readFileSync(path.join(planner, 'source-recipes.json'), 'utf8'));
const data = JSON.stringify(sourceData.recipes || []).replace(/</g, '\\u003c');
const toolbar = `<div class="bm-desktop-toolbar"><span id="desktop-save-status">식단은 이 PC에 자동 저장됩니다</span><div><button type="button" id="desktop-update-check">업데이트 확인</button><button type="button" id="desktop-update-download" hidden>업데이트 다운로드</button><button type="button" id="desktop-update-install" hidden>다시 시작하고 적용</button></div><span id="desktop-update-status" role="status" aria-live="polite">앱 업데이트 안내</span></div>`;
const toolbarCss = `.bm-desktop-toolbar{position:sticky;top:0;z-index:10;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:8px 18px;background:#46503c;color:#fff;font:11px/1.4 "Noto Sans KR","Malgun Gothic",sans-serif}.bm-desktop-toolbar>div{display:flex;gap:6px}.bm-desktop-toolbar button{padding:6px 12px;border:0;border-radius:20px;background:#fff;color:#46503c;font:inherit;font-weight:700}.bm-desktop-toolbar [hidden]{display:none!important}#desktop-update-status{max-width:42%;text-align:right}@media(max-width:720px){.bm-desktop-toolbar{position:static;display:grid;grid-template-columns:1fr}.bm-desktop-toolbar>div{flex-wrap:wrap}#desktop-update-status{max-width:none;text-align:left}}@media print{.bm-desktop-toolbar{display:none!important}}`;
const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>작은 한 끼 · 월령별 레시피</title><style>${css}</style><style>${toolbarCss}</style></head><body>${toolbar}${body}<script>window.BM_SOURCE_RECIPES=${data};</script><script>${js}</script><script src="../desktop-ui.js"></script></body></html>`;
fs.writeFileSync(path.join(renderer, 'index.html'), page, 'utf8');
