import React, { useMemo, useState } from "react";
import { Item } from "./mockItems";
import "./Cart.css";

type Props = {
  cart: Item[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  removeFromCart: (index: number) => void;
  incrementItem: (index: number) => void;
  decrementItem: (index: number) => void;
  placeOrder: (promoCode?: string) => void;
  totalPrice: number;
  orderSuccess: boolean;
  setOrderSuccess: (open: boolean) => void;
};

const DELIVERY_FEE_PER_SHOP = 2.99;
const USER_LOCATION = { lat: 55.9533, lng: -3.1883 };

const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Cart({
  cart,
  cartOpen,
  setCartOpen,
  removeFromCart,
  incrementItem,
  decrementItem,
  placeOrder,
  totalPrice,
  orderSuccess,
  setOrderSuccess,
}: Props) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // ====== Group cart items by shop AND stack identical items ======
  const groupedByShop = useMemo(() => {
    const grouped: Record<
      string,
      {
        items: { item: Item; quantity: number; indexes: number[] }[];
        address: string;
        distanceKm: number;
        subtotal: number;
        stats: { views: number; likes: number; favorites: number };
      }
    > = {};

    cart.forEach((item, index) => {
      if (!grouped[item.shop]) {
        const lat = item.lat ?? USER_LOCATION.lat + Math.random() * 0.05;
        const lng = item.lng ?? USER_LOCATION.lng + Math.random() * 0.05;

        const storedStats = JSON.parse(
          localStorage.getItem("shopStats") || "{}"
        );
        const stats = storedStats[item.shop] || {
          views: 0,
          likes: 0,
          favorites: 0,
        };

        grouped[item.shop] = {
          items: [],
          address: item.shop,
          distanceKm: getDistanceKm(
            USER_LOCATION.lat,
            USER_LOCATION.lng,
            lat,
            lng
          ),
          subtotal: 0,
          stats,
        };
      }

      // Stack same items by name + brand
      const existingItem = grouped[item.shop].items.find(
        (i) => i.item.name === item.name && i.item.brand === item.brand
      );

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
        existingItem.indexes.push(index);
      } else {
        grouped[item.shop].items.push({
          item,
          quantity: item.quantity || 1,
          indexes: [index],
        });
      }

      grouped[item.shop].subtotal += item.price * (item.quantity || 1);
    });

    return grouped;
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalDelivery =
    Object.keys(groupedByShop).length * DELIVERY_FEE_PER_SHOP;
  const grandTotal = totalPrice + totalDelivery - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(10);
      alert("Promo code applied! £10 discount applied to your order.");
    } else {
      alert("Invalid promo code.");
      setDiscount(0);
    }
  };

  const handlePlaceOrder = () => {
    placeOrder(promoCode);
  };

  return (
    <>
      <button className="cartIcon">{`🛒 ${totalItems}`}</button>

      <div className={`cartDrawer ${cartOpen ? "open" : ""}`}>
        <div className="cartHeader">
          <h3>Your Cart ({totalItems} items)</h3>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cartContent">
          {totalItems ? (
            Object.entries(groupedByShop).map(([shopName, data]) => (
              <div key={shopName} className="cartShopGroup">
                <div className="cartShopHeader">
                  <div>
                    <h4>{shopName}</h4>
                    <p className="cartShopAddress">
                      {data.address} • {data.distanceKm.toFixed(1)} km away
                    </p>
                    <small>
                      {data.items.length} items • ❤️ {data.stats.favorites} • 👍{" "}
                      {data.stats.likes} • 👁️ {data.stats.views}
                    </small>
                  </div>
                  <div className="shopTotals">
                    <span>Subtotal: £{data.subtotal.toFixed(2)}</span>
                    <span>Delivery: £{DELIVERY_FEE_PER_SHOP.toFixed(2)}</span>
                  </div>
                </div>

                {data.items.map(({ item, quantity, indexes }) => (
                  <div key={`${shopName}-${item.name}`} className="cartItem">
                    <div className="cartItemInfo">
                      <strong>{item.name}</strong>
                      <small>Brand: {item.brand}</small>
                      <div className="quantityControls">
                        <button onClick={() => decrementItem(indexes[0])}>
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => incrementItem(indexes[0])}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cartItemRight">
                      <span>£{(item.price * quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(indexes[0])}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="emptyCartMsg">Your cart is empty.</p>
          )}

          {/* ===== Promo Code Section ===== */}
          {totalItems > 0 && (
            <div className="paymentSection">
              <h4>Promo Code</h4>
              <div className="promoRow">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handleApplyPromo}>Apply</button>
              </div>
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <div className="cartFooter">
            <div className="cartSummaryRow">
              <span>Items Total</span>
              <span>£{totalPrice.toFixed(2)}</span>
            </div>
            <div className="cartSummaryRow">
              <span>Delivery Total</span>
              <span>£{totalDelivery.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="cartSummaryRow">
                <span>Discount</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="cartSummaryRow grandTotal">
              <strong>Grand Total</strong>
              <strong>£{grandTotal.toFixed(2)}</strong>
            </div>
            <button className="checkoutBtn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>

      {orderSuccess && (
        <div className="modalOverlay">
          <div className="successModal">
            <h2>🎉 Order Confirmed!</h2>
            <p>
              Your order containing {totalItems} item{totalItems > 1 ? "s" : ""}{" "}
              has been placed successfully.
            </p>
            <p>
              ✅ A driver will be notified shortly and will claim your order.
              You will receive a notification once your delivery is on the way.
            </p>
            <button onClick={() => setOrderSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
