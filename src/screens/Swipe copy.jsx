import "./Swipe.css";
import logo from "../assets/logo.png";
import defaultProfile from "../assets/default-profile.png";
import undoIcon from "../assets/undo.png";
import rejectIcon from "../assets/reject.png";
import likeIcon from "../assets/like.png";
import superlikeIcon from "../assets/superlike.png";
import clothingItem from "../assets/denimJacket.png";
import jacketIcon from "../assets/jacket-icon.png";

export default function Swipe() {
  return (
    <div className="swipe-screen">
      <div className="swipe-header">
        <img 
          src={logo}
          alt="Campus Closet"
          className = "swipe-logo"
        />

        <button className="swipe-profile-btn" aria-label="Profile">
          <img
            src={defaultProfile}
            alt="Profile"
            className="swipe-profile-img"
          />
        </button>
      </div>
      <div className="swipe-card-container">
        <img className="swipe-card-image" src={clothingItem} />
          <div className="swipe-card-overlay">
            <div className="swipe-owner-name">Owner's Name</div>
            <div className="swipe-owner-school">Owner's School</div>
            <div className="swipe-actions">
              <button className="swipe-action-btn" aria-label="Undo">
                <img src={undoIcon} alt="Undo" />
              </button>

              <button className="swipe-action-btn" aria-label="Reject">
                <img src={rejectIcon} alt="Reject" />
              </button>

              <button className="swipe-action-btn" aria-label="Like">
                <img src={likeIcon} alt="Like" />
              </button>

              <button className="swipe-action-btn" aria-label="Super Like">
                <img src={superlikeIcon} alt="Super Like" />
              </button>
            </div>
        </div>
      </div>

      <div className="swipe-info-container">
        <div className="swipe-info-left">
          <div className="swipe-info-label">Description:</div>
          <div className="swipe-info-text">Vintage Vivienne Westwood Denim Jacket</div>

          <div className="swipe-info-label swipe-info-label--big">Condition:</div>
          <div className="swipe-info-text">Vintage, Good Condition</div>
        </div>

        <div className="swipe-info-right">
          <div className="swipe-info-iconbox" aria-hidden>
            <div className="swipe-info-iconbox" aria-hidden>
              <img className="swipe-info-jacket" src={jacketIcon} alt="" />
            </div>
          </div>
          <div className="swipe-info-price">$100</div>
        </div>
      </div>

    </div>
  );
}