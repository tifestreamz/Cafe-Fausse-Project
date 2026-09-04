import homeHero from "../assets/images/home-hero.webp";
import galleryEvent from "../assets/images/gallery-event.webp";
import galleryInterior from "../assets/images/gallery-interior.webp";
import galleryRibeye from "../assets/images/gallery-ribeye.webp";

// Dishes & Drinks
import dishBruschetta from "../assets/images/dish-bruschetta.jpg";
import dishCaesarSalad from "../assets/images/dish-caesar-salad.jpg";
import dishSalmon from "../assets/images/dish-salmon.jpg";
import dishRisotto from "../assets/images/dish-risotto.jpg";
import dishTiramisu from "../assets/images/dish-tiramisu.jpg";
import dishCheesecake from "../assets/images/dish-cheesecake.jpg";
import bevRedWine from "../assets/images/bev-red-wine.jpg";
import bevWhiteWine from "../assets/images/bev-white-wine.jpg";
import bevCraftBeer from "../assets/images/bev-craft-beer.jpg";
import bevEspresso from "../assets/images/bev-espresso.jpg";

// Atmospheric & Heroes
import menuHero from "../assets/images/menu-hero.jpg";
import reservationsHero from "../assets/images/reservations-hero.jpg";
import aboutHero from "../assets/images/about-hero.jpg";
import storyChefPlating from "../assets/images/story-chef-plating.jpg";

// Founders & Extra Gallery
import founderAntonio from "../assets/images/founder-antonio.jpg";
import founderMaria from "../assets/images/founder-maria.jpg";
import galleryWineCellar from "../assets/images/gallery-wine-cellar.jpg";
import galleryKitchenPass from "../assets/images/gallery-kitchen-pass.jpg";
import galleryEntrance from "../assets/images/gallery-entrance.jpg";

export const CONTACT = {
  address: "1234 Culinary Ave, Suite 100, Washington, DC 20002",
  phone: "(202) 555-4567",
  email: "info@cafefausse.com",
  hours: "Mon–Sat 5:00PM–11:00PM · Sun 5:00PM–9:00PM",
  hoursLines: ["Monday – Saturday: 5:00PM – 11:00PM", "Sunday: 5:00PM – 9:00PM"],
};

export const IMAGES = {
  homeHero,
  galleryEvent,
  galleryInterior,
  galleryRibeye,
  dishBruschetta,
  dishCaesarSalad,
  dishSalmon,
  dishRisotto,
  dishTiramisu,
  dishCheesecake,
  bevRedWine,
  bevWhiteWine,
  bevCraftBeer,
  bevEspresso,
  menuHero,
  reservationsHero,
  aboutHero,
  storyChefPlating,
  founderAntonio,
  founderMaria,
  galleryWineCellar,
  galleryKitchenPass,
  galleryEntrance,
};

const dish = (id, name, price, desc, src, category, details, ingredients, dietary, pairing) => ({
  id,
  name,
  price,
  desc,
  src,
  category,
  details: details || desc,
  ingredients: ingredients || [],
  dietary: dietary || [],
  pairing: pairing || null,
});

export const MENU_CATEGORIES = [
  {
    key: "starters",
    label: "ANTIPASTI",
    title: "Starters",
    items: [
      dish(
        "bruschetta",
        "Bruschetta",
        "$8.50",
        "Fresh tomatoes, basil, olive oil, and toasted baguette slices.",
        IMAGES.dishBruschetta,
        "ANTIPASTI",
        "Heirloom tomatoes marinated in first-press Sicilian olive oil and hand-torn sweet basil, piled high over garlic-rubbed grilled artisan sourdough with a 12-year aged Modena balsamic reduction.",
        ["Grilled rustic sourdough", "Vine-ripened Roma tomatoes", "Fresh sweet basil", "Garlic confit", "Aged Modena balsamic glaze", "Sicilian EVOO"],
        ["Vegetarian", "Dairy-Free"],
        "Pinot Grigio delle Venezie"
      ),
      dish(
        "caesar-salad",
        "Caesar Salad",
        "$9.00",
        "Crisp romaine with homemade Caesar dressing.",
        IMAGES.dishCaesarSalad,
        "ANTIPASTI",
        "Crisp organic baby romaine hearts tossed in our signature emulsion with white anchovies, topped with delicate ribbons of 24-month Parmigiano-Reggiano and warm rosemary-garlic croutons.",
        ["Baby romaine hearts", "24-month Parmigiano-Reggiano", "Housemade focaccia croutons", "Anchovy-garlic emulsion", "Cracked Tellicherry pepper"],
        ["House Classic"],
        "Gavi di Gavi"
      ),
    ],
  },
  {
    key: "mains",
    label: "SECONDI",
    title: "Main Courses",
    items: [
      dish(
        "salmon",
        "Grilled Salmon",
        "$22.00",
        "Served with lemon butter sauce and seasonal vegetables.",
        IMAGES.dishSalmon,
        "SECONDI",
        "Pan-seared wild Atlantic salmon fillet with crispy golden skin, resting alongside tender charred asparagus spears and roasted baby carrots, bathed in a velvety lemon-herb butter sauce.",
        ["Wild-caught Atlantic salmon", "Charred asparagus", "Lemon-thyme velouté", "Roasted heirloom carrots", "Sea salt crystals"],
        ["Gluten-Free", "Rich in Omega-3"],
        "Chardonnay or Crisp Vermentino"
      ),
      dish(
        "ribeye",
        "Ribeye Steak",
        "$28.00",
        "12 oz prime cut with garlic mashed potatoes.",
        IMAGES.galleryRibeye,
        "SECONDI",
        "Prime 12 oz USDA beef cut grilled to temperature over hardwood embers, served over silky roasted garlic Yukon Gold mashed potatoes and drizzled with a rich Chianti wine demi-glace.",
        ["12 oz USDA Prime Ribeye", "Yukon Gold garlic purée", "Rosemary compound butter", "Charred shallots", "Red wine reduction"],
        ["Gluten-Free", "Chef's Signature"],
        "Barolo DOCG or Chianti Classico"
      ),
      dish(
        "risotto",
        "Vegetable Risotto",
        "$18.00",
        "Creamy Arborio rice with wild mushrooms.",
        IMAGES.dishRisotto,
        "SECONDI",
        "Slow-simmered Carnaroli rice folded with pan-roasted wild porcini and cremini mushrooms, enriched with vegetable fumet, cold-pressed olive oil, and aged Parmigiano-Reggiano with black truffle essence.",
        ["Aged Carnaroli rice", "Wild porcini & cremini mushrooms", "White wine broth", "Pecorino Romano", "Black truffle oil"],
        ["Vegetarian", "Gluten-Free"],
        "Nebbiolo or Pinot Nero"
      ),
    ],
  },
  {
    key: "desserts",
    label: "DOLCI",
    title: "Desserts",
    items: [
      dish(
        "tiramisu",
        "Tiramisu",
        "$7.50",
        "Classic Italian dessert with mascarpone.",
        IMAGES.dishTiramisu,
        "DOLCI",
        "The quintessential Italian dolce. Delicate Savoiardi ladyfingers soaked in freshly brewed Illy espresso and Marsala wine, layered with airy whipped mascarpone cream and finished with Valrhona cocoa.",
        ["Imported Savoiardi ladyfingers", "Illy espresso", "Whipped mascarpone zabaglione", "Valrhona dark cocoa", "Marsala wine"],
        ["Vegetarian", "Traditional Recipe"],
        "Vin Santo or Espresso Romano"
      ),
      dish(
        "cheesecake",
        "Cheesecake",
        "$7.00",
        "Creamy cheesecake with berry compote.",
        IMAGES.dishCheesecake,
        "DOLCI",
        "Silky baked Italian ricotta cheesecake infused with fresh lemon zest on a toasted honey-graham crust, topped with a luscious coulis of simmered blackberries and wild raspberries.",
        ["Fresh Italian ricotta", "Graham butter crust", "Macerated blackberries & raspberries", "Wild berry coulis", "Candied lemon peel"],
        ["Vegetarian"],
        "Moscato d'Asti"
      ),
    ],
  },
  {
    key: "beverages",
    label: "BEVANDE",
    title: "Beverages",
    items: [
      dish(
        "red-wine",
        "Red Wine (Glass)",
        "$10.00",
        "A selection of Italian reds.",
        IMAGES.bevRedWine,
        "BEVANDE",
        "Curated glass pour of premium Tuscan Sangiovese and Piedmontese varietals, displaying bold notes of black cherry, sun-dried plums, violet, and polished oak tannins.",
        ["100% Sangiovese / Super Tuscan blend", "Aged in French oak barriques"],
        ["Vegan", "Organic Selection"],
        "Pairs with Ribeye & Antipasti"
      ),
      dish(
        "white-wine",
        "White Wine (Glass)",
        "$9.00",
        "Crisp and refreshing.",
        IMAGES.bevWhiteWine,
        "BEVANDE",
        "Vibrant, bone-dry Northern Italian white featuring delicate aromas of golden apple, honeysuckle, and crushed wet stone with a lively, refreshing citrus finish.",
        ["Northern Italian Pinot Grigio & Friuli varietals"],
        ["Vegan", "Organic Selection"],
        "Pairs with Grilled Salmon & Risotto"
      ),
      dish(
        "craft-beer",
        "Craft Beer",
        "$6.00",
        "Local artisan brews.",
        IMAGES.bevCraftBeer,
        "BEVANDE",
        "Rotating craft taps showcasing the finest independent artisanal breweries from the greater Washington DC area, poured cold with a rich, aromatic head.",
        ["Local artisan hops", "Malted barley", "Washington craft brewery selection"],
        ["Artisan Brew"],
        "Pairs with Bruschetta & Starters"
      ),
      dish(
        "espresso",
        "Espresso",
        "$3.00",
        "Strong and aromatic.",
        IMAGES.bevEspresso,
        "BEVANDE",
        "Single-origin Italian roast pulled with precise temperature and pressure, presenting a thick golden crema, dark chocolate undertones, and an enduring velvet finish.",
        ["Single-origin Arabica & Robusta Italian roast"],
        ["Gluten-Free", "Zero Sugar"],
        "Perfect conclusion to your meal"
      ),
    ],
  },
];

export const FEATURED_DISHES = [
  MENU_CATEGORIES[1].items[1], // Ribeye Steak
  MENU_CATEGORIES[1].items[0], // Grilled Salmon
  MENU_CATEGORIES[2].items[0], // Tiramisu
];

export const GALLERY_IMAGES = [
  { id: "gal-0", src: IMAGES.galleryInterior, caption: "The Dining Room" },
  { id: "gal-1", src: IMAGES.galleryRibeye, caption: "Ribeye Steak" },
  { id: "gal-2", src: IMAGES.galleryEvent, caption: "A Private Celebration" },
  { id: "gal-3", src: IMAGES.galleryEntrance, caption: "Our Entrance" },
  { id: "gal-4", src: IMAGES.dishBruschetta, caption: "Bruschetta" },
  { id: "gal-5", src: IMAGES.galleryWineCellar, caption: "The Wine Cellar" },
  { id: "gal-6", src: IMAGES.galleryKitchenPass, caption: "Behind the Pass" },
  { id: "gal-7", src: IMAGES.dishTiramisu, caption: "Tiramisu" },
];

export const AWARDS = [
  { name: "Culinary Excellence Award", year: "2022" },
  { name: "Restaurant of the Year", year: "2023" },
  { name: "Best Fine Dining Experience — Foodie Magazine", year: "2023" },
];

export const REVIEWS = [
  { quote: "Exceptional ambiance and unforgettable flavors.", source: "Gourmet Review" },
  { quote: "A must-visit restaurant for food enthusiasts.", source: "The Daily Bite" },
];

export const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "MENU", to: "/menu" },
  { label: "RESERVATIONS", to: "/reservations" },
  { label: "ABOUT US", to: "/about" },
  { label: "GALLERY", to: "/gallery" },
];

export const ABOUT_STORY =
  "Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that reflects both quality and creativity — built on excellent food, warm hospitality, and locally sourced ingredients.";

export const FOUNDERS = [
  {
    name: "Chef Antonio Rossi",
    bio: "Trained in kitchens across Bologna and Rome before returning to the States, Antonio built Café Fausse's menu around the dishes he grew up on — reworked with a lighter, modern hand. He still walks the dining room most nights, plate in hand.",
    src: IMAGES.founderAntonio,
  },
  {
    name: "Maria Lopez",
    bio: "Maria oversees every detail front-of-house, from the seasonal wine list to the relationships with the local farms that supply Café Fausse's produce. Her belief is simple: exceptional food deserves an equally exceptional welcome.",
    src: IMAGES.founderMaria,
  },
];
