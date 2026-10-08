(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TeaExplore = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const KEY = 'tea-heritage-explore-v1';
  const TEA_TYPES = new Set(['绿茶', '红茶', '黑茶', '乌龙茶', '黄茶', '白茶', '花茶', '普洱茶']);
  const array = value => Array.isArray(value) ? value : [];
  const unique = values => [...new Set(values)];

  function sanitize(value, items) {
    const ids = new Set(items.map(item => item.id));
    const cleanIds = values => unique(array(values).filter(id => ids.has(id)));
    const progress = {};
    for (const item of items) {
      const steps = new Set(array(item.practiceExperience?.steps).map(step => step.id));
      const saved = cleanIds(value?.visited).includes(item.id) || value?.progress?.[item.id];
      if (saved) progress[item.id] = unique(array(value?.progress?.[item.id]).filter(id => steps.has(id)));
    }
    return { version: 1, favorites: cleanIds(value?.favorites), visited: cleanIds(value?.visited), progress };
  }

  function createStore(items, storage) {
    let persistent = Boolean(storage), data;
    try { data = sanitize(JSON.parse(storage?.getItem(KEY) || '{}'), items); }
    catch { data = sanitize({}, items); }
    function save() {
      if (!persistent) return;
      try { storage.setItem(KEY, JSON.stringify(data)); }
      catch { persistent = false; }
    }
    // Test write access too: some browsers allow reading but prohibit saving.
    save();
    return {
      get data() { return data; },
      get persistent() { return persistent; },
      visit(id) { if (!items.some(item => item.id === id)) return; data.visited = [...data.visited.filter(value => value !== id), id]; save(); },
      favorite(id) {
        if (!items.some(item => item.id === id)) return;
        data.favorites = data.favorites.includes(id) ? data.favorites.filter(value => value !== id) : [...data.favorites, id];
        save();
      },
      step(itemId, stepId) {
        if (!items.find(item => item.id === itemId)?.practiceExperience?.steps?.some(step => step.id === stepId)) return;
        data.progress[itemId] = unique([...(data.progress[itemId] || []), stepId]); save();
      },
      resetSteps(id) { delete data.progress[id]; save(); },
      clear() { data = sanitize({}, items); save(); }
    };
  }

  function related(item, items, limit = 3) {
    const groups = [
      ['tea', candidate => TEA_TYPES.has(item.teaType) && item.teaTypeSourceIds?.length && candidate.teaTypeSourceIds?.length && candidate.teaType === item.teaType],
      ['region', candidate => item.province && candidate.province === item.province],
      ['category', candidate => item.category && candidate.category === item.category]
    ];
    const result = [], seen = new Set([item.id]);
    for (const [reason, match] of groups) {
      for (const candidate of [...items].sort((a, b) => a.id.localeCompare(b.id))) {
        if (result.length >= limit) return result;
        if (!seen.has(candidate.id) && match(candidate)) {
          result.push({ item: candidate, reason }); seen.add(candidate.id);
        }
      }
    }
    return result;
  }

  function compareChange(selected, id, replaceId = null) {
    const ids = unique(array(selected)).slice(0, 2);
    if (ids.includes(id)) return { ids, needsReplacement: false };
    if (ids.length < 2) return { ids: [...ids, id], needsReplacement: false };
    if (ids.includes(replaceId)) return { ids: ids.map(old => old === replaceId ? id : old), needsReplacement: false };
    return { ids, needsReplacement: true };
  }

  function discover(items, visited, random = Math.random) {
    const unseen = items.filter(item => !visited.includes(item.id));
    const candidates = unseen.length ? unseen : items;
    return candidates[Math.min(candidates.length - 1, Math.floor(Math.max(0, random()) * candidates.length))] || null;
  }

  function route(hash, items) {
    try {
      const [rawPath, query = ''] = String(hash || '#home').replace(/^#/, '').split('?');
      const [view, id] = rawPath.split('/').map(decodeURIComponent);
      if (view === 'detail') return items.some(item => item.id === id) ? { view, id } : { view: 'missing' };
      if (view === 'compare') return { view, ids: unique((new URLSearchParams(query).get('items') || '').split(',')).filter(id => items.some(item => item.id === id)).slice(0, 2) };
      if (view === 'province') return { view, province: id === 'all' || items.some(item => item.province === id) ? id : 'all' };
      if (view === 'footprints') return { view };
      if (view === 'map') return { view };
      if (view === 'home' || !view) return { view: 'landing' };
      return { view: 'missing' };
    } catch { return { view: 'missing' }; }
  }

  function safeUrl(value) {
    const url = String(value || '').trim();
    if (/^https?:\/\//i.test(url)) return url;
    if (/^assets\/[a-z0-9_./-]+$/i.test(url) && !url.includes('..')) return url;
    return '';
  }

  const DETAIL_KEY = 'tea-heritage-detail-explore-v1';
  function createDetailStore(items, storage) {
    const revision = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let data = { version: 1, revision: revision(), progress: {} }, persistent = Boolean(storage);
    const valid = new Map(items.filter(x => x.detailExperience).map(x => [x.id, new Set(x.detailExperience.units.map(u => u.id))]));
    try {
      const saved = JSON.parse(storage?.getItem(DETAIL_KEY) || '{}');
      if (typeof saved?.revision === 'string') data.revision = saved.revision;
      for (const [id, units] of valid) {
        const seen = unique(array(saved?.progress?.[id]).filter(u => units.has(u)));
        if (seen.length) data.progress[id] = seen;
      }
    } catch { /* Ignore malformed saved progress, without touching the original journal. */ }
    function save() {
      if (!persistent) return;
      try { storage.setItem(DETAIL_KEY, JSON.stringify(data)); } catch { persistent = false; }
    }
    save();
    return {
      get data() { return data; }, get persistent() { return persistent; },
      view(id, unitId) {
        if (!valid.get(id)?.has(unitId)) return;
        data.progress[id] = unique([...(data.progress[id] || []), unitId]); save();
      },
      reset(id) { delete data.progress[id]; save(); },
      clear() { data = { version: 1, revision: revision(), progress: {} }; save(); }
    };
  }

  function moveUnit(order, id, target) {
    const result = [...order], from = result.indexOf(id);
    if (from < 0 || !Number.isInteger(target) || target < 0 || target >= result.length) return result;
    result.splice(from, 1); result.splice(target, 0, id); return result;
  }

  return { KEY, DETAIL_KEY, TEA_TYPES, sanitize, createStore, createDetailStore, moveUnit, related, compareChange, discover, route, safeUrl };
});
