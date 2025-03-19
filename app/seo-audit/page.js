"use client";
import React, { useState } from "react";
import Container from "@/components/container";
import s from "./style.module.css";
import Sidebar from "@/components/sidebar";
function Page() {
  const [focusedCardId, setFocusedCardId] = useState(null);
  return (
    <Container>
      <div
        className={`${s.overlay} ${focusedCardId ? s.active : ""}`}
        onClick={() => setFocusedCardId(null)}
      ></div>
      <div className={s.dashboard}>
        <div className="outline outline-red-500">
          <Sidebar setFocusedCardId={setFocusedCardId} />
        </div>
        <div className="outline outline-blue-400">
          <div className="flex flex-col md:flex-row flex-wrap gap-2.5">
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>

            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div
              className={`rounded-4xl bg-white max-w-full h-40 ${s.card} ${
                focusedCardId === "title" ? s.focused : ""
              }`}
              id="title"
            >
              {" "}
              title
            </div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>

            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div
              className={`rounded-4xl bg-white max-w-full h-40 ${s.card} ${
                focusedCardId === "description" ? s.focused : ""
              }`}
              id="description"
            >
              {" "}
              description
            </div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>

            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div className={s.card}> lorem</div>
            <div
              className={`rounded-4xl bg-white max-w-full h-40 ${s.card} ${
                focusedCardId === "keywords" ? s.focused : ""
              }`}
              id="keywords"
            >
              {" "}
              keywords
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Page;
