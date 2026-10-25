const fs = require('fs');

const base = 'https://www.cookingformybaby.com';
const months = [...Array(9)].map((_, i) => i + 4).concat(18);
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, tries = 3) {
  for (let n = 0; n < tries; n++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; LocalBabyMealPlanner/1.0)' } });
      if (r.ok) return await r.text();
      if (r.status === 429 || r.status >= 500) await sleep(400 * (n + 1));
      else return '';
    } catch { await sleep(400 * (n + 1)); }
  }
  return '';
}
function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
async function pool(items, concurrency, fn) {
  let next = 0, done = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      await fn(items[i], i);
      done++;
      if (done % 25 === 0) console.log(`progress ${done}/${items.length}`);
    }
  });
  await Promise.all(workers);
}
function recipeLinks(html, age) {
  const list = [];
  for (const m of html.matchAll(/<article class="cfmb-card"[^>]*>([\s\S]*?)<\/article>/gi)) {
    const card = m[1];
    const href = card.match(/<a\b[^>]*class="cfmb-card__link[^\"]*"[^>]*href="([^"]+)"/i)?.[1];
    const title = card.match(/<h3\b[^>]*class="cfmb-card__title"[^>]*>([\s\S]*?)<\/h3>/i)?.[1];
    if (!href || !title) continue;
    list.push({ title: decode(title.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()), url: decode(href), ages: [age] });
  }
  return list;
}
function findRecipes(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node)) { for (const x of node) findRecipes(x, out); return out; }
  if (typeof node !== 'object') return out;
  const type = node['@type'];
  if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) out.push(node);
  for (const value of Object.values(node)) if (value && typeof value === 'object') findRecipes(value, out);
  return out;
}
async function main() {
  const pages = [];
  await pool(months, 4, async age => {
    const url = `${base}/categorie/recettes-bebe/${age}-mois/`;
    const html = await get(url);
    const nums = [...html.matchAll(/cfmb_page=(\d+)/g)].map(x => +x[1]);
    const max = Math.max(1, ...nums);
    pages.push({ age, page: 1, url, html });
    for (let p = 2; p <= max; p++) pages.push({ age, page: p, url: `${url}?cfmb_page=${p}` });
  });
  await pool(pages.filter(x => !x.html), 6, async p => { p.html = await get(p.url); });
  const byUrl = new Map();
  for (const page of pages) for (const r of recipeLinks(page.html || '', page.age)) {
    const old = byUrl.get(r.url);
    if (old) { if (!old.ages.includes(page.age)) old.ages.push(page.age); }
    else byUrl.set(r.url, r);
  }
  const recipes = [...byUrl.values()];
  console.log(`catalog pages ${pages.length}; unique cards ${recipes.length}`);
  let invalid = 0;
  await pool(recipes, 6, async r => {
    const html = await get(r.url);
    let found = [];
    for (const s of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      try { found.push(...findRecipes(JSON.parse(s[1]))); } catch { }
    }
    const data = found.find(x => Array.isArray(x.recipeIngredient) && x.recipeIngredient.length) || found[0];
    if (!data) { invalid++; return; }
    r.sourceTitle = data.name || r.title;
    r.description = data.description || '';
    r.ingredients = data.recipeIngredient || [];
    r.yield = data.recipeYield || '';
    r.category = data.recipeCategory || '';
    r.instructions = (Array.isArray(data.recipeInstructions) ? data.recipeInstructions : data.recipeInstructions ? [data.recipeInstructions] : []).map(x => typeof x === 'string' ? x : x.text || x.name || '').filter(Boolean);
    r.prepTime = data.prepTime || '';
    r.cookTime = data.cookTime || '';
    r.image = typeof data.image === 'string' ? data.image : data.image?.url || '';
  });
  const output = { fetchedAt: new Date().toISOString(), source: base, months, recipeCount: recipes.length - invalid, missingDetailCount: invalid, recipes: recipes.filter(r => r.ingredients?.length) };
  fs.writeFileSync(__dirname + '/source-recipes-refresh.json', JSON.stringify(output, null, 2), 'utf8');
  const counts = Object.fromEntries(months.map(m => [m, recipes.filter(r => r.ages.includes(m)).length]));
  console.log(JSON.stringify({ counts, total: output.recipeCount, missing: invalid }));
}
main().catch(e => { console.error(e); process.exitCode = 1; });

