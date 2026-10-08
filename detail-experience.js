window.createDetailExperiences = function (ctx, helpers) {
  'use strict';
  const { tr, asset, button, sourcePills } = helpers;
  const esc = escapeHtml;
  const lookup = id => DATA.items.find(item => item.id === id);
  const memory = item => {
    const e = item.detailExperience, valid = new Set(e.units.map(u => u.id));
    const m = ctx.detailStates[item.id] ||= { open: [], choice: '', order: [...(e.initialOrder || [])], answer: false, checked: false };
    // History can contain an empty selection from an older release.
    if (!valid.has(m.selected)) m.selected = e.units[0].id;
    m.open = (m.open || []).filter(id => valid.has(id));
    return m;
  };
  const label = unit => tr(unit.titleZh, unit.titleEn);
  const unitButton = (item, unit, action = 'dx-view', extra = '') => button(action, label(unit), item.id, '', `data-unit="${esc(unit.id)}" ${extra}`);
  const unitCopy = (item, unit) => `<div class="dx-unit-copy"><h4>${esc(label(unit))}</h4><p>${esc(tr(unit.contentZh, unit.contentEn))}</p>${sourcePills(item, unit.sourceIds)}</div>`;
  const sectionNames = { practice: ['工艺与礼俗', 'PRACTICE'], cultural_value: ['文化与地域', 'CULTURE & REGION'], inheritance: ['传承保护', 'TRANSMISSION'] };

  function figure(assetId, alt, overlay = '') {
    const url = asset(assetId);
    return `<figure class="detail-experience-figure"><div class="dx-image-stage">${url ? `<img src="${esc(url)}" width="1448" height="1086" alt="${esc(alt)}" loading="lazy">` : `<p class="image-fallback">${tr('插画暂不可用，下方文字功能仍可使用。', 'Illustration unavailable; use the text controls below.')}</p>`}${url ? overlay : ''}</div><figcaption>${tr('AI辅助示意，非现场照片', 'AI-assisted illustration, not a documentary photograph')}</figcaption></figure>`;
  }

  function conflicts(item) {
    return (item.contentConflicts || []).map(c => `<aside class="dx-source-note"><strong>${tr('先留意这处来源差异', 'A source discrepancy')}</strong><p>${esc(tr(c.textZh, c.textEn))}</p>${sourcePills(item, c.sourceIds)}</aside>`).join('');
  }

  function hotspots(item, e, m) {
    const chosen = e.units.find(u => u.id === m.selected);
    const pins = e.units.map((u, i) => `<button type="button" class="dx-hotspot ${m.selected === u.id ? 'is-active' : ''}" style="--x:${Number(u.x)}%;--y:${Number(u.y)}%" data-explore-action="dx-view" data-item="${item.id}" data-unit="${u.id}" aria-label="${esc(label(u))}" aria-pressed="${m.selected === u.id}" aria-controls="dxContent">${i + 1}<span>${esc(label(u))}</span></button>`).join('');
    return `<div class="dx-two-column">${figure(e.assetId, tr('潮州茶席四种器具：左上泥炉、右上砂铫、左下茶壶、右下茶杯；非标准摆位', 'Four Chaozhou tea utensils: clay stove at upper left, pottery kettle at upper right, teapot at lower left, and cups at lower right; illustrative arrangement'), pins)}<div><div class="dx-text-controls">${e.units.map(u => unitButton(item, u, 'dx-view', `aria-pressed="${m.selected === u.id}" aria-controls="dxContent"`)).join('')}</div><div id="dxContent" class="dx-content" aria-live="polite">${chosen ? unitCopy(item, chosen) : `<p>${tr('先选一件器具，看看它在茶事中做什么。', 'Choose a utensil to discover its role.')}</p>`}</div></div></div>`;
  }

  function quiz(item, e, m) {
    const question = tr(e.questionZh, e.questionEn);
    const feedback = m.choice === e.correctOption ? tr(e.correctMessageZh, e.correctMessageEn) : tr(e.wrongMessageZh, e.wrongMessageEn);
    return `<div class="${e.assetId ? 'dx-two-column' : 'dx-without-art'}">${e.assetId ? figure(e.assetId, tr(e.imageAltZh || '安吉白茶浅色鲜叶与绿色叶脉概念示意，非鉴定标准', e.imageAltEn || 'Illustration of pale Anji tea leaves and green veins, not an identification guide')) : ''}<div><p class="dx-prompt">${esc(question)}</p><div class="dx-text-controls">${e.options.map(o => button('dx-guess', label(o), item.id, '', `data-choice="${o.id}" aria-pressed="${m.choice === o.id}"`)).join('')}${button('dx-all', tr('直接看解释', 'Show explanations'), item.id)}</div>${m.choice ? `<p class="dx-feedback" role="status">${esc(feedback)}</p>` : ''}</div></div><div class="dx-card-grid">${e.units.map((u, i) => {
      const open = m.open.includes(u.id);
      return `<article class="dx-flip-card ${open ? 'is-open' : ''}"><span class="section-index">0${i + 1}</span>${unitButton(item, u, 'dx-toggle', `aria-expanded="${open}" aria-controls="dx-${u.id}"`)}<div id="dx-${u.id}" ${open ? '' : 'hidden'}><p>${esc(tr(u.contentZh, u.contentEn))}</p>${sourcePills(item, u.sourceIds)}</div>${!open ? `<small>${tr('点开看看', 'Reveal this card')}</small>` : ''}</article>`;
    }).join('')}</div>`;
  }

  function regions(item, e, m) {
    return `${conflicts(item)}<div class="dx-region-web">${figure(e.assetId, '富春地域关联图中央的通用茶盏概念示意')}${e.units.map((u, i) => {
      const open = m.open.includes(u.id);
      return `<article class="dx-region-card dx-region-${i}"><span class="section-index">0${i + 1}</span>${unitButton(item, u, 'dx-toggle', `aria-expanded="${open}" aria-controls="dx-${u.id}"`)}<div id="dx-${u.id}" ${open ? '' : 'hidden'}><p>${esc(tr(u.contentZh, u.contentEn))}</p>${sourcePills(item, u.sourceIds)}${button('dx-province', tr(`看看${u.province}的项目`, `Explore ${u.titleEn.split(' · ')[0]}`), item.id, '', `data-unit="${u.id}"`)}</div></article>`;
    }).join('')}<div class="dx-region-connector" aria-hidden="true"></div></div>${button('dx-all', tr('展开完整关联图', 'Reveal all connections'), item.id)}`;
  }

  function lineage(item, e, m) {
    const visible = new Set([e.units[0].id, ...m.open]);
    return `<div class="dx-lineage">${e.units.filter(u => visible.has(u.id)).map(u => {
      const incoming = e.edges.find(edge => edge.toId === u.id);
      const outgoing = e.edges.find(edge => edge.fromId === u.id);
      const next = e.units.find(x => x.id === outgoing?.toId);
      return `${incoming ? `<div class="dx-lineage-link"><span>${tr('传授', 'Taught')}</span>${sourcePills(item, incoming.sourceIds)}</div>` : ''}<article class="dx-lineage-node">${unitButton(item, u, 'dx-view', `aria-pressed="${m.selected === u.id}"`)}${m.selected === u.id || m.open.includes(u.id) ? unitCopy(item, u) : ''}${next && !visible.has(next.id) ? unitButton(item, next, 'dx-expand', `aria-label="${esc(tr('展开传承关系：', 'Expand connection: ') + label(next))}"`) : ''}</article>`;
    }).join('')}</div><div class="dx-text-controls">${button('dx-all', tr('直接展开全部', 'Reveal all connections'), item.id)}</div>`;
  }

  function sequence(item, e, m) {
    const selected = e.units.find(u => u.id === m.selected);
    const order = m.order.length === e.sequenceIds.length ? m.order : e.initialOrder;
    const correct = order.every((id, i) => id === e.sequenceIds[i]);
    return `<div class="dx-text-controls">${e.stageIds.map(id => unitButton(item, e.units.find(u => u.id === id), 'dx-view', `aria-pressed="${m.selected === id}"`)).join('')}</div><div class="dx-two-column"><div class="dx-content" aria-live="polite">${selected ? unitCopy(item, selected) : `<p>${tr('选择一个阶段或工序，先看看说明。', 'Choose a stage or operation to read about it.')}</p>`}${selected?.assetId ? figure(selected.assetId, label(selected) + tr('概念示意', ': conceptual illustration')) : ''}</div><div><h4>${tr('这四步，先后怎么排？', 'How do these four operations connect?')}</h4><p class="practice-note">${tr('电脑可拖动；也可用上移、下移按钮。这里只排四个连续环节。', 'Drag on desktop or use Move up / Move down. These are only four consecutive operations.')}</p><ol class="dx-sort-list">${order.map((id, i) => {
      const u = e.units.find(x => x.id === id);
      const right = id === e.sequenceIds[i];
      return `<li class="${m.checked ? (right ? 'dx-position-correct' : 'dx-position-wrong') : ''}" data-sort-item="${item.id}" data-sort-unit="${id}"><span class="dx-order-number">${i + 1}</span>${unitButton(item, u)}<button type="button" class="dx-sort-handle" data-sort-handle data-explore-action="dx-grab" data-item="${item.id}" data-unit="${id}" aria-label="${esc(tr('拖动 ', 'Move ') + label(u))}" aria-describedby="dxSortHelp">${tr('拖动', 'Drag')}</button><div class="dx-sort-controls">${button('dx-move', tr('上移', 'Move up'), item.id, '', `data-unit="${id}" data-offset="-1" aria-label="${esc(tr('上移 ', 'Move up ') + label(u))}" ${i === 0 ? 'disabled' : ''}`)}${button('dx-move', tr('下移', 'Move down'), item.id, '', `data-unit="${id}" data-offset="1" aria-label="${esc(tr('下移 ', 'Move down ') + label(u))}" ${i === order.length - 1 ? 'disabled' : ''}`)}</div>${m.checked ? `<span class="dx-position-status">${right ? tr('位置正确', 'Correct position') : tr('此位置需调整', 'Adjust this position')}</span>` : ''}</li>`;
    }).join('')}</ol><p class="practice-note" id="dxSortHelp">${tr('按住“拖动”手柄移动，蓝绿色插入线表示落点；Esc取消。手柄获得焦点后可用上下方向键，也可直接点击上移、下移。', 'Drag the handle to the insertion line; Escape cancels. Use arrow keys on the handle, or Move up / Move down.')}</p><div class="dx-text-controls dx-sort-actions">${button('dx-check', tr('检查顺序', 'Check order'), item.id)}${button('dx-answer', tr('查看正确顺序与解释', 'Show order and explanations'), item.id)}${button('dx-retry', tr('重新尝试', 'Try again'), item.id)}</div>${m.checked ? `<p class="dx-feedback" role="status">${correct ? tr('顺序正确，排对了！这几个环节就是这样衔接的。', 'You got it! These four operations follow in this order.') : tr('还需要调整：还有几张卡片没找到位置，换一换再看看。', 'Not quite yet. Try moving the highlighted cards, or take a look at the explanation.')}</p>` : m.dirty ? `<p class="dx-feedback" role="status">${tr('顺序已改变，请重新检查。', 'Order changed. Check again.')}</p>` : ''}</div></div>${m.answer ? `<div class="dx-answer"><h4>${tr('项目介绍中的这段顺序', 'How these operations connect')}</h4><p>${e.sequenceIds.map(id => esc(label(e.units.find(u => u.id === id)))).join(' → ')}</p><div class="dx-card-grid">${e.sequenceIds.map(id => unitCopy(item, e.units.find(u => u.id === id))).join('')}</div><p>${esc(tr(e.sequenceContextZh || '前面还有筛分、拼配、软化，后面还有冷却、干燥。', e.sequenceContextEn || 'Screening, blending and softening precede these; cooling and drying follow.'))}</p></div>` : ''}`;
  }

  function guide(item, e, m) {
    const selected = e.units.find(u => u.id === m.selected);
    return `${e.assetId ? figure(e.assetId, e.imageAltZh || '茶文化概念示意') : ''}<div class="dx-guide-stages" role="group" aria-label="${tr('选择阶段或技法', 'Choose a stage or technique')}">${e.units.map((u, i) => `<article><span class="section-index">${e.ordered ? String(i + 1).padStart(2, '0') : tr('技法', 'METHOD')}</span>${unitButton(item, u, 'dx-view', `aria-pressed="${m.selected === u.id}" aria-controls="dxGuideContent"`)}</article>`).join('')}</div><div id="dxGuideContent" class="dx-content" aria-live="polite">${selected ? unitCopy(item, selected) : `<p>${tr('任选一张卡片，看看它在这项技艺中承担什么作用。', 'Choose any card to discover its role in this craft.')}</p>`}</div>${button('dx-all', tr('展开全部说明', 'Show all explanations'), item.id)}${m.open.length === e.units.length ? `<div class="dx-card-grid">${e.units.map(u => unitCopy(item, u)).join('')}</div>` : ''}`;
  }
  function match(item, e, m) {
    m.matches ||= {};
    return `<p>${tr('这些动作名称挺有画面感，试着找找它们对应的工序。', 'Match each action with its process.')}</p><div class="dx-match-grid">${e.units.map(u => `<article class="dx-match-row"><h4>${esc(label(u))}</h4><div class="dx-text-controls" role="group" aria-label="${esc(label(u))}">${[...e.matchOptions].reverse().map(o => button('dx-match', label(o), item.id, '', `data-unit="${u.id}" data-choice="${o.id}" aria-pressed="${m.matches[u.id] === o.id}"`)).join('')}</div>${m.checked ? `<p class="dx-feedback" role="status">${m.matches[u.id] === u.matchId ? tr('配对了！', 'That matches!') : tr('这一对再想想。', 'Take another look at this pair.')}</p>` : ''}${m.open.includes(u.id) ? unitCopy(item,u) : ''}</article>`).join('')}</div><div class="dx-text-controls">${button('dx-match-check',tr('检查配对','Check matches'),item.id)}${button('dx-all',tr('看看完整解释','Show explanations'),item.id)}</div>`;
  }
  function cycle(item, e, m) {
    return guide(item,e,m)+`<div class="dx-text-controls">${button('dx-next',tr('看下一个／回到起点','Next / return to start'),item.id)}</div>`;
  }
  const types = { hotspots, 'quiz-cards': quiz, 'region-links': regions, lineage, sequence, guide, match, cycle };
  function render(item) {
    const e = item.detailExperience;
    if (!e?.units?.length || !types[e.type] || e.contentReview?.status !== 'reviewed') return '';
    const m = memory(item), count = (ctx.detailJournal.data.progress[item.id] || []).length;
    const group = sectionNames[e.sectionKey] || ['互动探索', 'EXPLORE'];
    return `<section class="detail-experience dx-${e.type}" id="detailExperience" aria-labelledby="dxTitle"><div class="explore-section-heading"><div><p class="section-index">${tr(...group)}</p><h3 id="dxTitle">${esc(tr(e.titleZh, e.titleEn))}</h3></div><span class="practice-count">${tr('已查看', 'Viewed')} ${count}/${e.units.length}</span></div><p class="practice-note">${esc(tr(e.noteZh, e.noteEn))}</p>${types[e.type](item, e, m)}<div class="dx-footer">${sourcePills(item, e.sourceIds)}${button('dx-reset', tr('重新探索', 'Explore again'), item.id, 'I05')}${button('dx-skip', tr('跳过，继续阅读', 'Skip and keep reading'), item.id)}</div>${count === e.units.length ? `<p class="dx-complete" role="status">${tr('这一段已经看完了，带着新发现继续逛逛吧。', 'A new discovery to take with you. Keep exploring!')}</p>` : ''}</section>`;
  }

  function handle(trigger) {
    const action = trigger.dataset.exploreAction;
    if (!action?.startsWith('dx-')) return false;
    const item = lookup(trigger.dataset.item), e = item?.detailExperience;
    if (!e) return true;
    const m = memory(item), u = e.units.find(x => x.id === trigger.dataset.unit);
    if (action === 'dx-grab') return true;
    const view = id => ctx.detailJournal.view(item.id, id);
    if (action === 'dx-skip') {
      const next = document.querySelector('.explore-reading h3, .related-section h3, .registration-section h3');
      if (next) { next.tabIndex = -1; next.focus({ preventScroll: true }); next.scrollIntoView({ block: 'start', behavior: 'instant' }); }
      return true;
    }
    if (action === 'dx-province' && u?.province) { ctx.navigate('province', { province: u.province, topic: 'all' }); return true; }
    if (action === 'dx-reset') { delete ctx.detailStates[item.id]; ctx.detailJournal.reset(item.id); }
    else if (action === 'dx-view' && u) { m.selected = u.id; view(u.id); }
    else if (action === 'dx-next' && e.type === 'cycle') { m.selected = e.units[(e.units.findIndex(x=>x.id===m.selected)+1)%e.units.length].id; view(m.selected); }
    else if (action === 'dx-match' && u && e.matchOptions?.some(o=>o.id===trigger.dataset.choice)) { m.matches ||= {}; m.matches[u.id]=trigger.dataset.choice; m.checked=false; }
    else if (action === 'dx-match-check' && e.type === 'match') { m.checked=true; m.open=e.units.map(u=>u.id); e.units.forEach(u=>view(u.id)); }
    else if (action === 'dx-toggle' && u) {
      if (m.open.includes(u.id)) m.open = m.open.filter(id => id !== u.id);
      else { m.open.push(u.id); view(u.id); }
    } else if (action === 'dx-expand' && u) {
      const incoming = e.edges.find(edge => edge.toId === u.id);
      if (incoming && (incoming.fromId === e.units[0].id || m.open.includes(incoming.fromId))) {
        m.open = [...new Set([...m.open, u.id])]; m.selected = u.id; view(u.id);
      }
    } else if (action === 'dx-all') {
      m.open = e.units.map(u => u.id); e.units.forEach(u => view(u.id));
    } else if (action === 'dx-guess' && e.options?.some(o => o.id === trigger.dataset.choice)) {
      const answer = e.answerUnitId || 'category';
      m.choice = trigger.dataset.choice; m.open = [...new Set([...m.open, answer])]; view(answer);
    } else if (action === 'dx-move' && u) {
      m.order = TeaExplore.moveUnit(m.order, u.id, m.order.indexOf(u.id) + Number(trigger.dataset.offset)); m.checked = false; m.dirty = true;
    } else if (action === 'dx-check') m.checked = true;
    else if (action === 'dx-retry') { m.order = [...e.initialOrder]; m.checked = false; m.dirty = false; m.answer = false; }
    else if (action === 'dx-answer') { m.answer = true; e.sequenceIds.forEach(view); }
    ctx.redraw(trigger);
    if (action === 'dx-move') ctx.notify(tr('已移动卡片，可继续调整或查看顺序。', 'Card moved. Adjust it or reveal the sequence.'));
    return true;
  }

  window.createTeaSortPointer((itemId, unitId, target) => {
    const item = lookup(itemId);
    if (!item?.detailExperience?.sequenceIds || state.selectedId !== itemId || state.view !== 'detail') return;
    const m = memory(item);
    if (target < 0 || target >= m.order.length || target === m.order.indexOf(unitId)) return;
    m.order = TeaExplore.moveUnit(m.order, unitId, target); m.checked = false; m.dirty = true;
    const trigger = [...document.querySelectorAll('[data-sort-handle]')].find(x => x.dataset.unit === unitId);
    ctx.redraw(trigger); ctx.notify(tr('已移动卡片，顺序已改变，请重新检查。', 'Card moved. Check the new order.'));
  }, event => ctx.notify(event === 'start' ? tr('正在移动，插入线表示落点；Esc取消。', 'Moving. The line marks the drop position; Escape cancels.') : tr('已取消移动，顺序未改变。', 'Move cancelled; order unchanged.')));
  return { render, handle, conflicts };
};
