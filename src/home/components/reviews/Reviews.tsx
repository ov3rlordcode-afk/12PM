import React, { useState } from "react";
import "./Reviews.css";

type Review = {
  id: number;
  name: string;
  rating: number;
  text: string;
};

type Props = {
  shopName: string;
  onClose: () => void;
};

export default function Reviews({ shopName, onClose }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      text,
    };

    setReviews([newReview, ...reviews]);
    setName("");
    setRating(5);
    setText("");
  };

  return (
    <div className="reviewsOverlay">
      <div className="reviewsModal">
        <div className="reviewsHeader">
          <h2>Reviews for {shopName}</h2>
          <button className="closeBtn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* REVIEW FORM */}
        <form className="reviewForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit" className="submitBtn">
            Submit Review
          </button>
        </form>

        {/* LIST OF REVIEWS */}
        <div className="reviewsList">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="reviewItem">
                <div className="reviewHeader">
                  <strong>{rev.name}</strong>
                  <span className="reviewRating">
                    {"★".repeat(rev.rating)}{" "}
                    {"☆".repeat(5 - rev.rating)}
                  </span>
                </div>
                <p>{rev.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}