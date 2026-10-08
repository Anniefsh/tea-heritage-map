"""Apply the individually edited copy and archive every retired interaction."""
import copy
import csv
import json
from pathlib import Path
from reviewed_content import COPY

P = Path(__file__).resolve().parents[1]
ROOT = P.parent / '非遗数据采集新'
FEED = ROOT / '05_详情页投喂/详情页候选数据.json'
AUDIT = ROOT / '04_审计与差异/全项目内容复审-20261008'
RETIRED = {
    2: '阶段名点击只展开文字，未形成有辨识内容的探索。',
    5: '仅按阶段切换正文，取消薄弱导览，保留完整工艺正文。',
    13: '卡片用于解释产品设计限制，不是用户知识体验。',
    15: '排序说明主要复述先后，缺乏足够工序作用内容。',
    20: '只有初制与精制文字分组，改为正常阅读。',
    24: '珠兰茶地域对应存在来源冲突，不用于地域连线互动。',
    27: '仅展开阶段清单，改为正常阅读。',
    30: '薄弱阶段卡改为介绍双式闷黄的正文。',
    32: '仅切换生产清单，改为正常阅读。',
    37: '点击阶段未提供足够操作反馈，改为正文。',
    40: '循环按钮重复同一组文字，没有对应观察变化。',
    43: '仅按术语展开说明，改为正文。',
}
TITLES = dict(overview='项目简介', history='历史脉络', practice='核心工艺', cultural_value='文化与地域', inheritance='传承保护')

def rewrite_units(e, copies):
    assert len(copies) == len(e['units'])
    for u, (title, content) in zip(e['units'], copies):
        u.update(titleZh=title, contentZh=content, sourceIds=['ihchina-project'])

def main():
    rows = json.loads(FEED.read_text(encoding='utf-8-sig'))
    assert {r['id'] for r in rows} == set(COPY) and len(rows) == 46
    AUDIT.mkdir(parents=True, exist_ok=True)
    backup = AUDIT / '复审前结构化数据.json'
    if not backup.exists():
        backup.write_text(json.dumps(rows, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    before = json.loads(backup.read_text(encoding='utf-8'))
    retired, changes = [], []
    for row, old in zip(rows, before):
        n = int(row['id'].split('-')[-1])
        c = COPY[row['id']]
        row.update(shortSummaryZh=c['summary'], leadZh=c['summary'], descriptionZh=c['summary'], descriptionEn=c['english'], leadEn=c['english'],
                   shortSummarySourceIds=['ihchina-project'], contentReviewedAt='2026-10-08', lastVerified='2026-10-08')
        # Scope metadata is not altered by an editorial review of the narrative.
        row['detailSections'] = [dict(key='overview', titleZh='项目简介', contentZh=c['summary'], sourceIds=['ihchina-project'])]
        for key, content in c['sections'].items():
            title = TITLES[key]
            if key == 'practice' and row['category'] == '民俗':
                title = '礼俗与茶事'
            if n == 24 and key == 'practice':
                title = '茶点与茶艺'
            row['detailSections'].append(dict(key=key, titleZh=title, contentZh=content, sourceIds=['ihchina-project']))
        row['keyFeatures'] = [dict(textZh=c['summary'], sourceIds=['ihchina-project'])]
        for ref in row['references']:
            if ref['id'] == 'ihchina-project':
                ref['accessDate'] = '2026-10-08'
        if n in RETIRED:
            retired.append(dict(item_id=row['id'], name=row['name'], reason=RETIRED[n], previous=old.get('detailExperience')))
            row.pop('detailExperience', None)
        changes.append(dict(item_id=row['id'], name=row['name'], source_url=row['sourceUrl'],
                            reviewed_fields=['descriptionZh','descriptionEn','shortSummaryZh','leadZh','leadEn','keyFeatures','detailSections'],
                            interaction='保留并复核' if row.get('detailExperience') or row.get('practiceExperience') else '阅读版',
                            reason=RETIRED.get(n, '逐句改写为项目事实；省略缺乏具体依据的栏目。')))

    by = {int(r['id'].split('-')[-1]): r for r in rows}
    def exp(n): return by[n]['detailExperience']
    rewrite_units(exp(1), [
        ('大红袍属于乌龙茶', '名字中的“红”不代表红茶类。大红袍属于武夷岩茶，归于乌龙茶。'),
        ('做青与焙火', '复式萎凋、做青、双炒双揉和低温久烘，都是武夷岩茶制作中的关键环节。'),
        ('山场中的茶事', '武夷山的茶事还包括喊山、斗茶与茶艺等活动，制茶与地方生活相互联系。')])
    exp(1).update(noteZh='名字会不会让你猜错？选一选，再翻卡找线索。', correctMessageZh='猜对了，是乌龙茶！名字里的“红”说的可不是茶类。', wrongMessageZh='名字确实容易让人想到红茶，不过大红袍属于乌龙茶。翻开卡片看看它的工艺线索。', correctMessageEn='Yes, oolong! The word red in the name does not make it a black tea.', wrongMessageEn='The name can be misleading. Dahongpao is an oolong tea; explore the processing clues below.')
    rewrite_units(exp(4), [
        ('萎凋与干燥', '福鼎白茶初制以萎凋、干燥为核心，制作中不炒不揉。'),
        ('从鲜叶到毛茶', '鲜叶经过萎凋、堆积、干燥与拣剔，形成毛茶。'),
        ('毛茶的精制', '毛茶还要经过手工拣剔、匀堆、烘焙与装箱，成为精制茶。')])
    exp(4).update(noteZh='先选出两项核心工艺，再看看鲜叶如何成为白茶。', correctMessageZh='对，就是萎凋与干燥！福鼎白茶初制不炒不揉。', wrongMessageZh='这次要选萎凋与干燥。福鼎白茶初制不炒不揉，和炒制类茶的做法不同。', correctMessageEn='Yes: withering and drying, without pan-frying or rolling.', wrongMessageEn='Look for withering and drying. Fuding white tea is not pan-fried or rolled.')
    rewrite_units(exp(6), [
        ('刘永发', '清末，刘永发从建瓯水吉引入水仙茶苗，将闽北技艺与本地制茶相结合，并将手艺传给邓观金。'),
        ('邓观金', '客家人邓观金向刘永发学习水仙茶制作，后来又将技艺传给闽南人张旗生。'),
        ('张旗生', '闽南人张旗生从邓观金处承接水仙茶制作技艺，这条师徒联系也连接着不同地方群体。')])
    exp(6)['noteZh'] = '沿着名字展开，看看手艺怎样传下去。这是其中一支师承。'
    rewrite_units(exp(9), [('拼配：组合茶料', '拼配依据不同茶叶品种的特点进行组合，取长补短。'), ('发酵：人工后发', '人工后发酵是大益茶制作的另一项关键技艺，与组合茶料的拼配分别承担不同作用。')])
    exp(9)['noteZh'] = '先选一个答案，再翻开两张卡片比较。'
    exp(12)['units'] = exp(12)['units'][:2]
    rewrite_units(exp(12), [('食用茶：进入菜肴', '食用茶是发酵完成后的湿茶，可以与配料一起烹饪，制成菜肴。'), ('饮用茶：冲泡品饮', '饮用茶由湿茶经过晒干等进一步加工制成，用来冲泡饮用。')])
    exp(12).update(noteZh='同样是酸茶，餐桌上会有哪两种用法？', questionZh='德昂酸茶除了泡着喝，还能怎样使用？', questionEn='Besides brewing, how else is Deang sour tea used?')
    exp(12)['options'][0]['titleZh'] = '加工成食用茶，做成菜肴'
    exp(12)['options'][1]['titleZh'] = '只有冲泡这一种用法'
    exp(12)['options'][0]['titleEn'] = 'Processed edible tea for cooking'
    exp(17).update(questionZh='名字里有“白茶”，安吉白茶属于哪类茶？', questionEn='Which tea category does Anji white tea belong to?', answerUnitId='category',
                   noteZh='从名字猜一猜，再翻卡看看叶色与做法。', correctMessageZh='猜对了，是绿茶！“白”是叶色的线索，制作方法才帮助我们理解茶类。',
                   wrongMessageZh='名字很容易让人想到白茶类，不过安吉白茶是绿茶。往下看看它的叶色和做法。',
                   correctMessageEn='Yes, green tea. The name describes leaf colour; the craft helps explain its category.', wrongMessageEn='The name can be misleading: Anji white tea is a green tea. Explore its leaves and processing below.')
    rewrite_units(exp(17), [('叶色的线索', '安吉白茶的叶片颜色浅，叶脉呈绿色。“白茶”的名称与这种叶色特征相联系。'), ('制作的线索', '采摘、摊放后，茶叶经过杀青理条，再经初烘、摊凉、复烘和收灰干燥。'), ('茶类的答案', '安吉白茶属于绿茶制作技艺。名称相似的茶，制作方法和茶类归属也可能不同。')])
    exp(18)['noteZh'] = '给四个动作选一个工序名称，再点击“检查配对”。'
    exp(28)['noteZh'] = '先看看两个制作阶段，再把四张工序卡排一排。'
    exp(28)['sequenceContextZh'] = '这四步之前是筛分、拼配和软化，之后还要冷却、干燥。'
    rewrite_units(exp(28), [
        ('黑毛茶制作', '鲜叶先经杀青、揉捻、渥堆、复揉和烘焙，成为后续加工所用的黑毛茶。'),
        ('精深加工', '黑毛茶经过筛分、拼配和软化后，装篓踩压、扎箍锁口，再冷却、干燥，逐渐制成茶柱。'),
        ('装篓', '将前面处理过的茶料装入篓中，为接下来的踩压做好准备。'),
        ('踩压', '装篓后把茶料踩紧、压实，使松散茶料成为紧密的茶柱。'),
        ('扎箍', '踩压之后进行扎箍，捆扎茶篓，再进入锁口环节。'),
        ('锁口', '扎箍后锁住篓口，完成这组装篓和捆扎环节，之后还需冷却与干燥。')])
    exp(35)['noteZh'] = '点一点图中的器具，或选择右侧名称，看看各自的用途。'
    rewrite_units(exp(35), [
        ('泥炉', '泥炉生火，为砂铫煮水提供热源。它与煮水的砂铫相配合。'),
        ('砂铫', '砂铫用来煮水。煮好水后提铫高冲，把热水注入泡茶的茶壶。'),
        ('茶壶', '茶壶中放入乌龙茶并注水冲泡，随后刮沫、淋盖，再向杯中低洒茶汤。'),
        ('茶杯', '茶杯承接并供人品饮茶汤。分茶前还有烫杯、滚杯等准备动作。')])
    exp(38).update(titleZh='南路边茶怎样走进酥油茶？', noteZh='选一选，再看看茶与饮品之间的联系。', questionZh='南路边茶与酥油茶是什么关系？', questionEn='How is Nanlu border tea related to butter tea?')
    exp(38)['options'][0]['titleZh'] = '南路边茶可以用来调制酥油茶'
    exp(38)['options'][1]['titleZh'] = '它们是同一种成品的两个名字'
    rewrite_units(exp(38), [('产自雅安的黑茶', '南路边茶产于四川雅安，属于黑茶，传统上供应西藏、青海和川西藏区。'), ('调制成酥油茶', '南路边茶的茶汤可以与酥油、盐等调制成酥油茶，原料茶由此成为另一种饮品。')])
    by[7]['practiceExperience']['noteZh'] = '沿着四道工序，看看一片鲜叶的变化。'
    by[7]['practiceExperience']['steps'][-1]['contentZh'] = '烘焙使茶坯水分蒸发，达到成茶所需的干度，并形成滇红茶的甜香。'
    by[11]['practiceExperience']['noteZh'] = '依次点开三盅茶，看看白族人怎样以茶迎客。'
    by[11]['practiceExperience']['steps'][1]['contentZh'] = '核桃仁、红糖等带来甜味，以苦尽甘来的寓意承接第一道茶。'
    by[11]['practiceExperience']['steps'][2]['contentZh'] = '蜂蜜、花椒、桂皮等带来甜、微麻与苦相融的滋味，寓意对人生经历的回味。'
    by[25]['practiceExperience']['noteZh'] = '点开六项核心技法，认识蒸青与针形整形。'
    enshi = ['高温蒸汽抑制酶的活性，制止茶多酚酶促氧化，并除去青草气。', '薄摊蒸青叶，搧风降温并散去水分，防止茶叶闷黄。', '在焙炉盘上捧叶抛抖、散开叶片，帮助水分蒸发。', '在焙炉上回转揉和对揉，使叶片卷成条形。', '用“铲”的手法炒茶，继续蒸发水分、整理形状。', '通过悬手搓和依托搓整形上光，形成细直的针形。随后还需焙火提香、拣选成品。']
    for step, text in zip(by[25]['practiceExperience']['steps'], enshi): step['contentZh'] = text

    for row in rows:
        e = row.get('detailExperience')
        if e:
            e['contentReview'] = dict(status='reviewed', date='2026-10-08')
        # Preserve all prior unit IDs for retained experiences; remove only an editorial-only unit.
        old = next(r for r in before if r['id'] == row['id'])
        for field in ['id','name','province','city','category','code','yearBatch','protectionUnit','declaredRegion','fieldReview']:
            assert row[field] == old[field], (row['id'], field)
    assert sum(bool(r.get('practiceExperience') or r.get('detailExperience')) for r in rows) == 13
    for name, obj in [('撤下互动与原因.json', retired), ('46项复审记录.json', changes)]:
        (AUDIT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    # Keep before/after statements and reference mappings outside the visitor-facing page.
    differences = [dict(item_id=r['id'], source_url=r['sourceUrl'], before=o, after=r) for o, r in zip(before, rows)]
    (AUDIT / '逐项内容差异.json').write_text(json.dumps(differences, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    trace = ROOT / '03_来源追溯/46项内容复审字段追溯-20261008.csv'
    with trace.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['item_id','source_title','source_url_or_path','source_type','authority_level','supported_fields','access_date','notes'])
        writer.writeheader()
        for row in rows:
            fields = 'shortSummaryZh;descriptionZh;descriptionEn;leadZh;leadEn;keyFeatures;detailSections'
            if row.get('detailExperience') or row.get('practiceExperience'): fields += ';interaction-content'
            writer.writerow(dict(item_id=row['id'], source_title=row['name'], source_url_or_path=row['sourceUrl'], source_type='ihchina-project', authority_level='level-2', supported_fields=fields, access_date='2026-10-08', notes='正文逐句改写；未重新确认登记字段或当代完整传承人名录。'))
    FEED.write_text(json.dumps(rows, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Reviewed 46 records; retained 13 interactions; retired 12; registration unchanged.')

if __name__ == '__main__': main()
