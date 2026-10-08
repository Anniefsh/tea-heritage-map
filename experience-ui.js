(function () {
  'use strict';
  const core = window.TeaExplore;
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  const journal = core.createStore(DATA.items, storage);
  const detailJournal = core.createDetailStore(DATA.items, storage);
  const $ = id => document.getElementById(id);
  let compared = [], navIndex = 0, navigating = false, pendingReplace = null;
  let currentHash = '', historyAvailable = true, focusReturn = null, noticeTimer;
  const activeSteps = {}, detailStates = {}, localBackStack = [];
  const fallbackSnapshots = new Map();
  const ctx = { journal, detailJournal, detailStates, activeSteps, navigate, redraw, notify, get compared() { return compared; } };
  const render = window.createExperienceRenderers(ctx);
  const { tr, title, asset, icon, button } = render;
  const esc = escapeHtml;

  function hashFor() {
    if (state.view === 'detail') return '#detail/' + encodeURIComponent(state.selectedId);
    if (state.view === 'province') return '#province/' + encodeURIComponent(state.province);
    if (state.view === 'compare') return '#compare?items=' + compared.join(',');
    return '#' + (state.view === 'landing' ? 'home' : state.view);
  }

  function snapshot() {
    return { state: JSON.parse(JSON.stringify(state)), scroll: window.scrollY,
      open: [...document.querySelectorAll('#detailPanel details[open]')].map(node => node.id),
      steps: { ...activeSteps }, detailRevision: detailJournal.data.revision, details: JSON.parse(JSON.stringify(detailStates)) };
  }

  function saveCurrent() {
    if (navigating) return;
    currentHash = hashFor();
    const saved = snapshot();
    fallbackSnapshots.set(currentHash, saved);
    if (!historyAvailable) return;
    try {
      history.replaceState({ teaExplore: true, index: navIndex, snapshot: saved }, '', currentHash);
    } catch { historyAvailable = false; }
  }

  function focusHeading() {
    requestAnimationFrame(() => {
      const shell = state.view === 'detail' ? els.detailShell : ['compare', 'footprints', 'missing'].includes(state.view) ? $('exploreShell') : state.view === 'province' ? els.provinceShell : state.view === 'map' ? els.mapShell : els.landingShell;
      const heading = shell.querySelector('h2, h1');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      const headerBottom = $('siteHeader').getBoundingClientRect().bottom + 18;
      window.scrollTo({ top: Math.max(0, window.scrollY + shell.getBoundingClientRect().top - headerBottom), behavior: 'instant' });
      saveCurrent();
    });
  }

  function navigate(view, options = {}) {
    if (view === 'detail' && !getItemById(options.id)) view = 'missing';
    saveCurrent(); localBackStack.push(snapshot()); navigating = true;
    state.view = view;
    if (view === 'detail') { state.selectedId = options.id; journal.visit(options.id); }
    if (view === 'province') {
      state.province = options.province || 'all';
      if (!options.keepTeaType) state.teaType = 'all';
      if (options.topic) { state.topic = options.topic; state.search = ''; state.mapLegendTeaTypes = []; }
    }
    if (view === 'map') { state.province = 'all'; state.selectedId = null; }
    if (view === 'landing') state.selectedId = null;
    if (view !== 'map') clearMapPreview();
    rerender(); navigating = false; currentHash = hashFor(); navIndex += 1;
    try { history.pushState({ teaExplore: true, index: navIndex, snapshot: snapshot() }, '', currentHash); }
    catch { historyAvailable = false; location.hash = currentHash; }
    focusHeading();
  }

  function restore(saved) {
    navigating = true;
    const language = state.lang;
    Object.assign(state, saved.state);
    state.lang = language;
    for (const id of Object.keys(activeSteps)) delete activeSteps[id];
    for (const id of Object.keys(detailStates)) delete detailStates[id];
    if (saved.detailRevision === detailJournal.data.revision) {
      Object.assign(activeSteps, saved.steps || {});
      Object.assign(detailStates, JSON.parse(JSON.stringify(saved.details || {})));
    }
    if (state.view === 'detail' && getItemById(state.selectedId)) journal.visit(state.selectedId);
    rerender();
    for (const id of saved.open || []) { if ($(id)) $(id).open = true; }
    navigating = false;
    requestAnimationFrame(() => {
      window.scrollTo({ top: saved.scroll || 0, behavior: 'instant' });
      const heading = document.querySelector('.stage-shell:not(.hidden) h2');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      saveCurrent();
    });
  }

  function loadRoute() {
    const route = core.route(location.hash, DATA.items);
    navigating = true; state.view = route.view;
    state.search = ''; state.teaType = 'all'; state.topic = 'all'; state.province = 'all';
    if (route.view === 'detail') { state.selectedId = route.id; journal.visit(route.id); }
    if (route.view === 'province') state.province = route.province;
    if (route.view === 'compare') compared = route.ids;
    rerender(); navigating = false; currentHash = location.hash; saveCurrent();
  }

  function back() {
    if (historyAvailable && navIndex > 0) { history.back(); return; }
    if (localBackStack.length) {
      restore(localBackStack.pop());
      if (!historyAvailable) { currentHash = hashFor(); location.hash = currentHash; }
      return;
    }
    navigate(state.view === 'map' ? 'landing' : 'map');
  }

  function afterRender(mapOnly = false) {
    const extra = ['compare', 'footprints', 'missing'].includes(state.view);
    if (!mapOnly) {
      $('exploreShell').classList.toggle('hidden', !extra);
      if (extra) $('exploreShell').innerHTML = state.view === 'compare' ? render.comparePage() : state.view === 'footprints' ? render.footprintsPage() : `<h2 tabindex="-1">${tr('这个链接暂时找不到项目', 'This link is unavailable')}</h2>${button('map', tr('回到地图', 'Return to map'), '', 'I06')}`;
    }
    const preview = state.view === 'map' && Boolean(state.mapPreviewId) && isProjectBrowseMode();
    if (!preview) els.mapContextPanel.classList.remove('preview-expanded');
    els.mapContextPanel.classList.toggle('has-project-preview', preview);
    if (preview) els.mapContextPanel.querySelector('.map-preview-card')?.insertAdjacentHTML('afterbegin', `<div class="preview-sheet-controls">${button('preview-expand', tr('展开 / 收起', 'Expand / collapse'))}${button('preview-close', tr('关闭预览', 'Close preview'), '', 'I08')}</div>`);
    document.body.classList.toggle('has-project-preview', preview);
    if (state.view === 'map') document.querySelectorAll('.project-marker').forEach(marker => {
      marker.querySelector('.visited-marker')?.remove();
      const viewed = journal.data.visited.includes(marker.dataset.id);
      marker.classList.toggle('is-viewed', viewed);
      if (viewed) marker.insertAdjacentHTML('beforeend', `<g class="visited-marker" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="#fbf5e6"/><image href="${asset('I03')}" x="6" y="6" width="12" height="12"/></g>`);
      marker.setAttribute('aria-label', title(getItemById(marker.dataset.id)) + (viewed ? tr('，已浏览', ', viewed') : ''));
    });
    if (mapOnly) { saveCurrent(); return; }
    const tray = $('compareTray');
    tray.setAttribute('aria-label', tr('项目对照栏', 'Project comparison tray'));
    tray.classList.toggle('hidden', !compared.length || state.view === 'compare');
    document.body.classList.toggle('has-compare-tray', compared.length > 0 && state.view !== 'compare');
    tray.innerHTML = `<strong>${tr('项目对照', 'Compare')} ${compared.length}/2</strong><div class="compare-slots">${compared.map(id => `<div><span>${esc(title(getItemById(id)))}</span>${button('compare-remove', tr('移除', 'Remove'), id, 'I08')}</div>`).join('')}</div><div class="item-actions">${button('compare', tr('打开对照', 'Open comparison'), '', 'I02', compared.length < 2 ? 'disabled' : '')}${button('compare-clear', tr('清空', 'Clear'))}</div>`;
    $('discoveryEntry').innerHTML = `<img class="discovery-illustration" src="${asset('A01')}" alt="${tr('茶叶与茶盅手绘装饰', 'Hand-drawn tea leaves and cups')}" width="1672" height="941"><div class="discovery-copy"><p class="section-index">${tr('让好奇带路', 'FOLLOW YOUR CURIOSITY')}</p><h2>${tr('不必从第一项读起', 'Start anywhere')}</h2><div class="discovery-actions">${button('discover', tr('随意发现', 'Surprise me'))}${button('craft', tr('看制茶手艺', 'Explore crafts'))}${button('ritual', tr('看饮茶礼俗', 'Explore tea rituals'))}</div><small>${tr('优先带你发现尚未浏览的项目', 'Discover unseen projects first')}</small></div>`;
    $('footprintsButton').innerHTML = `${icon('I04')}<span>${tr('我的足迹', 'My discoveries')}</span>`;
    if (state.view !== 'landing') { els.globalBackButton.textContent = tr('返回上一页', 'Go back'); els.globalBackButton.classList.remove('is-hidden'); }
    if (extra) {
      const label = state.view === 'compare' ? tr('项目对照', 'Comparison') : state.view === 'footprints' ? tr('我的足迹', 'My discoveries') : tr('链接不可用', 'Unavailable link');
      els.breadcrumb.innerHTML = `<button type="button" class="crumb-link" data-explore-action="map">${tr('地图', 'Map')}</button><span class="crumb-separator">/</span><span>${label}</span>`;
      document.title = `${label} | ${currentText().documentTitle}`;
    }
    if (state.view === 'province') {
      const note = state.topic === 'ritual' ? tr('饮茶礼俗', 'Tea rituals') : state.topic === 'craft' ? tr('制茶与饮食技艺', 'Tea and culinary crafts') : '';
      if (state.province === 'all') {
        els.provinceTitle.textContent = note || tr('全部项目', 'All projects');
        els.provinceSummary.textContent = tr('从感兴趣的项目开始，可收藏或加入两项对照。', 'Choose a project to read, save or compare.');
        els.provinceMeta.innerHTML = `<span class="meta-pill">${filteredItems().length} / 46 ${tr('项', 'projects')}</span>`;
      }
      if (note) els.provinceSummary.textContent = `${note} · ${filteredItems().length}${tr('项', ' projects')}`;
      els.provinceMeta.insertAdjacentHTML('beforeend', button('clear-filters', tr('清除筛选', 'Clear filters')));
    }
    measureTray();
    if (!navigating) saveCurrent();
    if (!journal.persistent || !detailJournal.persistent) $('exploreNotice').textContent = tr('记录仅本次有效：浏览器未允许保存。', 'Session only: your browser did not allow saving.');
  }

  function measureTray() {
    const height = $('compareTray').classList.contains('hidden') ? 0 : $('compareTray').getBoundingClientRect().height + 16;
    document.documentElement.style.setProperty('--compare-tray-height', `${height}px`);
  }

  function notify(message) {
    clearTimeout(noticeTimer); $('exploreNotice').textContent = message;
    noticeTimer = setTimeout(() => { $('exploreNotice').textContent = journal.persistent && detailJournal.persistent ? '' : tr('记录仅本次有效：浏览器未允许保存。', 'Session only: storage unavailable.'); }, 4000);
  }

  function redraw(trigger) {
    const open = [...document.querySelectorAll('#detailPanel details[open]')].map(node => node.id);
    const y = window.scrollY, action = trigger?.dataset.exploreAction, item = trigger?.dataset.item, step = trigger?.dataset.step;
    rerender();
    for (const id of open) { if ($(id)) $(id).open = true; }
    const identity = ['unit', 'choice', 'offset'];
    const replacement = [...document.querySelectorAll('[data-explore-action]')].find(node => node.dataset.exploreAction === action && node.dataset.item === item && node.dataset.step === step && identity.every(key => node.dataset[key] === trigger?.dataset[key]) && !node.disabled && node.getClientRects().length)
      || [...document.querySelectorAll('[data-explore-action="dx-view"]')].find(node => node.dataset.item === item && node.dataset.unit === trigger?.dataset.unit);
    const fallback = document.querySelector('.stage-shell:not(.hidden) h2, #landingTitle');
    if (replacement) replacement.focus({ preventScroll: true });
    else if (fallback) { fallback.setAttribute('tabindex', '-1'); fallback.focus({ preventScroll: true }); }
    window.scrollTo({ top: y, behavior: 'instant' }); saveCurrent();
  }

  function closeDialog() { $('replaceDialog').close(); pendingReplace = null; focusReturn?.focus({ preventScroll: true }); }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-explore-action]');
    if (!trigger) return;
    const action = trigger.dataset.exploreAction, id = trigger.dataset.item;
    if (render.handleDetailAction(trigger)) return;
    if (action === 'detail') return navigate('detail', { id });
    if (action === 'map') return navigate('map');
    if (action === 'footprints') return navigate('footprints');
    if (action === 'compare') return navigate('compare');
    if (action === 'craft' || action === 'ritual') return navigate('province', { province: 'all', topic: action });
    if (action === 'browse-all') return navigate('province', { province: 'all', topic: 'all' });
    if (action === 'discover') { const item = core.discover(DATA.items, journal.data.visited); if (item) navigate('detail', { id: item.id }); return; }
    if (action === 'clear-filters') { state.search = ''; state.teaType = 'all'; state.topic = 'all'; state.mapLegendTeaTypes = []; redraw(trigger); return; }
    if (action === 'favorite') { journal.favorite(id); redraw(trigger); notify(journal.data.favorites.includes(id) ? tr('已加入收藏', 'Saved') : tr('已取消收藏', 'Removed from saved projects')); return; }
    if (action === 'compare-add' && getItemById(id)) {
      if (compared.includes(id)) { notify(tr('该项目已在对照栏中', 'Already selected')); return; }
      const next = core.compareChange(compared, id);
      if (next.needsReplacement) {
        pendingReplace = id; focusReturn = trigger;
        $('replaceDialog').innerHTML = `<h2 id="replaceDialogTitle">${tr('对照栏已满，替换哪一项？', 'Replace which project?')}</h2><p>${esc(title(getItemById(id)))}</p>${compared.map(old => button('replace-confirm', title(getItemById(old)), old)).join('')}${button('dialog-close', tr('取消', 'Cancel'), '', 'I08')}`;
        $('replaceDialog').showModal();
      } else { compared = next.ids; redraw(trigger); notify(tr('已加入对照栏', 'Added to comparison')); }
      return;
    }
    if (action === 'replace-confirm' && pendingReplace) { compared = core.compareChange(compared, pendingReplace, id).ids; closeDialog(); redraw(); return; }
    if (action === 'dialog-close') return closeDialog();
    if (action === 'compare-remove') { compared = compared.filter(value => value !== id); redraw(trigger); return; }
    if (action === 'compare-clear') { compared = []; redraw(trigger); return; }
    if (action === 'step') {
      const item = getItemById(id), steps = item?.practiceExperience?.steps || [], index = Number(trigger.dataset.step);
      if (!Number.isInteger(index) || !steps[index]) return;
      if (trigger.dataset.completeCurrent) journal.step(id, steps[activeSteps[id] || 0].id);
      activeSteps[id] = index; journal.step(id, steps[index].id); redraw(trigger); return;
    }
    if (action === 'replay') { activeSteps[id] = 0; journal.resetSteps(id); redraw(trigger); return; }
    if (action === 'preview-close') { const old = state.mapPreviewId; clearMapPreview(); rerender(); document.querySelector(`.project-marker[data-id="${old}"]`)?.focus({ preventScroll: true }); return; }
    if (action === 'preview-expand') { els.mapContextPanel.classList.toggle('preview-expanded'); return; }
    if (action === 'clear-journal') {
      focusReturn = trigger;
      $('replaceDialog').innerHTML = `<h2 id="replaceDialogTitle">${tr('清除收藏、浏览和探索进度？', 'Clear saved projects, history and progress?')}</h2><p>${tr('此操作仅影响本浏览器，不能撤销。', 'Only this browser is affected. This cannot be undone.')}</p>${button('clear-confirm', tr('确认清除', 'Clear records'))}${button('dialog-close', tr('取消', 'Cancel'))}`;
      $('replaceDialog').showModal(); return;
    }
    if (action === 'clear-confirm') {
      journal.clear(); detailJournal.clear();
      for (const key of Object.keys(detailStates)) delete detailStates[key];
      for (const key of Object.keys(activeSteps)) delete activeSteps[key];
      // Discard in-memory snapshots too, so the app back button cannot revive cleared state.
      localBackStack.length = 0; fallbackSnapshots.clear();
      closeDialog(); redraw();
    }
  });


  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.mapPreviewId && !$('replaceDialog').open) {
      const old = state.mapPreviewId; clearMapPreview(); rerender();
      document.querySelector(`.project-marker[data-id="${old}"]`)?.focus({ preventScroll: true }); return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-marker[role="button"]')) {
      event.preventDefault(); event.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  document.addEventListener('error', event => {
    const img = event.target;
    if (img.tagName !== 'IMG') return;
    img.hidden = true;
    if (img.closest('.practice-figure, .detail-experience-figure') && !img.parentElement.querySelector('.image-fallback')) {
      img.insertAdjacentHTML('afterend', `<p class="image-fallback">${tr('插画暂不可用，请使用文字按钮继续探索。', 'Illustration unavailable. Use the text controls to continue.')}</p>`);
      img.parentElement.querySelectorAll('.dx-hotspot').forEach(pin => { pin.hidden = true; });
    }
  }, true);
  $('replaceDialog').addEventListener('cancel', () => { pendingReplace = null; focusReturn?.focus({ preventScroll: true }); });
  window.addEventListener('popstate', event => {
    if (event.state?.teaExplore && event.state.snapshot) {
      navIndex = event.state.index || 0;
      if (event.state.snapshot.state.view === 'compare') compared = core.route(location.hash, DATA.items).ids || [];
      currentHash = location.hash; restore(event.state.snapshot);
    } else {
      navIndex = 0;
      const saved = !historyAvailable && fallbackSnapshots.get(location.hash);
      if (saved) { currentHash = location.hash; restore(saved); }
      else loadRoute();
    }
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === currentHash) return;
    navIndex = 0;
    const saved = !historyAvailable && fallbackSnapshots.get(location.hash);
    if (saved) { currentHash = location.hash; restore(saved); }
    else { loadRoute(); focusHeading(); }
  });
  let scrollTimer;
  window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(saveCurrent, 120); }, { passive: true });
  window.addEventListener('pagehide', saveCurrent);
  window.addEventListener('resize', measureTray);

  window.TeaExperience = { ...render, afterRender, navigate, back, journal, detailJournal,
    focusPreview() { els.mapContextPanel.querySelector('.preview-sheet-controls button')?.focus({ preventScroll: true }); }
  };
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (history.state?.teaExplore && history.state.snapshot && location.hash) {
    navIndex = history.state.index || 0; compared = core.route(location.hash, DATA.items).ids || []; restore(history.state.snapshot);
  } else loadRoute();
})();
