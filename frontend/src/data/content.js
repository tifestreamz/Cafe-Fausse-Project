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

const dish = (name, price, desc, src) => ({ name, price, desc, src });

export const MENU_CATEGORIES = [
  {
    key: "starters",
    label: "ANTIPASTI",
    title: "Starters",
    items: [
      dish("Bruschetta", "$8.50", "Fresh tomatoes, basil, olive oil, and toasted baguette slices.", IMAGES.dishBruschetta),
      dish("Caesar Salad", "$9.00", "Crisp romaine with homemade Caesar dressing.", IMAGES.dishCaesarSalad),
    ],
  },
  {
    key: "mains",
    label: "SECONDI",
    title: "Main Courses",
    items: [
      dish("Grilled Salmon", "$22.00", "Served with lemon butter sauce and seasonal vegetables.", IMAGES.dishSalmon),
      dish("Ribeye Steak", "$28.00", "12 oz prime cut with garlic mashed potatoes.", IMAGES.galleryRibeye),
      dish("Vegetable Risotto", "$18.00", "Creamy Arborio rice with wild mushrooms.", IMAGES.dishRisotto),
    ],
  },
  {
    key: "desserts",
    label: "DOLCI",
    title: "Desserts",
    items: [
      dish("Tiramisu", "$7.50", "Classic Italian dessert with mascarpone.", IMAGES.dishTiramisu),
      dish("Cheesecake", "$7.00", "Creamy cheesecake with berry compote.", IMAGES.dishCheesecake),
    ],
  },
  {
    key: "beverages",
    label: "BEVANDE",
    title: "Beverages",
    items: [
      dish("Red Wine (Glass)", "$10.00", "A selection of Italian reds.", IMAGES.bevRedWine),
      dish("White Wine (Glass)", "$9.00", "Crisp and refreshing.", IMAGES.bevWhiteWine),
      dish("Craft Beer", "$6.00", "Local artisan brews.", IMAGES.bevCraftBeer),
      dish("Espresso", "$3.00", "Strong and aromatic.", IMAGES.bevEspresso),
    ],
  },
];

export const FEATURED_DISHES = [
  { name: "Ribeye Steak", price: "$28.00", desc: "12 oz prime cut, garlic mashed potatoes.", src: IMAGES.galleryRibeye },
  { name: "Grilled Salmon", price: "$22.00", desc: "Lemon butter sauce, seasonal vegetables.", src: IMAGES.dishSalmon },
  { name: "Tiramisu", price: "$7.50", desc: "Classic Italian dessert with mascarpone.", src: IMAGES.dishTiramisu },
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
