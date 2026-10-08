"""Apply reviewed round-two content and exact approved illustrations, then derive outputs."""
import csv
import hashlib
import json
import shutil
from pathlib import Path
from sync_feed import main as sync

PROJECT = Path(__file__).resolve().parents[1]
NEW = PROJECT.parent / '非遗数据采集新'
STAGING = NEW / '06_图片采集台账/第二轮五项目待审'
FEED = NEW / '05_详情页投喂/详情页候选数据.json'
DATE = '2026-10-05'
SOURCE = ['ihchina-project']


def unit(id, zh, en, text, **extra):
    return dict(id=id, titleZh=zh, titleEn=en, contentZh=text, sourceIds=SOURCE, **extra)


def section(key, title, text):
    return dict(key=key, titleZh=title, contentZh=text, sourceIds=SOURCE)


CONTENT = {
    'tea-item-35': {
        'summary': '从生火煮水到冲泡分茶，潮州工夫茶把器具使用与待客礼俗联系在一起。',
        'english': 'Chaozhou Gongfu tea brings together water heating, brewing, serving and hospitality. Its utensils have distinct roles, including a clay stove, a water kettle, a brewing pot and tasting cups.',
        'sections': [
            section('overview', '项目简介', '潮州工夫茶是潮汕地区的饮茶习俗，通常使用乌龙茶。它不仅涉及茶叶冲泡，也包括生火、煮水、温器、分茶与品饮等环节。不同器具承担各自的用途，操作之间相互衔接，形成兼有饮茶与待客意义的茶事活动。'),
            section('history', '历史脉络', '项目介绍将潮州工夫茶的渊源追溯至宋代，并记载这一饮茶方式在清代中期已较为盛行，且传播到东南亚地区。'),
            section('practice', '礼俗流程', '项目介绍列有泥炉生火、砂铫煮水、温器、壶中置茶、高冲、刮沫、淋盖、烫杯、低洒茶汤及品饮等环节。泥炉用于生火，砂铫用于煮水，茶壶承担冲泡，茶杯用于分盛茶汤与品饮。'),
            section('cultural_value', '文化价值与地域关联', '潮州工夫茶把饮茶方式与地方生活礼俗结合起来。其冲泡、分茶和品饮方式，为理解潮州社会习俗与地方生活文化提供了线索。')
        ],
        'experience': dict(id='chaozhou-teaware-v1', type='hotspots', sectionKey='practice', titleZh='一席茶，四种器具', titleEn='Explore the tea setting', assetId='B01', noteZh='点击图中器具或下方名称。器具示意不代表标准摆位，也不是完整礼仪教程。', sourceIds=SOURCE, units=[
            unit('stove', '泥炉', 'Clay stove', '项目介绍从泥炉生火讲起。泥炉与砂铫配合，分别承担生火与煮水的用途。', x=29, y=35),
            unit('kettle', '砂铫', 'Water kettle', '砂铫是煮水器具，与用于冲泡的茶壶不同。介绍中的掏水、煮水和提铫高冲环节均与它有关。', x=75, y=39),
            unit('pot', '茶壶', 'Brewing pot', '茶壶中放入乌龙茶并注水冲泡。项目介绍还提及刮沫、淋盖与向杯中低洒茶汤等动作。', x=29, y=77),
            unit('cup', '茶杯', 'Tasting cup', '茶杯用来承接与品饮茶汤。介绍中还列有烫杯、滚杯等与杯具有关的准备动作。', x=75, y=80)
        ])
    },
    'tea-item-17': {
        'summary': '安吉白茶的名字与浅色叶片有关，而其制作技艺列在绿茶类别中。',
        'english': 'Anji white tea is listed as a green-tea making craft. The official introduction describes pale leaf blades with green veins and a process that includes fixation, shaping and drying. Its name alone does not determine its tea category.',
        'sections': [
            section('overview', '项目简介', '安吉白茶制作技艺流传于浙江安吉，项目介绍以溪龙乡为产地背景。鲜叶叶片色泽浅，叶脉呈绿色，是理解其名称的一条线索。非遗项目名称将这项技艺归入绿茶制作技艺，因此不能只凭名字中的“白茶”二字判断茶类。'),
            section('practice', '核心工艺', '项目介绍中的手工制作由采摘和摊放开始，随后进行杀青理条、初烘、摊凉、复烘及收灰干燥。鲜叶薄而茎梗较粗，手工处理需要兼顾叶片与茎梗状态，并保持叶张完整。'),
            section('cultural_value', '文化价值与地域关联', '安吉白茶体现了地方茶树鲜叶特征与加工方式之间的联系。将浅色叶片与绿茶制作方法放在一起观察，有助于区分茶的名称、鲜叶外观与茶类归属这三个不同概念。'),
            section('inheritance', '传承保护', '项目介绍记录了安吉县溪龙乡开展手工炒制技艺培训的工作，以传承和推广这一制作方法。这是一项保护工作的文献记录，并非当前传承人数统计。')
        ],
        'experience': dict(id='anji-category-v1', type='quiz-cards', sectionKey='cultural_value', titleZh='叫白茶，就是白茶类吗？', titleEn='A name is not a tea category', assetId='B02', noteZh='可以猜一猜，也可以直接翻卡看解释。不计分，不影响继续浏览。叶片图不是品种鉴定标准。', sourceIds=SOURCE,
            options=[dict(id='green', titleZh='绿茶', titleEn='Green tea'), dict(id='white', titleZh='白茶', titleEn='White tea')], correctOption='green', units=[
                unit('name', '看名称与叶色', 'Name and leaf colour', '官方介绍描述叶片浅色、叶脉绿色。名称与这种鲜叶外观有关，不应把叶片画成纯白色，也不能据此直接判断茶类。'),
                unit('process', '看制作方法', 'Look at the craft', '这项技艺包含杀青理条，再经过初烘、摊凉、复烘等环节。这里关注方法，不模拟未经核实的温度变色实验。'),
                unit('category', '再看茶类归属', 'Check the category', '中国非物质文化遗产网把安吉白茶制作技艺列在绿茶制作技艺之下。理解茶类时，应结合登记名称与制作方法，而不只看商品或地方名称。')
            ])
    },
    'tea-item-24': {
        'summary': '扬州富春以茶与茶点相伴；魁龙珠茶的地域线索在不同来源中有差异。',
        'english': 'Fuchun in Yangzhou combines tea service with handmade tea pastries. The official heritage introduction connects Kuilongzhu tea with Longjing, Kuizhen and Zhulan. Sources differ on the regional attribution of Zhulan, so the interactive diagram identifies the account it follows.',
        'sections': [
            section('overview', '项目简介', '富春茶点制作技艺与扬州富春茶社相联系。它将茶艺与传统手工点心制作结合，茶与茶点共同构成地方饮食文化的一部分。魁龙珠茶是项目介绍中的一条茶饮线索，可以从中观察不同地方茶品在扬州茶社中的联系。'),
            section('history', '历史脉络', '中国非物质文化遗产网项目介绍记载，富春茶社创建于清光绪十一年，即1885年。茶社将花卉、茶艺、点心和菜肴相结合，形成了富春茶点的饮食形式。'),
            section('practice', '核心品种与制作要点', '富春点心沿用传统手工制作方法，茶艺与点心制作相伴。项目介绍中的魁龙珠茶涉及龙井、魁针和珠兰三条原料线索；其中珠兰的地域归属在不同来源中有不同表述。'),
            dict(key='cultural_value', titleZh='文化价值与地域关联', contentZh='按中国非物质文化遗产网项目介绍，魁龙珠茶联系浙江龙井、安徽魁针与福建珠兰，分别从味、色、香展开说明。人民日报海外版2022年报道则写扬州自窨珠兰，并将地域概括为皖、浙、苏。两者存在地域表述差异，不能把福建与江苏的说法当作已经一致核实的结论。', sourceIds=['ihchina-project', 'people-fuchun-2022'])
        ],
        'experience': dict(id='fuchun-connections-v1', type='region-links', sectionKey='cultural_value', titleZh='一盏茶，三条地域线索', titleEn='Three regional connections', assetId='B03', noteZh='此图按中国非物质文化遗产网项目介绍组织，不表示实际配比或最佳搭配。中央茶盏仅为概念符号。', sourceIds=SOURCE, units=[
            unit('zhejiang', '浙江 · 龙井 · 味', 'Zhejiang · Longjing · Taste', '项目介绍以浙江龙井说明茶味这一线索。点击下方入口可浏览本清单中的浙江项目，不代表那些项目都是富春的供料来源。', province='浙江'),
            unit('anhui', '安徽 · 魁针 · 色', 'Anhui · Kuizhen · Colour', '项目介绍以安徽魁针（太平猴魁）说明茶色这一线索。这里呈现文献关联，不以插画推断标准茶汤颜色。', province='安徽'),
            unit('fujian', '福建 · 珠兰 · 香', 'Fujian · Zhulan · Aroma', '项目介绍写福建珠兰，并从香气说明这一线索。来源差异提示同时保留另一报道中的扬州珠兰说法；地域归属仍需进一步核实。', province='福建')
        ])
    },
    'tea-item-06': {
        'summary': '漳平水仙制作融合闽北与闽南乌龙茶工艺，师徒传授是了解其延续的一条线索。',
        'english': 'Zhangping Shuixian is an oolong-tea craft from Fujian. The official introduction describes a combination of northern and southern Fujian practices and records a teaching connection from Liu Yongfa to Deng Guanjin and then to Zhang Qisheng. This is a partial historical relationship, not a current inheritor directory.',
        'sections': [
            section('overview', '项目简介', '漳平水仙茶制作技艺流传于福建漳平，属于乌龙茶制作技艺。项目介绍将它与当地的自然条件及茶树鲜叶联系起来，并说明其制作融合闽北与闽南乌龙茶工艺。制作者需要观察鲜叶状态并结合天气条件调整操作，而不能把一组固定参数视为全部技艺。'),
            section('history', '历史脉络', '官方介绍记载，清末刘永发从建瓯水吉镇引进水仙茶苗，并将闽北乌龙茶制作方法与本地制作经验相结合。这是项目文献所记录的一条技艺发展线索。'),
            section('practice', '核心工艺', '制作者根据天气变化决定采茶时机，结合日照强度把握晒茶时长，并观察茶青的色泽和香气来调整摇青、炒青等操作。项目介绍还记载紧压包装的做法，使茶便于使用、储存和运输。'),
            section('cultural_value', '文化价值与地域关联', '漳平水仙的地方特点体现在产地条件与乌龙茶制作经验的结合。项目介绍中的闽北、闽南工艺联系，为理解地方技艺的吸收与发展提供了线索。'),
            section('inheritance', '传承保护', '项目介绍记录了刘永发传授邓观金、邓观金传授张旗生的师承关系。这里仅呈现该介绍中的部分关系，不将其解释为完整家谱，不从师承记述推断亲属关系，也不把图中人物自动列为现行国家级代表性传承人。')
        ],
        'experience': dict(id='zhangping-lineage-v1', type='lineage', sectionKey='inheritance', titleZh='手艺如何从一人传给另一人', titleEn='Follow a teaching connection', noteZh='官方介绍中的部分传承关系。不是完整家谱、亲属关系图或当代代表性传承人名录。', sourceIds=SOURCE, units=[
            unit('liu', '刘永发', 'Liu Yongfa', '官方项目介绍记载刘永发向邓观金传授技艺。这是本图选取的师承起点，不代表该技艺的全部源头。'),
            unit('deng', '邓观金', 'Deng Guanjin', '项目介绍记载邓观金承接刘永发的技艺，并向张旗生传授。本图只表达这两条有记载的师徒联系。'),
            unit('zhang', '张旗生', 'Zhang Qisheng', '项目介绍将张旗生与邓观金的传授联系起来。仅凭这一记述，不能推断当前全部传承人或后续传承支系。')
        ], edges=[dict(fromId='liu', toId='deng', sourceIds=SOURCE), dict(fromId='deng', toId='zhang', sourceIds=SOURCE)])
    },
    'tea-item-28': {
        'summary': '千两茶先制成黑毛茶，再经过精深加工形成竹篾包裹的茶柱。',
        'english': 'Qianliang tea production has two stages: making dark raw tea and further processing. The interactive sequence covers only four consecutive finishing operations: loading, compacting, hoop binding and closing. It is not a complete production tutorial.',
        'sections': [
            section('overview', '项目简介', '千两茶制作技艺与湖南安化的黑茶生产相联系。官方介绍将制作分为黑毛茶制作与精深加工两大阶段。认识这项技艺时，既要了解茶叶前期加工，也要区分后续装篓、踩压与包扎等连续操作。竹篾包裹的茶柱是观察成品外形的一条线索，不代替对实际技艺的学习。'),
            section('practice', '核心工艺', '黑毛茶制作包括杀青、揉捻、渥堆、复揉与烘焙。精深加工则从筛分、拼配和软化开始，继而装篓、踩压、扎箍、锁口，之后还有冷却与干燥。装篓与锁口之间的连续操作只是精深加工的一部分。'),
            section('cultural_value', '文化价值与地域关联', '千两茶把黑茶加工与竹篾包装结合起来。茶叶制作、压制和包扎彼此衔接，形成安化地方制茶经验中的一组连续操作。')
        ],
        'experience': dict(id='qianliang-sequence-v1', type='sequence', sectionKey='practice', titleZh='从茶叶到茶柱', titleEn='From leaves to a tea column', noteZh='先认识两大阶段，再尝试排列四个连续环节。可随时看顺序；不计分、不计时，也不代表掌握实际技艺。', sourceIds=SOURCE,
            stageIds=['raw', 'finishing'], sequenceIds=['load', 'press', 'bind', 'close'], initialOrder=['bind', 'load', 'close', 'press'], units=[
                unit('raw', '黑毛茶制作', 'Making dark raw tea', '先经过杀青、揉捻、渥堆、复揉、烘焙，形成供后续加工的黑毛茶。这里不模拟各环节的操作参数。'),
                unit('finishing', '精深加工', 'Further processing', '由筛分、拼配和软化进入装篓、踩压、扎箍、锁口，之后仍需冷却和干燥。下方排序只抽取中间四步。', assetId='B05'),
                unit('load', '装篓', 'Loading', '在软化等前序处理之后进入装篓，再进行踩压。插画只示意开口篾篓及材料，不表示装填设备或完整操作。', assetId='B04'),
                unit('press', '踩压', 'Compacting', '官方所列顺序中，踩压接在装篓之后、扎箍之前。这里不模拟真实压力或动作强度。'),
                unit('bind', '扎箍', 'Hoop binding', '扎箍位于踩压之后、锁口之前，是这组连续加工环节中的包扎步骤。'),
                unit('close', '锁口', 'Closing', '锁口位于扎箍之后。完成这组四步并不等于完成千两茶制作，后面还包括冷却、干燥。')
            ])
    }
}


def main():
    rows = json.loads(FEED.read_text(encoding='utf-8-sig'))
    assert len(rows) == 46 and set(CONTENT) <= {r['id'] for r in rows}
    audit = NEW / '04_审计与差异/第二轮轻交互'
    audit.mkdir(parents=True, exist_ok=True)
    backup = audit / '变更前结构化数据.json'
    if not backup.exists():
        shutil.copy2(FEED, backup)
    log_path = STAGING / '05_素材审核与生成记录.json'
    log = json.loads(log_path.read_text(encoding='utf-8'))
    manifest_path = PROJECT / 'data/explore_assets.js'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8').split('=', 1)[1].strip().removesuffix(';'))
    approval = dict(date=DATE, quote='可以继续', context='完整素材审核页展示五张插画与文字师承图后，用户确认继续接入。')
    for a in log['assets']:
        src = STAGING / a['file']
        assert hashlib.sha256(src.read_bytes()).hexdigest().upper() == a['sha256'], a['id']
        version = a['file'].split('_')[1]
        dest = f"assets/explore/{a['id']}-{version}.png"
        shutil.copy2(src, PROJECT / dest)
        a['status'] = 'approved'
        if 'approval' not in a:
            a['approval'] = approval
        manifest['items'][a['id']] = dict(id=a['id'], version=version, type='ai-schematic-illustration', path=dest, approved=True, sha256=a['sha256'], sourceUrls=a.get('sources', ['https://www.ihchina.cn/project_details/15247.html']), disclosure=log['label'], approvalEvidence=approval, limits=a.get('limits', a.get('notes', '')))
    manifest['round2ApprovalDate'] = DATE
    manifest_path.write_text('window.TEA_EXPLORE_ASSETS = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    log['integrationStatus'] = '已接入本地网页；未发布'
    log['round2Approval'] = approval
    log['textLayouts'] = [dict(id='G01', version='v1', status='approved', type='sourced-text-lineage', approval=approval, source='https://www.ihchina.cn/project_details/23784.html')]
    log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for row in rows:
        if row['id'] not in CONTENT:
            continue
        content = CONTENT[row['id']]
        row['shortSummaryZh'] = row['leadZh'] = content['summary']
        row['shortSummarySourceIds'] = SOURCE
        row['descriptionZh'] = content['sections'][0]['contentZh']
        row['descriptionEn'] = content['english']
        row['detailSections'] = content['sections']
        row['detailExperience'] = content['experience']
        for u in row['detailExperience']['units']:
            if u.get('province') in ['浙江', '安徽', '福建']:
                u['province'] += '省'
        row['keyFeatures'] = [dict(textZh=content['summary'], sourceIds=SOURCE)]
        row['lastVerified'] = row['contentReviewedAt'] = DATE
        for ref in row['references']:
            if ref['id'] == 'ihchina-project':
                ref['accessDate'] = DATE
        if row['id'] == 'tea-item-24':
            row['references'] = [r for r in row['references'] if r['id'] != 'people-fuchun-2022'] + [dict(id='people-fuchun-2022', title='人民日报海外版：富春茶点相关报道（2022-11-24）', url='https://paper.people.com.cn/hwbwap/html/2022-11/24/content_25950738.htm', type='official-media', authorityLevel='官媒', accessDate=DATE)]
            row['contentConflicts'] = [dict(textZh='地域来源存在差异：非遗官网项目介绍写“福建珠兰”；人民日报海外版2022年报道写“扬州自窨珠兰”，并概括为皖、浙、苏。本图按前者组织，地域归属尚未统一核实。', sourceIds=['ihchina-project', 'people-fuchun-2022'])]
            row['sourceStatus'] = 'needs-review'
            row['shortSummarySourceIds'] = ['ihchina-project', 'people-fuchun-2022']
            row['keyFeatures'][0]['sourceIds'] = row['shortSummarySourceIds']
            row['detailExperience']['units'][-1]['sourceIds'] = row['shortSummarySourceIds']
            next(s for s in row['detailSections'] if s['key'] == 'practice')['sourceIds'] = row['shortSummarySourceIds']
    FEED.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    trace_path = NEW / '03_来源追溯/第二轮互动来源映射.csv'
    with trace_path.open('w', encoding='utf-8-sig', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['item_id', 'source_title', 'source_url_or_path', 'source_type', 'authority_level', 'supported_fields', 'access_date', 'notes'])
        writer.writeheader()
        for row in rows:
            if row['id'] not in CONTENT:
                continue
            for ref in row['references']:
                if ref['id'] not in ['ihchina-project', 'people-fuchun-2022']:
                    continue
                fields = [f"detailExperience.units.{u['id']}" for u in row['detailExperience']['units'] if ref['id'] in u['sourceIds']]
                fields += [f"detailExperience.edges.{edge['fromId']}-{edge['toId']}" for edge in row['detailExperience'].get('edges', []) if ref['id'] in edge['sourceIds']]
                fields += [f"detailSections.{s['key']}" for s in row['detailSections'] if ref['id'] in s['sourceIds']]
                if ref['id'] in row['shortSummarySourceIds']:
                    fields += ['shortSummaryZh', 'keyFeatures']
                writer.writerow(dict(item_id=row['id'], source_title=ref['title'], source_url_or_path=ref['url'], source_type=ref['type'], authority_level=ref['authorityLevel'], supported_fields=','.join(fields), access_date=DATE, notes='仅复核本轮正文与互动；登记字段冲突仍保留。' if ref['id'] == 'ihchina-project' else '富春珠兰地域差异，供对照，不覆盖非遗官网表述。'))
    (audit / '本轮内容与素材记录.json').write_text(json.dumps(dict(date=DATE, changedItems=list(CONTENT), approval=approval, scope=46, registrationFieldsChanged=False, facts=CONTENT, conflict=log['conflicts']), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    sync()


if __name__ == '__main__':
    main()
