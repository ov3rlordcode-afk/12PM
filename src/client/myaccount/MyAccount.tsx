"use client";

import React, { useState } from "react";
import "./MyAccount.css";

export default function MyAccount() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+44 1234 567890",
    role: "Standard User",
    bio: "Active member since 2024.",
    avatar: "/default-avatar.png",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUser({ ...user, avatar: imageUrl });
  };

  return (
    <div className="accountContainer">
      <div className="accountCard">
        {/* LEFT SIDE - PROFILE IMAGE */}
        <div className="profileSection">
          <img src={user.avatar} alt="User Avatar" className="avatar" />
          {isEditing && (
            <label className="uploadBtn">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        {/* RIGHT SIDE - INFO */}
        <div className="infoSection">
          <div className="headerRow">
            <h2>My Account</h2>
            <button
              className="editBtn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="formGrid">
            <div className="formGroup">
              <label>Full Name</label>
              <input
                name="name"
                value={user.name}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={user.email}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>Phone</label>
              <input
                name="phone"
                value={user.phone}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="formGroup">
              <label>Role</label>
              <input value={user.role} disabled />
            </div>

            <div className="formGroup fullWidth">
              <label>Bio</label>
              <textarea
                name="bio"
                value={user.bio}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
