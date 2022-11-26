import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhUUwW_Q4Pnp6ryGKbvjSSzPIZlkksrBU",
  authDomain: "house-marketplace-81f4e.firebaseapp.com",
  projectId: "house-marketplace-81f4e",
  storageBucket: "house-marketplace-81f4e.appspot.com",
  messagingSenderId: "243057141483",
  appId: "1:243057141483:web:237df72bd85d3fe20340ae",
  measurementId: "G-E49HPGMCBV",
};
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();
const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field = "type"
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object[field].toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
};
export const addListingDocument = async (data) => {
  const collectionRef = collection(db, "listings");
  return await addDoc(collectionRef, data);
};
export const updateUserProfile = async (user, update) => {
  await updateProfile(user, update.displayName);
  update?.email && (await updateEmail(user, update.email));
  update?.newPassword && (await updatePassword(user, update.newPassword));
  update?.phoneNumber && (await updatePassword(user, update.phoneNumber));
};
export const updateUserDocument = async (userId, update = {}) => {
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, update);
};
export const deleteListingDocument = async (listingId) => {
  const listingDocRef = doc(db, "listings", listingId);
  return await deleteDoc(listingDocRef);
};
export const getCategoryAndDocuments = async () => {
  const collectionRef = collection(db, "listings");
  const q = query(collectionRef);

  const querySnapShot = await getDocs(q);
  return querySnapShot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    data: docSnapshot.data(),
  }));
};
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log(`error creating the user ${error.message}`);
    }
  }

  return userSnapshot;
};
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};
export const signOutUser = async () => await signOut(auth);
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Google Authentication
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

export const sendPasswordReset = async (email) => {
  if (!email) return;

  return await sendPasswordResetEmail(auth, email);
};
