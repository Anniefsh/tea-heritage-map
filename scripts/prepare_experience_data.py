"""Migrate the canonical feed without reading legacy Markdown prose."""
import csv
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROJECT = ROOT / 'tea-heritage-map'
NEW = ROOT / '非遗数据采集新'
FEED = NEW / '05_详情页投喂/详情页候选数据.json'
AUDIT = NEW / '04_审计与差异/轻交互升级'
DATE = '2026-10-04'
RISK = re.compile(r'传说|保健|治疗|治病|肠疾|降压|降脂|降糖|清热|解毒|消炎|疾病|药用|医疗|药理|无毒|剂量|品牌价值|游客|价格|享誉|世界|惟一|唯一|最著名|金奖|荣获|称号|濒危|急需|近年来|目前|当前|现有|万人|亿元')
WORK = re.compile(r'本轮|当前详情|官方项目页将|本页内容依据|按国家级非遗权威清单|官方项目页当前关联|的地域文化联系紧密|地方茶事传统、饮食文化或社区生活')


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def unpack(value):
    return json.loads(value) if isinstance(value, str) and value else (value or [])


def main():
    if any(row.get('practiceExperience') for row in read(FEED)):
        raise SystemExit('Migration already applied. Edit the canonical feed and use scripts/sync_feed.py; do not replay the old snapshot.')
    snapshot = AUDIT / '迁移前快照' / FEED.name
    rows = read(snapshot if snapshot.exists() else FEED)
    front = read(PROJECT / 'data/tea_heritage.json')
    web = read(AUDIT / '官网登记字段复核.json')['items']
    pilots = read(Path(__file__).with_name('pilot_experiences.json'))
    with (NEW / '01_权威主表/46项权威主表.csv').open(encoding='utf-8-sig', newline='') as handle:
        master = {row['id']: row for row in csv.DictReader(handle)}
    assert len(rows) == 46 and set(master) == {row['id'] for row in rows}
    by_id = {item['id']: item for item in front['items']}
    backup = AUDIT / '迁移前快照'
    backup.mkdir(parents=True, exist_ok=True)
    for file in [FEED, PROJECT / 'data/tea_heritage.json', PROJECT / 'data/tea_heritage_data.js']:
        target = backup / file.name
        if not target.exists():
            shutil.copy2(file, target)
    changes, removed = [], []
    for row in rows:
        item_id = row['id']
        for field in ['teaType', 'teaTypeEn', 'icon', 'color', 'categoryEn', 'x', 'y', 'provinceX', 'provinceY', 'lng', 'lat']:
            if field not in row and field in by_id[item_id]:
                row[field] = by_id[item_id][field]
        for field in ['detailSections', 'references', 'representativeInheritors']:
            row[field] = unpack(row.get(field))
        record = web[item_id]
        row['fieldReview'] = []
        row['registrationCheckedAt'] = DATE if record['status'] == 'metadata-read' else ''
        old_declared = row.get('declaredRegion', '')
        row['declaredRegion'] = record.get('declaredRegion', '')
        if old_declared != row['declaredRegion']:
            changes.append({'id': item_id, 'field': 'declaredRegion', 'before': old_declared, 'after': row['declaredRegion'], 'url': row['sourceUrl'], 'reason': '申报主体与所在地分离；不可读取则留空'})
        # Retain the user's master priority and expose conflicts rather than overwrite it.
        for key, master_key in [('protectionUnit', 'protection_unit'), ('code', 'code'), ('category', 'category')]:
            row[key] = master[item_id][master_key]
            if record.get(key) and record[key] != row[key]:
                row['fieldReview'].append({'field': key, 'masterValue': row[key], 'officialValue': record[key], 'url': record['url']})
        if record.get('yearBatch') and re.sub(r'[()（）\s]', '', record['yearBatch']) != re.sub(r'[()（）\s]', '', row['yearBatch']):
            row['fieldReview'].append({'field': 'yearBatch', 'masterValue': row['yearBatch'], 'officialValue': record['yearBatch'], 'url': record['url']})
        row['sourceStatus'] = 'needs-review' if row['fieldReview'] else 'official-partial'
        row['dataQuality'] = 'basic' if row['fieldReview'] or record['status'] == 'unavailable' else 'complete'
        row['reviewNote'] = '登记字段已读取；不表示全文或传承现状已完成专家核验。' if record['status'] == 'metadata-read' else '本次官网读取未成功；保留既有资料，申报主体暂不展示推断值。'
        row['contentReviewedAt'] = DATE if item_id in pilots else row.get('lastVerified', '')
        if item_id in pilots:
            row['lastVerified'] = DATE
        for ref in row['references']:
            if ref['id'] == 'scope-docx':
                ref['originalUrl'] = ref.get('originalUrl', ref['url'])
                ref['available'] = False
                ref['note'] = '原始本地文件目前不在原路径；保留追溯记录，另提供现存范围主表整理副本。'
            if ref['id'] == 'ihchina-project' and record['status'] == 'metadata-read':
                ref['accessDate'] = DATE
                ref['checkedFields'] = ['declaredRegion', 'protectionUnit', 'code', 'category', 'yearBatch']
        if not any(ref['id'] == 'scope-register' for ref in row['references']):
            row['references'].append({'id': 'scope-register', 'title': '46项范围主表（整理副本，非原始DOCX）', 'url': 'assets/sources/scope-register.csv', 'type': 'local-derived-register', 'authorityLevel': 'derived-not-primary', 'accessDate': DATE})
        if item_id == 'tea-item-01':
            row.update(teaType='乌龙茶', teaTypeEn='Oolong Tea', icon='swirl', color='#7c5b3f')
        row['teaTypeSourceIds'] = ['ihchina-project'] if item_id == 'tea-item-01' else (['scope-register'] if row['name'].startswith(row['teaType'] + '制作技艺') else [])
        row['keyFeatures'] = []
        row['practiceExperience'] = None
        if item_id in pilots:
            pilot = pilots[item_id]
            row['shortSummaryZh'] = pilot['summary']
            row['shortSummarySourceIds'] = ['ihchina-project']
            row['keyFeatures'] = [{'textZh': pilot['feature'], 'sourceIds': ['ihchina-project']}]
            row['descriptionEn'] = pilot['english']
            row['practiceExperience'] = {key: pilot[key] for key in ['titleZh', 'titleEn', 'kind', 'noteZh']}
            row['practiceExperience']['steps'] = [{'id': sid, 'titleZh': title, 'titleEn': en, 'contentZh': content, 'sourceIds': ['ihchina-project'], 'assetId': aid} for sid, title, en, content, aid in pilot['steps']]
        seen, sections = set(), []
        order = ['history', 'practice', 'cultural_value', 'inheritance', 'overview']
        source_sections = {s['key']: s for s in row['detailSections']}
        for key in order:
            section = source_sections.get(key)
            if not section:
                continue
            kept = []
            for sentence in re.split(r'(?<=[。！？；])', section['contentZh']):
                sentence = sentence.strip()
                normalized = re.sub(r'\s+', '', sentence)
                reason = 'risk' if RISK.search(sentence) else 'work-note' if WORK.search(sentence) else 'metadata' if ('申报地区或单位为' in sentence or sentence.startswith(row['name'] + '于')) else 'duplicate' if normalized in seen else ''
                if reason:
                    removed.append({'id': item_id, 'section': key, 'reason': reason, 'text': sentence})
                elif sentence:
                    kept.append(sentence)
                    seen.add(normalized)
            if kept:
                section = dict(section, contentZh=''.join(kept))
                if key == 'practice':
                    section['titleZh'] = '礼俗流程' if row['category'] == '民俗' or row['teaType'] in ['茶艺', '茶俗'] else '核心品种与制作要点' if row['teaType'] == '茶点' else '核心工艺'
                sections.append(section)
        if item_id in pilots:
            overview = {'key': 'overview', 'titleZh': '项目简介', 'contentZh': pilots[item_id]['summary'], 'sourceIds': ['ihchina-project']}
        else:
            overview = next((s for s in sections if s['key'] == 'overview'), None)
            if not overview:
                overview = {'key': 'overview', 'titleZh': '项目简介', 'contentZh': f"{row['name']}是收录于{row['province']}的{row['category']}项目，公布批次为{row['yearBatch']}。", 'sourceIds': ['scope-register']}
            first = re.split(r'(?<=[。！？；])', overview['contentZh'])[0]
            row['shortSummaryZh'] = first if len(first) <= 110 else f"从{row['city'] or row['province']}认识{row['name']}，查看技艺、地域与传承资料。"
            row['shortSummarySourceIds'] = overview['sourceIds'] if len(first) <= 110 else ['scope-register']
        row['detailSections'] = [overview] + [s for key in order[:-1] for s in sections if s['key'] == key]
        row['descriptionZh'] = overview['contentZh']
        row['leadZh'] = row['shortSummaryZh']
        row['descriptionEn'] = row['descriptionEn'].split('The official record highlights')[0].strip()
        row['descriptionEn'] = re.sub(r'According to the official record.*?(?=\.|$)\.?', '', row['descriptionEn']).strip()
        row['leadEn'] = row['descriptionEn']
        row['notes'] = ''
        changes.extend({'id': item_id, **f, 'reason': '清单优先，差异保留待核验'} for f in row['fieldReview'])
    FEED.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    fields = list(dict.fromkeys(key for row in rows for key in row))
    with FEED.with_suffix('.csv').open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows({key: json.dumps(value, ensure_ascii=False) if isinstance(value, (list, dict)) else value for key, value in row.items()} for row in rows)
    front['items'] = rows
    front['generatedAt'] = '2026-10-05'
    front['source'] = '非遗数据采集新/05_详情页投喂/详情页候选数据.json'
    (PROJECT / 'data/tea_heritage.json').write_text(json.dumps(front, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (PROJECT / 'data/tea_heritage_data.js').write_text('window.TEA_HERITAGE_DATA = ' + json.dumps(front, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (AUDIT / '字段差异与删减记录.json').write_text(json.dumps({'date': DATE, 'changes': changes, 'removed': removed}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'items': len(rows), 'pilots': 3, 'steps': 13, 'metadataRead': sum(r['status'] == 'metadata-read' for r in web.values()), 'conflicts': sum(bool(row['fieldReview']) for row in rows), 'removedSentences': len(removed)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
