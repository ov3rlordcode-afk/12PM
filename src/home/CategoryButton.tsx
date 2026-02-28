import React from "react";

type Props = {
  category: string;
  isActive: boolean;
  onClick: () => void;
};

export default function CategoryButton({ category, isActive, onClick }: Props) {
  return (
    <button
      className={`categoryBtn ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {category}
    </button>
  );
}
