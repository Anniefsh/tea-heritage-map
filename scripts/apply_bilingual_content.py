"""Add complete English fields without changing the reviewed Chinese facts."""
import json
import re
from pathlib import Path
from reviewed_english import SECTIONS, EXPERIENCES

P = Path(__file__).resolve().parents[1]
ROOT = P.parent / '非遗数据采集新'
FEED = ROOT / '05_详情页投喂/详情页候选数据.json'
rows = json.loads(FEED.read_text(encoding='utf-8-sig'))

PROVINCES = dict(line.split('|') for line in '''北京市|Beijing
天津市|Tianjin
河北省|Hebei
山西省|Shanxi
内蒙古自治区|Inner Mongolia
辽宁省|Liaoning
吉林省|Jilin
黑龙江省|Heilongjiang
上海市|Shanghai
江苏省|Jiangsu
浙江省|Zhejiang
安徽省|Anhui
福建省|Fujian
江西省|Jiangxi
山东省|Shandong
河南省|Henan
湖北省|Hubei
湖南省|Hunan
广东省|Guangdong
广西壮族自治区|Guangxi
海南省|Hainan
重庆市|Chongqing
四川省|Sichuan
贵州省|Guizhou
云南省|Yunnan
西藏自治区|Tibet
陕西省|Shaanxi
甘肃省|Gansu
青海省|Qinghai
宁夏回族自治区|Ningxia
新疆维吾尔自治区|Xinjiang
台湾省|Taiwan
香港特别行政区|Hong Kong
澳门特别行政区|Macao
广西|Guangxi
香港|Hong Kong
澳门|Macao'''.splitlines())
for zh, en in list(PROVINCES.items()):
    if zh.endswith(('省', '市')):
        PROVINCES[zh[:-1]] = en

# Location, declared region/organisation, and scope-register safeguarding body.
# Organisation names are descriptive translations unless an official form is cited.
METADATA = '''Wuyishan, Nanping|Wuyishan, Fujian|Wuyishan Cultural Centre
Cangshan District, Fuzhou||Fuzhou Cross-Strait Tea Industry Exchange Association
Fuan, Ningde|Fuan, Ningde, Fujian|Fuan Tea Industry Association
Fuding, Ningde||Fuding Tea Industry Association
Anxi County, Quanzhou|Anxi County, Fujian|Anxi Tea Culture Research Centre
Zhangping, Longyan|Longyan, Fujian|Zhangping Cultural Centre
Fengqing County, Lincang|Fengqing County, Yunnan|Yunnan Dianhong Group Co., Ltd.
Ninger County, Puer|Ninger Hani and Yi Autonomous County, Yunnan|Ninger County Cultural Centre
Menghai County, Xishuangbanna||Menghai Tea Factory
Dali Prefecture|Dali Bai Autonomous Prefecture, Yunnan|Yunnan Xiaguan Tuocha Group
Dali, Dali Prefecture|Dali, Yunnan|Dali Intangible Cultural Heritage Protection Office
Mangshi, Dehong Prefecture|Mangshi, Dehong Dai and Jingpo Autonomous Prefecture, Yunnan|Mangshi Cultural Centre
Hangzhou||Xihu District Longjing Tea Industry Association
Yuhang District, Hangzhou||Jingshan Wanshou Chan Temple
Jinhua|Jinhua, Zhejiang|Zhejiang Caiyunjian Tea Industry
Changxing County, Huzhou|Changxing County, Zhejiang|Changxing County Zisun Tea Culture Research Association
Anji County, Huzhou|Anji County, Zhejiang|Anji White Tea Town Tea Industry Chamber of Commerce
Huizhou District, Huangshan|Huizhou District, Huangshan, Anhui|Xie Yuda Tea Industry
Huangshan District, Huangshan|Huangshan District, Huangshan, Anhui|Huangshan District Tea Industry Association
Qimen County, Huangshan|Qimen County, Anhui|Qimen County Black Tea Association
Yuan District, Luan||Yuan District Tea Industry Association
Wuzhong District, Suzhou|Wuzhong District, Suzhou, Jiangsu|Dongting Mountain Biluochun Tea Industry Association
Nanjing|Nanjing, Jiangsu|Nanjing Shengfeng Tea Industry
Yangzhou|Yangzhou, Jiangsu|Yangzhou Fuchun Tea House
Enshi, Enshi Prefecture|Enshi, Hubei|Enshi Yulu Tea Industry Association
Chibi, Xianning|Chibi, Hubei|Hubei Zhaoliqiao Tea Factory
Wujiagang District, Yichang|Wujiagang District, Yichang, Hubei|Xinding Biotechnology
Anhua County, Yiyang|Anhua County, Hunan|Anhua County Cultural Centre
Yiyang|Yiyang, Hunan|Yiyang Tea Factory
Junshan District, Yueyang||Junshan District Cultural Centre
Quannan County, Ganzhou||Quannan County Cultural Centre
Wuyuan County, Shangrao|Wuyuan County, Jiangxi|Wuyuan County Cultural Centre
Xiushui County, Jiujiang|Xiushui County, Jiujiang, Jiangxi|Jiangxi Ninghong Company
Guangdong||Guangdong Food Industry Association
Chaozhou|Chaozhou, Guangdong|Chaozhou Cultural Centre
Beijing|Beijing Zhang Yiyuan Tea Co., Ltd.|Beijing Zhang Yiyuan Tea Company
Dongcheng District, Beijing|Dongcheng District, Beijing|Beijing Wu Yutai Tea Industry
Yaan|Yaan, Sichuan|Yaan Intangible Cultural Heritage and Ancient Tea Horse Road Centre
Mingshan District, Yaan|Yaan, Sichuan|Mingshan District Intangible Cultural Heritage Protection Centre
Cangwu County, Wuzhou|Cangwu County, Guangxi Zhuang Autonomous Region|Cangwu County Cultural Centre
Gongcheng County, Guilin|Gongcheng Yao Autonomous County, Guilin, Guangxi Zhuang Autonomous Region|Gongcheng County Oil Tea Association
Xinyang|Xinyang, Henan|Xinyang Tea Chamber of Commerce
Xianyang|Xianyang, Shaanxi|Xianyang Mass Art Centre
Duyun, Qiannan Prefecture|Duyun, Guizhou|Duyun Cultural Heritage Protection Centre
Hong Kong SAR||Culture, Sports and Tourism Bureau, Hong Kong
Macao SAR|Cultural Affairs Bureau, Macao SAR|Cultural Affairs Bureau, Macao'''.splitlines()

OFFICIAL_UNITS = {
8: 'Ninger Hani and Yi Autonomous County Cultural Centre',
10: 'Yunnan Xiaguan Tuocha (Group) Co., Ltd.',
11: 'Dali Intangible Cultural Heritage Protection and Management Office',
12: 'Mangshi Cultural Centre (Mangshi Intangible Cultural Heritage Protection Centre)',
15: 'Zhejiang Caiyunjian Tea Industry Co., Ltd.',
18: 'Xie Yuda Tea Industry Co., Ltd.',
20: 'Qimen County Qimen Black Tea Association',
22: 'Dongting Mountain Biluochun Tea Industry Association, Wuzhong District, Suzhou',
23: 'Nanjing Shengfeng Tea Industry Co., Ltd.',
24: 'Fuchun Tea House, Yangzhou Fuchun Catering Services Group Co., Ltd.',
26: 'Hubei Zhaoliqiao Tea Factory Co., Ltd.',
27: 'Xinding Biotechnology Co., Ltd.',
29: 'Yiyang Tea Factory Co., Ltd.',
33: 'Jiangxi Ninghong Co., Ltd.',
36: 'Beijing Zhang Yiyuan Tea Co., Ltd.',
37: 'Beijing Wu Yutai Tea Industry Co., Ltd.',
38: 'Yaan Intangible Cultural Heritage and Ancient Tea Horse Road Research and Protection Centre',
39: 'Mingshan District Intangible Cultural Heritage Protection Centre, Yaan',
41: 'Gongcheng Yao Autonomous County Oil Tea Association',
44: 'Duyun Cultural Heritage Protection and Research Centre',
46: 'Cultural Affairs Bureau, Government of the Macao SAR'
}
SECTION_TITLES = dict(overview='Introduction', history='History', practice='Tea-making craft', cultural_value='Culture and place', inheritance='Passing on the tradition', source_audit='Sources and verification')
STANDALONE = dict(PROVINCES)
STANDALONE.update({'传统技艺': 'Traditional craftsmanship', '民俗': 'Social practices', '绿茶': 'Green tea', '红茶': 'Black tea', '黑茶': 'Dark tea', '白茶': 'White tea', '黄茶': 'Yellow tea', '乌龙茶': 'Oolong tea', '花茶': 'Scented tea', '凉茶': 'Herbal tea', '茶俗': 'Tea customs', '茶艺': 'Tea practices', '茶点': 'Tea refreshments', '茶类相关': 'Tea-related traditions'})

for n, row in enumerate(rows, 1):
    assert row['id'] == f'tea-item-{n:02d}'
    city, declared, unit = METADATA[n-1].split('|')
    row.update(provinceEn=PROVINCES[row['province']], cityEn=city, declaredRegionEn=declared, protectionUnitEn=unit,
               yearBatchEn=re.sub(r'第([一二三四五])批', lambda m: 'Batch '+str('一二三四五'.index(m[1])+1), row['yearBatch']),
               shortSummaryEn=row['descriptionEn'])
    assert bool(declared) == bool(row['declaredRegion']), row['id']
    for field in ('province','city','declaredRegion','protectionUnit','yearBatch','category','teaType'):
        if row.get(field) and row.get(field+'En'):
            STANDALONE[row[field]] = row[field+'En']
    expected = SECTIONS[row['id']]
    assert set(expected) == {s['key'] for s in row['detailSections'] if s['key'] not in ('overview','source_audit')}, row['id']
    for s in row['detailSections']:
        s['contentEn'] = row['descriptionEn'] if s['key']=='overview' else expected.get(s['key'], 'See the registration details and official source below.')
        s['titleEn'] = ('Tea rituals' if row['category']=='民俗' else 'Refreshments and preparation' if n==24 else SECTION_TITLES['practice']) if s['key']=='practice' else SECTION_TITLES[s['key']]
    for feature in row.get('keyFeatures', []):
        feature['textEn'] = row['shortSummaryEn']
    for f in row.get('fieldReview', []):
        assert f['field']=='protectionUnit', (n,f)
        f['masterValueEn']=unit
        f['officialValueEn']=OFFICIAL_UNITS[n]
    e=row.get('detailExperience') or row.get('practiceExperience')
    if e:
        note, units=EXPERIENCES[n]
        e['noteEn']=note
        contents=e.get('units') or e['steps']
        assert {u['id'] for u in contents} == set(units), n
        for u in contents: u['contentEn']=units[u['id']]
    row['translationReview'] = {'date':'2026-10-08','status':'reviewed','basis':'Faithful translation of reviewed Chinese content; terminology reference EN-01 to EN-04. Descriptive English organisation names are not claimed as official names.'}

by={int(r['id'][-2:]):r for r in rows}
def dx(n, **values): by[n]['detailExperience'].update(values)
dx(9, questionEn='Which term means combining different tea materials according to their characteristics?',
   correctMessageEn='Exactly, blending! Combining tea materials is a different skill from fermentation.',
   wrongMessageEn='This is blending: combining tea materials. Fermentation is a separate process. Open the cards to compare.',
   imageAltEn='Conceptual illustration of blending, not a recipe or a representation of proportions')
dx(12, correctMessageEn='Yes! Sour tea can be cooked into dishes as well as prepared for brewing.',
   wrongMessageEn='It has both uses: edible tea goes into dishes, while the drinking form is brewed. Explore the difference below.')
dx(17, imageAltEn='Illustration of pale Anji tea leaves with green veins, not an identification guide')
dx(28, sequenceContextEn='Screening, blending and softening come before these four operations; cooling and drying follow.')
dx(38, correctMessageEn='Exactly! Nanlu border tea is a tea material; butter tea is a drink prepared with it.',
   wrongMessageEn='They are connected, but are not two names for the same thing. Nanlu border tea can be used to prepare butter tea.')
by[38]['detailExperience']['options'][0]['titleEn']='Nanlu border tea can be used to make butter tea'
by[38]['detailExperience']['options'][1]['titleEn']='They are two names for the same finished drink'
by[35]['detailExperience']['units'][1]['titleEn']='Pottery water kettle'
by[28]['detailExperience']['units'][0]['titleEn']='Primary dark-tea processing'
by[25]['practiceExperience']['steps'][1]['titleEn']='Fan and cool'
by[25]['practiceExperience']['steps'][4]['titleEn']='Scoop and shape'
by[37]['nameEn']='Scented Tea Processing Technique (Wu Yutai Jasmine Tea)'
by[38]['nameEn']='Dark Tea Processing Technique (Nanlu Border Tea)'
by[45]['nameEn']='Herbal Tea Preparation (Hong Kong)'
by[46]['nameEn']='Herbal Tea Preparation (Macao)'

def polish_english(value):
    if isinstance(value, list):
        for entry in value: polish_english(entry)
    elif isinstance(value, dict):
        for key, entry in value.items():
            if key.endswith('En') and isinstance(entry, str):
                for old, new in [(r'\bLuan\b', "Lu'an"), (r'\bYaan\b', "Ya'an"), (r'\bPuer\b', "Pu'er"), (r'\bNinger\b', "Ning'er"), (r'\bFuan\b', "Fu'an"), (r'\bJianou\b', "Jian'ou"), (r'\bDeang\b', "De'ang"), (r'\bMacau\b', 'Macao'), ('dark raw tea', 'primary-processed dark tea'), ('rough tea', 'unfinished tea')]:
                    entry = re.sub(old, new, entry)
                value[key] = entry
            else: polish_english(entry)
polish_english(rows)

for row in rows:
    for field in ('city','declaredRegion','protectionUnit','yearBatch'):
        if row.get(field): STANDALONE[row[field]]=row[field+'En']

# Keep translated comparisons equivalent to their Chinese feature text.
for row in rows:
    for f in row.get('keyFeatures', []):
        assert f['textZh']==row['shortSummaryZh'], (row['id'],f)

FEED.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(P/'data/english_labels.js').write_text('window.TEA_ENGLISH_LABELS = '+json.dumps(STANDALONE,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
audit=ROOT/'04_审计与差异/全站双语审核-20261008'
audit.mkdir(exist_ok=True)
record={
 'date':'2026-10-08','projects':46,'experiences':13,
 'translationPolicy':'Official English terminology is used where located. The full project narratives and organisation names are faithful/descriptive translations, not presented as official English quotations. The 46 national-list records are not equated with 46 separate UNESCO inscriptions.',
 'references':[
  {'id':'EN-01','url':'https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884','supports':'Six tea categories: green, yellow, dark, white, oolong, black; tea processing and social practices terminology.'},
  {'id':'EN-02','url':'https://www.ehangzhou.gov.cn/2023-03/28/c_284152.htm','supports':'Enzyme inactivation, yellowing, piling, withering, leaf shaking and cooling, oxidation or fermentation, scenting.'},
  {'id':'EN-03','url':'https://www.fao.org/4/i1592e/i1592e00.pdf','supports':'Black tea: withering, rolling and oxidation (also traditionally called fermentation).'},
  {'id':'EN-04','url':'https://www.fj.gov.cn/english/cultureandtravel/cultureandarts/202504/t20250403_6796773.htm','supports':'Fuzhou jasmine tea scenting terminology only; health/promotional claims are not adopted.'}],
 'glossary':{'红茶':'black tea','黑茶':'dark tea','杀青':'heat fixation (enzyme inactivation)','萎凋':'withering','揉捻':'rolling','红茶发酵':'oxidation','渥堆发酵':'pile fermentation','窨制':'scenting','闷黄':'yellowing','毛茶':'unfinished / primary-processed tea','发花':'flowering (technical process term, not flower scenting)','传承保护':'passing on the tradition / safeguarding'},
 'sourcesByProject':[{'id':r['id'],'chineseFactSource':r['sourceUrl'],'translation':'faithful translation, not an official English quotation'} for r in rows]
}
(audit/'翻译术语与来源.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('English content prepared for 46 projects and 13 experiences.')
