import importlib.util
import json
import unittest
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent / '非遗数据采集新'


def load_module(file):
    spec = importlib.util.spec_from_file_location(file.stem, file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FeedValidation(unittest.TestCase):
    def test_reviewed_public_copy_and_retired_content(self):
        quality = load_module(PROJECT / 'scripts/content_quality.py')
        rows = json.loads((ROOT / '05_详情页投喂/详情页候选数据.json').read_text(encoding='utf-8-sig'))
        quality.validate(rows)
        before = json.loads((ROOT / '04_审计与差异/全项目内容复审-20261008/复审前结构化数据.json').read_text(encoding='utf-8'))
        retired = json.loads((ROOT / '04_审计与差异/全项目内容复审-20261008/撤下互动与原因.json').read_text(encoding='utf-8'))
        self.assertEqual(len(retired), 12)
        for old, row in zip(before, rows):
            for key in ['id','name','province','city','category','code','yearBatch','protectionUnit','declaredRegion']:
                self.assertEqual(old[key], row[key], row['id']+'.'+key)
            self.assertEqual(old['fieldReview'], [{k:v for k,v in f.items() if not k.endswith('En')} for f in row['fieldReview']], row['id']+'.fieldReview')
            for s in row['detailSections']:
                self.assertIn('ihchina-project', s['sourceIds'])

    def test_formal_generator_preserves_complete_reviewed_sentences(self):
        generator = load_module(ROOT / '_tools/generate_formal_item_markdown.py')
        sample = '其名与“芽色带紫；芽形似笋”的描述有关。'
        self.assertEqual(generator.sanitize_section_text(sample), sample)

    def test_official_metadata_layouts_and_missing_values(self):
        parser = load_module(PROJECT / 'scripts/build_verified_detail_data.py')
        for html in [
            '<div class="table"><table><tr><td>保护单位</td><td>某文化馆</td></tr></table></div>',
            '<li><span>保护单位：</span><span>某文化馆</span></li>',
            '<div>保护单位：某文化馆 | 项目编号：X</div>',
        ]:
            self.assertEqual(parser.extract_table_value(html, '保护单位'), '某文化馆')
        self.assertEqual(parser.extract_table_value('<li>申报地区或单位：</li><li>保护单位：某馆</li>', '申报地区或单位'), '')

    def test_formal_markdown_is_current_and_exactly_46(self):
        generator = load_module(ROOT / '_tools/generate_formal_item_markdown.py')
        rows = json.loads((ROOT / '05_详情页投喂/详情页候选数据.json').read_text(encoding='utf-8-sig'))
        files = list((ROOT / '02_单项目资料').glob('*.md'))
        self.assertEqual(len(files), 46)
        for i, row in enumerate(rows, 1):
            text = generator.target_path(i, row).read_text(encoding='utf-8')
            self.assertEqual(text, generator.build_markdown(row), row['id'])
            for heading in ['## 英文摘要', '## 待核验项', '## 与旧库差异说明', '## 媒体状态']:
                self.assertNotIn(heading, text)
            self.assertIn('## 可追溯来源', text)
            self.assertIn('https://www.ihchina.cn/project_details/', text)
            self.assertIn('scope-register.csv', text)

    def test_current_check_counts_match_the_audit(self):
        rows = json.loads((ROOT / '05_详情页投喂/详情页候选数据.json').read_text(encoding='utf-8-sig'))
        evidence = json.loads((ROOT / '04_审计与差异/轻交互升级/官网登记字段复核.json').read_text(encoding='utf-8'))['items']
        self.assertEqual(sum(r['status'] == 'metadata-read' for r in evidence.values()), 36)
        self.assertEqual(sum(bool(r['fieldReview']) for r in rows), 21)
        for row in rows:
            self.assertNotEqual(row['sourceStatus'], 'official-complete')
            if evidence[row['id']]['status'] == 'unavailable':
                self.assertFalse(row['declaredRegion'])
        self.assertEqual(rows[0]['teaType'], '乌龙茶')


if __name__ == '__main__':
    unittest.main()
