const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const core = require('../experience-core.js');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const data = JSON.parse(read('data/tea_heritage.json'));
const items = data.items;
const assetsContext = { window: {} };
vm.runInNewContext(read('data/explore_assets.js'), assetsContext);
const assets = assetsContext.window.TEA_EXPLORE_ASSETS;
const pilot = items.find(x => x.practiceExperience);

test('content audit preserves registration and retained interaction unit ids',()=>{
  const before=JSON.parse(read('../非遗数据采集新/04_审计与差异/第三轮互动/25项接入前结构化数据.json'));
  const approval=JSON.parse(read('../非遗数据采集新/06_图片采集台账/第三轮互动待审/定稿审核/接入批准记录.json'));
  assert.equal(approval.assets.filter(x=>x.approved&&x.production_integrated).length,2);
  assert.equal(approval.drafts.filter(x=>x.production_integrated).length,10);
  for(const old of before){
    const now=items.find(x=>x.id===old.id);
    for(const field of ['name','province','city','code','category','yearBatch','protectionUnit','declaredRegion'])assert.deepEqual(now[field],old[field],old.id+'.'+field);
    if(old.practiceExperience)assert.deepEqual(now.practiceExperience.steps.map(u=>u.id),old.practiceExperience.steps.map(u=>u.id),old.id);
    if(old.detailExperience && now.detailExperience)assert.deepEqual(now.detailExperience.units.map(u=>u.id),old.detailExperience.units.map(u=>u.id),old.id);
  }
});

test('46 unique records are derived from the canonical feed, including local HTML data', () => {
  assert.equal(items.length, 46);
  assert.equal(new Set(items.map(x => x.id)).size, 46);
  const feed = JSON.parse(read('../非遗数据采集新/05_详情页投喂/详情页候选数据.json').replace(/^\uFEFF/, ''));
  assert.deepEqual(items, feed);
  const context = { window: {} };
  vm.runInNewContext(read('data/tea_heritage_data.js'), context);
  assert.equal(JSON.stringify(context.window.TEA_HERITAGE_DATA), JSON.stringify(data));
});

test('30 exact approved asset versions exist and match approval hashes', () => {
  assert.equal(Object.keys(assets.items).length, 30);
  for (const a of Object.values(assets.items)) {
    assert.equal(a.approved, true);
    assert.ok(a.approvalEvidence);
    assert.ok(core.safeUrl(a.path));
    const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, a.path))).digest('hex');
    assert.equal(digest, a.sha256.toLowerCase(), a.id);
  }
});

test('ten reviewed detail experiences and three illustrated pilots have sourced content', () => {
  const expanded = items.filter(x=>x.detailExperience);
  assert.equal(expanded.length,10);
  assert.equal(new Set(expanded.map(x=>x.detailExperience.type)).size,5);
  assert.equal(items.filter(x=>x.practiceExperience || x.detailExperience).length,13);
  const provinces = new Set(items.map(x=>x.province));
  for(const item of expanded) {
    const e=item.detailExperience, refs=new Set(item.references.map(r=>r.id)), units=new Set(e.units.map(u=>u.id));
    assert.equal(units.size,e.units.length);
    for(const part of [e,...e.units,...(e.edges||[])]) {
      assert.ok(part.sourceIds.length && part.sourceIds.every(id=>refs.has(id)));
      if(part.assetId) assert.equal(assets.items[part.assetId].approved,true);
      if(part.province) assert.ok(provinces.has(part.province));
      if(part.fromId) assert.ok(units.has(part.fromId) && units.has(part.toId));
    }
  }
  assert.equal(items.find(x=>x.id==='tea-item-24').sourceStatus,'needs-review');
});

test('round two changes only five content records and preserves all registration fields', () => {
  const before=JSON.parse(read('../非遗数据采集新/04_审计与差异/第二轮轻交互/变更前结构化数据.json').replace(/^\uFEFF/,''));
  const items=JSON.parse(read('../非遗数据采集新/04_审计与差异/第三轮互动/变更前结构化数据.json').replace(/^\uFEFF/,''));
  const allowed=new Set(['tea-item-06','tea-item-17','tea-item-24','tea-item-28','tea-item-35']);
  for(let i=0;i<items.length;i++) {
    assert.equal(before[i].id,items[i].id);
    if(!allowed.has(items[i].id)) assert.deepEqual(items[i],before[i],items[i].id);
    for(const field of ['name','province','city','code','category','yearBatch','protectionUnit','declaredRegion','fieldReview','practiceExperience']) assert.deepEqual(items[i][field],before[i][field],`${items[i].id}.${field}`);
  }
});

test('round three changes only seven text records and screens all 38 with source evidence',()=>{
  const prefix='../非遗数据采集新/04_审计与差异/第三轮互动/';
  const items=JSON.parse(read(prefix+'25项接入前结构化数据.json'));
  const before=JSON.parse(read(prefix+'变更前结构化数据.json').replace(/^\uFEFF/,''));
  const decisions=JSON.parse(read(prefix+'38项互动适配清单.json'));
  const evidence=JSON.parse(read(prefix+'38项官方页面复读.json'));
  assert.equal(decisions.length,38); assert.equal(new Set(decisions.map(x=>x.item_id)).size,38);
  const changed=new Set(decisions.filter(x=>x.implementation==='文字版已接入').map(x=>x.item_id));
  assert.equal(changed.size,7);
  for(let i=0;i<items.length;i++) {
    if(!changed.has(items[i].id)) assert.deepEqual(items[i],before[i]);
    for(const key of ['id','name','province','city','category','code','yearBatch','protectionUnit','fieldReview','practiceExperience']) assert.deepEqual(items[i][key],before[i][key]);
    if(changed.has(items[i].id)) {
      assert.equal(items[i].detailExperience.assetId,undefined);
      assert.ok(items[i].detailExperience.units.every(u=>!u.assetId));
    }
  }
  for(const d of decisions) {
    const source=evidence.find(x=>x.item_id===d.item_id);
    assert.ok(source.text.length>70 && source.sha256===d.source_sha256);
    assert.ok(d.source_url.startsWith('https://www.ihchina.cn/project_details/'));
    assert.ok(d.reason && d.materials);
  }
  assert.equal(decisions.filter(x=>x.type==='utensil-task').length,1);
  assert.equal(decisions.filter(x=>x.type==='compare-observe').length,1);
});

test('new progress is isolated, deduplicated, sanitized and resilient to storage failure', () => {
  const values=new Map(), storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
  const old=core.createStore(items,storage);
  old.favorite(items[0].id); old.step(pilot.id,pilot.practiceExperience.steps[0].id);
  const savedOld=values.get(core.KEY), item=items.find(x=>x.detailExperience), unit=item.detailExperience.units[0].id;
  const a=core.createDetailStore(items,storage); a.view(item.id,unit); a.view(item.id,unit); a.view(item.id,'invalid');
  assert.deepEqual(a.data.progress[item.id],[unit]);
  const b=core.createDetailStore(items,storage);
  assert.deepEqual(b.data,a.data);
  const revision=b.data.revision; b.clear();
  assert.notEqual(b.data.revision,revision);
  assert.deepEqual(b.data.progress,{}); assert.equal(values.get(core.KEY),savedOld);
  values.set(core.DETAIL_KEY,JSON.stringify({progress:{[item.id]:[unit,unit,'invalid'],unknown:['x']}}));
  assert.deepEqual(core.createDetailStore(items,storage).data.progress,{[item.id]:[unit]});
  const failed=core.createDetailStore(items,{getItem:()=>'{broken',setItem:()=>{throw Error('denied')}});
  failed.view(item.id,unit); assert.equal(failed.persistent,false); assert.deepEqual(failed.data.progress[item.id],[unit]);
});

test('sorting keeps exactly four unique units and does not mutate its input',()=>{
  const a=['bind','load','close','press'];
  assert.deepEqual(core.moveUnit(a,'load',0),['load','bind','close','press']);
  assert.deepEqual(core.moveUnit(a,'bind',3),['load','close','press','bind']);
  assert.deepEqual(core.moveUnit(a,'bad',1),a);
  assert.deepEqual(core.moveUnit(a,'bind',-1),a);
  assert.deepEqual(a,['bind','load','close','press']);
});

test('3 pilots / 13 steps have valid sources and approved assets; other projects have no placeholder', () => {
  const pilots = items.filter(x => x.practiceExperience);
  assert.equal(pilots.length, 3);
  assert.equal(pilots.flatMap(x => x.practiceExperience.steps).length, 13);
  for (const item of items) {
    const refs = new Set(item.references.map(r => r.id));
    for (const part of [...item.detailSections, ...item.keyFeatures, ...(item.practiceExperience?.steps || [])]) {
      assert.ok(part.sourceIds.length, item.id);
      assert.ok(part.sourceIds.every(id => refs.has(id)), item.id);
      if (part.assetId) assert.equal(assets.items[part.assetId].approved, true);
    }
    assert.ok(item.shortSummarySourceIds.every(id => refs.has(id)));
  }
});

test('local journal deduplicates, orders recent views, rejects invalid progress, and survives storage denial', () => {
  const store = core.createStore(items, { getItem() { return '{broken'; }, setItem() { throw Error('denied'); } });
  assert.equal(store.persistent, false);
  const [a,b] = items;
  store.visit(a.id); store.visit(b.id); store.visit(a.id); store.visit('unknown');
  assert.deepEqual(store.data.visited, [b.id, a.id]);
  store.favorite(a.id); store.favorite(a.id); assert.equal(store.data.favorites.length, 0);
  const step = pilot.practiceExperience.steps[0].id;
  store.step(pilot.id, step); store.step(pilot.id, step); store.step(pilot.id, 'invalid');
  assert.deepEqual(store.data.progress[pilot.id], [step]);
  store.resetSteps(pilot.id); assert.equal(store.data.progress[pilot.id], undefined);
  store.clear(); assert.equal(store.data.visited.length, 0);
});

test('saved data survives reload without importing unknown project or step ids', () => {
  let saved = '{}'; const storage = {getItem: () => saved, setItem: (k,v) => saved=v};
  const first = core.createStore(items, storage); first.favorite(items[0].id); first.visit(items[0].id);
  const next = core.createStore(items, storage);
  assert.deepEqual(next.data.favorites, [items[0].id]);
  assert.deepEqual(core.sanitize({favorites:['unknown',items[0].id,items[0].id]}, items).favorites, [items[0].id]);
});

test('comparison never silently replaces a third selection and never duplicates a project', () => {
  assert.deepEqual(core.compareChange(['a','b'],'c'), {ids:['a','b'], needsReplacement:true});
  assert.deepEqual(core.compareChange(['a','b'],'c','a').ids, ['c','b']);
  assert.deepEqual(core.compareChange(['a','b'],'a').ids, ['a','b']);
});

test('recommendations are deterministic, source-backed for tea type, never self or duplicate', () => {
  for (const item of items) {
    const related = core.related(item, items);
    assert.ok(related.length <= 3);
    assert.equal(new Set(related.map(r=>r.item.id)).size, related.length);
    assert.ok(related.every(r=>r.item.id !== item.id));
    assert.deepEqual(related, core.related(item, [...items].reverse()));
    for (const r of related.filter(r=>r.reason === 'tea')) {
      assert.ok(core.TEA_TYPES.has(item.teaType));
      assert.ok(item.teaTypeSourceIds.length && r.item.teaTypeSourceIds.length);
    }
  }
});

test('discovery prefers unseen; invalid hashes and unsafe URLs fail safely', () => {
  assert.equal(core.discover(items, items.slice(0,-1).map(x=>x.id)).id, items.at(-1).id);
  assert.equal(core.route('#detail/no-such-item',items).view, 'missing');
  assert.equal(core.route('#detail/%E0%A4%A',items).view, 'missing');
  assert.equal(core.route('#detail/'+pilot.id,items).id,pilot.id);
  assert.equal(core.route('#compare?items='+items[0].id+','+items[0].id, items).ids.length,1);
  for (const url of ['javascript:alert(1)','file:///D:/missing','assets/../secret','data:text/html,x']) assert.equal(core.safeUrl(url),'');
});

test('all local script and stylesheet references exist and parse', () => {
  const html = read('index.html');
  for (const m of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) {
    assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
    if(m[1].endsWith('.js')) new vm.Script(read(m[1]),{filename:m[1]});
  }
  assert.ok(html.indexOf('experience-render.js') < html.indexOf('experience-ui.js'));
});
