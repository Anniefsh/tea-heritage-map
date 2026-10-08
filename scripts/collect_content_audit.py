"""Snapshot the official project pages; never turn extracted sentences into copy."""
import datetime
import hashlib
import json
import urllib.request
from pathlib import Path
from build_verified_detail_data import extract_main_text

P = Path(__file__).resolve().parents[1]
OUT = P.parent / '非遗数据采集新/04_审计与差异/全项目内容复审-20261008'

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = json.loads((P.parent / '非遗数据采集新/05_详情页投喂/详情页候选数据.json').read_text(encoding='utf-8-sig'))
    target = OUT / '官方页面快照.json'
    existing = json.loads(target.read_text(encoding='utf-8')) if target.exists() else []
    records = {r['item_id']: r for r in existing}
    for item in rows:
        if records.get(item['id'], {}).get('status') == 'retrieved':
            continue
        record = dict(item_id=item['id'], name=item['name'], url=item['sourceUrl'], checked_at=datetime.datetime.now().isoformat(), status='unavailable')
        try:
            request = urllib.request.Request(record['url'], headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=25) as response:
                raw = response.read()
                record.update(http_status=response.status, resolved_url=response.url)
            text = extract_main_text(raw.decode('utf-8', errors='replace'))
            assert len(text) > 70 and 'project_details/' in record['resolved_url']
            record.update(status='retrieved', text=text, sha256=hashlib.sha256(raw).hexdigest())
        except Exception as error:
            record['error'] = str(error)
        records[item['id']] = record
        target.write_text(json.dumps(list(records.values()), ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        print(item['id'], record['status'], len(record.get('text', '')), flush=True)

if __name__ == '__main__':
    main()
