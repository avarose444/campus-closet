import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Closet.css";

import editIcon from "../assets/closet/edit.png";
import tagIcon from "../assets/closet/tag.png";
import profileIcon from "../assets/closet/profile.png";
import hangerIcon from "../assets/closet/hanger.png";
import heartIcon from "../assets/closet/heart.png";
import messageIcon from "../assets/closet/message.png";

import bagImg from "../assets/closet/bag.png";
import teeImg from "../assets/closet/tee.png";
import hoodieImg from "../assets/closet/hoodie.png";
import bootsImg from "../assets/closet/boots.png";

export default function Closet() {
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { id: "bag", src: bagImg, alt: "Bag" },
      { id: "tee", src: teeImg, alt: "Tee" },
      { id: "hoodie", src: hoodieImg, alt: "Hoodie" },
      { id: "boots", src: bootsImg, alt: "Boots" },
      { id: "empty-1", src: null, alt: "" },
      { id: "empty-2", src: null, alt: "" },
    ],
    []
  );

  return (
    <div className="closet-screen">
      {/* top left actions */}
      <div className="closet-top-links">
        <button
          className="closet-links"
          type="button"
          onClick={() => alert("Edit Profile (coming soon)")}
        >
          <img className="profile-edit" src={editIcon} alt="" />
          Edit Profile
        </button>

        <button
          className="closet-links"
          type="button"
          onClick={() => alert("Edit Items (coming soon)")}
        >
          <img className="closet-edit" src={tagIcon} alt="" />
          Edit Items
        </button>
      </div>

      {/* profile */}
      <div className="closet-profile-wrap">
        <img
          className="closet-profile-big"
          src={profileIcon}
          alt="Profile"
          onClick={() => alert("Profile settings (coming soon)")}
        />
      </div>

      <h2 className="closet-title">Your Closet</h2>
      <div className="closet-divider" aria-hidden />

      {/* grid */}
      <div className="closet-grid">
        {items.map((it) => (
          <div
            key={it.id}
            className="closet-tile"
            onClick={() =>
              it.src
                ? alert(`Item detail: ${it.alt} (coming soon)`)
                : alert("Add new item (coming soon)")
            }
            style={{ cursor: "pointer" }}
          >
            {it.src ? (
              <img className="closet-tile-img" src={it.src} alt={it.alt} />
            ) : (
              <div className="closet-tile-placeholder" />
            )}
          </div>
        ))}
      </div>

      {/* bottom nav */}
      <nav className="closet-nav" aria-label="Bottom navigation">
        <button
          className="closet-nav-btn"
          type="button"
          aria-label="Closet"
          onClick={() => alert("You are already in Closet")}
        >
          <img className="closet-nav-ico" src={hangerIcon} alt="" />
        </button>

        <button
          className="closet-nav-btn"
          type="button"
          aria-label="Swipe"
          onClick={() => {
            alert("Go to Swipe");
            navigate("/swipe");
          }}
        >
          <img className="closet-nav-ico closet-nav-heart" src={heartIcon} alt="" />
        </button>

        <button
          className="closet-nav-btn"
          type="button"
          aria-label="Messages"
          onClick={() => alert("Messages (coming soon)")}
        >
          <img className="closet-nav-ico" src={messageIcon} alt="" />
        </button>
      </nav>
    </div>
  );
}
