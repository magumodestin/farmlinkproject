const FARMLINK_CONTACT = { email: 'magumodestiny@gmail.com', phone: '+27718846311', whatsapp: '27718846311' };

function openWhatsApp(message){
  window.open('https://wa.me/' + FARMLINK_CONTACT.whatsapp + '?text=' + encodeURIComponent(message), '_blank');
}
const PRODUCTS = [
  {id:'maize', name:'Fresh Maize', price:35, unit:'kg', category:'Grains & Cereals', location:'Pretoria, Gauteng', stock:50, badge:'Best Seller'},
  {id:'maize-meal', name:'Maize Meal', price:34.99, unit:'2.5kg', category:'Grains & Cereals', location:'Gauteng', stock:80},
  {id:'brown-rice', name:'Brown Rice', price:42, unit:'2kg', category:'Grains & Cereals', location:'KwaZulu-Natal', stock:60},
  {id:'sorghum', name:'Sorghum Meal', price:38, unit:'2.5kg', category:'Grains & Cereals', location:'Limpopo', stock:45},
  {id:'samp-beans', name:'Samp & Beans Mix', price:36, unit:'1kg', category:'Grains & Cereals', location:'Free State', stock:50},
  {id:'wheat-flour', name:'Stone-Ground Wheat Flour', price:32, unit:'2.5kg', category:'Grains & Cereals', location:'Western Cape', stock:55},
  {id:'dried-beans', name:'Sugar Beans', price:44, unit:'kg', category:'Grains & Cereals', location:'Mpumalanga', stock:40},

  {id:'tomatoes', name:'Farm Tomatoes', price:32, unit:'kg', category:'Vegetables', location:'Pretoria, Gauteng', stock:60, badge:'Best Seller'},
  {id:'potatoes', name:'Potatoes', price:28, unit:'kg', category:'Vegetables', location:'Tshwane, Gauteng', stock:75},
  {id:'onions', name:'Brown Onions', price:25, unit:'kg', category:'Vegetables', location:'Mpumalanga', stock:70},
  {id:'spinach', name:'Fresh Spinach', price:15, unit:'bunch', category:'Vegetables', location:'Soshanguve, Gauteng', stock:45, badge:'Organic'},
  {id:'carrots', name:'Carrots', price:18, unit:'kg', category:'Vegetables', location:'Sandveld, Western Cape', stock:65},
  {id:'cabbage', name:'Green Cabbage', price:16, unit:'head', category:'Vegetables', location:'Gauteng', stock:50},
  {id:'sweet-potato', name:'Sweet Potatoes', price:22, unit:'kg', category:'Vegetables', location:'Mpumalanga', stock:55},
  {id:'green-beans', name:'Green Beans', price:26, unit:'kg', category:'Vegetables', location:'KwaZulu-Natal', stock:35},
  {id:'cucumber', name:'Cucumbers', price:14, unit:'each (3-pack)', category:'Vegetables', location:'Gauteng', stock:60},
  {id:'peppers', name:'Green & Red Peppers', price:34, unit:'kg', category:'Vegetables', location:'Limpopo', stock:30},
  {id:'butternut', name:'Butternut Squash', price:20, unit:'kg', category:'Vegetables', location:'Free State', stock:48},
  {id:'beetroot', name:'Beetroot', price:19, unit:'kg', category:'Vegetables', location:'Western Cape', stock:38},

  {id:'fruit', name:'Mixed Farm Fruits', price:55, unit:'kg basket', category:'Fruits', location:'Centurion, Gauteng', stock:30},
  {id:'bananas', name:'Bananas', price:24, unit:'kg', category:'Fruits', location:'Limpopo', stock:55, badge:'Best Seller'},
  {id:'apples', name:'Farm Apples', price:38, unit:'kg', category:'Fruits', location:'Western Cape', stock:40},
  {id:'oranges', name:'Navel Oranges', price:30, unit:'kg', category:'Fruits', location:'Limpopo', stock:65},
  {id:'naartjies', name:'Naartjies', price:33, unit:'kg', category:'Fruits', location:'Mpumalanga', stock:42},
  {id:'mangoes', name:'Mangoes', price:45, unit:'kg', category:'Fruits', location:'Limpopo', stock:38, badge:'New'},
  {id:'grapes', name:'Table Grapes', price:52, unit:'kg', category:'Fruits', location:'Western Cape', stock:26},
  {id:'watermelon', name:'Watermelon', price:40, unit:'each', category:'Fruits', location:'Northern Cape', stock:22},
  {id:'avocado', name:'Avocados', price:48, unit:'kg', category:'Fruits', location:'Mpumalanga', stock:34, badge:'Organic'},
  {id:'peaches', name:'Peaches', price:36, unit:'kg', category:'Fruits', location:'Western Cape', stock:28},
  {id:'strawberries', name:'Strawberries', price:35, unit:'250g punnet', category:'Fruits', location:'Gauteng', stock:44, badge:'New'},

  {id:'eggs', name:'Farm Eggs', price:65, unit:'18-pack', category:'Eggs & Poultry', location:'Pretoria, Gauteng', stock:35, badge:'Best Seller'},
  {id:'free-range-eggs', name:'Free-Range Eggs', price:78, unit:'18-pack', category:'Eggs & Poultry', location:'Free State', stock:28, badge:'Organic'},
  {id:'quail-eggs', name:'Quail Eggs', price:45, unit:'18-pack', category:'Eggs & Poultry', location:'Gauteng', stock:20},
  {id:'live-chickens', name:'Live Chickens', price:140, unit:'bird', category:'Eggs & Poultry', location:'KwaZulu-Natal', stock:15},

  {id:'chicken', name:'Fresh Chicken Portions', price:105, unit:'kg', category:'Meat & Poultry', location:'Gauteng', stock:25},
  {id:'beef-mince', name:'Beef Mince', price:75, unit:'500g', category:'Meat & Poultry', location:'Gauteng', stock:20, badge:'Best Seller'},
  {id:'pork-chops', name:'Pork Chops', price:95, unit:'kg', category:'Meat & Poultry', location:'North West', stock:18},
  {id:'lamb-chops', name:'Lamb Chops', price:180, unit:'kg', category:'Meat & Poultry', location:'Free State', stock:12},
  {id:'boerewors', name:'Farm Boerewors', price:88, unit:'kg', category:'Meat & Poultry', location:'Gauteng', stock:30, badge:'Best Seller'},
  {id:'biltong', name:'Beef Biltong', price:220, unit:'kg', category:'Meat & Poultry', location:'Gauteng', stock:15},

  {id:'dairy', name:'Full Cream Milk', price:34, unit:'2L', category:'Dairy', location:'Midrand, Gauteng', stock:40},
  {id:'cheese', name:'Farm Cheese', price:75, unit:'500g', category:'Dairy', location:'Free State', stock:18},
  {id:'yoghurt', name:'Farm Yoghurt', price:42, unit:'1L', category:'Dairy', location:'Gauteng', stock:25},
  {id:'butter', name:'Farm Butter', price:55, unit:'500g', category:'Dairy', location:'Free State', stock:22},
  {id:'cream', name:'Fresh Cream', price:38, unit:'500ml', category:'Dairy', location:'Gauteng', stock:20},
  {id:'amasi', name:'Amasi (Cultured Milk)', price:28, unit:'1L', category:'Dairy', location:'KwaZulu-Natal', stock:30},

  {id:'herbs', name:'Fresh Herbs & Spices Mix', price:30, unit:'pack', category:'Herbs & Spices', location:'Pretoria, Gauteng', stock:40},
  {id:'basil', name:'Fresh Basil', price:16, unit:'bunch', category:'Herbs & Spices', location:'Gauteng', stock:35, badge:'Organic'},
  {id:'mint', name:'Fresh Mint', price:14, unit:'bunch', category:'Herbs & Spices', location:'Gauteng', stock:32},
  {id:'coriander', name:'Fresh Coriander', price:14, unit:'bunch', category:'Herbs & Spices', location:'Western Cape', stock:38},
  {id:'garlic', name:'Garlic', price:45, unit:'kg', category:'Herbs & Spices', location:'Western Cape', stock:26},
  {id:'ginger', name:'Fresh Ginger', price:60, unit:'kg', category:'Herbs & Spices', location:'Limpopo', stock:20},
  {id:'chili', name:'Fresh Chillies', price:50, unit:'250g', category:'Herbs & Spices', location:'Limpopo', stock:24},

  {id:'honey', name:'Pure Farm Honey', price:95, unit:'500g', category:'Honey & Bee Products', location:'Limpopo', stock:22, badge:'Best Seller'},
  {id:'honeycomb', name:'Raw Honeycomb', price:120, unit:'300g', category:'Honey & Bee Products', location:'Mpumalanga', stock:12, badge:'Organic'},
  {id:'beeswax', name:'Pure Beeswax Blocks', price:65, unit:'250g', category:'Honey & Bee Products', location:'Limpopo', stock:18},

  {id:'nuts', name:'Farm Nuts & Seeds Mix', price:65, unit:'250g', category:'Nuts & Seeds', location:'Limpopo', stock:24},
  {id:'peanuts', name:'Raw Peanuts', price:38, unit:'500g', category:'Nuts & Seeds', location:'North West', stock:40},
  {id:'sunflower-seeds', name:'Sunflower Seeds', price:28, unit:'500g', category:'Nuts & Seeds', location:'Free State', stock:36},
  {id:'macadamia', name:'Macadamia Nuts', price:110, unit:'250g', category:'Nuts & Seeds', location:'Mpumalanga', stock:15, badge:'New'},

  {id:'seedlings', name:'Vegetable Seedlings', price:4.50, unit:'plant', category:'Plants & Seedlings', location:'Gauteng', stock:500},
  {id:'herb-seedlings', name:'Herb Seedling Trays', price:55, unit:'tray of 12', category:'Plants & Seedlings', location:'Gauteng', stock:40},
  {id:'fruit-saplings', name:'Fruit Tree Saplings', price:85, unit:'sapling', category:'Plants & Seedlings', location:'Mpumalanga', stock:25},

  {id:'compost', name:'Compost / Organic Manure', price:45, unit:'40L bag', category:'Farm Inputs', location:'Gauteng', stock:100},
  {id:'fertilizer', name:'General Fertilizer', price:180, unit:'10kg', category:'Farm Inputs', location:'Gauteng', stock:50},
  {id:'seed-potatoes', name:'Certified Seed Potatoes', price:65, unit:'10kg bag', category:'Farm Inputs', location:'Free State', stock:45},
  {id:'organic-spray', name:'Organic Pest Spray', price:75, unit:'1L', category:'Farm Inputs', location:'Gauteng', stock:30, badge:'Organic'},

  {id:'animal-feed', name:'Animal Feed', price:210, unit:'40kg', category:'Animal Feed', location:'Gauteng', stock:35},
  {id:'chicken-feed', name:'Layer Chicken Feed', price:165, unit:'40kg', category:'Animal Feed', location:'Gauteng', stock:40},
  {id:'lucerne', name:'Lucerne Bales', price:95, unit:'bale', category:'Animal Feed', location:'Free State', stock:60},

  {id:'firewood', name:'Dry Farm Firewood', price:80, unit:'bundle', category:'Farm Goods', location:'Mpumalanga', stock:60},
  {id:'charcoal', name:'Braai Charcoal', price:65, unit:'5kg bag', category:'Farm Goods', location:'Limpopo', stock:50},
  {id:'raw-wool', name:'Raw Sheep Wool', price:120, unit:'kg', category:'Farm Goods', location:'Eastern Cape', stock:20},

  {id:'flowers', name:'Fresh Farm Flowers', price:80, unit:'bouquet', category:'Flowers & Plants', location:'Gauteng', stock:20},
  {id:'proteas', name:'Protea Bouquet', price:150, unit:'bouquet', category:'Flowers & Plants', location:'Western Cape', stock:14, badge:'New'},
  {id:'potted-herbs', name:'Potted Herb Set', price:95, unit:'set of 3', category:'Flowers & Plants', location:'Gauteng', stock:22},

  {id:'tractor-hire', name:'Tractor & Field Equipment Hire', price:650, unit:'hour', category:'Farm Services', location:'Gauteng', stock:10, service:true},
  {id:'ploughing', name:'Land Preparation / Ploughing', price:850, unit:'hectare', category:'Farm Services', location:'Gauteng', stock:10, service:true},
  {id:'delivery', name:'Farm-to-Door Delivery', price:65, unit:'trip starting', category:'Farm Services', location:'Local areas', stock:50, service:true},
  {id:'cold-storage', name:'Cold Storage Space', price:35, unit:'crate/day', category:'Farm Services', location:'Gauteng', stock:50, service:true},
  {id:'harvest-labour', name:'Seasonal Harvest Labour', price:450, unit:'day (per worker)', category:'Farm Services', location:'Gauteng', stock:20, service:true},
  {id:'fencing', name:'Farm Fencing Repair', price:380, unit:'call-out', category:'Farm Services', location:'Gauteng', stock:15, service:true},

  {id:'farm-tour', name:'Farm Tour / Educational Visit', price:120, unit:'person', category:'Farm Experiences', location:'Gauteng', stock:20, service:true},
  {id:'farm-stay', name:'Farm Stay', price:650, unit:'night', category:'Farm Experiences', location:'Gauteng', stock:5, service:true},
  {id:'picnic-pass', name:'Farm Picnic Day Pass', price:85, unit:'person', category:'Farm Experiences', location:'Gauteng', stock:30, service:true, badge:'New'}
];

const PRODUCT_EMOJI = {
  'maize':'🌽','maize-meal':'🌽','brown-rice':'🍚','sorghum':'🌾','samp-beans':'🫘','wheat-flour':'🌾','dried-beans':'🫘',
  'tomatoes':'🍅','potatoes':'🥔','onions':'🧅','spinach':'🥬','carrots':'🥕','cabbage':'🥬','sweet-potato':'🍠','green-beans':'🫛','cucumber':'🥒','peppers':'🫑','butternut':'🎃','beetroot':'🟣',
  'fruit':'🧺','bananas':'🍌','apples':'🍎','oranges':'🍊','naartjies':'🍊','mangoes':'🥭','grapes':'🍇','watermelon':'🍉','avocado':'🥑','peaches':'🍑','strawberries':'🍓',
  'eggs':'🥚','free-range-eggs':'🥚','quail-eggs':'🥚','live-chickens':'🐔',
  'chicken':'🍗','beef-mince':'🥩','pork-chops':'🥩','lamb-chops':'🍖','boerewors':'🌭','biltong':'🥓',
  'dairy':'🥛','cheese':'🧀','yoghurt':'🥣','butter':'🧈','cream':'🥛','amasi':'🥛',
  'herbs':'🌿','basil':'🌿','mint':'🌿','coriander':'🌿','garlic':'🧄','ginger':'🫚','chili':'🌶️',
  'honey':'🍯','honeycomb':'🍯','beeswax':'🐝',
  'nuts':'🥜','peanuts':'🥜','sunflower-seeds':'🌻','macadamia':'🌰',
  'seedlings':'🌱','herb-seedlings':'🌱','fruit-saplings':'🌳',
  'compost':'🍂','fertilizer':'🧪','seed-potatoes':'🥔','organic-spray':'🧴',
  'animal-feed':'🌾','chicken-feed':'🌾','lucerne':'🌾',
  'firewood':'🪵','charcoal':'🔥','raw-wool':'🧶',
  'flowers':'💐','proteas':'🌺','potted-herbs':'🪴',
  'tractor-hire':'🚜','ploughing':'🚜','delivery':'🚚','cold-storage':'❄️','harvest-labour':'🧑\u200d🌾','fencing':'🚧',
  'farm-tour':'🧑\u200d🌾','farm-stay':'🏡','picnic-pass':'🧺'
};
const CATEGORY_EMOJI_FALLBACK = {'Vegetables':'🥕','Fruits':'🍎','Grains & Cereals':'🌾','Eggs & Poultry':'🥚','Meat & Poultry':'🍗','Dairy':'🧀','Herbs & Spices':'🌿','Honey & Bee Products':'🍯','Nuts & Seeds':'🥜','Plants & Seedlings':'🌱','Farm Inputs':'🧪','Animal Feed':'🐖','Farm Goods':'🧺','Flowers & Plants':'💐','Farm Services':'🚜','Farm Experiences':'🏡'};
const CATEGORY_GRADIENT = {
  'Grains & Cereals':['#f5d98b','#c98f2e'],'Vegetables':['#a8e6a1','#3f9142'],'Fruits':['#ffd1a9','#e8703a'],
  'Eggs & Poultry':['#fff3c4','#e0ac2b'],'Meat & Poultry':['#f7b3ab','#c23b34'],'Dairy':['#eef3fb','#9db3d6'],
  'Herbs & Spices':['#c8e6c9','#4c9350'],'Honey & Bee Products':['#ffe08a','#dc9200'],'Nuts & Seeds':['#e3c9a0','#8a6238'],
  'Plants & Seedlings':['#c5e8b7','#5c9b34'],'Farm Inputs':['#d7ccc8','#6d5a54'],'Animal Feed':['#f0e5c9','#a9895a'],
  'Farm Goods':['#d7ccc8','#5a4038'],'Flowers & Plants':['#f8bbd0','#d13d73'],'Farm Services':['#b3e5fc','#0d6fa8'],
  'Farm Experiences':['#ffe0b2','#d9720a']
};
function productThumb(p){
  const emoji = PRODUCT_EMOJI[p.id] || CATEGORY_EMOJI_FALLBACK[p.category] || '🌾';
  const [c1,c2] = CATEGORY_GRADIENT[p.category] || ['#dfeee2','#7fae86'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 225">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="300" height="225" fill="url(#g)"/>
    <circle cx="250" cy="35" r="55" fill="#ffffff" opacity="0.12"/>
    <circle cx="20" cy="200" r="70" fill="#ffffff" opacity="0.10"/>
    <text x="150" y="132" font-size="86" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
const PRODUCT_PHOTO = {
  'boerewors': 'imgs/boerewors.jpg',
  'beef-mince': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ground%20Beef.jpg',
  'lamb-chops': 'imgs/lamb-chops.jpg',
  'biltong': 'imgs/biltong.jpg',
  'pork-chops': 'imgs/pork-chops.jpg',
  'chicken': 'imgs/chicken.jpg',
  'eggs': 'imgs/eggs.jpg',
  'free-range-eggs': 'imgs/free-range-eggs.jpg',
  'quail-eggs': 'imgs/quail-eggs.jpg',
  'live-chickens': 'imgs/live-chickens.jpg',
  'dairy': 'imgs/dairy.jpg',
  'cheese': 'imgs/cheese.jpg',
  'yoghurt': 'imgs/yoghurt.jpg',
  'butter': 'imgs/butter.jpg',
  'cream': 'imgs/cream.jpg',
  'amasi': 'imgs/amasi.jpg',
  'tomatoes': 'https://commons.wikimedia.org/wiki/Special:FilePath/Tomatoes.jpg',
  'potatoes': 'https://commons.wikimedia.org/wiki/Special:FilePath/Patates.jpg',
  'onions': 'https://commons.wikimedia.org/wiki/Special:FilePath/Mixed_onions.jpg',
  'spinach': 'https://commons.wikimedia.org/wiki/Special:FilePath/Spinach_plant_with_flowers.jpg',
  'carrots': 'https://commons.wikimedia.org/wiki/Special:FilePath/Carrot.jpg',
  'cabbage': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cabbage.jpg',
  'sweet-potato': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ipomoea_batatas_006.jpg',
  'green-beans': 'https://commons.wikimedia.org/wiki/Special:FilePath/PikiWiki_Israel_30880_Green_Bean.jpg',
  'cucumber': 'https://commons.wikimedia.org/wiki/Special:FilePath/A_cool_cucumber.JPG',
  'peppers': 'https://commons.wikimedia.org/wiki/Special:FilePath/Bell_peppers_2020_G2.jpg',
  'butternut': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cucurbita_moschata_Butternut_2012_G1.jpg',
  'beetroot': 'https://commons.wikimedia.org/wiki/Special:FilePath/SugarBeet.jpg',
  'bananas': 'imgs/bananas.jpg',
  'apples': 'imgs/apples.jpg',
  'oranges': 'imgs/oranges.jpg',
  'naartjies': 'imgs/naartjies.jpg',
  'mangoes': 'imgs/mangoes.jpg',
  'grapes': 'imgs/grapes.jpg',
  'watermelon': 'imgs/watermelon.jpg',
  'avocado': 'imgs/avocado.jpg',
  'peaches': 'imgs/peaches.jpg',
  'strawberries': 'imgs/strawberries.jpg',
  'maize': 'imgs/maize.jpg',
  'maize-meal': 'imgs/maize-meal.jpg',
  'brown-rice': 'imgs/brown-rice.jpg',
  'sorghum': 'imgs/sorghum.jpg',
  'samp-beans': 'imgs/samp-beans.jpg',
  'wheat-flour': 'imgs/wheat-flour.jpg',
  'dried-beans': 'imgs/dried-beans.jpg',
  'herbs': 'imgs/herbs.jpg',
  'basil': 'https://commons.wikimedia.org/wiki/Special:FilePath/Basil-Basilico-Ocimum%20basilicum-albahaca.jpg',
  'mint': 'imgs/mint.jpg',
  'coriander': 'imgs/coriander.jpg',
  'garlic': 'imgs/garlic.jpg',
  'ginger': 'imgs/ginger.jpg',
  'chili': 'imgs/chili.jpg',
  'honey': 'imgs/honey.jpg',
  'honeycomb': 'imgs/honeycomb.jpg',
  'beeswax': 'imgs/beeswax.jpg',
  'nuts': 'imgs/nuts.jpg',
  'peanuts': 'imgs/peanuts.jpg',
  'sunflower-seeds': 'imgs/Sunflower_seeds.jpg',
  'macadamia': 'https://commons.wikimedia.org/wiki/Special:FilePath/Macadamia_sawn_nutshell.jpg',
  'seedlings': 'https://commons.wikimedia.org/wiki/Special:FilePath/Lufa_Farms_Swiss_Chard_Seedlings.jpg',
  'herb-seedlings': 'imgs/herb-seedlings.jpg',
  'fruit-saplings': 'imgs/fruit-saplings.jpg',
  'compost': 'imgs/compost.jpg',
  'fertilizer': 'imgs/fertilizer.jpg',
  'seed-potatoes': 'imgs/seed-potatoes.jpg',
  'organic-spray': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ulvmast1.JPG',
  'animal-feed': 'https://commons.wikimedia.org/wiki/Special:FilePath/Leland_Milling_Company_Animal_Feed.jpg',
  'chicken-feed': 'imgs/chicken-feed.jpg',
  'lucerne': 'imgs/lucerne.jpg',
  'firewood': 'imgs/firewood.jpg',
  'charcoal': 'imgs/charcoal.jpg',
  'raw-wool': 'imgs/raw-wool.jpg',
  'flowers': 'imgs/flowers.jpg',
  'proteas': 'imgs/proteas.jpg',
  'potted-herbs': 'imgs/potted-herbs.jpg',
  'tractor-hire': 'imgs/tractor-hire.jpg',
  'ploughing': 'imgs/ploughing.jpg',
  'delivery': 'imgs/delivery.jpg',
  'cold-storage': 'imgs/cold-storage.jpg',
  'harvest-labour': 'imgs/harvest-labour.jpg',
  'fencing': 'imgs/fencing.jpg',
  'farm-tour': 'imgs/farm-tour.jpg',
  'farm-stay': 'imgs/farm-stay.jpg',
  'picnic-pass': 'imgs/picnic-pass.jpg',
  'fruit': 'imgs/fruit.jpg'
};
PRODUCTS.forEach(p => { p.image = PRODUCT_PHOTO[p.id] || productThumb(p); });

function enrichProductFilters(p){
  const cat = p.category;
  const unit = (p.unit||'').toLowerCase();

  let freshnessType = 'Shelf-stable';
  if (['Vegetables','Fruits','Dairy','Meat & Poultry','Eggs & Poultry','Herbs & Spices'].includes(cat)) freshnessType = 'Fresh';
  else if (['Plants & Seedlings','Flowers & Plants'].includes(cat)) freshnessType = 'Live / Fresh-cut';
  else if (['Farm Services','Farm Experiences'].includes(cat)) freshnessType = 'Service';
  else if (cat === 'Farm Goods') freshnessType = 'Dried / Processed';
  if (p.id === 'biltong') freshnessType = 'Dried';

  let weightTier = 'Standard';
  if (/\b(bag|bale|crate|hectare|40kg|10kg|25kg)\b/.test(unit)) weightTier = 'Bulk';
  else if (/\b(bunch|punnet|dozen|pack|tray|jar|bottle|slot|day|hour|person|night|trip|call-out|18-pack)\b/.test(unit) || /^(250g|500g)/.test(unit)) weightTier = 'Small';

  let packaging = 'Loose';
  if (p.service) packaging = 'N/A (service)';
  else if (/bag/.test(unit)) packaging = 'Bagged';
  else if (/(crate|basket|box|tray)/.test(unit)) packaging = 'Boxed / Crated';
  else if (/(bottle|jar)/.test(unit)) packaging = 'Bottled / Jarred';
  else if (/(bunch|punnet|pack|dozen|18-pack)/.test(unit)) packaging = 'Packaged';

  let deliveryOptions = p.service ? ['On-site / call-out'] : ['Farm pickup', 'Local delivery'];
  if (!p.service && ['Vegetables','Fruits','Dairy','Meat & Poultry','Eggs & Poultry'].includes(cat)) deliveryOptions = [...deliveryOptions, 'Same-day delivery'];

  let dietary = [];
  if (['Vegetables','Fruits','Grains & Cereals','Herbs & Spices','Nuts & Seeds','Plants & Seedlings'].includes(cat)) dietary.push('Vegan','Vegetarian');
  else if (['Dairy','Eggs & Poultry','Honey & Bee Products'].includes(cat)) dietary.push('Vegetarian');
  if (p.id !== 'wheat-flour') dietary.push('Gluten-Free');
  if (p.badge === 'Organic') dietary.push('Organic');
  if (p.id === 'live-chickens') dietary = [];

  let allergens = [];
  if (cat === 'Dairy') allergens.push('Dairy');
  if (cat === 'Nuts & Seeds') allergens.push('Nuts');
  if (p.id === 'wheat-flour') allergens.push('Gluten');
  if (['eggs','free-range-eggs','quail-eggs'].includes(p.id)) allergens.push('Eggs');

  return { ...p, freshnessType, weightTier, packaging, deliveryOptions, dietary, allergens };
}

for (let i = 0; i < PRODUCTS.length; i++) { PRODUCTS[i] = enrichProductFilters(PRODUCTS[i]); }


const ON_SALE_IDS = ['maize','tomatoes','bananas','eggs','dairy','honey','nuts','seedlings','compost','firewood','flowers','tractor-hire','farm-tour','chicken','apples'];
PRODUCTS.forEach(p => {
  p.onSale = ON_SALE_IDS.includes(p.id);
  if (p.onSale) p.salePrice = Math.round(p.price * 0.85 * 100) / 100;
  p.specialOffer = p.onSale || !!p.badge;
});

const LOCATION_DISTANCE_KM = {
  'Pretoria, Gauteng': 5, 'Tshwane, Gauteng': 8, 'Centurion, Gauteng': 20,
  'Soshanguve, Gauteng': 25, 'Midrand, Gauteng': 45, 'Gauteng': 55,
  'Local areas': 15, 'North West': 150, 'Free State': 250,
  'Mpumalanga': 300, 'Limpopo': 300, 'KwaZulu-Natal': 600,
  'Northern Cape': 700, 'Eastern Cape': 900, 'Western Cape': 1450,
  'Sandveld, Western Cape': 1500
};
const PERISHABLE_CATEGORIES = new Set(['Vegetables', 'Fruits', 'Dairy', 'Eggs & Poultry', 'Meat & Poultry', 'Herbs & Spices']);
function hashId(id) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; }
PRODUCTS.forEach(p => {
  p.distanceKm = LOCATION_DISTANCE_KM[p.location] ?? 100;
  const perishable = PERISHABLE_CATEGORIES.has(p.category);
  p.freshDays = (perishable ? 1 : 6) + (hashId(p.id) % (perishable ? 5 : 20));
});

const LIVESTOCK = [
 {id:'cattle-1', species:'Cattle', breed:'Bonsmara', title:'Bonsmara breeding cow', price:18000, unit:'animal', location:'Free State', age:'36 months', weight:'450 kg', qty:1, image:'imgs/bonsmara.jpg'},
 {id:'cattle-2', species:'Cattle', breed:'Nguni', title:'Nguni heifer', price:14500, unit:'animal', location:'KwaZulu-Natal', age:'24 months', weight:'320 kg', qty:2 , image:'imgs/NguniCow.jpg'},
 {id:'sheep-1', species:'Sheep', breed:'Merino', title:'Merino ewe', price:2200, unit:'animal', location:'Eastern Cape', age:'18 months', weight:'55 kg', qty:8 , image:'imgs/merino.jpg'},
 {id:'goat-1', species:'Goat', breed:'Boer Goat', title:'Boer goat', price:2800, unit:'animal', location:'Northern Cape', age:'16 months', weight:'65 kg', qty:6, image: 'imgs/goat.jpg'},
 {id:'pig-1', species:'Pig', breed:'Large White', title:'Young breeding pig', price:3200, unit:'animal', location:'Gauteng', age:'8 months', weight:'90 kg', qty:4, image:'imgs/pigs.jpg'},
 {id:'horse-1', species:'Horse', breed:'Crossbreed', title:'Farm riding horse', price:25000, unit:'animal', location:'Gauteng', age:'7 years', weight:'480 kg', qty:1, image:'imgs/horse.jpg'},
 {id:'poultry-1', species:'Poultry', breed:'Layer hens', title:'Point-of-lay hens', price:180, unit:'bird', location:'Limpopo', age:'18 weeks', weight:'1.6 kg', qty:50, image:'https://www.meadowfeeds.co.za/wp-content/uploads/2022/09/10072574_l-scaled.jpg'},
 {id:'donkey-1', species:'Donkey', breed:'Standard', title:'Farm donkey', price:6500, unit:'animal', location:'Limpopo', age:'5 years', weight:'220 kg', qty:2 , image:'imgs/donkey.jpg'},
 {id:'rabbit-1', species:'Rabbit', breed:'Meat rabbit', title:'Breeding rabbits', price:350, unit:'animal', location:'Gauteng', age:'6 months', weight:'3 kg', qty:12 , image:'imgs/rabbits.jpg'}
];


let cart = JSON.parse(localStorage.getItem('farmlinkCart') || '[]');
let map, driverMarker, routeLine, trackerTimer;
let trackerStep = 0;

function money(n){ return `R ${Number(n).toFixed(2)}`; }
function saveCart(){ localStorage.setItem('farmlinkCart', JSON.stringify(cart)); updateCartUI(); }
function updateCartUI(){
  const count=cart.reduce((n,i)=>n+i.qty,0);
  document.querySelectorAll('#cartCount,#dockCartCount').forEach(el=>{
    el.textContent=count;
    el.classList.remove('cart-pop-anim');
    void el.offsetWidth; 
    el.classList.add('cart-pop-anim');
  });
  renderCart();
}
function openModal(id){
  const el=document.getElementById(id); if(!el)return;
  el.classList.add('show');
  if(id==='cartModal') renderCart();
  if(id==='trackerModal') setTimeout(initTracker,100);
}
function closeModal(id){ document.getElementById(id)?.classList.remove('show'); }

function addToCart(id, btn){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return;
  const existing=cart.find(x=>x.id===id);
  if(existing) existing.qty++;
  else cart.push({...p,qty:1});
  saveCart();
  if(btn) flashAdded(btn);
  openModal('cartModal');
}

function flashAdded(btn){
  const original = btn.textContent;
  btn.classList.add('btn-success-anim');
  btn.textContent = '✓ Added';
  setTimeout(()=>{ btn.classList.remove('btn-success-anim'); btn.textContent = original; }, 1200);
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  saveCart();
}
function renderCart(){
  const box=document.getElementById('cartItems'), totalEl=document.getElementById('cartTotal');
  if(!box)return;
  if(!cart.length){box.innerHTML='<div class="empty-state">Your cart is empty.<br>Add some fresh produce to get started 🌱</div>'; totalEl.textContent='R 0.00'; return;}
  let total=0;
  box.innerHTML=cart.map(i=>{
    total+=i.price*i.qty;
    return `<div class="cart-row">
      <img src="${i.image}" alt="${i.name}">
      <div><strong>${i.name}</strong><div style="color:var(--muted);font-size:13px">${money(i.price)} / ${i.unit}</div>
        <div class="qty"><button onclick="changeQty('${i.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.id}',1)">+</button></div>
      </div>
      <strong>${money(i.price*i.qty)}</strong>
    </div>`;
  }).join('');
  totalEl.textContent=money(total);
}
function checkout(){
  if(!cart.length){alert('Your cart is empty.');return;}
  openModal('paymentModal');
}

const DRIVERS=[
 {id:'d1',name:'Thabo M.',rating:4.9,trips:312,vehicle:'Toyota Corolla',year:2022,area:'Pretoria',status:'Verified',price:65,capacity:'Small/medium orders'},
 {id:'d2',name:'Lerato K.',rating:4.8,trips:198,vehicle:'VW Polo',year:2021,area:'Centurion',status:'Verified',price:75,capacity:'Small/medium orders'},
 {id:'d3',name:'Sibusiso N.',rating:4.7,trips:421,vehicle:'Toyota Avanza',year:2023,area:'Soshanguve',status:'Verified',price:95,capacity:'Large orders'}
];
function renderDrivers(){
 const box=document.getElementById('driverList'); if(!box)return;
 box.innerHTML=DRIVERS.map(d=>`<div class="driver-card"><div class="driver-avatar">🚗</div><div class="driver-main"><h3>${d.name} <span class="verified-badge">✓ Verified</span></h3><p>⭐ ${d.rating} · ${d.trips} deliveries · 📍 ${d.area}</p><p><strong>${d.vehicle}</strong> (${d.year}) · ${d.capacity}</p></div><div class="driver-action"><strong>${money(d.price)}</strong><small>starting fee</small><button class="add-cart" onclick="hireDriver('${d.id}', this)">Request driver</button></div></div>`).join('');
}
function hireDriver(id, btn){
 const d=DRIVERS.find(x=>x.id===id); if(!d)return;
 localStorage.setItem('farmlinkDriverJob',JSON.stringify({driverId:id,driver:d.name,vehicle:d.vehicle,status:'Requested',requestedAt:new Date().toISOString()}));
 if(btn){
   const original = btn.textContent;
   btn.classList.add('btn-success-anim');
   btn.textContent = '✓ Driver Confirmed';
   setTimeout(()=>{
     closeModal('driverModal');
     btn.classList.remove('btn-success-anim');
     btn.textContent = original;
   }, 1200);
 } else {
   closeModal('driverModal');
 }
}

function setupPayment(){
 document.getElementById('payNowBtn')?.addEventListener('click', async ()=>{
   const status=document.getElementById('paymentStatus');
   const btn=document.getElementById('payNowBtn');
   if(!cart.length){ status.textContent='Your cart is empty.'; status.className='payment-error'; return; }

   const liveItems = cart.filter(i => typeof i.id === 'string' && i.id.startsWith('db-p-'));
   const demoItems = cart.filter(i => !(typeof i.id === 'string' && i.id.startsWith('db-p-')));
   const deliveryAddress = document.getElementById('deliveryAddress')?.value.trim() || '';

   if(!liveItems.length){
     status.innerHTML = demoItems.length
       ? `<span style="color:#b45309">These are catalogue example items (not real seller listings), so there's nothing to actually check out. List a real product from the Sell page, or add one of those to your cart, to place a real order.</span>`
       : 'Your cart is empty.';
     status.className='payment-error';
     return;
   }

   btn.disabled = true; btn.textContent = 'Processing…';
   status.textContent=''; status.className='';
   try {
     const payload = {
       items: liveItems.map(i => ({ product_id: Number(i.id.replace('db-p-','')), quantity: i.qty })),
       delivery_address: deliveryAddress
     };
     const { order_id, total } = await FarmLinkAPI.createOrder(payload);
     let msg = `✅ Order #${order_id} placed — ${money(total)}. Payment demo successful; in production this button would create a server-side payment session with your chosen provider.`;
     if (demoItems.length) msg += ` (${demoItems.length} catalogue example item${demoItems.length===1?'':'s'} in your cart ${demoItems.length===1?'was':'were'} skipped — those aren't real listings yet.)`;
     status.textContent = msg;
     status.className='payment-success';
     localStorage.setItem('farmlinkLastOrder',JSON.stringify({orderId:order_id,items:liveItems,total,paidAt:new Date().toISOString(),paymentStatus:'demo-paid'}));
     cart = cart.filter(i => !liveItems.includes(i));
     saveCart();
   } catch (err) {
     status.textContent = err.data?.error || err.message || 'Could not place your order. Please try again.';
     status.className='payment-error';
   } finally {
     btn.disabled = false; btn.textContent = 'Pay securely';
   }
 });
}

function livestockCard(a){
 const fallbackImg = `imgs/animals/${(a.species||'').toLowerCase()}.svg`;
 return `<div class="product-card livestock-card"><div class="product-img"><span class="verified-badge">✓ Live listing</span><img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg}';"></div><div class="product-info"><h3>${a.title}</h3><div class="price">${money(a.price)} / ${a.unit}</div><p><strong>${a.species}</strong> · ${a.breed}</p><div class="product-meta"><span>📍 ${a.location}</span><span>${a.qty} available</span></div><p class="muted">${a.age} · ${a.weight}</p><button class="add-cart" onclick="requestLivestock('${a.id}')">Request / enquire</button></div></div>`;
}
function renderLivestock(species='All'){
 const grid=document.getElementById('livestockGrid'), empty=document.getElementById('livestockEmpty'); if(!grid)return;
 const list=species==='All'?LIVESTOCK:LIVESTOCK.filter(a=>a.species===species);
 grid.innerHTML=list.map(livestockCard).join(''); if(empty)empty.style.display=list.length?'none':'block';
}
function requestLivestock(id){
 const a=LIVESTOCK.find(x=>x.id===id); if(!a)return;
 alert(`Enquiry started for ${a.title}. A verified seller can confirm availability, health/identification records, collection and suitable transport.`);
}

function productCard(p){
 const tagHtml = p.onSale ? '<span class="product-tag tag-sale">Sale</span>'
   : p.badge ? `<span class="product-tag tag-${p.badge==='Best Seller'?'bestseller':p.badge==='New'?'new':'organic'}">${p.badge}</span>` : '';
 const lowStock = p.stock <= 15;
 const priceHtml = p.onSale
   ? `<span class="price-was">${money(p.price)}</span> ${money(p.salePrice)} <span class="price-unit">/ ${p.unit}</span>`
   : `${money(p.price)} <span class="price-unit">/ ${p.unit}</span>`;
 return `<div class="product-card">
   <div class="product-img">${tagHtml}<span class="heart" onclick="this.textContent=this.textContent==='♡'?'♥':'♡';this.classList.toggle('liked')">♡</span><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src=productThumb({id:'${p.id}',category:'${p.category}'});"></div>
   <div class="product-info">
     <span class="product-category-chip">${p.category}</span>
     <h3>${p.name}</h3>
     <div class="price">${priceHtml}</div>${p.service?'<span class="service-badge">Service</span>':''}
     <div class="product-meta"><span>📍 ${p.location}</span><span class="stock-pill${lowStock?' low':''}">${p.stock} ${p.service?'slots':'available'}</span></div>
     <button class="add-cart" onclick="addToCart('${p.id}', this)">${p.service?'Book now':'Add to Cart'}</button>
   </div>
 </div>`;
}
function renderBrowse(category='All'){
 const grid=document.getElementById('browseGrid'), empty=document.getElementById('browseEmpty');
 if(!grid)return;
 const list=category==='All'?PRODUCTS:PRODUCTS.filter(p=>p.category===category);
 grid.innerHTML=list.map(productCard).join('');
 if(empty) empty.style.display=list.length?'none':'block';
}
function productMatchesFilters(p, f){
  if (f.category && p.category !== f.category) return false;
  if (f.priceMin != null && p.price < f.priceMin) return false;
  if (f.priceMax != null && p.price > f.priceMax) return false;
  if (f.inStockOnly && p.stock <= 0) return false;
  if (f.discountsOnly && !p.onSale) return false;
  if (f.dietary.length && !f.dietary.every(d => p.dietary.includes(d))) return false;
  if (f.freshnessType && p.freshnessType !== f.freshnessType) return false;
  if (f.weightTier && p.weightTier !== f.weightTier) return false;
  if (f.delivery.length && !f.delivery.some(d => p.deliveryOptions.includes(d))) return false;
  if (f.location && p.location !== f.location) return false;
  if (f.packaging && p.packaging !== f.packaging) return false;
  if (f.allergensExclude.length && f.allergensExclude.some(a => p.allergens.includes(a))) return false;
  if (f.specialOffersOnly && !p.specialOffer) return false;
  return true;
}

function defaultProductFilters(){
  return {
    sort: 'all', category: '', priceMin: null, priceMax: null,
    inStockOnly: false, discountsOnly: false, dietary: [], freshnessType: '',
    weightTier: '', delivery: [], location: '', packaging: '',
    allergensExclude: [], specialOffersOnly: false
  };
}

function renderHomeProducts(state = defaultProductFilters()){
 const grid=document.getElementById('homeProductGrid');
 if(!grid)return;
 const sort = state.sort || 'all';
 const hasActiveFilters = Object.keys(state).some(k => {
   if (k === 'sort') return false;
   const v = state[k];
   return Array.isArray(v) ? v.length > 0 : (v !== '' && v !== null && v !== false);
 });

 let matching = PRODUCTS.filter(p => productMatchesFilters(p, state));
 let list;
 if (sort === 'cheapest') {
   list = matching.sort((a, b) => a.price - b.price);
 } else if (sort === 'closest') {
   list = matching.sort((a, b) => a.distanceKm - b.distanceKm);
 } else if (sort === 'freshest') {
   list = matching.sort((a, b) => a.freshDays - b.freshDays);
 } else if (hasActiveFilters) {
   list = matching;
 } else {
   const byCategory = {};
   matching.forEach(p=>{
    if(!byCategory[p.category]) byCategory[p.category]=p;
    else if(p.badge && !byCategory[p.category].badge) byCategory[p.category]=p;
   });
   list = Object.values(byCategory).slice(0,12);
 }
 grid.innerHTML = list.length
   ? list.map(productCard).join('')
   : `<p class="browse-empty">No products match those filters — try clearing a few.</p>`;
}

function readProductFilterState(){
 const state = defaultProductFilters();
 const panel = document.querySelector('#productFilterDropdown .filter-panel');
 if (!panel) return state;
 state.sort = document.querySelector('#filterSortPills .filter-pill.active')?.dataset.sort || 'all';
 state.category = document.getElementById('filterCategory').value;
 const min = document.getElementById('filterPriceMin').value;
 const max = document.getElementById('filterPriceMax').value;
 state.priceMin = min === '' ? null : Number(min);
 state.priceMax = max === '' ? null : Number(max);
 state.inStockOnly = document.getElementById('filterInStock').checked;
 state.discountsOnly = document.getElementById('filterDiscounts').checked;
 state.dietary = Array.from(document.querySelectorAll('#filterDietary input:checked')).map(el => el.value);
 state.freshnessType = document.getElementById('filterFreshnessType').value;
 state.weightTier = document.getElementById('filterWeightTier').value;
 state.delivery = Array.from(document.querySelectorAll('#filterDelivery input:checked')).map(el => el.value);
 state.location = document.getElementById('filterLocation').value;
 state.packaging = document.getElementById('filterPackaging').value;
 state.allergensExclude = Array.from(document.querySelectorAll('#filterAllergens input:checked')).map(el => el.value);
 state.specialOffersOnly = document.getElementById('filterSpecialOffers').checked;
 return state;
}

function setupHomeFilters(){
 const dropdown = document.getElementById('productFilterDropdown');
 const grid = document.getElementById('homeProductGrid');
 if (!dropdown || !grid) return;

 const trigger = document.getElementById('filterTriggerBtn');
 const panel = dropdown.querySelector('.filter-panel');
 const countBadge = document.getElementById('filterActiveCount');
 const sortPillsWrap = document.getElementById('filterSortPills');
 let state = defaultProductFilters();

 function applyState(){
   state = readProductFilterState();
   const activeCount = ['category','freshnessType','weightTier','location','packaging'].filter(k => state[k]).length
     + (state.priceMin != null ? 1 : 0) + (state.priceMax != null ? 1 : 0)
     + (state.inStockOnly ? 1 : 0) + (state.discountsOnly ? 1 : 0) + (state.specialOffersOnly ? 1 : 0)
     + state.dietary.length + state.delivery.length + state.allergensExclude.length;
   countBadge.textContent = activeCount;
   countBadge.classList.toggle('show', activeCount > 0);

   renderHomeProducts(state);
 }

 sortPillsWrap.querySelectorAll('.filter-pill').forEach(pill => {
   pill.addEventListener('click', () => {
     sortPillsWrap.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
     pill.classList.add('active');
     state.sort = pill.dataset.sort || 'all';
     renderHomeProducts(state);
   });
 });

 panel.querySelectorAll('select, input[type="number"], input[type="checkbox"]').forEach(el => {
   el.addEventListener('change', applyState);
 });

 document.getElementById('filterApplyBtn')?.addEventListener('click', () => {
   applyState();
   dropdown.classList.remove('open');
   trigger.setAttribute('aria-expanded', 'false');
 });

 document.getElementById('filterClearBtn')?.addEventListener('click', () => {
   panel.querySelectorAll('select').forEach(el => el.value = '');
   panel.querySelectorAll('input[type="number"]').forEach(el => el.value = '');
   panel.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
   sortPillsWrap.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
   sortPillsWrap.querySelector('[data-sort="all"]')?.classList.add('active');
   Object.assign(state, defaultProductFilters());
   applyState();
 });

 trigger.addEventListener('click', e => {
   e.stopPropagation();
   const willOpen = !dropdown.classList.contains('open');
   dropdown.classList.toggle('open', willOpen);
   trigger.setAttribute('aria-expanded', String(willOpen));
 });
 document.addEventListener('click', e => {
   if (!dropdown.contains(e.target)) {
     dropdown.classList.remove('open');
     trigger.setAttribute('aria-expanded', 'false');
   }
 });
 document.addEventListener('keydown', e => {
   if (e.key === 'Escape') {
     dropdown.classList.remove('open');
     trigger.setAttribute('aria-expanded', 'false');
   }
 });
}

function renderCategoryCounts(){
 document.querySelectorAll('.category-card[data-category]').forEach(c=>{
  const cat = c.dataset.category;
  const count = cat==='Livestock' ? LIVESTOCK.length : PRODUCTS.filter(p=>p.category===cat).length;
  const label = c.querySelector('p');
  if(!label || label.querySelector('.category-count')) return;
  label.insertAdjacentHTML('beforeend', `<span class="category-count">${count} item${count===1?'':'s'}</span>`);
 });
}

function setupBrowse(){
 document.querySelectorAll('#browseFilters .filter-btn').forEach(btn=>{
   btn.addEventListener('click',()=>{
     document.querySelectorAll('#browseFilters .filter-btn').forEach(b=>b.classList.remove('active'));
     btn.classList.add('active'); renderBrowse(btn.dataset.cat||'All');
   });
 });
 renderBrowse();
}
function enhanceStaticProducts(){
 document.querySelectorAll('.product-card').forEach(card=>{
   if(card.querySelector('.add-cart')) return;
   const title=card.querySelector('h3')?.textContent?.toLowerCase()||'';
   const p=PRODUCTS.find(x=>title.includes(x.name.split(' ')[1]?.toLowerCase()||'__')) || PRODUCTS[0];
   const info=card.querySelector('.product-info');
   if(info) info.insertAdjacentHTML('beforeend',`<button class="add-cart" onclick="addToCart('${p.id}', this)">Add to Cart</button>`);
 });
}

function toggleSearch(){
 document.getElementById('searchInput')?.classList.toggle('active');
 document.getElementById('searchInput')?.focus();
}
function toggleMenu(){ document.getElementById('mobileMenu')?.classList.toggle('show'); }

function showPage(page){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 document.getElementById(page)?.classList.add('active');
 document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
 if(page==='browse') renderBrowse();
 if(page==='livestock') renderLivestock();
 window.scrollTo({top:0,behavior:'smooth'});
}
function setupNavigation(){
 document.querySelectorAll('.nav-link[data-page]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page);});
 });
 document.querySelectorAll('.category-card[data-category]').forEach(c=>{
  c.addEventListener('click',()=>{
    if(c.dataset.category==='Livestock'){
      if(document.getElementById('livestock')){ showPage('livestock'); renderLivestock(); }
      else { window.location.href='dashboard.html'; }
    } else {
      showPage('browse'); renderBrowse(c.dataset.category);
    }
  });
  c.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); c.click(); } });
 });
 renderCategoryCounts();
 document.getElementById('searchInput')?.addEventListener('input',e=>{
   const q=e.target.value.toLowerCase().trim(); if(!q)return;
   const results=PRODUCTS.filter(p=>(p.name+p.category+p.location).toLowerCase().includes(q));
   const animals=LIVESTOCK.filter(a=>(a.title+a.species+a.breed+a.location).toLowerCase().includes(q));
   if(!results.length && animals.length){
     showPage('livestock');
     const lg=document.getElementById('livestockGrid'); if(lg) lg.innerHTML=animals.map(livestockCard).join('');
     const le=document.getElementById('livestockEmpty'); if(le) le.style.display='none';
     return;
   }
   showPage('browse');
   const grid=document.getElementById('browseGrid'); if(!grid)return;
   grid.innerHTML=results.map(productCard).join('');
   document.getElementById('browseEmpty').style.display=results.length?'none':'block';
 });
}

function initTracker(){
 if(!window.L||map)return;
 map=L.map('deliveryMap').setView([-25.7479,28.2293],12);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
 const route=[[-25.7479,28.2293],[-25.755,28.215],[-25.765,28.205],[-25.775,28.195],[-25.785,28.185]];
 routeLine=L.polyline(route,{weight:5}).addTo(map);
 driverMarker=L.marker(route[0]).addTo(map).bindPopup('🚚 FarmLink driver').openPopup();
 trackerStep=0;
 trackerTimer=setInterval(()=>{
   trackerStep++;
   if(trackerStep>=route.length){trackerStep=route.length-1;clearInterval(trackerTimer);document.getElementById('deliveryStatus').textContent='Arriving now';document.getElementById('etaText').textContent='ETA: 2 min';return;}
   driverMarker.setLatLng(route[trackerStep]);
   map.panTo(route[trackerStep],{animate:true,duration:.5});
   const mins=Math.max(2,18-trackerStep*4);
   document.getElementById('etaText').textContent=`ETA: ${mins} min`;
   document.getElementById('deliveryStatus').textContent=trackerStep>2?'Driver nearby':'On the way';
 },3000);
 setTimeout(()=>map.invalidateSize(),200);
}

document.addEventListener('DOMContentLoaded',()=>{
 setupNavigation(); setupBrowse(); renderHomeProducts(); setupHomeFilters(); renderLivestock(); setupPayment(); enhanceStaticProducts(); updateCartUI(); renderDrivers();
 document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');}));
 loadLiveListings();
});

function apiProductToCard(p){
  const fallback = { id:p.id, name:p.name, category:p.category||'Farm Goods' };
  return {
    id:'db-p-'+p.id, name:p.name, price:Number(p.price), unit:p.unit||'unit',
    category:p.category||'Farm Goods', location:p.location||'Location on request',
    stock:Number(p.stock||0), image:p.image_url || productThumb(fallback),
    service:!!Number(p.is_service), sellerName:p.seller_name||'', live:true
  };
}
function apiLivestockToCard(l){
  const unitMap={per_animal:'animal',per_kg:'kg',lot:'lot',contact_seller:'enquiry'};
  return {
    id:'db-l-'+l.id, species:l.species?(l.species[0].toUpperCase()+l.species.slice(1)):'Other', breed:l.breed||'—',
    title:l.listing_title, price:Number(l.price||0), unit:unitMap[l.price_type]||'animal',
    location:l.location, age:l.age_months?`${l.age_months} months`:'Age on request',
    weight:l.weight_kg?`${l.weight_kg} kg`:'Weight on request', qty:Number(l.quantity||1),
    image:l.image_url||`imgs/animals/${(l.species||'').toLowerCase()}.svg`, sellerName:l.seller_name||'', live:true
  };
}
async function loadLiveListings(){
  if(!window.FarmLinkAPI) return;
  try{
    const [prodRes, liveRes] = await Promise.all([
      FarmLinkAPI.products().catch(()=>({products:[]})),
      FarmLinkAPI.livestock().catch(()=>({livestock:[]}))
    ]);
    const liveProducts=(prodRes.products||[]).map(apiProductToCard);
    const liveLivestock=(liveRes.livestock||[]).map(apiLivestockToCard);
    for(let i=PRODUCTS.length-1;i>=0;i--) if(PRODUCTS[i].live) PRODUCTS.splice(i,1);
    for(let i=LIVESTOCK.length-1;i>=0;i--) if(LIVESTOCK[i].live) LIVESTOCK.splice(i,1);
    PRODUCTS.unshift(...liveProducts);
    LIVESTOCK.unshift(...liveLivestock);
    if(document.getElementById('homeProductGrid')) renderHomeProducts(document.querySelector('#homeFilters .filter-btn.active')?.dataset.sort || 'all');
    if(document.getElementById('browseGrid')) renderBrowse(document.querySelector('#browseFilters .filter-btn.active')?.dataset.cat||'All');
    if(document.getElementById('livestockGrid')) renderLivestock();
  }catch(e){
    console.warn('FarmLink: live listings unavailable, showing demo catalogue only.', e);
  }
}