(() => {
  'use strict';
  const KEY = 'nexus-engine-workspace-v1';
  const PROFILE_KEY = 'nexus-engine-storage-profile';
  const sampleDeployments = [
    { id: 'd1', name: 'nexus-api-gateway', environment: 'Production', status: 'Active', updated: '2 hours ago' },
    { id: 'd2', name: 'vector-search-engine', environment: 'Production', status: 'Active', updated: '5 hours ago' },
    { id: 'd3', name: 'model-inference-v2', environment: 'Staging', status: 'Active', updated: '1 day ago' },
    { id: 'd4', name: 'data-pipeline-core', environment: 'Development', status: 'Pending', updated: '2 days ago' }
  ];
  const sampleActivity = [
    { text: 'nexus-api-gateway was deployed', time: '2 hours ago', icon: '↗' },
    { text: 'vector-search-engine is active', time: '5 hours ago', icon: '◈' },
    { text: 'model-inference-v2 was updated', time: '1 day ago', icon: '⬡' }
  ];
  const models = [
    { name: 'Nexus Embed', kind: 'EMBEDDING', description: 'A sample embedding model for exploring your registry.' },
    { name: 'Vector Vision', kind: 'MULTIMODAL', description: 'A sample multimodal model for your local workspace.' },
    { name: 'Core Language', kind: 'LANGUAGE', description: 'A sample language model record, ready to explore.' }
  ];
  const $ = (id) => document.getElementById(id);
  const initial = () => ({ deployments: sampleDeployments.map(x => ({ ...x })), activity: sampleActivity.map(x => ({ ...x })) });
  let profile = 'local';
  try { if (localStorage.getItem(PROFILE_KEY) === 'session') profile = 'session'; } catch (_) { /* Use the default. */ }
  const storage = () => profile === 'session' ? sessionStorage : localStorage;
  function load() {
    try {
      const saved = JSON.parse(storage().getItem(KEY));
      return saved && Array.isArray(saved.deployments) && Array.isArray(saved.activity) ? saved : initial();
    } catch (_) { return initial(); }
  }
  let state = load();
  $('storageProfile').value = profile;
  function save() {
    try { storage().setItem(KEY, JSON.stringify(state)); }
    catch (_) { notify('Storage is unavailable; changes will last only for this session.'); }
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function row(item) {
    const status = item.status === 'Active' ? 'Active' : 'Pending';
    return `<tr><td><span class="item-name"><span class="item-icon">▤</span>${escapeHtml(item.name)}</span></td><td class="env">${escapeHtml(item.environment)}</td><td><span class="status ${status === 'Pending' ? 'pending' : ''}"><i></i>${status}</span></td><td>${escapeHtml(item.updated)}</td><td class="row-more">···</td></tr>`;
  }
  function activities(items) {
    return items.length ? items.map(item => `<div class="activity-item"><span class="activity-icon">${escapeHtml(item.icon)}</span><div class="activity-text"><strong>${escapeHtml(item.text)}</strong><span class="activity-time">${escapeHtml(item.time)}</span></div></div>`).join('') : '<p class="empty">No activity yet.</p>';
  }
  function render() {
    $('totalCount').innerHTML = `${String(state.deployments.length).padStart(2, '0')} <small>deployments</small>`;
    $('modelCount').innerHTML = `${String(models.length).padStart(2, '0')} <small>models</small>`;
    document.querySelector('.nav-count').textContent = String(state.deployments.length).padStart(2, '0');
    $('recentRows').innerHTML = state.deployments.slice(0, 4).map(row).join('');
    const query = $('deploymentSearch').value.trim().toLowerCase();
    const filtered = state.deployments.filter(x => `${x.name} ${x.environment} ${x.status}`.toLowerCase().includes(query));
    $('allRows').innerHTML = filtered.map(row).join('');
    $('emptyDeployments').classList.toggle('hidden', filtered.length !== 0);
    $('overviewActivity').innerHTML = activities(state.activity.slice(0, 3));
    $('allActivity').innerHTML = activities(state.activity);
    $('modelGrid').innerHTML = models.map(model => `<article class="model-card"><span class="item-icon">⬡</span><h3>${escapeHtml(model.name)}</h3><p>${escapeHtml(model.description)}</p><footer>◈ &nbsp; ${escapeHtml(model.kind)} &nbsp; / &nbsp; SAMPLE</footer></article>`).join('');
  }
  const pages = {
    overview: ['Engine overview', 'Your entire operation, in one place. Welcome back, operator.'],
    deployments: ['Deployments', 'A clear view of everything in your workspace.'],
    models: ['Model registry', 'Explore the models in your local workspace.'],
    activity: ['Activity log', 'A running record of your workspace.'],
    settings: ['Privacy settings', 'Your workspace, your data, your control.']
  };
  function navigate() {
    const name = location.hash.slice(1) in pages ? location.hash.slice(1) : 'overview';
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    $(name + 'Page').classList.remove('hidden');
    document.querySelectorAll('[data-page]').forEach(el => {
      const active = el.dataset.page === name;
      el.classList.toggle('active', active);
      if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    $('pageTitle').innerHTML = `${escapeHtml(pages[name][0])}<span class="heading-period">.</span>`;
    $('pageDescription').textContent = pages[name][1];
    $('breadcrumbPage').textContent = name === 'models' ? 'MODEL REGISTRY' : name === 'settings' ? 'PRIVACY SETTINGS' : name.toUpperCase();
  }
  let toastTimer;
  function notify(message) {
    $('toast').textContent = message;
    $('toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3500);
  }
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => { location.hash = button.dataset.go; }));
  $('exploreButton').addEventListener('click', () => { location.hash = 'deployments'; });
  $('themeInfo').addEventListener('click', () => notify('Demo workspace: everything stays in this browser. No live integrations.'));
  $('deploymentSearch').addEventListener('input', render);
  $('newButton').addEventListener('click', () => $('deploymentDialog').showModal());
  $('closeDialog').addEventListener('click', () => $('deploymentDialog').close());
  $('cancelDialog').addEventListener('click', () => $('deploymentDialog').close());
  $('deploymentForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    if (!name) { form.elements.name.setCustomValidity('Please enter a name.'); form.elements.name.reportValidity(); return; }
    state.deployments.unshift({ id: globalThis.crypto?.randomUUID?.() || String(Date.now()), name, environment: form.elements.environment.value, status: 'Pending', updated: 'Just now' });
    state.activity.unshift({ text: `${name} was added`, time: 'Just now', icon: '+' });
    save(); render(); form.reset(); $('deploymentDialog').close(); notify('Local deployment record created.');
  });
  $('deploymentForm').elements.name.addEventListener('input', event => event.target.setCustomValidity(''));
  $('clearActivity').addEventListener('click', () => {
    if (!confirm('Clear all local activity?')) return;
    state.activity = []; save(); render(); notify('Activity cleared.');
  });
  $('storageProfile').addEventListener('change', event => {
    const next = event.target.value;
    if (next === profile) return;
    try {
      // Write the destination before removing the old copy, so a failed write does not lose data.
      const destination = next === 'session' ? sessionStorage : localStorage;
      destination.setItem(KEY, JSON.stringify(state));
      localStorage.setItem(PROFILE_KEY, next);
      storage().removeItem(KEY);
      profile = next;
      notify(next === 'session' ? 'Session-only profile enabled for this tab.' : 'Persistent local profile enabled.');
    } catch (_) {
      event.target.value = profile;
      notify('Could not change the storage profile.');
    }
  });
  $('resetButton').addEventListener('click', () => {
    if (!confirm('Reset all local workspace data to the samples? This cannot be undone.')) return;
    state = initial(); save(); render(); notify('Sample workspace restored.');
  });
  $('exportButton').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'nexus-workspace.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Workspace exported as JSON.');
  });
  function updateNetwork() { $('connectionStatus').textContent = navigator.onLine ? 'NETWORK AVAILABLE' : 'OFFLINE'; }
  window.addEventListener('online', updateNetwork); window.addEventListener('offline', updateNetwork);
  window.addEventListener('hashchange', navigate);
  // Synchronize local records between tabs; localStorage remains the source of truth.
  window.addEventListener('storage', event => {
    if (event.key === PROFILE_KEY) {
      profile = event.newValue === 'session' ? 'session' : 'local';
      $('storageProfile').value = profile;
      state = load(); render(); return;
    }
    if (event.key !== KEY || profile !== 'local' || event.storageArea !== localStorage) return;
    try { const next = JSON.parse(event.newValue); state = next && Array.isArray(next.deployments) && Array.isArray(next.activity) ? next : initial(); render(); } catch (_) { /* Ignore malformed external updates. */ }
  });
  render(); navigate(); updateNetwork();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => console.warn('Offline cache unavailable.'));
  }
})();
