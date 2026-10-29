// Vercel serverless proxy for adsb.lol (adds CORS; api.adsb.lol sends no Access-Control headers).
// Training display only — not for operational use.
export default async function handler(req, res) {
  const lat  = Number(req.query.lat  ?? 32.0);
  const lon  = Number(req.query.lon  ?? 34.9);
  const dist = Math.min(250, Math.max(1, Number(req.query.dist ?? 250)));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    res.status(400).json({ error: 'bad lat/lon' }); return;
  }
  try {
    const r = await fetch(`https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${dist}`, {
      headers: { 'User-Agent': 'acc-north-training-map' }
    });
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    res.setHeader('Content-Type', 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(502).json({ error: String(e) });
  }
}
