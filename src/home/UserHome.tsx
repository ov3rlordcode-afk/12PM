import React, { useMemo, useState } from "react";
import "./UserHome.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./components/BrandCard";
import LocationCard from "./components/location/LocationCard";
import ItemCard from "./components/ItemCard";
import AvatarDropdown from "./components/AvatarDropdown";
import CategoryButton from "./components/CategoryButton";
import Cart from "./components/cart/Cart";

type Props = {
  name: string;
  city: string;
  onLogout: () => void;
};

export default function UserHome({ name, city, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  /* ================= FILTERED DATA ================= */
  const filteredItems = useMemo(() => {
    return mockItems.filter((item) =>
      [item.name, item.shop, item.brand]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  // GROUP BY BRAND
  const brands = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.brand]) grouped[item.brand] = [];
      grouped[item.brand].push(item);
    });
    return grouped;
  }, [filteredItems]);

  // GET UNIQUE SHOPS FOR SELECTED BRAND
  const brandLocations = useMemo(() => {
    if (!selectedBrand) return [];
    const unique = new Map<string, Item>();
    filteredItems
      .filter((item) => item.brand === selectedBrand)
      .forEach((item) => {
        if (!unique.has(item.shop)) unique.set(item.shop, item);
      });
    return Array.from(unique.values());
  }, [selectedBrand, filteredItems]);

  // GET ITEMS FOR SELECTED SHOP
  const shopItems = useMemo(() => {
    if (!selectedShop) return [];
    return filteredItems.filter(
      (item) =>
        item.shop === selectedShop &&
        (shopCategory === "All" || item.type === shopCategory)
    );
  }, [selectedShop, shopCategory, filteredItems]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart]
  );

  /* ================= CART ACTIONS ================= */
  const addToCart = (item: Item) => {
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (!cart.length) return;
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: Date.now(),
      customer: name,
      city,
      items: cart,
      total: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    setCart([]);
    setCartOpen(false);
    setOrderSuccess(true);
  };

  /* ================= NAVIGATION ================= */
  const goHome = () => {
    setSelectedBrand(null);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
  };

  const selectBrand = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
  };

  const selectShop = (shop: string) => {
    setSelectedShop(shop);
    setShopCategory("All");
    setSearch("");
  };

  /* ================= RENDER ================= */
  return (
    <div className="userHome">
      <div className="boxedContainer">
        {/* NAVBAR */}
        <nav className="homeNavbar">
          <div className="navLeft">
            <h2 className="logo" onClick={goHome}>
              Swift2Me
            </h2>
            <ul className="navMenu">
              <li onClick={goHome}>Home</li>
              <li onClick={() => selectBrand("")}>Brands</li>
              <li
                className="navItem"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                Orders
                {dropdownOpen && (
                  <div className="dropdownMenu">
                    <div className="dropdownItem">Pending Orders</div>
                    <div className="dropdownItem">Completed Orders</div>
                    <div className="dropdownItem">Cancelled Orders</div>
                  </div>
                )}
              </li>
              <li onClick={() => alert("Profile page coming soon!")}>
                Profile
              </li>
            </ul>
          </div>

          <div className="navRight">
            <input
              type="text"
              placeholder="Search stores, brands or items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="searchInput"
            />

            <Cart
              cart={cart}
              cartOpen={cartOpen}
              setCartOpen={setCartOpen}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
              totalPrice={totalPrice}
              orderSuccess={orderSuccess}
              setOrderSuccess={setOrderSuccess}
            />

            <AvatarDropdown onLogout={onLogout} />
          </div>
        </nav>

        {/* MAIN CONTENT */}
        {!selectedBrand && !selectedShop && (
          <div className="itemsGrid">
            {Object.entries(brands).length ? (
              Object.entries(brands).map(([brandName, items]) => (
                <BrandCard
                  key={brandName}
                  brandName={brandName}
                  items={items}
                  onViewBrand={() => selectBrand(brandName)}
                />
              ))
            ) : (
              <p className="noResults">No brands found.</p>
            )}
          </div>
        )}

        {selectedBrand && !selectedShop && (
          <>
            <div className="brandHeader">
              <h2>{selectedBrand} Locations</h2>
              <button className="backBtn" onClick={goHome}>
                ← Back
              </button>
            </div>

            <div className="itemsGrid">
              {brandLocations.length ? (
                brandLocations.map((shop) => (
                  <LocationCard
                    key={shop.shop}
                    shopName={shop.shop}
                    shopImage={shop.shopImage}
                    openHours={shop.openHours}
                    address={shop.shop}
                    website={shop.website}
                    onSelectShop={() => selectShop(shop.shop)}
                  />
                ))
              ) : (
                <p className="noResults">No shops found for this brand.</p>
              )}
            </div>
          </>
        )}

        {selectedShop && (
          <div className="shopMenu">
            <div className="shopHeader">
              <h3>{selectedShop} Menu</h3>
              <button onClick={() => setSelectedShop(null)}>← Back</button>
            </div>

            <div className="categories">
              {categories.map((cat) => (
                <CategoryButton
                  key={cat}
                  category={cat}
                  isActive={shopCategory === cat}
                  onClick={() => setShopCategory(cat)}
                />
              ))}
            </div>

            <div className="itemsGrid">
              {shopItems.length ? (
                shopItems.map((item) => (
                  <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))
              ) : (
                <p className="noResults">
                  No items available in this category.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
