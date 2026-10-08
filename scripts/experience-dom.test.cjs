// DOM simulation only: this does not validate browser layout, images or touch gestures.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { JSDOM, VirtualConsole } = require(process.env.TEA_TEST_JSDOM || path.join(process.env.TEMP, 'tea-map-test-runtime/node_modules/jsdom'));
const root = path.join(__dirname, '..');
async function settleUntil(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate() && Date.now() < deadline) await new Promise(r=>setTimeout(r,25));
}

function boot(hash = '', storageDenied = false, fileMode = false) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'), {
    // An inert origin for DOM history tests; no server, browser or network is used.
    url: (fileMode ? pathToFileURL(path.join(root,'index.html')).href : 'https://tea-map.test/') + hash,
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc
  });
  const w = dom.window;
  const scrollEvents = [];
  w.scrollTo = options => { w.scrollY = typeof options === 'object' ? options.top || 0 : 0; scrollEvents.push({top:w.scrollY,hash:w.location.hash,stack:new Error().stack}); };
  w.scrollBy = (x,y) => { w.scrollY += y; };
  w.matchMedia = () => ({ matches: true });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  // No layout is modeled. Supply a nonempty rect list solely for focus-restoration logic.
  w.HTMLElement.prototype.getClientRects = function () { return this.closest('.hidden') ? [] : [{}]; };
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  const store = new Map();
  Object.defineProperty(w,'localStorage',{ value: {
    getItem: key => store.get(key) || null,
    setItem: (key,value) => { if(storageDenied) throw Error('denied'); store.set(key,value); }
  }});
  for (const script of w.document.querySelectorAll('script[src]')) {
    vm.runInContext(fs.readFileSync(path.join(root,script.getAttribute('src')),'utf8'),dom.getInternalVMContext(),{filename:script.getAttribute('src')});
  }
  const run = code => vm.runInContext(code,dom.getInternalVMContext());
  const click = (action,id,extra='') => {
    const node = [...w.document.querySelectorAll(`[data-explore-action="${action}"]${id ? `[data-item="${id}"]` : ''}${extra}`)].find(x=>!x.closest('.hidden'));
    assert.ok(node,`visible ${action} ${id || ''} ${extra}`); node.click();
  };
  return {dom,w,run,click,errors,scrollEvents,close:()=>dom.window.close()};
}

function assertEnglish(root, context) {
  const issues=[];
  const walker=root.ownerDocument.createTreeWalker(root,4);
  while(walker.nextNode()) {
    const node=walker.currentNode, parent=node.parentElement;
    if(parent?.closest('script,style,#langToggle,.hidden,[hidden]')) continue;
    if(/\p{Script=Han}/u.test(node.textContent)) issues.push(node.textContent.trim());
  }
  for(const node of root.querySelectorAll('[alt],[aria-label],[title],[placeholder]')) {
    if(node.closest('.hidden,[hidden]')) continue;
    for(const attr of ['alt','aria-label','title','placeholder']) if(/\p{Script=Han}/u.test(node.getAttribute(attr)||'')) issues.push(`${node.id||node.tagName} ${attr}: ${node.getAttribute(attr)}`);
  }
  assert.deepEqual(issues,[],context);
}

test('English has no Chinese leaks across every project, expanded content and interaction states', () => {
  const b=boot();
  try {
    b.w.document.getElementById('langToggle').click();
    assertEnglish(b.w.document.body,'home');
    for(const item of b.w.TEA_HERITAGE_DATA.items) {
      b.w.TeaExperience.navigate('detail',{id:item.id});
      assert.equal(b.w.document.querySelector('.detail-section-english'),null);
      for(const d of b.w.document.querySelectorAll('#detailPanel details')) d.open=true;
      assertEnglish(b.w.document.body,item.id);
      if(item.practiceExperience) for(let i=0;i<item.practiceExperience.steps.length;i++) {
        b.click('step',item.id,`[data-step="${i}"]`);
        assertEnglish(b.w.document.body,item.id+' step '+i);
      }
      const e=item.detailExperience;
      if(!e)continue;
      if(e.type==='quiz-cards') for(const o of e.options){b.click('dx-guess',item.id,`[data-choice="${o.id}"]`);assertEnglish(b.w.document.body,item.id+' answer '+o.id);}
      if(['quiz-cards','match','lineage'].includes(e.type))b.click('dx-all',item.id);
      if(e.type==='sequence'){b.click('dx-check',item.id);b.click('dx-answer',item.id);}
      if(['hotspots','sequence','lineage'].includes(e.type))for(const u of e.units){b.click('dx-view',item.id,`[data-unit="${u.id}"]`);assertEnglish(b.w.document.body,item.id+' unit '+u.id);}
      if(e.type==='match')b.click('dx-match-check',item.id);
      assertEnglish(b.w.document.body,item.id+' expanded');
    }
  } finally {b.close();}
});

test('English covers map, all province lists, all marker previews, comparison and discoveries', () => {
  const b=boot();
  try {
    b.w.document.getElementById('langToggle').click();
    b.w.TeaExperience.navigate('map');
    assertEnglish(b.w.document.body,'map');
    for(const province of new Set(b.w.TEA_HERITAGE_DATA.items.map(x=>x.province))){b.w.TeaExperience.navigate('province',{province});assertEnglish(b.w.document.body,province);}
    b.w.TeaExperience.navigate('map');
    b.run("setMapBrowseMode('project')");
    for(const item of b.w.TEA_HERITAGE_DATA.items){b.run(`setMapPreview('${item.id}')`);assertEnglish(b.w.document.body,'preview '+item.id);}
    b.w.TeaExperience.navigate('detail',{id:'tea-item-17'});b.click('favorite','tea-item-17');b.click('compare-add','tea-item-17');
    b.w.TeaExperience.navigate('detail',{id:'tea-item-28'});b.click('compare-add','tea-item-28');b.click('compare');
    assertEnglish(b.w.document.body,'compare');
    b.w.TeaExperience.navigate('footprints');assertEnglish(b.w.document.body,'footprints');
    b.click('clear-journal');assertEnglish(b.w.document.body,'clear dialog');b.click('dialog-close');
    b.w.TeaExperience.navigate('detail',{id:'tea-item-09'});b.click('compare-add','tea-item-09');assertEnglish(b.w.document.body,'replacement dialog');b.click('dialog-close');
    b.run("state.search='Anji'; state.province='all'; state.teaType='all'; state.topic='all'");
    assert.ok(b.run("filteredItems().some(x=>x.id==='tea-item-17')"));
  }finally{b.close();}
});

test('language switching preserves open sections and browser back keeps the selected language', async () => {
  const b=boot('#detail/tea-item-17');
  try {
    b.w.document.getElementById('registrationDetails').open=true;
    b.w.TeaExperience.navigate('detail',{id:'tea-item-28'});
    b.w.document.getElementById('registrationDetails').open=true;
    b.w.document.getElementById('langToggle').click();
    assert.ok(b.w.document.getElementById('registrationDetails').open);
    assert.equal(b.w.localStorage.getItem('tea-map-language'),'en');
    b.w.history.back();
    await settleUntil(()=>b.w.location.hash==='#detail/tea-item-17');
    assert.equal(b.run('state.lang'),'en');
    assertEnglish(b.w.document.body,'back after language switch');
    b.w.document.getElementById('langToggle').click();
    assert.ok(b.w.document.getElementById('detailPanel').textContent.includes('手工制作'));
    assert.equal(b.w.document.querySelector('.detail-section-english'),null);
  }finally{b.close();}
});

test('matching has factual feedback; retired guides and sorting no longer render', () => {
  const b=boot('#detail/tea-item-18');
  try {
    const item=b.w.TEA_HERITAGE_DATA.items.find(x=>x.id==='tea-item-18');
    for(const u of item.detailExperience.units)b.click('dx-match',item.id,`[data-unit="${u.id}"][data-choice="${u.matchId}"]`);
    b.click('dx-match-check',item.id);
    assert.equal(b.w.document.querySelectorAll('.dx-match-row').length,4);
    assert.equal((b.w.document.getElementById('detailExperience').textContent.match(/配对了/g)||[]).length,4);
    assert.equal(b.w.TeaExperience.detailJournal.data.progress[item.id].length,4);
    b.click('dx-match',item.id,'[data-unit="u1"][data-choice="u2"]');
    assert.equal(b.w.document.querySelector('.dx-match-row .dx-feedback'),null);
    b.click('dx-reset',item.id);assert.equal(b.w.TeaExperience.detailJournal.data.progress[item.id],undefined);
    for(const id of ['tea-item-02','tea-item-05','tea-item-13','tea-item-15','tea-item-20','tea-item-24','tea-item-27','tea-item-30','tea-item-32','tea-item-37','tea-item-40','tea-item-43']) {
      b.w.TeaExperience.navigate('detail',{id});
      assert.equal(b.w.document.getElementById('detailExperience'), null, id);
      const practice=b.w.document.getElementById('detail-section-practice');
      assert.ok(practice.open && practice.textContent.trim(), id);
      assert.doesNotMatch(b.w.document.getElementById('detailPanel').textContent,/为什么不做|不模拟|本页不|本体验|本模块|本轮|本次官网读取/);
    }
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  }finally{b.close();}
});

test('all 46 pages render one official source and their applicable experiences, in both languages', () => {
  const b = boot();
  try {
    for (const lang of ['zh','en']) {
      b.run(`state.lang = '${lang}'`);
      for(const item of b.w.TEA_HERITAGE_DATA.items) {
        b.w.TeaExperience.navigate('detail',{id:item.id});
        const panel = b.w.document.getElementById('detailPanel');
        assert.ok(panel.querySelector('.detail-title').textContent);
        assert.equal(Boolean(panel.querySelector('.practice-experience')),Boolean(item.practiceExperience),item.id);
        assert.equal(Boolean(panel.querySelector('.detail-experience')),Boolean(item.detailExperience),item.id);
        assert.ok(panel.querySelector('a[href*="ihchina.cn/project_details/"]'),item.id);
        assert.equal(panel.querySelectorAll('a[href]').length, 1, item.id);
        assert.ok(panel.querySelector('.project-source-footer a[href*="ihchina.cn/project_details/"]'), item.id);
        assert.equal(panel.querySelector('.explore-sources, .detail-section-sources'), null);
        assert.doesNotMatch(panel.querySelector('.practice-note')?.textContent || '', /本轮|不计分|不计时|不强制答对|不扣分/);
        assert.ok(item.references.some(ref => ref.id === 'scope-register'), 'keep local provenance in data');
        assert.equal(b.w.document.querySelectorAll('#detailShell h2').length, 1);
        assert.equal(panel.querySelector('button button'),null);
        assert.equal(panel.querySelector('video'),null);
        for(const details of panel.querySelectorAll('details')) assert.ok(details.querySelector('.detail-accordion-body').textContent.trim());
      }
    }
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
    assert.equal(b.w.TeaExperience.journal.data.visited.length,46);
  } finally {b.close();}
});

test('concise home keeps useful guidance and section navigation has valid targets', async () => {
  const b = boot();
  try {
    const home = b.w.document.getElementById('landingShell');
    assert.doesNotMatch(home.textContent, /官方地图基底|双语浏览|分层浏览/);
    assert.match(home.textContent, /优先带你发现尚未浏览的项目/);
    assert.equal(home.querySelectorAll('.stat-value')[2].textContent, '13');
    for (const id of ['tea-item-09', 'tea-item-35', 'tea-item-03']) {
      b.w.TeaExperience.navigate('detail', { id });
      for (const nav of b.w.document.querySelectorAll('.project-section-nav button')) {
        const target = b.w.document.getElementById(nav.dataset.detailAnchor);
        assert.ok(target);
        nav.click();
        await settleUntil(() => b.w.document.activeElement === target);
        assert.equal(b.w.document.activeElement, target);
        assert.equal(b.w.location.hash, '#detail/' + id);
      }
      const registration = b.w.document.getElementById('registrationDetails');
      assert.equal(registration.open, false);
      assert.ok(b.w.document.querySelector('.project-source-footer a'));
    }
    assert.equal(b.errors.length, 0, b.errors.map(e=>e.message).join('\n'));
  } finally { b.close(); }
});

test('all six quiz experiences reveal substantive answers, deduplicate progress and replay', () => {
  const b=boot();
  try {
    for (const n of [1,4,9,12,17,38]) {
      const id='tea-item-'+String(n).padStart(2,'0');
      const item=b.w.TEA_HERITAGE_DATA.items.find(x=>x.id===id);
      b.w.TeaExperience.navigate('detail',{id});
      assert.equal(Boolean(b.w.document.querySelector('.detail-experience-figure')),Boolean(item.detailExperience.assetId));
      const e=item.detailExperience;
      b.click('dx-guess',id,`[data-choice="${e.options.find(o=>o.id!==e.correctOption).id}"]`);
      assert.equal(b.w.document.querySelector('.dx-feedback').textContent,e.wrongMessageZh);
      b.click('dx-guess',id,`[data-choice="${e.correctOption}"]`);
      assert.equal(b.w.document.querySelector('.dx-feedback').textContent,e.correctMessageZh);
      b.click('dx-all',id);
      const content=b.w.document.querySelector('.detail-experience').textContent;
      for (const u of item.detailExperience.units) assert.ok(content.includes(u.contentZh));
      assert.equal(b.w.TeaExperience.detailJournal.data.progress[id].length,item.detailExperience.units.length);
      b.click('dx-all',id);
      assert.equal(b.w.TeaExperience.detailJournal.data.progress[id].length,item.detailExperience.units.length);
      b.click('dx-reset',id);
      assert.equal(b.w.TeaExperience.detailJournal.data.progress[id],undefined);
    }
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally { b.close(); }
});

test('legacy empty history selections recover to real content without clearing saved progress', async () => {
  const b=boot('#detail/tea-item-35');
  try {
    await settleUntil(()=>b.w.history.state?.snapshot);
    for (const id of ['tea-item-35','tea-item-28','tea-item-06']) {
      b.w.TeaExperience.navigate('detail',{id});
      await settleUntil(()=>b.w.history.state?.snapshot?.state?.selectedId===id);
      const saved=JSON.parse(JSON.stringify(b.w.history.state));
      saved.snapshot.details[id].selected='';
      b.w.dispatchEvent(new b.w.PopStateEvent('popstate',{state:saved}));
      const content=b.w.document.querySelector('.dx-content, .dx-lineage-node .dx-unit-copy');
      assert.ok(content.querySelector('h4') && content.querySelector('p').textContent.length>15,id);
      assert.doesNotMatch(content.textContent,/先选一件|先看看说明/);
    }
  } finally {b.close();}
});

test('teaware hotspots and equivalent buttons reveal sourced content, deduplicate and reset', () => {
  const b=boot('#detail/tea-item-35');
  try {
    const item=b.w.TEA_HERITAGE_DATA.items.find(x=>x.id==='tea-item-35');
    assert.ok(b.w.document.getElementById('dxContent').textContent.includes(item.detailExperience.units[0].contentZh));
    assert.equal(b.w.document.querySelectorAll('.dx-hotspot').length,4);
    for(const u of item.detailExperience.units) {
      b.click('dx-view',item.id,`[data-unit="${u.id}"]`);
      assert.ok(b.w.document.getElementById('dxContent').textContent.includes(u.contentZh));
      b.click('dx-view',item.id,`[data-unit="${u.id}"]`);
    }
    assert.equal(b.w.TeaExperience.detailJournal.data.progress[item.id].length,4);
    assert.ok(b.w.document.querySelector('.dx-complete'));
    b.click('dx-reset',item.id);
    assert.equal(b.w.TeaExperience.detailJournal.data.progress[item.id],undefined);
    b.click('dx-skip',item.id);
    assert.equal(b.w.document.activeElement.tagName,'H3');
    const img=b.w.document.querySelector('.detail-experience-figure img');
    img.dispatchEvent(new b.w.Event('error'));
    assert.ok(img.hidden);
    assert.ok([...b.w.document.querySelectorAll('.dx-hotspot')].every(x=>x.hidden));
    b.click('dx-view',item.id,'[data-unit="kettle"]');
    assert.equal(b.w.TeaExperience.detailJournal.data.progress[item.id].length,1);
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('Anji guesses never lock cards; direct reveal, flip and replay work without scoring', () => {
  const b=boot('#detail/tea-item-17');
  try {
    b.click('dx-guess','tea-item-17','[data-choice="white"]');
    assert.ok(b.w.document.querySelector('.dx-feedback').textContent.includes('绿茶'));
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-17'].length,1);
    b.click('dx-toggle','tea-item-17','[data-unit="name"]');
    b.click('dx-toggle','tea-item-17','[data-unit="name"]');
    assert.equal(b.w.document.getElementById('dx-name').hidden,true);
    b.click('dx-all','tea-item-17');
    assert.equal(b.w.document.querySelectorAll('.dx-flip-card.is-open').length,3);
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-17'].length,3);
    b.click('favorite','tea-item-17');
    assert.equal(b.w.document.querySelectorAll('.dx-flip-card.is-open').length,3);
    b.click('dx-reset','tea-item-17');
    b.click('dx-guess','tea-item-17','[data-choice="green"]');
    assert.ok(b.w.document.querySelector('.dx-feedback').textContent.includes('是绿茶'));
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('Fuchun removes disputed regional play but retains provenance outside visitor copy', async () => {
  const b=boot('#detail/tea-item-24');
  try {
    assert.equal(b.w.document.querySelector('.dx-source-note'), null);
    const item=b.w.TEA_HERITAGE_DATA.items.find(x=>x.id==='tea-item-24');
    assert.equal(item.contentConflicts[0].sourceIds.length,2);
    assert.equal(b.w.document.querySelector('.dx-region-web'),null);
    assert.ok(b.w.document.getElementById('detailPanel').textContent.includes('手工'));
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('lineage can expand progressively or reveal all and never claims a complete family tree', () => {
  const b=boot('#detail/tea-item-06');
  try {
    assert.equal(b.w.document.querySelectorAll('.dx-lineage-node').length,1);
    b.click('dx-view','tea-item-06','[data-unit="liu"]');
    b.click('dx-expand','tea-item-06','[data-unit="deng"]');
    assert.equal(b.w.document.querySelectorAll('.dx-lineage-node').length,2);
    b.click('dx-expand','tea-item-06','[data-unit="zhang"]');
    assert.equal(b.w.document.querySelectorAll('.dx-lineage-node').length,3);
    assert.equal(b.w.document.querySelectorAll('.dx-lineage-link').length,2);
    assert.equal(b.w.document.querySelectorAll('.dx-lineage-link a').length,0);
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-06'].length,3);
    b.click('dx-reset','tea-item-06'); b.click('dx-all','tea-item-06');
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-06'].length,3);
    assert.ok(b.w.document.querySelector('.detail-experience').textContent.includes('其中一支师承'));
    assert.equal(b.w.document.querySelectorAll('.dx-unit-copy').length,3);
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('Qianliang supports position feedback, button sorting, direct answers and pointer handles', () => {
  const b=boot('#detail/tea-item-28');
  try {
    const order=()=>[...b.w.document.querySelectorAll('[data-sort-unit]')].map(x=>x.dataset.sortUnit);
    b.click('dx-answer','tea-item-28');
    assert.ok(b.w.document.querySelector('.dx-answer').textContent.includes('装篓 → 踩压 → 扎箍 → 锁口'));
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-28'].length,4);
    b.click('dx-view','tea-item-28','[data-unit="raw"]'); b.click('dx-view','tea-item-28','[data-unit="finishing"]');
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-28'].length,6);
    b.click('dx-check','tea-item-28');
    assert.ok(b.w.document.querySelector('.dx-feedback').textContent.includes('还需要调整'));
    assert.equal(b.w.document.querySelectorAll('.dx-position-wrong').length,4);
    assert.ok(b.w.document.querySelector('[data-explore-action="dx-check"]').textContent.includes('检查顺序'));
    b.click('dx-move','tea-item-28','[data-unit="load"][data-offset="-1"]');
    assert.deepEqual(order(),['load','bind','close','press']);
    assert.equal(b.w.document.querySelectorAll('.dx-position-status').length,0);
    assert.ok(b.w.document.querySelector('.dx-feedback').textContent.includes('重新检查'));
    b.click('dx-move','tea-item-28','[data-unit="press"][data-offset="-1"]');
    b.click('dx-move','tea-item-28','[data-unit="press"][data-offset="-1"]');
    assert.deepEqual(order(),['load','press','bind','close']);
    b.click('dx-check','tea-item-28');
    assert.ok(b.w.document.querySelector('.dx-feedback').textContent.includes('顺序正确'));
    assert.equal(b.w.document.querySelectorAll('.dx-position-correct').length,4);
    b.click('dx-reset','tea-item-28');
    const rows=[...b.w.document.querySelectorAll('[data-sort-unit]')];
    rows.forEach((row,i)=>{row.getBoundingClientRect=()=>({left:100,right:400,top:100+i*80,height:70,width:300});});
    rows[0].parentElement.getBoundingClientRect=()=>({left:100,right:400,top:100,bottom:420});
    const handle=b.w.document.querySelector('[data-sort-handle][data-unit="load"]');
    function pointer(target,type,y) { const e=new b.w.MouseEvent(type,{bubbles:true,cancelable:true,clientX:250,clientY:y,button:0}); Object.defineProperty(e,'pointerId',{value:1}); target.dispatchEvent(e); }
    pointer(handle,'pointerdown',200); pointer(handle,'pointermove',120);
    assert.ok(b.w.document.querySelector('.dx-drag-ghost'));
    assert.ok(b.w.document.querySelector('.dx-drop-before'));
    pointer(handle,'pointerup',120);
    assert.deepEqual(order(),['load','bind','close','press']);
    assert.equal(b.w.document.querySelector('.dx-drag-ghost'),null);
    assert.equal(b.w.document.activeElement.dataset.unit,'load');
    b.w.document.activeElement.dispatchEvent(new b.w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
    assert.deepEqual(order(),['bind','load','close','press']);
    b.click('dx-retry','tea-item-28');
    assert.equal(b.w.document.querySelector('.dx-answer'),null);
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('eight footprint rows preserve old progress and clear both stores without history resurrection', async () => {
  const b=boot('#detail/tea-item-17');
  try {
    const pilot=b.w.TEA_HERITAGE_DATA.items.find(x=>x.practiceExperience);
    b.w.TeaExperience.journal.step(pilot.id,pilot.practiceExperience.steps[0].id);
    b.click('dx-all','tea-item-17'); b.click('favorite','tea-item-17');
    b.w.TeaExperience.navigate('footprints');
    assert.equal(b.w.document.querySelectorAll('.pilot-progress progress').length,b.w.TEA_HERITAGE_DATA.items.filter(x=>x.practiceExperience || x.detailExperience).length);
    assert.equal(b.w.TeaExperience.journal.data.progress[pilot.id].length,1);
    b.click('clear-journal'); b.click('clear-confirm');
    assert.equal(Object.keys(b.w.TeaExperience.detailJournal.data.progress).length,0);
    assert.equal(Object.keys(b.w.TeaExperience.journal.data.progress).length,0);
    assert.equal(b.w.TeaExperience.journal.data.favorites.length,0);
    b.w.history.back(); await settleUntil(()=>b.run('state.view')==='detail');
    assert.equal(b.w.document.querySelectorAll('.dx-flip-card.is-open').length,0);
    assert.equal(Object.keys(b.w.TeaExperience.detailJournal.data.progress).length,0);
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('new experiences remain usable with denied storage or an unapproved/missing illustration', () => {
  const b=boot('#detail/tea-item-17',true,true);
  try {
    b.w.TEA_EXPLORE_ASSETS.items.B02.approved=false;
    b.run('rerender()');
    assert.equal(b.w.document.querySelector('.detail-experience-figure img'),null);
    b.click('dx-all','tea-item-17');
    assert.equal(b.w.TeaExperience.detailJournal.data.progress['tea-item-17'].length,3);
    assert.equal(b.w.TeaExperience.detailJournal.persistent,false);
    assert.ok(b.w.document.getElementById('exploreNotice').textContent.includes('本次有效'));
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('favorite, two-slot comparison, explicit replacement, removal, footprints and invalid routes work', () => {
  const b = boot('#detail/tea-item-07');
  try {
    b.click('favorite','tea-item-07');
    b.click('compare-add','tea-item-07');
    b.w.TeaExperience.navigate('detail',{id:'tea-item-11'});
    b.click('compare-add','tea-item-11');
    b.w.TeaExperience.navigate('detail',{id:'tea-item-25'});
    b.click('compare-add','tea-item-25');
    assert.equal(b.w.document.getElementById('replaceDialog').open,true);
    b.click('dialog-close');
    assert.ok(b.w.document.getElementById('compareTray').textContent.includes('2/2'));
    b.click('compare-add','tea-item-25'); b.click('replace-confirm','tea-item-07');
    b.click('compare');
    assert.equal(b.run('state.view'),'compare');
    assert.equal(b.w.document.querySelectorAll('.comparison-heads article').length,2);
    b.click('compare-remove','tea-item-25');
    assert.equal(b.w.document.querySelectorAll('.comparison-heads article').length,0);
    b.click('footprints');
    assert.equal(b.run('state.view'),'footprints');
    assert.equal(b.w.TeaExperience.journal.data.favorites.length,1);
    b.w.TeaExperience.navigate('detail',{id:'missing'});
    assert.equal(b.run('state.view'),'missing');
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('pilots allow jumping, completing, replaying and recording progress without locks', () => {
  const b = boot();
  try {
    for (const item of b.w.TEA_HERITAGE_DATA.items.filter(x=>x.practiceExperience)) {
      b.w.TeaExperience.navigate('detail',{id:item.id});
      for(let i=item.practiceExperience.steps.length-1;i>=0;i--) b.click('step',item.id,`[data-step="${i}"]`);
      assert.equal(b.w.TeaExperience.journal.data.progress[item.id].length,item.practiceExperience.steps.length);
      assert.ok(b.w.document.querySelector('.practice-complete'));
      b.click('replay',item.id);
      assert.equal(b.w.TeaExperience.journal.data.progress[item.id],undefined);
      assert.equal(b.w.document.querySelector('.practice-complete'),null);
    }
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('entry filters, map preview dismissal and local-storage failure keep the map usable', () => {
  const b = boot('',true);
  try {
    b.click('ritual');
    assert.ok(b.run('filteredItems().every(x=>x.category === "民俗")'));
    b.click('clear-filters');
    assert.equal(b.run('filteredItems().length'),46);
    b.w.TeaExperience.navigate('map');
    b.run('state.mapBrowseMode = "project"; rerender()');
    b.run('setMapPreview("tea-item-07")');
    assert.ok(b.w.document.querySelector('.map-preview-card'));
    b.click('preview-expand');
    assert.ok(b.w.document.getElementById('mapContextPanel').classList.contains('preview-expanded'));
    b.run('updateView(1.5, 10, 10)');
    assert.ok(b.w.document.querySelector('[data-explore-action="preview-close"]'));
    b.click('preview-close');
    assert.equal(b.run('state.mapPreviewId'),null);
    assert.ok(b.w.document.getElementById('exploreNotice').textContent.includes('本次有效'));
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('browser back restores filters, map camera and scroll snapshot', async () => {
  const b = boot('#map');
  try {
    b.run('state.search = "云南"; state.viewScale = 2; state.viewX = 25; state.viewY = 45; rerender()');
    assert.equal(b.w.history.state?.snapshot?.state?.search,'云南','snapshot saved before navigation');
    b.w.scrollY=345;
    b.w.TeaExperience.navigate('detail',{id:'tea-item-07'});
    await new Promise(r=>setTimeout(r,30));
    b.w.history.back();
    await settleUntil(()=>b.run('state.view')==='map' && b.w.scrollY===345);
    assert.equal(b.run('state.view'),'map');
    assert.equal(b.run('state.search'),'云南');
    assert.equal(b.run('state.viewScale'),2);
    assert.equal(b.run('state.viewX'),25);
    assert.equal(b.w.scrollY,345,JSON.stringify(b.scrollEvents));
    b.w.history.forward();
    await settleUntil(()=>b.run('state.view')==='detail');
    assert.equal(b.run('state.selectedId'),'tea-item-07');
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally {b.close();}
});

test('keyboard project selection and failed illustrations have usable fallbacks', () => {
  const b = boot('#map');
  try {
    b.run('setMapBrowseMode("project")');
    const marker=b.w.document.querySelector('.project-marker[data-id="tea-item-07"]');
    assert.ok(marker);
    marker.dispatchEvent(new b.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    assert.equal(b.run('state.mapPreviewId'),'tea-item-07');
    b.w.document.dispatchEvent(new b.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(b.run('state.mapPreviewId'),null);
    b.w.TeaExperience.navigate('detail',{id:'tea-item-07'});
    const img=b.w.document.querySelector('.practice-figure img');
    img.dispatchEvent(new b.w.Event('error'));
    assert.equal(img.hidden,true);
    assert.ok(b.w.document.querySelector('.image-fallback'));
    assert.ok(b.w.document.querySelector('.practice-copy').textContent.trim());
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally { b.close(); }
});

test('file-mode history denial still allows returning to the previous map snapshot', async () => {
  const b = boot('#map',true,true);
  try {
    b.run('state.search="云南"; state.viewScale=2; rerender()');
    b.w.scrollY=123;
    b.w.TeaExperience.navigate('detail',{id:'tea-item-07'});
    await new Promise(r=>setTimeout(r,30));
    b.w.TeaExperience.back();
    await settleUntil(()=>b.run('state.view')==='map' && b.w.scrollY===123);
    assert.equal(b.run('state.view'),'map');
    assert.equal(b.run('state.search'),'云南');
    assert.equal(b.run('state.viewScale'),2);
    assert.equal(b.w.scrollY,123);
    assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
  } finally { b.close(); }
});
