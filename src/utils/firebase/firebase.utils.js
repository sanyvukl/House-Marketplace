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
  limit,
  orderBy,
  where,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";

import { v4 as uuidv4 } from "uuid";

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

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export const getLandlordInfo = async (landlordId) => {
  const docRef = doc(db, "users", landlordId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    toast.error("Could not get landlord data");
  }
};
export const getStoreImagesUrl = async (image) => {
  return new Promise((resolve, reject) => {
    const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
    const storageRef = ref(storage, "images/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
export const getListing = async (listingId) => {
  const docRef = doc(db, "listings", listingId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
};
export const getUserListings = async (userId) => {
  const collectionRef = collection(db, "listings");
  const q = query(
    collectionRef,
    where("userRef", "==", userId),
    orderBy("timestamp", "desc")
  );

  const querySnap = await getDocs(q);
  return querySnap.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    data: docSnapshot.data(),
  }));
};
// export const deleteStoreImages = async () => {
//   const fileName = `${10}`;
//   const storageRef = ref(storage, "images/" + fileName);
//   deleteObject();
// };
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
export const getListingsForExplore = async () => {
  const collectionRef = collection(db, "listings");
  const q = query(collectionRef, limit(5));

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
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
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
