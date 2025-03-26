"use client";
import React from "react";
import s from "./seoCard.module.css"; // Create appropriate styles here

const SeoCard = ({ id, title, status, children, onFocus }) => {
  return (
    <div
      id={id}
      className={`${s.card} ${status ? s[status] : ""}`}
      onClick={() => onFocus && onFocus(id)}
    >
      <div className={s.cardHeader}>
        <h3>{title}</h3>
        {status && <span className={s.statusIcon}>{status}</span>}
      </div>
      <div className={s.cardContent}>{children}</div>
    </div>
  );
};

export default SeoCard;
