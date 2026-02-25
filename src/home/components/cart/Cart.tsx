import React, { useMemo } from "react";
import { Item } from "../../mockItems";

type Props = {
  cart: Item[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  removeFromCart: (index: number) => void;
  placeOrder: () => void;
  totalPrice: number;
  orderSuccess: boolean;
  setOrderSuccess: (open: boolean) => void;
};

const DELIVERY_FEE_PER_SHOP = 2.99;

export default function Cart({
  cart,
  cartOpen,
  setCartOpen,
  removeFromCart,
  placeOrder,
  totalPrice,
  orderSuccess,
  setOrderSuccess,
}: Props) {
  /* ================= GROUP ITEMS BY SHOP ================= */

  const groupedByShop = useMemo(() => {
    const grouped: Record<
      string,
      {
        items: { item: Item; index: number }[];
        address: string;
      }
    > = {};

    cart.forEach((item, index) => {
      if (!grouped[item.shop]) {
        grouped[item.shop] = {
          items: [],
          address: item.address,
        };
      }

      grouped[item.shop].items.push({ item, index });
    });

    return grouped;
  }, [cart]);

  const totalItems = cart.length;

  const totalDelivery = Object.keys(groupedByShop).length
    ? Object.keys(groupedByShop).length * DELIVERY_FEE_PER_SHOP
    : 0;

  const grandTotal = totalPrice + totalDelivery;

  return (
    <>
      {/* ================= CART BUTTON ================= */}
      <button className="cartIcon" onClick={() => setCartOpen(true)}>
        🛒 {totalItems}
      </button>

      {/* ================= CART DRAWER ================= */}
      <div className={`cartDrawer ${cartOpen ? "open" : ""}`}>
        <div className="cartHeader">
          <h3>Your Cart ({totalItems} items)</h3>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cartContent">
          {totalItems ? (
            Object.entries(groupedByShop).map(([shopName, data]) => {
              const shopItemCount = data.items.length;
              const shopSubtotal = data.items.reduce(
                (sum, entry) => sum + entry.item.price,
                0
              );

              return (
                <div key={shopName} className="cartShopGroup">
                  {/* SHOP HEADER */}
                  <div className="cartShopHeader">
                    <div>
                      <h4>{shopName}</h4>
                      <p className="cartShopAddress">{data.address}</p>
                      <small>{shopItemCount} items</small>
                    </div>

                    <div className="shopTotals">
                      <span>Subtotal: £{shopSubtotal.toFixed(2)}</span>
                      <span>Delivery: £{DELIVERY_FEE_PER_SHOP.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* ITEMS */}
                  {data.items.map(({ item, index }) => (
                    <div key={index} className="cartItem">
                      <div className="cartItemInfo">
                        <strong>{item.name}</strong>
                        <small>Brand: {item.brand}</small>
                      </div>

                      <div className="cartItemRight">
                        <span>£{item.price.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(index)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* ================= FOOTER TOTALS ================= */}
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

            <div className="cartSummaryRow grandTotal">
              <strong>Grand Total</strong>
              <strong>£{grandTotal.toFixed(2)}</strong>
            </div>

            <button className="checkoutBtn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {orderSuccess && (
        <div className="modalOverlay">
          <div className="successModal">
            <h2>🎉 Order Confirmed!</h2>
            <p>
              Your order containing {totalItems} items has been placed
              successfully.
            </p>
            <button onClick={() => setOrderSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
