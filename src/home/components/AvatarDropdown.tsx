import React, { useState, useRef, useEffect } from "react";

type Props = {
  onLogout: () => void;
};

export default function AvatarDropdown({ onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [openDeliveries, setOpenDeliveries] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setOpenDeliveries(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="avatarWrapper" ref={ref}>
      <img
        src="/images/avatar.png"
        alt="Profile"
        className="avatar"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="avatarDropdown">
          <div className="dropdownItem">MyAccount</div>

          <div
            className="dropdownItem nestedItem"
            onClick={() => setOpenDeliveries(!openDeliveries)}
          >
            Deliveries {openDeliveries ? "▲" : "▼"}
          </div>
          {openDeliveries && (
            <div className="nestedDropdown">
              <div className="dropdownItem">My Orders</div>
              <div className="dropdownItem">Waiting For Driver</div>
              <div className="dropdownItem">Cancelled</div>
              <div className="dropdownItem">Refunded</div>
            </div>
          )}

          <div className="dropdownItem">Wallet</div>
          <div className="dropdownItem">Support</div>
          <div className="dropdownItem" onClick={onLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}
