const DATA = window.TEA_HERITAGE_DATA;
const ADMIN = window.CHINA_OFFICIAL_ADMIN;

const MAP_META = window.MAP_COMPLIANCE_META || {};
const MAP_RENDER_MODE = MAP_META.renderMode || 'reference-calibrated-handdrawn';
const DEFAULT_MAP_CAPABILITIES = Object.freeze({
  provinceEntry: false,
  provinceHover: false,
  provinceButtons: false,
  provinceLabels: false,
  markers: false,
  contextPanel: false,
  legend: false,
  search: false,
  zoomPan: false
});
const MAP_CAPABILITIES = {
  ...DEFAULT_MAP_CAPABILITIES,
  ...((MAP_META.capabilities && typeof MAP_META.capabilities === 'object') ? MAP_META.capabilities : {})
};

const VIEWBOX = { width: 1000, height: 760, padding: 34 };
const ZOOM_LIMITS = { min: 1, max: 7 };
const SOUTH_SEA_INSET = { x: 762, y: 500, width: 204, height: 218, padding: 12, titleHeight: 0 };
const SOUTH_SEA_INSET_LAT_THRESHOLD = 18;
const HAINAN_GEO_NAME = '海南省';
const REFERENCE_MAIN_POLYGON_MIN_AREA = 20;
const REFERENCE_PROXY_GEO_NAMES = new Set(['香港特别行政区', '澳门特别行政区']);
const REFERENCE_GEOMETRY_EXPECTATIONS = new Map([
  ['甘肃省', 3],
  ['浙江省', 75],
  ['海南省', 328]
]);
const referenceSpecialRegionShapes = {
  '香港': {
    dx: 7,
    dy: -1,
    path: 'M-4.8 -2.4 C-2.4 -4.3 1.9 -4.2 4.6 -1.7 C4.8 0.8 2.7 3.3 -0.2 3.8 C-2.7 3.8 -4.8 1.7 -4.8 -2.4 Z'
  },
  '澳门': {
    dx: -7,
    dy: 1.5,
    path: 'M-4.0 -1.9 C-1.9 -3.5 1.3 -3.2 3.3 -1.0 C3.4 1.2 1.9 2.8 -0.5 3.0 C-2.8 2.9 -4.2 1.0 -4.0 -1.9 Z'
  }
};

const provinceAlias = {
  '广西': '广西壮族自治区',
  '香港': '香港特别行政区',
  '澳门': '澳门特别行政区'
};
const reverseProvinceAlias = {
  '广西壮族自治区': '广西',
  '香港特别行政区': '香港',
  '澳门特别行政区': '澳门'
};
const shortProvinceNameMap = {
  '北京市': '北京',
  '天津市': '天津',
  '上海市': '上海',
  '重庆市': '重庆',
  '内蒙古自治区': '内蒙古',
  '西藏自治区': '西藏',
  '宁夏回族自治区': '宁夏',
  '新疆维吾尔自治区': '新疆',
  '台湾省': '台湾',
  '香港': '香港',
  '澳门': '澳门'
};
const specialBadgeOffsets = {
  '香港': { dx: 48, dy: 10 },
  '澳门': { dx: -58, dy: 18 }
};
const alwaysLabeledProvinces = new Set(['台湾省']);
const inlineLabelSkip = new Set(['香港', '澳门']);
const cityCoordinateOverrides = {
  '南平市武夷山市': [118.036, 27.756],
  '福州市仓山区': [119.315, 26.043],
  '宁德市福安市': [119.647, 27.086],
  '宁德市福鼎市': [120.216, 27.325],
  '泉州市安溪县': [118.187, 25.056],
  '龙岩市漳平市': [117.420, 25.291],
  '临沧市凤庆县': [100.799, 24.580],
  '普洱市宁洱县': [101.046, 23.049],
  '西双版纳勐海县': [100.452, 21.957],
  '大理州': [100.267, 25.607],
  '大理州大理市': [100.267, 25.607],
  '德宏州芒市': [98.588, 24.433],
  '杭州市': [120.155, 30.274],
  '杭州市余杭区': [120.299, 30.419],
  '金华市': [119.647, 29.079],
  '湖州市长兴县': [119.911, 31.027],
  '湖州市安吉县': [119.680, 30.638],
  '黄山市徽州区': [118.338, 29.827],
  '黄山市黄山区': [118.141, 30.272],
  '黄山市祁门县': [117.718, 29.858],
  '六安市裕安区': [116.479, 31.738],
  '苏州市吴中区': [120.632, 31.262],
  '南京市': [118.797, 32.060],
  '扬州市': [119.412, 32.394],
  '恩施州恩施市': [109.479, 30.295],
  '咸宁市赤壁市': [113.884, 29.716],
  '宜昌市伍家岗区': [111.361, 30.644],
  '益阳市安化县': [111.221, 28.381],
  '益阳市': [112.355, 28.554],
  '岳阳市君山区': [113.005, 29.438],
  '赣州市全南县': [114.531, 24.742],
  '上饶市婺源县': [117.862, 29.255],
  '九江市修水县': [114.573, 29.033],
  '广东省': [113.264, 23.129],
  '潮州市': [116.622, 23.657],
  '北京市': [116.397, 39.907],
  '北京市东城区': [116.417, 39.928],
  '雅安市': [103.013, 29.980],
  '雅安市名山区': [103.109, 30.084],
  '梧州市苍梧县': [111.245, 23.421],
  '桂林市恭城县': [110.828, 24.833],
  '信阳市': [114.091, 32.148],
  '咸阳市': [108.708, 34.329],
  '黔南州都匀市': [107.518, 26.260],
  '香港特别行政区': [114.166608, 22.272483],
  '澳门特别行政区': [113.538095, 22.189786]
};

let preferredLanguage = 'zh';
try { if (localStorage.getItem('tea-map-language') === 'en') preferredLanguage = 'en'; } catch {}
const state = {
  view: 'landing',
  lang: preferredLanguage,
  teaType: 'all',
  province: 'all',
  search: '',
  topic: 'all',
  mapLegendTeaTypes: [],
  selectedId: null,
  mapPreviewId: null,
  mapBrowseMode: 'province',
  mapProvinceFocus: null,
  southSeaInsetExpanded: false,
  mapCameraByMode: {
    province: { scale: 1, x: 0, y: 0 },
    project: { scale: 1, x: 0, y: 0 }
  },
  viewScale: 1,
  viewX: 0,
  viewY: 0
};

const DETAIL_SECTION_LABELS = Object.freeze({
  overview: {
    title: { zh: '项目简介', en: 'Introduction' },
    nav: { zh: '简介', en: 'Intro' }
  },
  history: {
    title: { zh: '历史脉络', en: 'History' },
    nav: { zh: '历史', en: 'History' }
  },
  practice: {
    title: { zh: '核心工艺 / 程序', en: 'Practice' },
    nav: { zh: '工艺', en: 'Practice' }
  },
  cultural_value: {
    title: { zh: '文化价值与地域关联', en: 'Cultural Context' },
    nav: { zh: '文化', en: 'Culture' }
  },
  inheritance: {
    title: { zh: '传承保护', en: 'Passing on the tradition' },
    nav: { zh: '传承', en: 'Passing on the tradition' }
  },
  source_audit: {
    title: { zh: '来源与核验状态', en: 'Sources & Verification' },
    nav: { zh: '来源', en: 'Sources' }
  },
});

const DETAIL_MISC_TEXT = Object.freeze({
  quickJump: { zh: '快速定位', en: 'Quick Jump' },
  leadLabel: { zh: '首屏导语', en: 'Lead' },
  imageTitle: { zh: '项目图片', en: 'Project Image' },
  mediaOpenSource: { zh: '查看权威来源', en: 'Open Official Source' }
});

function parseStructuredArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizePlainText(value) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function clampZhLead(text, minChars = 120, maxChars = 180) {
  const clean = normalizePlainText(text).replace(/\n+/g, ' ');
  if (!clean) return '';
  if (clean.length <= maxChars) return clean;
  const windowText = clean.slice(0, maxChars);
  const sentenceStop = Math.max(
    windowText.lastIndexOf('。'),
    windowText.lastIndexOf('！'),
    windowText.lastIndexOf('？'),
    windowText.lastIndexOf('；')
  );
  if (sentenceStop >= minChars - 1) return windowText.slice(0, sentenceStop + 1).trim();
  const softStop = Math.max(windowText.lastIndexOf('，'), windowText.lastIndexOf('、'));
  if (softStop >= minChars - 1) return `${windowText.slice(0, softStop + 1).trim()}…`;
  return `${windowText.trim()}…`;
}

function clampEnLead(text, maxWords = 110) {
  const clean = normalizePlainText(text).replace(/\n+/g, ' ');
  if (!clean) return '';
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  const sliced = words.slice(0, maxWords).join(' ');
  const sentenceStop = Math.max(
    sliced.lastIndexOf('. '),
    sliced.lastIndexOf('? '),
    sliced.lastIndexOf('! '),
    sliced.lastIndexOf('; ')
  );
  if (sentenceStop > Math.floor(sliced.length * 0.65)) return `${sliced.slice(0, sentenceStop + 1).trim()}`;
  return `${sliced.trim()}...`;
}

function normalizeInheritorList(value) {
  const entries = Array.isArray(value) ? value : parseStructuredArray(value);
  return entries
    .map((entry) => {
      if (!entry || !entry.name) return null;
      return {
        ...entry,
        name: normalizePlainText(entry.name),
        level: normalizePlainText(entry.level),
        note: normalizePlainText(entry.note)
      };
    })
    .filter(Boolean);
}

function normalizeReferenceList(value) {
  const entries = Array.isArray(value) ? value : parseStructuredArray(value);
  return entries
    .map((entry) => {
      if (!entry || !entry.url) return null;
      return {
        ...entry,
        id: normalizePlainText(entry.id),
        title: normalizePlainText(entry.title),
        url: String(entry.url || '').trim(),
        type: normalizePlainText(entry.type),
        authorityLevel: normalizePlainText(entry.authorityLevel),
        accessDate: normalizePlainText(entry.accessDate)
      };
    })
    .filter(Boolean);
}

function normalizeDetailSections(value) {
  const entries = Array.isArray(value) ? value : parseStructuredArray(value);
  return entries
    .map((section) => {
      if (!section) return null;
      const sourceIds = Array.isArray(section.sourceIds) ? section.sourceIds : parseStructuredArray(section.sourceIds);
      const contentZh = normalizePlainText(section.contentZh);
      if (!contentZh) return null;
      return {
        ...section,
        key: normalizePlainText(section.key),
        titleZh: normalizePlainText(section.titleZh),
        contentZh,
        sourceIds: sourceIds.filter(Boolean).map((entry) => normalizePlainText(entry)).filter(Boolean)
      };
    })
    .filter(Boolean);
}

function normalizeMediaCollection(collection, fallbackUrl, fallbackTitle) {
  const entries = Array.isArray(collection) ? collection : parseStructuredArray(collection);
  const normalized = entries
    .map((entry, index) => {
      if (typeof entry === 'string') {
        const url = entry.trim();
        return url ? { url, title: fallbackTitle || `Media ${index + 1}` } : null;
      }
      if (!entry || !entry.url) return null;
      return {
        ...entry,
        url: String(entry.url || '').trim(),
        title: normalizePlainText(entry.title || entry.caption || fallbackTitle || ''),
        caption: normalizePlainText(entry.caption),
        source: normalizePlainText(entry.source)
      };
    })
    .filter(Boolean);
  const fallback = String(fallbackUrl || '').trim();
  if (!normalized.length && fallback) {
    normalized.push({
      url: fallback,
      title: normalizePlainText(fallbackTitle)
    });
  }
  return normalized;
}

function normalizeDataItem(item) {
  const imageUrl = String(item?.imageUrl || '').trim();
  const sourceUrl = String(item?.sourceUrl || '').trim();
  const images = normalizeMediaCollection(item?.images, imageUrl, item?.name);
  const descriptionZh = normalizePlainText(item?.descriptionZh);
  const descriptionEn = normalizePlainText(item?.descriptionEn);
  return {
    ...item,
    city: normalizePlainText(item?.city),
    declaredRegion: normalizePlainText(item?.declaredRegion),
    descriptionZh,
    descriptionEn,
    imageUrl,
    sourceUrl,
    notes: normalizePlainText(item?.notes),
    detailSections: normalizeDetailSections(item?.detailSections),
    representativeInheritors: normalizeInheritorList(item?.representativeInheritors),
    references: normalizeReferenceList(item?.references),
    images,
    leadZh: normalizePlainText(item?.leadZh) || clampZhLead(descriptionZh),
    leadEn: normalizePlainText(item?.leadEn) || clampEnLead(descriptionEn)
  };
}

if (Array.isArray(DATA.items)) {
  DATA.items = DATA.items.map(normalizeDataItem);
}

const uiText = {
  zh: {
    htmlLang: 'zh-CN',
    documentTitle: '中国茶类非遗数字化地图',
    siteTitle: '中国茶类非遗数字化地图',
    siteSubtitle: '',
    interfaceToggle: 'EN',
    landingEyebrow: 'China Tea Intangible Cultural Heritage',
    landingTitle: '中国茶类非遗数字化地图',
    landingSubtitle: '选一处地方，认识一门手艺，发现一盏茶里的故事。',
    landingStatsKicker: '数据概览',
    enterMap: '进入地图',
    breadcrumbHome: '首页',
    breadcrumbMap: '地图总览',
    breadcrumbProvince: '省份页',
    breadcrumbDetail: '项目详情',
    backToLanding: '返回首页',
    backToMap: '返回地图',
    backToProvince: '返回省份页',
    mapKicker: '01 / 地图总览',
    mapTitle: '这一站，想去哪里？',
    mapSummary: '选择省份，或切换到项目点位，找到你感兴趣的一盏茶。',
    mapOverviewTitle: '地图概览',
    mapOverviewBody: '先在全国尺度建立分布印象，再选择省份或项目继续浏览。',
    mapGuideTitle: '浏览方式',
    mapGuideBody: '省份浏览用于进入省份页，项目浏览用于查看点位预览与项目详情。',
    mapStatVisible: '可见项目',
    mapStatRegions: '覆盖省区',
    mapStatFocused: '当前视角',
    mapStatFocusedDefault: '全国总览',
    mapGuideSearch: '搜索词',
    mapBrowseProvince: '省份浏览',
    mapBrowseProject: '项目浏览',
    mapBrowseProvinceTitle: '按省份浏览全国茶类非遗',
    mapBrowseProvinceBody: '点击省份名称，或从右侧目录选一站。',
    mapBrowseProjectTitle: '按项目点位查看全国分布',
    mapBrowseProjectBody: '点击茶叶点位预览项目，再进入详情探索。',
    mapBrowseModeLabel: '当前模式',
    mapProvinceStatLabel: '有茶类非遗的省份',
    mapProvinceDirectoryTitle: '省份目录',
    mapProvinceSpotlightTitle: '当前省份',
    mapProvinceSpotlightHint: '将光标移到地图上的省份，或从目录中选择一个省份继续浏览。',
    mapProvinceSpotlightEmpty: '当前省份暂未收录茶类非遗项目。',
    mapProvinceOpen: '进入省份页',
    mapProvinceTeaTypes: '涉及茶类',
    mapProjectOpenProvince: '进入所属省份',
    mapSouthSeaToggleOpen: '南海附图',
    mapSouthSeaToggleClose: '收起附图',
    mapSouthSeaCardBody: '附图独立展示南海诸岛区域，避免遮挡主图东南沿海与台湾周边的浏览与交互。',
    mapPreviewKicker: '项目预览',
    mapPreviewOpen: '查看详情',
    mapPreviewReset: '返回总览',
    mapPreviewSummaryLabel: '摘要',
    mapSourceNote: '本图依据中国行政区划表达绘制，保留台湾与南海诸岛附图，并提供省份浏览与项目浏览两种查看方式。',
    mapComplianceKicker: '地图说明',
    mapComplianceTitle: '本图依据中国行政区划表达绘制',
    mapComplianceReviewLabel: '审图号',
    mapComplianceFileLabel: '参考文件',
    mapComplianceUsageLabel: '参考用途',
    mapComplianceNotesLabel: '说明',
    mapReferenceDebugAlt: '中国行政区划参考底图',
    searchPlaceholder: '搜索项目名 / 省份 / 地区',
    statsItems: '非遗项目',
    statsRegions: '覆盖省区',
    statsVisible: '当前显示',
    all: '全部',
    filterToolbarTitle: '辅助筛选',
    provinceKicker: '02 / 省份页',
    provinceDefaultTitle: '请选择一个省份',
    provinceDefaultSummary: '从地图进入某个省份后，这里会显示该地区的茶类非遗项目列表。',
    provinceSummaryActive: '这里汇总当前省份的茶类非遗项目，可继续使用辅助筛选缩小范围。',
    provinceMetaWaitingLabel: '状态',
    provinceMetaWaitingValue: '等待选择省份',
    provinceMetaTotal: '项目总数',
    provinceMetaVisible: '当前显示',
    provinceMetaTeaTypes: '茶类数量',
    detailKicker: '03 / 项目详情',
    detailDefaultTitle: '项目详情',
    detailDefaultSummary: '这里会展示当前项目的摘要与已核验信息。',
    noResultTitle: '当前筛选下没有匹配项目',
    noResultBody: '你可以尝试清空搜索词，或者切换到其他茶类筛选。',
    reset: '重置筛选',
    mapLegendTitle: '茶类图例',
    mapLegendHint: '点击茶类可多选筛选，再次点击可取消。',
    mapLegendReset: '清空茶类',
    mapLegendEmpty: '当前搜索下没有可用茶类。',
    detailMetaProvince: '省份',
    detailMetaRegion: '所属地区',
    detailMetaCategory: '类别',
    detailMetaBatch: '公布时间',
    detailMetaUnit: '保护单位',
    detailMetaCode: '项目编号',
    detailMetaDeclaredRegion: '申报地区',
    detailSectionZh: '项目简介',
    detailSectionStatus: '来源与状态',
    detailSectionSources: '本节来源',
    detailReferencesTitle: '可追溯来源',
    detailSourceStatusLabel: '来源状态',
    detailDataQualityLabel: '数据质量',
    detailLastVerifiedLabel: '最后核验',
    detailInheritorsTitle: '相关传承人',
    detailStatusSeed: `当前底图已于 2026-03-26 依据天地图公开行政区划 API 重建，并将海南省边界中的南海诸岛拆分为附图表达；页面审图信息参考其服务页当前展示的 ${ADMIN.reviewNumber}。`,
    southSeaInsetTitle: '南海诸岛附图',
    cardLink: '查看详情',
    provinceCountSuffix: '项',
    zoomIn: '放大',
    zoomOut: '缩小',
    zoomReset: '复位',
    mapHint: '滚轮缩放 · 拖动平移 · 点击点位查看项目'
  },
  en: {
    htmlLang: 'en',
    documentTitle: 'China Tea Intangible Cultural Heritage Map',
    siteTitle: 'China Tea Heritage Map',
    siteSubtitle: '',
    interfaceToggle: '中文',
    landingEyebrow: 'China Tea Intangible Cultural Heritage',
    landingTitle: 'China Tea Intangible Cultural Heritage Map',
    landingSubtitle: 'Start from the national map to explore tea-related intangible cultural heritage across China.',
    landingStatsKicker: 'Data Snapshot',
    enterMap: 'Enter Map',
    breadcrumbHome: 'Home',
    breadcrumbMap: 'Map Overview',
    breadcrumbProvince: 'Province',
    breadcrumbDetail: 'Detail',
    backToLanding: 'Back to Home',
    backToMap: 'Back to Map',
    backToProvince: 'Back to Province',
    mapKicker: '01 / Map Overview',
    mapTitle: 'Browse China tea heritage on the map',
    mapSummary: 'Choose a province or switch to project markers to find a tea tradition to explore.',
    mapOverviewTitle: 'Map Overview',
    mapOverviewBody: 'Use the national view to understand distribution first, then continue by province or by individual item.',
    mapGuideTitle: 'How to Explore',
    mapGuideBody: 'Province browsing leads into province pages, while project browsing focuses on marker previews and detail pages.',
    mapStatVisible: 'Visible Items',
    mapStatRegions: 'Covered Regions',
    mapStatFocused: 'Current View',
    mapStatFocusedDefault: 'National Overview',
    mapGuideSearch: 'Keyword',
    mapBrowseProvince: 'Browse provinces',
    mapBrowseProject: 'Browse projects',
    mapBrowseProvinceTitle: 'Browse by province',
    mapBrowseProvinceBody: 'Switch to province browsing, then use the province labels on the map or the directory on the right to continue into a province page.',
    mapBrowseProjectTitle: 'Browse by project markers',
    mapBrowseProjectBody: 'Switch to project browsing, zoom in on the map, and open tea markers to preview each item on the right.',
    mapBrowseModeLabel: 'Mode',
    mapProvinceStatLabel: 'Provinces with Tea Heritage',
    mapProvinceDirectoryTitle: 'Province Directory',
    mapProvinceSpotlightTitle: 'Current Province',
    mapProvinceSpotlightHint: 'Move over a province on the map or pick one from the directory to continue browsing.',
    mapProvinceSpotlightEmpty: 'No tea heritage item is currently listed for this province.',
    mapProvinceOpen: 'Open Province',
    mapProvinceTeaTypes: 'Tea Types',
    mapProjectOpenProvince: 'Open Province',
    mapSouthSeaToggleOpen: 'South China Sea Inset',
    mapSouthSeaToggleClose: 'Hide Inset',
    mapSouthSeaCardBody: 'The inset is presented separately so the southeast coast and the area around Taiwan remain clear for browsing and interaction.',
    mapPreviewKicker: 'Item Preview',
    mapPreviewOpen: 'Open Detail',
    mapPreviewReset: 'Back to Overview',
    mapPreviewSummaryLabel: 'Summary',
    mapSourceNote: 'This map is drawn with Chinese administrative divisions as its reference, preserves Taiwan and the South China Sea inset, and supports both province and project browsing.',
    mapComplianceKicker: 'Map Note',
    mapComplianceTitle: 'This map follows Chinese administrative division expression',
    mapComplianceReviewLabel: 'Review Number',
    mapComplianceFileLabel: 'Reference File',
    mapComplianceUsageLabel: 'Reference Use',
    mapComplianceNotesLabel: 'Notes',
    mapReferenceDebugAlt: 'Administrative reference image of China',
    searchPlaceholder: 'Search item / province / region',
    statsItems: 'Heritage Items',
    statsRegions: 'Covered Regions',
    statsVisible: 'Visible Markers',
    all: 'All',
    filterToolbarTitle: 'Supporting Filters',
    provinceKicker: '02 / Province',
    provinceDefaultTitle: 'Choose a province',
    provinceDefaultSummary: 'After selecting a province on the map, this page shows the related tea heritage items.',
    provinceSummaryActive: 'This page gathers tea heritage items from the current province. Use the supporting filters to narrow the list.',
    provinceMetaWaitingLabel: 'Status',
    provinceMetaWaitingValue: 'Waiting for a province',
    provinceMetaTotal: 'Total Items',
    provinceMetaVisible: 'Visible Now',
    provinceMetaTeaTypes: 'Tea Types',
    detailKicker: '03 / Detail',
    detailDefaultTitle: 'Project Detail',
    detailDefaultSummary: 'This page shows the current project and its verified information.',
    noResultTitle: 'No matching item under the current filters',
    noResultBody: 'Try clearing the keyword or switching to another tea category.',
    reset: 'Reset Filters',
    mapLegendTitle: 'Tea Legend',
    mapLegendHint: 'Click tea categories to build a multi-select filter. Click again to remove one.',
    mapLegendReset: 'Clear Tea Filters',
    mapLegendEmpty: 'No tea categories are available under the current search.',
    detailMetaProvince: 'Province',
    detailMetaRegion: 'Region',
    detailMetaCategory: 'Category',
    detailMetaBatch: 'National listing',
    detailMetaUnit: 'Safeguarding body',
    detailMetaCode: 'Item Code',
    detailMetaDeclaredRegion: 'Declared Region',
    detailSectionZh: 'Chinese Introduction',
    detailSectionStatus: 'Source Status',
    detailSectionSources: 'Section Sources',
    detailReferencesTitle: 'Traceable Sources',
    detailSourceStatusLabel: 'Source Status',
    detailDataQualityLabel: 'Data Quality',
    detailLastVerifiedLabel: 'Last Verified',
    detailInheritorsTitle: 'Related Inheritors',
    detailStatusSeed: `The base map was rebuilt on March 26, 2026 from the public TianDiTu administrative API, and the South China Sea islands embedded in Hainan were split into a dedicated inset. The page references the current official review number shown on the source service page: ${ADMIN.reviewNumber}.`,
    southSeaInsetTitle: 'South China Sea Islands',
    cardLink: 'Open details',
    provinceCountSuffix: ' items',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Reset View',
    mapHint: 'Scroll to zoom · Drag to pan · Select a project marker'
  }
};

const els = {
  siteHeader: document.getElementById('siteHeader'),
  siteHomeButton: document.getElementById('siteHomeButton'),
  siteTitle: document.getElementById('siteTitle'),
  siteSubtitle: document.getElementById('siteSubtitle'),
  breadcrumb: document.getElementById('breadcrumb'),
  globalBackButton: document.getElementById('globalBackButton'),
  landingShell: document.getElementById('landingShell'),
  mapShell: document.getElementById('mapShell'),
  provinceShell: document.getElementById('provinceShell'),
  detailShell: document.getElementById('detailShell'),
  landingEyebrow: document.getElementById('landingEyebrow'),
  landingTitle: document.getElementById('landingTitle'),
  landingSubtitle: document.getElementById('landingSubtitle'),
  landingLead: document.getElementById('landingLead'),
  landingPanelKicker: document.getElementById('landingPanelKicker'),
  landingPanelTitle: document.getElementById('landingPanelTitle'),
  landingPanelBody: document.getElementById('landingPanelBody'),
  landingTags: document.getElementById('landingTags'),
  landingStatsKicker: document.getElementById('landingStatsKicker'),
  heroStats: document.getElementById('heroStats'),
  enterMapButton: document.getElementById('enterMapButton'),
  langToggle: document.getElementById('langToggle'),
  mapKicker: document.getElementById('mapKicker'),
  mapTitle: document.getElementById('mapTitle'),
  mapSummary: document.getElementById('mapSummary'),
  mapSourceNote: document.getElementById('mapSourceNote'),
  mapSearchRow: document.getElementById('mapSearchRow'),
  searchInput: document.getElementById('searchInput'),
  teaTypeFilters: document.getElementById('teaTypeFilters'),
  filterToolbarTitle: document.getElementById('filterToolbarTitle'),
  mapSvg: document.getElementById('officialMapSvg'),
  mapStage: document.getElementById('mapStage'),
  chinaShapeLayer: document.getElementById('chinaShapeLayer'),
  provinceBorderLayer: document.getElementById('provinceBorderLayer'),
  nationalBoundaryLayer: document.getElementById('nationalBoundaryLayer'),
  provinceLabelLayer: document.getElementById('provinceLabelLayer'),
  provinceButtonLayer: document.getElementById('provinceButtonLayer'),
  specialRegionLayer: document.getElementById('specialRegionLayer'),
  projectMarkerSvgLayer: document.getElementById('projectMarkerSvgLayer'),
  southSeaInsetLayer: document.getElementById('southSeaInsetLayer'),
  southSeaFloatPanel: document.getElementById('southSeaFloatPanel'),
  mapLegend: document.getElementById('mapLegend'),
  mapContextPanel: document.getElementById('mapContextPanel'),
  mapComplianceCard: document.getElementById('mapComplianceCard'),
  referenceMapDebug: document.getElementById('referenceMapDebug'),
  provinceKicker: document.getElementById('provinceKicker'),
  provinceTitle: document.getElementById('provinceTitle'),
  provinceSummary: document.getElementById('provinceSummary'),
  provinceMeta: document.getElementById('provinceMeta'),
  detailKicker: document.getElementById('detailKicker'),
  detailPageTitle: document.getElementById('detailPageTitle'),
  detailSummary: document.getElementById('detailSummary'),
  detailPanel: document.getElementById('detailPanel'),
  projectGrid: document.getElementById('projectGrid'),
  zoomInButton: document.getElementById('zoomInButton'),
  zoomOutButton: document.getElementById('zoomOutButton'),
  resetViewButton: document.getElementById('resetViewButton'),
  mapToolbar: document.getElementById('mapToolbar'),
  zoomValue: document.getElementById('zoomValue'),
  mapHint: document.getElementById('mapHint'),
  mapBrowseToggle: document.getElementById('mapBrowseToggle'),
  provinceBrowseButton: document.getElementById('provinceBrowseButton'),
  projectBrowseButton: document.getElementById('projectBrowseButton'),
  southSeaToggleButton: document.getElementById('southSeaToggleButton')
};

let panSession = null;
let suppressClick = false;
const teaTypeConfigByKey = new Map(DATA.teaTypes.map((type) => [type.key, type]));
const teaTypeKeyByZh = new Map(DATA.teaTypes.map((type) => [type.zh, type.key]));
const teaTypeKeyByEn = new Map(DATA.teaTypes.map((type) => [type.en, type.key]));

function localizedField(record, field) {
  return state.lang === 'zh' ? (record[field] || '') : (record[field + 'En'] || '');
}

function localizedPlace(value) {
  return state.lang === 'zh' ? value : (window.TEA_ENGLISH_LABELS?.[value] || (/\p{Script=Han}/u.test(value || '') ? 'Unnamed region' : value));
}

function projectCount(count) {
  return state.lang === 'zh' ? `${count}项` : `${count} ${count === 1 ? 'item' : 'items'}`;
}

function currentText() { return uiText[state.lang]; }
function isReferenceCalibratedMode() { return MAP_RENDER_MODE === 'reference-calibrated-handdrawn'; }
function mapCapability(name) { return Boolean(MAP_CAPABILITIES[name]); }
function currentMapBrowseMode() { return state.mapBrowseMode === 'project' ? 'project' : 'province'; }
function isProvinceBrowseMode() { return currentMapBrowseMode() === 'province'; }
function isProjectBrowseMode() { return currentMapBrowseMode() === 'project'; }
function isSouthSeaInsetExpanded() { return Boolean(state.southSeaInsetExpanded); }
function isMapProvinceEntryEnabled() { return isReferenceCalibratedMode() ? isProvinceBrowseMode() && mapCapability('provinceEntry') : true; }
function isMapProvinceHoverEnabled() { return isReferenceCalibratedMode() ? isMapProvinceEntryEnabled() && mapCapability('provinceHover') : true; }
function isMapProvinceButtonsEnabled() { return isReferenceCalibratedMode() ? isProvinceBrowseMode() && mapCapability('provinceButtons') : false; }
function isMapProvinceLabelsEnabled() { return isReferenceCalibratedMode() ? mapCapability('provinceLabels') : true; }
function isMapMarkersEnabled() { return isReferenceCalibratedMode() ? isProjectBrowseMode() && mapCapability('markers') : true; }
function isMapContextPanelEnabled() { return isReferenceCalibratedMode() ? mapCapability('contextPanel') : true; }
function isMapLegendEnabled() { return isReferenceCalibratedMode() ? isProjectBrowseMode() && mapCapability('legend') : true; }
function isMapSearchEnabled() { return isReferenceCalibratedMode() ? mapCapability('search') : true; }
function isMapZoomPanEnabled() { return isReferenceCalibratedMode() ? mapCapability('zoomPan') : true; }
function getActiveMapLegendTeaTypes() { return state.view === 'map' && isProjectBrowseMode() ? state.mapLegendTeaTypes : []; }
function provinceGeoName(province) { return provinceAlias[province] || province; }
function provinceDisplayName(geoName) { return reverseProvinceAlias[geoName] || geoName; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function toRadians(value) { return value * Math.PI / 180; }
function setNodeText(node, value) { if (node) node.textContent = value; }
function toggleHidden(node, hidden) { if (node) node.classList.toggle('hidden', hidden); }
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

function formatSourceStatus(status) {
  const zh = {
    'official-complete': '官方来源字段齐备',
    'official-partial': '官方来源待补充核验',
    'official+fallback': '官方为主，仍有字段待核对',
    'needs-review': '仍需继续审核'
  };
  const en = {
    'official-complete': 'Official fields available',
    'official-partial': 'Official source, more verification needed',
    'official+fallback': 'Official-first, some fields still pending',
    'needs-review': 'Needs review'
  };
  return (state.lang === 'zh' ? zh : en)[status] || status || '';
}

function formatDataQuality(value) {
  const zh = {
    basic: '基础级',
    complete: '完整级',
    verified: '核验级'
  };
  const en = {
    basic: 'Basic',
    complete: 'Complete',
    verified: 'Verified'
  };
  return (state.lang === 'zh' ? zh : en)[value] || value || '';
}

function detailCopy(key) {
  const entry = DETAIL_MISC_TEXT[key];
  if (!entry) return '';
  return entry[state.lang] || entry.zh || '';
}

function getDetailSectionConfig(key) {
  return DETAIL_SECTION_LABELS[key] || null;
}

function getDetailSectionTitle(section, fallbackTitle = '') {
  if (state.lang === 'en' && section?.titleEn) return section.titleEn;
  if (section?.key === 'practice' && section.titleZh) {
    const titles = { '礼俗流程': 'Ritual & Hospitality', '核心品种与制作要点': 'Pastries & Preparation', '核心工艺': 'Core Craft' };
    return state.lang === 'zh' ? section.titleZh : (titles[section.titleZh] || 'Practice');
  }
  const config = getDetailSectionConfig(section?.key);
  if (config?.title) return config.title[state.lang] || config.title.zh || fallbackTitle;
  if (state.lang === 'zh') return section?.titleZh || fallbackTitle;
  return fallbackTitle || section?.titleZh || '';
}

function getDetailNavLabel(sectionKey) {
  const config = getDetailSectionConfig(sectionKey);
  if (!config?.nav) return '';
  return config.nav[state.lang] || config.nav.zh || '';
}

function getQuickNavSections(item) {
  const priorities = ['overview', 'practice', 'cultural_value', 'inheritance', 'source_audit'];
  const sections = Array.isArray(item?.detailSections) ? item.detailSections : [];
  return priorities
    .map((key) => sections.find((section) => section.key === key))
    .filter(Boolean);
}

function getSectionId(sectionKey) {
  return `detail-section-${sectionKey || 'default'}`;
}

function getPrimaryImage(item) {
  const images = Array.isArray(item?.images) ? item.images : [];
  return images.find((entry) => entry && entry.url) || null;
}

function renderDetailParagraphs(content) {
  return String(content || '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');
}

function renderDetailSourcePills(referenceIds, referenceMap, text) {
  // Field-level provenance stays in the data; the page has one source entry in its footer.
  return '';
}

function renderInheritorBlock(item, text) {
  const inheritors = Array.isArray(item.representativeInheritors) ? item.representativeInheritors.filter((entry) => entry && entry.name) : [];
  if (!inheritors.length) return '';
  return `
    <div class="detail-inheritors">
      <strong class="detail-subsection-title">${text.detailInheritorsTitle}</strong>
      <div class="detail-inheritor-list">
        ${inheritors.map((entry) => `
          <span class="detail-inheritor-item">
            <span>${escapeHtml(entry.name)}</span>
            ${entry.note ? `<small>${escapeHtml(entry.note)}</small>` : ''}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReferenceList(item, text) {
  if (window.TeaExperience) return window.TeaExperience.references(item);
  const references = Array.isArray(item.references) ? item.references.filter((reference) => reference && reference.url) : [];
  if (!references.length) return '';
  return `
    <div class="detail-reference-block">
      <strong class="detail-subsection-title">${text.detailReferencesTitle}</strong>
      <div class="detail-reference-list">
        ${references.map((reference) => `
          <a class="detail-reference-item" href="${escapeHtml(reference.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(reference.title)}</span>
            <small>${escapeHtml(reference.authorityLevel || reference.type || '')}</small>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSourceAuditMeta(item, text) {
  return `
    <div class="detail-status-meta">
      <span class="meta-pill"><strong>${text.detailSourceStatusLabel}</strong> ${escapeHtml(formatSourceStatus(item.sourceStatus))}</span>
      <span class="meta-pill"><strong>${text.detailDataQualityLabel}</strong> ${escapeHtml(formatDataQuality(item.dataQuality))}</span>
      <span class="meta-pill"><strong>${text.detailLastVerifiedLabel}</strong> ${escapeHtml(item.lastVerified || '')}</span>
    </div>
    ${renderReferenceList(item, text)}
  `;
}

function renderDetailLeadCard(item, text) {
  const lead = localizedField(item, 'lead') || localizedField(item, 'description');
  return `
    <section class="detail-lead-card">
      <span class="detail-lead-label">${detailCopy('leadLabel')}</span>
      <p class="detail-lead-text">${escapeHtml(lead)}</p>
      <div class="detail-status-strip">
        <span class="meta-pill"><strong>${text.detailSourceStatusLabel}</strong> ${escapeHtml(formatSourceStatus(item.sourceStatus))}</span>
        <span class="meta-pill"><strong>${text.detailDataQualityLabel}</strong> ${escapeHtml(formatDataQuality(item.dataQuality))}</span>
      </div>
    </section>
  `;
}

function renderDetailQuickNav(item) {
  const sections = getQuickNavSections(item);
  if (!sections.length) return '';
  return `
    <nav class="detail-quick-nav" aria-label="${escapeHtml(detailCopy('quickJump'))}">
      <span class="detail-quick-nav-label">${escapeHtml(detailCopy('quickJump'))}</span>
      <div class="detail-quick-nav-links">
        ${sections.map((section) => `
          <button type="button" class="detail-anchor-button" data-detail-anchor="${escapeHtml(getSectionId(section.key))}">
            ${escapeHtml(getDetailNavLabel(section.key) || getDetailSectionTitle(section, section.titleZh || ''))}
          </button>
        `).join('')}
      </div>
    </nav>
  `;
}

function renderDetailImageBlock(item) {
  const primaryImage = getPrimaryImage(item);
  if (!primaryImage) return '';
  return `
      <section class="detail-media-card has-image">
        <div class="detail-media-preview">
          <img src="${escapeHtml(primaryImage.url)}" alt="${escapeHtml(primaryImage.caption || `${item.name} 图片`)}">
        </div>
        <div class="detail-media-copy">
          <strong class="detail-media-heading">${detailCopy('imageTitle')}</strong>
          ${primaryImage.caption ? `<p>${escapeHtml(primaryImage.caption)}</p>` : ''}
          ${primaryImage.source ? `<p>${escapeHtml(primaryImage.source)}</p>` : ''}
        </div>
      </section>
    `;
}


function renderStructuredDetailSections(item, text) {
  const sections = Array.isArray(item.detailSections)
    ? item.detailSections.filter((section) => section && String(section.contentZh || '').trim())
    : [];
  if (!sections.length) {
    return `
      <details class="detail-accordion detail-section detail-section-overview" id="${getSectionId('overview')}" open>
        <summary class="detail-accordion-summary">
          <span class="detail-accordion-title">${escapeHtml(DETAIL_SECTION_LABELS.overview.title[state.lang])}</span>
          <span class="detail-accordion-icon" aria-hidden="true"></span>
        </summary>
        <div class="detail-accordion-body">
          ${renderDetailParagraphs(localizedField(item, 'description'))}
        </div>
      </details>
    `;
  }
  const referenceMap = new Map((Array.isArray(item.references) ? item.references : []).map((reference) => [reference.id, reference]));
  return sections.map((section) => {
    let extras = renderDetailSourcePills(section.sourceIds, referenceMap, text);
    if (section.key === 'inheritance') {
      // Named people belong in reviewed narrative, not an automatically appended old list.
      extras = renderDetailSourcePills(section.sourceIds, referenceMap, text);
    }
    if (section.key === 'source_audit') {
      extras = renderSourceAuditMeta(item, text);
    }
    const sectionId = getSectionId(section.key);
    const title = getDetailSectionTitle(section, text.detailSectionZh);
    const isOpen = section.key === 'overview' || section.key === 'practice';
    return `
      <details class="detail-accordion detail-section detail-section-${escapeHtml(section.key || 'default')}" id="${sectionId}" ${isOpen ? 'open' : ''}>
        <summary class="detail-accordion-summary">
          <span class="detail-accordion-title">${escapeHtml(title)}</span>
          <span class="detail-accordion-icon" aria-hidden="true"></span>
        </summary>
        <div class="detail-accordion-body">
          ${renderDetailParagraphs(state.lang === 'zh' ? section.contentZh : section.contentEn)}
          ${extras}
        </div>
      </details>
    `;
  }).join('');
}

function getItemTeaTypeKey(item) {
  return teaTypeKeyByZh.get(item?.teaType)
    || teaTypeKeyByEn.get(item?.teaTypeEn)
    || 'other';
}

function shortProvinceLabel(name) {
  if (state.lang === 'en') return localizedPlace(provinceDisplayName(name));
  const display = provinceDisplayName(name);
  if (shortProvinceNameMap[display]) return shortProvinceNameMap[display];
  return display
    .replace(/省$/, '')
    .replace(/市$/, '')
    .replace(/壮族自治区$/, '广西')
    .replace(/回族自治区$/, '宁夏')
    .replace(/维吾尔自治区$/, '新疆')
    .replace(/自治区$/, '');
}

function stripSingleOuterParens(text) {
  const output = String(text || '').trim();
  if (!output.startsWith('(') || !output.endsWith(')')) return output;
  let depth = 0;
  for (let index = 0; index < output.length; index += 1) {
    const char = output[index];
    if (char === '(') depth += 1;
    if (char === ')') {
      depth -= 1;
      if (depth === 0 && index !== output.length - 1) {
        return output;
      }
    }
  }
  return output.slice(1, -1).trim();
}

function trimOuterParens(text) {
  let output = String(text || '').trim();
  let next = stripSingleOuterParens(output);
  while (next !== output) {
    output = next;
    next = stripSingleOuterParens(output);
  }
  return output;
}

function splitTopLevelGroups(text) {
  const groups = [];
  let depth = 0;
  let start = -1;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '(') {
      if (depth === 0) start = index + 1;
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        groups.push(text.slice(start, index).trim());
        start = -1;
      }
    }
  }
  return groups.filter(Boolean);
}

function parseRingText(text) {
  return trimOuterParens(text)
    .split(',')
    .map((pair) => pair.trim().split(/\s+/).slice(0, 2).map(Number))
    .filter((pair) => Number.isFinite(pair[0]) && Number.isFinite(pair[1]));
}

function parsePolygonText(text) {
  const source = stripSingleOuterParens(String(text || '').trim());
  const groups = splitTopLevelGroups(source);
  if (groups.length) {
    return groups
      .map(parseRingText)
      .filter((ring) => ring.length > 0);
  }
  const ring = parseRingText(source);
  return ring.length ? [ring] : [];
}

function parseBoundaryWkt(wkt) {
  const source = String(wkt || '').trim();
  if (!source) return [];
  if (source.startsWith('MULTIPOLYGON')) {
    const payload = stripSingleOuterParens(source.slice('MULTIPOLYGON'.length));
    return splitTopLevelGroups(payload)
      .map(parsePolygonText)
      .filter((polygon) => polygon.length > 0);
  }
  if (source.startsWith('POLYGON')) {
    const polygon = parsePolygonText(source.slice('POLYGON'.length));
    return polygon.length ? [polygon] : [];
  }
  return [];
}

function collectBoundaryCoordinates(polygons) {
  const out = [];
  polygons.forEach((polygon) => {
    polygon.forEach((ring) => {
      ring.forEach((coord) => out.push(coord));
    });
  });
  return out;
}

function outerRing(polygon) {
  return polygon[0] || [];
}

function polygonLatitudeRange(polygon) {
  const ring = outerRing(polygon);
  return ring.reduce((acc, coord) => {
    acc.min = Math.min(acc.min, coord[1]);
    acc.max = Math.max(acc.max, coord[1]);
    return acc;
  }, { min: Infinity, max: -Infinity });
}

function splitProvinceGeometry(name, geometry) {
  if (name !== HAINAN_GEO_NAME) {
    return { mapGeometry: geometry, insetGeometry: [] };
  }

  const mapGeometry = [];
  const insetGeometry = [];
  geometry.forEach((polygon) => {
    const latRange = polygonLatitudeRange(polygon);
    if (latRange.max < SOUTH_SEA_INSET_LAT_THRESHOLD) insetGeometry.push(polygon);
    else mapGeometry.push(polygon);
  });

  return {
    mapGeometry: mapGeometry.length ? mapGeometry : geometry,
    insetGeometry
  };
}

const southSeaInsetPolygons = [];

const adminGeometryRecords = ADMIN.items
  .map((item, index) => {
    const geometry = parseBoundaryWkt(item.boundary);
    const expectedPolygonCount = REFERENCE_GEOMETRY_EXPECTATIONS.get(item.name);
    if (expectedPolygonCount !== undefined && geometry.length !== expectedPolygonCount) {
      console.warn(`[map] Unexpected polygon count for ${item.name}: expected ${expectedPolygonCount}, received ${geometry.length}`);
    }
    const { mapGeometry, insetGeometry } = splitProvinceGeometry(item.name, geometry);
    southSeaInsetPolygons.push(...insetGeometry);
    return {
      id: `official-${index}`,
      gb: item.gb,
      name: item.name,
      displayName: provinceDisplayName(item.name),
      shortLabel: shortProvinceLabel(item.name),
      center: item.center,
      geometry: mapGeometry
    };
  })
  .filter((item) => item.geometry.length > 0);

const projectionConfig = (() => {
  const standardParallel1 = toRadians(25);
  const standardParallel2 = toRadians(47);
  const centralMeridian = toRadians(105);
  const originLatitude = toRadians(0);
  const n = (Math.sin(standardParallel1) + Math.sin(standardParallel2)) / 2;
  const c = Math.cos(standardParallel1) ** 2 + 2 * n * Math.sin(standardParallel1);
  const rho0 = Math.sqrt(c - 2 * n * Math.sin(originLatitude)) / n;
  return { centralMeridian, n, c, rho0 };
})();

function projectGeoPoint(lng, lat) {
  const lambda = toRadians(lng);
  const phi = toRadians(lat);
  const theta = projectionConfig.n * (lambda - projectionConfig.centralMeridian);
  const rho = Math.sqrt(Math.max(0, projectionConfig.c - 2 * projectionConfig.n * Math.sin(phi))) / projectionConfig.n;
  return [rho * Math.sin(theta), projectionConfig.rho0 - rho * Math.cos(theta)];
}

const rawProjectionPoints = [
  ...adminGeometryRecords.flatMap((feature) => collectBoundaryCoordinates(feature.geometry)),
  ...adminGeometryRecords.map((feature) => [feature.center.lng, feature.center.lat])
].map((coord) => projectGeoPoint(coord[0], coord[1]));

const rawProjectionBounds = rawProjectionPoints.reduce((acc, coord) => {
  acc.minX = Math.min(acc.minX, coord[0]);
  acc.maxX = Math.max(acc.maxX, coord[0]);
  acc.minY = Math.min(acc.minY, coord[1]);
  acc.maxY = Math.max(acc.maxY, coord[1]);
  return acc;
}, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

const baseFitScale = Math.min(
  (VIEWBOX.width - VIEWBOX.padding * 2) / (rawProjectionBounds.maxX - rawProjectionBounds.minX),
  (VIEWBOX.height - VIEWBOX.padding * 2) / (rawProjectionBounds.maxY - rawProjectionBounds.minY)
);
const baseOffsetX = VIEWBOX.padding + ((VIEWBOX.width - VIEWBOX.padding * 2) - (rawProjectionBounds.maxX - rawProjectionBounds.minX) * baseFitScale) / 2;
const baseOffsetY = VIEWBOX.padding + ((VIEWBOX.height - VIEWBOX.padding * 2) - (rawProjectionBounds.maxY - rawProjectionBounds.minY) * baseFitScale) / 2;

function projectBasePoint(lng, lat) {
  const [x, y] = projectGeoPoint(lng, lat);
  return [
    baseOffsetX + (x - rawProjectionBounds.minX) * baseFitScale,
    baseOffsetY + (rawProjectionBounds.maxY - y) * baseFitScale
  ];
}

function polygonProjectedArea(polygon, projector = projectBasePoint) {
  const ring = outerRing(polygon);
  if (ring.length < 3) return 0;
  const points = ring.map((coord) => {
    const [x, y] = projector(coord[0], coord[1]);
    return { x, y };
  });
  const closedLength = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
    ? ring.length - 1
    : ring.length;
  if (closedLength < 3) return 0;
  let area = 0;
  for (let index = 0; index < closedLength; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % closedLength];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) / 2;
}

function filterReferenceMainGeometry(name, geometry) {
  if (REFERENCE_PROXY_GEO_NAMES.has(name)) return [];
  const polygonsWithArea = geometry
    .map((polygon) => ({ polygon, area: polygonProjectedArea(polygon) }))
    .filter(({ polygon }) => outerRing(polygon).length > 0);
  if (!polygonsWithArea.length) return geometry;
  let largestIndex = 0;
  polygonsWithArea.forEach((entry, index) => {
    if (entry.area > polygonsWithArea[largestIndex].area) largestIndex = index;
  });
  return polygonsWithArea
    .filter((entry, index) => index === largestIndex || entry.area >= REFERENCE_MAIN_POLYGON_MIN_AREA)
    .map((entry) => entry.polygon);
}

function computeBounds(points) {
  return points.reduce((acc, point) => {
    acc.minX = Math.min(acc.minX, point.x);
    acc.maxX = Math.max(acc.maxX, point.x);
    acc.minY = Math.min(acc.minY, point.y);
    acc.maxY = Math.max(acc.maxY, point.y);
    return acc;
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
}

function applyViewTransformPoint(x, y) {
  return {
    x: x * state.viewScale + state.viewX,
    y: y * state.viewScale + state.viewY
  };
}

function buildPathFromRawPoints(points, closePath = false) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ') + (closePath ? ' Z' : '');
}

function geometryToPath(polygons) {
  return polygons.map((polygon) => polygon.map((ring) => {
    const points = ring.map((coord) => {
      const [x, y] = projectBasePoint(coord[0], coord[1]);
      return { x, y };
    });
    return buildPathFromRawPoints(points, true);
  }).join(' ')).join(' ');
}

function geometryToBounds(polygons) {
  const points = collectBoundaryCoordinates(polygons).map((coord) => {
    const [x, y] = projectBasePoint(coord[0], coord[1]);
    return { x, y };
  });
  return computeBounds(points);
}

const provinceFeatures = adminGeometryRecords.map((feature, index) => {
  const [anchorX, anchorY] = projectBasePoint(feature.center.lng, feature.center.lat);
  const referenceGeometry = filterReferenceMainGeometry(feature.name, feature.geometry);
  return {
    ...feature,
    path: geometryToPath(feature.geometry),
    referenceGeometry,
    referencePath: geometryToPath(referenceGeometry),
    bounds: geometryToBounds(feature.geometry),
    anchorX,
    anchorY,
    colorIndex: index
  };
});

function coordinateKey(coord) {
  return `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`;
}

function edgeKey(coordA, coordB) {
  const keyA = coordinateKey(coordA);
  const keyB = coordinateKey(coordB);
  return keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
}

function buildBoundaryPaths(features) {
  const edgeMap = new Map();

  features.forEach((feature) => {
    feature.geometry.forEach((polygon) => {
      const ring = outerRing(polygon);
      if (ring.length < 2) return;
      const closedLength = coordinateKey(ring[0]) === coordinateKey(ring[ring.length - 1]) ? ring.length - 1 : ring.length;
      for (let index = 0; index < closedLength; index += 1) {
        const start = ring[index];
        const end = ring[(index + 1) % closedLength];
        if (coordinateKey(start) === coordinateKey(end)) continue;
        const key = edgeKey(start, end);
        const [x1, y1] = projectBasePoint(start[0], start[1]);
        const [x2, y2] = projectBasePoint(end[0], end[1]);
        const segment = `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`;
        const current = edgeMap.get(key);
        if (current) current.count += 1;
        else edgeMap.set(key, { count: 1, segment });
      }
    });
  });

  const national = [];
  const internal = [];
  edgeMap.forEach((edge) => {
    if (edge.count === 1) national.push(edge.segment);
    else internal.push(edge.segment);
  });

  return {
    national: national.join(' '),
    internal: internal.join(' ')
  };
}

const boundaryPaths = buildBoundaryPaths(adminGeometryRecords);

const southSeaInsetViewport = {
  x: SOUTH_SEA_INSET.x + SOUTH_SEA_INSET.padding,
  y: SOUTH_SEA_INSET.y + SOUTH_SEA_INSET.titleHeight + SOUTH_SEA_INSET.padding,
  width: SOUTH_SEA_INSET.width - SOUTH_SEA_INSET.padding * 2,
  height: SOUTH_SEA_INSET.height - SOUTH_SEA_INSET.titleHeight - SOUTH_SEA_INSET.padding * 2
};

const southSeaProjectionPoints = southSeaInsetPolygons
  .flatMap((polygon) => collectBoundaryCoordinates([polygon]))
  .map((coord) => projectGeoPoint(coord[0], coord[1]));

const southSeaProjectionBounds = southSeaProjectionPoints.length
  ? southSeaProjectionPoints.reduce((acc, coord) => {
    acc.minX = Math.min(acc.minX, coord[0]);
    acc.maxX = Math.max(acc.maxX, coord[0]);
    acc.minY = Math.min(acc.minY, coord[1]);
    acc.maxY = Math.max(acc.maxY, coord[1]);
    return acc;
  }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })
  : { minX: 0, maxX: 1, minY: 0, maxY: 1 };

const southSeaFitScale = southSeaProjectionPoints.length
  ? Math.min(
    southSeaInsetViewport.width / Math.max(0.0001, southSeaProjectionBounds.maxX - southSeaProjectionBounds.minX),
    southSeaInsetViewport.height / Math.max(0.0001, southSeaProjectionBounds.maxY - southSeaProjectionBounds.minY)
  )
  : 1;

const southSeaOffsetX = southSeaInsetViewport.x + (southSeaInsetViewport.width - (southSeaProjectionBounds.maxX - southSeaProjectionBounds.minX) * southSeaFitScale) / 2;
const southSeaOffsetY = southSeaInsetViewport.y + (southSeaInsetViewport.height - (southSeaProjectionBounds.maxY - southSeaProjectionBounds.minY) * southSeaFitScale) / 2;

function projectSouthSeaInsetPoint(lng, lat) {
  const [x, y] = projectGeoPoint(lng, lat);
  return [
    southSeaOffsetX + (x - southSeaProjectionBounds.minX) * southSeaFitScale,
    southSeaOffsetY + (southSeaProjectionBounds.maxY - y) * southSeaFitScale
  ];
}

function southSeaGeometryToPath(polygons) {
  return polygons.map((polygon) => polygon.map((ring) => {
    const points = ring.map((coord) => {
      const [x, y] = projectSouthSeaInsetPoint(coord[0], coord[1]);
      return { x, y };
    });
    return buildPathFromRawPoints(points, true);
  }).join(' ')).join(' ');
}

const southSeaInsetPath = southSeaInsetPolygons.length ? southSeaGeometryToPath(southSeaInsetPolygons) : '';

const baseMapBounds = computeBounds(
  provinceFeatures.flatMap((feature) => collectBoundaryCoordinates(feature.geometry).map((coord) => {
    const [x, y] = projectBasePoint(coord[0], coord[1]);
    return { x, y };
  }))
);

const provinceFeatureMap = new Map(provinceFeatures.map((feature) => [feature.name, feature]));
const provinceBoundsMap = new Map(provinceFeatures.map((feature) => [feature.displayName, feature.bounds]));

const provincePalette = [
  '#f7dfbf', '#dff0d3', '#e9d5f2', '#d9e4f5', '#f6efbb', '#f8dccc',
  '#d7efe5', '#f4dbe5', '#dbe8ce', '#eee3c3', '#d9e5f2', '#f6ead2'
];
const provinceColorMap = new Map(
  provinceFeatures.map((feature) => [feature.name, provincePalette[feature.colorIndex % provincePalette.length]])
);

function provinceCountsFromItems(items) {
  const counts = new Map();
  items.forEach((item) => counts.set(item.province, (counts.get(item.province) || 0) + 1));
  return counts;
}

function filteredItems(options = {}) {
  const ignoreMapLegend = Boolean(options.ignoreMapLegend);
  const keyword = state.search.trim().toLowerCase();
  const activeLegendKeys = new Set(ignoreMapLegend ? [] : getActiveMapLegendTeaTypes());
  return DATA.items.filter((item) => {
    const teaMatch = state.teaType === 'all' ? true : item.teaType === state.teaType;
    const provinceMatch = state.province === 'all' ? true : item.province === state.province;
    const legendMatch = !activeLegendKeys.size ? true : activeLegendKeys.has(getItemTeaTypeKey(item));
    const keywordMatch = !keyword ? true : [item.name, item.nameEn, item.province, item.provinceEn, item.city, item.cityEn, item.teaType, item.teaTypeEn]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
    const topicMatch = state.topic === 'all' || (state.topic === 'ritual' ? item.category === '民俗' : item.category === '传统技艺');
    return teaMatch && provinceMatch && legendMatch && keywordMatch && topicMatch;
  });
}

function getSelectedItem(items) {
  if (state.view === 'detail') return getItemById(state.selectedId);
  return items.find((item) => item.id === state.selectedId) || null;
}

function getItemById(itemId) {
  return DATA.items.find((item) => item.id === itemId) || null;
}

function getMapPreviewItem(items) {
  return items.find((item) => item.id === state.mapPreviewId) || null;
}

function scrollMapContextPanelIntoView() {
  window.TeaExperience?.focusPreview();
}

function clearMapPreview() {
  state.mapPreviewId = null;
}

function setMapPreview(itemId, options = {}) {
  state.mapPreviewId = itemId || null;
  rerender();
  if (options.revealPanel) scrollMapContextPanelIntoView();
}

function buildMapPreviewSummary(item) {
  if (item.shortSummaryZh) return state.lang === 'zh' ? item.shortSummaryZh : item.descriptionEn;
  const categoryLabel = state.lang === 'zh' ? item.category : item.categoryEn;
  const teaTypeLabel = state.lang === 'zh' ? item.teaType : item.teaTypeEn;
  if (state.lang === 'zh') {
    return `${item.name}收录于${item.yearBatch}公布批次，分布于${item.province}${item.city ? ` · ${item.city}` : ''}，归属${categoryLabel}，以${teaTypeLabel}相关传统为主要识别线索，保护单位为${item.protectionUnit}。`;
  }
  return `${item.nameEn} is recorded in ${item.yearBatchEn} and is associated with ${item.cityEn || item.provinceEn}. Its safeguarding body is ${item.protectionUnitEn}.`;
}

function toggleMapLegendTeaType(key) {
  if (!teaTypeConfigByKey.has(key)) return;
  const nextSelection = new Set(state.mapLegendTeaTypes);
  if (nextSelection.has(key)) nextSelection.delete(key);
  else nextSelection.add(key);
  state.mapLegendTeaTypes = [...nextSelection];
  rerender();
}

function clearMapLegendTeaTypes(options = {}) {
  if (!state.mapLegendTeaTypes.length) return;
  state.mapLegendTeaTypes = [];
  if (options.rerender !== false) rerender();
}

function iconMarkup(icon, color) {
  const stroke = color || '#2f3b34';
  const base = `stroke="${stroke}" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  switch (icon) {
    case 'leaf': return `<path ${base} d="M2 11c0-4.4 3.9-7.1 11-7.1-.8 6.3-3.3 10.2-8 10.2-1.8 0-3-1.1-3-3.1Z"></path><path ${base} d="M4.4 12.8c1.7-2.1 4.1-4 7-5.6"></path>`;
    case 'ember': return `<path ${base} d="M7.5 3.8c.8 1.6 2.9 3.4 2.9 6.5A3.7 3.7 0 0 1 6.8 14a3.7 3.7 0 0 1-3.6-3.7c0-1.5.7-2.9 1.9-4"></path><path ${base} d="M6.7 8c.4.9 1.8 1.5 1.8 3.1a1.9 1.9 0 0 1-3.8 0c0-.7.4-1.4 1.1-2"></path>`;
    case 'mountain': return `<path ${base} d="M2 13 6.4 5.6l3.1 4.5"></path><path ${base} d="M7.4 13 10.7 7.8 14 13"></path>`;
    case 'swirl': return `<path ${base} d="M4.2 5.8c1.5-1.8 4.9-1.8 6.4.2 1.3 1.7.5 4.3-1.6 4.9-1.8.6-3.8-.7-3.8-2.6 0-1.6 1.3-2.8 2.9-2.6"></path><path ${base} d="M8.4 11c-1 .6-2.6.7-3.6-.1"></path>`;
    case 'sun': return `<circle ${base} cx="8" cy="8" r="2.8"></circle><path ${base} d="M8 1.6v2M8 12.4v2M1.6 8h2M12.4 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M12.9 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4"></path>`;
    case 'petal': return `<path ${base} d="M8 4.3c1.6-1.9 4.3-1.8 5.4.3-.8 2.4-2.6 3.8-5.4 4.2-2.9-.4-4.6-1.8-5.4-4.2 1.1-2.1 3.8-2.2 5.4-.3Z"></path><path ${base} d="M8 8.5v5"></path>`;
    case 'flower': return `<circle ${base} cx="8" cy="8" r="1.1"></circle><path ${base} d="M8 2.6c1.1-1.4 3.1-1.4 3.9.2-.4 1.6-1.4 2.5-2.9 2.8"></path><path ${base} d="M13.4 8c1.3 1.1 1.4 3.1-.2 3.9-1.6-.4-2.5-1.4-2.8-2.9"></path><path ${base} d="M8 13.4c-1.1 1.3-3.1 1.4-3.9-.2.4-1.6 1.4-2.5 2.9-2.8"></path><path ${base} d="M2.6 8c-1.3-1.1-1.4-3.1.2-3.9 1.6.4 2.5 1.4 2.8 2.9"></path>`;
    case 'disc': return `<circle ${base} cx="8" cy="8" r="4.4"></circle><path ${base} d="M5.2 8h5.6M8 5.2v5.6"></path>`;
    case 'cup': return `<path ${base} d="M3.6 6.8h7.2A2.1 2.1 0 0 1 8.9 10H5.5a2.1 2.1 0 0 1-1.9-3.2Z"></path><path ${base} d="M10.8 6.8H12a1.5 1.5 0 1 1 0 3h-.8"></path><path ${base} d="M4.2 12h5.8"></path>`;
    case 'tray': return `<path ${base} d="M2.5 9.5h11"></path><path ${base} d="M4.5 9.5l1.6-3.8M11.5 9.5 9.9 5.7"></path><path ${base} d="M5 12h6"></path>`;
    case 'herb': return `<path ${base} d="M8 13.8V5.6"></path><path ${base} d="M8 8c-2.3-.1-3.9-1.1-4.9-3.2 2.7-.5 4.5.2 5.4 1.9"></path><path ${base} d="M8 10.4c2-.3 3.4-1.5 4.3-3.6-2.4-.3-3.8.4-4.3 2.1"></path>`;
    default: return `<circle ${base} cx="8" cy="8" r="4"></circle>`;
  }
}

function parseMaybeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveItemCoordinate(item) {
  const lng = parseMaybeNumber(item.lng);
  const lat = parseMaybeNumber(item.lat);
  if (lng !== null && lat !== null) return [lng, lat];
  if (cityCoordinateOverrides[item.city]) return cityCoordinateOverrides[item.city];
  const provinceFeature = provinceFeatureMap.get(provinceGeoName(item.province));
  if (provinceFeature) return [provinceFeature.center.lng, provinceFeature.center.lat];
  return null;
}

function projectProvinceAnchor(province) {
  const feature = provinceFeatureMap.get(provinceGeoName(province));
  if (!feature) return { rawX: VIEWBOX.width / 2, rawY: VIEWBOX.height / 2, name: province };
  return { rawX: feature.anchorX, rawY: feature.anchorY, name: province };
}

function getItemAnchor(item) {
  const coordinate = resolveItemCoordinate(item);
  if (coordinate) {
    const [rawX, rawY] = projectBasePoint(coordinate[0], coordinate[1]);
    return { rawX, rawY, key: `${coordinate[0].toFixed(3)},${coordinate[1].toFixed(3)}` };
  }
  const provinceAnchor = projectProvinceAnchor(item.province);
  return { rawX: provinceAnchor.rawX, rawY: provinceAnchor.rawY, key: `province:${item.province}` };
}

function applyBaseMapTransform() {
  if (!isMapZoomPanEnabled()) {
    const identity = 'matrix(1 0 0 1 0 0)';
    els.chinaShapeLayer.setAttribute('transform', identity);
    els.provinceBorderLayer.setAttribute('transform', identity);
    els.nationalBoundaryLayer.setAttribute('transform', identity);
    return;
  }
  const matrix = `matrix(${state.viewScale.toFixed(4)} 0 0 ${state.viewScale.toFixed(4)} ${state.viewX.toFixed(2)} ${state.viewY.toFixed(2)})`;
  els.chinaShapeLayer.setAttribute('transform', matrix);
  els.provinceBorderLayer.setAttribute('transform', matrix);
  els.nationalBoundaryLayer.setAttribute('transform', matrix);
}

function clampViewTransform(scale, viewX, viewY) {
  if (scale <= 1.001) return { scale: 1, viewX: 0, viewY: 0 };
  const marginX = 84;
  const marginY = 70;
  const minViewX = VIEWBOX.width - marginX - baseMapBounds.maxX * scale;
  const maxViewX = marginX - baseMapBounds.minX * scale;
  const minViewY = VIEWBOX.height - marginY - baseMapBounds.maxY * scale;
  const maxViewY = marginY - baseMapBounds.minY * scale;
  return {
    scale,
    viewX: clamp(viewX, minViewX, maxViewX),
    viewY: clamp(viewY, minViewY, maxViewY)
  };
}

function updateView(scale, viewX, viewY) {
  if (!isMapZoomPanEnabled()) {
    state.viewScale = 1;
    state.viewX = 0;
    state.viewY = 0;
    storeCurrentMapCamera();
    applyBaseMapTransform();
    updateZoomUi();
    return;
  }
  const next = clampViewTransform(clamp(scale, ZOOM_LIMITS.min, ZOOM_LIMITS.max), viewX, viewY);
  state.viewScale = next.scale;
  state.viewX = next.viewX;
  state.viewY = next.viewY;
  storeCurrentMapCamera();
  applyBaseMapTransform();
  const items = filteredItems();
  renderMapOverlays(items);
  renderMapContext(items);
  updateZoomUi();
  window.TeaExperience?.afterRender(true);
}

function resetView(options = {}) {
  if (!isMapZoomPanEnabled()) {
    state.viewScale = 1;
    state.viewX = 0;
    state.viewY = 0;
    storeCurrentMapCamera();
    applyBaseMapTransform();
    if (options.clearPreview) clearMapPreview();
    updateZoomUi();
    return;
  }
  state.viewScale = 1;
  state.viewX = 0;
  state.viewY = 0;
  storeCurrentMapCamera();
  applyBaseMapTransform();
  if (options.clearPreview) clearMapPreview();
  const items = filteredItems();
  renderMapOverlays(items);
  renderMapContext(items);
  updateZoomUi();
  window.TeaExperience?.afterRender(true);
}

function zoomAt(point, factor) {
  if (!isMapZoomPanEnabled()) return;
  const nextScale = clamp(state.viewScale * factor, ZOOM_LIMITS.min, ZOOM_LIMITS.max);
  const rawX = (point.x - state.viewX) / state.viewScale;
  const rawY = (point.y - state.viewY) / state.viewScale;
  const nextViewX = point.x - rawX * nextScale;
  const nextViewY = point.y - rawY * nextScale;
  updateView(nextScale, nextViewX, nextViewY);
}

function focusProvince(province) {
  if (!isMapZoomPanEnabled()) {
    resetView();
    return;
  }
  if (!province || province === 'all') {
    resetView();
    return;
  }
  const targetBounds = provinceBoundsMap.get(province);
  if (targetBounds) {
    const width = Math.max(40, targetBounds.maxX - targetBounds.minX);
    const height = Math.max(40, targetBounds.maxY - targetBounds.minY);
    const focusScale = clamp(Math.min((VIEWBOX.width - 180) / width, (VIEWBOX.height - 180) / height), 1.6, ZOOM_LIMITS.max);
    const centerX = (targetBounds.minX + targetBounds.maxX) / 2;
    const centerY = (targetBounds.minY + targetBounds.maxY) / 2;
    updateView(focusScale, VIEWBOX.width / 2 - centerX * focusScale, VIEWBOX.height / 2 - centerY * focusScale);
    return;
  }
  const anchor = projectProvinceAnchor(province);
  updateView(4.2, VIEWBOX.width / 2 - anchor.rawX * 4.2, VIEWBOX.height / 2 - anchor.rawY * 4.2);
}

function updateZoomUi() {
  if (!isMapZoomPanEnabled()) {
    if (els.zoomValue) els.zoomValue.textContent = '100%';
    if (els.zoomInButton) els.zoomInButton.disabled = true;
    if (els.zoomOutButton) els.zoomOutButton.disabled = true;
    if (els.resetViewButton) els.resetViewButton.disabled = true;
    if (els.resetViewButton) els.resetViewButton.textContent = currentText().zoomReset;
    if (els.zoomInButton) els.zoomInButton.textContent = currentText().zoomIn;
    if (els.zoomOutButton) els.zoomOutButton.textContent = currentText().zoomOut;
    if (els.mapHint) els.mapHint.textContent = currentText().mapHint;
    return;
  }
  if (els.zoomValue) els.zoomValue.textContent = `${Math.round(state.viewScale * 100)}%`;
  if (els.zoomInButton) els.zoomInButton.disabled = state.viewScale >= ZOOM_LIMITS.max - 0.001;
  if (els.zoomOutButton) els.zoomOutButton.disabled = state.viewScale <= ZOOM_LIMITS.min + 0.001;
  if (els.resetViewButton) els.resetViewButton.disabled = false;
  if (els.resetViewButton) els.resetViewButton.textContent = currentText().zoomReset;
  if (els.zoomInButton) els.zoomInButton.textContent = currentText().zoomIn;
  if (els.zoomOutButton) els.zoomOutButton.textContent = currentText().zoomOut;
  if (els.mapHint) els.mapHint.textContent = currentText().mapHint;
}

function getProvinceItems(province) {
  return DATA.items.filter((item) => item.province === province);
}

function getProvinceDirectoryEntries(items = DATA.items) {
  const counts = provinceCountsFromItems(items);
  const teaTypesByProvince = new Map();
  items.forEach((item) => {
    if (!teaTypesByProvince.has(item.province)) teaTypesByProvince.set(item.province, new Set());
    teaTypesByProvince.get(item.province).add(item.teaType);
  });
  return [...counts.keys()]
    .map((province) => ({
      province,
      count: counts.get(province) || 0,
      teaTypes: (teaTypesByProvince.get(province) || new Set()).size
    }))
    .sort((left, right) => {
      const leftHasItems = left.count > 0 ? 1 : 0;
      const rightHasItems = right.count > 0 ? 1 : 0;
      return rightHasItems - leftHasItems
        || right.count - left.count
        || left.province.localeCompare(right.province, 'zh-Hans-CN');
    });
}

function getDefaultProvinceFocus(items = DATA.items) {
  const entries = getProvinceDirectoryEntries(items);
  const firstWithItems = entries.find((entry) => entry.count > 0);
  return (firstWithItems || entries[0] || { province: provinceDisplayName(provinceFeatures[0]?.name || '北京市') }).province;
}

function getMapProvinceFocus() {
  return state.mapProvinceFocus || getDefaultProvinceFocus();
}

function setMapProvinceFocus(province, options = {}) {
  const nextProvince = province || getDefaultProvinceFocus();
  if (state.mapProvinceFocus === nextProvince) return;
  state.mapProvinceFocus = nextProvince;
  if (options.rerender !== false) rerender();
}

function reconcileMapLegendSelection() {
  if (!(state.view === 'map' && isProjectBrowseMode()) || !state.mapLegendTeaTypes.length) return false;
  const availableKeys = new Set(filteredItems({ ignoreMapLegend: true }).map((item) => getItemTeaTypeKey(item)));
  const nextLegendTeaTypes = state.mapLegendTeaTypes.filter((key) => availableKeys.has(key));
  if (nextLegendTeaTypes.length === state.mapLegendTeaTypes.length) return false;
  state.mapLegendTeaTypes = nextLegendTeaTypes;
  return true;
}

function reconcileSelectionState(items) {
  const availableIds = new Set(items.map((item) => item.id));
  if (state.view !== 'detail' && state.selectedId && !availableIds.has(state.selectedId)) state.selectedId = null;
  if (state.mapPreviewId && !availableIds.has(state.mapPreviewId)) state.mapPreviewId = null;

  const provinceEntries = getProvinceDirectoryEntries(items);
  const preferredEntries = provinceEntries.filter((entry) => entry.count > 0);
  const candidates = preferredEntries.length ? preferredEntries : provinceEntries;
  if (!state.mapProvinceFocus || !candidates.some((entry) => entry.province === state.mapProvinceFocus)) {
    state.mapProvinceFocus = getDefaultProvinceFocus(items);
  }
}

function getMapHighlightedProvince() {
  if (state.view === 'map') {
    if (isProvinceBrowseMode()) return getMapProvinceFocus();
    const previewItem = getItemById(state.mapPreviewId);
    return previewItem ? previewItem.province : null;
  }
  return state.province === 'all' ? null : state.province;
}

function storeCurrentMapCamera(mode = currentMapBrowseMode()) {
  state.mapCameraByMode[mode] = {
    scale: state.viewScale,
    x: state.viewX,
    y: state.viewY
  };
}

function restoreMapCamera(mode) {
  const camera = state.mapCameraByMode[mode] || { scale: 1, x: 0, y: 0 };
  state.viewScale = camera.scale;
  state.viewX = camera.x;
  state.viewY = camera.y;
  applyBaseMapTransform();
  updateZoomUi();
}

function resetMapCameras() {
  state.mapCameraByMode = {
    province: { scale: 1, x: 0, y: 0 },
    project: { scale: 1, x: 0, y: 0 }
  };
  state.viewScale = 1;
  state.viewX = 0;
  state.viewY = 0;
}

function setMapBrowseMode(mode) {
  const nextMode = mode === 'project' ? 'project' : 'province';
  if (currentMapBrowseMode() === nextMode) return;
  storeCurrentMapCamera(currentMapBrowseMode());
  state.mapBrowseMode = nextMode;
  if (nextMode === 'province') clearMapPreview();
  restoreMapCamera(nextMode);
  rerender();
}

function renderShellVisibility() {
  if (els.landingShell) els.landingShell.classList.toggle('hidden', state.view !== 'landing');
  if (els.mapShell) els.mapShell.classList.toggle('hidden', state.view !== 'map');
  if (els.provinceShell) els.provinceShell.classList.toggle('hidden', state.view !== 'province');
  if (els.detailShell) els.detailShell.classList.toggle('hidden', state.view !== 'detail');
}

function renderLandingContent() {
  const text = currentText();
  setNodeText(els.siteTitle, text.siteTitle);
  setNodeText(els.siteSubtitle, text.siteSubtitle);
  setNodeText(els.landingEyebrow, text.landingEyebrow);
  setNodeText(els.landingTitle, text.landingTitle);
  setNodeText(els.landingSubtitle, text.landingSubtitle);
  setNodeText(els.landingLead, text.landingLead);
  setNodeText(els.landingPanelKicker, text.landingPanelKicker);
  setNodeText(els.landingPanelTitle, text.landingPanelTitle);
  setNodeText(els.landingPanelBody, text.landingPanelBody);
  setNodeText(els.landingStatsKicker, text.landingStatsKicker);
  if (els.enterMapButton) els.enterMapButton.textContent = text.enterMap;
  if (els.landingTags) {
    els.landingTags.innerHTML = text.landingTags
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join('');
  }
}

function renderGlobalChrome(items) {
  const text = currentText();
  const selected = getSelectedItem(items);
  const crumbs = [{ label: text.breadcrumbHome, target: 'landing', current: state.view === 'landing' }];
  const navMode = state.view === 'landing' ? 'expanded' : 'compact';

  if (state.view !== 'landing') {
    crumbs.push({ label: text.breadcrumbMap, target: 'map', current: state.view === 'map' });
  }
  if (state.view === 'province') {
    crumbs.push({
      label: state.province === 'all' ? text.breadcrumbProvince : localizedPlace(state.province),
      target: 'province',
      current: true
    });
  }
  if (state.view === 'detail') {
    crumbs.push({
      label: state.province === 'all' ? text.breadcrumbProvince : localizedPlace(state.province),
      target: 'province',
      current: false
    });
    crumbs.push({
      label: selected ? (state.lang === 'zh' ? selected.name : selected.nameEn) : text.breadcrumbDetail,
      target: 'detail',
      current: true
    });
  }

  if (els.breadcrumb) {
    els.breadcrumb.innerHTML = crumbs.map((crumb, index) => {
      const sep = index > 0 ? '<span class="crumb-separator">/</span>' : '';
      if (crumb.current) {
        return `${sep}<span class="crumb-current">${escapeHtml(crumb.label)}</span>`;
      }
      return `${sep}<button type="button" class="crumb-link" data-crumb-target="${crumb.target}">${escapeHtml(crumb.label)}</button>`;
    }).join('');
  }

  if (els.globalBackButton) {
    let label = '';
    let target = '';
    if (state.view === 'map') {
      label = text.backToLanding;
      target = 'landing';
    } else if (state.view === 'province') {
      label = text.backToMap;
      target = 'map';
    } else if (state.view === 'detail') {
      label = state.province === 'all' ? text.backToMap : text.backToProvince;
      target = state.province === 'all' ? 'map' : 'province';
    }
    els.globalBackButton.textContent = label;
    els.globalBackButton.dataset.target = target;
    els.globalBackButton.classList.toggle('is-hidden', !target);
  }

  document.title = selected && state.view === 'detail'
    ? `${state.lang === 'zh' ? selected.name : selected.nameEn} | ${text.documentTitle}`
    : text.documentTitle;
  document.documentElement.lang = text.htmlLang;
  document.body.dataset.view = state.view;
  document.body.dataset.navMode = navMode;
}

function renderStaticShellText() {
  const accessibleLabels = {
    breadcrumb: ['页面路径', 'Breadcrumb navigation'], heroStats: ['收录概览', 'Collection overview'],
    discoveryEntry: ['探索茶文化', 'Explore tea culture'], mapBrowseToggle: ['地图浏览方式', 'Map browsing mode'],
    searchInput: ['搜索项目名 / 省份 / 地区', 'Search projects, provinces or places'],
    mapToolbar: ['地图缩放控件', 'Map zoom controls'], officialMapSvg: ['中国茶类非遗地图', 'China tea heritage map']
  };
  for (const [id, labels] of Object.entries(accessibleLabels)) {
    document.getElementById(id)?.setAttribute('aria-label', labels[state.lang === 'zh' ? 0 : 1]);
  }
  const text = currentText();
  setNodeText(els.mapKicker, text.mapKicker);
  setNodeText(els.mapTitle, text.mapTitle);
  setNodeText(els.mapSummary, text.mapSummary);
  setNodeText(els.mapSourceNote, text.mapSourceNote);
  setNodeText(els.provinceKicker, text.provinceKicker);
  setNodeText(els.filterToolbarTitle, text.filterToolbarTitle);
  setNodeText(els.detailKicker, text.detailKicker);
}

function renderMapBrowseControls() {
  const text = currentText();
  const provinceMode = isProvinceBrowseMode();
  if (els.provinceBrowseButton) {
    els.provinceBrowseButton.textContent = text.mapBrowseProvince;
    els.provinceBrowseButton.classList.toggle('is-active', provinceMode);
    els.provinceBrowseButton.setAttribute('aria-pressed', provinceMode ? 'true' : 'false');
  }
  if (els.projectBrowseButton) {
    els.projectBrowseButton.textContent = text.mapBrowseProject;
    els.projectBrowseButton.classList.toggle('is-active', !provinceMode);
    els.projectBrowseButton.setAttribute('aria-pressed', provinceMode ? 'false' : 'true');
  }
  if (els.mapBrowseToggle) {
    els.mapBrowseToggle.setAttribute('aria-label', `${text.mapBrowseProvince} / ${text.mapBrowseProject}`);
  }
  if (els.southSeaToggleButton) {
    els.southSeaToggleButton.innerHTML = `<span class="map-inset-button-glyph" aria-hidden="true"></span><span>${escapeHtml(isSouthSeaInsetExpanded() ? text.mapSouthSeaToggleClose : text.mapSouthSeaToggleOpen)}</span>`;
    els.southSeaToggleButton.setAttribute('aria-expanded', isSouthSeaInsetExpanded() ? 'true' : 'false');
  }
}

function renderSouthSeaFloatPanel() {
  if (!els.southSeaFloatPanel) return;
  if (state.view !== 'map' || !isSouthSeaInsetExpanded()) {
    els.southSeaFloatPanel.innerHTML = '';
    els.southSeaFloatPanel.classList.add('hidden');
    return;
  }
  const text = currentText();
  els.southSeaFloatPanel.innerHTML = `
    <div class="south-sea-float-scroll">
      <div class="south-sea-float-head">
        <h3>${text.southSeaInsetTitle}</h3>
        <button type="button" class="panel-action panel-action-secondary south-sea-close" data-map-panel-action="toggle-south-sea">${text.mapSouthSeaToggleClose}</button>
      </div>
      <div class="south-sea-panel-surface">
        <svg viewBox="${SOUTH_SEA_INSET.x} ${SOUTH_SEA_INSET.y} ${SOUTH_SEA_INSET.width} ${SOUTH_SEA_INSET.height}" aria-label="${text.southSeaInsetTitle}">
          <rect class="south-sea-frame" x="${SOUTH_SEA_INSET.x}" y="${SOUTH_SEA_INSET.y}" width="${SOUTH_SEA_INSET.width}" height="${SOUTH_SEA_INSET.height}" rx="22"></rect>
          <rect class="south-sea-inner" x="${(southSeaInsetViewport.x - 4).toFixed(2)}" y="${(southSeaInsetViewport.y - 4).toFixed(2)}" width="${(southSeaInsetViewport.width + 8).toFixed(2)}" height="${(southSeaInsetViewport.height + 8).toFixed(2)}" rx="18"></rect>
          ${southSeaInsetPath ? `<path class="south-sea-islands" fill-rule="evenodd" d="${southSeaInsetPath}"></path>` : ''}
        </svg>
      </div>
    </div>
  `;
  els.southSeaFloatPanel.classList.remove('hidden');
}

function renderReferenceOverlayDebug() {
  if (!els.referenceMapDebug) return;
  const text = currentText();
  const shouldShowDebug = isReferenceCalibratedMode() && MAP_META.debugOverlay === true;
  els.referenceMapDebug.src = MAP_META.referenceImagePath || '';
  els.referenceMapDebug.alt = text.mapReferenceDebugAlt;
  els.referenceMapDebug.classList.toggle('hidden', !shouldShowDebug);
}

function renderMapComplianceMeta() {
  if (!els.mapComplianceCard) return;
  if (!isReferenceCalibratedMode()) {
    els.mapComplianceCard.innerHTML = '';
    toggleHidden(els.mapComplianceCard, true);
    return;
  }

  const text = currentText();
  const reviewNumber = state.lang === 'zh' ? MAP_META.referenceReviewNumber : (MAP_META.referenceReviewNumber || '').replace('号', '');
  const fileName = MAP_META.fileName || '—';
  const usage = state.lang === 'zh' ? MAP_META.referenceUsedFor : 'Used to align the national outline, provincial boundaries, Taiwan and the South China Sea inset; not displayed directly as the final map.';
  const notes = state.lang === 'zh' ? MAP_META.notes : text.mapSourceNote;
  const editionLabel = state.lang === 'zh' ? MAP_META.referenceEditionLabel : 'China administrative map reference (GS(2016)1600)';

  els.mapComplianceCard.innerHTML = `
    <div class="map-compliance-copy">
      <p class="map-panel-kicker">${escapeHtml(text.mapComplianceKicker)}</p>
      <h3>${escapeHtml(text.mapComplianceTitle)}</h3>
      <p>${escapeHtml(editionLabel)}</p>
    </div>
    <div class="map-compliance-grid">
      <div class="map-compliance-item">
        <span>${escapeHtml(text.mapComplianceReviewLabel)}</span>
        <strong>${escapeHtml(reviewNumber)}</strong>
      </div>
      <div class="map-compliance-item">
        <span>${escapeHtml(text.mapComplianceFileLabel)}</span>
        <strong>${escapeHtml(fileName)}</strong>
      </div>
      <div class="map-compliance-item map-compliance-item-wide">
        <span>${escapeHtml(text.mapComplianceUsageLabel)}</span>
        <strong>${escapeHtml(usage)}</strong>
      </div>
      <div class="map-compliance-item map-compliance-item-wide">
        <span>${escapeHtml(text.mapComplianceNotesLabel)}</span>
        <strong>${escapeHtml(notes)}</strong>
      </div>
    </div>
  `;
  toggleHidden(els.mapComplianceCard, false);
}

function renderMapPresentationMode() {
  const searchEnabled = isMapSearchEnabled();
  const zoomPanEnabled = isMapZoomPanEnabled();
  const legendEnabled = isMapLegendEnabled();
  const contextPanelEnabled = isMapContextPanelEnabled();
  document.body.dataset.mapMode = MAP_RENDER_MODE;
  document.body.dataset.mapBrowseMode = currentMapBrowseMode();
  document.body.dataset.mapSearch = searchEnabled ? 'enabled' : 'disabled';
  document.body.dataset.mapZoomPan = zoomPanEnabled ? 'enabled' : 'disabled';
  document.body.dataset.mapLegend = legendEnabled ? 'enabled' : 'disabled';
  document.body.dataset.mapContextPanel = contextPanelEnabled ? 'enabled' : 'disabled';
  document.body.dataset.mapProvinceEntry = isMapProvinceEntryEnabled() ? 'enabled' : 'disabled';
  document.body.dataset.mapProvinceHover = isMapProvinceHoverEnabled() ? 'enabled' : 'disabled';
  document.body.dataset.mapProvinceButtons = isMapProvinceButtonsEnabled() ? 'enabled' : 'disabled';
  document.body.dataset.mapSouthSeaInset = isSouthSeaInsetExpanded() ? 'expanded' : 'collapsed';

  toggleHidden(els.mapSearchRow, !searchEnabled);
  toggleHidden(els.mapToolbar, !zoomPanEnabled);
  toggleHidden(els.mapHint, !zoomPanEnabled);
  toggleHidden(els.mapLegend, !legendEnabled);
  toggleHidden(els.mapContextPanel, !contextPanelEnabled);

  if (!contextPanelEnabled && els.mapContextPanel) {
    els.mapContextPanel.innerHTML = '';
  }

  renderReferenceOverlayDebug();
  renderMapComplianceMeta();
  renderMapBrowseControls();
  renderSouthSeaFloatPanel();
}

function renderMapContext(items) {
  if (!els.mapContextPanel) return;
  if (!isMapContextPanelEnabled()) {
    els.mapContextPanel.innerHTML = '';
    return;
  }
  const text = currentText();
  const provinceEntries = getProvinceDirectoryEntries(items);
  const provinceCount = provinceEntries.length;
  const focusProvince = getMapProvinceFocus();
  const focusItems = focusProvince ? items.filter((item) => item.province === focusProvince) : [];
  const totalFocusItems = focusProvince ? getProvinceItems(focusProvince) : [];
  const focusTeaTypes = new Set(focusItems.map((item) => item.teaType)).size;

  if (isProvinceBrowseMode()) {
    const spotlight = focusProvince
      ? `
        <section class="map-panel-card province-spotlight-card">
          <p class="map-panel-kicker">${text.mapProvinceSpotlightTitle}</p>
          <h3>${escapeHtml(localizedPlace(focusProvince))}</h3>
          <p>${focusItems.length ? `${escapeHtml(localizedPlace(focusProvince))} · ${projectCount(focusItems.length)}` : text.mapProvinceSpotlightEmpty}</p>
          <div class="detail-meta">
            <span class="meta-pill"><strong>${text.provinceMetaTotal}</strong> ${totalFocusItems.length}</span>
            <span class="meta-pill"><strong>${text.provinceMetaVisible}</strong> ${focusItems.length}</span>
            <span class="meta-pill"><strong>${text.mapProvinceTeaTypes}</strong> ${focusTeaTypes}</span>
          </div>
          <div class="preview-actions">
            <button type="button" class="panel-action panel-action-primary" data-map-panel-action="open-province" data-province="${escapeHtml(focusProvince)}">${text.mapProvinceOpen}</button>
          </div>
        </section>
      `
      : `
        <section class="map-panel-card province-spotlight-card">
          <p class="map-panel-kicker">${text.mapProvinceSpotlightTitle}</p>
          <h3>${text.mapProvinceSpotlightTitle}</h3>
          <p>${text.mapProvinceSpotlightHint}</p>
        </section>
      `;

    els.mapContextPanel.innerHTML = `
      <div class="map-context-scroll province-mode-scroll">
        <section class="map-panel-card province-directory-card">
          <div class="map-panel-headline">
            <h3>${text.mapProvinceDirectoryTitle}</h3>
            <span class="meta-pill">${provinceCount}</span>
          </div>
          <div class="province-directory-list">
            ${provinceEntries.map((entry) => `
              <button
                type="button"
                class="province-directory-item ${focusProvince === entry.province ? 'is-active' : ''} ${entry.count ? 'has-items' : 'is-empty'}"
                data-map-panel-action="focus-province"
                data-province="${escapeHtml(entry.province)}"
                aria-pressed="${focusProvince === entry.province ? 'true' : 'false'}"
              >
                <span class="province-directory-name">${escapeHtml(localizedPlace(entry.province))}</span>
                <span class="province-directory-count">${projectCount(entry.count)}</span>
              </button>
            `).join('')}
          </div>
        </section>
        ${spotlight}
      </div>
    `;
    return;
  }

  const currentViewLabel = state.province === 'all' ? text.mapStatFocusedDefault : localizedPlace(state.province);
  const visibleRegionCount = new Set(items.map((item) => item.province)).size;
  const previewItem = getMapPreviewItem(items);
  els.mapContextPanel.classList.toggle('has-project-preview', Boolean(previewItem));

  if (previewItem) {
    const title = state.lang === 'zh' ? previewItem.name : previewItem.nameEn;
    const subtitle = state.lang === 'zh' ? previewItem.nameEn : '';
    const teaTypeLabel = state.lang === 'zh' ? previewItem.teaType : previewItem.teaTypeEn;
    const categoryLabel = state.lang === 'zh' ? previewItem.category : previewItem.categoryEn;
    const summary = buildMapPreviewSummary(previewItem);
    els.mapContextPanel.innerHTML = `
      <div class="map-context-scroll project-mode-scroll">
        <article class="map-preview-card">
          <p class="map-panel-kicker">${text.mapPreviewKicker}</p>
          <div class="map-preview-header">
            <div class="map-preview-heading">
              <h3 class="map-preview-title">${escapeHtml(title)}</h3>
              <p class="map-preview-subtitle">${escapeHtml(subtitle)}</p>
            </div>
            <span class="map-preview-icon" style="background:${previewItem.color}; color:#fffaf0;">
              <svg viewBox="0 0 16 16" aria-hidden="true">${iconMarkup(previewItem.icon, '#fff8ee')}</svg>
            </span>
          </div>
          <div class="detail-tags">
            <span class="tag-pill">${escapeHtml(teaTypeLabel)}</span>
            <span class="tag-pill">${escapeHtml(categoryLabel)}</span>
            <span class="tag-pill">${escapeHtml(previewItem.code)}</span>
          </div>
          <div class="map-preview-grid">
            <div class="preview-fact">
              <span class="preview-label">${text.detailMetaProvince}</span>
              <strong>${escapeHtml(localizedField(previewItem, 'province'))}</strong>
            </div>
            <div class="preview-fact">
              <span class="preview-label">${text.detailMetaRegion}</span>
              <strong>${escapeHtml(localizedField(previewItem, 'city') || localizedField(previewItem, 'province'))}</strong>
            </div>
            <div class="preview-fact">
              <span class="preview-label">${text.detailMetaBatch}</span>
              <strong>${escapeHtml(localizedField(previewItem, 'yearBatch'))}</strong>
            </div>
            <div class="preview-fact preview-fact-wide">
              <span class="preview-label">${text.detailMetaUnit}</span>
              <strong>${escapeHtml(localizedField(previewItem, 'protectionUnit'))}</strong>
            </div>
          </div>
          <section class="detail-section map-preview-summary-block">
            <h3>${text.mapPreviewSummaryLabel}</h3>
            <p>${escapeHtml(summary)}</p>
          </section>
          <div class="preview-actions">
            ${window.TeaExperience ? window.TeaExperience.actions(previewItem) : ''}
            <button type="button" class="panel-action panel-action-primary" data-preview-action="open" data-id="${previewItem.id}">${text.mapPreviewOpen}</button>
            <button type="button" class="panel-action panel-action-secondary" data-preview-action="province" data-province="${escapeHtml(previewItem.province)}">${text.mapProjectOpenProvince}</button>
            <button type="button" class="panel-action panel-action-secondary" data-preview-action="reset">${text.mapPreviewReset}</button>
          </div>
        </article>
      </div>
    `;
    return;
  }

  els.mapContextPanel.innerHTML = `
    <div class="map-context-scroll project-mode-scroll">
      <section class="map-panel-card project-mode-guide-card">
        <p class="map-panel-kicker">${text.mapBrowseProject}</p>
        <h3>${text.mapBrowseProjectTitle}</h3>
        <p>${text.mapBrowseProjectBody}</p>
        <div class="detail-meta">
          <span class="meta-pill"><strong>${text.mapStatVisible}</strong> ${items.length}</span>
          <span class="meta-pill"><strong>${text.mapStatRegions}</strong> ${visibleRegionCount}</span>
          <span class="meta-pill"><strong>${text.mapStatFocused}</strong> ${escapeHtml(currentViewLabel)}</span>
        </div>
      </section>
    </div>
  `;
}

function renderProvinceHeader(items) {
  if (!els.provinceTitle || !els.provinceSummary || !els.provinceMeta) return;
  const text = currentText();
  const provinceName = state.province === 'all' ? text.provinceDefaultTitle : localizedPlace(state.province);
  const provinceItems = state.province === 'all' ? [] : getProvinceItems(state.province);
  const visibleCount = state.province === 'all' ? 0 : items.length;
  const teaTypeCount = state.province === 'all' ? 0 : new Set(provinceItems.map((item) => item.teaType)).size;

  els.provinceTitle.textContent = provinceName;
  els.provinceSummary.textContent = state.province === 'all'
    ? text.provinceDefaultSummary
    : state.lang === 'zh'
      ? `${state.province}共收录 ${provinceItems.length} 项，当前显示 ${visibleCount} 项。`
      : `${provinceItems.length} items are listed for ${localizedPlace(state.province)}, with ${visibleCount} currently visible.`;
  els.provinceMeta.innerHTML = state.province === 'all'
    ? `<span class="meta-pill"><strong>${text.provinceMetaWaitingLabel}</strong> ${text.provinceMetaWaitingValue}</span>`
    : `
      <span class="meta-pill"><strong>${text.provinceMetaTotal}</strong> ${provinceItems.length}</span>
      <span class="meta-pill"><strong>${text.provinceMetaVisible}</strong> ${visibleCount}</span>
      <span class="meta-pill"><strong>${text.provinceMetaTeaTypes}</strong> ${teaTypeCount}</span>
    `;
}

function renderDetailHeader(items) {
  if (!els.detailPageTitle || !els.detailSummary) return;
  const text = currentText();
  const selected = getSelectedItem(items);
  els.detailPageTitle.textContent = text.detailDefaultTitle;
  if (!selected) {
    els.detailSummary.textContent = text.detailDefaultSummary;
    return;
  }
  els.detailSummary.textContent = `${localizedField(selected, 'province')} · ${localizedField(selected, 'teaType')} · ${localizedField(selected, 'yearBatch')}`;
}

function scrollToShell(shell) {
  if (!shell) return;
  window.requestAnimationFrame(() => {
    const scrollMarginTop = Number.parseFloat(window.getComputedStyle(shell).scrollMarginTop) || 0;
    const shellTop = window.scrollY + shell.getBoundingClientRect().top;
    window.scrollTo({
      top: Math.max(0, shellTop - scrollMarginTop),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
}

function enterMapView() {
  if (window.TeaExperience) return window.TeaExperience.navigate('map');
  state.view = 'map';
  state.province = 'all';
  state.teaType = 'all';
  clearMapLegendTeaTypes({ rerender: false });
  state.selectedId = null;
  state.mapBrowseMode = 'province';
  state.mapProvinceFocus = getDefaultProvinceFocus();
  state.southSeaInsetExpanded = false;
  clearMapPreview();
  state.search = '';
  if (els.searchInput) els.searchInput.value = '';
  resetMapCameras();
  rerender();
  resetView();
  scrollToShell(els.mapShell);
}

function openProvinceView(province, options = {}) {
  if (window.TeaExperience) return window.TeaExperience.navigate('province', { province, keepTeaType: options.keepTeaType });
  const nextProvince = province || 'all';
  state.view = 'province';
  state.province = nextProvince;
  state.teaType = options.keepTeaType ? state.teaType : 'all';
  clearMapPreview();
  const provinceItems = filteredItems();
  state.selectedId = provinceItems[0] ? provinceItems[0].id : null;
  rerender();
  scrollToShell(els.provinceShell);
}

function openDetailView(itemId) {
  if (window.TeaExperience) return window.TeaExperience.navigate('detail', { id: itemId });
  const item = getItemById(itemId);
  if (!item) return;
  state.view = 'detail';
  state.province = item.province;
  state.selectedId = item.id;
  clearMapPreview();
  rerender();
  scrollToShell(els.detailShell);
}

function backToLandingView() {
  if (window.TeaExperience) return window.TeaExperience.navigate('landing');
  state.view = 'landing';
  state.province = 'all';
  state.teaType = 'all';
  clearMapLegendTeaTypes({ rerender: false });
  state.selectedId = null;
  state.mapBrowseMode = 'province';
  state.mapProvinceFocus = getDefaultProvinceFocus();
  state.southSeaInsetExpanded = false;
  clearMapPreview();
  state.search = '';
  if (els.searchInput) els.searchInput.value = '';
  resetMapCameras();
  rerender();
  resetView();
  scrollToShell(els.landingShell);
}

function backToMapView() {
  if (window.TeaExperience) return window.TeaExperience.navigate('map');
  state.view = 'map';
  state.province = 'all';
  state.teaType = 'all';
  state.selectedId = null;
  clearMapPreview();
  restoreMapCamera(currentMapBrowseMode());
  rerender();
  scrollToShell(els.mapShell);
}

function backToProvinceView() {
  if (window.TeaExperience) return window.TeaExperience.navigate('province', { province: state.province });
  if (state.province === 'all') {
    backToMapView();
    return;
  }
  state.view = 'province';
  clearMapPreview();
  const provinceItems = filteredItems();
  state.selectedId = provinceItems[0] ? provinceItems[0].id : null;
  rerender();
  scrollToShell(els.provinceShell);
}

function eventToViewBoxPoint(event) {
  const rect = els.mapSvg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEWBOX.width,
    y: ((event.clientY - rect.top) / rect.height) * VIEWBOX.height
  };
}

function isWithinInteractiveMarker(target, className) {
  let current = target;
  while (current) {
    if (current.classList && current.classList.contains(className)) return true;
    current = current.parentNode;
  }
  return false;
}

function renderHeroStats(items) {
  const text = currentText();
  const stats = [
    { value: DATA.totalItems, label: text.statsItems },
    { value: DATA.totalProvinces, label: text.statsRegions },
    { value: DATA.items.filter(item => item.practiceExperience || item.detailExperience).length, label: state.lang === 'zh' ? '互动探索' : 'Interactive projects' }
  ];
  els.heroStats.innerHTML = stats.map((stat) => `<div class="stat-card"><div class="stat-value">${stat.value}</div><div class="stat-label">${stat.label}</div></div>`).join('');
}

function renderTeaTypeFilters(items) {
  if (!els.teaTypeFilters) return;
  if (state.view !== 'province') {
    els.teaTypeFilters.innerHTML = '';
    return;
  }
  const text = currentText();
  const provinceScopedItems = state.province === 'all' ? DATA.items : getProvinceItems(state.province);
  const counts = new Map();
  provinceScopedItems.forEach((item) => counts.set(item.teaType, (counts.get(item.teaType) || 0) + 1));
  const buttons = [`<button type="button" class="filter-chip ${state.teaType === 'all' ? 'is-active' : ''}" data-filter="all">${text.all} · ${provinceScopedItems.length}</button>`];
  DATA.teaTypes.filter((type) => provinceScopedItems.some((item) => item.teaType === type.zh)).forEach((type) => {
    buttons.push(`<button type="button" class="filter-chip ${state.teaType === type.zh ? 'is-active' : ''}" data-filter="${type.zh}" data-color="${type.color}">${state.lang === 'zh' ? type.zh : type.en} · ${counts.get(type.zh) || 0}</button>`);
  });
  els.teaTypeFilters.innerHTML = buttons.join('');
  [...els.teaTypeFilters.querySelectorAll('.filter-chip')].forEach((button) => {
    const color = button.dataset.color || '#24443d';
    if (button.classList.contains('is-active')) {
      button.style.backgroundColor = color;
      button.style.color = '#fffaf0';
      button.style.borderColor = 'transparent';
    }
    button.addEventListener('click', () => {
      state.teaType = button.dataset.filter;
      rerender();
    });
  });
}

function renderLegend() {
  if (!isMapLegendEnabled()) {
    els.mapLegend.innerHTML = '';
    return;
  }
  const text = currentText();
  const sourceItems = filteredItems({ ignoreMapLegend: true });
  const counts = new Map();
  sourceItems.forEach((item) => {
    const key = getItemTeaTypeKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const activeKeys = new Set(state.mapLegendTeaTypes);
  const legendItems = DATA.teaTypes
    .filter((type) => counts.has(type.key) || activeKeys.has(type.key))
    .map((type) => {
      const sampleItem = DATA.items.find((item) => getItemTeaTypeKey(item) === type.key);
      const icon = sampleItem ? sampleItem.icon : 'leaf';
      const count = counts.get(type.key) || 0;
      const active = activeKeys.has(type.key);
      return `
        <button
          type="button"
          class="legend-item ${active ? 'is-active' : ''}"
          data-legend-key="${type.key}"
          aria-pressed="${active ? 'true' : 'false'}"
        >
          <span class="legend-emblem" style="background:${type.color};"><svg viewBox="0 0 16 16" aria-hidden="true">${iconMarkup(icon, '#fff8ee')}</svg></span>
          <span class="legend-copy">
            <span class="legend-text">${state.lang === 'zh' ? type.zh : type.en}</span>
            <span class="legend-count">${count}</span>
          </span>
        </button>
      `;
    }).join('');

  els.mapLegend.innerHTML = `
    <div class="legend-toolbar">
      <div class="legend-label">${text.mapLegendTitle}</div>
      ${state.mapLegendTeaTypes.length ? `<button type="button" class="legend-reset" data-legend-reset="true">${text.mapLegendReset}</button>` : ''}
    </div>
    <p class="legend-helper ${legendItems ? '' : 'legend-helper-empty'}">${legendItems ? text.mapLegendHint : text.mapLegendEmpty}</p>
    <div class="legend-list">${legendItems}</div>
  `;
}
function renderBoundaryLines() {
  if (isReferenceCalibratedMode()) {
    els.provinceBorderLayer.innerHTML = '';
    els.nationalBoundaryLayer.innerHTML = '';
    return;
  }
  els.provinceBorderLayer.innerHTML = boundaryPaths.internal
    ? `<path class="province-boundary-line internal-boundary-line" d="${boundaryPaths.internal}"></path>`
    : '';
  els.nationalBoundaryLayer.innerHTML = boundaryPaths.national
    ? `<path class="province-boundary-line national-boundary-line" d="${boundaryPaths.national}"></path>`
    : '';
}

function renderSouthSeaInset() {
  if (!els.southSeaInsetLayer) return;
  els.southSeaInsetLayer.innerHTML = '';
}
function renderProvinceShapes(items) {
  const referenceMode = isReferenceCalibratedMode();
  const provinceEntryEnabled = referenceMode ? isMapProvinceEntryEnabled() : true;
  const visibleGeoProvinces = new Set(items.map((item) => provinceGeoName(item.province)));
  const visibleCounts = provinceCountsFromItems(items);
  const highlightedProvince = getMapHighlightedProvince();
  const activeGeoProvince = highlightedProvince ? provinceGeoName(highlightedProvince) : null;

  const fillShapes = provinceFeatures.map((feature) => {
    const shapePath = referenceMode ? feature.referencePath : feature.path;
    if (!shapePath) return '';
    const hasTea = !referenceMode && visibleCounts.has(feature.displayName);
    const isVisible = referenceMode ? true : visibleGeoProvinces.has(feature.name) || alwaysLabeledProvinces.has(feature.displayName);
    const active = activeGeoProvince === feature.name;
    const baseColor = provinceColorMap.get(feature.name) || '#f3ead0';
    const teaColor = baseColor;
    const activeColor = baseColor;
    return `<path class="province-shape ${referenceMode ? 'reference-mode' : ''} ${provinceEntryEnabled ? 'is-interactive' : ''} ${hasTea ? 'has-data' : ''} ${active ? 'is-active' : ''}" fill-rule="evenodd" style="--province-fill:${teaColor};--province-fill-active:${activeColor};" data-province="${feature.displayName}" d="${shapePath}" ${isVisible || state.province === 'all' ? '' : 'opacity="0.58"'}></path>`;
  }).join('');

  els.chinaShapeLayer.innerHTML = fillShapes;
  renderBoundaryLines();
  renderSouthSeaInset();
  applyBaseMapTransform();

  if (!provinceEntryEnabled) return;
  [...els.chinaShapeLayer.querySelectorAll('.province-shape')].forEach((shape) => {
    shape.addEventListener('mouseenter', () => {
      if (state.view === 'map' && isProvinceBrowseMode()) setMapProvinceFocus(shape.dataset.province);
    });
    shape.addEventListener('click', () => {
      if (suppressClick) return;
      const province = shape.dataset.province;
      openProvinceView(province);
    });
  });
}

function renderProvinceButtons(items) {
  if (!els.provinceButtonLayer) return;
  if (!isMapProvinceButtonsEnabled()) {
    els.provinceButtonLayer.innerHTML = '';
    return;
  }

  const counts = provinceCountsFromItems(items);
  const activeProvince = getMapProvinceFocus();
  const buttons = provinceFeatures.map((feature) => {
    const province = feature.displayName;
    const count = counts.get(province) || 0;
    const anchor = projectProvinceAnchor(province);
    const offset = specialBadgeOffsets[province] || { dx: 0, dy: 0 };
    const point = applyViewTransformPoint(anchor.rawX + offset.dx, anchor.rawY + offset.dy);
    if (point.x < -120 || point.x > VIEWBOX.width + 120 || point.y < -80 || point.y > VIEWBOX.height + 80) return '';
    const label = shortProvinceLabel(province);
    const hasItems = count > 0;
    const buttonWidth = state.lang === 'en'
      ? Math.max(54, Math.min(116, label.length * 6.4 + 18))
      : Math.max(hasItems ? 72 : 60, Math.min(126, label.length * 16 + (hasItems ? 40 : 30)));
    const buttonHeight = hasItems ? 38 : 32;
    const hitWidth = buttonWidth + 18;
    const hitHeight = buttonHeight + 14;
    return `
      <g class="province-browse-button ${hasItems ? 'has-items' : 'is-empty'} ${province === activeProvince ? 'is-active' : ''}" data-province="${province}" transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})" aria-label="${escapeHtml(`${localizedPlace(province)}${hasItems ? ` ${projectCount(count)}` : ''}`)}">
        <rect class="province-browse-hit-area" x="${(-hitWidth / 2).toFixed(2)}" y="${(-hitHeight / 2).toFixed(2)}" width="${hitWidth.toFixed(2)}" height="${hitHeight.toFixed(2)}" rx="${(hitHeight / 2).toFixed(2)}"></rect>
        <rect class="province-browse-pill-shape" x="${(-buttonWidth / 2).toFixed(2)}" y="${(-buttonHeight / 2).toFixed(2)}" width="${buttonWidth.toFixed(2)}" height="${buttonHeight}" rx="15"></rect>
        <text class="province-browse-pill-name" text-anchor="middle" y="${hasItems ? '-2' : '5'}">${escapeHtml(label)}</text>
        ${hasItems ? `<text class="province-browse-pill-count" text-anchor="middle" y="12">${projectCount(count)}</text>` : ''}
      </g>
    `;
  }).join('');

  els.provinceButtonLayer.innerHTML = buttons;
  [...els.provinceButtonLayer.querySelectorAll('.province-browse-button')].forEach((button) => {
    button.addEventListener('mouseenter', () => setMapProvinceFocus(button.dataset.province));
    button.addEventListener('click', () => {
      if (suppressClick) return;
      openProvinceView(button.dataset.province);
    });
  });
}

function renderProvinceLabels(items) {
  const visibleProvinces = new Set(items.map((item) => item.province));
  const visibleCounts = provinceCountsFromItems(items);
  const focusedOnly = state.viewScale > 2.6 && state.province !== 'all';
  const labels = [];

  provinceFeatures.forEach((feature) => {
    const province = feature.displayName;
    const hasData = visibleCounts.has(province);
    const shouldShow = focusedOnly
      ? province === state.province || alwaysLabeledProvinces.has(province)
      : (hasData && (visibleProvinces.has(province) || state.province === province || state.province === 'all')) || alwaysLabeledProvinces.has(province);
    if (!shouldShow || inlineLabelSkip.has(province)) return;
    const point = applyViewTransformPoint(feature.anchorX, feature.anchorY);
    if (point.x < -80 || point.x > VIEWBOX.width + 80 || point.y < -60 || point.y > VIEWBOX.height + 60) return;
    const count = visibleCounts.get(province) || 0;
    labels.push(`<g transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})"><text class="province-label" text-anchor="middle">${shortProvinceLabel(feature.displayName)}</text>${count > 0 ? `<text class="province-count" text-anchor="middle" y="18">${projectCount(count)}</text>` : ''}</g>`);
  });

  els.provinceLabelLayer.innerHTML = labels.join('');
}

function renderSpecialRegions(items) {
  const visibleProvinces = new Set(items.map((item) => item.province));
  const visibleCounts = provinceCountsFromItems(items);
  const text = currentText();
  const specials = [];

  Object.keys(specialBadgeOffsets).forEach((province) => {
    const offset = specialBadgeOffsets[province];
    const anchor = projectProvinceAnchor(province);
    const point = applyViewTransformPoint(anchor.rawX, anchor.rawY);
    const x = point.x + offset.dx;
    const y = point.y + offset.dy;
    const count = visibleCounts.get(province) || 0;
    const isVisible = visibleProvinces.has(province) || state.province === province;
    if (!isVisible && state.province !== 'all') return;
    specials.push(`
      <g class="special-region-badge ${state.province === province ? 'is-active' : ''}" data-province="${province}">
        <line x1="${point.x.toFixed(2)}" y1="${point.y.toFixed(2)}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" stroke="#9a8560" stroke-width="1.4" stroke-dasharray="3 3"></line>
        <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">
          <rect class="special-region-pill" x="-38" y="-20" width="76" height="44" rx="18"></rect>
          <text class="special-region-name" text-anchor="middle" y="-3">${localizedPlace(province)}</text>
          <text class="special-region-count" text-anchor="middle" y="14">${projectCount(count)}</text>
        </g>
      </g>
    `);
  });

  els.specialRegionLayer.innerHTML = specials.join('');
  [...els.specialRegionLayer.querySelectorAll('.special-region-badge')].forEach((badge) => {
    badge.addEventListener('click', () => {
      if (suppressClick) return;
      const province = badge.dataset.province;
      openProvinceView(province);
    });
  });
}

function renderReferenceSpecialRegions() {
  const interactive = isMapProvinceEntryEnabled();
  const activeProvince = getMapHighlightedProvince();
  const proxies = Object.entries(referenceSpecialRegionShapes).map(([province, shape]) => {
    const anchor = projectProvinceAnchor(province);
    const fill = provinceColorMap.get(provinceGeoName(province)) || '#f3ead0';
    const activeFill = '#ead6a6';
    const point = applyViewTransformPoint(anchor.rawX + shape.dx, anchor.rawY + shape.dy);
    return `
      <g class="reference-special-region ${interactive ? 'is-interactive' : ''} ${activeProvince === province ? 'is-active' : ''}" data-province="${province}" transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})">
        <path class="reference-special-region-shape" style="--reference-region-fill:${fill};--reference-region-fill-active:${activeFill};" d="${shape.path}"></path>
      </g>
    `;
  });
  els.specialRegionLayer.innerHTML = proxies.join('');
  if (!interactive) return;
  [...els.specialRegionLayer.querySelectorAll('.reference-special-region')].forEach((region) => {
    region.addEventListener('mouseenter', () => {
      if (state.view === 'map' && isProvinceBrowseMode()) setMapProvinceFocus(region.dataset.province);
    });
    region.addEventListener('click', () => {
      if (suppressClick) return;
      openProvinceView(region.dataset.province);
    });
  });
}

function renderProjectMarkers(items) {
  const selected = getSelectedItem(items);
  const activeId = state.view === 'map'
    ? state.mapPreviewId
    : (selected ? selected.id : null);
  const markerScale = clamp(1.2 / Math.pow(state.viewScale, 0.025), 1.1, 1.24);
  const tagScale = clamp(1.08 / Math.pow(state.viewScale, 0.03), 1.01, 1.12);
  const overlapRadius = Math.max(18, 32 / Math.pow(state.viewScale, 0.18));
  const anchorGroups = new Map();

  items.forEach((item) => {
    const anchor = getItemAnchor(item);
    const key = `${item.province}::${anchor.key}`;
    if (!anchorGroups.has(key)) anchorGroups.set(key, []);
    anchorGroups.get(key).push({ item, anchor });
  });

  const markerSvg = [];
  anchorGroups.forEach((groupItems) => {
    groupItems.forEach((entry, index) => {
      const { item, anchor } = entry;
      const spreadAngle = groupItems.length === 1 ? -Math.PI / 2 : (-Math.PI / 2) + (Math.PI * 2 * index / groupItems.length);
      const spreadDistance = groupItems.length === 1 ? 0 : overlapRadius + (groupItems.length > 4 ? 8 : 0);
      const point = applyViewTransformPoint(
        anchor.rawX + Math.cos(spreadAngle) * spreadDistance,
        anchor.rawY + Math.sin(spreadAngle) * spreadDistance
      );
      if (point.x < -60 || point.x > VIEWBOX.width + 60 || point.y < -60 || point.y > VIEWBOX.height + 60) return;
      const active = activeId === item.id;
      const label = state.lang === 'zh' ? item.name : item.nameEn;
      const tagWidth = Math.min(216, Math.max(122, label.length * 12));
      const hitRadius = Math.max(26, 32 / Math.pow(state.viewScale, 0.02));
      markerSvg.push(`
        <g class="project-marker ${active ? 'is-active' : ''}" data-id="${item.id}" role="button" tabindex="0" aria-label="${escapeHtml(label)}" transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})">
          <circle class="project-hit-area" r="${hitRadius.toFixed(2)}"></circle>
          <g class="project-bubble" transform="scale(${markerScale.toFixed(3)})">
            <path class="project-bubble-core" fill="${item.color}" d="M0 16c-3.4-4.2-11-9.5-11-18C-11-8.8-6.1-13 0-13S11-8.8 11-2c0 8.5-7.6 13.8-11 18Z"></path>
            <circle cx="0" cy="-2" r="7.6" fill="rgba(255,250,240,0.14)"></circle>
            <g class="project-icon-glyph" transform="translate(-8 -10)">${iconMarkup(item.icon, '#fff8ee')}</g>
          </g>
          <g class="project-tag" transform="translate(0 ${(-36 * markerScale).toFixed(2)}) scale(${tagScale.toFixed(3)})">
            <rect class="project-tag-box" x="${(-tagWidth / 2).toFixed(2)}" y="-23" width="${tagWidth.toFixed(2)}" height="28" rx="14"></rect>
            <text class="project-tag-text" text-anchor="middle" y="-4.5">${label.slice(0, 16)}</text>
          </g>
        </g>
      `);
    });
  });

  els.projectMarkerSvgLayer.innerHTML = markerSvg.join('');
  [...els.projectMarkerSvgLayer.querySelectorAll('.project-marker')].forEach((marker) => {
    marker.addEventListener('click', () => {
      if (suppressClick) return;
      setMapPreview(marker.dataset.id, { revealPanel: true });
    });
  });
}
function renderDetail(items) {
  if (window.TeaExperience) return window.TeaExperience.detail(getSelectedItem(items));
  const text = currentText();
  const selected = getSelectedItem(items);
  if (!selected) {
    els.detailPanel.innerHTML = `<div class="detail-empty"><h3>${text.noResultTitle}</h3><p>${text.noResultBody}</p><button class="empty-button" type="button" id="resetFilters">${text.reset}</button></div>`;
    const reset = document.getElementById('resetFilters');
    if (reset) {
      reset.addEventListener('click', () => {
        state.search = '';
        state.teaType = 'all';
        state.province = 'all';
        els.searchInput.value = '';
        backToMapView();
      });
    }
    return;
  }

  const teaTypeLabel = state.lang === 'zh' ? selected.teaType : selected.teaTypeEn;
  const categoryLabel = state.lang === 'zh' ? selected.category : selected.categoryEn;
  const detailTitle = state.lang === 'zh' ? selected.name : selected.nameEn;
  const detailSubtitle = state.lang === 'zh' ? selected.nameEn : '';
  const detailFacts = [
    { label: text.detailMetaProvince, value: localizedField(selected, 'province') },
    { label: text.detailMetaRegion, value: localizedField(selected, 'city') || localizedField(selected, 'province') },
    { label: text.detailMetaDeclaredRegion, value: localizedField(selected, 'declaredRegion') || localizedField(selected, 'city') || localizedField(selected, 'province'), wide: true },
    { label: text.detailMetaBatch, value: localizedField(selected, 'yearBatch') },
    { label: text.detailMetaUnit, value: localizedField(selected, 'protectionUnit'), wide: true }
  ];
  const structuredSections = renderStructuredDetailSections(selected, text);

  els.detailPanel.innerHTML = `
    <div class="detail-top">
      <div class="detail-tags">
        <span class="tag-pill">${escapeHtml(teaTypeLabel)}</span>
        <span class="tag-pill">${escapeHtml(categoryLabel)}</span>
        <span class="tag-pill">${escapeHtml(selected.code)}</span>
      </div>
      <div class="detail-title">${escapeHtml(detailTitle)}</div>
      <div class="detail-subtitle">${escapeHtml(detailSubtitle)}</div>
      ${renderDetailQuickNav(selected)}
      <div class="detail-fact-grid">
        ${detailFacts.map((fact) => `
          <div class="detail-fact ${fact.wide ? 'detail-fact-wide' : ''}">
            <span class="detail-fact-label">${escapeHtml(fact.label)}</span>
            <strong>${escapeHtml(fact.value)}</strong>
          </div>
        `).join('')}
      </div>
    </div>
    ${renderDetailLeadCard(selected, text)}
    ${renderDetailImageBlock(selected)}
    <div class="detail-sections">
      ${structuredSections}

    </div>
  `;
}

function renderCards(items) {
  if (window.TeaExperience) {
    els.projectGrid.innerHTML = window.TeaExperience.cards(items);
    return;
  }
  const selected = getSelectedItem(items);
  const text = currentText();
  if (!items.length) {
    els.projectGrid.innerHTML = `<div class="detail-empty"><h3>${text.noResultTitle}</h3><p>${text.noResultBody}</p><button class="empty-button" type="button" id="resetProvinceFilters">${text.reset}</button></div>`;
    const resetProvinceFilters = document.getElementById('resetProvinceFilters');
    if (resetProvinceFilters) {
      resetProvinceFilters.addEventListener('click', () => {
        state.search = '';
        state.teaType = 'all';
        if (els.searchInput) els.searchInput.value = '';
        rerender();
        if (state.province !== 'all') focusProvince(state.province);
      });
    }
    return;
  }
  els.projectGrid.innerHTML = items.map((item) => `
    <button type="button" class="project-card ${selected && selected.id === item.id ? 'is-active' : ''}" data-id="${item.id}" ${selected && selected.id === item.id ? `style="background:linear-gradient(180deg, rgba(255,250,241,0.98), rgba(244,233,205,0.98)); border-color:${item.color};"` : ''}>
      <div class="card-top">
        <div class="card-icon" style="background:${item.color}; color:#fffaf0;"><svg viewBox="0 0 16 16" aria-hidden="true">${iconMarkup(item.icon, '#fff8ee')}</svg></div>
        <div class="card-title-wrap">
          <h3 class="card-title">${state.lang === 'zh' ? item.name : item.nameEn}</h3>
          <p class="card-subtitle">${state.lang === 'zh' ? item.nameEn : ''}</p>
        </div>
      </div>
      <p class="card-meta">${escapeHtml(localizedField(item, 'city'))} · ${escapeHtml(state.lang === 'zh' ? item.teaType : item.teaTypeEn)} · ${escapeHtml(localizedField(item, 'yearBatch'))}</p>
      <p class="card-summary">${escapeHtml(state.lang === 'zh' ? (item.leadZh || item.descriptionZh) : (item.leadEn || item.descriptionEn))}</p>
      <div class="card-action"><span>${text.cardLink}</span></div>
    </button>`).join('');
  [...els.projectGrid.querySelectorAll('.project-card')].forEach((card) => {
    card.addEventListener('click', () => {
      openDetailView(card.dataset.id);
    });
  });
}

function renderMapOverlays(items) {
  if (isReferenceCalibratedMode()) {
    if (isMapProvinceLabelsEnabled()) renderProvinceLabels(items);
    else els.provinceLabelLayer.innerHTML = '';
    if (isMapProvinceButtonsEnabled()) renderProvinceButtons(items);
    else if (els.provinceButtonLayer) els.provinceButtonLayer.innerHTML = '';
    if (isMapMarkersEnabled()) renderProjectMarkers(items);
    else els.projectMarkerSvgLayer.innerHTML = '';
    renderReferenceSpecialRegions();
    return;
  }
  if (els.provinceButtonLayer) els.provinceButtonLayer.innerHTML = '';
  renderProvinceLabels(items);
  renderSpecialRegions(items);
  renderProjectMarkers(items);
}

function renderSelectionOnly() {
  rerender();
}

function rerender() {
  let items = filteredItems();
  if (reconcileMapLegendSelection()) items = filteredItems();
  reconcileSelectionState(items);
  if (state.view !== 'map') clearMapPreview();
  if (!isMapMarkersEnabled() && state.mapPreviewId) clearMapPreview();
  renderShellVisibility();
  renderLandingContent();
  renderStaticShellText();
  renderGlobalChrome(items);
  renderMapPresentationMode();
  renderHeroStats(items);
  // Hidden stages do not need fresh map geometry or detail illustrations.
  if (state.view === 'map') {
    renderMapContext(items);
    renderTeaTypeFilters(items);
    renderLegend();
    renderProvinceShapes(items);
    renderMapOverlays(items);
  }
  if (state.view === 'province') { renderProvinceHeader(items); renderTeaTypeFilters(items); renderCards(items); }
  if (state.view === 'detail') { renderDetailHeader(items); renderDetail(items); }
  if (els.searchInput) {
    els.searchInput.value = state.search;
    els.searchInput.placeholder = currentText().searchPlaceholder;
  }
  els.langToggle.textContent = currentText().interfaceToggle;
  updateZoomUi();
  window.TeaExperience?.afterRender();
}

els.langToggle.addEventListener('click', () => {
  const open = [...document.querySelectorAll('#detailPanel details[open]')].map(node => node.id);
  state.lang = state.lang === 'zh' ? 'en' : 'zh';
  try { localStorage.setItem('tea-map-language', state.lang); } catch {}
  rerender();
  for (const id of open) { const node = document.getElementById(id); if (node) node.open = true; }
});
if (els.enterMapButton) {
  els.enterMapButton.addEventListener('click', () => enterMapView());
}
if (els.siteHomeButton) {
  els.siteHomeButton.addEventListener('click', () => backToLandingView());
}
if (els.globalBackButton) {
  els.globalBackButton.addEventListener('click', () => {
    if (window.TeaExperience) return window.TeaExperience.back();
    const target = els.globalBackButton.dataset.target;
    if (target === 'landing') backToLandingView();
    if (target === 'map') backToMapView();
    if (target === 'province') backToProvinceView();
  });
}
if (els.breadcrumb) {
  els.breadcrumb.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-crumb-target]');
    if (!trigger) return;
    const target = trigger.dataset.crumbTarget;
    if (target === 'landing') backToLandingView();
    if (target === 'map') backToMapView();
    if (target === 'province') {
      if (state.province === 'all') backToMapView();
      else openProvinceView(state.province, { keepTeaType: true });
    }
  });
}
if (els.searchInput) {
  els.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    rerender();
  });
}

if (els.mapLegend) {
  els.mapLegend.addEventListener('click', (event) => {
    const resetTrigger = event.target.closest('[data-legend-reset]');
    if (resetTrigger) {
      clearMapLegendTeaTypes();
      return;
    }
    const trigger = event.target.closest('[data-legend-key]');
    if (!trigger) return;
    toggleMapLegendTeaType(trigger.dataset.legendKey);
  });
}

if (els.mapContextPanel) {
  els.mapContextPanel.addEventListener('click', (event) => {
    if (!isMapContextPanelEnabled()) return;
    const panelTrigger = event.target.closest('[data-map-panel-action]');
    if (panelTrigger) {
      const action = panelTrigger.dataset.mapPanelAction;
      if (action === 'focus-province' && panelTrigger.dataset.province) {
        setMapProvinceFocus(panelTrigger.dataset.province);
        return;
      }
      if (action === 'open-province' && panelTrigger.dataset.province) {
        openProvinceView(panelTrigger.dataset.province);
        return;
      }
      if (action === 'toggle-south-sea') {
        state.southSeaInsetExpanded = !state.southSeaInsetExpanded;
        rerender();
        return;
      }
    }
    const trigger = event.target.closest('[data-preview-action]');
    if (!trigger) return;
    const action = trigger.dataset.previewAction;
    if (action === 'open' && trigger.dataset.id) {
      openDetailView(trigger.dataset.id);
      return;
    }
    if (action === 'province' && trigger.dataset.province) {
      openProvinceView(trigger.dataset.province);
      return;
    }
    if (action === 'reset') {
      clearMapPreview();
      rerender();
    }
  });
}

if (els.detailPanel) {
  els.detailPanel.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-detail-anchor]');
    if (!trigger) return;
    const targetId = trigger.dataset.detailAnchor;
    const target = document.getElementById(targetId);
    if (!target) return;
    if (target.tagName === 'DETAILS' && !target.hasAttribute('open')) target.setAttribute('open', '');
    window.requestAnimationFrame(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
  });
}

if (els.mapBrowseToggle) {
  els.mapBrowseToggle.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-browse-mode]');
    if (!trigger) return;
    setMapBrowseMode(trigger.dataset.browseMode);
  });
}

if (els.southSeaToggleButton) {
  els.southSeaToggleButton.addEventListener('click', () => {
    state.southSeaInsetExpanded = !state.southSeaInsetExpanded;
    rerender();
  });
}

if (els.southSeaFloatPanel) {
  els.southSeaFloatPanel.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-map-panel-action="toggle-south-sea"]');
    if (!trigger) return;
    state.southSeaInsetExpanded = false;
    rerender();
  });
}

if (els.zoomInButton) {
  els.zoomInButton.addEventListener('click', () => {
    if (!isMapZoomPanEnabled()) return;
    zoomAt({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 }, 1.25);
  });
}
if (els.zoomOutButton) {
  els.zoomOutButton.addEventListener('click', () => {
    if (!isMapZoomPanEnabled()) return;
    zoomAt({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 }, 1 / 1.25);
  });
}
if (els.resetViewButton) {
  els.resetViewButton.addEventListener('click', () => {
    if (!isMapZoomPanEnabled()) return;
    resetView({ clearPreview: true });
  });
}

els.mapSvg.addEventListener('wheel', (event) => {
  if (!isMapZoomPanEnabled()) return;
  event.preventDefault();
  const point = eventToViewBoxPoint(event);
  const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
  zoomAt(point, factor);
}, { passive: false });

els.mapSvg.addEventListener('pointerdown', (event) => {
  if (!isMapZoomPanEnabled()) return;
  if (
    isWithinInteractiveMarker(event.target, 'project-marker') ||
    isWithinInteractiveMarker(event.target, 'special-region-badge') ||
    isWithinInteractiveMarker(event.target, 'province-browse-button') ||
    isWithinInteractiveMarker(event.target, 'reference-special-region')
  ) return;
  panSession = {
    pointerId: event.pointerId,
    startPoint: eventToViewBoxPoint(event),
    startViewX: state.viewX,
    startViewY: state.viewY,
    moved: false
  };
  els.mapStage.classList.add('is-dragging');
  try { els.mapSvg.setPointerCapture(event.pointerId); } catch (error) { }
});

els.mapSvg.addEventListener('pointermove', (event) => {
  if (!isMapZoomPanEnabled()) return;
  if (!panSession || panSession.pointerId !== event.pointerId) return;
  const point = eventToViewBoxPoint(event);
  const deltaX = point.x - panSession.startPoint.x;
  const deltaY = point.y - panSession.startPoint.y;
  if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) panSession.moved = true;
  updateView(state.viewScale, panSession.startViewX + deltaX, panSession.startViewY + deltaY);
});

function endPan(event) {
  if (!isMapZoomPanEnabled()) return;
  if (!panSession || (event && panSession.pointerId !== event.pointerId)) return;
  suppressClick = panSession.moved;
  panSession = null;
  els.mapStage.classList.remove('is-dragging');
  window.setTimeout(() => { suppressClick = false; }, 80);
}

els.mapSvg.addEventListener('pointerup', endPan);
els.mapSvg.addEventListener('pointercancel', endPan);
els.mapSvg.addEventListener('pointerleave', (event) => {
  if (panSession && event.buttons === 0) endPan(event);
});

state.mapProvinceFocus = getDefaultProvinceFocus();
rerender();
resetView();











