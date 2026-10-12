const engineSelect = document.getElementById('engineSelect');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const proxyFrame = document.getElementById('proxyFrame');
const engineBadge = document.getElementById('engineBadge');

const engineLabels = {
  uv: 'Ultraviolet',
  scramjet: 'Scramjet',
  'scramjet-v2': 'Scramjet v2'
};

function updateBadge(engine) {
  engineBadge.textContent = engineLabels[engine] || 'Ultraviolet';
}

function applyStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const engine = params.get('engine') || 'uv';
  const q = params.get('q') || '';

  engineSelect.value = Object.prototype.hasOwnProperty.call(engineLabels, engine) ? engine : 'uv';
  updateBadge(engineSelect.value);
  searchInput.value = q;

  if (q) {
    loadSearchPage(engineSelect.value, q);
  } else {
    const defaultTarget = '/api/view?url=' + encodeURIComponent('https://example.com');
    proxyFrame.src = defaultTarget;
  }
}

async function loadSearchPage(engine, rawQuery) {
  const query = String(rawQuery || '').trim();
  const result = await fetch(`/api/search?engine=${encodeURIComponent(engine)}&q=${encodeURIComponent(query)}`);
  const payload = await result.json();

  if (!payload.ok) {
    return;
  }

  const target = payload.target || 'https://example.com';
  const historyState = { engine, q: query };

  history.pushState(historyState, '', `/?engine=${encodeURIComponent(engine)}&q=${encodeURIComponent(query)}`);
  updateBadge(engine);
  proxyFrame.src = `/api/view?url=${encodeURIComponent(target)}`;
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const engine = engineSelect.value;
  const query = searchInput.value.trim();

  if (!query) {
    return;
  }

  await loadSearchPage(engine, query);
});

engineSelect.addEventListener('change', () => {
  const engine = engineSelect.value;
  const query = searchInput.value.trim();
  updateBadge(engine);

  if (query) {
    loadSearchPage(engine, query);
  }
});

window.addEventListener('popstate', () => {
  applyStateFromUrl();
});

applyStateFromUrl();
