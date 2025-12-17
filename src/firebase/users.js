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
} from "firebase/firestore";

/**
 * Demo login:
 * - If users/{usernameLower} exists -> return that user (log in)
 * - If not -> create it, then return it (sign up)
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
      return {
        userId: usernameLower,
        username: data?.username || username,
      };
    }

    tx.set(userRef, {
      username,
      usernameLower,
      createdAt: serverTimestamp(),
    });

    return { userId: usernameLower, username };
  });
}

/** Add a clothing item under users/{userId}/clothing/{itemId} */
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
