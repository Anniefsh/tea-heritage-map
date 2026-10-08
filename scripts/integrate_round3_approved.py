"""Integrate the explicitly approved review pack, preserving prior journal identifiers."""
import hashlib
import json
import shutil
from pathlib import Path
from sync_feed import main as sync

PROJECT=Path(__file__).resolve().parents[1]
ROOT=PROJECT.parent
NEW=ROOT/'非遗数据采集新'
REVIEW=NEW/'06_图片采集台账/第三轮互动待审/定稿审核'
BACKUP=ROOT/'本地版本备份/接入25项互动前-20261006-111248'
AUDIT=NEW/'04_审计与差异/第三轮互动'
EVIDENCE='用户于2026-10-06明确要求：“你先把刚刚审核的内容加进最新的地图里吧。记得在本地保留一份备份，方便我随时回退到上一个版本”。'
EN={9:('Blending or fermentation?',['Combining tea materials','A different process']),12:('Tea for food and drink',['Tea used in food','Tea for brewing','Two uses']),15:('Connect four operations',['Second pan','Shaping','Baking','Selection and storage']),18:('Match actions and processes',['Pan-frying','Gentle rolling','Baking the unfinished tea','Final firing under a round tray']),27:('Explore six stages',['Initial processing','Pile fermentation','Refining','Blending','Shaping','Drying and packing']),32:('What follows rolling?',['Rolling and loosening','Preliminary drying','Shaping and drying']),37:('Preparing tea and flowers',['Preparing tea and flowers','Scenting and aerating','Flower separation and finishing']),38:('Tea material or prepared drink?',['Nanlu border tea','A connection to butter tea']),40:('Explore a repeating sequence',['First steaming','Piling','Steaming again']),43:('Before and after brick shaping',['Before shaping','Compacting the tea','Wrapping and later stages'])}

def main():
    assert (BACKUP/'tea-heritage-map/index.html').exists(), 'Backup required'
    backup_feed=BACKUP/'非遗数据采集新/05_详情页投喂/详情页候选数据.json'
    assert len(json.loads(backup_feed.read_text(encoding='utf-8-sig')))==46
    snapshot=AUDIT/'25项接入前结构化数据.json'
    if not snapshot.exists(): shutil.copy2(backup_feed,snapshot)
    feed=NEW/'05_详情页投喂/详情页候选数据.json'
    rows=json.loads(feed.read_text(encoding='utf-8-sig'))
    pack=json.loads((REVIEW/'审核清单.json').read_text(encoding='utf-8'))
    manifest_path=PROJECT/'data/explore_assets.js'
    manifest=json.loads(manifest_path.read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
    for a in pack['assets']:
        origin=REVIEW/a['path']
        assert hashlib.sha256(origin.read_bytes()).hexdigest()==a['sha256']
        dest=f"assets/explore/{a['id']}-v{a['version']}.png"
        shutil.copy2(origin,PROJECT/dest)
        manifest['items'][a['id']]=dict(id=a['id'],version=f"v{a['version']}",type='ai-schematic-illustration',path=dest,approved=True,sha256=a['sha256'],sourceUrls=a['source_urls'],disclosure='AI辅助示意，非现场照片',approvalEvidence=EVIDENCE,approvalDate='2026-10-06')
        a.update(approved=True,status='用户已批准并接入',production_integrated=True,approvalEvidence=EVIDENCE,approvalDate='2026-10-06')
    for d in pack['drafts']:
        row=next(r for r in rows if r['id']==d['item_id'])
        n=int(d['item_id'].split('-')[-1]);title_en,unit_en=EN[n]
        kind={'quiz':'quiz-cards'}.get(d['type'],d['type'])
        units=[dict(id=u['id'],titleZh=u['title'],titleEn=unit_en[i],contentZh=(u['title']+'对应的工序是'+u['text']+'。') if kind=='match' else u['text'],sourceIds=u['sourceIds']) for i,u in enumerate(d['units'])]
        e=dict(id=f'round3-approved-{n:02d}-v1',type=kind,sectionKey='practice',titleZh=d['title'],titleEn=title_en,units=units,noteZh=d['note'],sourceIds=['ihchina-project'])
        if kind=='quiz-cards':
            options_en={9:['Blending','Fermentation'],12:['Tea for food and tea for brewing','Only tea for brewing'],38:['No: material and prepared drink differ','Yes: the names are interchangeable']}[n]
            e.update(questionZh=d['question'],questionEn=title_en,options=[dict(id=f'option-{i}',titleZh=x,titleEn=options_en[i]) for i,x in enumerate(d['options'])],correctOption=f"option-{d['answer']}",answerUnitId=units[0]['id'],correctMessageZh=d['correct_feedback'],wrongMessageZh=d['incorrect_feedback'],correctMessageEn='Exactly. Explore the distinction below.',wrongMessageEn='These are different concepts. Take a look at the explanation below.')
        if kind=='sequence':
            e.update(stageIds=[u['id'] for u in units],sequenceIds=[u['id'] for u in units],initialOrder=[u['id'] for u in reversed(units)],sequenceContextZh='前面还有拣草摊青、青锅和揉捻。这里只排后面的四个连续环节。',sequenceContextEn='These four operations follow leaf sorting and spreading, the first pan, and rolling.')
        if kind=='match':
            names_en=['Fixation','Rolling','Initial firing','Final firing']
            e['matchOptions']=[dict(id=u['id'],titleZh=d['units'][i]['text'],titleEn=names_en[i]) for i,u in enumerate(units)]
            for u in units:u['matchId']=u['id']
        if n in [9,37]:e.update(assetId='C02' if n==9 else 'C01',imageAltZh='拼配概念示意，不代表茶类、配方或比例' if n==9 else '花茶概念示意，不代表实物鉴定或窨制比例')
        row['detailExperience']=e
        section=dict(key='practice',titleZh='核心工艺',contentZh='\n\n'.join(u['contentZh'] for u in units),sourceIds=['ihchina-project'])
        row['detailSections']=[section if s['key']=='practice' else s for s in row['detailSections']]
        if not any(s['key']=='practice' for s in row['detailSections']):row['detailSections'].append(section)
        d.update(review_status='用户已批准并接入',production_integrated=True,approvalEvidence=EVIDENCE)
    flower=next(r for r in rows if r['id']=='tea-item-02')['detailExperience']
    flower.update(assetId='C01',imageAltZh='花与茶相遇的概念示意，非现场照片，不表示真实比例')
    assert sum(bool(r.get('detailExperience') or r.get('practiceExperience')) for r in rows)==25
    feed.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    manifest['lastApprovalDate']='2026-10-06'
    manifest_path.write_text('window.TEA_EXPLORE_ASSETS = '+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    (REVIEW/'接入批准记录.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    page=REVIEW/'统一审核页.html'
    page_text=page.read_text(encoding='utf-8')
    if '本批内容已批准接入' not in page_text:
        page_text=page_text.replace('<main>','<main><aside class="notice"><strong>本批内容已批准接入（2026-10-06）</strong><p>下面保留的是审核时的历史稿，原“待审核／未接入”标签不再表示当前状态。正式地图现为25项互动。</p><a href="../../../../tea-heritage-map/index.html">打开最新地图</a> · <a href="接入批准记录.json">查看批准版本记录</a></aside>',1)
        page.write_text(page_text,encoding='utf-8')
    trace=[dict(item_id=d['item_id'],unit_id=u['id'],text=u['text'],source_url=d['source_url'],sourceIds=u['sourceIds'],access_date=d['access_date']) for d in pack['drafts'] for u in d['units']]
    (NEW/'03_来源追溯/第三轮批准接入来源.json').write_text(json.dumps(trace,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    sync()
    print('25 experiences, 30 approved assets. Prior state preserved in '+str(BACKUP))

if __name__=='__main__':main()
