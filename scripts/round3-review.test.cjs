const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {JSDOM, VirtualConsole} = require(process.env.TEA_TEST_JSDOM);
const root = path.resolve(__dirname,'../..');
const folder = path.join(root,'非遗数据采集新/06_图片采集台账/第三轮互动待审/定稿审核');
const pack = JSON.parse(fs.readFileSync(path.join(folder,'审核清单.json'),'utf8'));
// Review assertions use the archived pre-integration snapshot, not the now-approved live map.
const production = JSON.parse(fs.readFileSync(path.join(root,'非遗数据采集新/04_审计与差异/第三轮互动/25项接入前结构化数据.json'),'utf8'));
function boot(){
  const errors=[]; const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
  const dom=new JSDOM(fs.readFileSync(path.join(folder,'统一审核页.html'),'utf8'),{runScripts:'dangerously',url:'https://review.test/',virtualConsole:vc});
  return {dom,doc:dom.window.document,errors};
}
test('review scope is 15 existing plus 10 pending, with 21 excluded and production still 15',()=>{
 assert.equal(pack.projects.length,46);
 assert.equal(new Set(pack.projects.map(p=>p.item_id)).size,46);
 assert.equal(pack.projects.filter(p=>p.planned_interaction).length,25);
 assert.equal(pack.projects.filter(p=>!p.planned_interaction).length,21);
 assert.equal(pack.drafts.length,10);
 assert.equal(production.filter(p=>p.detailExperience||p.practiceExperience).length,15);
 for(const d of pack.drafts){assert.equal(d.production_integrated,false);assert.ok(d.source_url.startsWith('https://www.ihchina.cn/project_details/'));assert.ok(d.units.every(u=>u.sourceIds.includes('ihchina-project')));assert.ok(!production.find(p=>p.id===d.item_id).detailExperience);}
 for(const id of ['tea-item-26','tea-item-31','tea-item-41'])assert.equal(pack.projects.find(p=>p.item_id===id).planned_interaction,false);
});
test('both image versions exist, match hashes and have no approval or production reference',()=>{
 assert.equal(pack.assets.length,2);
 const prodText=JSON.stringify(production);
 for(const a of pack.assets){assert.equal(a.approved,false);assert.equal(a.production_integrated,false);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,a.path))).digest('hex'),a.sha256);assert.ok(!prodText.includes(a.path));}
});
test('all ten draft previews render and reveal explanations without changing production or storage',()=>{
 const b=boot();try{
 assert.equal(b.errors.length,0,b.errors.map(e=>e.message).join('\n'));
 assert.equal(b.doc.querySelectorAll('#draftCards article').length,10);
 assert.equal(b.doc.querySelectorAll('#keepTable tbody tr').length,25);
 assert.equal(b.doc.querySelectorAll('#excludeTable tbody tr').length,21);
 for(const d of pack.drafts){const card=b.doc.getElementById(d.item_id);card.querySelector('[data-action="all"]').click();for(const u of d.units)assert.ok(card.textContent.includes(u.text));card.querySelector('[data-action="reset"]').click();assert.equal(card.querySelectorAll('.copy').length,0);}
 assert.equal(b.dom.window.localStorage.length,0);
 }finally{b.dom.window.close();}
});
test('quiz, sorting, matching and cycle feedback have working non-drag controls',()=>{
 const b=boot();try{
 for(const d of pack.drafts.filter(d=>d.type==='quiz')){
 const quiz=b.doc.getElementById(d.item_id);quiz.querySelector('[data-action="guess"][data-index="1"]').click();assert.equal(quiz.querySelector('.result').textContent,d.incorrect_feedback);quiz.querySelector('[data-action="guess"][data-index="0"]').click();assert.equal(quiz.querySelector('.result').textContent,d.correct_feedback);
 assert.ok(!/不扣分|锁住|不计分/.test(d.correct_feedback+d.incorrect_feedback));
 }
 const sort=b.doc.getElementById('tea-item-15');sort.querySelector('[data-action="check"]').click();assert.equal(sort.querySelectorAll('.wrong').length,4);sort.querySelector('[data-action="up"][data-index="3"]').click();assert.equal(sort.querySelectorAll('.wrong').length,0);
 for(const i of [2,1,3,2,3])sort.querySelector(`[data-action="up"][data-index="${i}"]`).click();sort.querySelector('[data-action="check"]').click();assert.equal(sort.querySelectorAll('.good').length,4);
 const match=b.doc.getElementById('tea-item-18');for(const select of match.querySelectorAll('select')){select.value=select.dataset.match;select.dispatchEvent(new b.dom.window.Event('change',{bubbles:true}));}match.querySelector('[data-action="check"]').click();assert.equal((match.querySelector('.result').textContent.match(/配对了/g)||[]).length,4);
 const cycle=b.doc.getElementById('tea-item-40');for(let i=0;i<4;i++)cycle.querySelector('[data-action="next"]').click();assert.ok(cycle.querySelector('.result').textContent.includes('初蒸'));
 assert.equal(b.errors.length,0);
 }finally{b.dom.window.close();}
});
