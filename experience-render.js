window.createExperienceRenderers = function (ctx) {
  'use strict';
  const esc = escapeHtml;
  const tr = (zh, en) => state.lang === 'zh' ? zh : en;
  const title = item => tr(item.name, item.nameEn || item.name);
  const asset = id => {
    const a = window.TEA_EXPLORE_ASSETS?.items?.[id];
    return a?.approved ? window.TeaExplore.safeUrl(a.path) : '';
  };
  const icon = id => asset(id) ? `<img class="explore-icon" src="${asset(id)}" width="18" height="18" alt="" aria-hidden="true">` : '';
  const button = (action, label, id = '', iconId = '', extra = '') => `<button type="button" class="explore-button" data-explore-action="${action}" data-item="${esc(id)}" ${extra}>${icon(iconId)}<span>${esc(label)}</span></button>`;

  function actions(item) {
    const saved = ctx.journal.data.favorites.includes(item.id);
    const compared = ctx.compared.includes(item.id);
    return `<div class="item-actions">${button('favorite', saved ? tr('已收藏', 'Saved') : tr('收藏', 'Save'), item.id, 'I01', `aria-pressed="${saved}"`)}${button('compare-add', compared ? tr('已加入对照', 'In comparison') : tr('加入对照', 'Compare'), item.id, 'I02', `aria-pressed="${compared}"`)}</div>`;
  }

  function sourcePills(item, ids) {
    // Keep the component contract without duplicating the project's footer source.
    return '';
  }

  const detailExperiences = window.createDetailExperiences(ctx, { tr, asset, button, sourcePills });

  function references(item) {
    const usable = (item.references || []).filter(r => r.available !== false && /^https?:\/\//i.test(window.TeaExplore.safeUrl(r.url)));
    const primary = usable.find(r => r.id === 'ihchina-project') || usable.find(r => r.url === item.sourceUrl) || usable[0];
    const href = primary?.url || (/^https?:\/\//i.test(window.TeaExplore.safeUrl(item.sourceUrl)) ? item.sourceUrl : '');
    return href ? `<a class="project-source-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${icon('I07')}<span>${tr('查看官方项目资料', 'Official project source (Chinese)')}</span><span aria-hidden="true">↗</span></a>` : `<p class="reference-unavailable">${tr('来源链接暂不可用', 'Source link unavailable')}</p>`;
  }

  function cards(items, reasons = {}) {
    if (!items.length) return `<div class="explore-empty"><p>${tr('暂时没有符合条件的项目。', 'No matching projects.')}</p>${button('clear-filters', tr('清除筛选', 'Clear filters'))}</div>`;
    return items.map(item => `<article class="project-card explore-project-card">
      <div class="explore-card-top"><span class="tag-pill">${esc(localizedField(item, 'province'))}</span>${ctx.journal.data.visited.includes(item.id) ? `<span class="visited-label">${icon('I03')}${tr('已浏览', 'Viewed')}</span>` : ''}</div>
      ${reasons[item.id] ? `<p class="related-reason">${esc(reasons[item.id])}</p>` : ''}
      <h3 class="card-title"><button type="button" class="project-title-button" data-explore-action="detail" data-item="${item.id}">${esc(title(item))}</button></h3>
      <p class="card-meta">${esc(tr(item.teaType, item.teaTypeEn))} · ${esc(localizedField(item, 'yearBatch'))}</p>
      <p class="card-summary">${esc(tr(item.shortSummaryZh || item.leadZh, item.descriptionEn))}</p>${actions(item)}</article>`).join('');
  }

  function practice(item) {
    const e = item.practiceExperience;
    if (!e?.steps?.length) return '';
    const steps = e.steps, index = Math.min(ctx.activeSteps[item.id] || 0, steps.length - 1), step = steps[index];
    const seen = ctx.journal.data.progress[item.id] || [], complete = steps.every(s => seen.includes(s.id));
    return `<section class="practice-experience" id="practiceExperience" aria-labelledby="practiceTitle">
      <div class="explore-section-heading"><div><p class="section-index">${tr('动手探索', 'EXPLORE THE PRACTICE')}</p><h3 id="practiceTitle">${esc(tr(e.titleZh, e.titleEn))}</h3></div><span class="practice-count">${tr('已探索', 'Explored')} ${seen.length}/${steps.length}</span></div>
      <p class="practice-note">${esc(tr(e.noteZh, e.noteEn))}</p>
      <div class="practice-tabs" role="group" aria-label="${tr('选择任意步骤', 'Choose any step')}">${steps.map((s, i) => button('step', `${i + 1} · ${tr(s.titleZh, s.titleEn)}`, item.id, '', `data-step="${i}" aria-pressed="${i === index}"`)).join('')}</div>
      <div class="practice-body"><figure class="practice-figure">${asset(step.assetId) ? `<img src="${asset(step.assetId)}" width="1448" height="1086" alt="${esc(tr(step.titleZh, step.titleEn))}: ${tr("AI辅助示意", "AI-assisted illustration")}">` : `<p>${tr('插画暂不可用，仍可阅读步骤。', 'Illustration unavailable; the description remains available.')}</p>`}<figcaption>${tr('AI辅助示意，非现场照片', 'AI-assisted illustration, not a documentary photograph')}</figcaption></figure>
      <div class="practice-copy"><p class="section-index">${index + 1} / ${steps.length}</p><h4>${esc(tr(step.titleZh, step.titleEn))}</h4><p>${esc(tr(step.contentZh, step.contentEn))}</p>${sourcePills(item, step.sourceIds)}
      <div class="practice-controls">${button('step', tr('上一步', 'Previous'), item.id, 'I06', `data-step="${index - 1}" ${index === 0 ? 'disabled' : ''}`)}${button('step', index === steps.length - 1 ? tr('看完这一步', 'Mark as viewed') : tr('下一步', 'Next'), item.id, '', `data-step="${Math.min(index + 1, steps.length - 1)}" data-complete-current="true"`)}</div></div></div>
      ${complete ? `<div class="practice-complete" role="status"><strong>${e.kind === 'ritual' ? tr('三道茶总览', 'All three courses') : tr('已探索全部技法卡片', 'All technique cards explored')}</strong><p>${steps.map(s => esc(tr(s.titleZh, s.titleEn))).join(' · ')}</p><p>${esc(tr(e.noteZh, e.noteEn))}</p></div>` : ''}${button('replay', tr('重新探索', 'Explore again'), item.id, 'I05')}</section>`;
  }

  function registration(item) {
    const facts = [[tr('所在地', 'Location'), `${localizedField(item, 'province')} · ${localizedField(item, 'city')}`], [tr('申报地区或单位', 'Declared region / organization'), localizedField(item, 'declaredRegion') || tr('未确认，不以所在地代替', 'Unconfirmed; not inferred from location')], [tr('项目编号', 'Project code'), item.code], [tr('公布批次', 'National listing'), localizedField(item, 'yearBatch')], [tr('保护单位（范围主表）', 'Safeguarding body (scope register)'), localizedField(item, 'protectionUnit')]];
    return `<section class="registration-section" id="detail-section-source_audit">
      <details class="detail-accordion registration-details" id="registrationDetails"><summary class="detail-accordion-summary"><span class="detail-accordion-title">${tr('完整登记信息', 'Registration details')}</span>${item.fieldReview?.length ? `<span class="registration-warning">${tr('存在来源差异', 'Source discrepancy')}</span>` : ''}<span class="detail-accordion-icon" aria-hidden="true"></span></summary><div class="detail-accordion-body">
      <dl class="registration-grid">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <div class="detail-status-meta"><span>${esc(formatSourceStatus(item.sourceStatus))}</span><span>${tr('数据质量', 'Data quality')}：${esc(formatDataQuality(item.dataQuality))}</span><span>${tr('最后核验', 'Last content check')}：${esc(item.lastVerified)}</span>${item.registrationCheckedAt ? `<span>${tr('登记字段读取', 'Registration checked')}：${esc(item.registrationCheckedAt)}</span>` : ''}</div>
      ${(item.fieldReview || []).map(f => `<p class="source-conflict">${tr('来源差异待核验', 'Source discrepancy')}：${esc(tr(({ protectionUnit: '保护单位', yearBatch: '公布批次', code: '编号', category: '类别' })[f.field] || f.field, ({ protectionUnit: 'Safeguarding body', yearBatch: 'National listing', code: 'Code', category: 'Category' })[f.field] || f.field))}。${tr('范围主表', 'Scope register')}：${esc(localizedField(f, 'masterValue'))}；${tr('官网登记', 'Official page')}：${esc(localizedField(f, 'officialValue'))}。</p>`).join('')}</div></details>
      <div class="project-source-footer"><span>${tr('核验日期', 'Checked')} ${esc(item.lastVerified || '')}</span>${references(item)}</div></section>`;
  }

  function detail(item) {
    if (!item) { els.detailPanel.innerHTML = `<h3>${tr('这个项目链接不可用', 'Project not found')}</h3>${button('map', tr('返回地图', 'Return to map'))}`; return; }
    const sections = item.detailSections.filter(s => !['overview', 'source_audit'].includes(s.key));
    const related = window.TeaExplore.related(item, DATA.items);
    const labels = { tea: tr('同茶类', 'Same tea type'), region: tr('同地区', 'Same region'), category: tr('同非遗类别', 'Same heritage category') };
    const jumps = [
      ...(item.practiceExperience || item.detailExperience ? [[item.practiceExperience ? 'practiceExperience' : 'detailExperience', tr('动手探索', 'Explore')]] : []),
      ...(sections.length ? [['projectBackground', tr('项目故事', 'Background')]] : []),
      ['detail-section-source_audit', tr('登记与来源', 'Source')]
    ];
    els.detailPanel.innerHTML = `<div class="detail-top explore-detail-top"><div class="detail-heading-copy"><div class="detail-tags"><span class="tag-pill">${esc(localizedField(item, 'teaType'))}</span><span class="tag-pill">${esc(localizedField(item, 'category'))}</span></div>
      <h2 class="detail-title" tabindex="-1">${esc(title(item))}</h2>${state.lang === "zh" ? `<p class="detail-subtitle">${esc(item.nameEn)}</p>` : ""}
      <p class="explore-one-line">${esc(tr(item.shortSummaryZh || item.leadZh, item.shortSummaryEn || item.leadEn))}</p>${actions(item)}</div>
      <div class="explore-key-facts"><div><small>${tr('所在地', 'Location')}</small><strong>${esc(localizedField(item, 'city') || localizedField(item, 'province'))}</strong></div><div><small>${tr('非遗类别', 'Category')}</small><strong>${esc(tr(item.category, item.categoryEn))}</strong></div><div><small>${tr('公布批次', 'National listing')}</small><strong>${esc(localizedField(item, 'yearBatch'))}</strong></div></div></div>
      <nav class="project-section-nav" aria-label="${tr('本页内容', 'On this page')}">${jumps.map(([id, label]) => `<button type="button" class="detail-anchor-button" data-detail-anchor="${id}">${label}</button>`).join('')}</nav>
      ${practice(item)}${detailExperiences.render(item)}${renderDetailImageBlock(item)}
      ${sections.length ? `<section class="explore-reading" id="projectBackground"><h3>${tr('读懂它的来处', 'Read the background')}</h3>${renderStructuredDetailSections({ ...item, detailSections: sections }, currentText())}</section>` : ''}
      ${related.length ? `<section class="related-section"><p class="section-index">${tr('下一站', 'NEXT DISCOVERY')}</p><h3>${tr('沿着一条线索，继续探索', 'Follow a connection')}</h3><div class="related-grid">${cards(related.map(r => r.item), Object.fromEntries(related.map(r => [r.item.id, labels[r.reason]])))}</div></section>` : ''}${registration(item)}`;
  }

  function comparePage() {
    const selected = ctx.compared.map(getItemById).filter(Boolean);
    const heading = `<p class="section-index">${tr('放在一起看', 'SIDE BY SIDE')}</p><h2 tabindex="-1">${tr('项目对照', 'Compare projects')}</h2><p class="section-note">${tr('选两个项目，看看它们的不同。', 'Choose two projects and discover their differences.')}</p>`;
    if (selected.length !== 2) return heading + `<div class="explore-empty"><p>${tr('请选择两个不同项目。已选', 'Choose two different projects. Selected')} ${selected.length}/2</p>${button('browse-all', tr('从项目列表选择', 'Browse projects'))}</div>`;
    const rows = [[tr('所在地', 'Location'), x => `${localizedField(x, 'province')} · ${localizedField(x, 'city')}`], [tr('非遗类别', 'Category'), x => tr(x.category, x.categoryEn)], [tr('茶类 / 主题', 'Tea type / theme'), x => tr(x.teaType, x.teaTypeEn)], [tr('公布批次', 'National listing'), x => localizedField(x, 'yearBatch')]];
    if (selected[0].category === selected[1].category) rows.push([tr('关键特点', 'Key features'), x => x.keyFeatures?.map(f => tr(f.textZh, f.textEn)).join('；') || tr('暂无资料', 'Not available')]);
    return heading + `<div class="comparison-heads">${selected.map(item => `<article><h3>${esc(title(item))}</h3><div class="item-actions">${button('detail', tr('查看项目', 'Open project'), item.id)}${button('compare-remove', tr('移除 / 更换', 'Remove / change'), item.id, 'I08')}</div></article>`).join('')}</div>
      <dl class="comparison-rows">${rows.map(([label, value]) => `<div class="comparison-row"><dt>${esc(label)}</dt>${selected.map(item => `<dd><span class="mobile-comparison-name">${esc(title(item))}</span>${esc(value(item))}</dd>`).join('')}</div>`).join('')}</dl>
      <div class="comparison-sources">${selected.map(item => `<div><h3>${esc(title(item))}</h3>${references(item)}</div>`).join('')}</div>${button('compare-clear', tr('清空对照', 'Clear comparison'))}`;
  }

  function footprintsPage() {
    const favorites = ctx.journal.data.favorites.map(getItemById).filter(Boolean);
    const visited = [...ctx.journal.data.visited].reverse().map(getItemById).filter(Boolean);
    const pilots = DATA.items.filter(item => item.practiceExperience || item.detailExperience);
    const progress = item => item.detailExperience ? (ctx.detailJournal.data.progress[item.id] || []).length : (ctx.journal.data.progress[item.id] || []).length;
    const total = item => item.detailExperience?.units.length || item.practiceExperience.steps.length;
    return `<p class="section-index">${tr('留下一点茶香', 'YOUR COLLECTION')}</p><h2 tabindex="-1">${tr('我的足迹', 'My discoveries')}</h2><p class="section-note">${tr('收藏与阅读记录仅保存在当前浏览器。', 'Saved projects and reading history stay in this browser.')}</p>
      <div class="footprint-stats"><strong>${visited.length}<small>${tr('已浏览 / 46', 'viewed / 46')}</small></strong><strong>${favorites.length}<small>${tr('已收藏', 'saved')}</small></strong></div>
      ${!visited.length && !favorites.length ? `<figure class="footprint-empty"><img src="${asset('A15')}" alt="${tr('空白茶叶笔记本插画', 'Illustration of an empty tea notebook')}" width="1448" height="1086"><figcaption>${tr('从一个项目开始，慢慢记下你的发现。', 'Begin with one project and build your collection.')}</figcaption></figure>` : ''}
      <details class="footprint-progress-section"><summary>${tr('探索进度', 'Exploration progress')} · ${pilots.length}</summary><div class="pilot-progress">${pilots.map(item => `<div><span>${esc(title(item))}</span><progress aria-label="${esc(title(item))}" value="${progress(item)}" max="${total(item)}"></progress><small>${progress(item)} / ${total(item)}</small>${button('detail', tr('继续探索', 'Continue'), item.id)}</div>`).join('')}</div></details>
      <h3>${tr('我的收藏', 'Saved projects')}</h3><div class="related-grid">${favorites.length ? cards(favorites) : `<p>${tr('还没有收藏。遇到感兴趣的项目时，点击“收藏”。', 'No saved projects yet. Use Save on any project.')}</p>`}</div>
      <h3>${tr('最近浏览', 'Recently viewed')}</h3><div class="related-grid">${visited.length ? cards(visited) : button('discover', tr('随意发现一个项目', 'Discover a project'))}</div>${button('clear-journal', tr('清除本浏览器记录', 'Clear local history'))}`;
  }

  return { tr, title, asset, icon, button, actions, sourcePills, references, cards, practice, detail, comparePage, footprintsPage, handleDetailAction: detailExperiences.handle };
};
