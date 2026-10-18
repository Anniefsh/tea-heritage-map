window.createZhejiangExperiences = function (ctx, h) {
  'use strict';
  const { tr, asset, button, memory, unitCopy, label } = h;
  const esc = escapeHtml;
  let animation = 0, drag = null;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getItem = id => DATA.items.find(x => x.id === id);
  const validItem = node => {
    const item = getItem(node?.dataset.item);
    return state.view === 'detail' && state.selectedId === item?.id ? item : null;
  };
  const action = (item, name, zh, en, extra = '') => button('dx-zj-' + name, tr(zh, en), item.id, '', extra);
  const view = (item, id) => ctx.detailJournal.view(item.id, id);
  function cancel() {
    cancelAnimationFrame(animation); animation = 0;
    if (drag) {
      const old = drag; drag = null;
      old.node.style.transform = ''; old.target?.classList.remove('is-over');
      old.node.classList.remove('is-dragging');
      if (old.node.hasPointerCapture?.(old.id)) old.node.releasePointerCapture(old.id);
    }
  }
  // Clip approved atlases in CSS; do not manufacture unapproved replacement artwork.
  function atlas(id, frame = 0, columns = 2, rows = 2, alt = '', extra = '') {
    const url = asset(id), x = frame % columns, y = Math.floor(frame / columns);
    return `<div class="zj-atlas ${extra}" style="--cols:${columns};--rows:${rows};--cell-x:${x};--cell-y:${y}">${url ? `<img src="${esc(url)}" alt="${esc(alt)}" draggable="false">` : `<p class="image-fallback">${tr('插画暂不可用，仍可使用文字操作。', 'Illustration unavailable. Text controls still work.')}</p>`}</div>`;
  }
  const caption = () => `<figcaption>${tr('AI辅助示意，非现场照片', 'AI-assisted illustration, not a documentary photograph')}</figcaption>`;
  function tabs(item, e, m) {
    return `<div class="dx-text-controls zj-tabs" role="group" aria-label="${tr('选择探索片段', 'Choose a moment')}">${e.units.map(u=>button('dx-zj-select',label(u),item.id,'',`data-unit="${u.id}" aria-pressed="${m.selected===u.id}"`)).join('')}</div>`;
  }
  function pan(item, e, m) {
    const u = e.units.find(x=>x.id===m.selected);
    const p = m.panProgress?.[u.id] || 0;
    return `${tabs(item,e,m)}<div class="zj-layout"><figure class="detail-experience-figure"><div class="zj-pan zj-scene" data-mode="${u.id}" style="--p:${p / 100}">
      ${atlas(e.assetId,0,2,2,tr('龙井炒锅', 'Longjing tea pan'))}
      <div class="zj-leaf-layer zj-loose" aria-hidden="true">${atlas(e.leafAssetId,0,2,1)}</div>
      <div class="zj-leaf-layer zj-flat" aria-hidden="true">${atlas(e.leafAssetId,1,2,1)}</div>
      <label class="zj-pan-control"><span>${tr('拖动看叶形变化', 'Slide to explore the leaves')}</span><input id="zjPanRange" data-zj-range="pan" data-item="${item.id}" type="range" min="0" max="100" value="${p}" aria-label="${tr('动作演示进度', 'Movement demonstration progress')}"></label>
      </div>${caption()}</figure><div class="zj-copy">${unitCopy(item,u)}<p class="zj-live" role="status" id="zjPanStatus">${panStatus(u.id,p)}</p><div class="dx-text-controls">${action(item,'play','自动演示','Play demonstration')}${action(item,'rewind','回到起点','Start again')}</div><p class="practice-note">${tr('拖动控制演示进度；叶形变化为示意。', 'The slider controls the illustration, not actual processing conditions.')}</p></div></div>`;
  }
  function panStatus(id, p) {
    if (p===0) return tr('从左向右拖动滑点，开始观察。', 'Move the slider from left to right to begin.');
    if (id==='scatter') return p<60 ? tr('叶片正在翻动、散开。', 'The leaves lift and spread apart.') : tr('留意散开的叶片，再试试另一种动作。', 'Notice the separated leaves. Try the other movement too.');
    return p<60 ? tr('叶片逐渐向扁平的轮廓过渡。', 'The leaves gradually take on a flatter outline.') : tr('扁平的叶形显现了，拖回去可以再看一次。', 'The flat leaf shape appears. Slide back to look again.');
  }
  function panUpdate(item,p) {
    const m=memory(item), value=Math.max(0,Math.min(100,Number(p)||0));
    m.panProgress ||= {}; m.panProgress[m.selected]=value;
    const scene=document.querySelector('.zj-pan'), range=document.getElementById('zjPanRange');
    if (!scene || !range) return;
    scene.style.setProperty('--p',value/100); range.value=String(value);
    document.getElementById('zjPanStatus').textContent=panStatus(m.selected,value);
  }
  const sceneFrames = {notice:0,whisk:1,serve:2,talk:3};
  function gathering(item,e,m) {
    m.scenes ||= {};
    const u=e.units.find(x=>x.id===m.selected), done=Boolean(m.scenes[u.id]);
    const prompts={notice:['茶事将启，展开茶榜看看。','Unfold the notice: a tea gathering is about to begin.'],whisk:['点击观看点茶，留意盏中的细密汤花。','Play the whisking scene and notice the fine foam.'],serve:['把茶盏拖到“宾客”框里，也可以点下方按钮送盏。','Drag the bowl into the Guest area, or use the Serve button.'],talk:['茶已分好，展开看看茶叙中的交流。','Tea has been shared. Open the conversation to discover its role.']};
    const results={notice:['茶榜已展开，一席茶事由此开启。','The notice is open: the gathering begins.'],whisk:['茶筅击拂，细密的汤花在盏中泛起。','Whisking brings fine foam to the surface.'],serve:['茶盏已送到，待客的心意也传递了。','The bowl has reached the guest: a gesture of hospitality.'],talk:['一盏茶连接宾主，也留下交谈的空间。','A bowl of tea connects hosts and guests and makes room for conversation.']};
    const art = u.id==='serve' ? `<div class="zj-serve-table"><div class="zj-bowl-origin"><span>${tr('茶盏', 'Tea bowl')}</span></div><div class="zj-guest ${done?'is-served':''}" id="zjGuest"><span>${tr('宾客', 'Guest')}</span><small>${done?tr('已送到', 'Served'):tr('将茶盏放在这里', 'Place the bowl here')}</small></div><button class="zj-drag-bowl ${done?'is-served':''}" data-zj-bowl data-item="${item.id}" type="button" aria-label="${tr('拖动茶盏；也可按回车送盏', 'Drag the bowl, or press Enter to serve')}" ${done?'disabled':''}><img src="${esc(asset(e.bowlAssetId))}" alt="${tr('盛有点茶的深色茶盏', 'Dark bowl of whisked tea')}" draggable="false"></button></div>` : `<div class="zj-ceremony-art ${done?'is-open':''}" data-moment="${u.id}">${atlas(e.assetId,sceneFrames[u.id],2,2,label(u))}${u.id==='notice'?`<span class="zj-notice-label">${done?tr('茶事将启', 'An invitation to tea'):tr('茶榜', 'Tea notice')}</span>`:''}${u.id==='whisk'?'<span class="zj-froth" aria-hidden="true"></span>':''}${u.id==='talk'&&done?`<div class="zj-talk-label">${tr('宾主相问，以茶相叙', 'Conversation over shared tea')}</div>`:''}</div>`;
    const command=(done?{notice:['收起茶榜','Roll up notice'],whisk:['重新点茶','Start whisking again'],serve:['重新送盏','Serve again'],talk:['收起茶叙','Close conversation']}:{notice:['展开茶榜','Unfold notice'],whisk:['观看点茶','Play whisking scene'],serve:['送盏给宾客','Serve the guest'],talk:['展开茶叙','Open conversation']})[u.id];
    return `${tabs(item,e,m)}<div class="zj-layout"><figure class="detail-experience-figure"><div class="zj-scene zj-gathering ${m.thanked?'is-thanked':''}">${art}${m.thanked?`<div class="zj-thanks">${tr('谢茶', 'With thanks')}<small>${tr('一席茶事，留一份余味', 'A gathering ends; its warmth stays')}</small></div>`:''}</div>${caption()}</figure><div class="zj-copy">${unitCopy(item,u)}<p id="zjGatherStatus" class="zj-live" role="status">${tr(...(done?results[u.id]:prompts[u.id]))}</p><div class="dx-text-controls">${action(item,'scene',...command)}${u.id==='talk'?action(item,'thanks','谢茶','Give thanks'):''}</div>${u.id==='talk'&&done?`<div class="zj-conversation"><strong>${tr('从备茶到相待', 'From preparing tea to welcoming others')}</strong><p>${tr('茶宴中的问答与禅院生活相连；交流本身，也是这席茶事的一部分。', 'The exchange is connected with monastic life. Conversation itself is part of the gathering.')}</p></div>`:''}<p class="practice-note">${tr('四个茶宴片段，完整礼仪见下方介绍。', 'Four selected moments. Read about the wider ceremony below.')}</p></div></div>`;
  }
  function compare(item,e,m) {
    const u=e.units.find(x=>x.id===m.selected), value=m.divider??50;
    return `<div class="zj-layout zj-observe-layout"><figure class="detail-experience-figure"><div class="zj-compare zj-scene" style="--split:${value}%" data-zj-observation="${u.id}">
      ${atlas(e.assetId,1,2,1,tr('紫笋芽叶舒展形态示意', 'Illustration of open Zisun leaves'))}
      <div class="zj-compare-left">${atlas(e.assetId,0,2,1,tr('紫笋芽叶紧裹形态示意', 'Illustration of a compact Zisun bud'))}</div>
      <div class="zj-observation-ring" aria-hidden="true"></div>
      <span class="zj-compare-label is-left">${tr('紧裹如笋','Compact like a shoot')}</span><span class="zj-compare-label is-right">${tr('初展如兰','Open like an orchid')}</span>
      <div class="zj-divider" aria-hidden="true"><span>↔</span></div>
      <input class="zj-divider-input" data-zj-range="compare" data-item="${item.id}" type="range" min="0" max="100" value="${value}" aria-label="${tr('左右滑动比较芽形与舒展形态','Slide to compare compact and open leaf shapes')}">
      </div>${caption()}<div class="dx-text-controls">${action(item,'compact','只看紧裹','Compact only')}${action(item,'both','对照看','Compare both')}${action(item,'open','只看舒展','Open only')}</div></figure><div class="zj-copy">${tabs(item,e,m)}${unitCopy(item,u)}<figure class="zj-magnifier" aria-label="${tr('局部放大', 'Detail view')}"><div style="--zoom-x:${u.zoomX}%;--zoom-y:${u.zoomY}%">${atlas(e.assetId,u.frame,2,1,label(u))}</div><figcaption>${tr('靠近看', 'A closer look')} · ${esc(label(u))}</figcaption></figure></div></div>`;
  }
  function handle(trigger,item,e,m) {
    const name=trigger.dataset.exploreAction?.replace('dx-zj-','');
    if(!trigger.dataset.exploreAction?.startsWith('dx-zj-'))return false;
    cancel();
    if(name==='select') {
      const unit=e.units.find(x=>x.id===trigger.dataset.unit);
      if(!unit)return true;
      m.selected=unit.id; view(item,unit.id); m.thanked=false;
      if(e.type==='leaf-compare')m.divider=unit.frame===1?25:75;
    } else if(name==='play'&&e.type==='pan-motion') {
      panUpdate(item,0);
      if(reduced()){panUpdate(item,100);view(item,m.selected);ctx.redraw(trigger);return true;}
      const scene=document.querySelector('.zj-pan'), start=performance.now();
      const tick=now=>{
        if(!scene.isConnected||state.view!=='detail'||state.selectedId!==item.id){cancel();return;}
        const p=Math.min(100,(now-start)/28);panUpdate(item,p);
        if(p<100)animation=requestAnimationFrame(tick);
        else{animation=0;view(item,m.selected);ctx.redraw(trigger);}
      };
      animation=requestAnimationFrame(tick);return true;
    } else if(name==='rewind'){m.panProgress ||= {};m.panProgress[m.selected]=0;}
    else if(name==='scene') {m.scenes ||= {};m.scenes[m.selected]=!m.scenes[m.selected];m.thanked=false;view(item,m.selected);}
    else if(name==='thanks'){m.thanked=true;view(item,'talk');}
    else if(['compact','both','open'].includes(name)){m.divider={compact:100,both:50,open:0}[name];view(item,m.selected);}
    ctx.redraw(trigger);return true;
  }
  document.addEventListener('input', event=>{
    const node=event.target, kind=node.dataset.zjRange, item=validItem(node);
    if(!kind||!item)return;
    cancel();
    if(kind==='pan')panUpdate(item,node.value);
    else{memory(item).divider=Number(node.value);node.closest('.zj-compare').style.setProperty('--split',`${node.value}%`);}
  });
  document.addEventListener('change',event=>{
    const node=event.target, item=validItem(node);
    if(!node.dataset.zjRange||!item)return;
    view(item,memory(item).selected);
    // Keep the native slider and its focus alive; redraw on the next normal action.
    const count=document.querySelector('#detailExperience .practice-count');
    if(count)count.textContent=`${tr('已查看','Viewed')} ${(ctx.detailJournal.data.progress[item.id]||[]).length}/${item.detailExperience.units.length}`;
  });
  function serve(item,trigger) {
    const m=memory(item);m.scenes ||= {};m.scenes.serve=true;view(item,'serve');
    const focusTarget=document.querySelector('[data-explore-action="dx-zj-scene"]');
    ctx.redraw(focusTarget||trigger);ctx.notify(tr('茶盏已送到宾客面前。','The bowl has reached the guest.'));
  }
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&drag){cancel();ctx.notify(tr('茶盏已放回原处。','The bowl is back in its place.'));}
  });
  document.addEventListener('click',event=>{
    const node=event.target.closest?.('[data-zj-bowl]'), item=validItem(node);
    if(node&&item&&event.detail===0&&!node.disabled)serve(item,node);
  });
  document.addEventListener('pointerdown',event=>{
    const node=event.target.closest?.('[data-zj-bowl]'), item=validItem(node);
    if(!node||!item||node.disabled||event.button!==0||event.isPrimary===false)return;
    cancel();
    drag={node,item,id:event.pointerId,x:event.clientX,y:event.clientY,target:document.getElementById('zjGuest')};
    node.focus({preventScroll:true});node.classList.add('is-dragging');
    try{node.setPointerCapture(event.pointerId);}catch{/* Document listeners handle uncaptured pointers. */}
    event.preventDefault();
  });
  document.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    if(!drag.node.isConnected){cancel();return;}
    const r=drag.target.getBoundingClientRect();
    drag.over=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
    drag.target.classList.toggle('is-over',drag.over);
    drag.node.style.transform=`translate(${event.clientX-drag.x}px,${event.clientY-drag.y}px)`;event.preventDefault();
  },{passive:false});
  document.addEventListener('pointerup',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    const d=drag;cancel();
    if(d.over&&d.node.isConnected)serve(d.item,d.node);
    else ctx.notify(tr('再靠近“宾客”框一点，或直接点“送盏给宾客”。','Move into the Guest area, or use Serve the guest.'));
  });
  for(const name of ['pointercancel','lostpointercapture'])document.addEventListener(name,event=>{if(drag?.id===event.pointerId)cancel();});
  window.addEventListener('blur',cancel);window.addEventListener('hashchange',cancel);
  function illustratedSequence(item,e,m,html,figure,unitButton) {
    if(e.presentation!=='illustrated-strip')return html;
    const selected=e.units.find(u=>u.id===m.selected);
    if(selected?.assetId)html=html.replace(figure(selected.assetId,label(selected)+tr('概念示意', ': conceptual illustration')),
      `<figure class="detail-experience-figure zj-stage-art">${atlas(selected.assetId,selected.assetFrame,2,2,label(selected))}${caption()}</figure>`);
    html=html.replace('class="dx-sort-list"','class="dx-sort-list zj-sort-list"');
    for(const id of e.sequenceIds){
      const u=e.units.find(x=>x.id===id);
      html=html.replace(unitButton(item,u),`${atlas(u.assetId,u.assetFrame,2,2,label(u),'zj-sort-thumb')}${unitButton(item,u)}`);
    }
    const correct=m.checked&&m.order.every((id,i)=>id===e.sequenceIds[i]);
    const strip=(correct||m.answer)?`<section class="zj-process-result"><h4>${tr('从揉捻到烘焙，接成一卷', 'From rolling to baking, a connected sequence')}</h4><div class="zj-process-strip">${e.sequenceIds.map(id=>{
      const u=e.units.find(x=>x.id===id);return `<figure>${atlas(u.assetId,u.assetFrame,2,2,label(u))}<figcaption>${esc(label(u))}</figcaption></figure>`;
    }).join('')}</div><p>${tr('锅中炒制与烘焙相衔接，形成婺州举岩的炒焙特点。', 'Pan-processing and baking connect in the Wuzhou Juyan craft.')}</p><small>${tr('AI辅助工序示意', 'AI-assisted process illustrations')}</small></section>`:'';
    return `<div class="zj-illustrated-sequence">${html}${strip}</div>`;
  }
  return {types:{'pan-motion':pan,'tea-gathering':gathering,'leaf-compare':compare},handle,cancel,atlas,caption,illustratedSequence};
};
