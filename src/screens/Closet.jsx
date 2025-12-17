import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Closet.css";

import editIcon from "../assets/closet/edit.png";
import tagIcon from "../assets/closet/tag.png";
import profileIcon from "../assets/closet/profile.png";
import hangerIcon from "../assets/closet/hanger.png";
import heartIcon from "../assets/closet/heart.png";
import messageIcon from "../assets/closet/message.png";

import addBtnIcon from "../assets/AddButton.png";

import { useUserSession } from "../auth/UserSession";
import { addClothingItem, getClothingItems } from "../firebase/users";

/** Convert a File to an HTMLImageElement */
function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/**
 * Compress/resize an image file and return a Data URL (JPEG).
 * This is for demo use so we can store the image string in Firestore.
 */
async function fileToCompressedDataUrl(file, maxSize = 512, quality = 0.75) {
  const img = await fileToImage(file);

  let { width, height } = img;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

export default function Closet() {
  const navigate = useNavigate();
  const { user, logout } = useUserSession();
  const userId = user?.userId;

  const [items, setItems] = useState([]); // Firestore clothing items
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    description: "",
    condition: "",
    price: "",
    size: "",
    photoFile: null,
  });
  const [submitState, setSubmitState] = useState({ loading: false, error: "" });

  // Load clothing items for the logged-in user
  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!userId) return;

      setLoading(true);
      setLoadError("");

      try {
        const clothing = await getClothingItems(userId);
        if (!isMounted) return;

        setItems(clothing);
      } catch (e) {
        if (!isMounted) return;
        setLoadError(e?.message || "Failed to load closet items.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const hasItems = items.length > 0;

  function openModal() {
    setSubmitState({ loading: false, error: "" });
    setForm({
      description: "",
      condition: "",
      price: "",
      size: "",
      photoFile: null,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    if (submitState.loading) return;
    setIsModalOpen(false);
  }

  function onChangeField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitState({ loading: true, error: "" });

    try {
      if (!userId) throw new Error("Missing logged in user.");

      const description = form.description.trim();
      const condition = form.condition.trim();
      const size = form.size.trim();
      const priceNum = Number.parseFloat(form.price);

      if (!description || !condition || !size || !form.photoFile) {
        throw new Error("Please fill out all fields and upload a photo.");
      }
      if (Number.isNaN(priceNum) || priceNum < 0) {
        throw new Error("Please enter a valid price.");
      }

      // Option 1: store image as a compressed Data URL in Firestore (no Storage required)
      const imageDataUrl = await fileToCompressedDataUrl(form.photoFile, 512, 0.75);

      const newItemData = {
        description,
        condition,
        price: priceNum,
        size,
        imageDataUrl, // <-- store this instead of an imageUrl
      };

      const newId = await addClothingItem(userId, newItemData);

      // Update UI immediately
      setItems((prev) => [{ id: newId, ...newItemData }, ...prev]);

      // Close modal
      setIsModalOpen(false);
      setSubmitState({ loading: false, error: "" });
    } catch (err) {
      setSubmitState({ loading: false, error: err?.message || "Failed to add item." });
    }
  }

  return (
    <div className="closet-screen">
      {/* top left actions */}
      {/* top actions */}
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

  <button className="closet-links" type="button" onClick={openModal}>
    <img className="closet-edit" src={addBtnIcon} alt="" />
    Add Items
  </button>
</div>

{/* logout (top right) */}
<div className="closet-top-right">
  <button
    className="closet-links"
    type="button"
    onClick={() => {
      logout();
      navigate("/login", { replace: true });
    }}
  >
    Log Out
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

      {/* content */}
      <div className="closet-content">
        {loading ? (
          <div className="closet-empty">Loading...</div>
        ) : loadError ? (
          <div className="closet-empty" style={{ color: "crimson" }}>
            {loadError}
          </div>
        ) : !hasItems ? (
          <div className="closet-empty">Your closet is empty.</div>
        ) : (
          <div className="closet-grid">
            {items.map((it) => (
              <div
                key={it.id}
                className="closet-tile"
                onClick={() => alert("Item detail (coming soon)")}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="closet-tile-img"
                  src={it.imageDataUrl}
                  alt={it.description || "Clothing item"}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="closet-modal-overlay" role="dialog" aria-modal="true">
          <div className="closet-modal">
            <button className="closet-modal-x" type="button" onClick={closeModal} aria-label="Close">
              ×
            </button>

            <h3 className="closet-modal-title">Add Item</h3>

            <form onSubmit={handleSubmit} className="closet-modal-form">
              <label className="closet-modal-label">
                Description
                <input
                  className="closet-modal-input"
                  value={form.description}
                  onChange={(e) => onChangeField("description", e.target.value)}
                  disabled={submitState.loading}
                />
              </label>

              <label className="closet-modal-label">
                Condition
                <input
                  className="closet-modal-input"
                  value={form.condition}
                  onChange={(e) => onChangeField("condition", e.target.value)}
                  disabled={submitState.loading}
                />
              </label>

              <label className="closet-modal-label">
                Price
                <input
                  className="closet-modal-input"
                  value={form.price}
                  onChange={(e) => onChangeField("price", e.target.value)}
                  disabled={submitState.loading}
                  inputMode="decimal"
                  placeholder="e.g. 25"
                />
              </label>

              <label className="closet-modal-label">
                Size
                <input
                  className="closet-modal-input"
                  value={form.size}
                  onChange={(e) => onChangeField("size", e.target.value)}
                  disabled={submitState.loading}
                />
              </label>

              <label className="closet-modal-label">
                Photo
                <input
                  className="closet-modal-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChangeField("photoFile", e.target.files?.[0] || null)}
                  disabled={submitState.loading}
                />
              </label>

              {submitState.error ? <div className="closet-modal-error">{submitState.error}</div> : null}

              <button className="closet-modal-submit" type="submit" disabled={submitState.loading}>
                {submitState.loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

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
