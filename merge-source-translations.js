'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const fresh = JSON.parse(fs.readFileSync(path.join(root, 'source-recipes-refresh.json'), 'utf8'));
const old = JSON.parse(fs.readFileSync(path.join(root, 'source-recipes.json'), 'utf8'));
const byUrl = new Map(old.recipes.map(r => [r.url, r]));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function get(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {headers:{'user-agent':'Mozilla/5.0 (compatible; LittleSpoonPlanner/1.0)'}});
      if (response.ok) return await response.text();
      if (response.status < 500 && response.status !== 429) break;
    } catch {}
    await wait(350 * (attempt + 1));
  }
  return '';
}
function extractSteps(html) {
  const headings = [...html.matchAll(/<h[2-6]\b[^>]*>([\s\S]*?)<\/h[2-6]>/gi)];
  const clean = s => decode(s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
  const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0*39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ');
  const steps=[];
  for(let i=0;i<headings.length;i++){
    if(!/^(préparation|preparation|cuisson|cooking)\b/i.test(clean(headings[i][1]))) continue;
    const start=headings[i].index+headings[i][0].length;
    const next=headings.slice(i+1).find(x=>x.index>start);
    const end=next?next.index:(html.indexOf('<div id="comments"',start)>-1?html.indexOf('<div id="comments"',start):html.length);
    const section=html.slice(start,end);
    for(const m of section.matchAll(/<(?:p|li)\b[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)){
      const step=clean(m[1]);
      if(step.length>18&&!steps.includes(step)) steps.push(step);
    }
  }
  return steps;
}
async function translate(lines) {
  if(!lines.length) return [];
  const q=encodeURIComponent(lines.join('\n'));
  for(let attempt=0;attempt<4;attempt++){
    try{
      const response=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=ko&dt=t&q='+q);
      if(response.ok){const json=await response.json();const text=json[0].map(x=>x[0]).join('');const result=text.split('\n');if(result.length===lines.length)return result;}
    }catch{}
    await wait(500*(attempt+1));
  }
  return lines;
}
function polish(s){
  return String(s||'').replace(/\u00a0/g,' ').replace(/스팀 바구니|스팀 바스켓|스팀 바스켓/g,'찜기').replace(/스팀 요리|스팀 조리|스팀/g,'찜').replace(/사과소스/g,'사과 퓨레').replace(/황금 사과/g,'골든 품종 사과').replace(/샐러드 그릇/g,'볼').replace(/우리는\s*/g,'').replace(/우리의\s*/g,'').replace(/계란/g,'달걀').replace(/간다!|가자!/g,'바로 조리합니다.').replace(/혼합하십시오/g,'섞어 주세요').replace(/균질한 질감/g,'고른 질감').replace(/매우 부드러운 퓌레를 얻기 위해 호박을 섞습니다/g,'애호박을 곱게 갈아 퓨레로 만듭니다').replace(/요리가 시작됩니다/g,'찜을 시작합니다').replace(/요리 중간/g,'조리 중간').replace(/요리가 끝나면/g,'조리가 끝나면').replace(/조리가 시작됩니다/g,'조리를 시작합니다').replace(/굉장히 두꺼운/g,'아주 되직한').replace(/샐러드 볼/g,'볼').replace(/\s+([,.!?])/g,'$1').replace(/\s+/g,' ').trim();
}
async function main(){
let translatedNew=0,stepScrapes=0;
for(let i=0;i<fresh.recipes.length;i++){
  const r=fresh.recipes[i],prior=byUrl.get(r.url);
  if(prior){
    r.titleKo=prior.titleKo;
    r.ingredientsKo=prior.ingredientsKo;
    r.instructionsFr=prior.instructionsFr?.length?prior.instructionsFr:(prior.instructions||[]);
    r.instructionsKo=prior.instructionsKo;
  } else {
    if(!r.instructions?.length){const html=await get(r.url);r.instructions=extractSteps(html);stepScrapes+=r.instructions.length>0?1:0;}
    const lines=[r.title,...(r.ingredients||[]),...(r.instructions||[])];
    const ko=await translate(lines);let index=0;
    r.titleKo=ko[index++]||r.title;
    r.ingredientsKo=(r.ingredients||[]).map(()=>ko[index++]||'');
    r.instructionsFr=r.instructions||[];
    r.instructionsKo=(r.instructions||[]).map(()=>ko[index++]||'');
    translatedNew++;
  }
  r.titleKo=polish(r.titleKo||r.title);
  r.ingredientsKo=(r.ingredientsKo||[]).map(polish);
  r.instructionsFr=r.instructionsFr||r.instructions||[];
  r.instructionsKo=(r.instructionsKo||[]).map(polish);
}
fresh.translationInfo={language:'Korean',basis:'French recipe pages from Cooking for my baby; existing pages cross-checked against the website English edition where available; source wording and link retained.',reviewedGlossary:['steam cooking → 찜','compote → 과일 퓨레','French utensil/ingredient names localized for Korean readers'],translatedNew,stepScrapes,updatedAt:new Date().toISOString()};
fs.writeFileSync(path.join(root,'source-recipes.json'),JSON.stringify(fresh,null,2),'utf8');
console.log(JSON.stringify({recipeCount:fresh.recipeCount,listed:fresh.recipes.length,translatedNew,stepScrapes,info:fresh.translationInfo},null,2));

}
main().catch(e=>{console.error(e);process.exitCode=1});


