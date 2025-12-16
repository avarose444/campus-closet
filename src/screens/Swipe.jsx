import { useMemo, useRef, useState } from "react";
import "./Swipe.css";

import logo from "../assets/logo.png";
import defaultProfile from "../assets/default-profile.png";
import undoIcon from "../assets/undo.png";
import rejectIcon from "../assets/reject.png";
import likeIcon from "../assets/like.png";
import superlikeIcon from "../assets/superlike.png";
import clothingItem from "../assets/denimJacket.png";
import jacketIcon from "../assets/jacket-icon.png";
import { useNavigate } from "react-router-dom";


function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Swipe() {
  const navigate = useNavigate();

  const owners = useMemo(() => [
    {
      ownerId: "violet",
      ownerName: "Violet",
      ownerSchool: "Columbia SEAS",
      closet: [
        {
          itemId: "violet-1",
          image: clothingItem,
          description: "Vintage Vivienne Westwood Denim Jacket",
          condition: "Vintage, Good Condition",
          price: 100,
        },
        {
          itemId: "violet-2",
          image: clothingItem,
          description: "Item 2",
          condition: "Like New",
          price: 85,
        },
      ],
    },
    {
      ownerId: "person2",
      ownerName: "Person 2",
      ownerSchool: "Columbia College",
      closet: [
        {
          itemId: "person2-1",
          image: clothingItem,
          description: "item 1",
          condition: "Good",
          price: 25,
        },
        {
          itemId: "person2-2",
          image: clothingItem,
          description: "item 2",
          condition: "Good",
          price: 50,
        },
      ],
    },
  ], []);


  const [ownerIndex, setOwnerIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);

  const [likes, setLikes] = useState(() => load("cc_likes", []));
  const [rejects, setRejects] = useState(() => load("cc_rejects", []));

  const [lastAction, setLastAction] = useState(null);

  const owner = owners[ownerIndex];
  const item = owner?.closet?.[itemIndex];

  const nextItemInCloset = () => {
    if (!owner) return;
    setItemIndex((i) => (i + 1) % owner.closet.length);
  };

  const nextOwner = () => {
    setOwnerIndex((o) => Math.min(o + 1, owners.length - 1));
    setItemIndex(0);
  };

  const onReject = () => {
    if (!owner || !item) return;

    const payload = {
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      ownerSchool: owner.ownerSchool,
      ...item,
    };

    const updated = [...rejects, payload];
    setRejects(updated);
    save("cc_rejects", updated);

    setLastAction({
      type: "reject",
      ownerIndexBefore: ownerIndex,
      itemIndexBefore: itemIndex,
    });

    nextOwner();
  };

  const onLike = () => {
    if (!owner || !item) return;

    const payload = {
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      ownerSchool: owner.ownerSchool,
      ...item,
    };

    const updated = [...likes, payload];
    setLikes(updated);
    save("cc_likes", updated);

    setLastAction({
      type: "like",
      ownerIndexBefore: ownerIndex,
      itemIndexBefore: itemIndex,
    });

    nextOwner();
  };

  const onSuperLike = () => onLike();

  const onUndo = () => {
    if (!lastAction || lastAction.type !== "reject") return;

    setOwnerIndex(lastAction.ownerIndexBefore);
    setItemIndex(lastAction.itemIndexBefore);
    setLastAction(null);

    setRejects((prev) => {
      const updated = prev.slice(0, -1);
      save("cc_rejects", updated);
      return updated;
    });
  };

  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const didSwipe = useRef(false);

  const SWIPE_THRESHOLD = 80;
  const OFFSCREEN = 520;

  const setCardTransform = (dx) => {
    if (!cardRef.current) return;
    const rot = Math.max(-12, Math.min(12, dx / 20));
    cardRef.current.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = "transform 160ms ease";
    cardRef.current.style.transform = "translateX(0) rotate(0)";
    setTimeout(() => {
      if (cardRef.current) cardRef.current.style.transition = "";
    }, 170);
  };

  const flyOut = (dir) => {
    if (!cardRef.current) return;

    didSwipe.current = true;

    cardRef.current.style.transition = "transform 220ms ease";
    cardRef.current.style.transform = `translateX(${dir * OFFSCREEN}px) rotate(${dir * 12}deg)`;

    setTimeout(() => {
      if (dir > 0) onLike();
      else onReject();

      if (cardRef.current) {
        cardRef.current.style.transition = "";
        cardRef.current.style.transform = "translateX(0) rotate(0)";
      }
    }, 220);
  };

  const onSwipeStart = (x, y) => {
    dragging.current = true;
    didSwipe.current = false;
    startX.current = x;
    startY.current = y;
  };

  const onSwipeMove = (x, y) => {
    if (!dragging.current) return;

    const dx = x - startX.current;
    const dy = y - startY.current;

    if (Math.abs(dy) > Math.abs(dx)) return;

    setCardTransform(dx);
  };

  const onSwipeEnd = (x, y) => {
    if (!dragging.current) return;
    dragging.current = false;

    const dx = x - startX.current;
    const dy = y - startY.current;

    if (Math.abs(dy) > Math.abs(dx)) {
      resetCard();
      return;
    }

    if (Math.abs(dx) >= SWIPE_THRESHOLD) flyOut(dx > 0 ? 1 : -1);
    else resetCard();
  };

  if (!item || !owner) {
    return (
      <div className="swipe-screen">
        <div className="swipe-header">
          <img src={logo} alt="Campus Closet" className="swipe-logo" />
          <button
            className="swipe-profile-btn"
            onClick={() => navigate("/closet")}
          >
            <img src={defaultProfile} alt="Profile" />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          You’re out of items 🎉
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Likes: {likes.length} • Rejects: {rejects.length}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="swipe-screen">
      <div className="swipe-header">
        <img src={logo} alt="Campus Closet" className="swipe-logo" />

      <button
        className="swipe-profile-btn"
        aria-label="Profile"
        onClick={() => navigate("/closet")}
      >
        <img src={defaultProfile} alt="Profile" className="swipe-profile-img" />
      </button>
      </div>

      <div
        className="swipe-card-container"
        ref={cardRef}
        onMouseDown={(e) => onSwipeStart(e.clientX, e.clientY)}
        onMouseMove={(e) => onSwipeMove(e.clientX, e.clientY)}
        onMouseUp={(e) => onSwipeEnd(e.clientX, e.clientY)}
        onMouseLeave={(e) => dragging.current && onSwipeEnd(e.clientX, e.clientY)}
        onTouchStart={(e) => onSwipeStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onSwipeMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          onSwipeEnd(t.clientX, t.clientY);
        }}
        role="application"
        aria-label="Swipe card"
      >
        <img
          className="swipe-card-image"
          src={item.image}
          alt="Clothing item"
          onClick={() => {
            if (didSwipe.current) return;
            nextItemInCloset();
          }}
        />

        <div className="swipe-card-overlay">
          <div className="swipe-owner-name">{owner.ownerName}</div>
          <div className="swipe-owner-school">{owner.ownerSchool}</div>

          <div className="swipe-actions">
            <button
              className="swipe-action-btn"
              aria-label="Undo"
              onClick={onUndo}
              disabled={!lastAction || lastAction.type !== "reject"}
              title="Undo (only after reject)"
            >
              <img src={undoIcon} alt="Undo" />
            </button>

            <button className="swipe-action-btn" aria-label="Reject" onClick={onReject}>
              <img src={rejectIcon} alt="Reject" />
            </button>

            <button className="swipe-action-btn" aria-label="Like" onClick={onLike}>
              <img src={likeIcon} alt="Like" />
            </button>

            <button className="swipe-action-btn" aria-label="Super Like" onClick={onSuperLike}>
              <img src={superlikeIcon} alt="Super Like" />
            </button>
          </div>
        </div>
      </div>

      <div className="swipe-info-container">
        <div className="swipe-info-left">
          <div className="swipe-info-label">Description:</div>
          <div className="swipe-info-text">{item.description}</div>

          <div className="swipe-info-label swipe-info-label--big">Condition:</div>
          <div className="swipe-info-text">{item.condition}</div>
        </div>

        <div className="swipe-info-right">
          <div className="swipe-info-iconbox" aria-hidden>
            <img className="swipe-info-jacket" src={jacketIcon} alt="" />
          </div>
          <div className="swipe-info-price">${item.price}</div>
        </div>
      </div>
    </div>
  );
}
