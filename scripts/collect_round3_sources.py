"""Read official pages for the remaining scope, retaining evidence separately from production data."""
import datetime
import hashlib
import json
import time
import urllib.request
from pathlib import Path
from build_verified_detail_data import extract_main_text

PROJECT = Path(__file__).resolve().parents[1]
OUT = PROJECT.parent / '非遗数据采集新/04_审计与差异/第三轮互动'


def main():
    baseline = OUT / '变更前结构化数据.json'
    items = json.loads(baseline.read_text(encoding='utf-8-sig')) if baseline.exists() else json.loads((PROJECT / 'data/tea_heritage.json').read_text(encoding='utf-8'))['items']
    remaining = [i for i in items if not i.get('practiceExperience') and not i.get('detailExperience')]
    assert len(remaining) == 38
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    for item in remaining:
        url = item['sourceUrl']
        record = dict(item_id=item['id'], name=item['name'], province=item['province'], url=url, checked_at=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(), status='unavailable')
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=18) as response:
                raw = response.read()
                record['http_status'] = response.status
                record['resolved_url'] = response.url
            html = raw.decode('utf-8', errors='replace')
            text = extract_main_text(html)
            if len(text) < 70 or 'project_details/' not in record['resolved_url']:
                raise ValueError('Project text not identified; do not treat the response as reviewed evidence')
            record.update(status='fetched-awaiting-review', text=text, sha256=hashlib.sha256(raw).hexdigest())
        except Exception as error:
            record['error'] = str(error)
        records.append(record)
        (OUT / '38项官方页面复读.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(item['id'], record['status'], len(record.get('text', '')), flush=True)
        time.sleep(.15)


if __name__ == '__main__':
    main()
