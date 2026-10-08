"""Derive website data and formal documents from the canonical feed only."""
import csv
import json
import runpy
from pathlib import Path
from content_quality import validate

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent / '非遗数据采集新'
FEED = ROOT / '05_详情页投喂/详情页候选数据.json'


def main():
    rows = json.loads(FEED.read_text(encoding='utf-8-sig'))
    validate(rows)
    assert len(rows) == len({r['id'] for r in rows}) == 46, 'Scope must remain 46 unique projects'
    master = list(csv.DictReader((ROOT / '01_权威主表/46项权威主表.csv').open(encoding='utf-8-sig')))
    assert [r['name'] for r in rows] == [r['official_name'] for r in master], 'Scope order or name changed'
    for row in rows:
        refs = {r['id'] for r in row['references']}
        assert row['sourceUrl'].startswith('https://'), row['id']
        experience = row.get('detailExperience') or {}
        for section in row['detailSections'] + (row.get('practiceExperience') or {}).get('steps', []) + experience.get('units', []) + experience.get('edges', []) + row.get('contentConflicts', []):
            assert section['sourceIds'] and set(section['sourceIds']) <= refs, row['id']
        if experience:
            units = [u['id'] for u in experience['units']]
            assert len(units) == len(set(units)), row['id']
            assert experience['sourceIds'] and set(experience['sourceIds']) <= refs, row['id']
            for edge in experience.get('edges', []):
                assert {edge['fromId'], edge['toId']} <= set(units), row['id']
            if experience['type'] == 'sequence':
                assert set(experience['initialOrder']) == set(experience['sequenceIds']) <= set(units)
    fields = list(dict.fromkeys(k for r in rows for k in r))
    with FEED.with_suffix('.csv').open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in r.items()} for r in rows)
    front_path = PROJECT / 'data/tea_heritage.json'
    front = json.loads(front_path.read_text(encoding='utf-8'))
    front['items'] = rows
    text = json.dumps(front, ensure_ascii=False, indent=2)
    front_path.write_text(text + '\n', encoding='utf-8')
    (PROJECT / 'data/tea_heritage_data.js').write_text('window.TEA_HERITAGE_DATA = ' + text + ';\n', encoding='utf-8')
    generator = runpy.run_path(str(ROOT / '_tools/generate_formal_item_markdown.py'))
    generator['main']()
    print('Canonical feed synchronized: 46 records, CSV, website JSON/JS and formal Markdown.')


if __name__ == '__main__':
    main()
