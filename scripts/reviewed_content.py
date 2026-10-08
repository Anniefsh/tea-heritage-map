"""Hand-reviewed visitor copy, based on the archived official pages of 2026-10-08.

Absent sections are intentional. Do not fill them with generic tea history or
derive public copy from interaction titles, audit notes, or sentence fragments.
"""
COPY = {}

def entry(n, summary, english, **sections):
    COPY[f'tea-item-{n:02d}'] = dict(summary=summary, english=english, sections=sections)

entry(1, '武夷岩茶是产于福建武夷山的乌龙茶，做青与焙火共同塑造了它的风味。',
      'Wuyi rock tea is an oolong tea from Wuyishan, Fujian. Leaf processing and roasting help shape its flavour.',
      practice='武夷岩茶的制作包含复式萎凋、做青、双炒双揉、低温久烘等关键环节。制茶人观察茶青状态，把握做青与烘焙的处理。',
      cultural_value='武夷山的制茶生活还伴有喊山、斗茶和茶艺等茶俗。生产技艺与这些地方活动共同构成了当地的茶文化。')
entry(2, '福州茉莉花茶把茶坯与鲜花拼和窨制，让茶吸收花香，再将茶与花分开。',
      'Fuzhou jasmine tea is scented by combining tea with fresh jasmine flowers, then separating the tea from the flowers.',
      practice='窨花时，茶坯与茉莉鲜花接触，使茶香与花香相融。通花要根据茶花堆的温度、水分和鲜花状态掌握，随后收堆复窨。起花将茶与花分开；烘焙则排除多余水分，同时减少香气散失。',
      history='福州茉莉花茶在北宋已有相关记述，窨制工艺在明代逐渐定型。宋代词作与明代茶书中，也留下了茉莉与茶相结合的记录。',
      inheritance='这项技艺依靠口传心授延续，制茶人需要结合鲜花品质与茶坯情况把握窨制。')
entry(3, '坦洋工夫红茶以福建福安坦洋村为传承中心，讲究看天做茶和细致的精制筛分。',
      'Tanyang Gongfu black tea centres on Tanyang village in Fuan, Fujian. Its craft combines weather-sensitive processing with careful refining.',
      history='坦洋工夫红茶制作技艺始创于1851年，以坦洋村为中心流传，并扩展至福安周边地区。',
      practice='制作使用当地称为“坦洋菜茶”的原料，经过初制与精制。复式萎凋、揉茶及精制筛分是其中的工艺特点，精制涉及抖、分、捞、选、簸、漂等手法。',
      cultural_value='围绕坦洋工夫茶，福安地区形成了民间故事、歌谣、谚语和畲汉茶艺歌舞，茶坊、茶亭及古道等遗存也与茶事相联系。')
entry(4, '福鼎白茶初制以萎凋和干燥为核心，不炒不揉，成茶芽头可见白毫。',
      'Fuding white tea centres on withering and drying rather than pan-frying or rolling. Its buds bear visible fine white hairs.',
      practice='鲜叶经萎凋、堆积、干燥和拣剔形成毛茶。精制还包括手工拣剔、匀堆、烘焙与装箱，制作时需随气候条件调整处理。',
      cultural_value='福鼎白茶制品包括白毫银针、白牡丹、贡眉（寿眉）等。肥壮芽头与覆盖其上的白毫，是其外观特点。')
entry(5, '安溪铁观音属于乌龙茶，摇青以及反复包揉、烘焙，是传统制作中的重要环节。',
      'Anxi Tieguanyin is an oolong tea. Shaking the leaves, repeated wrapped rolling and roasting are important parts of its craft.',
      practice='传统制作分采摘、初制、精制三部分。初制依次包含晒青、凉青、摇青、炒青、揉捻、初烘、包揉、复烘、复包揉和烘干；精制还有筛分、拣剔、拼堆、烘焙、摊凉与包装。',
      cultural_value='制茶人结合季节、气候与鲜叶嫩度处理茶青。晒青、凉青、摇青使茶青发生变化，随后炒青、揉捻与反复包揉烘焙形成成茶风味。')
entry(6, '漳平水仙将乌龙茶制作与紧压包装结合，手艺通过师徒传授在闽西延续。',
      'Zhangping Shuixian combines oolong processing with compressed packaging. The craft is transmitted through teacher-apprentice relationships in western Fujian.',
      history='清末，漳平双洋大会村茶农刘永发从建瓯水吉引进水仙茶苗，将闽北乌龙茶技艺与本地制作经验融合。',
      practice='采茶时机与晒青处理随天气变化而调整。制茶人观察茶青颜色与香气，掌握摇青、炒青等工序，并采用紧压包装。',
      inheritance='刘永发将手艺传给子孙，也传给客家人邓观金；邓观金又传给闽南人张旗生。这条师承联系体现了技艺在不同群体间的交流。')
entry(7, '滇红茶以云南大叶种鲜叶为原料，经过萎凋、揉捻、发酵、干燥，成为红茶。',
      'Dianhong black tea uses fresh leaves from Yunnan large-leaf tea plants and passes through withering, rolling, oxidation and drying.',
      practice='萎凋使鲜叶自然失水、梗叶变软；揉捻使叶片成形并破坏部分叶细胞；发酵中发生酶促氧化，叶色改变；干燥通过烘焙减少水分，形成成茶香气。',
      cultural_value='这项技艺主要流布于云南凤庆县的凤山镇、大寺乡等地。凤庆旧称顺宁，种茶、制茶与饮茶是当地生活的一部分。',
      inheritance='滇红茶的传承既包括生产企业中的技术人员，也包括民间小批量制茶的师傅，技艺在不同生产场景中延续。')
entry(8, '宁洱普洱贡茶先将鲜叶制成晒青茶，再通过蒸、揉、压等工序制成成品。',
      'Puer tribute tea from Ninger is made by processing fresh leaves into sun-dried tea, followed by steaming, rolling and pressing.',
      practice='制茶者选择采摘地点和时节，以手工采选原料，经杀青、揉捻、晒干制成晒青茶。之后进入蒸压成型，包括蒸、揉、压、定型、干燥与包装。',
      cultural_value='当地传统制茶与民俗相连，茶叶采摘前有向茶神敬献的仪式。茶事既包含原料加工，也包含与生产相关的礼俗。')
entry(9, '大益茶制作中的拼配与发酵各有作用：前者组合不同茶料，后者涉及人工后发酵。',
      'Dayi tea making combines two distinct skills: blending different tea materials and controlled post-fermentation.',
      practice='拼配依据不同茶叶品种的特点进行组合，取长补短。发酵则属于人工后发的制作技艺，与组合原料承担不同作用。',
      cultural_value='大益茶制作技艺与云南勐海的普洱茶生产相联系。当地制茶经验在原料搭配和后续加工中得到运用。')
entry(10, '下关沱茶以云南大叶种晒青茶为原料，经拼配、蒸揉和压制，形成紧压茶。',
      'Xiaguan tuocha uses sun-dried Yunnan large-leaf tea, blended, steamed and pressed into compact tea.',
      history='1902年，大理喜洲白族商帮永昌祥在下关开设茶叶精制加工厂，加工紧茶和饼茶。此后，茶产品沿茶马古道运往滇西北、西藏和四川等地。',
      practice='制作涉及原料拼配、筛分、拣剔、半成品拼配、称量、蒸揉、压制、干燥与包装。晒青原料经过这些处理，成为紧压成形的沱茶。')
entry(11, '白族三道茶以苦茶、甜茶、回味茶依次待客，把人生滋味融入茶礼。',
      'The Bai three-course tea ceremony welcomes guests with bitter, sweet and lingering tea, connecting their flavours with stages of life.',
      history='明代徐霞客在大理旅行时曾受到三道茶款待，并在游记中记录了清茶、盐茶与蜜茶。茶礼随世代传承逐渐形成今天的表达。',
      practice='第一道苦茶先烘茶再冲水，敬给客人；第二道甜茶加入核桃仁、红糖等，表达苦尽甘来；第三道回味茶将甜、微麻和苦等滋味相融，让人在品饮间回味人生。',
      cultural_value='三道茶主要流布于云南大理，是节庆喜事和迎接宾客时的礼仪。依次敬茶，让主客交谈与人生感悟融入相聚。')
entry(12, '德昂酸茶既有用于做菜的食用茶，也有经干燥加工、用于冲泡的饮用茶。',
      'Deang sour tea has two uses: fermented moist tea for cooking, and dried, further-processed tea for brewing.',
      practice='酸茶以云南大叶种鲜叶为原料，经杀青、揉捻、无氧发酵、舂制或捣碎、做型、干燥等工序制作。食用茶采用发酵后的湿茶，饮用茶还要经过晒干等加工。',
      cultural_value='酸茶主要流布于云南芒市。婚姻生活、朋友往来、迎宾与祭祀等活动，都与德昂族茶俗相联系。',
      inheritance='技艺通过师徒间的口传心授，在制茶生产实践中延续。')
entry(13, '西湖龙井产于杭州西湖茶区，精细采摘与手工炒制相结合，形成了独特的制茶传统。',
      'West Lake Longjing comes from the West Lake tea-growing area in Hangzhou. Careful picking and skilled hand-processing define its craft.',
      practice='西湖龙井的生产包含良种选育、栽培、采摘和炒制。炒制中运用抖、带、挤、甩、挺、拓、扣、抓、压、磨等手法，制茶经验在一代代茶农的实践中积累。',
      cultural_value='龙井茶得名于西湖茶区的龙井村。当地的种茶、采茶与制茶活动，连接着茶园生产与日常饮茶生活。')
entry(14, '径山茶宴将点茶、分茶与宾主交谈融于一席茶事，体现禅院的待客礼仪。',
      'The Jingshan tea ceremony combines preparing and sharing tea with conversation between hosts and guests in a monastic setting.',
      history='径山茶宴起源于唐代，在宋元时期盛行。径山寺的茶事与禅院生活相互联系。',
      practice='贵客来访时，住持在明月堂设茶宴。茶宴包含张茶榜、击茶鼓、请客入堂、上香、煎汤点茶、行盏分茶、说偈吃茶与谢茶退堂等环节。',
      cultural_value='宾主或师徒借茶交流，以参话头的形式问答。茶艺、礼仪与禅院清规在茶宴中结合。')
entry(15, '婺州举岩产于金华北山一带，以焙为主、炒焙结合，是它的制茶特点。',
      'Wuzhou Juyan comes from the northern hills of Jinhua. Its craft combines pan-processing with a particular emphasis on baking.',
      history='金华在隋唐时期称婺州，婺州举岩因而得名。茶产于北山双龙洞顶一带。',
      practice='制作分为拣草摊青、青锅、揉捻、二锅、做坯整形、烘焙、精选储存七道工序。采摘一芽一叶或一芽二叶初展的芽叶，经炒焙加工形成细紧、略扁的成茶。')
entry(16, '顾渚紫笋与浙江长兴顾渚山的茶事相连，芽色带紫、芽形似笋是名称的线索。',
      'Guzhu Zisun is associated with Guzhu Mountain in Changxing, Zhejiang. Its name refers to purplish buds shaped like bamboo shoots.',
      practice='采摘一芽一叶或一芽二叶初展的鲜叶，经摊青、杀青、理条、摊凉、初烘、复烘制成茶。',
      cultural_value='顾渚村的制茶生产与家庭分工相联系，采茶、分拣和制茶由家庭成员共同参与。紫笋茶也与顾渚山的贡茶历史相连。')
entry(17, '安吉白茶虽以“白茶”为名，却属于绿茶制作技艺，浅色叶片与绿色叶脉是它的外观特点。',
      'Despite its name, Anji white tea belongs to green-tea making. Pale leaves with green veins are one of its visual features.',
      practice='手工制作包括采摘、摊放、杀青理条、初烘、摊凉、复烘与收灰干燥。杀青理条时，制茶人需要兼顾薄叶与较粗茎梗，保持叶张完整。',
      cultural_value='安吉白茶的名称与叶色相联系，而茶类归属与制作工艺有关。它以杀青理条等工艺加工，在国家级非遗名录中列于绿茶制作技艺。')
entry(18, '黄山毛峰以嫩芽叶手工加工，杀青、揉捻、毛火和足火各有对应的制茶动作。',
      'Huangshan Maofeng is made from tender buds and leaves. Its hand-processing links distinct actions to fixation, rolling and two firing stages.',
      history='1875年，徽州漕溪人谢正安创办谢裕大茶行，带领家人采制嫩芽叶。茶名“毛峰”与白毫和芽尖形态有关，随后种植扩展至黄山南北麓。',
      practice='“下锅炒”对应杀青，“轻滚转”对应揉捻，“焙生坯”对应毛火，“盖上圆簸复老烘”对应足火。嫩芽叶经过炒、揉与烘焙，形成成茶。')
entry(19, '太平猴魁起于黄山猴坑、猴岗一带，从采选壮挺的一芽二叶开始讲究精细制作。',
      'Taiping Houkui is associated with Houkeng and Hougang in Huangshan. Its craft begins with carefully selecting sturdy shoots with one bud and two leaves.',
      history='1900年前后，猴岗茶农王魁成从鲜叶采选入手，选取壮挺的一芽二叶精心制茶。太平县猴坑、猴岗一带的茶由此形成太平猴魁的名称与制茶传统。',
      cultural_value='黄山区旧称太平县，所产茶曾称太平茶。当地居民长期以产茶为业，也有修建茶亭、方便行人的习俗。')
entry(20, '祁门红茶的制作分初制与精制：先把鲜叶制成毛茶，再筛分、拣剔、复火和匀堆。',
      'Qimen black-tea making has primary and refining stages. Leaves are first processed into rough tea, then sorted, picked over, refired and blended.',
      history='祁门红茶于清光绪二年（1876）创制。传统手工制作讲究工夫，因而又称祁门工夫。',
      practice='初制包含萎凋、揉捻、发酵和干燥；精制包含筛分、切断、风选、拣剔、复火与匀堆。制成的茶条索紧细、色泽乌润，茶汤呈红色。')
entry(21, '六安瓜片源于六安茶，产制传统与安徽六安的茶区生活相连。',
      'Luan Guapian developed from the tea traditions of Luan, Anhui, and is closely connected with local tea-growing communities.',
      history='明代《农政全书》已有六安片茶的记载，清代六安瓜片被列为贡品。当时的生产制作集中在六安麻埠街一带。',
      cultural_value='六安瓜片的产区包括六安市裕安区独山、黄涧河、同心寺等地，地方制茶传统在这些茶区延续。')
entry(22, '碧螺春的卷曲形态与茸毫，来自揉捻整形、搓团显毫等手工工艺。',
      'Biluochun obtains its curled form and visible fine hairs through hand-rolling, shaping and rubbing the leaves into clusters.',
      history='苏州洞庭山的产茶历史见于唐代《茶经》，北宋地方文献也记载了洞庭茶。',
      practice='采制包含采摘、拣剔、摊放、高温杀青、揉捻整形、搓团显毫、文火干燥。锅中操作将揉与炒结合，形成纤细、卷曲的茶条。')
entry(23, '南京雨花茶呈细直松针形，整形时将搓条、抓条与理条结合。',
      'Nanjing Yuhua tea has a fine, straight, pine-needle shape, formed through rubbing, grasping and aligning the leaves.',
      practice='鲜叶经采摘、摊放、杀青、揉捻、毛火、整形、足火、精制、烘焙和包装。整形把搓条、抓条、理条结合，筛分则按粗细、长短、轻重分开茶叶。',
      cultural_value='中山陵景区与雨花台景区是技艺流布的核心区域。特制竹篾烘笼与手工筛分、提香足干等方法相配合，形成当地针形绿茶的制作特点。')
entry(24, '扬州富春茶点把手工点心与茶艺结合，让一席茶同时容纳点心的形与味。',
      'Fuchun tea refreshments in Yangzhou bring together handmade pastries and the preparation and enjoyment of tea.',
      practice='富春点心采用传统手工方法制作，重视造型与不同品种的滋味。茶艺与点心制作共同构成茶点技艺。',
      cultural_value='富春茶社将花卉、茶艺、点心和菜肴结合。其魁龙珠茶把龙井、魁针与珠兰茶拼合，兼顾味、色与香。')
entry(25, '恩施玉露以蒸汽杀青，经抖、揉、铲、整等处理，形成细直的针形绿茶。',
      'Enshi Yulu is a needle-shaped green tea made through steam fixation followed by shaking, rolling and shaping.',
      practice='制作使用蒸青灶与焙炉，核心技法包括蒸、搧、抖、揉、铲、整。蒸青后搧风散水，再经抛抖、揉捻、铲二毛火和整形上光，最后焙火提香、拣选成品。',
      cultural_value='技艺主要流布于恩施芭蕉侗族乡与五峰山一带，蒸青和针形整形构成当地制茶的鲜明特点。',
      inheritance='恩施玉露通过师徒传授与家族传承延续，制茶人在实际生产中学习蒸青、焙火与手工整形。')
entry(26, '赵李桥砖茶包括青砖茶与米砖茶，两者原料和加工方式各有特点。',
      'Zhaoliqiao brick tea includes green brick tea and rice brick tea, with different raw materials and processing methods.',
      practice='青砖茶由叶片原料经过初制、渥堆发酵、陈化、压制与烘制等处理。米砖茶以红茶茶末为原料，筛分风选后蒸制、紧压成形，再烘干包装。',
      history='赵李桥砖茶的前身是赤壁羊楼洞砖茶，俗称洞茶。清代当地茶厂由帽合茶逐渐改制成长方形砖茶。',
      inheritance='技艺通过师带徒延续，传习所也是相关技艺的传承场所。')
entry(27, '长盛川青砖茶将初制、渥堆发酵、精制、拼配、成型与烘干包装分为六大阶段。',
      'Changshengchuan green brick tea passes through six broad stages, from initial processing and pile fermentation to pressing, drying and packing.',
      practice='初制含采摘与炒青，渥堆阶段处理茶堆水分与通风，精制进行过筛分级，拼配结合开汤评级，成型采用蒸茶紧压，最后烘干包装。大堆发酵与堆内开沟通风是其工艺特点。',
      cultural_value='技艺发源于湖北咸宁，流传至宜昌及周边地区。青砖茶生产与万里茶道的贸易往来相联系。')
entry(28, '安化千两茶先制黑毛茶，再装篓、踩压和捆扎，形成柱状紧压茶。',
      'Anhua Qianliang tea starts with dark raw tea, which is loaded into a basket, compacted and bound to form a tea column.',
      history='清代安化茶商为运输方便，将黑茶踩捆成圆柱状。茶柱由百两发展至千两，成为安化千两茶名称的由来。',
      practice='黑毛茶制作包含杀青、揉捻、渥堆、复揉、烘焙。精深加工包含筛分、拼配、软化、装篓、踩压、扎箍、锁口、冷却和干燥，茶叶由散料逐渐紧压成形。')
entry(29, '益阳茯砖茶以黑毛茶为原料，渥堆、筑制成型与发花是制作中的重要环节。',
      'Yiyang Fuzhuan tea uses dark raw tea and involves pile processing, pressing into shape and a flowering stage.',
      practice='黑毛茶经过渥堆、发酵、筑制成型与发花等加工，成为茯砖茶。发花是这项技艺的制作特点。',
      cultural_value='茯砖茶产制与湖南益阳相联系，也是我国西北地区传统饮茶生活中的茶品。')
entry(30, '君山银针是湖南岳阳的黄茶，制作中的两次闷黄形成了独特工艺。',
      'Junshan Yinzhen is a yellow tea from Yueyang, Hunan, with two yellowing stages in its traditional processing.',
      practice='制作包含摊晾、杀青、摊凉、初烘、初包、复烘、复包、足火与精选。初包、复包所构成的双式闷黄，是其工艺特点；成茶芽身金黄、白毫显露，外形似针。',
      cultural_value='技艺主要分布于岳阳君山岛及许市镇等地，种茶、制茶和品饮经验与当地生活相联系。',
      inheritance='技艺依靠家族与师徒传承，茶园生产实践、培训及茶事体验也是传习方式。')
entry(31, '赣南客家擂茶用擂钵与擂棍把茶叶和食材研磨成茶泥，再冲泡饮用。',
      'Gannan Hakka lei cha is made by grinding tea and other ingredients into a paste with a bowl and pestle, then adding hot water.',
      practice='茶叶与糯米、芝麻、黄豆、花生等材料放入擂钵，擂棍沿内壁沟纹舂捣、旋磨，形成茶泥。冲泡后可搭配炒米、花生米、米果等食物，组成擂茶宴。',
      cultural_value='这项技艺流布于江西全南、赣县、兴国、于都等地。擂茶的制作与饮用融入客家家庭日常生活。')
entry(32, '婺源绿茶把杀青、揉捻与分段干燥相结合，低温长烚是其工艺特点。',
      'Wuyuan green tea combines fixation, rolling and staged drying, with extended low-temperature pan-processing as a characteristic technique.',
      practice='制作包括采摘、摊片、杀青、揉捻、解块、烘坯、做形与烘干提香。烘坯后还需初干造型，并将成型茶合锅进行低温长烚。',
      cultural_value='婺源山谷产茶的记载见于唐代《茶经》。制茶与当地山区茶农的生活相连，技艺以家族和群体方式传承。')
entry(33, '宁红工夫茶得名于修水旧称分宁、义宁，传统制作分初制与精制两部分。',
      'Ninghong Gongfu tea takes its name from the former names of Xiushui. Its craft includes primary processing and refining.',
      practice='初制包括萎凋、揉捻、发酵与烘干；精制包括筛分、拣剔、复火、匀堆与装箱。原料经拣选分级后加工，形成紧结的茶条。',
      history='宁红茶制作技艺起源于清乾隆晚期，在道光、光绪年间发展，十九世纪中叶起销往海外。',
      cultural_value='采茶歌、采茶戏、茶诗和品茶活动伴随宁红茶的生产发展，构成修水地方文化的一部分。',
      inheritance='技艺通过家族、师徒和社会传承延续，生产企业也承担品种保护与人才培养等传习活动。')
entry(34, '广东凉茶与岭南凉茶铺的生活记忆相连，配制技艺、术语和家族传承共同构成这一文化传统。',
      'Guangdong herbal-tea culture is connected with Lingnan tea shops, preparation skills, specialised terms and family transmission.',
      cultural_value='凉茶铺长期分布于广东、香港和澳门，成为岭南饮食生活的一部分。制茶器具、店铺、照片与史料也承载着这段文化记忆。',
      inheritance='凉茶配制技艺主要通过家族传承，配方与相关术语随之延续。不同凉茶品牌与配方构成了多样的地方传统。')
entry(35, '潮州工夫茶以乌龙茶待客，煮水、冲泡、分茶与品饮各有器具和茶事动作。',
      'Chaozhou Gongfu tea uses oolong tea and distinct utensils for heating water, brewing, serving and tasting.',
      practice='泥炉生火，砂铫煮水，茶壶纳茶冲泡，茶杯承接茶汤。茶事还包含热罐、温盅、提铫高冲、刮沫淋盖、烫杯滚杯与低洒茶汤等动作。',
      cultural_value='敬茶、闻香与细啜把制备茶汤和待客交往连接起来，是潮州传统茶文化中的日常礼仪。')
entry(36, '张一元茉莉花茶以福建烘青春茶为茶坯，与北京茶庄的饮茶传统相联系。',
      'Zhang Yiyuan jasmine tea uses baked spring green tea from Fujian as its base and is associated with Beijing tea-shop traditions.',
      history='清末张昌翼开办张一元茶庄，以制作、销售茉莉花茶为业。1992年，张一元传统茉莉花茶制作工艺得到恢复。',
      practice='制作采用福建烘青绿茶的春茶作茶坯，茶坯初制经过萎凋、杀青、揉捻和烘焙等工序。',
      cultural_value='张一元的花茶与老北京戏园、澡堂等日常生活场景相联系，形成了茶庄与城市饮茶生活之间的联系。')
entry(37, '吴裕泰茉莉花茶从茶坯和花源入手，经窨制、通花、起花与烘焙，让茶与花香相融。',
      'Wu Yutai jasmine tea combines carefully prepared tea and flowers through scenting, cooling, flower separation and drying.',
      history='吴裕泰始建于1887年，形成了自采、自窨、自拼的制茶传统。',
      practice='制作包括茶坯制作、花源选择、鲜花养护、玉兰打底、窨制拼和、通花散热、起花、烘焙与匀堆装箱。采用春茶茶坯，并运用低温慢烘等处理。')
entry(38, '雅安南路边茶属于黑茶，可以用来调制酥油茶，连接着产茶地与藏区的饮茶生活。',
      'Nanlu border tea from Yaan is a dark tea that can be used to prepare butter tea, connecting its production area with Tibetan tea-drinking traditions.',
      practice='南路边茶的制作包含发酵、自然干燥、压制和包装等加工。茶汤可以与酥油、盐等调制成酥油茶。',
      cultural_value='这种茶也称乌茶、边销茶、雅茶等，传统上由雅安供应西藏、青海及四川甘孜、阿坝等地。')
entry(39, '蒙山茶技艺涵盖蒙顶甘露等绿茶和蒙顶黄芽，制茶师与掌火者配合，随茶青状态制茶。',
      'Mengshan tea craft includes green teas such as Mengding Ganlu as well as Mengding Huangya yellow tea. Tea makers work with a fire specialist and respond to the leaves.',
      practice='制茶人根据芽叶季节、采下时间与含水量调整处理，运用捧、抛、拉、压、撒、推、揉等手法。火丹师负责锅温，与制茶师配合。',
      cultural_value='蒙山又称蒙顶山，技艺主要流布于四川雅安名山区。贡茶、品茶、祭祀及茶马交易，也与当地茶文化相联系。',
      inheritance='技艺以师傅带徒弟的方式，在口授讲解与生产实践中传承。')
entry(40, '六堡茶发源于广西苍梧六堡镇，初蒸、沤堆与复蒸使茶叶在湿热作用下发生变化。',
      'Liubao tea originates in Liubao, Cangwu, Guangxi. Steaming and pile processing bring changes to the leaves through heat and moisture.',
      practice='当地茶叶经杀青、揉捻后，进入初蒸、沤堆和复蒸，再经烘焙、晾置与陈化。蒸与堆的湿热处理促进叶色、香气与滋味变化。',
      history='1874年的《苍梧县志》已有六堡产茶的记载。技艺通过师传与家传，在茶厂及茶农家庭作坊中延续。')
entry(41, '瑶族油茶把茶叶、生姜等放入锅中捶打、熬煮，也把围坐交谈和迎宾待客融入日常。',
      'Yao oil tea is made by pounding and simmering tea with ingredients such as ginger. Sharing it is part of everyday conversation and hospitality.',
      practice='制作时把茶叶、生姜、大蒜等放入铁锅反复捶打，再加入热水熬煮，俗称打油茶。品饮时可佐以炒米、糍粑、花生等食品。',
      cultural_value='油茶习俗主要流布于广西恭城及周边瑶族居住区，也见于湖南、广东的瑶族社区。满月、婚嫁、贺寿、节日与待客等活动中都有茶礼，在与壮、汉等群体的交往中成为共享习俗。',
      inheritance='家族与社会传承共同延续茶俗，村寨长者向年轻人传授茶规和相关知识。')
entry(42, '信阳毛尖在生锅、熟锅中炒制和整形，甩条等手法塑造细圆紧直的茶条。',
      'Xinyang Maojian is processed in successive pans, using tossing and shaping techniques to form fine, rounded, straight tea strips.',
      practice='鲜叶采摘摊晾后，在生锅中杀青、成条和揉捻，再转入熟锅甩条，随后烘烤、摊凉。炒把操作与熟锅手法共同影响茶条外形。',
      history='1926年，当地茶农改进熟锅甩条和大茶把炒熟锅的方法，相关技艺在信阳茶区流传。',
      cultural_value='技艺主要流布于信阳浉河区、平桥区等茶区，制茶与当地茶农的生产生活相联系。')
entry(43, '咸阳茯茶以黑毛茶为原料，经过筑茶成型与自然发花等工序，形成砖茶。',
      'Xianyang Fu tea uses dark raw tea and includes pressing into brick form and natural flowering among its processing stages.',
      practice='制作包括配料渥堆、煮熬茶釉、茶釉炒茶、制封灌封、扶梆筑茶、扎封锥封与自然发花。筑茶时将茶装入模具夯实成形，再捆扎茶封，进入后续发花。',
      cultural_value='技艺主要流布于陕西咸阳泾阳、秦都一带，筑茶梆子等工具与当地茯茶加工相联系。',
      inheritance='技艺通过师带徒、家族传承与院校培训延续，传承馆也承担展示与传播作用。')
entry(44, '都匀毛尖通过杀青、揉捻、搓团提毫与烘焙，形成卷曲而白毫显露的绿茶。',
      'Duyun Maojian is a green tea with curled leaves and visible fine hairs, formed through fixation, rolling, rubbing and baking.',
      practice='采下的芽叶先薄摊，再进行杀青、揉捻。搓团时茶团在掌中摩擦滚动，使茶条起毫，随后烘焙干燥。制茶人结合茶青质量与湿度把握手法和火候。',
      cultural_value='技艺流布于贵州都匀，与黔南布依族、苗族、水族等群体的生产生活相联系。',
      inheritance='传承方式包括家族与师徒传承，以家族传承为主。')
entry(45, '香港凉茶文化延续岭南凉茶铺的传统，配制技艺和相关术语随家族传授。',
      'Hong Kong herbal-tea culture continues the Lingnan tea-shop tradition, with preparation skills and specialised terms passed through families.',
      cultural_value='香港与广东、澳门共享岭南凉茶文化。凉茶铺、制作器具和相关史料承载着城市饮食生活的记忆。',
      inheritance='凉茶的配方、术语与配制技艺通过家族传承延续，店铺是这一传统的重要生活场景。')
entry(46, '澳门凉茶文化与岭南饮食传统相连，凉茶铺和代际传授保存着地方生活记忆。',
      'Macau herbal-tea culture is connected with Lingnan food traditions, local tea shops and skills passed between generations.',
      cultural_value='澳门与广东、香港共同构成凉茶文化的流布区域。凉茶铺及其器具、史料是认识这一饮食传统的线索。',
      inheritance='凉茶配制技艺以家族传承为主，配方与相关术语在代际传授中延续。')
