"""Prepare an allowlisted static distribution; do not publish local review or backup material."""
import json
import csv
import re
import shutil
from pathlib import Path
from content_quality import validate
P=Path(__file__).resolve().parents[1]
OUT=P.parent/'线上预览发布/tea-map/dist'
OUT.mkdir(parents=True,exist_ok=True)
files=['data/english_labels.js','index.html','app.js','styles.css','experience.css','detail-experience.css','experience-core.js','experience-render.js','experience-ui.js','detail-experience.js','sort-pointer.js','assets/china_official_admin_v2.js','assets/map_compliance_meta.js','assets/china_admin_reference_gs2016_1600.webp','assets/sources/scope-register.csv']
assets=json.loads((P/'data/explore_assets.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
for a in assets['items'].values():
    assert a['approved']
    files.append(a['path'])
    a.pop('approvalEvidence',None)
for file in files:
    dest=OUT/file; dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(P/file,dest)
def clean(x):
    if isinstance(x,dict):return {k:clean(v) for k,v in x.items() if k not in ['originalUrl','scope_source_local']}
    if isinstance(x,list):return [clean(v) for v in x]
    if isinstance(x,str) and (x.startswith('file:') or re.match(r'^[A-Z]:[/\\]',x)):
        return 'assets/sources/scope-register.csv'
    return x
data=clean(json.loads((P/'data/tea_heritage.json').read_text(encoding='utf-8')))
validate(data['items'])
scope=OUT/'assets/sources/scope-register.csv'
with scope.open(encoding='utf-8-sig',newline='') as f:
    reader=csv.DictReader(f);fields=reader.fieldnames;register=list(reader)
with scope.open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader()
    writer.writerows({k:('本地原始清单（未公开）' if isinstance(v,str) and re.search(r'file:///|[CD]:[/\\]',v) else v) for k,v in r.items()} for r in register)
assert len(data['items'])==46
assert sum(bool(r.get('detailExperience') or r.get('practiceExperience')) for r in data['items'])==13
(OUT/'data').mkdir(exist_ok=True)
for file,content in [('tea_heritage.json',json.dumps(data,ensure_ascii=False,indent=2)),('tea_heritage_data.js','window.TEA_HERITAGE_DATA = '+json.dumps(data,ensure_ascii=False)+';'),('explore_assets.js','window.TEA_EXPLORE_ASSETS = '+json.dumps(assets,ensure_ascii=False)+';')]:
    (OUT/'data'/file).write_text(content+'\n',encoding='utf-8')
html=(OUT/'index.html').read_text(encoding='utf-8')
html=html.replace('<head>','<head>\n  <meta name="robots" content="noindex,nofollow">',1)
(OUT/'index.html').write_text(html,encoding='utf-8')
(OUT/'robots.txt').write_text('User-agent: *\nDisallow: /\n',encoding='utf-8')
for url in re.findall(r'(?:src|href)="([^"]+)"',html):
    if not url.startswith(('http','#','data:')):assert (OUT/url).exists(),url
for path in OUT.rglob('*'):
    if path.is_file() and path.suffix in ['.js','.json','.html','.css','.csv']:
        text=path.read_text(encoding='utf-8-sig')
        assert not re.search(r'file:///|[CD]:[/\\]|C%3A|D%3A',text),path
print(json.dumps(dict(files=sum(p.is_file() for p in OUT.rglob('*')),bytes=sum(p.stat().st_size for p in OUT.rglob('*') if p.is_file()),projects=46,experiences=13)))
