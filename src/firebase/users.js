import { db } from "./db";
import {
  doc,
  runTransaction,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  setDoc,
  getDoc,
} from "firebase/firestore";

/**
 * Demo login:
 * If users/{usernameLower} exists -> log in
 * else -> create -> log in
 */
export async function getOrCreateUser(usernameRaw) {
  const username = (usernameRaw ?? "").trim();
  const usernameLower = username.toLowerCase();

  if (!username) throw new Error("Please enter a username.");
  if (usernameLower.length < 3) throw new Error("Username must be at least 3 characters.");

  const userRef = doc(db, "users", usernameLower);

  return await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);

    if (snap.exists()) {
      const data = snap.data();
      return { userId: usernameLower, username: data?.username || username };
    }

    tx.set(userRef, {
      username,
      usernameLower,
      createdAt: serverTimestamp(),
    });

    return { userId: usernameLower, username };
  });
}

/** Add a clothing item under users/{userId}/clothing */
export async function addClothingItem(userId, itemData) {
  if (!userId) throw new Error("Missing userId.");

  const clothingRef = collection(db, "users", userId, "clothing");
  const docRef = await addDoc(clothingRef, {
    ...itemData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/** Fetch clothing items for a user */
export async function getClothingItems(userId) {
  if (!userId) throw new Error("Missing userId.");

  const clothingRef = collection(db, "users", userId, "clothing");
  const q = query(clothingRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Swipe feed
 * Returns profiles with closets
 */
export async function getSwipeOwners(currentUserId) {
  const usersSnap = await getDocs(collection(db, "users"));
  const results = [];

  for (const userDoc of usersSnap.docs) {
    const ownerId = userDoc.id;
    if (currentUserId && ownerId === currentUserId) continue;

    const userData = userDoc.data() || {};
    const ownerName = userData.username || ownerId;
    const ownerSchool = "Student at Columbia University";

    const clothingRef = collection(db, "users", ownerId, "clothing");
    const clothingQ = query(clothingRef, orderBy("createdAt", "desc"));
    const clothingSnap = await getDocs(clothingQ);

    const closet = clothingSnap.docs.map((d) => {
      const data = d.data() || {};
      return {
        itemId: d.id,
        image: data.imageDataUrl,
        description: data.description || "",
        condition: data.condition || "",
        price: data.price ?? "",
      };
    });

    if (closet.length === 0) continue;

    results.push({
      ownerId,
      ownerName,
      ownerSchool,
      closet,
    });
  }

  return results;
}

/** Like a user profile (profile-level like) */
export async function likeUserProfile(currentUserId, targetUserId, photoDataUrl) {
  if (!currentUserId || !targetUserId) throw new Error("Missing user ids.");

  const likeRef = doc(db, "users", currentUserId, "likes", targetUserId);

  await setDoc(likeRef, {
    createdAt: serverTimestamp(),
    matchPhoto: photoDataUrl || null,
  });
}

/** Check if two users mutually liked each other */
export async function isMutualLike(currentUserId, targetUserId) {
  const reverseLikeRef = doc(db, "users", targetUserId, "likes", currentUserId);
  const snap = await getDoc(reverseLikeRef);
  return snap.exists();
}
