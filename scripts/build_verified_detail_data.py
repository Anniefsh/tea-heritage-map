# -*- coding: utf-8 -*-
from __future__ import annotations

import csv
import html
from html.parser import HTMLParser
import json
import re
import time
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


WORKSPACE_ROOT = Path(__file__).resolve().parents[2]
PROJECT_DIR = WORKSPACE_ROOT / "tea-heritage-map"
NEW_DATA_DIR = WORKSPACE_ROOT / "非遗数据采集新"

DATA_JSON_PATH = PROJECT_DIR / "data" / "tea_heritage.json"
DATA_JS_PATH = PROJECT_DIR / "data" / "tea_heritage_data.js"
MASTER_CSV_PATH = NEW_DATA_DIR / "01_权威主表" / "46项权威主表.csv"
TRACE_CSV_PATH = NEW_DATA_DIR / "03_来源追溯" / "46项来源追溯总表.csv"
FEED_CSV_PATH = NEW_DATA_DIR / "05_详情页投喂" / "详情页候选数据.csv"
ENRICHED_FEED_JSON_PATH = NEW_DATA_DIR / "05_详情页投喂" / "详情页候选数据.json"
ENRICHED_FEED_CSV_PATH = NEW_DATA_DIR / "05_详情页投喂" / "详情页候选数据.csv"

TODAY = "2026-04-21"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
}

MARKETING_PATTERNS = (
    "享誉",
    "驰名",
    "闻名",
    "著称",
    "世界",
    "唯一",
    "惟一",
    "称号",
    "远销",
    "品牌价值",
    "价格",
    "游客",
    "保健功能",
    "原产地保护",
    "商标",
    "堪称",
    "金奖",
    "名小吃",
    "名点",
    "绝伦",
    "典范",
    "传说",
    "荣获",
    "风景线",
    "经典样式",
    "珍品",
    "经久不衰",
    "无需医生指导",
    "剂量限制",
    "现实意义",
    "产业高速发展的今天",
)

HISTORY_KEYWORDS = (
    "起源",
    "源于",
    "形成",
    "可追溯",
    "始于",
    "创制",
    "创始",
    "沿革",
    "历史",
    "发展",
    "传至",
    "至今",
    "汉代",
    "唐代",
    "宋代",
    "元代",
    "明代",
    "清代",
    "民国",
    "年代",
    "年间",
)

PRACTICE_KEYWORDS = (
    "制作",
    "工艺",
    "工序",
    "流程",
    "技艺",
    "采摘",
    "萎凋",
    "做青",
    "杀青",
    "揉捻",
    "烘焙",
    "窨制",
    "蒸制",
    "包揉",
    "发酵",
    "拼配",
    "冲泡",
    "程序",
    "礼仪",
    "茶宴",
    "品饮",
    "配料",
    "烤茶",
    "三道茶",
    "擂茶",
)

PRACTICE_EXCLUDE_KEYWORDS = (
    "文革",
    "遗址",
    "遗迹",
    "史料",
    "照片等文物",
)

CULTURAL_KEYWORDS = (
    "流布",
    "分布",
    "地域",
    "地区",
    "文化",
    "价值",
    "意义",
    "特色",
    "交流",
    "研究",
    "传统",
    "生活",
    "社区",
    "民族",
    "社会",
    "体现",
    "反映",
    "重要",
    "代表",
    "融合",
    "茶文化",
)

SOURCE_STATUS_LABELS = {
    "official-complete": "官方来源完整交叉核验",
    "official-partial": "官方来源已获取，仍待补充核验",
    "official+fallback": "以官方来源为主，仍有字段差异待继续核对",
    "needs-review": "仍需继续审核",
}

DATA_QUALITY_LABELS = {
    "basic": "基础级",
    "complete": "完整级",
    "verified": "核验级",
}


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_js_data(path: Path, data: dict[str, Any]) -> None:
    content = "window.TEA_HERITAGE_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    path.write_text(content, encoding="utf-8")


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv_rows(path: Path, fieldnames: list[str], rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def fetch(url: str, retries: int = 3, timeout: int = 60) -> str:
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            request = Request(url, headers=HEADERS)
            with urlopen(request, timeout=timeout) as response:
                return response.read().decode("utf-8", "ignore")
        except (HTTPError, URLError, TimeoutError, OSError) as exc:
            last_error = exc
            time.sleep(0.8 * (attempt + 1))
    if last_error is None:
        raise RuntimeError(f"Failed to fetch {url}")
    raise last_error


def clean_html(raw: str) -> str:
    text = raw.replace("<br />", "\n").replace("<br/>", "\n").replace("<br>", "\n")
    text = re.sub(r"<font[^>]*>", "", text)
    text = text.replace("</font>", "")
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = text.replace("\u3000", " ").replace("&nbsp;", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_sentences(text: str) -> list[str]:
    return [part.strip() for part in re.split(r"(?<=[。！？；])", text) if part.strip()]


def dedupe_sentences(sentences: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for sentence in sentences:
        normalized = re.sub(r"\s+", "", sentence)
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        output.append(sentence.strip())
    return output


def is_marketing_sentence(sentence: str) -> bool:
    return any(token in sentence for token in MARKETING_PATTERNS)


def is_metadata_sentence(sentence: str) -> bool:
    return (
        sentence.startswith("申报地区或单位")
        or sentence.startswith("保护单位")
        or "列入国家级非物质文化遗产代表性项目名录" in sentence
    )


def normalize_paragraph(text: str) -> str:
    output = re.sub(r"\s+", " ", text).strip()
    output = output.replace(" ,", "，").replace(" 。", "。")
    output = re.sub(r"(申报地区或单位|保护单位)[：:]\s*[^。！？；]+", "", output)
    output = re.sub(r"^[。；;：:\s]+", "", output)
    return output


def text_from_section_candidates(sentences: list[str], limit: int = 3) -> str:
    picked = dedupe_sentences(
        [
            sentence
            for sentence in sentences
            if sentence
            and not is_marketing_sentence(sentence)
            and not is_metadata_sentence(sentence)
        ]
    )
    if not picked:
        return ""
    return normalize_paragraph("".join(picked[:limit]))


def pick_sentences(sentences: list[str], keywords: tuple[str, ...], limit: int = 3) -> list[str]:
    matches = [sentence for sentence in sentences if any(keyword in sentence for keyword in keywords)]
    return dedupe_sentences(matches)[:limit]


def extract_table_value(page_html: str, label: str) -> str:
    table_match = re.search(r'<div class="table">\s*<table>(.*?)</table>', page_html, re.S)
    haystack = table_match.group(1) if table_match else page_html
    cell_match = re.search(
        rf"<td[^>]*>\s*{re.escape(label)}\s*</td>\s*<td[^>]*>(.*?)</td>",
        haystack,
        re.S,
    )
    if cell_match:
        return clean_html(cell_match.group(1))

    class TextNodes(HTMLParser):
        def __init__(self):
            super().__init__()
            self.values = []

        def handle_data(self, value):
            if value.strip():
                self.values.append(value.strip())

    parser = TextNodes()
    parser.feed(page_html)
    for index, value in enumerate(parser.values):
        match = re.match(rf"^{re.escape(label)}\s*[：:]\s*(.*)$", value)
        if match:
            tail = match.group(1).strip()
            if tail:
                return tail.split('|')[0].strip()
            if index + 1 < len(parser.values):
                following = parser.values[index + 1]
                if not re.search(r'[：:]|项目序号|项目编号|公布时间|保护单位|申报地区', following):
                    return following
    return ""


def extract_main_text(page_html: str) -> str:
    match = re.search(r'<div class="text">\s*<div class="p">(.*?)</div>\s*<div class="t_line">', page_html, re.S)
    if not match:
        return ""
    text = clean_html(match.group(1))
    text = re.sub(r"^(申报地区或单位|保护单位)[：:]\s*[^。！？；]+[。；]?\s*", "", text)
    return normalize_paragraph(text)


def extract_related_inheritors(page_html: str) -> list[dict[str, str]]:
    inheritors: list[dict[str, str]] = []
    section_match = re.search(r"相关传承人.*?<div class=\"x-tables\">\s*<table>(.*?)</table>", page_html, re.S)
    if not section_match:
        return inheritors
    row_matches = re.findall(r"<tr>(.*?)</tr>", section_match.group(1), re.S)
    for row_html in row_matches[1:]:
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row_html, re.S)
        if len(cells) < 2:
            continue
        name_match = re.search(r'<a href="(?P<href>/ccr_detail/[^"]+)"[^>]*>(?P<name>.*?)</a>', cells[1], re.S)
        name = clean_html(name_match.group("name")) if name_match else ""
        code = clean_html(re.sub(r"<div class=\"name\">.*?</div>", "", cells[0], flags=re.S))
        if not name:
            continue
        inheritors.append(
            {
                "name": name,
                "level": "",
                "note": f"ihchina 项目页相关传承人 {code}".strip(),
                "url": "https://www.ihchina.cn" + name_match.group("href"),
            }
        )
    return inheritors


def to_file_uri(path_value: str) -> str:
    return Path(path_value).resolve().as_uri()


def to_reference_id(source_type: str, index: int) -> str:
    if source_type == "local-docx":
        return "scope-docx"
    if source_type == "ihchina-project":
        return "ihchina-project"
    return f"{source_type}-{index + 1}"


def build_references(trace_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    references: list[dict[str, str]] = []
    for index, row in enumerate(trace_rows):
        raw_url = row["source_url_or_path"].strip()
        reference_url = to_file_uri(raw_url) if row["source_type"] == "local-docx" else raw_url
        references.append(
            {
                "id": to_reference_id(row["source_type"], index),
                "title": row["source_title"].strip(),
                "url": reference_url,
                "type": row["source_type"].strip(),
                "authorityLevel": row["authority_level"].strip(),
                "accessDate": row["access_date"].strip(),
            }
        )
    return references


def practice_title(item: dict[str, Any]) -> str:
    tea_type = item.get("teaType", "")
    if item.get("category") == "民俗" or tea_type in {"茶俗", "茶艺"}:
        return "礼俗流程"
    if tea_type == "茶点" or "茶点" in item.get("name", ""):
        return "核心品种与制作要点"
    return "核心工艺"


def build_overview_content(
    item: dict[str, Any],
    sentences: list[str],
    declared_region: str,
    protection_unit: str,
) -> str:
    intro = (
        f"{item['name']}于{item['yearBatch']}列入国家级非物质文化遗产代表性项目名录，"
        f"类别为{item['category']}，申报地区或单位为{declared_region}，保护单位为{protection_unit}。"
    )
    supporting = dedupe_sentences(
        [
            sentence
            for sentence in sentences
            if sentence and not is_marketing_sentence(sentence) and not is_metadata_sentence(sentence)
        ]
    )
    if not supporting:
        return intro
    return normalize_paragraph(intro + "".join(supporting[:2]))


def build_history_content(item: dict[str, Any], sentences: list[str], declared_region: str) -> str:
    content = text_from_section_candidates(pick_sentences(sentences, HISTORY_KEYWORDS))
    if content:
        return content
    return (
        f"{item['name']}于{item['yearBatch']}列入国家级非物质文化遗产代表性项目名录，"
        f"申报地区或单位为{declared_region}。当前详情以中国非物质文化遗产网项目页公开信息为准。"
    )


def build_practice_content(item: dict[str, Any], sentences: list[str]) -> str:
    practice_sentences = [
        sentence
        for sentence in pick_sentences(sentences, PRACTICE_KEYWORDS)
        if not any(keyword in sentence for keyword in PRACTICE_EXCLUDE_KEYWORDS)
    ]
    content = text_from_section_candidates(practice_sentences)
    if content:
        return content
    if item.get("category") == "民俗" or item.get("teaType") in {"茶俗", "茶艺"}:
        return f"官方项目页将{item['name']}归入民俗相关项目，本轮整理重点保留其礼俗程序、饮茶场景和社区实践等公开信息。"
    if item.get("teaType") == "茶点" or "茶点" in item.get("name", ""):
        return f"官方项目页将{item['name']}归入传统技艺项目，本轮整理重点保留其茶点制作流程、代表品类和与饮茶场景的结合方式。"
    return f"官方项目页将{item['name']}归入传统技艺项目，本轮整理重点保留其制作流程、关键工序与技艺特征等公开信息。"


def build_cultural_content(item: dict[str, Any], sentences: list[str], declared_region: str) -> str:
    content = text_from_section_candidates(pick_sentences(sentences, CULTURAL_KEYWORDS))
    if content:
        return content
    return (
        f"{item['name']}与{declared_region}的地域文化联系紧密，是国家级非物质文化遗产代表性项目中"
        f"与当地茶事传统、生活实践或区域文化表达相关的重要内容。"
    )


def build_inheritance_content(
    item: dict[str, Any],
    sentences: list[str],
    declared_region: str,
    inheritors: list[dict[str, str]],
) -> str:
    protection_unit = item["protectionUnit"]
    transmission_sentences = [
        sentence
        for sentence in sentences
        if ("传承" in sentence or "保护" in sentence or "流布" in sentence) and not is_marketing_sentence(sentence)
    ]
    parts = [
        f"按国家级非遗权威清单与中国非物质文化遗产网项目页，{item['name']}的申报地区或单位为{declared_region}，保护单位为{protection_unit}。"
    ]
    if inheritors:
        names = "、".join(entry["name"] for entry in inheritors[:4])
        parts.append(f"官方项目页当前关联的相关传承人包括{names}等。")
    if transmission_sentences:
        parts.append(normalize_paragraph("".join(dedupe_sentences(transmission_sentences)[:2])))
    return "".join(parts)


def build_source_audit_content(item: dict[str, Any], declared_region: str) -> str:
    status_label = SOURCE_STATUS_LABELS.get(item["sourceStatus"], item["sourceStatus"])
    quality_label = DATA_QUALITY_LABELS.get(item["dataQuality"], item["dataQuality"])
    return (
        f"本页内容依据国家级非遗权威清单与中国非物质文化遗产网项目页重新整理，"
        f"当前来源状态为“{status_label}”，数据质量为“{quality_label}”，"
        f"最后核验日期为{item['lastVerified']}。项目当前申报地区或单位记为{declared_region}。"
    )


def build_detail_sections(
    item: dict[str, Any],
    main_text: str,
    declared_region: str,
    inheritors: list[dict[str, str]],
) -> list[dict[str, Any]]:
    sentences = split_sentences(main_text)
    scope_source_ids = ["scope-docx", "ihchina-project"]
    official_only_source_ids = ["ihchina-project"]

    sections = [
        {
            "key": "overview",
            "titleZh": "项目简介",
            "contentZh": item["descriptionZh"].strip(),
            "sourceIds": scope_source_ids,
        },
        {
            "key": "history",
            "titleZh": "历史脉络",
            "contentZh": build_history_content(item, sentences, declared_region),
            "sourceIds": official_only_source_ids,
        },
        {
            "key": "practice",
            "titleZh": practice_title(item),
            "contentZh": build_practice_content(item, sentences),
            "sourceIds": official_only_source_ids,
        },
        {
            "key": "cultural_value",
            "titleZh": "文化价值与地域关联",
            "contentZh": build_cultural_content(item, sentences, declared_region),
            "sourceIds": official_only_source_ids,
        },
        {
            "key": "inheritance",
            "titleZh": "传承保护",
            "contentZh": build_inheritance_content(item, sentences, declared_region, inheritors),
            "sourceIds": scope_source_ids,
        },
        {
            "key": "source_audit",
            "titleZh": "来源与核验状态",
            "contentZh": build_source_audit_content(item, declared_region),
            "sourceIds": scope_source_ids,
        },
    ]
    return [section for section in sections if section["contentZh"].strip()]


def load_base_data() -> dict[str, Any]:
    return read_json(DATA_JSON_PATH)


def load_master_rows() -> dict[str, dict[str, str]]:
    return {row["id"]: row for row in read_csv_rows(MASTER_CSV_PATH)}


def load_trace_rows() -> dict[str, list[dict[str, str]]]:
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in read_csv_rows(TRACE_CSV_PATH):
        grouped[row["item_id"]].append(row)
    return grouped


def load_feed_rows() -> dict[str, dict[str, str]]:
    return {row["id"]: row for row in read_csv_rows(FEED_CSV_PATH)}


def refresh_item(
    base_item: dict[str, Any],
    master_row: dict[str, str],
    feed_row: dict[str, str],
    trace_rows: list[dict[str, str]],
) -> dict[str, Any]:
    official_url = feed_row.get("sourceUrl") or master_row.get("primary_official_url", "")
    page_html = fetch(official_url)
    main_text = extract_main_text(page_html)
    sentences = split_sentences(main_text)
    declared_region = (
        extract_table_value(page_html, "申报地区或单位")
    )
    protection_unit = extract_table_value(page_html, "保护单位") or feed_row.get("protectionUnit") or base_item.get("protectionUnit", "")
    inheritors = extract_related_inheritors(page_html)
    references = build_references(trace_rows)

    item = dict(base_item)
    item.update(
        {
            "name": feed_row.get("name", base_item.get("name", "")),
            "nameEn": feed_row.get("nameEn", base_item.get("nameEn", "")),
            "province": feed_row.get("province", base_item.get("province", "")),
            "city": feed_row.get("city", base_item.get("city", "")),
            "code": feed_row.get("code", base_item.get("code", "")),
            "category": feed_row.get("category", base_item.get("category", "")),
            "yearBatch": feed_row.get("yearBatch", base_item.get("yearBatch", "")),
            "protectionUnit": protection_unit,
            "descriptionZh": feed_row.get("descriptionZh", base_item.get("descriptionZh", "")),
            "descriptionEn": feed_row.get("descriptionEn", base_item.get("descriptionEn", "")),
            "imageUrl": feed_row.get("imageUrl", base_item.get("imageUrl", "")),
            "videoUrl": feed_row.get("videoUrl", base_item.get("videoUrl", "")),
            "sourceUrl": official_url,
            "sourceStatus": feed_row.get("sourceStatus", base_item.get("sourceStatus", "")),
            "dataQuality": feed_row.get("dataQuality", base_item.get("dataQuality", "complete")),
            "lastVerified": TODAY,
            "notes": feed_row.get("notes", ""),
            "declaredRegion": declared_region,
            "representativeInheritors": [
                {"name": entry["name"], "level": entry["level"], "note": entry["note"]}
                for entry in inheritors
            ],
            "references": references,
        }
    )
    item["descriptionZh"] = build_overview_content(item, sentences, declared_region, protection_unit)
    item["detailSections"] = build_detail_sections(item, main_text, declared_region, inheritors)
    return item


def build_output_rows(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for item in items:
        rows.append(
            {
                "id": item["id"],
                "name": item["name"],
                "nameEn": item["nameEn"],
                "province": item["province"],
                "city": item["city"],
                "declaredRegion": item.get("declaredRegion", ""),
                "code": item["code"],
                "category": item["category"],
                "yearBatch": item["yearBatch"],
                "protectionUnit": item["protectionUnit"],
                "descriptionZh": item["descriptionZh"],
                "descriptionEn": item["descriptionEn"],
                "imageUrl": item.get("imageUrl", ""),
                "videoUrl": item.get("videoUrl", ""),
                "sourceUrl": item["sourceUrl"],
                "sourceStatus": item["sourceStatus"],
                "dataQuality": item["dataQuality"],
                "lastVerified": item["lastVerified"],
                "detailSections": json.dumps(item.get("detailSections", []), ensure_ascii=False),
                "representativeInheritors": json.dumps(item.get("representativeInheritors", []), ensure_ascii=False),
                "references": json.dumps(item.get("references", []), ensure_ascii=False),
                "notes": item.get("notes", ""),
            }
        )
    return rows


def main() -> int:
    if any(row.get('practiceExperience') for row in read_json(ENRICHED_FEED_JSON_PATH)):
        raise RuntimeError('旧版采集器不再覆盖交互版主数据。请更新05详情页投喂JSON并运行scripts/sync_feed.py；字段解析函数仍可独立复用。')
    base_data = load_base_data()
    master_rows = load_master_rows()
    trace_rows_by_id = load_trace_rows()
    feed_rows = load_feed_rows()

    refreshed_items: list[dict[str, Any]] = []
    for base_item in base_data["items"]:
        item_id = base_item["id"]
        master_row = master_rows[item_id]
        feed_row = feed_rows[item_id]
        trace_rows = trace_rows_by_id[item_id]
        refreshed_items.append(refresh_item(base_item, master_row, feed_row, trace_rows))

    output_data = dict(base_data)
    output_data["generatedAt"] = f"{TODAY} 23:59:00"
    output_data["source"] = "非遗数据采集新/05_详情页投喂/详情页候选数据.csv + ihchina 官方项目页"
    output_data["items"] = refreshed_items

    write_json(DATA_JSON_PATH, output_data)
    write_js_data(DATA_JS_PATH, output_data)
    output_rows = build_output_rows(refreshed_items)
    output_fields = [
        "id",
        "name",
        "nameEn",
        "province",
        "city",
        "declaredRegion",
        "code",
        "category",
        "yearBatch",
        "protectionUnit",
        "descriptionZh",
        "descriptionEn",
        "imageUrl",
        "videoUrl",
        "sourceUrl",
        "sourceStatus",
        "dataQuality",
        "lastVerified",
        "detailSections",
        "representativeInheritors",
        "references",
        "notes",
    ]

    write_json(ENRICHED_FEED_JSON_PATH, output_rows)
    try:
        write_csv_rows(ENRICHED_FEED_CSV_PATH, output_fields, output_rows)
    except PermissionError:
        fallback_csv_path = ENRICHED_FEED_CSV_PATH.with_name(f"{ENRICHED_FEED_CSV_PATH.stem}_更新副本.csv")
        write_csv_rows(fallback_csv_path, output_fields, output_rows)
        print(f"csv_fallback_path={fallback_csv_path}")

    print(f"updated_items={len(refreshed_items)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
