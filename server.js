const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const engineMap = {
  uv: { label: 'Ultraviolet', landing: 'https://example.com' },
  scramjet: { label: 'Scramjet', landing: 'https://example.com' },
  'scramjet-v2': { label: 'Scramjet v2', landing: 'https://example.com' }
};

function isLikelyUrl(value) {
  return /^https?:\/\//i.test(value) || /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(value);
}

function normalizeTargetUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`;
  return null;
}

function buildSearchUrl(engine, query) {
  const normalized = String(query || '').trim();
  if (!normalized) return engineMap[engine]?.landing || engineMap.uv.landing;

  const direct = normalizeTargetUrl(normalized);
  if (direct) return direct;

  const params = new URLSearchParams({ q: normalized });
  const engines = {
    uv: `https://www.google.com/search?${params.toString()}`,
    scramjet: `https://www.bing.com/search?${params.toString()}`,
    'scramjet-v2': `https://duckduckgo.com/?${params.toString()}`
  };

  return engines[engine] || engines.uv;
}

function rewriteHtmlAssets(html, baseUrl) {
  const base = new URL(baseUrl);

  return html.replace(/(src|href|action)=(["'])(.*?)\2/gi, (match, attr, quote, value) => {
    if (!value || /^(javascript:|data:|mailto:|tel:|#)/i.test(value)) {
      return match;
    }

    try {
      const resolved = new URL(value, base).href;
      const proxied = `/api/view?url=${encodeURIComponent(resolved)}`;
      return `${attr}=${quote}${proxied}${quote}`;
    } catch (error) {
      return match;
    }
  });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'web-proxy-switcher' });
});

app.get('/api/search', (req, res) => {
  const engine = req.query.engine || 'uv';
  const query = String(req.query.q || '').trim();
  const target = buildSearchUrl(engine, query);

  res.json({
    ok: true,
    engine,
    query,
    target,
    label: engineMap[engine]?.label || 'Ultraviolet'
  });
});

app.get('/api/view', async (req, res) => {
  const rawUrl = String(req.query.url || '').trim();
  if (!rawUrl) {
    return res.status(400).json({ ok: false, message: 'Missing url parameter.' });
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl.includes('://') ? rawUrl : `https://${rawUrl}`).href;
  } catch (error) {
    return res.status(400).json({ ok: false, message: 'Invalid target URL.' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebProxySwitcher/1.0; +https://example.com)'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(await response.text());
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (contentType.includes('text/html')) {
      const html = buffer.toString('utf8');
      const rewritten = rewriteHtmlAssets(html, targetUrl);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.send(rewritten);
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    return res.send(buffer);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      message: 'Unable to fetch target URL.',
      error: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Web proxy switcher running on http://localhost:${PORT}`);
});
