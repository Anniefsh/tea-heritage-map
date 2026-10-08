"""Editorial release checks, deliberately separate from browser layout tests."""
import re

RETAINED = {f'tea-item-{n:02d}' for n in (1,4,6,7,9,11,12,17,18,25,28,35,38)}
EDITORIAL = re.compile(r'本轮|本体验|本模块|本页不|这里不|不模拟|不提供|不编配方|不计分|不扣分|不强制|不应把.*画成|为什么不做|官方项目介绍没有|项目介绍列出|同一介绍|不能推断|不代表掌握|待补充|待审核|占位|模板|套用页面|not establish|not simulate|does not provide', re.I)
HEALTH = re.compile(r'消脂控糖|降低血糖|降低脂肪|消食健胃|驱湿避瘴|无需医生|无剂量|清心明目|有益菌|保健功效')

def public_text(row):
    fields = ('descriptionZh','descriptionEn','shortSummaryZh','leadZh','leadEn')
    texts = [row.get(k, '') for k in fields]
    texts += [x['contentZh'] for x in row['detailSections']]
    texts += [x['textZh'] for x in row.get('keyFeatures', [])]
    for key, children in [('detailExperience','units'), ('practiceExperience','steps')]:
        e = row.get(key) or {}
        texts += [e.get(k, '') for k in ('titleZh','noteZh','questionZh','correctMessageZh','wrongMessageZh')]
        texts += [u['contentZh'] for u in e.get(children, [])]
    return '\n'.join(texts)

def validate(rows):
    assert len(rows) == len({r['id'] for r in rows}) == 46
    actual = {r['id'] for r in rows if r.get('detailExperience') or r.get('practiceExperience')}
    assert actual == RETAINED, 'Interaction additions require an explicit content audit and revised release list'
    for row in rows:
        assert row.get('translationReview', {}).get('status') == 'reviewed', row['id']
        english = [row.get(k, '') for k in ('nameEn','provinceEn','cityEn','protectionUnitEn','yearBatchEn','categoryEn','teaTypeEn','shortSummaryEn','descriptionEn')]
        english += [s.get('contentEn','') for s in row['detailSections']]
        english += [s.get('titleEn','') for s in row['detailSections']]
        english += [f.get('textEn','') for f in row.get('keyFeatures', [])]
        for field in row.get('fieldReview', []):
            english += [field.get('masterValueEn',''), field.get('officialValueEn','')]
        if row.get('declaredRegion'): english.append(row.get('declaredRegionEn',''))
        for kind, children in [('detailExperience','units'),('practiceExperience','steps')]:
            e = row.get(kind)
            if not e: continue
            english += [e.get('titleEn',''),e.get('noteEn','')]
            for u in e[children]: english += [u.get('titleEn',''),u.get('contentEn','')]
            for u in e.get('options', []) + e.get('matchOptions', []): english.append(u.get('titleEn',''))
        assert all(t.strip() and not re.search(r'[\u3400-\u9fff]', t) for t in english), (row['id'], 'Missing or non-English translation')
        text = public_text(row)
        assert not EDITORIAL.search(text), (row['id'], EDITORIAL.search(text).group() if EDITORIAL.search(text) else '')
        assert not HEALTH.search(text), row['id']
        assert len(row['shortSummaryZh']) <= 90 and row['shortSummaryZh'].endswith('。'), row['id']
        assert row['descriptionEn'] == row['leadEn'], row['id']
        for s in row['detailSections']:
            assert s['contentZh'].strip() and s['contentZh'].endswith('。'), row['id']
            assert s['contentZh'].count('“') == s['contentZh'].count('”'), row['id']
            assert 'ihchina-project' in s['sourceIds'], row['id']
        e = row.get('detailExperience')
        if not e: continue
        assert e['contentReview']['status'] == 'reviewed', row['id']
        assert e['type'] in ('quiz-cards','hotspots','lineage','sequence','match'), row['id']
        assert all(u['contentZh'].strip() and u['sourceIds'] for u in e['units']), row['id']
        if e['type'] == 'quiz-cards':
            assert all(e.get(k) for k in ('questionZh','questionEn','correctMessageZh','wrongMessageZh','correctMessageEn','wrongMessageEn','answerUnitId'))
            assert e['answerUnitId'] in {u['id'] for u in e['units']}
            assert e['correctOption'] in {o['id'] for o in e['options']}
