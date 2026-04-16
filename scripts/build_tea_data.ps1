Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourcePath = 'D:\桌面\国创\非遗地图\各省国家级茶叶非遗分布.docx'
$outputPath = 'D:\HuaweiMoveData\Users\Annie\Documents\New project\tea-heritage-map\data\tea_heritage.json'

$provinceAnchors = [ordered]@{
  '北京市' = @{ x = 57; y = 24 }
  '福建省' = @{ x = 72; y = 60 }
  '云南省' = @{ x = 30; y = 72 }
  '浙江省' = @{ x = 70; y = 50 }
  '安徽省' = @{ x = 62; y = 45 }
  '江苏省' = @{ x = 69; y = 40 }
  '湖北省' = @{ x = 53; y = 48 }
  '湖南省' = @{ x = 53; y = 58 }
  '江西省' = @{ x = 60; y = 56 }
  '广东省' = @{ x = 59; y = 73 }
  '四川省' = @{ x = 39; y = 54 }
  '广西' = @{ x = 50; y = 73 }
  '河南省' = @{ x = 55; y = 39 }
  '陕西省' = @{ x = 45; y = 40 }
  '贵州省' = @{ x = 45; y = 66 }
  '香港' = @{ x = 66; y = 81 }
  '澳门' = @{ x = 62; y = 80 }
}

$categoryMap = [ordered]@{
  '传统技艺' = 'Traditional Craft'
  '民俗' = 'Folk Custom'
}

$teaTypeMeta = [ordered]@{
  'green' = @{ zh = '绿茶'; en = 'Green Tea'; icon = 'leaf'; color = '#5f8f4e' }
  'black' = @{ zh = '红茶'; en = 'Black Tea'; icon = 'ember'; color = '#8b4b34' }
  'dark' = @{ zh = '黑茶'; en = 'Dark Tea'; icon = 'mountain'; color = '#5b4636' }
  'oolong' = @{ zh = '乌龙茶'; en = 'Oolong Tea'; icon = 'swirl'; color = '#7c5b3f' }
  'yellow' = @{ zh = '黄茶'; en = 'Yellow Tea'; icon = 'sun'; color = '#b9932f' }
  'white' = @{ zh = '白茶'; en = 'White Tea'; icon = 'petal'; color = '#c6bea5' }
  'flower' = @{ zh = '花茶'; en = 'Scented Tea'; icon = 'flower'; color = '#c66d63' }
  'puer' = @{ zh = '普洱茶'; en = "Pu'er Tea"; icon = 'disc'; color = '#7e4f2f' }
  'custom' = @{ zh = '茶俗'; en = 'Tea Custom'; icon = 'cup'; color = '#4a6b60' }
  'art' = @{ zh = '茶艺'; en = 'Tea Art'; icon = 'cup'; color = '#5a5ea2' }
  'pastry' = @{ zh = '茶点'; en = 'Tea Pastry'; icon = 'tray'; color = '#d27b42' }
  'herbal' = @{ zh = '凉茶'; en = 'Herbal Tea'; icon = 'herb'; color = '#3d7f59' }
  'other' = @{ zh = '茶类相关'; en = 'Tea Heritage'; icon = 'marker'; color = '#7a6a52' }
}

$nameTranslations = [ordered]@{
  '武夷岩茶（大红袍）制作技艺' = 'Wuyi Rock Tea (Da Hong Pao) Processing Technique'
  '花茶制作技艺（福州茉莉花茶窨制工艺）' = 'Scented Tea Processing Technique (Fuzhou Jasmine Tea Scenting)'
  '红茶制作技艺（坦洋工夫茶制作技艺）' = 'Black Tea Processing Technique (Tanyang Congou Tea)'
  '白茶制作技艺（福鼎白茶制作技艺）' = 'White Tea Processing Technique (Fuding White Tea)'
  '乌龙茶制作技艺（铁观音制作技艺）' = 'Oolong Tea Processing Technique (Tieguanyin)'
  '乌龙茶制作技艺（漳平水仙茶制作技艺）' = 'Oolong Tea Processing Technique (Zhangping Shuixian)'
  '红茶制作技艺（滇红茶制作技艺）' = 'Black Tea Processing Technique (Dianhong Tea)'
  '普洱茶制作技艺（贡茶制作技艺）' = "Pu'er Tea Processing Technique (Tribute Tea)"
  '普洱茶制作技艺（大益茶制作技艺）' = "Pu'er Tea Processing Technique (Dayi Tea)"
  '黑茶制作技艺（下关沱茶制作技艺）' = 'Dark Tea Processing Technique (Xiaguan Tuo Tea)'
  '茶俗（白族三道茶）' = 'Tea Custom (Bai Three-Course Tea)'
  '德昂族酸茶制作技艺' = "De'ang Sour Tea Making Technique"
  '绿茶制作技艺（西湖龙井）' = 'Green Tea Processing Technique (West Lake Longjing)'
  '径山茶宴' = 'Jingshan Tea Banquet'
  '绿茶制作技艺（婺州举岩）' = 'Green Tea Processing Technique (Wuzhou Juyan)'
  '绿茶制作技艺（紫笋茶制作技艺）' = 'Green Tea Processing Technique (Zisun Tea)'
  '绿茶制作技艺（安吉白茶制作技艺）' = 'Green Tea Processing Technique (Anji White Tea)'
  '绿茶制作技艺（黄山毛峰）' = 'Green Tea Processing Technique (Huangshan Maofeng)'
  '绿茶制作技艺（太平猴魁）' = 'Green Tea Processing Technique (Taiping Houkui)'
  '红茶制作技艺（祁门红茶制作技艺）' = 'Black Tea Processing Technique (Keemun Black Tea)'
  '绿茶制作技艺（六安瓜片）' = "Green Tea Processing Technique (Lu'an Guapian)"
  '绿茶制作技艺（碧螺春制作技艺）' = 'Green Tea Processing Technique (Biluochun)'
  '绿茶制作技艺（雨花茶制作技艺）' = 'Green Tea Processing Technique (Yuhua Tea)'
  '茶点制作技艺（富春茶点制作技艺）' = 'Tea Pastry Making Technique (Fuchun Tea Pastry)'
  '绿茶制作技艺（恩施玉露制作技艺）' = 'Green Tea Processing Technique (Enshi Yulu)'
  '黑茶制作技艺（赵李桥砖茶制作技艺）' = 'Dark Tea Processing Technique (Zhaoliqiao Brick Tea)'
  '黑茶制作技艺（长盛川青砖茶制作技艺）' = 'Dark Tea Processing Technique (Changshengchuan Brick Tea)'
  '黑茶制作技艺（千两茶制作技艺）' = 'Dark Tea Processing Technique (Qianliang Tea)'
  '黑茶制作技艺（茯砖茶制作技艺）' = 'Dark Tea Processing Technique (Fuzhuan Tea)'
  '黄茶制作技艺（君山银针茶制作技艺）' = 'Yellow Tea Processing Technique (Junshan Yinzhen)'
  '绿茶制作技艺（赣南客家擂茶制作技艺）' = 'Green Tea Processing Technique (Southern Jiangxi Hakka Lei Cha)'
  '绿茶制作技艺（婺源绿茶制作技艺）' = 'Green Tea Processing Technique (Wuyuan Green Tea)'
  '红茶制作技艺（宁红茶制作技艺）' = 'Black Tea Processing Technique (Ninghong Tea)'
  '凉茶' = 'Herbal Tea Preparation'
  '茶艺（潮州工夫茶艺）' = 'Tea Art (Chaozhou Gongfu Tea)'
  '花茶制作技艺（张一元茉莉花茶制作技艺）' = 'Scented Tea Processing Technique (Zhang Yiyuan Jasmine Tea)'
  '花茶制作技艺（吴裕泰茉莉花茶制作技艺）' = 'Scented Tea Processing Technique (Wuyutai Jasmine Tea)'
  '黑茶制作技艺（南路边茶制作技艺）' = 'Dark Tea Processing Technique (Nanlu Bian Tea)'
  '绿茶制作技艺（蒙山茶传统制作技艺）' = 'Green Tea Processing Technique (Mengshan Tea Traditional Craft)'
  '黑茶制作技艺（六堡茶制作技艺）' = 'Dark Tea Processing Technique (Liubao Tea)'
  '茶俗（瑶族油茶习俗）' = 'Tea Custom (Yao Oil Tea Custom)'
  '绿茶制作技艺（信阳毛尖茶制作技艺）' = 'Green Tea Processing Technique (Xinyang Maojian)'
  '黑茶制作技艺（咸阳茯茶制作技艺）' = 'Dark Tea Processing Technique (Xianyang Fu Tea)'
  '绿茶制作技艺（都匀毛尖茶制作技艺）' = 'Green Tea Processing Technique (Duyun Maojian)'
}

function Get-TeaType($name) {
  if ($name -match '绿茶') { return 'green' }
  if ($name -match '红茶') { return 'black' }
  if ($name -match '黑茶') { return 'dark' }
  if ($name -match '乌龙茶') { return 'oolong' }
  if ($name -match '黄茶') { return 'yellow' }
  if ($name -match '白茶') { return 'white' }
  if ($name -match '花茶') { return 'flower' }
  if ($name -match '普洱茶') { return 'puer' }
  if ($name -match '凉茶') { return 'herbal' }
  if ($name -match '茶艺') { return 'art' }
  if ($name -match '茶俗|茶宴|油茶|三道茶') { return 'custom' }
  if ($name -match '茶点') { return 'pastry' }
  return 'other'
}

function Get-ProvinceHeading($line) {
  if ($line -match '^(.*?)[（(]\d+[）)]$') { return $matches[1] }
  return $null
}

function Get-PlainLines($docxPath) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
  try {
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $plain = [regex]::Replace($xml, '<w:tab[^>]*/>', "`t")
    $plain = [regex]::Replace($plain, '</w:p>', "`r`n")
    $plain = [regex]::Replace($plain, '<[^>]+>', '')
    $plain = [System.Net.WebUtility]::HtmlDecode($plain)
    return @($plain -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | ForEach-Object { $_.Trim() })
  }
  finally {
    $zip.Dispose()
  }
}

$lines = Get-PlainLines $sourcePath
$startIndex = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match '^福建省[（(]\d+[）)]$') {
    $startIndex = $i
    break
  }
}
$lines = $lines[$startIndex..($lines.Count - 1)]

$records = @()
$currentProvince = ''
$i = 0
while ($i -lt $lines.Count) {
  $province = Get-ProvinceHeading $lines[$i]
  if ($province) {
    $currentProvince = $province
    $i++
    continue
  }

  if (($i + 5) -ge $lines.Count) { break }

  $city = $lines[$i]
  $name = $lines[$i + 1]
  $code = $lines[$i + 2]
  $category = $lines[$i + 3]
  $yearBatch = $lines[$i + 4]
  $unit = $lines[$i + 5]

  $records += [pscustomobject]@{
    province = $currentProvince
    city = $city
    name = $name
    code = $code
    category = $category
    yearBatch = $yearBatch
    protectionUnit = $unit
  }
  $i += 6
}

$grouped = $records | Group-Object province
$items = @()
$index = 0
foreach ($group in $grouped) {
  $anchor = $provinceAnchors[$group.Name]
  if (-not $anchor) {
    $anchor = @{ x = 50; y = 50 }
  }
  $count = $group.Group.Count
  for ($j = 0; $j -lt $count; $j++) {
    $record = $group.Group[$j]
    $teaTypeKey = Get-TeaType $record.name
    $teaMeta = $teaTypeMeta[$teaTypeKey]
    $angle = if ($count -eq 1) { 0 } else { (360 / $count) * $j }
    $radius = if ($count -le 2) { 2.2 } elseif ($count -le 4) { 3.4 } else { 4.5 }
    $x = [Math]::Round(($anchor.x + [Math]::Cos($angle * [Math]::PI / 180) * $radius), 2)
    $y = [Math]::Round(($anchor.y + [Math]::Sin($angle * [Math]::PI / 180) * $radius), 2)
    $nameEn = $nameTranslations[$record.name]
    if (-not $nameEn) { $nameEn = $record.name }
    $categoryEn = if ($categoryMap.Contains($record.category)) { $categoryMap[$record.category] } else { $record.category }
    $yearText = $record.yearBatch -replace '\s+', ' '
    $descriptionZh = "${($record.name)}于${yearText}列入国家级非物质文化遗产代表性项目名录，所属地区为${($record.city)}，类别为${($record.category)}，保护单位为${($record.protectionUnit)}。首版页面将先基于清单数据展示，后续继续补充工艺流程、历史脉络、代表性图像与视频素材。"
    $descriptionEn = "${nameEn} was inscribed on the national intangible cultural heritage list in ${yearText}. It is associated with ${($record.city)} and is classified as ${categoryEn}. The current version uses structured list data first, and richer background materials, visuals, and video references will be added in the next content pass."
    $items += [pscustomobject]@{
      id = ('tea-item-{0:d2}' -f ($index + 1))
      province = $record.province
      city = $record.city
      name = $record.name
      nameEn = $nameEn
      code = $record.code
      category = $record.category
      categoryEn = $categoryEn
      yearBatch = $record.yearBatch
      protectionUnit = $record.protectionUnit
      teaType = $teaMeta.zh
      teaTypeEn = $teaMeta.en
      icon = $teaMeta.icon
      color = $teaMeta.color
      descriptionZh = $descriptionZh
      descriptionEn = $descriptionEn
      x = $x
      y = $y
      provinceX = $anchor.x
      provinceY = $anchor.y
      videoUrl = ''
      imageUrl = ''
      sourceUrl = ''
      sourceStatus = 'seed-docx'
    }
    $index++
  }
}

$provinceSummaries = foreach ($group in $grouped) {
  $anchor = $provinceAnchors[$group.Name]
  [pscustomobject]@{
    province = $group.Name
    count = $group.Count
    x = $anchor.x
    y = $anchor.y
    teaTypes = @($group.Group | ForEach-Object { (Get-TeaType $_.name) } | Select-Object -Unique | ForEach-Object { $teaTypeMeta[$_].zh })
  }
}

$output = [pscustomobject]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  source = $sourcePath
  totalItems = $items.Count
  totalProvinces = $provinceSummaries.Count
  teaTypes = $teaTypeMeta.Keys | ForEach-Object {
    [pscustomobject]@{
      key = $_
      zh = $teaTypeMeta[$_].zh
      en = $teaTypeMeta[$_].en
      icon = $teaTypeMeta[$_].icon
      color = $teaTypeMeta[$_].color
    }
  }
  provinces = $provinceSummaries
  items = $items
}

$output | ConvertTo-Json -Depth 6 | Set-Content -Path $outputPath -Encoding UTF8
Write-Output "Generated $outputPath"
Write-Output "Items=$($items.Count) Provinces=$($provinceSummaries.Count)"
