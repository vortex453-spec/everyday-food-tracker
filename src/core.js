(function(root){
// kcal per unit. unit: g|mL|count. kcal=null => pending (not counted, flagged)
const KJ=4.184;
const FOODS=[
 {id:'pb',aliases:['peanut butter', 'spread'],q:'orange',qr:'Nutrient-dense (protein, healthy fats) but calorie-dense',ref:35,refLabel:'35 g (app default)',name:'Peanut butter',unit:'g',per:100,kcal:662,def:35,src:'Label: 662 kcal/100 g'},
 {id:'butter',aliases:['butter', 'spread'],q:'red',qr:'High in saturated fat; best as an occasional/small amount',ref:10,refLabel:'10 g (app convention)',name:'Butter',unit:'g',per:100,kcal:718,def:10,src:'Label: 718 kcal/100 g'},
 {id:'cheese',aliases:['cheese', 'slice'],q:'orange',qr:'Protein and calcium; salty, saturated fat',ref:2,refLabel:'2 slices (app convention)',name:'Cheese slice',unit:'count',per:1,kcal:70,def:2,src:'Label: ~70 kcal per ~17 g slice (≈401 kcal/100 g; 2 slices = 140 by label rounding, ≈136 by per-100 g)'},
 {id:'bread',aliases:['bread', 'toast', 'multigrain', 'laucke'],q:null,qr:'Not rated — multigrain grain food; fibre, salt and sugar details not recorded here',ref:1,refLabel:'1 slice (62 g)',name:'Multigrain bread (62 g slice)',unit:'count',per:1,kcal:1012/KJ*0.62,def:1,est:true,src:'ESTIMATE: Laucke multigrain baked bread label 1012 kJ/100 g × your measured 62 g slice (9 slices from a 400 g mix) ≈ 150 kcal/slice. Varies with moisture and recipe.'},
 {id:'coco',aliases:['coconut water', 'chocolate', 'drink'],q:'orange',qr:'Flavoured drink with added sugar',ref:250,refLabel:'250 mL (label serving)',name:'Chocolate coconut water',unit:'mL',per:250,kcal:69,def:375,src:'Label: 69 kcal/250 mL'},
 {id:'biscuit',aliases:['biscuit', 'cookie'],q:'red',qr:'Sweet biscuit; added sugar, refined flour',ref:2,refLabel:'2 biscuits (app convention)',name:'Biscuits (whole, 18 g)',unit:'count',per:1,kcal:88,def:2,src:'Label: 88 kcal per biscuit'},
 {id:'shake',aliases:['shake', 'optislim', 'meal replacement'],q:'orange',qr:'Meal replacement: 17.1 g protein per sachet, but 13.3 g sugar and low fibre (0.9 g); follow pack directions',ref:1,refLabel:'1 serve (label)',name:'Optislim shake (with water)',unit:'count',per:1,kcal:161,def:1,src:'Label: 161 kcal (675 kJ) per 43 g sachet made with 250 mL water (not milk); protein 17.1 g, sugar 13.3 g, fibre 0.9 g, sodium 338 mg. One sachet is not a full day of nutrition; pack directions apply.'},
 {id:'electro',aliases:['electrolyte', 'sports drink', 'drink'],q:'orange',qr:'Contains added sugar',ref:250,refLabel:'250 mL (label serving)',name:'Morning electrolyte drink',unit:'mL',per:250,kcal:45,def:200,src:'Label: 45 kcal/250 mL prepared per directions'},
 {id:'coffee',aliases:['coffee', 'milk', 'sugar'],q:'orange',qr:'Milk adds some protein; 2 tsp added sugar',ref:1,refLabel:'1 cup',name:'Coffee (2 tsp sugar + 75 mL milk)',unit:'count',per:1,kcal:78.5,def:1,src:'Estimate: sugar 2 level tsp ≈8 g = 32 kcal (estimated) + 75 mL lactose-free full cream milk @62/100 mL = 46.5. Brewed coffee negligible; 14 g grounds not eaten.'},
 {id:'chips',aliases:['chips', 'crisps', 'potato', 'smiths'],q:'red',qr:'Fried, salty, calorie-dense snack',ref:50,refLabel:'50 g (app convention)',name:"Smith's Original chips",unit:'g',per:100,kcal:2290/KJ,def:50,src:'Label: 2290 kJ/100 g ≈ 547.3 kcal/100 g'},
 {id:'cucumber',aliases:['cucumber', 'salad', 'vegetable'],q:'green',qr:'Raw vegetable; water and fibre',ref:100,refLabel:'100 g (app convention)',name:'Baby cucumbers (raw)',unit:'g',per:100,kcal:15,def:100,est:true,src:'APPROXIMATE ESTIMATE only (~15 kcal/100 g raw). Not from the pack label and not from a verified source.'},
 {id:'greens',aliases:['vegetables', 'veg', 'broccoli', 'brussels sprouts', 'bok choy', 'greens'],q:'green',qr:'Vegetables; fibre, vitamins (butter counted separately)',ref:370,refLabel:'370 g raw (your usual)',name:'Green veg mix, weighed RAW (broccoli/Brussels/bok choy)',unit:'g',per:100,kcal:30,def:370,est:true,src:'APPROXIMATE ESTIMATE only (~30 kcal/100 g, weighed raw before cooking, no butter/oil). Not from a label or verified source; actual mix varies. Butter is added separately.'},
 {id:'salt',aliases:['salt'],q:null,qr:'Not rated — keep sprinkles small; not graded by amount',ref:null,refLabel:null,name:'Salt (sprinkle)',unit:'count',per:1,kcal:0,def:1,src:'0 kcal'},
 {id:'ham',aliases:['ham', 'meat', 'deli'],q:'red',qr:'Processed meat; salty',ref:50,refLabel:'50 g (label serving)',name:'Ham',unit:'g',per:100,kcal:478/KJ,def:50,src:'Label: 478 kJ/100 g (239 kJ/50 g). Default = label serving; adjust.'},
 {id:'salmon',aliases:['salmon', 'fish', 'smoked'],q:'orange',qr:'Protein and omega-3s; salty',ref:50,refLabel:'50 g (label serving)',name:'Smoked salmon',unit:'g',per:100,kcal:688/KJ,def:50,src:'Label: 688 kJ/100 g. Default = label serving; adjust.'},
 {id:'beer',aliases:['beer', 'alcohol', 'hahn'],q:'red',qr:'Alcohol — occasional choice',ref:1,refLabel:'1 bottle 330 mL (label)',name:'Hahn Super Dry beer (330 mL)',unit:'count',per:1,kcal:99,def:1,src:'Label: 99 kcal per 330 mL'},
 {id:'fish',aliases:['fish', 'tin', 'canned'],q:null,qr:'Protein source; confirm fish type and preparation before rating.',ref:1,refLabel:'1 tin 95 g (label)',name:'Canned fish (pictured tin, 95 g)',unit:'count',per:1,kcal:121,def:1,src:'Label: 121 kcal per 95 g tin. Default = label serving; adjust.'},
 {id:'icecream',aliases:['ice cream', 'dessert'],q:'red',qr:'Dessert; added sugar, saturated fat',ref:56,refLabel:'56 g ≈100 mL (label serving)',name:'Hokey pokey ice cream',unit:'g',per:100,kcal:238,def:56,src:'Label: 238 kcal/100 g; 100 mL ≈ 56 g. Default = label serving; adjust.'},
 {id:'noodles',aliases:['noodles', 'instant', 'cup'],q:'red',qr:'Instant noodles; refined, usually salty',ref:1,refLabel:'1 cup (label)',name:'Noodle cup (prepared)',unit:'count',per:1,kcal:347,def:1,src:'Label: 347 kcal per prepared cup'},
 {id:'honey',aliases:['honey', 'chilli'],q:'red',qr:'Mostly sugar',ref:15,refLabel:'15 g (label serving)',name:'Chilli honey',unit:'g',per:15,kcal:50,def:15,src:'Label: 50 kcal/15 g. Default = label serving; adjust.'},
 {id:'frank',aliases:['frankfurt', 'hot dog', 'sausage'],q:'red',qr:'Processed meat; salty',ref:1,refLabel:'1 frankfurt (label serving)',name:'Frankfurt (~63 g each)',unit:'count',per:1,kcal:448/KJ,def:1,src:'Label: 713 kJ/100 g, serving ≈63 g = 448 kJ. Provisional default; adjust.'},
 {id:'energy',aliases:['energy drink', 'drink', 'caffeine'],q:'red',qr:'High added sugar (27 g/can) and caffeine',ref:1,refLabel:'1 can 250 mL (label)',name:'Energy drink (250 mL can)',unit:'count',per:1,kcal:117,def:1,src:'Label: 117 kcal per can'},
 {id:'marshmallow',aliases:['marshmallow','marshmallows','lolly','lollies','sweets'],q:'red',qr:'Mostly sugar (10.5 g per piece)',ref:1,refLabel:'1 piece ≈17 g (label serving)',name:'Marshmallow (piece ≈17 g)',unit:'count',per:1,kcal:252/KJ,def:1,src:'Label: 252 kJ (≈60 kcal) and 10.5 g sugar per ≈17 g serving (about 1 piece); 1480 kJ/100 g. Transcribed from your label photo.'},
 {id:'wings',aliases:['chicken','wing','wings','wingdings','wing dings','hot honey'],q:'orange',qr:'Good protein (15.2 g/100 g); flour-coated, salty (459 mg sodium/100 g) and fatty (16.3 g/100 g)',ref:130,refLabel:'130 g edible (label serving)',name:'Hot honey chicken wing dings (edible g)',unit:'g',per:100,kcal:1010/KJ,def:200,src:'Label: 1010 kJ/100 g (130 g serve = 1310 kJ), based on EDIBLE PORTION ONLY — weigh/enter meat without bones. Default 200 g edible is your usual amount (not the label serve).'},
 {id:'pizza',aliases:['pizza','pepperoni'],q:'red',qr:'Processed meat (pepperoni), refined base; full nutrition not recorded',ref:2,refLabel:'2 slices (app convention, not a medical limit)',name:'Pepperoni pizza (slice)',unit:'count',per:1,kcal:540/KJ,def:1,src:'User-supplied: 4320 kJ per whole pizza of 8 slices (540 kJ ≈ 129 kcal per slice). No brand, weight or other nutrients supplied.'},
 {id:'beefpie',aliases:['pie','beef pie','meat pie','coles pie'],q:'red',qr:'Pastry pie: high saturated fat (12.3 g) plus trans fat (1.1 g), refined pastry, salty (609 mg sodium per pie); low protein for the calories',ref:1,refLabel:'1 pie ≈175 g (label serving)',name:'Coles beef pie (pie ≈175 g)',unit:'count',per:1,kcal:420,def:1,src:'Label: 1760 kJ (420 Cal) per pie ≈175 g; protein 13.1 g, fat 23.6 g (sat 12.3 g, trans 1.1 g), carbs 37.6 g, sugars 1.9 g, fibre 2.3 g, sodium 609 mg. Per 100 g: 1000 kJ (240 Cal).'},
 {id:'mixedveg',aliases:['veg','vegies','veggies','vegetables','mixed vegetables','frozen vegetables','peas','beans','green beans','broccoli'],q:'green',qr:'Vegetables: high fibre (4.2 g/100 g), low fat, very low sodium, good vitamin C',ref:150,refLabel:'150 g (app convention, 2× label 75 g serve)',name:'Coles green mixed vegetables (frozen peas, green beans, broccoli)',unit:'g',per:100,kcal:215/KJ,def:75,src:'Label: 215 kJ (51 Cal)/100 g; 161 kJ (39 Cal) per 75 g serve. Protein 4.3 g, carbs 4.4 g, sugars 2.5 g, fibre 4.2 g, sodium 16 mg, vitamin C 46 mg per 100 g.'},
 {id:'brussels',aliases:['brussels','brussels sprouts','sprouts','veg','vegies','veggies','vegetables','frozen vegetables'],q:'green',qr:'Vegetable: good fibre (3.8 g/100 g), almost no fat, very low sodium, good vitamin C',ref:150,refLabel:'150 g (app convention, 2× label 75 g serve)',name:'Coles frozen Brussels sprouts',unit:'g',per:100,kcal:193/KJ,def:75,src:'Label: Brussels sprouts (100%). 193 kJ (46 Cal)/100 g; 145 kJ (35 Cal) per 75 g serve. Protein 3.6 g, carbs 4.9 g, sugars 2.7 g, fibre 3.8 g, sodium 6 mg, vitamin C 45 mg per 100 g.'},
 {id:'sausage',aliases:['sausage','sausages','snags','bbq sausages','pork sausages'],q:'red',qr:'Processed meat: good protein (10.4 g each) but salty (346 mg sodium each), contains sulphite preservative, moderate saturated fat',ref:2,refLabel:'2 sausages (app convention, not a medical limit)',name:'Coles pork BBQ sausages (sausage ≈70 g)',unit:'count',per:1,kcal:118,def:3,src:'Label: 491 kJ (118 Cal) per sausage ≈70 g; protein 10.4 g, fat 8.1 g (sat 3.0 g), sodium 346 mg. Per 100 g: 702 kJ (168 Cal). Gluten not detected; contains sulphites. Default 3 sausages is your usual amount (not the 2-sausage reference portion).'},
 {id:'cocoapuffs',aliases:['cereal','cocoa puffs','puffs','protein cereal','breakfast cereal','coco pops'],q:'orange',qr:'Protein cereal: high protein (14.5 g per serve) but 7.9 g sugar per serve and refined grains; milk not included',ref:45,refLabel:'45 g dry (label serving)',name:'Coles High Protein Cocoa Puffs (dry)',unit:'g',per:100,kcal:391,def:45,src:'Label (dry cereal): 1640 kJ (391 Cal)/100 g; 736 kJ (176 Cal) per 45 g serve. Protein 14.5 g, sugars 7.9 g, fibre 2.4 g, sodium 74 mg per 45 g. Milk is not included (label: +125 mL skim milk = 223 Cal total).'},
 {id:'rissoles',aliases:['rissoles', 'beef', 'mince', 'patty'],q:null,qr:'Not rated — recipe pending',ref:1,refLabel:'1 rissole',name:'Beef rissoles',unit:'count',per:1,kcal:null,def:1,src:'PENDING: recipe and portion not yet supplied'},
 {id:'supps',aliases:['supplements', 'nac', 'carnitine'],q:null,qr:'Not rated — note only',ref:null,refLabel:null,name:'Supplements note (NAC, acetyl-L-carnitine)',unit:'count',per:1,kcal:null,def:1,src:'Note only — calories unconfirmed (not assumed zero).'}
];
const PRESETS={
 morningTea:[],afternoonTea:[],
 breakfast:[
  {name:'Peanut butter toast',items:[['bread',1],['butter',10],['pb',35]]},
  {name:'Cheese toast',items:[['bread',1],['butter',10],['cheese',2]]},
  {name:'Shake',items:[['shake',1]]}],
 lunch:[
  {name:'Coconut water + 2 biscuits',items:[['coco',375],['biscuit',2]]},
  {name:'Coconut water + 3 biscuits',items:[['coco',375],['biscuit',3]]},
  {name:'Beef rissoles (pending)',items:[['rissoles',1]]}],
 dinner:[
  {name:'Shake + 370 g greens + 20 g butter',items:[['shake',1],['greens',370],['butter',20],['salt',1]]}],
 snack:[
  {name:'Chips 50 g',items:[['chips',50]]},
  {name:'Chips 100 g',items:[['chips',100]]},
  {name:'Energy drink',items:[['energy',1]]}]
};
const MEALS=['breakfast','morningTea','lunch','afternoonTea','dinner','snack'];
const MEAL_LABEL={breakfast:'Breakfast',morningTea:'Morning tea',lunch:'Lunch',afternoonTea:'Afternoon tea',dinner:'Dinner',snack:'Snacks'};
const byId=id=>FOODS.find(f=>f.id===id);
function validAmount(a){a=Number(a);return Number.isFinite(a)&&a>0&&a<=5000;}
function itemKcal(it){const f=byId(it.food);if(!f||f.kcal==null)return null;return f.kcal*Number(it.amount)/f.per;}
function makeItem(food,amount,uid){const f=byId(food);if(!f)throw Error('unknown food');if(amount==null)amount=f.def;if(!validAmount(amount))throw Error('invalid amount');return{uid:uid||Math.random().toString(36).slice(2),food,amount:Number(amount)};}
function applyPreset(day,meal,idx){const p=PRESETS[meal][idx];p.items.forEach(([f,a])=>day[meal].push(makeItem(f,a)));return day;}
function emptyDay(){const d={};MEALS.forEach(m=>d[m]=[]);return d;}
function totals(day){let total=0,pending=0;const per={};MEALS.forEach(m=>{per[m]=0;(day[m]||[]).forEach(it=>{const k=itemKcal(it);if(k==null)pending++;else{per[m]+=k;total+=k;}});});return{total,pending,per};}
function dateKey(d){d=d||new Date();const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
function shiftDate(key,n){const[y,m,d]=key.split('-').map(Number);return dateKey(new Date(y,m-1,d+n));}
const DEFAULT_SETTINGS={target:2000,height:null,baseWeight:null,waist:null,gut:null};
const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;
function validDate(k){if(typeof k!=='string'||!DATE_RE.test(k))return false;const[y,m,d]=k.split('-').map(Number);const t=new Date(y,m-1,d);return t.getFullYear()===y&&t.getMonth()===m-1&&t.getDate()===d;}
function num(v,lo,hi){if(v===null||v===''||typeof v==='boolean')return null;v=Number(v);return Number.isFinite(v)&&v>=lo&&v<=hi?v:null;}
function normalize(s){const out={settings:Object.assign({},DEFAULT_SETTINGS),days:{},weights:{},overrides:{},combos:emptyCombos(),favs:emptyCombos()};if(!s||typeof s!=='object'||Array.isArray(s))return out;
 const st=(s.settings&&typeof s.settings==='object')?s.settings:{};out.settings.target=num(st.target,800,6000)??2000;
 out.settings.height=num(st.height,50,250);out.settings.baseWeight=num(st.baseWeight,20,400);out.settings.waist=num(st.waist,30,300);out.settings.gut=num(st.gut,30,300);
 if(s.days&&typeof s.days==='object'&&!Array.isArray(s.days))for(const k of Object.keys(s.days)){if(!validDate(k))continue;const d=s.days[k];if(!d||typeof d!=='object')continue;const nd=emptyDay();
  MEALS.forEach(m=>{if(Array.isArray(d[m]))d[m].forEach(it=>{if(it&&typeof it==='object'&&byId(it.food)&&validAmount(it.amount))nd[m].push({uid:typeof it.uid==='string'&&it.uid?it.uid.slice(0,40):Math.random().toString(36).slice(2),food:it.food,amount:Number(it.amount)});});});out.days[k]=nd;}
 if(s.weights&&typeof s.weights==='object'&&!Array.isArray(s.weights))for(const k of Object.keys(s.weights)){const w=num(s.weights[k],20,400);if(validDate(k)&&w!=null)out.weights[k]=w;}
 if(s.overrides&&typeof s.overrides==='object'&&!Array.isArray(s.overrides))for(const k of Object.keys(s.overrides)){if(!byId(k))continue;const c=cleanOverride(s.overrides[k]);if(c)out.overrides[k]=c;}
 out.combos=cleanCombos(s.combos);
 const legacy=cleanUsual(s.usual&&s.usual.breakfast);if(legacy.length&&!out.combos.breakfast.some(c=>c.id==='legacy-usual'))out.combos.breakfast.unshift({id:'legacy-usual',name:'My usual breakfast',items:legacy});
 out.favs=emptyCombos();
 if(s.favs&&typeof s.favs==='object'&&!Array.isArray(s.favs))MEALS.forEach(m=>out.favs[m]=cleanUsual(s.favs[m]));
 else MEALS.forEach(m=>out.favs[m]=favsFromCombos(out.combos[m]));
 return out;}
function loadState(storage){try{return normalize(JSON.parse(storage.getItem('dft_v1')));}catch(e){return normalize(null);}}
function saveState(storage,st){storage.setItem('dft_v1',JSON.stringify(st));}
function importBackup(text){let s;try{s=JSON.parse(text);}catch(e){throw Error('Not a valid backup file');}if(!s||typeof s!=='object'||!s.days||typeof s.days!=='object'||Array.isArray(s.days))throw Error('Not a valid backup file');return normalize(s);}
const QUALITY={green:'Choose more often',orange:'Consider portion & frequency',red:'Occasional choice'};
function quality(f){return f.q?{level:f.q,label:QUALITY[f.q],reason:f.qr}:{level:null,label:'Not rated',reason:f.qr};}
// Portion: entered amount vs the food's REFERENCE serving (app convention, not a limit). <=1x green, <=2x orange, >2x red.
function portion(it){const f=byId(it.food);if(!f||!f.ref)return{level:null,label:'Portion not graded',ratio:null,reason:'No reference serving'};
 const r=Number(it.amount)/f.ref;const level=r<=1?'green':r<=2?'orange':'red';
 const label=level==='green'?'Within reference portion':level==='orange'?'Larger portion':'Much larger portion';
 const k=itemKcal(it),rk=f.kcal==null?null:f.kcal*f.ref/f.per;
 let reason=(Math.round(r*100)/100)+'× reference ('+f.refLabel+')';if(k!=null&&r>1)reason+=', +'+Math.round(k-rk)+' kcal vs reference';return{level,label,ratio:r,reason};}
function rowClass(it){return 'item row-'+(portion(it).level||'none');}
function norm(t){return String(t||'').toLowerCase().replace(/\s+/g,' ').trim();}
let OV={};function setOverrides(o){OV=o||{};}
function displayName(f){const o=OV[f.id];return o&&o.name?o.name:f.name;}
function allAliases(f){const o=OV[f.id];return (o&&Array.isArray(o.aliases)?o.aliases:[]).concat(f.aliases||[]);}
function searchFoods(q,list){list=list||FOODS;const toks=norm(q).split(' ').filter(Boolean);if(!toks.length)return list.slice();
 return list.filter(f=>{const n=norm([f.name,displayName(f)].concat(allAliases(f)).join(' | '));return toks.every(t=>n.includes(t));});}
function cleanOverride(o){if(!o||typeof o!=='object')return null;const name=typeof o.name==='string'?o.name.replace(/\s+/g,' ').trim().slice(0,80):'';
 const al=(Array.isArray(o.aliases)?o.aliases:typeof o.aliases==='string'?o.aliases.split(','):[]).filter(x=>typeof x==='string').map(x=>x.replace(/\s+/g,' ').trim().slice(0,40)).filter(Boolean).slice(0,20);
 if(!name&&!al.length)return null;const r={};if(name)r.name=name;if(al.length)r.aliases=al;return r;}
function cleanUsual(a){const seen={},out=[];if(!Array.isArray(a))return out;a.forEach(x=>{if(x&&typeof x==='object'&&byId(x.food)&&validAmount(x.amount)&&!seen[x.food]){seen[x.food]=1;out.push({food:x.food,amount:Number(x.amount)});}});return out;}
function usualItems(usual){return cleanUsual(usual).map(x=>makeItem(x.food,x.amount));}
// true if every usual food/amount is already present in this meal (duplicate guard)
function usualAlreadyAdded(mealRows,usual){usual=cleanUsual(usual);if(!usual.length)return false;const pool=(mealRows||[]).slice();
 return usual.every(u=>{const i=pool.findIndex(r=>r.food===u.food&&Number(r.amount)===u.amount);if(i<0)return false;pool.splice(i,1);return true;});}
function emptyCombos(){const c={};MEALS.forEach(m=>c[m]=[]);return c;}
function defaultComboName(m){return 'My usual '+MEAL_LABEL[m].toLowerCase();}
function cleanName(n,fb){n=typeof n==='string'?n.replace(/\s+/g,' ').trim().slice(0,60):'';return n||fb;}
const ID_RE=/^[A-Za-z0-9_-]{1,40}$/;
function newId(){return 'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function cleanCombos(src){const out=emptyCombos();if(!src||typeof src!=='object'||Array.isArray(src))return out;
 MEALS.forEach(m=>{const seen={};if(!Array.isArray(src[m]))return;src[m].forEach(c=>{if(!c||typeof c!=='object'||typeof c.id!=='string'||!ID_RE.test(c.id)||seen[c.id])return;
  const items=cleanUsual(c.items);if(!items.length)return;seen[c.id]=1;if(out[m].length<50)out[m].push({id:c.id,name:cleanName(c.name,defaultComboName(m)),items});});});return out;}
// save (create or update by id) — never touches diary
function saveCombo(combos,m,id,name,items){if(!MEALS.includes(m))throw Error('bad meal');items=cleanUsual(items);if(!items.length)throw Error('Tick at least one food');
 const list=combos[m];const i=id?list.findIndex(c=>c.id===id):-1;const c={id:i>=0?id:newId(),name:cleanName(name,defaultComboName(m)),items};if(i>=0)list[i]=c;else list.push(c);return c;}
function deleteCombo(combos,m,id){const i=combos[m].findIndex(c=>c.id===id);if(i>=0)combos[m].splice(i,1);return i>=0;}
function presetAsItems(m,i){return PRESETS[m][i].items.map(([food,amount])=>({food,amount}));}
// Migration: union of foods from all old saved combos for that meal, in stored order; first occurrence's amount wins. Preset meals are never preselected.
function favsFromCombos(list){return cleanUsual([].concat(...(list||[]).map(c=>c.items)));}
function setFavs(favs,m,items){if(!MEALS.includes(m))throw Error('bad meal');favs[m]=cleanUsual(items);return favs[m];}
function favItem(favs,m,food){const f=(favs[m]||[]).find(x=>x.food===food);return f?makeItem(f.food,f.amount):null;}
const api={favsFromCombos,setFavs,favItem,emptyCombos,defaultComboName,cleanCombos,saveCombo,deleteCombo,presetAsItems,MEAL_LABEL,cleanUsual,usualItems,usualAlreadyAdded,rowClass,setOverrides,displayName,allAliases,cleanOverride,QUALITY,quality,portion,norm,searchFoods,FOODS,PRESETS,MEALS,byId,validAmount,itemKcal,makeItem,applyPreset,emptyDay,totals,dateKey,shiftDate,loadState,saveState,importBackup,normalize,validDate,DEFAULT_SETTINGS};
if(typeof module!=='undefined')module.exports=api;else root.FT=api;
})(this);
