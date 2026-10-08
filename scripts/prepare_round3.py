"""Curated decisions grounded in reread official pages; no unapproved image is published."""
import html
import json
import shutil
from pathlib import Path
from sync_feed import main as sync

PROJECT = Path(__file__).resolve().parents[1]
NEW = PROJECT.parent / '非遗数据采集新'
AUDIT = NEW / '04_审计与差异/第三轮互动'
REVIEW = NEW / '06_图片采集台账/第三轮互动待审'
FEED = NEW / '05_详情页投喂/详情页候选数据.json'
SOURCE = ['ihchina-project']
DATE = '2026-10-05'

# Each decision concerns this specific project's own official introduction, not a shared tea template.
DECISIONS = {
  1: ('quiz-cards', '本轮文字版', '名字有红字，就属于红茶吗？', '介绍明确关联乌龙茶；保留复式与因叶施艺，不把名称当分类依据。', '无需新图'),
  2: ('guide', '本轮文字版', '花与茶相遇之后，花还一直留在茶里吗？', '窨花、通花、起花、烘焙有说明；存在复窨，不设唯一完整排序。', '无需新图；后续可审窨花概念图'),
  3: ('guide', '后续候选', '初制与精制筛分承担不同任务', '有抖分捞选簸漂及复式萎凋描述；缺各手法完整释义，先补证。', '筛分器具实拍与动作定义'),
  4: ('quiz-cards', '本轮文字版', '初制的核心，是萎凋干燥还是炒揉？', '只解释官方明确的核心工艺，移除正文中残断的古籍引文。', '无需新图'),
  5: ('guide', '本轮文字版', '采摘、初制、精制各做什么', '资料明确三部分及反复包揉烘焙，导览而非单次排序。', '无需新图'),
  8: ('sequence', '后续候选', '晒青茶怎样进入蒸压成型', '有蒸揉压定型等次序；需先将仪式与制作分区，避免模拟祭礼。', '蒸压器具须核形、先审图'),
  9: ('quiz-cards', '后续候选', '拼配与发酵不是同一个动作', '资料可支撑两个概念；不以虚构配方、品牌价值或口感评分出题。', '可先文字版'),
  10: ('hotspots', '后续候选', '从原料到成型看沱茶', '介绍有蒸揉压制，器具形制及成品细部需补实拍。', '具体沱茶与模具官方实拍'),
  12: ('quiz-cards', '后续候选', '酸茶既可食用，也可饮用', '官方区分食用茶与饮用茶；不设计家庭发酵或益生菌功效题。', '可先文字版'),
  13: ('guide', '本轮文字版', '十大手法是一套手法，不是十步流水线', '手法名单明确但缺动作细释；只做非顺序分类导览，不模拟手势。', '无需新图'),
  14: ('guide', '后续候选', '茶宴中的迎客、分茶与退堂', '礼仪有文献记载；尊重宗教文化，不评判仪式优劣或做闯关。', '仪式场景需要合法官方照片'),
  15: ('sequence', '后续候选', '炒与焙如何衔接', '有七道工序，可截取二锅至烘焙的连续段；避开功效和无时点人数。', '可先文字版'),
  16: ('quiz-cards', '后续候选', '紫笋名称中形与色的线索', '有名称论述，提取文本开头不完整；须对照原页再写完整解释。', '鲜叶细节必须有实拍依据'),
  18: ('guide', '后续候选', '杀青、揉捻、毛火与足火', '项目特有段落列明四环节；不照搬前半段通用绿茶描述。', '可先文字版'),
  19: ('reading', '暂缓', '采摘标准有线索，但制法证据不够', '项目页主要是历史与获奖，缺专属工序细节；不套用绿茶流程。', '补官方制法与叶形照片'),
  20: ('guide', '本轮文字版', '初制完成之后，为什么还有精制', '两阶段明确；避免与滇红四步做重复排序，突出精制处理。', '无需新图'),
  21: ('reading', '暂缓', '先补六安瓜片专属工艺', '页面主要为绿茶通述与历史，不从常识补摘片、扳片等具体事实。', '补项目专属官方来源'),
  22: ('guide', '后续候选', '揉捻整形与搓团显毫', '项目页描述连续炒揉，不宜割裂成固定单次动作排序。', '手部动作须实拍核形'),
  23: ('hotspots', '后续候选', '斗笠状烘笼承担什么作用', '器具与烘焙用途明确；先补烘笼实物及图像使用条件。', '烘笼官方实拍与待审插画'),
  26: ('compare-observe', '待素材', '青砖与米砖的原料观察窗', '项目介绍区分完整鲜叶与茶末；只观察对应实物，不以AI纹理证明差异。', '两张对应原料照片及复用条件待核实'),
  27: ('guide', '后续候选', '复杂工艺怎样分为六个大阶段', '官方有初制至包装六组；不展开77道未逐一说明的小工序。', '可先文字版'),
  29: ('reading', '暂缓', '发花不做菌种或功效识别游戏', '正文含唯一性、健康功效等高风险断言；先补中性工艺证据。', '补官方非功效工艺说明'),
  30: ('guide', '本轮文字版', '为什么会出现两次包与烘', '仅解释初包复包与双式闷黄；不模拟发酵比例、气温或冲泡沉浮。', '无需新图'),
  31: ('utensil-task', '待素材', '选择研磨与捞渣所用的工具', '非遗官网及全南县政府明确擂钵、擂棍、捞子的用途；不出配方题。', '已找到器物照片链接，但图片目检未完成，不据此生成或接入'),
  32: ('guide', '后续候选', '揉捻、解块和分段干燥', '制作描述详细，但采摘时点与标准存在不同口径，不用作题目。', '可先文字版'),
  33: ('reading', '暂缓', '避免再复制一个红茶四步互动', '初精制与现有滇红、祁红体验重叠；待发现独特且易解释的知识点。', '暂无新增素材需求'),
  34: ('reading', '暂缓', '广东凉茶先保留文化阅读', '与港澳条目正文高度重复，含无剂量限制等不适宜指导性表述。', '不做配方、服用或功效题'),
  36: ('reading', '暂缓', '张一元先保留专属历史阅读', '与福州花茶互动重复，独立窨制细节少，正文开头提取不完整。', '补项目专属窨制依据'),
  37: ('guide', '后续候选', '鲜花养护到起花的作用', '有九道工序；不与福州不同做法混成统一答案。', '可先文字版'),
  38: ('quiz-cards', '后续候选', '边茶与用它调制的饮品不是同一层概念', '只讲原料茶与饮用方式的联系，不提供配方或绝对化饮用结论。', '可先文字版'),
  39: ('guide', '后续候选', '制茶师与火丹师怎样配合', '项目介绍明确两种职责；不扩展第二套茶席任务或温度模拟。', '器具与协作场景须补照片'),
  40: ('guide', '后续候选', '初蒸、沤堆、复蒸为何不能只排一次', '官方明确存在反复，采用循环导览，不给一次排列的完整工艺答案。', '可先文字版'),
  41: ('hotspots', '待素材', '铁锅与打油茶动作', '官方明确铁锅及捶打；不能混用擂钵插画，也不把配方变为教程。', '铁锅、捶打工具的当地实物图待核形'),
  42: ('hotspots', '后续候选', '生锅、熟锅与茶把', '器具关联清楚；手法有反复，不借别的茶类炒锅图代替。', '本项目茶把和锅具照片'),
  43: ('guide', '后续候选', '筑茶前后的几个阶段', '工序明确；仅做结构导览，不设计发花培养或用量参数。', '可先文字版'),
  44: ('guide', '后续候选', '搓团与提毫怎样关联', '可解释工艺概念；不模拟锅温和手接触热锅，不夸大一次完成。', '关键动作实拍待补'),
  45: ('reading', '暂缓', '香港凉茶保留独立条目', '与广东澳门正文相同，不能据共同介绍生成地方专属配方或器具题。', '补香港项目专属文化来源'),
  46: ('reading', '暂缓', '澳门凉茶保留独立条目', '与广东香港正文相同，先补地方资料，不重复制作相同互动。', '补澳门项目专属文化来源')
}


def unit(id, zh, en, text):
    return dict(id=id, titleZh=zh, titleEn=en, contentZh=text, sourceIds=SOURCE)


def guide(title, en, units, note, ordered=False):
    return dict(type='guide', sectionKey='practice', titleZh=title, titleEn=en, units=units, noteZh=note, ordered=ordered, sourceIds=SOURCE)


def quiz(title, en, question, question_en, options, answer, feedback, feedback_en, units):
    return dict(type='quiz-cards', sectionKey='practice', titleZh=title, titleEn=en, questionZh=question, questionEn=question_en, options=[dict(id=i, titleZh=z, titleEn=e) for i,z,e in options], correctOption=answer, answerUnitId=units[0]['id'], correctMessageZh='答对了。'+feedback, wrongMessageZh='可以再看一眼。'+feedback, correctMessageEn='Correct. '+feedback_en, wrongMessageEn='Take another look. '+feedback_en, units=units, noteZh='可直接看解释，不计分、不强制答对。结论依据本项目官方介绍，不凭名称或外观作鉴定。', sourceIds=SOURCE)


EXPERIENCES = {
  1: quiz('大红袍名字里的“红”', 'A name is not a category', '大红袍应放在哪一类茶中理解？', 'Which tea category includes Dahongpao?', [('red','红茶','Black tea'),('oolong','乌龙茶','Oolong tea')], 'oolong', '项目介绍将武夷岩茶制作与乌龙茶相联系，不应仅凭“红”字归为红茶。', 'The official introduction connects Wuyi rock tea with oolong, not with the word red in its name.', [unit('category','先看茶类','Check the category','项目介绍在武夷岩茶制作技艺的叙述中明确提到乌龙茶。名称中的一个字，不能代替茶类依据。'),unit('craft','再看工艺线索','Look at the craft','官方介绍列出复式萎凋、做青、双炒双揉和低温久烘等环节。这里只认识关键线索，不将其当作完整十道工序列表。'),unit('context','还要看地方经验','Local experience','介绍强调根据茶青状态把握制作，并记载与制茶相伴的喊山、斗茶等地方习俗。')]),
  2: guide('花香留下，花与茶怎样分开', 'How tea and flowers meet', [unit('scent','窨花','Scenting','让茶坯与茉莉鲜花接触，是官方介绍中的关键环节。茶叶与花并非简单混合后就结束加工。'),unit('air','通花与复窨','Aerating and rescenting','通花要结合在窨品的状态掌握，之后可收堆复窨。不同窨次与原料条件影响操作，因此不能只用一次排序代表全部制作。'),unit('separate','起花','Separating flowers','起花是把茶和花分开。这解释了为什么花茶有花香，却不必把所有鲜花留在成品中。'),unit('dry','烘焙','Drying','烘焙需要排除多余水分，同时顾及香气的保留。这里不提供温度、时长或窨次标准。')], '这是关键环节导览，不是完整单次流水线。复窨与提花不简化成统一必经答案。'),
  4: quiz('白茶初制，抓住哪两个核心', 'Recognise white-tea processing', '福鼎白茶初制的两个核心工艺是什么？', 'Which two processes are central to Fuding white tea?', [('wither','萎凋与干燥','Withering and drying'),('fry','炒制与揉捻','Pan-frying and rolling')], 'wither', '官方介绍将萎凋和干燥作为初制核心，并说明制作中不炒不揉。', 'The source identifies withering and drying, without pan-frying or rolling.', [unit('core','两项核心','Two core processes','福鼎白茶的初制以萎凋与干燥为核心。它与其他茶类的炒制、揉捻方式不能直接互换。'),unit('scope','核心不等于只有两步','Core versus full process','同一介绍还列出堆积、拣剔等操作。因此“两项核心”不意味着完整生产只有两个动作。'),unit('refine','初制之后还有精制','Further processing','项目介绍另列毛茶的拣剔、匀堆、烘焙和装箱等精制内容，初制与精制应区分理解。')]),
  5: guide('把铁观音制作分成三个层次', 'Three parts of Tieguanyin craft', [unit('pick','采摘','Harvesting','采摘部分涉及采摘期、标准与采摘技术，是进入后续制作之前的原料环节。'),unit('initial','初制','Initial processing','官方初制流程包含晒青、凉青、摇青、炒青、揉捻以及包揉、烘焙等操作，其中包揉和烘焙存在反复。'),unit('refine','精制','Refining','精制包括筛分、拣剔、拼堆、烘焙、摊凉和包装。制作者还需结合季节、气候与鲜叶状态掌握操作。')], '三部分是阅读层次，不把反复包揉、烘焙简化为一次动作。', True),
  13: guide('十种手法，不是十道固定步骤', 'Ten methods, not ten fixed steps', [unit('set','认识这套手法','Recognise the method set','项目介绍列出抖、带、挤、甩、挺、拓、扣、抓、压、磨十种龙井炒制手法。这是手法集合，不是官方给定的十步先后顺序。'),unit('practice','理解经验的作用','Understand skilled practice','这些手法来自西湖龙井茶区长期的生产经验。仅凭名称不能完整复原每一种手部动作。'),unit('boundary','为什么不做动作排序','Why there is no sorting task','官方项目介绍没有逐项说明这十种手法必须按单一顺序执行，因此本页不把排列名单当作唯一正确答案。')], '本模块只解释手法集合与工序顺序的区别，不模拟手势或热锅操作。'),
  20: guide('初制结束，祁红还要经历什么', 'Beyond initial Qimen processing', [unit('initial','初制','Initial processing','初制包括萎凋、揉捻、发酵和干燥，形成进入精制的茶料。'),unit('sort','精制中的筛选整理','Sorting and selection','官方精制列表包含筛分、切断、风选和拣剔。它们属于后续整理环节，不应与初制四道工序混写。'),unit('finish','精制中的复火与匀堆','Refiring and blending','复火、匀堆也在精制列表之内。两大阶段共同构成官方介绍中的传统祁红制作。')], '本轮突出初制与精制的区别，避免重复已有滇红四步排序；不提供加工参数。', True),
  30: guide('一前一后，两次包与烘', 'Two wrapping stages', [unit('first','初烘与初包','First drying and wrapping','官方列出的工序中，初烘后接初包，再进入复烘。这里保留阶段名称和前后联系。'),unit('second','复烘与复包','Repeated drying and wrapping','复包在复烘之后，后面还有足火与精选。不能把第一次包的完成当作整个工艺的结束。'),unit('yellow','双式闷黄','Two-stage yellowing','项目介绍将两次闷黄称为双式闷黄，是理解黄茶技艺的一条线索。不据此推演温度、时间或发酵比例。')], '只认识已记载的阶段，不模拟真实闷黄条件或冲泡沉浮。')
}


def main():
    if (REVIEW/'定稿审核/接入批准记录.json').exists():
        raise SystemExit('本批已批准接入，请勿用早期准备脚本覆盖正式版本。')
    AUDIT.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    rows = json.loads(FEED.read_text(encoding='utf-8-sig'))
    backup = AUDIT / '变更前结构化数据.json'
    if not backup.exists(): shutil.copy2(FEED, backup)
    baseline = json.loads(backup.read_text(encoding='utf-8-sig'))
    evidence = json.loads((AUDIT / '38项官方页面复读.json').read_text(encoding='utf-8'))
    by_id = {x['item_id']: x for x in evidence}
    assert len(DECISIONS) == len(evidence) == 38
    decisions = []
    for original in baseline:
        n = int(original['id'].split('-')[-1])
        if n not in DECISIONS: continue
        kind, priority, topic, reason, materials = DECISIONS[n]
        source = by_id[original['id']]
        assert source['status'] == 'fetched-awaiting-review', original['id']
        decisions.append(dict(item_id=original['id'], name=original['name'], province=original['province'], type=kind, status=priority, topic=topic, reason=reason, materials=materials, source_url=source['url'], accessed_at=source['checked_at'], source_sha256=source['sha256'], review='已阅读本次抓取正文；仅确认本条适配判断，不等于全文事实无误', implementation='文字版已接入' if n in EXPERIENCES else '未接入'))
    for row in rows:
        n = int(row['id'].split('-')[-1])
        if n not in EXPERIENCES: continue
        e = dict(EXPERIENCES[n], id=f'round3-{n:02d}-v1')
        row['detailExperience'] = e
        row['shortSummaryZh'] = row['leadZh'] = e['titleZh'] + '：' + e['units'][0]['contentZh']
        row['shortSummarySourceIds'] = SOURCE
        row['descriptionZh'] = e['units'][0]['contentZh']
        row['descriptionEn'] = {
          1: 'Wuyi rock tea is associated with oolong in the official introduction. Its name alone does not determine its category. The craft includes several linked processing methods.',
          2: 'Fuzhou jasmine tea is made by scenting tea with fresh jasmine flowers. The introduction describes aerating, repeated scenting, separating the flowers and drying. These are selected operations, not a single complete cycle.',
          4: 'Withering and drying are central to initial Fuding white-tea processing. The official account also describes additional handling and refining operations, so two core processes do not mean only two production steps.',
          5: 'Traditional Tieguanyin making comprises harvesting, initial processing and refining. Some rolling and heating operations recur, and makers consider weather and leaf condition.',
          13: 'The official West Lake Longjing introduction names ten hand-processing methods. It does not establish a single mandatory order for those methods, so the interactive guide does not treat them as ten sequential steps.',
          20: 'Qimen black-tea making includes initial processing and refining. The latter includes sorting, cutting, winnowing, picking, refiring and blending.',
          30: 'The Junshan Yinzhen introduction lists initial and repeated wrapping among its processing stages and describes two-stage yellowing. The guide does not simulate production conditions.'
        }[n]
        original = next(x for x in baseline if x['id'] == row['id'])
        replacements = {'overview': dict(key='overview', titleZh='项目简介', contentZh=row['descriptionZh'], sourceIds=SOURCE), 'practice': dict(key='practice', titleZh='核心工艺', contentZh='\n\n'.join(u['contentZh'] for u in e['units']), sourceIds=SOURCE)}
        # Keep unrelated source-backed sections instead of deleting history and protection text.
        row['detailSections'] = [replacements.get(s['key'], s) for s in original.get('detailSections', [])]
        present = {s['key'] for s in row['detailSections']}
        row['detailSections'].extend(s for key, s in replacements.items() if key not in present)
        row['keyFeatures'] = [dict(textZh=e['units'][0]['contentZh'], sourceIds=SOURCE)]
        row['contentReviewedAt'] = row['lastVerified'] = DATE
        for ref in row['references']:
            if ref['id'] == 'ihchina-project': ref['accessDate'] = DATE
    FEED.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (AUDIT / '38项互动适配清单.json').write_text(json.dumps(decisions, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (AUDIT / '本轮新增互动事实卡.json').write_text(json.dumps(EXPERIENCES, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    trace = []
    for row in rows:
        n = int(row['id'].split('-')[-1])
        if n not in EXPERIENCES: continue
        source = by_id[row['id']]
        for u in row['detailExperience']['units']:
            trace.append(dict(item_id=row['id'], unit_id=u['id'], claim=u['contentZh'], source_id='ihchina-project', source_url=source['url'], accessed_at=source['checked_at'], review_scope='本轮互动解释；不代表登记字段或原页面全文重新核验'))
    trace_path = NEW / '03_来源追溯/第三轮互动逐单元来源.json'
    trace_path.write_text(json.dumps(trace, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    cards = ''.join(f'<article><small>{html.escape(r["item_id"])} · {html.escape(r["province"])} · {html.escape(r["status"])}</small><h2>{html.escape(r["name"])}</h2><h3>{html.escape(r["topic"])}</h3><p>{html.escape(r["reason"])}</p><p>素材：{html.escape(r["materials"])}</p><p>状态：{html.escape(r["implementation"])}</p><a href="{html.escape(r["source_url"], quote=True)}" target="_blank" rel="noopener">官方依据</a>' + (f' · <a href="../../../tea-heritage-map/index.html#detail/{r["item_id"]}">体验文字版</a>' if r['implementation']=='文字版已接入' else '') + '</article>' for r in decisions)
    page = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>38项互动适配与第三轮审核</title><style>body{margin:0;background:#f6f1e6;color:#294335;font:16px/1.8 "Microsoft YaHei",sans-serif}main{max-width:1100px;margin:auto;padding:32px 20px}h1,h2,h3{font-family:SimSun,serif}h2{font-size:22px}h3{font-size:18px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px}article{background:#fffdf6;border:1px solid #cdd2bb;border-radius:16px;padding:22px}a{color:#32624b}small{color:#716b52}.notice{padding:20px;border-left:4px solid #a67c42;background:#eee6d3;margin-bottom:24px}</style><main><h1>38项逐项筛选，不为互动而互动</h1><div class="notice">本次已重读38个官方项目页。7项先以无新增图片的文字互动接入；器具图片与双窗观察镜没有强行补图，仍待目检、来源及使用条件核验。排序优化已接入千两茶。未发布。此表是适配与取舍记录，不等于所有原正文已完整核验。</div><p><a href="../../../tea-heritage-map/index.html#detail/tea-item-28">先体验优化后的千两茶排序</a> · <a href="02_创新试点待审说明.html">查看两个创新试点及素材缺口</a></p><div class="grid">' + cards + '</div></main></html>'
    (REVIEW / '01_38项适配与体验入口.html').write_text(page, encoding='utf-8')
    sync()
    print('Reviewed 38; added 7 source-backed text experiences; no new images approved or integrated.')


if __name__ == '__main__': main()
