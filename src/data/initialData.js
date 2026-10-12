// Initial demonstration data for Hogwarts Cafe

export const INITIAL_SETTINGS = {
  cafeName: 'Hogwarts Cafe',
  brandSubtitle: "The Wizarding World's Dining Room",
  tagline: 'A LITTLE MAGIC IN EVERY SERVING.',
  currency: 'INR',
  currencySymbol: '₹',
  gstPercent: 5,
  defaultReservationDuration: 90, // in minutes
  openingHours: '08:00 AM – 11:00 PM',
  address: "North Cloister, Hogwarts Castle & Platform 9¾ Concourse",
  phone: '+91 800 464 9278',
  email: 'concierge@hogwartscafe.heritage',
  receiptFooter: 'Mischief Managed. Thank you for dining with us at Hogwarts Cafe!',
  creators: [
    'Vaishnavi Singh',
    'Vishakha Singh',
    'Vaishali Pandey',
    'Vaishnavi'
  ],
  creatorQuote: 'Designed with care, served with a little magic.'
};

export const INITIAL_TABLES = [
  // The Great Hall
  { id: 'T01', number: 'T01', area: 'The Great Hall', seats: 2, status: 'Occupied', currentOrderId: 'HWC-0004', occupants: { name: 'Albus Potter', partySize: 2, seatedAt: '19:40' } },
  { id: 'T02', number: 'T02', area: 'The Great Hall', seats: 4, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T03', number: 'T03', area: 'The Great Hall', seats: 4, status: 'Reserved', currentOrderId: null, occupants: null, reservationId: 'RES-101' },
  { id: 'T04', number: 'T04', area: 'The Great Hall', seats: 6, status: 'Occupied', currentOrderId: 'HWC-0005', occupants: { name: 'Vaishnavi Singh', partySize: 5, seatedAt: '19:15' } },
  { id: 'T05', number: 'T05', area: 'The Great Hall', seats: 2, status: 'Cleaning', currentOrderId: null, occupants: null },

  // The Library Lounge
  { id: 'T06', number: 'T06', area: 'The Library Lounge', seats: 2, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T07', number: 'T07', area: 'The Library Lounge', seats: 4, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T08', number: 'T08', area: 'The Library Lounge', seats: 4, status: 'Occupied', currentOrderId: 'HWC-0006', occupants: { name: 'Rohan Verma', partySize: 3, seatedAt: '19:50' } },
  { id: 'T09', number: 'T09', area: 'The Library Lounge', seats: 6, status: 'Reserved', currentOrderId: null, occupants: null, reservationId: 'RES-102' },

  // The Common Room
  { id: 'T10', number: 'T10', area: 'The Common Room', seats: 4, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T11', number: 'T11', area: 'The Common Room', seats: 4, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T12', number: 'T12', area: 'The Common Room', seats: 2, status: 'Occupied', currentOrderId: 'HWC-0007', occupants: { name: 'Ananya Sharma', partySize: 2, seatedAt: '20:05' } },

  // The Courtyard
  { id: 'T13', number: 'T13', area: 'The Courtyard', seats: 2, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T14', number: 'T14', area: 'The Courtyard', seats: 4, status: 'Cleaning', currentOrderId: null, occupants: null },
  { id: 'T15', number: 'T15', area: 'The Courtyard', seats: 6, status: 'Available', currentOrderId: null, occupants: null },

  // The Fireplace Section
  { id: 'T16', number: 'T16', area: 'The Fireplace Section', seats: 2, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T17', number: 'T17', area: 'The Fireplace Section', seats: 4, status: 'Reserved', currentOrderId: null, occupants: null, reservationId: 'RES-103' },
  { id: 'T18', number: 'T18', area: 'The Fireplace Section', seats: 4, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T19', number: 'T19', area: 'The Fireplace Section', seats: 6, status: 'Available', currentOrderId: null, occupants: null },
  { id: 'T20', number: 'T20', area: 'The Fireplace Section', seats: 2, status: 'Available', currentOrderId: null, occupants: null },
];

export const INITIAL_MENU = [
  // COFFEE & HOT DRINKS (Enchanted Coffee)
  {
    id: 'm-01',
    name: 'Hogwarts House Blend',
    category: 'Enchanted Coffee',
    price: 180,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Dark roasted Highland arabica infused with aromatic nutmeg, roasted chicory, and warm hazelnut cream.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }, { id: 'ing-02', amount: 0.05 }]
  },
  {
    id: 'm-02',
    name: 'Cinnamon Cappuccino',
    category: 'Enchanted Coffee',
    price: 210,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Velvety micro-foamed milk dusted with Ceylon bark cinnamon and brown Demerara sugar crystals.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }, { id: 'ing-02', amount: 0.15 }, { id: 'ing-04', amount: 0.01 }]
  },
  {
    id: 'm-03',
    name: 'Dark Forest Mocha',
    category: 'Enchanted Coffee',
    price: 230,
    isVeg: true,
    prepTime: '6 mins',
    available: true,
    description: 'Rich bittersweet Dutch cocoa and double espresso shot layered with blackberry compote and thick cream.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }, { id: 'ing-03', amount: 0.02 }, { id: 'ing-02', amount: 0.15 }]
  },
  {
    id: 'm-04',
    name: 'Vanilla Latte',
    category: 'Enchanted Coffee',
    price: 220,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Madagascan bourbon vanilla bean syrup blended with smooth espresso and scalded whole dairy milk.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }, { id: 'ing-02', amount: 0.18 }]
  },
  {
    id: 'm-05',
    name: 'Classic Espresso',
    category: 'Enchanted Coffee',
    price: 140,
    isVeg: true,
    prepTime: '3 mins',
    available: true,
    description: 'Intense 30ml single-origin extraction boasting a thick golden crema with smoky chocolate undertones.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }]
  },
  {
    id: 'm-06',
    name: 'Hot Chocolate',
    category: 'Enchanted Coffee',
    price: 190,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Molten Belgian dark and milk chocolate churned with warm full-cream milk, topped with torched marshmallow.',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-03', amount: 0.03 }, { id: 'ing-02', amount: 0.2 }, { id: 'ing-08', amount: 0.03 }]
  },
  {
    id: 'm-07',
    name: 'Caramel Macchiato',
    category: 'Enchanted Coffee',
    price: 240,
    isVeg: true,
    prepTime: '6 mins',
    available: true,
    description: 'Steamed milk with vanilla marked with bold espresso and crosshatched with burnt sea-salt butterscotch.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-01', amount: 0.02 }, { id: 'ing-02', amount: 0.18 }, { id: 'ing-04', amount: 0.02 }]
  },

  // SIGNATURE BEVERAGES (Butterbrew & Beverages)
  {
    id: 'm-08',
    name: 'Butterbrew',
    category: 'Butterbrew & Beverages',
    price: 220,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Traditional warm butterscotch draught brewed with brown sugar, ginger, cream, and a cloud of spiced foam.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-06', amount: 0.03 }, { id: 'ing-04', amount: 0.03 }, { id: 'ing-08', amount: 0.05 }]
  },
  {
    id: 'm-09',
    name: 'Chilled Butterbrew',
    category: 'Butterbrew & Beverages',
    price: 250,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Sparkling frosty draft of sweet butterscotch soda capped with thick cold vanilla-cream head.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-06', amount: 0.02 }, { id: 'ing-08', amount: 0.06 }]
  },
  {
    id: 'm-10',
    name: 'Pumpkin Juice',
    category: 'Butterbrew & Beverages',
    price: 160,
    isVeg: true,
    prepTime: '3 mins',
    available: true,
    description: 'Crisp pressed pumpkin nectar spiced with fresh allspice, clove, apple cider, and a drop of wild honey.',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-15', amount: 0.15 }, { id: 'ing-04', amount: 0.01 }]
  },
  {
    id: 'm-11',
    name: 'Elderflower Lemonade',
    category: 'Butterbrew & Beverages',
    price: 170,
    isVeg: true,
    prepTime: '3 mins',
    available: true,
    description: 'Wild English elderflower cordial shaken with crushed lemons, sparkling mineral spring water, and rosemary.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-04', amount: 0.02 }]
  },
  {
    id: 'm-12',
    name: 'Dragonfruit Iced Tea',
    category: 'Butterbrew & Beverages',
    price: 190,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Crimson herbal infusion of ripe dragonfruit pearls, Darjeeling black tea leaves, and sweet mint leaves.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-04', amount: 0.01 }]
  },
  {
    id: 'm-13',
    name: 'Strawberry Cream Frappe',
    category: 'Butterbrew & Beverages',
    price: 230,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Hand-picked British strawberries blended with clotted cream, crushed ice, and topped with ruby coulis.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-09', amount: 0.08 }, { id: 'ing-08', amount: 0.05 }, { id: 'ing-02', amount: 0.1 }]
  },

  // BREAKFAST (Breakfast at Hogwarts)
  {
    id: 'm-14',
    name: 'Full English Breakfast',
    category: 'Breakfast at Hogwarts',
    price: 380,
    isVeg: false,
    prepTime: '14 mins',
    available: true,
    description: 'Heritage sausages, poached farmhouse eggs, buttered button mushrooms, grilled tomato, baked beans, and sourdough.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-07', amount: 2 }, { id: 'ing-10', amount: 0.08 }, { id: 'ing-12', amount: 2 }]
  },
  {
    id: 'm-15',
    name: 'Buttered Croissants',
    category: 'Breakfast at Hogwarts',
    price: 180,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Two golden laminated pastries flaky with French Normandy butter, served warm with homemade plum preserve.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.08 }, { id: 'ing-06', amount: 0.05 }]
  },
  {
    id: 'm-16',
    name: 'Mushroom Toast',
    category: 'Breakfast at Hogwarts',
    price: 240,
    isVeg: true,
    prepTime: '8 mins',
    available: true,
    description: 'Wild forest chanterelles and cremini mushrooms pan-tossed in garlic thyme butter over thick toasted brioche.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-10', amount: 0.12 }, { id: 'ing-12', amount: 2 }, { id: 'ing-06', amount: 0.03 }]
  },
  {
    id: 'm-17',
    name: 'Herb & Cheese Omelette',
    category: 'Breakfast at Hogwarts',
    price: 260,
    isVeg: false,
    prepTime: '9 mins',
    available: true,
    description: 'Three whisked country eggs folded with mature Cheddar, fresh chives, garden parsley, and smoked paprika.',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-07', amount: 3 }, { id: 'ing-11', amount: 0.05 }]
  },
  {
    id: 'm-18',
    name: 'Pancake Stack',
    category: 'Breakfast at Hogwarts',
    price: 250,
    isVeg: true,
    prepTime: '10 mins',
    available: true,
    description: 'Fluffy buttermilk hotcakes layered with golden butter, berries, and drizzled with warm Canadian maple syrup.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.1 }, { id: 'ing-02', amount: 0.1 }, { id: 'ing-06', amount: 0.03 }]
  },
  {
    id: 'm-19',
    name: 'French Toast',
    category: 'Breakfast at Hogwarts',
    price: 230,
    isVeg: true,
    prepTime: '9 mins',
    available: true,
    description: 'Custard-soaked brioche golden griddled with cinnamon sugar, served with fresh chantilly cream and blackberries.',
    image: 'https://images.unsplash.com/photo-1484723091739-00821c430932?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-12', amount: 2 }, { id: 'ing-07', amount: 1 }, { id: 'ing-08', amount: 0.04 }]
  },

  // MAIN COURSE (Great Hall Mains)
  {
    id: 'm-20',
    name: 'Great Hall Sunday Roast',
    category: 'Great Hall Mains',
    price: 520,
    isVeg: false,
    prepTime: '20 mins',
    available: true,
    description: 'Slow roasted prime tenderloin cut served with crisp Yorkshire pudding, roasted parsnips, and rosemary jus.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-13', amount: 0.15 }, { id: 'ing-06', amount: 0.04 }]
  },
  {
    id: 'm-21',
    name: 'Creamy Mushroom Pasta',
    category: 'Great Hall Mains',
    price: 340,
    isVeg: true,
    prepTime: '13 mins',
    available: true,
    description: 'Fresh tagliatelle tossed in velvety garlic truffle cream, roasted portobellos, and aged parmesan shavings.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169b?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-10', amount: 0.1 }, { id: 'ing-08', amount: 0.06 }, { id: 'ing-11', amount: 0.03 }]
  },
  {
    id: 'm-22',
    name: 'Herb Roasted Chicken',
    category: 'Great Hall Mains',
    price: 420,
    isVeg: false,
    prepTime: '18 mins',
    available: true,
    description: 'Farm-raised chicken quarter basted in sage and thyme butter, served alongside crushed buttery butter potatoes.',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-14', amount: 0.3 }, { id: 'ing-13', amount: 0.15 }, { id: 'ing-06', amount: 0.03 }]
  },
  {
    id: 'm-23',
    name: 'Cottage Pie',
    category: 'Great Hall Mains',
    price: 360,
    isVeg: false,
    prepTime: '16 mins',
    available: true,
    description: 'Minced beef braised with peas and sweet carrots in dark Guinness gravy, topped with crested piped mash.',
    image: 'https://images.unsplash.com/photo-1584947897555-52467d020d20?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-13', amount: 0.2 }, { id: 'ing-06', amount: 0.04 }]
  },
  {
    id: 'm-24',
    name: "Hogwarts Shepherd's Pie",
    category: 'Great Hall Mains',
    price: 380,
    isVeg: false,
    prepTime: '16 mins',
    available: true,
    description: 'Slow-simmered tender minced lamb cooked with rosemary and root vegetables under golden crusted mash.',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-13', amount: 0.2 }, { id: 'ing-06', amount: 0.04 }]
  },
  {
    id: 'm-25',
    name: 'Grilled Vegetable Sandwich',
    category: 'Great Hall Mains',
    price: 260,
    isVeg: true,
    prepTime: '9 mins',
    available: true,
    description: 'Flame-charred bell peppers, zucchini, pesto genovese, and fresh mozzarella pressed between seeded panini.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-12', amount: 2 }, { id: 'ing-11', amount: 0.06 }]
  },
  {
    id: 'm-26',
    name: 'Cheese & Herb Pizza',
    category: 'Great Hall Mains',
    price: 320,
    isVeg: true,
    prepTime: '14 mins',
    available: true,
    description: 'Stone-baked thin crust sourdough topped with San Marzano tomato sauce, fresh basil, mozzarella, and gouda.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.15 }, { id: 'ing-11', amount: 0.1 }]
  },

  // DESSERTS (Magical Desserts)
  {
    id: 'm-27',
    name: 'Chocolate Cauldron Cake',
    category: 'Magical Desserts',
    price: 240,
    isVeg: true,
    prepTime: '7 mins',
    available: true,
    description: 'Decadent dark chocolate molten sponge served in an individual pot with overflowing warm ganache core.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-03', amount: 0.05 }, { id: 'ing-05', amount: 0.06 }, { id: 'ing-06', amount: 0.04 }]
  },
  {
    id: 'm-28',
    name: 'Treacle Tart',
    category: 'Magical Desserts',
    price: 190,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Golden syrup and breadcrumb shortcrust tart baked to perfection, served with a generous scoop of Cornish clotted cream.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.06 }, { id: 'ing-06', amount: 0.04 }, { id: 'ing-08', amount: 0.04 }]
  },
  {
    id: 'm-29',
    name: 'Chocolate Frog Brownie',
    category: 'Magical Desserts',
    price: 220,
    isVeg: false,
    prepTime: '5 mins',
    available: true,
    description: 'Fudgy 70% cacao brownie loaded with roasted walnuts and topped with an edible bronze chocolate figurine.',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-03', amount: 0.04 }, { id: 'ing-07', amount: 1 }, { id: 'ing-06', amount: 0.03 }]
  },
  {
    id: 'm-30',
    name: 'Strawberry Cheesecake',
    category: 'Magical Desserts',
    price: 260,
    isVeg: true,
    prepTime: '5 mins',
    available: true,
    description: 'Silky baked cream cheese over buttery biscuit crumble, finished with glazed wild English strawberry gelée.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-11', amount: 0.08 }, { id: 'ing-09', amount: 0.06 }, { id: 'ing-08', amount: 0.04 }]
  },
  {
    id: 'm-31',
    name: 'Vanilla Bean Pudding',
    category: 'Magical Desserts',
    price: 180,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Creamy English milk pudding slow-set with fresh vanilla pods, topped with crushed candied ginger shavings.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-02', amount: 0.15 }, { id: 'ing-08', amount: 0.04 }, { id: 'ing-04', amount: 0.02 }]
  },
  {
    id: 'm-32',
    name: 'Hogwarts Layered Cake',
    category: 'Magical Desserts',
    price: 280,
    isVeg: true,
    prepTime: '6 mins',
    available: true,
    description: 'Four-tier celebratory sponge layered with dark chocolate fudge, salted caramel, pistachio cream, and red currant jam.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.08 }, { id: 'ing-06', amount: 0.05 }, { id: 'ing-03', amount: 0.03 }]
  },

  // BAKERY & PASTRIES
  {
    id: 'm-33',
    name: 'Pumpkin Cinnamon Roll',
    category: 'Bakery & Pastries',
    price: 160,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Freshly baked spiral dough swirled with spiced pumpkin purée, cinnamon sugar, and maple cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.07 }, { id: 'ing-15', amount: 0.04 }]
  },
  {
    id: 'm-34',
    name: 'Golden Snitch Macarons',
    category: 'Bakery & Pastries',
    price: 210,
    isVeg: true,
    prepTime: '3 mins',
    available: true,
    description: 'Trio of delicate French almond meringue shells filled with honey caramel and brushed with edible 24k gold shimmer.',
    image: 'https://images.unsplash.com/photo-1569864321390-dc758a0e363d?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-04', amount: 0.04 }, { id: 'ing-06', amount: 0.02 }]
  },

  // SEASONAL SPECIALS
  {
    id: 'm-35',
    name: 'Winter Berry Scone',
    category: 'Seasonal Specials',
    price: 150,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Warm traditional crumbly scone packed with dried currants and winter berries, served with clotted cream.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-05', amount: 0.06 }, { id: 'ing-09', amount: 0.04 }, { id: 'ing-08', amount: 0.03 }]
  },
  {
    id: 'm-36',
    name: 'Spiced Cider Punch',
    category: 'Seasonal Specials',
    price: 180,
    isVeg: true,
    prepTime: '4 mins',
    available: true,
    description: 'Simmered apple cider steeped with star anise, orange peel, cinnamon stick, and wild wildflower honey.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    ingredientsUsed: [{ id: 'ing-04', amount: 0.02 }]
  }
];

export const INITIAL_INVENTORY = [
  { id: 'ing-01', name: 'Coffee beans', unit: 'kg', currentStock: 18.5, minStock: 5.0, costPerUnit: 780, supplier: 'Highland Estate Roasters' },
  { id: 'ing-02', name: 'Milk', unit: 'L', currentStock: 42.0, minStock: 15.0, costPerUnit: 64, supplier: 'Cotswolds Dairy Co.' },
  { id: 'ing-03', name: 'Cocoa powder', unit: 'kg', currentStock: 8.0, minStock: 2.5, costPerUnit: 520, supplier: 'Belgian Mill Imports' },
  { id: 'ing-04', name: 'Sugar', unit: 'kg', currentStock: 24.0, minStock: 8.0, costPerUnit: 48, supplier: 'Heritage Sugar Refiners' },
  { id: 'ing-05', name: 'Flour', unit: 'kg', currentStock: 35.0, minStock: 10.0, costPerUnit: 55, supplier: 'Wessex Windmill Flour' },
  { id: 'ing-06', name: 'Butter', unit: 'kg', currentStock: 12.0, minStock: 4.0, costPerUnit: 480, supplier: 'Cornish Creamery' },
  { id: 'ing-07', name: 'Eggs', unit: 'units', currentStock: 120, minStock: 36, costPerUnit: 9, supplier: 'Farmhouse Free-Range' },
  { id: 'ing-08', name: 'Cream', unit: 'L', currentStock: 9.5, minStock: 4.0, costPerUnit: 220, supplier: 'Cotswolds Dairy Co.' },
  { id: 'ing-09', name: 'Strawberries', unit: 'kg', currentStock: 4.2, minStock: 3.0, costPerUnit: 260, supplier: 'Kent Berry Orchards' },
  { id: 'ing-10', name: 'Mushrooms', unit: 'kg', currentStock: 3.8, minStock: 2.5, costPerUnit: 190, supplier: 'Forest Mushroom Foragers' },
  { id: 'ing-11', name: 'Cheese', unit: 'kg', currentStock: 7.2, minStock: 3.0, costPerUnit: 620, supplier: 'Somerset Cheese Makers' },
  { id: 'ing-12', name: 'Bread', unit: 'units', currentStock: 28, minStock: 10, costPerUnit: 45, supplier: 'Artisan Sourdough Bakery' },
  { id: 'ing-13', name: 'Potatoes', unit: 'kg', currentStock: 32.0, minStock: 12.0, costPerUnit: 35, supplier: 'Yorkshire Root Farms' },
  { id: 'ing-14', name: 'Chicken', unit: 'kg', currentStock: 11.5, minStock: 5.0, costPerUnit: 280, supplier: 'Valley Poultry Produce' },
  { id: 'ing-15', name: 'Pumpkin juice concentrate', unit: 'L', currentStock: 6.8, minStock: 3.0, costPerUnit: 310, supplier: 'Hagrid Garden Harvest' },
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-01',
    name: 'Vaishnavi Singh',
    phone: '+91 98765 43210',
    visitCount: 14,
    totalSpending: 8450,
    lastVisit: '2026-10-12',
    tag: 'VIP Regular',
    notes: 'Prefers quiet table in Great Hall. Loves Butterbrew and Sunday Roast.'
  },
  {
    id: 'cust-02',
    name: 'Vishakha Singh',
    phone: '+91 98112 34567',
    visitCount: 11,
    totalSpending: 6120,
    lastVisit: '2026-10-11',
    tag: 'Regular',
    notes: 'Favorite dessert is Chocolate Cauldron Cake with Vanilla Latte.'
  },
  {
    id: 'cust-03',
    name: 'Vaishali Pandey',
    phone: '+91 98223 54321',
    visitCount: 9,
    totalSpending: 5280,
    lastVisit: '2026-10-12',
    tag: 'Regular',
    notes: 'Often reserves in Library Lounge for quiet study sessions.'
  },
  {
    id: 'cust-04',
    name: 'Vaishnavi',
    phone: '+91 98700 11223',
    visitCount: 12,
    totalSpending: 7600,
    lastVisit: '2026-10-10',
    tag: 'VIP Regular',
    notes: 'Always orders Dark Forest Mocha with extra foam.'
  },
  {
    id: 'cust-05',
    name: 'Rohan Verma',
    phone: '+91 98450 12345',
    visitCount: 6,
    totalSpending: 3400,
    lastVisit: '2026-10-12',
    tag: 'Regular',
    notes: 'Fond of Shepherd’s Pie and hot Elderflower drinks.'
  },
  {
    id: 'cust-06',
    name: 'Ananya Sharma',
    phone: '+91 98711 22334',
    visitCount: 4,
    totalSpending: 2150,
    lastVisit: '2026-10-12',
    tag: 'Returning',
    notes: 'Vegetarian preferences. Enjoys Mushroom Toast.'
  },
  {
    id: 'cust-07',
    name: 'Aarav Mehta',
    phone: '+91 98334 56789',
    visitCount: 3,
    totalSpending: 1680,
    lastVisit: '2026-10-09',
    tag: 'Returning',
    notes: 'Family visits on weekends.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-01',
    orderNumber: 'HWC-0001',
    date: '2026-10-10',
    time: '12:30',
    customerName: 'Vishakha Singh',
    customerPhone: '+91 98112 34567',
    tableNumber: 'T02',
    items: [
      { id: 'm-08', name: 'Butterbrew', price: 220, quantity: 2 },
      { id: 'm-21', name: 'Creamy Mushroom Pasta', price: 340, quantity: 1 },
      { id: 'm-27', name: 'Chocolate Cauldron Cake', price: 240, quantity: 1 }
    ],
    subtotal: 1020,
    discount: 50,
    tax: 48.5,
    total: 1018.5,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Completed',
    instructions: 'Less sugar in Butterbrew'
  },
  {
    id: 'ord-02',
    orderNumber: 'HWC-0002',
    date: '2026-10-11',
    time: '14:15',
    customerName: 'Vaishali Pandey',
    customerPhone: '+91 98223 54321',
    tableNumber: 'T07',
    items: [
      { id: 'm-03', name: 'Dark Forest Mocha', price: 230, quantity: 2 },
      { id: 'm-16', name: 'Mushroom Toast', price: 240, quantity: 2 },
      { id: 'm-28', name: 'Treacle Tart', price: 190, quantity: 1 }
    ],
    subtotal: 1130,
    discount: 0,
    tax: 56.5,
    total: 1186.5,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Completed',
    instructions: 'Serve tart with clotted cream'
  },
  {
    id: 'ord-03',
    orderNumber: 'HWC-0003',
    date: '2026-10-11',
    time: '19:40',
    customerName: 'Vaishnavi',
    customerPhone: '+91 98700 11223',
    tableNumber: 'T10',
    items: [
      { id: 'm-20', name: 'Great Hall Sunday Roast', price: 520, quantity: 2 },
      { id: 'm-09', name: 'Chilled Butterbrew', price: 250, quantity: 2 },
      { id: 'm-30', name: 'Strawberry Cheesecake', price: 260, quantity: 1 }
    ],
    subtotal: 1800,
    discount: 100,
    tax: 85.0,
    total: 1785.0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Completed',
    instructions: 'Well-done roast cut'
  },
  {
    id: 'ord-04',
    orderNumber: 'HWC-0004',
    date: '2026-10-12',
    time: '19:45',
    customerName: 'Albus Potter',
    customerPhone: '+91 98888 77766',
    tableNumber: 'T01',
    items: [
      { id: 'm-01', name: 'Hogwarts House Blend', price: 180, quantity: 1 },
      { id: 'm-08', name: 'Butterbrew', price: 220, quantity: 1 },
      { id: 'm-29', name: 'Chocolate Frog Brownie', price: 220, quantity: 1 }
    ],
    subtotal: 620,
    discount: 0,
    tax: 31.0,
    total: 651.0,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Preparing',
    instructions: 'Extra hot coffee'
  },
  {
    id: 'ord-05',
    orderNumber: 'HWC-0005',
    date: '2026-10-12',
    time: '19:20',
    customerName: 'Vaishnavi Singh',
    customerPhone: '+91 98765 43210',
    tableNumber: 'T04',
    items: [
      { id: 'm-20', name: 'Great Hall Sunday Roast', price: 520, quantity: 3 },
      { id: 'm-08', name: 'Butterbrew', price: 220, quantity: 4 },
      { id: 'm-27', name: 'Chocolate Cauldron Cake', price: 240, quantity: 3 }
    ],
    subtotal: 3160,
    discount: 150,
    tax: 150.5,
    total: 3160.5,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Served',
    instructions: 'VIP guest party'
  },
  {
    id: 'ord-06',
    orderNumber: 'HWC-0006',
    date: '2026-10-12',
    time: '19:55',
    customerName: 'Rohan Verma',
    customerPhone: '+91 98450 12345',
    tableNumber: 'T08',
    items: [
      { id: 'm-24', name: "Hogwarts Shepherd's Pie", price: 380, quantity: 2 },
      { id: 'm-10', name: 'Pumpkin Juice', price: 160, quantity: 2 }
    ],
    subtotal: 1080,
    discount: 0,
    tax: 54.0,
    total: 1134.0,
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    status: 'Preparing',
    instructions: ''
  },
  {
    id: 'ord-07',
    orderNumber: 'HWC-0007',
    date: '2026-10-12',
    time: '20:10',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98711 22334',
    tableNumber: 'T12',
    items: [
      { id: 'm-16', name: 'Mushroom Toast', price: 240, quantity: 1 },
      { id: 'm-11', name: 'Elderflower Lemonade', price: 170, quantity: 1 }
    ],
    subtotal: 410,
    discount: 0,
    tax: 20.5,
    total: 430.5,
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    status: 'Pending',
    instructions: 'Crisp toast'
  }
];

export const INITIAL_RESERVATIONS = [
  {
    id: 'RES-101',
    customerName: 'Minerva McGonagall',
    phone: '+91 99100 22334',
    guests: 4,
    date: '2026-10-12',
    time: '20:30',
    duration: 90,
    section: 'The Great Hall',
    tableId: 'T03',
    tableNumber: 'T03',
    status: 'Confirmed',
    notes: 'Staff banquet table request with high back seating.'
  },
  {
    id: 'RES-102',
    customerName: 'Filius Flitwick',
    phone: '+91 98222 33445',
    guests: 5,
    date: '2026-10-12',
    time: '21:00',
    duration: 90,
    section: 'The Library Lounge',
    tableId: 'T09',
    tableNumber: 'T09',
    status: 'Confirmed',
    notes: 'Quiet celebratory dinner. High shelf area requested.'
  },
  {
    id: 'RES-103',
    customerName: 'Severus Snape',
    phone: '+91 97333 44556',
    guests: 3,
    date: '2026-10-12',
    time: '20:45',
    duration: 90,
    section: 'The Fireplace Section',
    tableId: 'T17',
    tableNumber: 'T17',
    status: 'Confirmed',
    notes: 'Dim hearth lighting preferred.'
  },
  {
    id: 'RES-104',
    customerName: 'Pomona Sprout',
    phone: '+91 96444 55667',
    guests: 4,
    date: '2026-10-13',
    time: '13:00',
    duration: 90,
    section: 'The Courtyard',
    tableId: 'T14',
    tableNumber: 'T14',
    status: 'Confirmed',
    notes: 'Herbal tea pairing request.'
  },
  {
    id: 'RES-105',
    customerName: 'Luna Lovegood',
    phone: '+91 95555 66778',
    guests: 2,
    date: '2026-10-11',
    time: '18:00',
    duration: 90,
    section: 'The Common Room',
    tableId: 'T12',
    tableNumber: 'T12',
    status: 'Completed',
    notes: 'Window seat view.'
  }
];
