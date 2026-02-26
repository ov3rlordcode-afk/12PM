export type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
  brand: string;
  type: string; // category
  shopImage: string;
  openHours: Record<string, { open: string; close: string }>;
};

// --- Mock Items ---
export const mockItems: Item[] = [
  {
    id: 1,
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
  {
    id: 2,
    name: "Milk",
    price: 1.5,
    image: "/images/milk.jpg",
    shop: "Tescos Central",
    brand: "Tescos",
    type: "Grocery",
    shopImage:
      "https://static.where-e.com/United_Kingdom/Tescos-Central_12345.jpg",
    openHours: {
      Mon: { open: "06:00", close: "22:00" },
      Tue: { open: "06:00", close: "22:00" },
      Wed: { open: "06:00", close: "22:00" },
      Thu: { open: "06:00", close: "22:00" },
      Fri: { open: "06:00", close: "22:00" },
      Sat: { open: "06:00", close: "22:00" },
      Sun: { open: "07:00", close: "20:00" },
    },
  },
  {
    id: 3,
    name: "Eggs",
    price: 2.5,
    image: "/images/eggs.jpg",
    shop: "Asda Straiton Superstore",
    brand: "Asda",
    type: "Grocery",
    shopImage: "https://monkeybanners.co.uk/app/uploads/2020/05/Asda-logo.png",
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
  {
    id: 4,
    name: "Cheese",
    price: 3.0,
    image: "/images/cheese.jpg",
    shop: "Tescos Central",
    brand: "Tescos",
    type: "Dairy",
    shopImage:
      "https://static.where-e.com/United_Kingdom/Tescos-Central_12345.jpg",
    openHours: {
      Mon: { open: "06:00", close: "22:00" },
      Tue: { open: "06:00", close: "22:00" },
      Wed: { open: "06:00", close: "22:00" },
      Thu: { open: "06:00", close: "22:00" },
      Fri: { open: "06:00", close: "22:00" },
      Sat: { open: "06:00", close: "22:00" },
      Sun: { open: "07:00", close: "20:00" },
    },
  },
];

// --- Generate Categories dynamically from items ---
export const categories: string[] = [
  "All",
  ...Array.from(new Set(mockItems.map((item) => item.type))),
];
