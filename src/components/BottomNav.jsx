import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

import hangerIcon from "../assets/closet/hanger.png";
import heartIcon from "../assets/closet/heart.png";
import messageIcon from "../assets/closet/message.png";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const onCloset = location.pathname === "/closet";
  const onSwipe = location.pathname === "/swipe";

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <button
        className="bottom-nav-btn"
        type="button"
        aria-label="Closet"
        onClick={() => (onCloset ? null : navigate("/closet"))}
      >
        <img className="bottom-nav-ico" src={hangerIcon} alt="" />
      </button>

      <button
        className="bottom-nav-btn"
        type="button"
        aria-label="Swipe"
        onClick={() => (onSwipe ? null : navigate("/swipe"))}
      >
        <img className="bottom-nav-ico bottom-nav-heart" src={heartIcon} alt="" />
      </button>

      <button
        className="bottom-nav-btn"
        type="button"
        aria-label="Messages"
        onClick={() => alert("Messages (coming soon)")}
      >
        <img className="bottom-nav-ico" src={messageIcon} alt="" />
      </button>
    </nav>
  );
}
