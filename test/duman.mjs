// Duman testi: sayfa açılıyor, konsol hatası yok, oyun başlıyor, bir etkileşim durumu değiştiriyor,
// telefon görünümünde yatay taşma yok.
// Kullanım: node test/duman.mjs [--root <klasör>] [--out <klasör>]
// Bağımlılık depoya girmez: playwright-core ve Chromium yolu ortamdan okunur.
//   PW_CORE=<playwright-core klasörü>  (ya da NODE_PATH ile bulunur)   PW_CHROMIUM=<chrome.exe>
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, extname, normalize, resolve } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const root = resolve(arg('--root', process.cwd()));
const outDir = arg('--out', '');
if (outDir) mkdirSync(outDir, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || 'playwright-core');
const exe = process.env.PW_CHROMIUM || undefined;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = normalize(join(root, p));
  if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404); return res.end('yok'); }
  res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/`;
const IGNORED = /gc\.zgo\.at|goatcounter|fonts\.googleapis\.com|fonts\.gstatic\.com/;
let failed = false;
const ok = (m) => console.log('ok   ' + m);
const bad = (m) => { failed = true; console.log('FAIL ' + m); };
const browser = await chromium.launch({ executablePath: exe, headless: true });
try {
  for (const [name, ctxOpt] of [['masaustu', { viewport: { width: 1366, height: 768 } }], ['telefon', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const ctx = await browser.newContext(ctxOpt); const page = await ctx.newPage();
    const errs = [], fails = [];
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !IGNORED.test(m.text())) errs.push('console: ' + m.text()); });
    page.on('requestfailed', (r) => { if (!IGNORED.test(r.url())) fails.push(r.url() + ' ' + (r.failure() || {}).errorText); });
    page.on('response', (r) => { if (r.status() >= 400 && !IGNORED.test(r.url())) fails.push(r.status() + ' ' + r.url()); });
    await page.route(IGNORED, (r) => r.fulfill({ status: 200, body: '', contentType: 'text/css' }));
    await page.goto(base + '?nosave', { waitUntil: 'load' });
    await page.waitForFunction(() => window.__loaded === true, null, { timeout: 90000 }).then(() => ok(name + ': sayfa açıldı, oyun yüklendi'), () => bad(name + ': oyun yüklenmedi'));
    const t = await page.title(); /Ebru/.test(t) ? ok(name + ': başlık "' + t + '"') : bad(name + ': başlık yok');
    // yenilikler penceresi (v2.1): açılır, sürüm etiketi ve rozetler görünür, Esc kapatır
    const nb = await page.$('#bNews');
    if (nb) { await nb.click(); await page.waitForTimeout(300);
      const info = await page.evaluate(() => ({ open: !document.getElementById('news').hidden, ver: document.getElementById('newsVer').textContent, badges: document.querySelectorAll('#badgeList li').length }));
      info.open && /v\d+\.\d+/.test(info.ver) && info.badges > 0 ? ok(`${name}: yenilikler penceresi (${info.ver}, ${info.badges} rozet)`) : bad(name + ': yenilikler penceresi bozuk ' + JSON.stringify(info));
      await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    } else bad(name + ': yenilikler düğmesi yok');
    // oyun başlıyor: Oyna -> HUD görünür, durum değişir
    const before = await page.evaluate(() => window.ebruDebug && window.ebruDebug.G.state);
    await page.click('#bPlay', { timeout: 10000 }).catch((e) => bad(name + ': Oyna tıklanamadı ' + e.message.split('\n')[0]));
    await page.waitForTimeout(1500);
    const dismiss = await page.$('#bCoachOk'); if (dismiss && await dismiss.isVisible()) await dismiss.click();
    const after = await page.evaluate(() => window.ebruDebug.G.state);
    before !== after ? ok(`${name}: oyun başladı (${before} -> ${after})`) : bad(`${name}: durum değişmedi (${before})`);
    // etkileşim: tuvale bir fırça darbesi -> vuruş sayısı artar
    const s0 = await page.evaluate(() => parseInt(document.getElementById("hStrokes").textContent));
    const box = await page.locator('#c').boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height * 0.45;
    await page.mouse.move(cx - 60, cy); await page.mouse.down();
    for (let i = 0; i <= 12; i++) await page.mouse.move(cx - 60 + i * 10, cy + Math.sin(i) * 8);
    await page.mouse.up(); await page.waitForTimeout(500);
    const s1 = await page.evaluate(() => parseInt(document.getElementById("hStrokes").textContent));
    s1 > s0 ? ok(`${name}: darbe sayacı ${s0} -> ${s1}`) : bad(`${name}: darbe sayılmadı (${s0} -> ${s1})`);
    // duraklat -> sürdür
    await page.keyboard.press('p'); await page.waitForTimeout(300);
    const paused = await page.evaluate(() => !document.getElementById('pause').hidden);
    paused ? ok(name + ': duraklatma menüsü açıldı') : bad(name + ': duraklatma açılmadı');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    // taşma: yatay kaydırma yok, görünür düğmeler görünüm içinde
    const ov = await page.evaluate(() => {
      const w = innerWidth, h = innerHeight; const out = [];
      document.querySelectorAll('button, a.btn').forEach((b) => { const r = b.getBoundingClientRect(); if (r.width && r.height && getComputedStyle(b).visibility !== 'hidden' && b.offsetParent && (r.left < -1 || r.right > w + 1 || r.bottom > h + 1)) out.push((b.id || b.textContent.trim().slice(0, 12)) + ':' + Math.round(r.left) + '-' + Math.round(r.right) + ',' + Math.round(r.bottom)); });
      return { sw: document.documentElement.scrollWidth, w, out };
    });
    ov.sw <= ov.w + 1 && !ov.out.length ? ok(`${name}: taşma yok (scrollWidth ${ov.sw}/${ov.w})`) : bad(`${name}: taşma ${ov.sw}/${ov.w} ${ov.out.join(' ')}`);
    const jsErr = await page.evaluate(() => (window.__errs || []).slice());
    errs.push(...jsErr.map((e) => 'js: ' + e));
    errs.length ? bad(name + ': konsol/sayfa hataları: ' + errs.join(' | ')) : ok(name + ': 0 konsol/sayfa hatası');
    fails.length ? bad(name + ': başarısız istekler: ' + fails.join(' | ')) : ok(name + ': 0 başarısız istek');
    if (outDir) await page.screenshot({ path: join(outDir, name + '.png') });
    await ctx.close();
  }
} finally { await browser.close(); srv.close(); }
console.log(failed ? 'SONUC FAIL' : 'SONUC OK'); process.exit(failed ? 1 : 0);
