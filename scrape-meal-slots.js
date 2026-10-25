const fs = require('fs');
const base = 'https://www.cookingformybaby.com/categorie/recettes-bebe/repas/';
const months = [4,5,6,7,8,9,10,11,12,18];
const slots = ['dejeuner','diner','gouter'];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; LocalBabyMealPlanner/1.0)' } });
      if (response.ok) return await response.text();
      await wait(500 * (attempt + 1));
    } catch { await wait(500 * (attempt + 1)); }
  }
  return '';
}
function links(html) {
  return [...html.matchAll(/<article class="cfmb-card"[^>]*>([\s\S]*?)<\/article>/gi)].map(match => {
    const card = match[1];
    const href = card.match(/<a\b[^>]*class="cfmb-card__link[^"]*"[^>]*href="([^"]+)"/i)?.[1];
    return href ? new URL(href, 'https://www.cookingformybaby.com').href : null;
  }).filter(Boolean);
}
async function main() {
  const output = {};
  for (const month of months) {
    output[month] = {};
    for (const slot of slots) {
      const url = `${base}${slot}/?age=${month}`;
      const first = await get(url);
      const pageNumbers = [...first.matchAll(/cfmb_page=(\d+)/g)].map(m => +m[1]);
      const max = Math.max(1, ...pageNumbers);
      let found = links(first);
      for (let page = 2; page <= max; page++) found.push(...links(await get(`${url}&cfmb_page=${page}`)));
      output[month][slot] = [...new Set(found)];
      console.log(`${month} ${slot}: ${output[month][slot].length}`);
    }
  }
  fs.writeFileSync(__dirname + '/source-meal-slots.json', JSON.stringify(output, null, 2), 'utf8');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
