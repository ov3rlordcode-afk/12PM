export type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
  brand: string;
  type: string; // this will be used for categories
  shopImage: string;
  openHours: Record<string, { open: string; close: string }>;
};

// --- Mock Items ---
export const mockItems: Item[] = [
  {
    id: 3,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Asda Straiton Superstore",
    brand: "Asda",
    type: "Grocery",
    shopImage:
      "https://static.where-e.com/United_Kingdom/Asda-Straiton-Superstore_0c7dbd6b34741eaee989aa4992a9f6d5.jpg",
    openHours: {
      Mon: { open: "07:00", close: "22:00" },
      Tue: { open: "07:00", close: "22:00" },
      Wed: { open: "07:00", close: "22:00" },
      Thu: { open: "07:00", close: "22:00" },
      Fri: { open: "07:00", close: "22:00" },
      Sat: { open: "07:00", close: "22:00" },
      Sun: { open: "08:00", close: "20:00" },
    },
  },
  // Add more items here...
];

// --- Generate Categories dynamically from items ---
export const categories: string[] = [
  "All",
  ...Array.from(new Set(mockItems.map((item) => item.type))),
];
