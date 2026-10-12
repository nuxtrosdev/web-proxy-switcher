* {
  box-sizing: border-box;
}

:root {
  --bg: #07111f;
  --bg-alt: #0d1b2a;
  --panel: rgba(14, 26, 42, 0.88);
  --panel-border: rgba(148, 163, 184, 0.15);
  --text: #e5eefb;
  --muted: #a9bbd2;
  --accent: #60a5fa;
  --accent-strong: #3b82f6;
  --shadow: rgba(2, 6, 23, 0.45);
}

html, body {
  margin: 0;
  min-height: 100%;
  height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #12243a 0%, var(--bg) 48%, #040b13 100%);
  color: var(--text);
}

body {
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 24px;
}

.app-shell {
  width: min(1400px, 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(8, 14, 25, 0.72);
  border: 1px solid var(--panel-border);
  border-radius: 22px;
  box-shadow: 0 20px 60px var(--shadow);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--panel-border);
  background: rgba(11, 20, 35, 0.72);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
}

.eyebrow {
  margin: 0;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
}

h1 {
  margin: 4px 0 0;
  font-size: clamp(1.35rem, 2vw, 2rem);
}

.controls {
  display: flex;
  align-items: end;
}

.engine-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 0.8rem;
}

select,
input,
button {
  font: inherit;
}

select {
  min-width: 170px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  border-radius: 10px;
  padding: 10px 12px;
}

.content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px 20px 12px;
}

.search-form {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid var(--panel-border);
  border-radius: 14px;
  padding: 12px;
}

.search-form input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  padding: 11px 12px;
  outline: none;
}

.search-form input::placeholder {
  color: rgba(148, 163, 184, 0.8);
}

.search-form button {
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: white;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.search-form button:hover {
  transform: translateY(-1px);
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 12px;
  background: rgba(96, 165, 250, 0.16);
  color: #cfe4ff;
  font-size: 0.76rem;
  letter-spacing: 0.04em;
  font-weight: 700;
}

.privacy-note {
  color: var(--muted);
  font-size: 0.88rem;
}

.viewer-wrap {
  position: relative;
  flex: 1;
  min-height: 720px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--panel-border);
  background: rgba(7, 17, 31, 0.8);
}

iframe {
  width: 100%;
  height: 100%;
  min-height: 720px;
  border: 0;
  background: white;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 720px) {
  body {
    padding: 12px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form button {
    width: 100%;
  }

  .viewer-wrap,
  iframe {
    min-height: 540px;
  }
}
