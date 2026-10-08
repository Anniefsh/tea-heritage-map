"""Build an isolated approval pack; never mutate production data or asset approvals."""
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
NEW = ROOT / '非遗数据采集新'
BASE = NEW / '06_图片采集台账/第三轮互动待审'
OUT = BASE / '定稿审核'
DATA = NEW / '05_详情页投喂/详情页候选数据.json'
AUDIT = NEW / '04_审计与差异/第三轮互动'


def draft(n, kind, title, units, note, question='', options=None, answer=0):
    return dict(item_id=f'tea-item-{n:02d}', type=kind, title=title,
                units=[dict(id=f'u{i+1}', title=t, text=c, sourceIds=['ihchina-project']) for i, (t, c) in enumerate(units)],
                note=note, question=question, options=options or [], answer=answer,
                review_status='待用户审核', production_integrated=False)


DRAFTS = [
    draft(9, 'quiz', '拼配和发酵，是一回事吗？', [
        ('拼配：组合原料', '项目介绍把拼配描述为依据不同茶叶品种的特点进行组合。这里不提供配方、比例或等级判断。'),
        ('发酵：另一个概念', '同一介绍将发酵称为“人工后发”的特殊技艺，并将它与拼配并列为关键技艺。两者不应混成同一个动作。')
    ], '插画只示意组合，不代表大益配方或真实原料的颜色与比例。', '把不同茶料按其特点进行组合，更接近哪个概念？', ['拼配', '发酵']),
    draft(12, 'quiz', '酸茶只有冲泡这一种用法吗？', [
        ('食用茶', '官方介绍中的食用茶，是发酵完成后的湿茶，可与配料通过烹饪制成菜肴。'),
        ('饮用茶', '饮用茶由湿茶经晒干等加工制成，可冲泡饮用。'),
        ('区分用途，不做配方', '两种用途均见于本项目介绍。本体验不教授家庭发酵、不提供配料与用量，也不引入健康功效。')
    ], '不把未经加工的鲜叶当作可以直接食用的酸茶。', '官方介绍将德昂酸茶分成哪两种？', ['食用茶与饮用茶', '只供冲泡的一种茶']),
    draft(15, 'sequence', '炒与焙之间，四个环节怎样衔接？', [
        ('二锅', '在官方七道工序列表中，二锅位于揉捻之后、做坯整形之前。'),
        ('做坯整形', '这一步紧接二锅，之后才进入列表中的烘焙。'),
        ('烘焙', '官方介绍强调炒焙结合；本环节之后接精选储存。'),
        ('精选储存', '这是本次截取的四个连续环节的末项，并非新加的一道工序。')
    ], '只排列官方七道工序中的末四项；不是完整制作教程，不含温度和时长。'),
    draft(18, 'match', '四个动作名称，各对应哪道工序？', [
        ('下锅炒', '杀青'), ('轻滚转', '揉捻'), ('焙生坯', '毛火'), ('盖上圆簸复老烘', '足火')
    ], '对应关系来自黄山毛峰专属段落，不套用页面前部的绿茶通述；不演示手势与烘具形制。'),
    draft(27, 'guide', '复杂制作，先认识六个大阶段', [
        ('初制', '官方将采摘、炒青等列入初制阶段。'),
        ('渥堆发酵', '这是初制后单列的阶段。本体验只介绍阶段名称，不提供洒水、测温或培养操作。'),
        ('精制', '过筛、分级等被归在精制阶段。'),
        ('拼配', '开汤、评级等被归在拼配阶段。'),
        ('成型', '蒸茶、紧压等被归在成型阶段。'),
        ('烘干包装', '降湿、复烘等被归在最后这一组流程中。')
    ], '六个大阶段是官方分组，不等于全部制作只有六道工序。'),
    draft(32, 'guide', '揉捻之后，不是直接结束', [
        ('揉捻与解块', '官方流程在揉捻之后列出解块，再进入烘坯。'),
        ('烘坯', '烘坯位于解块之后、做形之前，是分段加工中的一个环节。'),
        ('做形与烘干', '列表随后有做形（初干）和烘干（提香）。干燥与成形不能被笼统写成一个动作。')
    ], '仅说明列表中的前后关系，不采用页面中口径不同的采摘时点，不模拟热锅手感。'),
    draft(37, 'guide', '花茶制作里，鲜花与茶各有准备', [
        ('茶坯与鲜花的准备', '官方九道工序中列有茶坯制作、花源选择和鲜花养护。'),
        ('窨制与通花', '玉兰打底、窨制拼和与通花散热也在该项目的工序列表中。'),
        ('起花与后续整理', '列表后部包括起花、烘焙及匀堆装箱。本页用分组阅读，不把分组冒充完整工艺步骤。')
    ], '吴裕泰工序按其自身项目页解释，不把玉兰打底推广成所有茉莉花茶的共同标准。'),
    draft(38, 'quiz', '原料茶和调制饮品，要分开理解', [
        ('南路边茶', '本项目介绍的是雅安南路边茶的制作技艺，属于黑茶制作技艺。'),
        ('饮用联系', '官方介绍提到南路边茶可用于调制酥油茶；原料茶与调制后的饮品不是同一层概念。')
    ], '只说明原料与饮品的关系，不编配方、不规定民族饮用习惯。', '南路边茶可用于调制酥油茶，二者因此就是同一个概念吗？', ['不是：原料茶与调制饮品要区分', '是：两个名字可以完全替换']),
    draft(40, 'cycle', '为什么不能排成只走一次的工序？', [
        ('初蒸', '官方描述在揉捻整形之后进入初蒸。'),
        ('沤堆', '沤堆连接初蒸与复蒸，属于介绍重点说明的一段工艺。'),
        ('复蒸', '官方说明这几个环节存在反复。因此，本导览可以回看起点，但不把一次浏览当作完成制作。')
    ], '“再看一轮”只用于阅读，不模拟真实加工次数、条件或完成标准。'),
    draft(43, 'guide', '筑茶前后，几个名称怎样理解？', [
        ('筑茶之前', '官方列表先列配料渥堆、煮熬茶釉、茶釉炒茶，再到制封灌封。'),
        ('扶梆筑茶', '介绍将茶叶放入模具并捶压夯实，与形成茶砖外形相联系。'),
        ('扎封与后续阶段', '扶梆筑茶后列有扎封锥封、自然发花。本体验只标明流程位置，不教授菌种培养或辨认。')
    ], '不画未经核形的筑茶梆子，不放菌落示意图，不提供温度、时长与健康功效。')
]

TYPES = {'quiz': '猜题与翻卡', 'sequence': '局部排序', 'match': '动作名称配对', 'guide': '阶段导览', 'cycle': '循环阅读导览', 'quiz-cards': '猜题与翻卡', 'hotspots': '器具图片热点', 'region-links': '地域关联（原有保留）', 'lineage': '师承关系（原有保留）', 'practice': '工艺／礼俗探索'}

QUIZ_FEEDBACK = {
    'tea-item-09': ('对，就是拼配！关键在于把不同茶料组合起来，和发酵是两回事。', '这里说的是拼配：把不同茶料组合起来。发酵是另一项技艺，往下看看它们的区别。'),
    'tea-item-12': ('猜对了！酸茶不只可以泡着喝，也有做成菜肴的食用茶。', '其实两种都有：食用茶可以做成菜肴，饮用茶则用来冲泡。一起看看它们有什么不同。'),
    'tea-item-38': ('没错！南路边茶是原料茶，酥油茶是用它调制的饮品，要分开理解。', '它们有联系，但不能画等号：南路边茶可以用来调制酥油茶，原料茶和饮品不是同一个概念。')
}


def main():
    if (OUT/'接入批准记录.json').exists():
        raise SystemExit('本批已批准接入；审核历史稿不再重新生成，以免覆盖批准记录。')
    OUT.mkdir(parents=True, exist_ok=True)
    rows = json.loads(DATA.read_text(encoding='utf-8-sig'))
    sources = {r['item_id']: r for r in json.loads((AUDIT / '38项官方页面复读.json').read_text(encoding='utf-8'))}
    previous = {r['item_id']: r for r in json.loads((AUDIT / '38项互动适配清单.json').read_text(encoding='utf-8'))}
    byid = {r['id']: r for r in rows}
    for d in DRAFTS:
        row, source = byid[d['item_id']], sources[d['item_id']]
        d.update(name=row['name'], province=row['province'], source_url=source['url'], access_date=source['checked_at'], source_sha256=source['sha256'], type_label=TYPES[d['type']])
        if d['item_id'] in QUIZ_FEEDBACK:
            d['correct_feedback'], d['incorrect_feedback'] = QUIZ_FEEDBACK[d['item_id']]
    drafts_byid = {d['item_id']: d for d in DRAFTS}
    final = []
    for r in rows:
        existing = r.get('detailExperience') or r.get('practiceExperience')
        d = drafts_byid.get(r['id'])
        keep = bool(existing or d)
        old = previous.get(r['id'], {})
        final.append(dict(item_id=r['id'], name=r['name'], province=r['province'], planned_interaction=keep,
                          status='已接入，保留' if existing else '待审，尚未接入' if d else '本轮不做互动，保留阅读',
                          type=TYPES.get(existing.get('type', 'practice'), '工艺／礼俗探索') if existing else d['type_label'] if d else '阅读',
                          reason='保留现有体验' if existing else '官方文字足以支撑；不依赖补拍或用户提供资料' if d else old.get('reason', ''),
                          exclusion_materials=old.get('materials', '') if not keep else '',
                          source_url=old.get('source_url') or next((x['url'] for x in r['references'] if x['id']=='ihchina-project'), '')))
    assert len(final)==46 and sum(x['planned_interaction'] for x in final)==25
    assert len(DRAFTS)==10 and sum(x['status']=='已接入，保留' for x in final)==15
    assets = [
        dict(id='C01', version=2, path='素材/C01-花茶概念-v2.png', title='花与茶相遇', item_ids=['tea-item-02','tea-item-37'], purpose='花茶导览的概念配图，不用于花形鉴定或还原窨花比例', source_urls=[sources['tea-item-02']['url'], sources['tea-item-37']['url']], prompt_summary='沿用米纸、细线淡彩风格，以白色重瓣小花和泛化茶叶表达花茶相遇；无器具、人物、标签或工艺参数。v1花形有误认风险，已撤出；v2缩小花形并去除显眼黄色花蕊。'),
        dict(id='C02', version=1, path='素材/C02-拼配概念-v1.png', title='不同茶料的组合', item_ids=['tea-item-09'], purpose='只辅助解释拼配概念，不表示品牌配方、茶料等级、比例或绿茶与红茶的混合', source_urls=[sources['tea-item-09']['url']], prompt_summary='米纸细线水彩，两个小组泛化干茶叶与下方混合叶片；无箭头、品牌、容器、手势、文字或参数；颜色仅便于区分视觉群组，不表示茶类。')
    ]
    for a in assets:
        a.update(status='待用户审核', approved=False, production_integrated=False, kind='AI辅助概念示意，非现场照片', generation_method='内置图片生成工具', sha256=hashlib.sha256((OUT/a['path']).read_bytes()).hexdigest())
    bundle = dict(date='2026-10-06', existing_count=15, new_pending_count=10, planned_count=25, reading_count=21, assets=assets, drafts=DRAFTS, projects=final)
    (OUT/'审核清单.json').write_text(json.dumps(bundle, ensure_ascii=False, indent=2)+'\n',encoding='utf-8')
    template=(Path(__file__).parent/'round3_review_template.html').read_text(encoding='utf-8')
    payload=json.dumps(bundle, ensure_ascii=False).replace('<','\\u003c')
    (OUT/'统一审核页.html').write_text(template.replace('__REVIEW_DATA__',payload),encoding='utf-8')
    # Old entry points remain available but must no longer imply that excluded pilots await evidence.
    notice='<aside style="padding:20px;background:#e7edde;color:#294335;border:2px solid #526447;margin:20px"><strong>范围已于2026-10-06收敛：最终拟做25项，另21项本轮不做互动，不再等待补资料。</strong><p><a href="定稿审核/统一审核页.html">打开最新统一审核页：2张插画＋10组互动文案＋46项去留清单</a></p><p>以下是历史方案，原“待素材／后续候选”状态已由新清单替代。擂茶任务、油茶热点、赵李桥观察镜已撤出本轮。</p></aside>'
    for name in ['01_38项适配与体验入口.html','02_创新试点待审说明.html']:
        p=BASE/name
        text=p.read_text(encoding='utf-8')
        if '范围已于2026-10-06收敛' not in text:
            text=text.replace('<main>','<main>'+notice,1)
            p.write_text(text,encoding='utf-8')
    print('Review pack: 25 planned = 15 existing + 10 pending; 21 reading; 2 pending images. Production untouched.')


if __name__=='__main__':
    main()
