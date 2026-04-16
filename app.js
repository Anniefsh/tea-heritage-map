const DATA = window.TEA_HERITAGE_DATA;
const ADMIN = window.CHINA_OFFICIAL_ADMIN;

const MAP_META = window.MAP_COMPLIANCE_META || {};
const MAP_RENDER_MODE = MAP_META.renderMode || 'reference-calibrated-handdrawn';

const VIEWBOX = { width: 1000, height: 760, padding: 34 };
const ZOOM_LIMITS = { min: 1, max: 7 };
const SOUTH_SEA_INSET = { x: 762, y: 500, width: 204, height: 218, padding: 16, titleHeight: 34 };
const SOUTH_SEA_INSET_LAT_THRESHOLD = 18;
const HAINAN_GEO_NAME = '海南省';

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

const state = {
  view: 'landing',
  lang: 'zh',
  teaType: 'all',
  province: 'all',
  search: '',
  selectedId: null,
  mapPreviewId: null,
  viewScale: 1,
  viewX: 0,
  viewY: 0
};

const uiText = {
  zh: {
    htmlLang: 'zh-CN',
    documentTitle: '中国茶类非遗数字化地图',
    siteTitle: '中国茶类非遗数字化地图',
    siteSubtitle: '官方地图基础上的双语分层浏览',
    interfaceToggle: 'EN',
    landingEyebrow: 'China Tea Intangible Cultural Heritage',
    landingTitle: '中国茶类非遗数字化地图',
    landingSubtitle: '从全国地图出发，浏览不同地域的茶类非遗项目与文化脉络。',
    landingLead: '以官方行政区划地图为基础，用更轻量的方式理解“茶从哪里来、为何重要、今天如何传承”。',
    landingPanelKicker: '收录范围',
    landingPanelTitle: '从全国分布快速进入茶类非遗主题',
    landingPanelBody: '项目以地图为入口，帮助你先建立空间印象，再逐步查看省份与单个项目的重点信息。',
    landingStatsKicker: '数据概览',
    landingTags: ['官方地图基底', '分层浏览', '双语浏览'],
    enterMap: '进入地图',
    breadcrumbHome: '首页',
    breadcrumbMap: '地图总览',
    breadcrumbProvince: '省份页',
    breadcrumbDetail: '项目详情',
    backToLanding: '返回首页',
    backToMap: '返回地图',
    backToProvince: '返回省份页',
    mapKicker: '01 / 地图总览',
    mapTitle: '在地图上浏览中国茶类非遗',
    mapSummary: '当前阶段先校准全国轮廓、省界、台湾与南海附图，地图页只展示地图本体与必要说明。',
    mapOverviewTitle: '概览',
    mapOverviewBody: '从全国分布快速建立空间印象，再决定进入省份继续浏览。',
    mapGuideTitle: '引导',
    mapGuideBody: '点击地图点位可在右侧查看项目预览；点击省份则直接进入对应省份页。',
    mapStatVisible: '可见项目',
    mapStatRegions: '覆盖省区',
    mapStatFocused: '当前视角',
    mapStatFocusedDefault: '全国总览',
    mapGuideSearch: '搜索词',
    mapPreviewKicker: '项目预览',
    mapPreviewOpen: '查看详情',
    mapPreviewReset: '返回总览',
    mapPreviewSummaryLabel: '摘要',
    mapSourceNote: '当前地图以本地行政区划底图为校准参考，保留台湾与南海附图表达；本轮暂停点位、筛选与缩放交互，优先锁定轮廓关系与手绘成图样式。',
    mapComplianceKicker: '参考底图',
    mapComplianceTitle: '当前地图按本地行政区划底图校准',
    mapComplianceReviewLabel: '审图号',
    mapComplianceFileLabel: '参考文件',
    mapComplianceUsageLabel: '使用方式',
    mapComplianceNotesLabel: '当前阶段说明',
    mapReferenceDebugAlt: '中国行政区划参考底图，仅用于开发校准',
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
    detailVideoTitle: '视频入口',
    detailVideoMissing: '暂未提供经过核验的视频入口',
    detailVideoHint: '视频内容仅在通过权威核验后补充。',
    detailMetaProvince: '省份',
    detailMetaRegion: '所属地区',
    detailMetaCategory: '类别',
    detailMetaBatch: '公布时间',
    detailMetaUnit: '保护单位',
    detailSectionZh: '项目简介',
    detailSectionEn: 'English Summary',
    detailSectionStatus: '来源与状态',
    detailStatusSeed: `当前底图已于 2026-03-26 依据天地图公开行政区划 API 重建，并将海南省边界中的南海诸岛拆分为附图表达；页面审图信息参考其服务页当前展示的 ${ADMIN.reviewNumber}。`,
    southSeaInsetTitle: '南海诸岛附图',
    watchVideo: '查看外部视频',
    cardLink: '查看详情',
    provinceCountSuffix: '项',
    zoomIn: '放大',
    zoomOut: '缩小',
    zoomReset: '复位',
    mapHint: '滚轮缩放，拖拽平移；点位先看预览，省份进入下一层浏览。'
  },
  en: {
    htmlLang: 'en',
    documentTitle: 'China Tea Intangible Cultural Heritage Map',
    siteTitle: 'China Tea Heritage Map',
    siteSubtitle: 'Layered bilingual browsing built on official map data',
    interfaceToggle: '中文',
    landingEyebrow: 'China Tea Intangible Cultural Heritage',
    landingTitle: 'China Tea Intangible Cultural Heritage Map',
    landingSubtitle: 'Start from the national map to explore tea-related intangible cultural heritage across China.',
    landingLead: 'Built on official administrative map data, this experience helps visitors understand where each tradition belongs and why it matters today.',
    landingPanelKicker: 'Scope',
    landingPanelTitle: 'Begin with the national view, then move into provinces',
    landingPanelBody: 'The map gives visitors a quick sense of regional distribution before they narrow down inside a province and open a single project.',
    landingStatsKicker: 'Data Snapshot',
    landingTags: ['Official Map Base', 'Layered Browsing', 'Bilingual Interface'],
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
    mapSummary: 'This stage focuses on recalibrating the national outline, provincial borders, Taiwan, and the South China Sea inset. The map page only shows the base map and essential notes.',
    mapOverviewTitle: 'Overview',
    mapOverviewBody: 'Use the national map to understand distribution first, then decide which province to explore next.',
    mapGuideTitle: 'Guide',
    mapGuideBody: 'Click a map marker to preview one item on the right. Click a province to move into the province page.',
    mapStatVisible: 'Visible Items',
    mapStatRegions: 'Covered Regions',
    mapStatFocused: 'Current View',
    mapStatFocusedDefault: 'National Overview',
    mapGuideSearch: 'Keyword',
    mapPreviewKicker: 'Item Preview',
    mapPreviewOpen: 'Open Detail',
    mapPreviewReset: 'Back to Overview',
    mapPreviewSummaryLabel: 'Summary',
    mapSourceNote: 'The current map uses a local administrative reference image for calibration, while preserving Taiwan and the South China Sea inset. Search, markers, filtering, and zooming are paused in this round so the hand-drawn base can be stabilized first.',
    mapComplianceKicker: 'Reference Base',
    mapComplianceTitle: 'The current map is calibrated against a local administrative reference image',
    mapComplianceReviewLabel: 'Review Number',
    mapComplianceFileLabel: 'Reference File',
    mapComplianceUsageLabel: 'Usage',
    mapComplianceNotesLabel: 'Current Stage',
    mapReferenceDebugAlt: 'Administrative reference image used for development calibration only',
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
    detailVideoTitle: 'Video Entry',
    detailVideoMissing: 'No verified video source is available yet.',
    detailVideoHint: 'Video content will be added only after source verification.',
    detailMetaProvince: 'Province',
    detailMetaRegion: 'Region',
    detailMetaCategory: 'Category',
    detailMetaBatch: 'Inscription',
    detailMetaUnit: 'Protection Unit',
    detailSectionZh: 'Chinese Introduction',
    detailSectionEn: 'English Summary',
    detailSectionStatus: 'Source Status',
    detailStatusSeed: `The base map was rebuilt on March 26, 2026 from the public TianDiTu administrative API, and the South China Sea islands embedded in Hainan were split into a dedicated inset. The page references the current official review number shown on the source service page: ${ADMIN.reviewNumber}.`,
    southSeaInsetTitle: 'South China Sea Islands',
    watchVideo: 'Open Video',
    cardLink: 'Open details',
    provinceCountSuffix: ' items',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Reset View',
    mapHint: 'Use the wheel to zoom and drag to pan. Markers open previews; provinces move to the next layer.'
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
  specialRegionLayer: document.getElementById('specialRegionLayer'),
  projectMarkerSvgLayer: document.getElementById('projectMarkerSvgLayer'),
  southSeaInsetLayer: document.getElementById('southSeaInsetLayer'),
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
  mapHint: document.getElementById('mapHint')
};

let panSession = null;
let suppressClick = false;

function currentText() { return uiText[state.lang]; }
function isReferenceCalibratedMode() { return MAP_RENDER_MODE === 'reference-calibrated-handdrawn'; }
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

function shortProvinceLabel(name) {
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

function trimOuterParens(text) {
  let output = String(text || '').trim();
  while (output.startsWith('(') && output.endsWith(')')) {
    let depth = 0;
    let wrapsWhole = true;
    for (let index = 0; index < output.length; index += 1) {
      const char = output[index];
      if (char === '(') depth += 1;
      if (char === ')') {
        depth -= 1;
        if (depth === 0 && index !== output.length - 1) {
          wrapsWhole = false;
          break;
        }
      }
    }
    if (!wrapsWhole) break;
    output = output.slice(1, -1).trim();
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
  const source = String(text || '').trim();
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
    return splitTopLevelGroups(source.slice('MULTIPOLYGON'.length))
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
  return {
    ...feature,
    path: geometryToPath(feature.geometry),
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

function filteredItems() {
  const keyword = state.search.trim().toLowerCase();
  return DATA.items.filter((item) => {
    const teaMatch = state.teaType === 'all' ? true : item.teaType === state.teaType;
    const provinceMatch = state.province === 'all' ? true : item.province === state.province;
    const keywordMatch = !keyword ? true : [item.name, item.nameEn, item.province, item.city, item.teaType, item.teaTypeEn]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
    return teaMatch && provinceMatch && keywordMatch;
  });
}

function getSelectedItem(items) {
  return items.find((item) => item.id === state.selectedId) || null;
}

function getItemById(itemId) {
  return DATA.items.find((item) => item.id === itemId) || null;
}

function getMapPreviewItem(items) {
  return items.find((item) => item.id === state.mapPreviewId) || null;
}

function scrollMapContextPanelIntoView() {
  if (!els.mapContextPanel || !window.matchMedia('(max-width: 1180px)').matches) return;
  window.requestAnimationFrame(() => {
    els.mapContextPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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
  const categoryLabel = state.lang === 'zh' ? item.category : item.categoryEn;
  const teaTypeLabel = state.lang === 'zh' ? item.teaType : item.teaTypeEn;
  if (state.lang === 'zh') {
    return `${item.name}收录于${item.yearBatch}公布批次，分布于${item.province}${item.city ? ` · ${item.city}` : ''}，归属${categoryLabel}，以${teaTypeLabel}相关传统为主要识别线索，保护单位为${item.protectionUnit}。`;
  }
  return `${item.nameEn} was inscribed in the ${item.yearBatch} batch and is associated with ${item.province}${item.city ? `, ${item.city}` : ''}. It is classified as ${categoryLabel}, linked to ${teaTypeLabel}, and protected by ${item.protectionUnit}.`;
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
  if (isReferenceCalibratedMode()) {
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
  if (isReferenceCalibratedMode()) {
    state.viewScale = 1;
    state.viewX = 0;
    state.viewY = 0;
    applyBaseMapTransform();
    updateZoomUi();
    return;
  }
  const next = clampViewTransform(clamp(scale, ZOOM_LIMITS.min, ZOOM_LIMITS.max), viewX, viewY);
  state.viewScale = next.scale;
  state.viewX = next.viewX;
  state.viewY = next.viewY;
  applyBaseMapTransform();
  const items = filteredItems();
  renderMapOverlays(items);
  updateZoomUi();
}

function resetView(options = {}) {
  if (isReferenceCalibratedMode()) {
    state.viewScale = 1;
    state.viewX = 0;
    state.viewY = 0;
    applyBaseMapTransform();
    if (options.clearPreview) clearMapPreview();
    updateZoomUi();
    return;
  }
  state.viewScale = 1;
  state.viewX = 0;
  state.viewY = 0;
  applyBaseMapTransform();
  if (options.clearPreview) clearMapPreview();
  const items = filteredItems();
  renderMapOverlays(items);
  if (options.clearPreview) renderMapContext(items);
  updateZoomUi();
}

function zoomAt(point, factor) {
  if (isReferenceCalibratedMode()) return;
  const nextScale = clamp(state.viewScale * factor, ZOOM_LIMITS.min, ZOOM_LIMITS.max);
  const rawX = (point.x - state.viewX) / state.viewScale;
  const rawY = (point.y - state.viewY) / state.viewScale;
  const nextViewX = point.x - rawX * nextScale;
  const nextViewY = point.y - rawY * nextScale;
  updateView(nextScale, nextViewX, nextViewY);
}

function focusProvince(province) {
  if (isReferenceCalibratedMode()) {
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
  if (isReferenceCalibratedMode()) {
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
      label: state.province === 'all' ? text.breadcrumbProvince : state.province,
      target: 'province',
      current: true
    });
  }
  if (state.view === 'detail') {
    crumbs.push({
      label: state.province === 'all' ? text.breadcrumbProvince : state.province,
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
  const text = currentText();
  setNodeText(els.mapKicker, text.mapKicker);
  setNodeText(els.mapTitle, text.mapTitle);
  setNodeText(els.mapSummary, text.mapSummary);
  setNodeText(els.mapSourceNote, text.mapSourceNote);
  setNodeText(els.provinceKicker, text.provinceKicker);
  setNodeText(els.filterToolbarTitle, text.filterToolbarTitle);
  setNodeText(els.detailKicker, text.detailKicker);
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
  const reviewNumber = MAP_META.referenceReviewNumber || '—';
  const fileName = MAP_META.fileName || '—';
  const usage = MAP_META.referenceUsedFor || '—';
  const notes = MAP_META.notes || '—';
  const editionLabel = MAP_META.referenceEditionLabel || fileName;

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
  const referenceMode = isReferenceCalibratedMode();
  document.body.dataset.mapMode = MAP_RENDER_MODE;

  toggleHidden(els.mapSearchRow, referenceMode);
  toggleHidden(els.mapToolbar, referenceMode);
  toggleHidden(els.mapHint, referenceMode);
  toggleHidden(els.mapLegend, referenceMode);
  toggleHidden(els.mapContextPanel, referenceMode);

  if (referenceMode && els.mapContextPanel) {
    els.mapContextPanel.innerHTML = '';
  }

  renderReferenceOverlayDebug();
  renderMapComplianceMeta();
}

function renderMapContext(items) {
  if (!els.mapContextPanel) return;
  if (isReferenceCalibratedMode()) {
    els.mapContextPanel.innerHTML = '';
    return;
  }
  const text = currentText();
  const keyword = state.search.trim();
  const currentViewLabel = state.province === 'all' ? text.mapStatFocusedDefault : state.province;
  const visibleRegionCount = new Set(items.map((item) => item.province)).size;
  const previewItem = getMapPreviewItem(items);

  if (previewItem) {
    const title = state.lang === 'zh' ? previewItem.name : previewItem.nameEn;
    const subtitle = state.lang === 'zh' ? previewItem.nameEn : previewItem.name;
    const teaTypeLabel = state.lang === 'zh' ? previewItem.teaType : previewItem.teaTypeEn;
    const categoryLabel = state.lang === 'zh' ? previewItem.category : previewItem.categoryEn;
    const summary = buildMapPreviewSummary(previewItem);
    els.mapContextPanel.innerHTML = `
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
            <strong>${escapeHtml(previewItem.province)}</strong>
          </div>
          <div class="preview-fact">
            <span class="preview-label">${text.detailMetaRegion}</span>
            <strong>${escapeHtml(previewItem.city || previewItem.province)}</strong>
          </div>
          <div class="preview-fact">
            <span class="preview-label">${text.detailMetaBatch}</span>
            <strong>${escapeHtml(previewItem.yearBatch)}</strong>
          </div>
          <div class="preview-fact preview-fact-wide">
            <span class="preview-label">${text.detailMetaUnit}</span>
            <strong>${escapeHtml(previewItem.protectionUnit)}</strong>
          </div>
        </div>
        <section class="detail-section map-preview-summary-block">
          <h3>${text.mapPreviewSummaryLabel}</h3>
          <p>${escapeHtml(summary)}</p>
        </section>
        <div class="preview-actions">
          <button type="button" class="panel-action panel-action-primary" data-preview-action="open" data-id="${previewItem.id}">${text.mapPreviewOpen}</button>
          <button type="button" class="panel-action panel-action-secondary" data-preview-action="reset">${text.mapPreviewReset}</button>
        </div>
      </article>
    `;
    return;
  }

  els.mapContextPanel.innerHTML = `
    <section class="map-panel-card">
      <p class="map-panel-kicker">${text.mapOverviewTitle}</p>
      <h3>${text.mapOverviewTitle}</h3>
      <p>${text.mapOverviewBody}</p>
      <div class="detail-meta">
        <span class="meta-pill"><strong>${text.mapStatVisible}</strong> ${items.length}</span>
        <span class="meta-pill"><strong>${text.mapStatRegions}</strong> ${visibleRegionCount}</span>
        <span class="meta-pill"><strong>${text.mapStatFocused}</strong> ${escapeHtml(currentViewLabel)}</span>
      </div>
    </section>
    <section class="map-panel-card">
      <p class="map-panel-kicker">${text.mapGuideTitle}</p>
      <h3>${text.mapGuideTitle}</h3>
      <p>${text.mapGuideBody}</p>
      <div class="detail-meta">
        ${keyword ? `<span class="meta-pill"><strong>${text.mapGuideSearch}</strong> ${escapeHtml(keyword)}</span>` : ''}
      </div>
    </section>
  `;
}

function renderProvinceHeader(items) {
  if (!els.provinceTitle || !els.provinceSummary || !els.provinceMeta) return;
  const text = currentText();
  const provinceName = state.province === 'all' ? text.provinceDefaultTitle : state.province;
  const provinceItems = state.province === 'all' ? [] : getProvinceItems(state.province);
  const visibleCount = state.province === 'all' ? 0 : items.length;
  const teaTypeCount = state.province === 'all' ? 0 : new Set(provinceItems.map((item) => item.teaType)).size;

  els.provinceTitle.textContent = provinceName;
  els.provinceSummary.textContent = state.province === 'all'
    ? text.provinceDefaultSummary
    : state.lang === 'zh'
      ? `${state.province}共有 ${provinceItems.length} 个项目，当前筛选后显示 ${visibleCount} 个。${text.provinceSummaryActive}`
      : `${state.province} has ${provinceItems.length} items in total, with ${visibleCount} visible under the current filters. ${text.provinceSummaryActive}`;
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
  if (!selected) {
    els.detailPageTitle.textContent = text.detailDefaultTitle;
    els.detailSummary.textContent = text.detailDefaultSummary;
    return;
  }
  els.detailPageTitle.textContent = state.lang === 'zh' ? selected.name : selected.nameEn;
  els.detailSummary.textContent = `${selected.province} · ${state.lang === 'zh' ? selected.teaType : selected.teaTypeEn} · ${selected.yearBatch}`;
}

function scrollToShell(shell) {
  if (!shell) return;
  window.requestAnimationFrame(() => {
    shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function enterMapView() {
  state.view = 'map';
  state.province = 'all';
  state.teaType = 'all';
  state.selectedId = null;
  clearMapPreview();
  state.search = '';
  if (els.searchInput) els.searchInput.value = '';
  resetView();
  rerender();
  scrollToShell(els.mapShell);
}

function openProvinceView(province, options = {}) {
  const nextProvince = province || 'all';
  state.view = 'province';
  state.province = nextProvince;
  state.teaType = options.keepTeaType ? state.teaType : 'all';
  clearMapPreview();
  const provinceItems = filteredItems();
  state.selectedId = provinceItems[0] ? provinceItems[0].id : null;
  focusProvince(nextProvince);
  rerender();
  scrollToShell(els.provinceShell);
}

function openDetailView(itemId) {
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
  state.view = 'landing';
  state.province = 'all';
  state.teaType = 'all';
  state.selectedId = null;
  clearMapPreview();
  state.search = '';
  if (els.searchInput) els.searchInput.value = '';
  resetView();
  rerender();
  scrollToShell(els.landingShell);
}

function backToMapView() {
  state.view = 'map';
  state.province = 'all';
  state.teaType = 'all';
  state.selectedId = null;
  clearMapPreview();
  resetView();
  rerender();
  scrollToShell(els.mapShell);
}

function backToProvinceView() {
  if (state.province === 'all') {
    backToMapView();
    return;
  }
  state.view = 'province';
  clearMapPreview();
  const provinceItems = filteredItems();
  state.selectedId = provinceItems[0] ? provinceItems[0].id : null;
  focusProvince(state.province);
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
    { value: items.length, label: text.statsVisible }
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
  if (isReferenceCalibratedMode()) {
    els.mapLegend.innerHTML = '';
    return;
  }
  const text = currentText();
  els.mapLegend.innerHTML = `<div class="legend-item"><strong>${text.mapLegendTitle}</strong></div>` + DATA.teaTypes
    .filter((type) => DATA.items.some((item) => item.teaType === type.zh))
    .map((type) => `<div class="legend-item"><span class="legend-swatch" style="background:${type.color}"></span><span>${state.lang === 'zh' ? type.zh : type.en}</span></div>`)
    .join('');
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
  const text = currentText();
  const dividerY = SOUTH_SEA_INSET.y + SOUTH_SEA_INSET.titleHeight - 4;
  const innerX = southSeaInsetViewport.x - 4;
  const innerY = southSeaInsetViewport.y - 4;
  const innerWidth = southSeaInsetViewport.width + 8;
  const innerHeight = southSeaInsetViewport.height + 8;
  els.southSeaInsetLayer.innerHTML = `
    <g class="south-sea-inset">
      <rect class="south-sea-frame" x="${SOUTH_SEA_INSET.x}" y="${SOUTH_SEA_INSET.y}" width="${SOUTH_SEA_INSET.width}" height="${SOUTH_SEA_INSET.height}" rx="22"></rect>
      <text class="south-sea-title" x="${(SOUTH_SEA_INSET.x + 18).toFixed(2)}" y="${(SOUTH_SEA_INSET.y + 22).toFixed(2)}">${text.southSeaInsetTitle}</text>
      <line class="south-sea-divider" x1="${(SOUTH_SEA_INSET.x + 14).toFixed(2)}" y1="${dividerY.toFixed(2)}" x2="${(SOUTH_SEA_INSET.x + SOUTH_SEA_INSET.width - 14).toFixed(2)}" y2="${dividerY.toFixed(2)}"></line>
      <rect class="south-sea-inner" x="${innerX.toFixed(2)}" y="${innerY.toFixed(2)}" width="${innerWidth.toFixed(2)}" height="${innerHeight.toFixed(2)}" rx="18"></rect>
      ${southSeaInsetPath ? `<path class="south-sea-islands" fill-rule="evenodd" d="${southSeaInsetPath}"></path>` : ''}
    </g>
  `;
}
function renderProvinceShapes(items) {
  const referenceMode = isReferenceCalibratedMode();
  const visibleGeoProvinces = new Set(items.map((item) => provinceGeoName(item.province)));
  const visibleCounts = provinceCountsFromItems(items);
  const activeGeoProvince = state.province === 'all' ? null : provinceGeoName(state.province);

  const fillShapes = provinceFeatures.map((feature) => {
    const hasTea = referenceMode ? false : visibleCounts.has(feature.displayName);
    const isVisible = referenceMode ? true : visibleGeoProvinces.has(feature.name) || alwaysLabeledProvinces.has(feature.displayName);
    const active = referenceMode ? false : activeGeoProvince === feature.name;
    const baseColor = provinceColorMap.get(feature.name) || '#f3ead0';
    const teaColor = hasTea ? '#d8e5bf' : baseColor;
    const activeColor = hasTea ? '#c8ddb1' : '#ead6a6';
    return `<path class="province-shape ${referenceMode ? 'reference-mode' : ''} ${hasTea ? 'has-data' : ''} ${active ? 'is-active' : ''}" fill-rule="evenodd" style="--province-fill:${teaColor};--province-fill-active:${activeColor};" data-province="${feature.displayName}" d="${feature.path}" ${isVisible || state.province === 'all' ? '' : 'opacity="0.58"'}></path>`;
  }).join('');

  els.chinaShapeLayer.innerHTML = fillShapes;
  renderBoundaryLines();
  renderSouthSeaInset();
  applyBaseMapTransform();

  if (referenceMode) return;
  [...els.chinaShapeLayer.querySelectorAll('.province-shape')].forEach((shape) => {
    shape.addEventListener('click', () => {
      if (suppressClick) return;
      const province = shape.dataset.province;
      openProvinceView(province);
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
    labels.push(`<g transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})"><text class="province-label" text-anchor="middle">${feature.shortLabel}</text>${count > 0 ? `<text class="province-count" text-anchor="middle" y="18">${count}${currentText().provinceCountSuffix}</text>` : ''}</g>`);
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
          <text class="special-region-name" text-anchor="middle" y="-3">${province}</text>
          <text class="special-region-count" text-anchor="middle" y="14">${count}${text.provinceCountSuffix}</text>
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

function renderProjectMarkers(items) {
  const selected = getSelectedItem(items);
  const activeId = state.view === 'map'
    ? state.mapPreviewId
    : (selected ? selected.id : null);
  const markerScale = Math.max(0.5, 1 / Math.pow(state.viewScale, 0.48));
  const tagScale = Math.max(0.72, 1 / Math.pow(state.viewScale, 0.18));
  const overlapRadius = Math.max(10, 20 / Math.pow(state.viewScale, 0.24));
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
      const spreadDistance = groupItems.length === 1 ? 0 : overlapRadius + (groupItems.length > 4 ? 5 : 0);
      const point = applyViewTransformPoint(
        anchor.rawX + Math.cos(spreadAngle) * spreadDistance,
        anchor.rawY + Math.sin(spreadAngle) * spreadDistance
      );
      if (point.x < -60 || point.x > VIEWBOX.width + 60 || point.y < -60 || point.y > VIEWBOX.height + 60) return;
      const active = activeId === item.id;
      const label = state.lang === 'zh' ? item.name : item.nameEn;
      const tagWidth = Math.min(170, Math.max(96, label.length * 10));
      markerSvg.push(`
        <g class="project-marker ${active ? 'is-active' : ''}" data-id="${item.id}" transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})">
          <g class="project-bubble" transform="scale(${markerScale.toFixed(3)})">
            <path class="project-bubble-core" fill="${item.color}" d="M0 16c-3.4-4.2-11-9.5-11-18C-11-8.8-6.1-13 0-13S11-8.8 11-2c0 8.5-7.6 13.8-11 18Z"></path>
            <circle cx="0" cy="-2" r="7.6" fill="rgba(255,250,240,0.14)"></circle>
            <g class="project-icon-glyph" transform="translate(-8 -10)">${iconMarkup(item.icon, '#fff8ee')}</g>
          </g>
          <g class="project-tag" transform="translate(0 ${(-28 * markerScale).toFixed(2)}) scale(${tagScale.toFixed(3)})">
            <rect class="project-tag-box" x="${(-tagWidth / 2).toFixed(2)}" y="-20" width="${tagWidth.toFixed(2)}" height="24" rx="12"></rect>
            <text class="project-tag-text" text-anchor="middle" y="-4">${label.slice(0, 16)}</text>
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
  const detailSubtitle = state.lang === 'zh' ? selected.nameEn : selected.name;

  const videoBlock = selected.videoUrl
    ? `<div class="detail-video has-video"><a class="video-link" href="${selected.videoUrl}" target="_blank" rel="noreferrer">${text.watchVideo}</a></div>`
    : `<div class="detail-video"><div><strong>${text.detailVideoTitle}</strong></div><div class="official-note-block"><p>${text.detailVideoMissing}</p><p>${text.detailVideoHint}</p></div></div>`;

  els.detailPanel.innerHTML = `
    <div class="detail-top">
      <div class="detail-tags">
        <span class="tag-pill">${teaTypeLabel}</span>
        <span class="tag-pill">${categoryLabel}</span>
        <span class="tag-pill">${selected.code}</span>
      </div>
      <div class="detail-title">${detailTitle}</div>
      <div class="detail-subtitle">${detailSubtitle}</div>
      <div class="detail-meta">
        <span class="meta-pill"><strong>${text.detailMetaProvince}</strong> ${selected.province}</span>
        <span class="meta-pill"><strong>${text.detailMetaRegion}</strong> ${selected.city}</span>
        <span class="meta-pill"><strong>${text.detailMetaBatch}</strong> ${selected.yearBatch}</span>
      </div>
    </div>
    ${videoBlock}
    <div class="detail-sections">
      <section class="detail-section"><h3>${text.detailSectionZh}</h3><p>${selected.descriptionZh}</p></section>
      <section class="detail-section"><h3>${text.detailSectionEn}</h3><p>${selected.descriptionEn}</p></section>
      <section class="detail-section"><h3>${text.detailSectionStatus}</h3><p>${text.detailStatusSeed}</p><div class="detail-meta" style="margin-top:12px;"><span class="meta-pill"><strong>${text.detailMetaCategory}</strong> ${selected.category} / ${selected.categoryEn}</span><span class="meta-pill"><strong>${text.detailMetaUnit}</strong> ${selected.protectionUnit}</span></div></section>
    </div>
  `;
}

function renderCards(items) {
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
      <div class="card-top"><div class="card-icon" style="background:${item.color}; color:#fffaf0;"><svg viewBox="0 0 16 16" aria-hidden="true">${iconMarkup(item.icon, '#fff8ee')}</svg></div><span class="meta-pill">${item.province}</span></div>
      <h3 class="card-title">${state.lang === 'zh' ? item.name : item.nameEn}</h3>
      <p class="card-subtitle">${state.lang === 'zh' ? item.nameEn : item.name}</p>
      <p class="card-meta">${item.city} · ${state.lang === 'zh' ? item.teaType : item.teaTypeEn} · ${item.yearBatch}</p>
      <p class="card-summary">${state.lang === 'zh' ? item.descriptionZh : item.descriptionEn}</p>
      <p class="card-meta">${text.cardLink}</p>
    </button>`).join('');
  [...els.projectGrid.querySelectorAll('.project-card')].forEach((card) => {
    card.addEventListener('click', () => {
      openDetailView(card.dataset.id);
    });
  });
}

function renderMapOverlays(items) {
  if (isReferenceCalibratedMode()) {
    els.provinceLabelLayer.innerHTML = '';
    els.specialRegionLayer.innerHTML = '';
    els.projectMarkerSvgLayer.innerHTML = '';
    return;
  }
  renderProvinceLabels(items);
  renderSpecialRegions(items);
  renderProjectMarkers(items);
}

function renderSelectionOnly() {
  rerender();
}

function rerender() {
  const items = filteredItems();
  if (isReferenceCalibratedMode() && state.mapPreviewId) {
    clearMapPreview();
  } else if (state.view !== 'map' && state.mapPreviewId) {
    clearMapPreview();
  } else if (state.view === 'map' && state.mapPreviewId && !items.some((item) => item.id === state.mapPreviewId)) {
    clearMapPreview();
  }
  renderShellVisibility();
  renderLandingContent();
  renderStaticShellText();
  renderGlobalChrome(items);
  renderMapPresentationMode();
  renderHeroStats(items);
  renderMapContext(items);
  renderProvinceHeader(items);
  renderDetailHeader(items);
  renderTeaTypeFilters(items);
  renderLegend();
  renderProvinceShapes(items);
  renderMapOverlays(items);
  renderDetail(items);
  renderCards(items);
  if (els.searchInput) {
    els.searchInput.value = state.search;
    els.searchInput.placeholder = currentText().searchPlaceholder;
  }
  els.langToggle.textContent = currentText().interfaceToggle;
  updateZoomUi();
}

els.langToggle.addEventListener('click', () => {
  state.lang = state.lang === 'zh' ? 'en' : 'zh';
  rerender();
});
if (els.enterMapButton) {
  els.enterMapButton.addEventListener('click', () => enterMapView());
}
if (els.siteHomeButton) {
  els.siteHomeButton.addEventListener('click', () => backToLandingView());
}
if (els.globalBackButton) {
  els.globalBackButton.addEventListener('click', () => {
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
els.searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  rerender();
});

if (els.mapContextPanel) {
  els.mapContextPanel.addEventListener('click', (event) => {
    if (isReferenceCalibratedMode()) return;
    const trigger = event.target.closest('[data-preview-action]');
    if (!trigger) return;
    const action = trigger.dataset.previewAction;
    if (action === 'open' && trigger.dataset.id) {
      openDetailView(trigger.dataset.id);
      return;
    }
    if (action === 'reset') {
      clearMapPreview();
      rerender();
    }
  });
}

if (els.zoomInButton) {
  els.zoomInButton.addEventListener('click', () => {
    if (isReferenceCalibratedMode()) return;
    zoomAt({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 }, 1.25);
  });
}
if (els.zoomOutButton) {
  els.zoomOutButton.addEventListener('click', () => {
    if (isReferenceCalibratedMode()) return;
    zoomAt({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 }, 1 / 1.25);
  });
}
if (els.resetViewButton) {
  els.resetViewButton.addEventListener('click', () => {
    if (isReferenceCalibratedMode()) return;
    resetView({ clearPreview: true });
  });
}

els.mapSvg.addEventListener('wheel', (event) => {
  if (isReferenceCalibratedMode()) return;
  event.preventDefault();
  const point = eventToViewBoxPoint(event);
  const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;
  zoomAt(point, factor);
}, { passive: false });

els.mapSvg.addEventListener('pointerdown', (event) => {
  if (isReferenceCalibratedMode()) return;
  if (isWithinInteractiveMarker(event.target, 'project-marker') || isWithinInteractiveMarker(event.target, 'special-region-badge')) return;
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
  if (isReferenceCalibratedMode()) return;
  if (!panSession || panSession.pointerId !== event.pointerId) return;
  const point = eventToViewBoxPoint(event);
  const deltaX = point.x - panSession.startPoint.x;
  const deltaY = point.y - panSession.startPoint.y;
  if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) panSession.moved = true;
  updateView(state.viewScale, panSession.startViewX + deltaX, panSession.startViewY + deltaY);
});

function endPan(event) {
  if (isReferenceCalibratedMode()) return;
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

rerender();
resetView();











