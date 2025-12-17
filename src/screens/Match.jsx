import { useLocation, useNavigate } from "react-router-dom";
import "./Match.css";

import heartIcon from "../assets/closet/heart.png";
import fallbackPhoto from "../assets/match/item.png";

export default function Match() {
  const navigate = useNavigate();
  const location = useLocation();

  const matchedName = location.state?.matchedName || "someone";
  const matchPhoto = location.state?.matchPhoto || fallbackPhoto;

  return (
    <div className="match-screen">
      <button
        className="match-close"
        type="button"
        aria-label="Close"
        onClick={() => navigate("/swipe")}
      >
        ×
      </button>

      <div className="match-content">
        <div className="match-top-title">It’s a match!</div>

        <div className="match-photo-stack">
          <div className="match-photo-wrap">
            <img className="match-photo" src={matchPhoto} alt="Matched item" />
          </div>

          <img className="match-heart" src={heartIcon} alt="" aria-hidden />
        </div>

        <div className="match-main-title">You matched with {matchedName}!</div>

        <div className="match-subtitle">
          Now you will coordinate the details of your trade!
          <br />
          Get excited for your clothes!
        </div>
      </div>
    </div>
  );
}
