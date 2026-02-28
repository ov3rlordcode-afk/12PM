"use client";

import React from "react";
import BrandCard from "./BrandCard";
import LocationCard from "./LocationCard";
import ItemCard from "./ItemCard";
import CategoryButton from "./CategoryButton";
import { Item } from "./mockItems";

type Props = {
  brands: Record<string, Item[]>;
  brandLocations: Item[];
  shopItems: Item[];
  selectedBrand: string | null;
  selectedShop: string | null;
  shopCategory: string;
  categories: string[];
  onSelectBrand: (brand: string) => void;
  onSelectShop: (shop: string) => void;
  setShopCategory: (cat: string) => void;
};

export default function MainContent({
  brands,
  brandLocations,
  shopItems,
  selectedBrand,
  selectedShop,
  shopCategory,
  categories,
  onSelectBrand,
  onSelectShop,
  setShopCategory,
}: Props) {
  // No selection: show brands
  if (!selectedBrand && !selectedShop) {
    return (
      <div className="itemsGrid">
        {Object.entries(brands).length ? (
          Object.entries(brands).map(([brandName, items]) => (
            <BrandCard
              key={brandName}
              brandName={brandName}
              items={items}
              onViewBrand={() => onSelectBrand(brandName)}
            />
          ))
        ) : (
          <p className="noResults">No brands found.</p>
        )}
      </div>
    );
  }

  // Brand selected: show locations
  if (selectedBrand && !selectedShop) {
    return (
      <>
        <div className="brandHeader">
          <h2>{selectedBrand} Locations</h2>
          <button className="backBtn" onClick={() => onSelectBrand("")}>
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
                onSelectShop={() => onSelectShop(shop.shop)}
              />
            ))
          ) : (
            <p className="noResults">No shops found for this brand.</p>
          )}
        </div>
      </>
    );
  }

  // Shop selected: show menu
  if (selectedShop) {
    return (
      <div className="shopMenu">
        <div className="shopHeader">
          <h3>{selectedShop} Menu</h3>
          <button onClick={() => onSelectShop("")}>← Back</button>
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
              <ItemCard key={item.id} item={item} onAddToCart={() => {}} />
            ))
          ) : (
            <p className="noResults">No items available in this category.</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
