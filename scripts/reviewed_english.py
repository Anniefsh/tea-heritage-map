"""Faithful English translations of reviewed Chinese copy, not official quotations.

Technical vocabulary follows UNESCO 01884 and the terminology record generated
by apply_bilingual_content.py. Keys follow the canonical Chinese section keys.
"""
SECTIONS = {}
def section(n, **values):
    SECTIONS[f'tea-item-{n:02d}'] = values

section(1,
 practice='Wuyi rock tea processing includes combined withering methods, repeated shaking and resting of the leaves, two rounds of pan-heating and rolling, and prolonged low-temperature roasting. Tea makers observe the leaves to judge how to handle these stages.',
 cultural_value='Tea life in Wuyishan also includes mountain-calling ceremonies, tea competitions and the art of preparing tea. These local activities and production skills together form its tea culture.')
section(2,
 practice='During scenting, the tea base is mixed with fresh jasmine flowers so that it absorbs their fragrance. Makers aerate the mixture according to its temperature, moisture and the condition of the flowers, then gather it again for further scenting. The flowers are separated from the tea; baking removes excess moisture while limiting the loss of aroma.',
 history='Accounts of Fuzhou jasmine tea date to the Northern Song dynasty. Its scenting techniques gradually took shape in the Ming dynasty. Song poetry and Ming tea books also record the pairing of jasmine and tea.',
 inheritance='The craft is passed on through oral instruction and hands-on teaching. Makers adjust scenting to the quality of the flowers and the condition of the tea base.')
section(3,
 history='Tanyang Gongfu black-tea making began in 1851, centred on Tanyang village, and spread to surrounding parts of Fuan.',
 practice='Local Tanyang Caicha tea leaves undergo primary processing and refining. Combined withering methods, rolling and careful sorting are characteristic techniques. Refining involves a range of shaking, separating, selecting and winnowing movements.',
 cultural_value='Folk stories, songs, proverbs and She and Han tea performances developed around Tanyang Gongfu tea in Fuan. Tea workshops, tea pavilions and old trading routes are also linked to local tea traditions.')
section(4,
 practice='Fresh leaves undergo withering, piling, drying and sorting to produce unfinished tea. Refining includes further hand-sorting, blending, baking and packing. Makers adjust their work to the weather.',
 cultural_value='Fuding white teas include Baihao Yinzhen, Bai Mudan and Gongmei (Shoumei). Plump buds covered in fine white hairs are a characteristic visual feature.')
section(5,
 practice='The traditional craft has three parts: picking, primary processing and refining. Primary processing includes sun-withering, cooling, shaking, pan-heating, rolling, initial drying, cloth-wrapped rolling, further drying, another wrapped rolling and final drying. Refining involves screening, sorting, blending, roasting, cooling and packing.',
 cultural_value='Makers respond to the season, weather and tenderness of the fresh leaves. Sun-withering, cooling and shaking change the leaves; pan-heating, rolling and repeated wrapped rolling and roasting then help develop the finished tea.')
section(6,
 history='In the late Qing dynasty, Liu Yongfa, a tea farmer from Dahui village in Shuangyang, Zhangping, introduced Shuixian tea plants from Shuiji in Jianou. He combined northern Fujian oolong techniques with local tea-making experience.',
 practice='Picking times and sun-withering are adjusted to the weather. Makers observe leaf colour and aroma to guide shaking and pan-heating, and use compressed packaging.',
 inheritance='Liu Yongfa taught his descendants as well as Deng Guanjin, a Hakka practitioner. Deng later taught Zhang Qisheng, a southern Fujian practitioner. This teaching connection reflects the exchange of skills between communities.')
section(7,
 practice='Withering allows fresh leaves to lose moisture and soften. Rolling shapes them and breaks some leaf cells. Enzymatic oxidation changes the leaf colour. Drying through firing reduces moisture and develops the aroma of the finished tea.',
 cultural_value='The craft is practised mainly in Fengshan, Dasi and other parts of Fengqing County, Yunnan. Fengqing was formerly known as Shunning. Growing, making and drinking tea are part of local life.',
 inheritance='The craft is passed on both by technical staff in tea enterprises and by independent makers producing small batches. It continues in these different settings.')
section(8,
 practice='Makers select picking locations and seasons and sort the leaves by hand. Heat fixation, rolling and sun-drying produce a sun-dried tea base. It is then steamed, rolled, pressed, shaped, dried and packed.',
 cultural_value='Traditional tea making is linked to local customs, including offerings to the tea deity before picking. Tea traditions encompass both processing and rituals associated with production.')
section(9,
 practice='Blending combines tea materials according to the characteristics of different varieties, balancing their qualities. Controlled post-fermentation is a separate processing skill with a different role.',
 cultural_value='Dayi tea-making techniques are linked to Puer tea production in Menghai, Yunnan. Local experience informs both the combination of raw materials and their subsequent processing.')
section(10,
 history='In 1902, Yongchangxiang, a Bai trading business from Xizhou, Dali, opened a tea-refining workshop in Xiaguan to process compressed teas and tea cakes. Its products subsequently travelled along the Ancient Tea Horse Road to northwestern Yunnan, Tibet and Sichuan.',
 practice='Processing involves raw-material blending, screening, sorting, blending semi-finished tea, weighing, steaming and rolling, pressing, drying and packing. These operations turn sun-dried tea into compressed tuocha.')
section(11,
 history='The Ming-dynasty traveller Xu Xiake was served three courses of tea in Dali. His travel journal records plain tea, salted tea and honey tea. The ceremony has developed its present expression through transmission across generations.',
 practice='The first course is bitter tea: the leaves are roasted before water is added and the tea is offered to guests. The second, sweet tea, includes walnuts and brown sugar and expresses sweetness after hardship. The third combines sweet, gently tingling and bitter flavours, inviting reflection on life.',
 cultural_value='Practised mainly in Dali, Yunnan, the ceremony welcomes guests and marks festivals and celebrations. Serving the courses in turn brings conversation and reflection into the gathering.')
section(12,
 practice='Fresh Yunnan large-leaf tea undergoes heat fixation, rolling, anaerobic fermentation, pounding or crushing, shaping and drying. The edible form uses moist fermented tea; the drinking form undergoes further processing, including sun-drying.',
 cultural_value='Sour tea is made mainly in Mangshi, Yunnan. Deang tea customs are connected with marriage, friendship, welcoming guests and ritual offerings.',
 inheritance='Teachers pass the skills to apprentices through oral instruction and hands-on tea production.')
section(13,
 practice='West Lake Longjing production encompasses cultivar selection, cultivation, picking and pan-processing. Hand movements include shaking, drawing, squeezing, tossing, straightening, spreading, tucking, grasping, pressing and rubbing. Generations of tea farmers have developed these skills through practice.',
 cultural_value='Longjing tea takes its name from Longjing village in the West Lake tea-growing area. Growing, picking and making tea connect work in the gardens with everyday tea drinking.')
section(14,
 history='The Jingshan tea ceremony originated in the Tang dynasty and flourished during the Song and Yuan dynasties. Tea activities at Jingshan Temple are closely connected with monastic life.',
 practice='When distinguished guests arrive, the abbot hosts a tea gathering in Mingyue Hall. Activities include posting a tea notice, sounding the tea drum, inviting guests into the hall, offering incense, heating water and preparing tea, sharing cups, exchanging Buddhist verses over tea, and thanking the hosts before leaving.',
 cultural_value='Hosts and guests, or teachers and disciples, exchange questions and responses as part of Chan Buddhist practice. Tea preparation, hospitality and monastic rules come together in the gathering.')
section(15,
 history='Jinhua was known as Wuzhou during the Sui and Tang dynasties, giving Wuzhou Juyan its name. The tea comes from the area above Shuanglong Cave in the northern hills.',
 practice='Seven stages cover sorting and spreading the leaves, initial pan-heating, rolling, a second pan stage, shaping, baking, and final selection and storage. Newly opened shoots with one bud and one or two leaves become fine, tightly formed, slightly flattened tea through pan-processing and baking.')
section(16,
 practice='Newly opened shoots with one bud and one or two leaves are picked, spread out, heat-fixed, aligned, cooled, initially baked and baked again.',
 cultural_value='Tea production in Guzhu village involves family members sharing picking, sorting and processing tasks. Zisun tea is also linked to the tribute-tea history of Guzhu Mountain.')
section(17,
 practice='Hand-processing includes picking, spreading, heat fixation and leaf alignment, initial baking, cooling, further baking and final drying using ash as a moisture absorber. During fixation and alignment, makers handle the thin leaves and thicker stems carefully to keep the leaves intact.',
 cultural_value='Anji white tea takes its name from the colour of its leaves, whereas its tea category reflects how it is processed. Its methods include heat fixation and leaf alignment, and the national intangible cultural heritage inventory lists it under green-tea processing.')
section(18,
 history='In 1875, Xie Zhengan of Caoxi, Huizhou, founded the Xie Yuda tea business and led his family in picking and processing tender shoots. The name Maofeng refers to the fine hairs and pointed buds. Cultivation later spread to the northern and southern slopes of Huangshan.',
 practice='Pan-heating corresponds to fixation; gentle rolling to the rolling stage; baking the unfinished tea to initial firing; and reheating beneath a round bamboo tray to final firing. Tender buds and leaves become finished tea through these heating, rolling and drying operations.')
section(19,
 history='Around 1900, Wang Kuicheng, a tea farmer from Hougang, carefully selected sturdy shoots with one bud and two leaves for processing. The tea-making traditions of Houkeng and Hougang in Taiping County developed into Taiping Houkui.',
 cultural_value='Huangshan District was formerly Taiping County, and its tea was known as Taiping tea. Tea production has long been part of local livelihoods. Residents also built tea pavilions for passing travellers.')
section(20,
 history='Qimen black tea was created in 1876, the second year of the Guangxu reign. Its painstaking hand-processing also gave rise to the name Qimen Gongfu.',
 practice='Primary processing includes withering, rolling, oxidation and drying. Refining includes screening, cutting, winnowing, sorting, refiring and blending. The finished leaves are tightly formed, fine and lustrous dark in colour, with a red infusion.')
section(21,
 history='The Ming agricultural work Nongzheng Quanshu records leaf tea from Luan. Luan Guapian became a tribute tea in the Qing dynasty, when production was concentrated around Mabu in Luan.',
 cultural_value='The production area includes Dushan, Huangjianhe and Tongxinsi in Yuan District, Luan. Local tea-making traditions continue in these communities.')
section(22,
 history='Tea production in the Dongting hills of Suzhou is recorded in the Tang-dynasty Classic of Tea. Northern Song local writings also mention Dongting tea.',
 practice='The craft includes picking, sorting, spreading, high-temperature fixation, rolling and shaping, rubbing into clusters to reveal fine hairs, and gentle drying. Rolling and heating are combined in the pan to form fine, curled leaves.')
section(23,
 practice='The leaves are picked, spread, heat-fixed, rolled, initially fired, shaped, fully dried, refined, baked and packed. Shaping combines rubbing, grasping and alignment. Screening separates leaves by thickness, length and weight.',
 cultural_value='The Sun Yat-sen Mausoleum and Yuhuatai scenic areas are core locations for this craft. Special bamboo drying baskets, hand-screening and final aroma-developing drying contribute to the local needle-shaped green tea.')
section(24,
 practice='Fuchun refreshments are made by traditional hand methods, with attention to shape and the flavours of different varieties. Tea preparation and pastry making together constitute the craft.',
 cultural_value='Fuchun Tea House brings together flowers, tea, pastries and dishes. Its Kuilongzhu blend combines Longjing, Kuizhen and Zhulan teas, bringing together taste, colour and aroma.')
section(25,
 practice='Makers use a steaming stove and a heated drying table. The six core techniques are steaming, fanning, shaking, rolling, scooping and shaping. After steaming, fanning removes heat and moisture. Tossing, rolling, scooping during a second drying stage, and shaping and polishing follow. Final firing develops aroma before the tea is sorted.',
 cultural_value='The craft is practised mainly in Bajiao Dong Township and around Wufeng Mountain in Enshi. Steam fixation and needle-like shaping are distinctive features.',
 inheritance='Enshi Yulu is passed on through families and apprenticeships. Makers learn steaming, firing and hand-shaping through practical production.')
section(26,
 practice='Qingzhuan, or green brick tea, uses leaf material that undergoes primary processing, pile fermentation, ageing, pressing and drying. Mizhuan, or rice brick tea, uses black-tea fragments, which are screened and winnowed, steamed, compressed, dried and packed.',
 history='Zhaoliqiao brick tea developed from Yangloudong brick tea in Chibi, commonly called Dong tea. During the Qing dynasty, local factories gradually shifted from Maohe tea to rectangular tea bricks.',
 inheritance='Teachers pass the techniques to apprentices. Dedicated teaching centres also support their transmission.')
section(27,
 practice='Primary processing includes picking and pan-heating. Pile fermentation involves managing moisture and ventilation. Refining screens and grades the tea; blending includes infusion-based assessment. Steaming and compression shape the tea before drying and packing. Large fermentation piles with internal ventilation channels are characteristic techniques.',
 cultural_value='The craft originated in Xianning, Hubei, and spread to Yichang and surrounding areas. Green brick tea production is linked to trade along the Great Tea Road.')
section(28,
 history='During the Qing dynasty, Anhua tea traders compressed and bound dark tea into cylinders for transport. The columns developed from a hundred liang to a thousand liang in weight, giving Qianliang tea its name.',
 practice='Primary dark-tea processing includes fixation, rolling, pile fermentation, rerolling and baking. Further processing includes screening, blending, softening, basket loading, compacting, hoop binding, closing, cooling and drying. The loose material gradually becomes a compressed tea column.')
section(29,
 practice='Primary-processed dark tea undergoes piling, fermentation, pressing into shape and the stage known as flowering to become Fuzhuan brick tea. Flowering is a distinctive part of this craft.',
 cultural_value='Fuzhuan tea production is associated with Yiyang, Hunan. The tea is also part of traditional tea-drinking life in northwestern China.')
section(30,
 practice='Processing includes spreading, fixation, cooling, initial baking, first wrapping, rebaking, second wrapping, final firing and selection. The two wrapping stages produce the characteristic double yellowing process. The finished buds are golden, needle-like and covered with fine pale hairs.',
 cultural_value='The craft is practised mainly on Junshan Island, in Xushi and in other parts of Yueyang. Growing, making and tasting tea are linked to local life.',
 inheritance='Families and apprenticeships transmit the craft. Work in tea gardens, training and tea-related activities also provide opportunities to learn.')
section(31,
 practice='Tea, glutinous rice, sesame, soybeans, peanuts and other ingredients are placed in a grinding bowl. A pestle pounds and rotates along its grooved inner wall to form a paste. After hot water is added, the drink may be served with puffed rice, peanuts and rice snacks as a lei cha meal.',
 cultural_value='The craft is practised in Quannan, Ganxian, Xingguo, Yudu and other parts of Jiangxi. Preparing and sharing lei cha is part of everyday Hakka family life.')
section(32,
 practice='The stages include picking, spreading, fixation, rolling, loosening clumps, initial drying, shaping and final aroma-developing drying. After initial drying, the tea is further dried and shaped, then combined in a pan for prolonged low-temperature processing.',
 cultural_value='The Tang-dynasty Classic of Tea records tea from the valleys of Wuyuan. The craft is linked to the lives of mountain tea farmers and is transmitted through families and communities.')
section(33,
 practice='Primary processing includes withering, rolling, oxidation and drying. Refining includes screening, sorting, refiring, blending and packing. Selected and graded raw materials are processed into tightly formed tea leaves.',
 history='Ninghong tea making originated late in the Qianlong reign of the Qing dynasty and developed during the Daoguang and Guangxu reigns. Overseas sales began in the mid-nineteenth century.',
 cultural_value='Tea-picking songs, tea-picking opera, poetry and tasting activities developed alongside Ninghong production and form part of local culture in Xiushui.',
 inheritance='The craft is transmitted through families, apprenticeships and the wider community. Producers also undertake activities such as protecting tea varieties and training practitioners.')
section(34,
 cultural_value='Herbal-tea shops have long been part of food and drink culture in Guangdong, Hong Kong and Macao. Utensils, shops, photographs and historical documents preserve memories of this tradition.',
 inheritance='Preparation skills are transmitted mainly through families, together with recipes and specialist vocabulary. Different brands and recipes form a diverse local tradition.')
section(35,
 practice='A clay stove provides heat, a pottery kettle boils water, a teapot holds and brews the leaves, and cups receive the infusion. Other actions include warming vessels, pouring water from a raised kettle, skimming foam, pouring hot water over the lid, warming and rolling the cups, and pouring tea from a low height.',
 cultural_value='Offering tea, appreciating its aroma and taking small sips connect tea preparation with hospitality. These are everyday rituals within Chaozhou tea culture.')
section(36,
 history='Zhang Changyi opened the Zhang Yiyuan tea shop in the late Qing dynasty to make and sell jasmine tea. Its traditional jasmine-tea processing methods were revived in 1992.',
 practice='The base is spring-picked, baked green tea from Fujian. Its primary processing includes withering, fixation, rolling and baking.',
 cultural_value='Zhang Yiyuan scented tea is associated with old Beijing theatres, bathhouses and other everyday settings, linking tea shops to urban tea-drinking life.')
section(37,
 history='Founded in 1887, Wu Yutai developed a tradition of selecting, scenting and blending its own tea.',
 practice='Processing includes preparing the tea base, selecting and tending fresh flowers, preliminary magnolia scenting, mixing and scenting, aeration to release heat, separating flowers, baking, blending and packing. The craft uses spring tea and techniques such as slow, low-temperature baking.')
section(38,
 practice='Nanlu border tea processing includes fermentation, natural drying, pressing and packing. Its infusion can be mixed with butter, salt and other ingredients to make butter tea.',
 cultural_value='Also known by names such as Wucha, Bianxiao tea and Ya tea, it has traditionally been supplied from Yaan to Tibet, Qinghai, and Garze and Aba in Sichuan.')
section(39,
 practice='Makers adjust processing to the season, time since picking and moisture in the buds and leaves, using movements such as lifting, tossing, pulling, pressing, scattering, pushing and rolling. A fire specialist manages the pan temperature in cooperation with the tea maker.',
 cultural_value='Mengshan, also known as Mengding Mountain, lies in Mingshan District, Yaan, Sichuan. Tribute tea, tea tasting, ritual offerings and tea-horse trade are also linked to local tea culture.',
 inheritance='Masters teach apprentices through oral explanation and practical production.')
section(40,
 practice='After fixation and rolling, the leaves undergo initial steaming, piling and steaming again, followed by baking, airing and ageing. The heat and moisture of steaming and piling bring changes in colour, aroma and taste.',
 history='The 1874 Cangwu County Gazetteer records tea production in Liubao. Masters and families transmit the craft in factories and household workshops.')
section(41,
 practice='Tea, ginger, garlic and other ingredients are repeatedly pounded in an iron pan before hot water is added for simmering. This is known as beating oil tea. The drink can be served with puffed rice, glutinous rice cakes, peanuts and other foods.',
 cultural_value='The custom is practised mainly in Gongcheng and surrounding Yao communities in Guangxi, and also in Yao communities in Hunan and Guangdong. Tea rituals accompany first-month celebrations for babies, weddings, birthdays, festivals and hospitality. Exchanges with Zhuang, Han and other communities have made it a shared custom.',
 inheritance='Families and communities pass on the custom. Village elders teach younger people the conventions and knowledge associated with tea.')
section(42,
 practice='Picked leaves are spread out, then heat-fixed, shaped and rolled in an initial pan. They move to a finishing pan for tossing and shaping, followed by baking and cooling. Tea-making brushes and hand movements in the finishing pan help determine the shape.',
 history='In 1926, local tea farmers improved tossing and shaping in the finishing pan and the use of a large tea-making brush. These skills spread through the Xinyang tea-growing area.',
 cultural_value='The craft is practised mainly in Shihe, Pingqiao and other tea-growing parts of Xinyang. It is connected to the work and everyday lives of local tea farmers.')
section(43,
 practice='Processing includes blending and piling, boiling a concentrated tea liquor, heating the leaves with this liquor, preparing and filling wrappers, compacting in a mould, tying and piercing the wrapping, and natural flowering. Tea is packed firmly into a mould, wrapped and bound before the flowering stage.',
 cultural_value='The craft is practised mainly in Jingyang and Qindu in Xianyang, Shaanxi. Tea-pressing moulds and related tools are associated with local Fu tea production.',
 inheritance='The craft continues through apprenticeships, family transmission and institutional training. Heritage exhibition centres also present and share it.')
section(44,
 practice='Picked buds and leaves are spread thinly, heat-fixed and rolled. Clusters of leaves are rubbed and rotated between the palms to bring out fine hairs, then baked dry. Makers adjust hand movements and heat to leaf quality and moisture.',
 cultural_value='The craft is practised in Duyun, Guizhou, and is connected to the lives of Bouyei, Miao, Shui and other communities in Qiannan.',
 inheritance='Transmission is mainly within families, with teacher-apprentice relationships also playing a role.')
section(45,
 cultural_value='Hong Kong shares Lingnan herbal-tea culture with Guangdong and Macao. Tea shops, utensils and historical records preserve memories of urban food and drink traditions.',
 inheritance='Recipes, specialist terms and preparation skills are passed down in families. Shops are important everyday settings for this tradition.')
section(46,
 cultural_value='Macao, Guangdong and Hong Kong share a region of herbal-tea culture. Tea shops, utensils and historical records offer ways to explore this food and drink tradition.',
 inheritance='Preparation skills are transmitted mainly through families, with recipes and specialist terms passed between generations.')

# Content order is checked against stable unit IDs by the application script.
EXPERIENCES = {
1: ('Could the name lead you astray? Make a guess, then turn over the cards for clues.', {
 'category': 'The word hong means red, but does not place this tea in the black-tea category. Dahongpao is a Wuyi rock tea and belongs to the oolong family.',
 'craft': 'Combined withering methods, repeated shaking and resting, two rounds of pan-heating and rolling, and prolonged low-temperature roasting are key parts of Wuyi rock-tea making.',
 'context': 'Mountain-calling ceremonies, tea competitions and tea preparation are also part of tea life in Wuyishan, connecting the craft to local life.'}),
4: ('Choose the two core processes, then discover how fresh leaves become white tea.', {
 'core': 'Withering and drying are the core processes in primary Fuding white-tea making. The leaves are neither pan-fried nor rolled.',
 'scope': 'Fresh leaves undergo withering, piling, drying and sorting to become unfinished tea.',
 'refine': 'The unfinished tea is further hand-sorted, blended, baked and packed to produce refined tea.'}),
6: ('Follow the names to see how the craft was passed on. This is one branch of its teaching history.', {
 'liu': 'In the late Qing dynasty, Liu Yongfa introduced Shuixian tea plants from Shuiji in Jianou. He combined northern Fujian methods with local tea making and taught Deng Guanjin.',
 'deng': 'Deng Guanjin, a Hakka practitioner, learned Shuixian tea making from Liu Yongfa and later taught Zhang Qisheng from southern Fujian.',
 'zhang': 'Zhang Qisheng learned Shuixian tea making from Deng Guanjin. Their teacher-apprentice connection also linked different regional communities.'}),
7: ('Follow four stages to see how a fresh tea leaf changes.', {
 'dh-01': 'Fresh leaves naturally lose moisture. Their stems and blades gradually soften, preparing them for further processing.',
 'dh-02': 'The softened leaves are rolled into strips. Some leaf cells are broken, preparing the leaves for oxidation.',
 'dh-03': 'Enzymes drive oxidation. The green leaves gradually develop reddish or yellowish tones.',
 'dh-04': 'Firing evaporates moisture to dry the tea and develop the sweet aroma of Dianhong.'}),
9: ('Make a choice, then turn over the two cards to compare.', {
 'u1': 'Blending combines different tea materials according to their characteristics, balancing their qualities.',
 'u2': 'Controlled post-fermentation is another key skill in Dayi tea making. It serves a different purpose from blending tea materials.'}),
11: ('Open each cup in turn to discover how the Bai welcome guests with tea.', {
 'sd-01': 'The leaves are roasted before water is added and the tea is offered to guests. This bitter first course represents the difficulties encountered in life.',
 'sd-02': 'Walnuts, brown sugar and other ingredients bring sweetness. Following the bitter first course, it represents sweetness after hardship.',
 'sd-03': 'Honey, Sichuan pepper, cinnamon and other ingredients combine sweetness, a gentle tingling sensation and bitterness, inviting reflection on life.'}),
12: ('One tea, two uses. How might sour tea appear at the table?', {
 'u1': 'The edible form is moist tea after fermentation. It can be cooked with other ingredients to make dishes.',
 'u2': 'The drinking form is made by further processing moist tea, including sun-drying, so that it can be brewed.'}),
17: ('Guess from the name, then open the cards to explore the leaves and the craft.', {
 'name': 'Anji white tea has pale leaves with green veins. Its name refers to this leaf-colour characteristic.',
 'process': 'After picking and spreading, the leaves undergo heat fixation and alignment, initial baking, cooling, further baking and final drying using ash as a moisture absorber.',
 'category': 'Anji white tea belongs to green-tea processing. Teas with similar names can have different processing methods and belong to different categories.'}),
18: ('Choose a process for each of the four actions, then select Check matches.', {
 'u1': 'Heating the leaves in the pan corresponds to fixation, the heat treatment that inactivates enzymes.',
 'u2': 'Gently rolling the leaves corresponds to the rolling stage.',
 'u3': 'Baking the unfinished tea corresponds to the initial firing stage.',
 'u4': 'Reheating under a round bamboo tray corresponds to final firing.'}),
25: ('Explore six core techniques, from steam fixation to needle-like shaping.', {
 'es-01': 'Hot steam inactivates enzymes, stopping enzymatic oxidation of tea polyphenols and removing the grassy smell.',
 'es-02': 'Steamed leaves are spread thinly and fanned to cool them and release moisture, preventing unwanted yellowing.',
 'es-03': 'Leaves are lifted, tossed and spread over a heated drying surface to help moisture evaporate.',
 'es-04': 'Circular and opposing rolling movements on the heated surface curl the leaves into strips.',
 'es-05': 'Scooping movements continue to remove moisture and shape the leaves as they are heated.',
 'es-06': 'Rubbing both above and against a supporting surface shapes and polishes the leaves into fine, straight needles. Final aroma-developing firing and sorting still follow.'}),
28: ('Explore the two production stages, then arrange four processing cards.', {
 'raw': 'Fresh leaves undergo fixation, rolling, pile fermentation, rerolling and baking to form the primary-processed dark tea used in the next stage.',
 'finishing': 'This tea is screened, blended and softened, then loaded into a basket, compacted, bound and closed. Cooling and drying follow as it becomes a tea column.',
 'load': 'The prepared tea material is loaded into a basket, ready for compacting.',
 'press': 'After loading, the tea is trodden and pressed tightly, turning loose material into a dense tea column.',
 'bind': 'After compacting, hoops are bound around the tea basket. Closing the opening comes next.',
 'close': 'The basket opening is secured after hoop binding, completing this group of loading and binding operations. Cooling and drying still follow.'}),
35: ('Select an object in the illustration, or use its name on the right to discover its role.', {
 'stove': 'The clay stove holds the fire that heats the water kettle. These two utensils work together to boil water.',
 'kettle': 'The pottery kettle is used to boil water. It is then lifted to pour hot water into the brewing teapot from above.',
 'pot': 'Oolong leaves and hot water go into the teapot. Foam is skimmed away and hot water is poured over the lid before the tea is served into cups from a low height.',
 'cup': 'Cups receive the infusion for drinking. Before serving, they are warmed and rolled in hot water.'}),
38: ('Make a choice, then explore the connection between tea and the prepared drink.', {
 'u1': 'Nanlu border tea is a dark tea from Yaan, Sichuan, traditionally supplied to Tibet, Qinghai and Tibetan areas of western Sichuan.',
 'u2': 'Its infusion can be mixed with butter, salt and other ingredients to prepare butter tea. The tea material thus becomes part of a different drink.'})
}
