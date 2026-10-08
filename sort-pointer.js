window.createTeaSortPointer = function (commit, announce) {
  'use strict';
  let active = null, frame = 0;
  function clearMarks() {
    document.querySelectorAll('.dx-drop-before, .dx-drop-after').forEach(x => x.classList.remove('dx-drop-before', 'dx-drop-after'));
  }
  function locate() {
    if (!active?.started) return;
    const others = [...active.list.querySelectorAll('[data-sort-unit]')].filter(x => x !== active.row);
    const next = others.find(row => active.y < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2);
    active.target = next ? others.indexOf(next) : others.length;
    clearMarks();
    if (next) next.classList.add('dx-drop-before');
    else others.at(-1)?.classList.add('dx-drop-after');
    active.ghost.style.left = `${active.x - active.offsetX}px`;
    active.ghost.style.top = `${active.y - active.offsetY}px`;
    const bounds = active.list.getBoundingClientRect();
    if (active.x < bounds.left - 30 || active.x > bounds.right + 30) { active.target = null; clearMarks(); }
  }
  function tick() {
    if (!active?.started) return;
    if (!active.row.isConnected) { finish(false); return; }
    const delta = active.y < 65 ? -10 : active.y > innerHeight - 65 ? 10 : 0;
    if (delta) window.scrollBy(0, delta);
    locate(); frame = requestAnimationFrame(tick);
  }
  function finish(apply) {
    if (!active) return;
    const a = active; active = null;
    cancelAnimationFrame(frame); clearMarks();
    a.ghost?.remove(); a.row.classList.remove('dx-drag-source');
    document.body.classList.remove('dx-is-dragging');
    if (a.handle.hasPointerCapture?.(a.pointerId)) a.handle.releasePointerCapture(a.pointerId);
    if (apply && a.started && Number.isInteger(a.target)) commit(a.item, a.unit, a.target);
    else if (a.started) announce('cancel');
  }
  function pointer(event) {
    if (event.type === 'pointerdown') {
      const handle = event.target.closest?.('[data-sort-handle]');
      if (!handle || event.button !== 0 || event.isPrimary === false || active) return;
      const row = handle.closest('[data-sort-unit]'), list = row?.parentElement;
      if (!row || !list) return;
      const rect = row.getBoundingClientRect();
      active = { handle, row, list, item: row.dataset.sortItem, unit: row.dataset.sortUnit,
        pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY,
        offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, target: [...list.children].indexOf(row), started: false };
      handle.focus({ preventScroll: true });
      try { handle.setPointerCapture(event.pointerId); } catch { /* Document listeners remain a fallback. */ }
      event.preventDefault();
      return;
    }
    if (!active || event.pointerId !== active.pointerId) return;
    if (event.type === 'pointercancel' || event.type === 'lostpointercapture') { finish(false); return; }
    if (event.type === 'pointerup') { finish(true); return; }
    if (event.type !== 'pointermove') return;
    active.x = event.clientX; active.y = event.clientY;
    if (!active.started && Math.hypot(active.x - active.startX, active.y - active.startY) >= 6) {
      active.started = true;
      const rect = active.row.getBoundingClientRect(), ghost = document.createElement('div');
      ghost.className = 'dx-drag-ghost'; ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = active.row.querySelector('[data-explore-action="dx-view"]')?.textContent || '';
      ghost.style.width = `${rect.width}px`; ghost.style.minHeight = `${rect.height}px`;
      document.body.append(ghost); active.ghost = ghost;
      active.row.classList.add('dx-drag-source'); document.body.classList.add('dx-is-dragging');
      announce('start'); tick();
    }
    if (active.started) { event.preventDefault(); locate(); }
  }
  function key(event) {
    if (event.key === 'Escape' && active) { event.preventDefault(); finish(false); return; }
    const handle = event.target.closest?.('[data-sort-handle]');
    if (!handle || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const row = handle.closest('[data-sort-unit]'), index = [...row.parentElement.children].indexOf(row);
    commit(row.dataset.sortItem, row.dataset.sortUnit, index + (event.key === 'ArrowUp' ? -1 : 1));
  }
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture']) document.addEventListener(type, pointer, { passive: false });
  document.addEventListener('keydown', key);
  window.addEventListener('blur', () => finish(false));
  window.addEventListener('hashchange', () => finish(false));
  return { cancel: () => finish(false) };
};
